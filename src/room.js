/**
 * RelayRoom —— 承载 EasyTier WebSocket 中继的 Durable Object。
 *
 * 核心设计（针对旧实现的修复）：
 * 1. WebSocket Hibernation API：acceptWebSocket + alarm 清扫，全程无 setInterval。
 *    DO 可在无事件时休眠，时长计费趋近于零；这是 teleseon/icesoulhanxi 未做到的
 *    （teleseon 用 setInterval 心跳导致 DO 永不休眠）。
 * 2. 幽灵节点三重防线：
 *    a) 握手超时：连接后 HANDSHAKE_TIMEOUT_MS 内未完成握手 -> 关闭；
 *    b) 空闲超时：PEER_IDLE_TIMEOUT_MS（> 客户端最大 ping 间隔 32s）无任何消息 -> 关闭；
 *    c) 主动探活：空闲超过 SERVER_PING_IDLE_MS 时服务端发 Ping，半开连接会因
 *       写失败触发 close 事件而被立即清理（比等超时快得多）。
 * 3. 同 peerId 重连：旧连接被新连接顶替时立即关闭旧连接（4000）。
 * 4. lastSeen 双通道：运行时 auto-timestamp（若可用）+ 节流 attachment 同步兜底，
 *    休眠唤醒后仍能正确判定空闲。
 * 5. 房间状态（peer 信息、摘要注册表、服务端身份）持久化到 DO storage，
 *    休眠/重启后路由信息立即恢复。
 */
import {
  PacketType, HeaderFlags, MAX_FORWARD_COUNTER, MAGIC, VERSION,
  SERVER_FEATURES, LIVENESS_ECHO_FEATURE,
  ROUTE_INFO_TTL_MS, ROUTE_INFO_UNREACHABLE_MS, GROUP_AUTO_DELETE_MS,
  MAX_SYNC_ITEMS, MAX_ROUTE_INFO_BYTES, MAX_ROUTES_PER_GROUP, MAX_DIRECT_PEERS_REPORT,
  FULL_RESYNC_COOLDOWN_MS, MAX_NETWORK_NAME_BYTES, WS_CLOSE, KV_WRITE_DAILY_BUDGET,
  RPC_MERGER_TTL_MS,
  SHED_ACTIVATE_RATIO, SHED_RESUME_RATIO, SHED_CHECK_MS,
  AUTO_BLACKLIST_KILLS, AUTO_BLACKLIST_WINDOW_MS, AUTO_BLACKLIST_WINDOW_MAX_IPS,
  ROOM_HEADER_INTERNAL,
} from './constants.js';
import { parseHeader, buildPacket, bumpForward, payloadOf } from './packet.js';
import { PeerManager, resolveGroupKey } from './peer_manager.js';
import { AuditStore, utcDayStamp } from './audit.js';
import {
  protoTypes, buildRpcRequest, encodeRoutePush, handleRpcRequest, handleRpcResponse,
} from './rpc.js';
import { toU64Long, randomU64Long } from './proto.js';
import { bytesToHex, randomBytes } from './siphash.js';

const WS_OPEN = 1;
const STATE_KEY = 'room_state';
/** v1.7 D5：kill 日计数持久化键（UTC 日重置，挂 flush/alarm 节奏） */
const KILLS_KEY = 'kills_today';
/** v1.7 A5：无凭证自计数持久化键（UTC 日重置；有凭证部署不使用但仍持久化，开销可忽略） */
const SELF_COUNT_KEY = 'self_count';
const BOOT_KEY = 'room_boot';
const ATTACH_SYNC_INTERVAL_MS = 5000;
const RETRY_AFTER_SEC = '60'; // 403/429 响应建议客户端退避时长（秒）

// 账号级真实额度（v1.6.0 A6）：GraphQL Analytics API 查询结果的 DO storage 缓存
const QUOTA_CACHE_KEY = 'quota_cache';
const QUOTA_CACHE_MS = 5 * 60_000;   // 成功结果缓存 5 分钟（防管理页 30s 自动刷新打爆 API）
const QUOTA_FAIL_CACHE_MS = 60_000;  // 失败结果缓存 1 分钟（避免高频重试）
const FREE_DAILY_REQUESTS = 100_000; // Workers 免费计划每日请求额度

// Analytics Engine 趋势（v1.6.0 A5/D2）：打点与查询结果的缓存
const AE_DOT_INTERVAL_MS = 60_000;   // 每 ≥60s 一个数据点（空闲退避时随 alarm 变稀疏）
const TRENDS_CACHE_MS = 5 * 60_000;  // AE SQL 查询结果缓存
const TRENDS_BUCKET_SEC = { '24h': 900, '7d': 3600 }; // 24h→15min 桶（96 点）、7d→1h 桶（168 点）

function str(env, key, def) {
  const v = env && env[key];
  return v === undefined || v === null || v === '' ? def : String(v);
}

/**
 * 房间 id 解析（v1.7 A3 自 index.js 收口到本模块：审计 KV 键房间段与 DO 命名
 * 必须同源——单一事实源在 room.js，Worker 入口 import 复用，零循环依赖）。
 * 优先级：Header > Query 参数 > env 默认值。
 * v1.7 复核修复：统一 trim + 长度上限（KV 键 512 字节约束）——空/超长/纯空白
 * 值回落默认，避免「Worker 用 ' ' 建 DO、审计段却归一成 global」的错位。
 */
export function resolveRoomId(request, url, env) {
  const pick = (v) => {
    const s = String(v ?? '').trim();
    return s && s.length <= 128 ? s : '';
  };
  const headerName = str(env, 'ROOM_HEADER', '');
  if (headerName) {
    const v = pick(request.headers.get(headerName));
    if (v) return v;
  }
  const queryName = str(env, 'ROOM_QUERY', '');
  if (queryName) {
    const v = pick(url.searchParams.get(queryName));
    if (v) return v;
  }
  return pick(str(env, 'ROOM_ID', 'global')) || 'global';
}

function bool(env, key, def) {
  const v = str(env, key, def ? '1' : '0');
  return v === '1' || v === 'true' || v === 'yes';
}

function int(env, key, def) {
  const v = Number(str(env, key, String(def)));
  return Number.isFinite(v) && v > 0 ? v : def;
}

/** 同 int，但允许 0（用于"0=禁用"类配置） */
function intOrZero(env, key, def) {
  const raw = str(env, key, '');
  if (raw === '') return def;
  const v = Number(raw);
  return Number.isFinite(v) && v >= 0 ? v : def;
}

export function buildConfig(env) {
  // 启动期可感知的问题（如配置项解析失败）：由 RelayRoom 构造器在 logger 就绪后逐条 warn
  const warnings = [];
  let networkSecrets = null;
  const raw = str(env, 'NETWORK_SECRETS', '');
  if (raw) {
    try {
      networkSecrets = JSON.parse(raw);
      if (!networkSecrets || typeof networkSecrets !== 'object' || Array.isArray(networkSecrets)) {
        networkSecrets = null;
        warnings.push('NETWORK_SECRETS 不是 JSON 对象，已忽略：网络密钥校验不生效');
      }
    } catch {
      networkSecrets = null;
      warnings.push('NETWORK_SECRETS 不是合法 JSON（解析失败），已忽略：网络密钥校验不生效');
    }
  }
  // 趋势 SQL 的 AE 数据集名（须与 [[analytics_engine_datasets]] 的 dataset 一致；
  // AE 绑定无法在运行时读取自身 dataset 名，wrangler 未写 dataset 时默认取 Worker 名）。
  // 仅允许字母数字与 - _，非法值回退默认，防止拼坏 SQL
  const aeDataset = /^[A-Za-z0-9_-]+$/.test(str(env, 'AE_DATASET', ''))
    ? str(env, 'AE_DATASET', '')
    : 'easytier-cf-relay';
  return {
    serverPeerId: int(env, 'SERVER_PEER_ID', 10000001) >>> 0,
    serverNetworkName: str(env, 'SERVER_NETWORK_NAME', 'public_server'),
    serverHostname: str(env, 'SERVER_HOSTNAME', 'easytier-cf-relay'),
    serverVersionStr: str(env, 'SERVER_VERSION_STR', 'easytier-cf-relay/1.7.0'),
    // 房间 id 的 env 级默认（v1.7 A3）：DO 命名由 index.js resolveRoomId 解析
    // （Header > Query > 此值）；本值还决定审计 KV 键的房间段。未分片部署恒为
    // 'global'（ROOM_HEADER/QUERY 未配置时 resolveRoomId 也落到此值，两处同源）。
    roomId: str(env, 'ROOM_ID', 'global'),
    avoidRelayData: bool(env, 'AVOID_RELAY_DATA', true),
    relayData: bool(env, 'RELAY_DATA', true),
    maxPeersPerRoom: int(env, 'MAX_PEERS_PER_ROOM', 64),
    // 单 IP 并发连接上限（v1.4.1）：防单 IP 用普通握手占满房间（0 = 关闭）。
    // 仅 DO 升级层权威检查（边缘层无状态无法计数）；同 NAT 多节点共享出口 IP，
    // 默认 6 兼顾绝大多数场景。
    maxConnsPerIp: intOrZero(env, 'MAX_CONNS_PER_IP', 6),
    // 单连接消息速率上限（v1.5，事前限流）：每连接每秒消息数，持续超限断开
    // （4008 rate limited）。EasyTier 心跳 8s 1 个、路由同步爆发每秒数十个，
    // 默认 50 非常宽裕；0 = 关闭
    msgRateLimitPerSec: intOrZero(env, 'MSG_RATE_LIMIT_PER_SEC', 50),
    // 每分组 peer 上限（v1.5）：单个网络分组的在线节点数上限，防单网络吃满
    // 整个房间影响其它网络；0 = 不限（仅受房间总上限约束）
    maxPeersPerGroup: intOrZero(env, 'MAX_PEERS_PER_GROUP', 32),
    maxMessageBytes: int(env, 'MAX_MESSAGE_BYTES', 131072),
    handshakeTimeoutMs: int(env, 'HANDSHAKE_TIMEOUT_MS', 15000),
    peerIdleTimeoutMs: int(env, 'PEER_IDLE_TIMEOUT_MS', 75000),
    serverPingIdleMs: int(env, 'SERVER_PING_IDLE_MS', 40000),
    sweepIntervalMs: int(env, 'SWEEP_INTERVAL_MS', 15000),
    // 空闲退避（v1.4.0）：房间无连接且无脏数据时的 alarm 间隔（0 = 关闭，退回 sweepIntervalMs）
    sweepIdleIntervalMs: intOrZero(env, 'SWEEP_IDLE_INTERVAL_MS', 300_000),
    strictDigest: bool(env, 'STRICT_DIGEST', true),
    logLevel: str(env, 'LOG_LEVEL', 'info'),
    networkSecrets,
    // 幽灵节点老化（官方 clear_expired_peer 语义，见 constants.js 注释）
    routeInfoTtlMs: int(env, 'ROUTE_INFO_TTL_MS', ROUTE_INFO_TTL_MS),
    routeInfoUnreachableMs: int(env, 'ROUTE_INFO_UNREACHABLE_MS', ROUTE_INFO_UNREACHABLE_MS),
    // 空分组自动删除宽限（0 = 关闭）
    groupAutoDeleteMs: intOrZero(env, 'GROUP_AUTO_DELETE_MS', GROUP_AUTO_DELETE_MS),
    // ---- 资源滥用防线（语义见 constants.js；0 = 关闭该防线）----
    // 上限自洽不变量：maxRoutesPerGroup × maxRouteInfoBytes < maxMessageBytes，
    // 违反时构造函数日志 warn（合法全量推送可能被出站硬闸丢弃）。
    maxSyncItems: intOrZero(env, 'MAX_SYNC_ITEMS', MAX_SYNC_ITEMS),
    maxRouteInfoBytes: intOrZero(env, 'MAX_ROUTE_INFO_BYTES', MAX_ROUTE_INFO_BYTES),
    maxRoutesPerGroup: intOrZero(env, 'MAX_ROUTES_PER_GROUP', MAX_ROUTES_PER_GROUP),
    maxDirectPeersReport: intOrZero(env, 'MAX_DIRECT_PEERS_REPORT', MAX_DIRECT_PEERS_REPORT),
    fullResyncCooldownMs: intOrZero(env, 'FULL_RESYNC_COOLDOWN_MS', FULL_RESYNC_COOLDOWN_MS),
    maxNetworkNameBytes: intOrZero(env, 'MAX_NETWORK_NAME_BYTES', MAX_NETWORK_NAME_BYTES),
    // ---- KV 审计（记录 / 黑名单）----
    recordFlushMs: int(env, 'RECORD_FLUSH_MS', 600_000),
    recordDefaultLimit: int(env, 'RECORD_DEFAULT_LIMIT', 100),
    blacklistLimit: int(env, 'BLACKLIST_LIMIT', 1000),
    adminAudit: bool(env, 'ADMIN_AUDIT', true), // 硬设置：管理端审计不可由管理页关闭
    adminAuditLimit: int(env, 'ADMIN_AUDIT_LIMIT', 200),
    // 审计数据最小化（v1.6.0 C4）：
    // - AUDIT_IP_MASK：记录内客户端 IP 打码（1.2.x.x / IPv6 前 4 组），
    //   仅影响记录展示，黑名单/踢人/边缘拦截仍用完整 IP；0 = 关闭（默认）
    auditIpMask: bool(env, 'AUDIT_IP_MASK', false),
    // - AUDIT_RETENTION_DAYS：记录留存天数，alarm 每小时清理一次过期记录
    //   （admin 硬审计豁免）；0 = 不限（默认）
    auditRetentionDays: intOrZero(env, 'AUDIT_RETENTION_DAYS', 0),
    // ---- 账号级真实额度（v1.6.0 A6，全部可选：不配置则管理页回退自观测估算）----
    cfAccountId: str(env, 'CF_ACCOUNT_ID', ''),
    // CF_API_TOKEN 必须 wrangler secret put（最小权限 Account Analytics: Read），
    // 绝不写入 toml 明文、绝不下发浏览器/日志/审计
    cfApiToken: str(env, 'CF_API_TOKEN', ''),
    cfScriptName: str(env, 'CF_SCRIPT_NAME', 'easytier-cf-relay'),
    aeDataset,
    warnings,
  };
}

const LOG_LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };

function makeLogger(level) {
  const threshold = LOG_LEVELS[level] ?? 20;
  const log = (lv, prefix, msg) => {
    if (LOG_LEVELS[lv] >= threshold) console.log(`[${prefix}] ${msg}`);
  };
  return {
    debug: (m) => log('debug', 'debug', m),
    info: (m) => log('info', 'info', m),
    warn: (m) => log('warn', 'warn', m),
    error: (m) => log('error', 'err', m),
  };
}

export class RelayRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.config = buildConfig(env);
    this.log = makeLogger(this.config.logLevel);
    for (const w of this.config.warnings || []) this.log.warn(w);
    // 上限自洽检查（资源滥用防线，见 constants.js 注释）：仅提醒不阻断，
    // 防止运维改大条目上限后合法全量推送被出站硬闸误丢
    if (this.config.maxRoutesPerGroup > 0 && this.config.maxRouteInfoBytes > 0
        && this.config.maxRoutesPerGroup * this.config.maxRouteInfoBytes >= this.config.maxMessageBytes) {
      this.log.warn(
        `cap mismatch: MAX_ROUTES_PER_GROUP(${this.config.maxRoutesPerGroup}) x ` +
        `MAX_ROUTE_INFO_BYTES(${this.config.maxRouteInfoBytes}) >= ` +
        `MAX_MESSAGE_BYTES(${this.config.maxMessageBytes}) — 合法全量推送可能触发出站硬闸，请调小前两者或调大 MAX_MESSAGE_BYTES`
      );
    }
    this.pm = new PeerManager(this.config);
    // KV 审计：记录（每类一条 KV 键，v1.7 A3 起带房间段）+ 黑名单（每类一条 KV 键）
    this.audit = new AuditStore({
      kv: env && env.AUDIT_KV ? env.AUDIT_KV : null,
      storage: state.storage,
      flushMs: this.config.recordFlushMs,
      defaultLimit: this.config.recordDefaultLimit,
      blacklistLimit: this.config.blacklistLimit,
      adminAudit: this.config.adminAudit,
      adminAuditLimit: this.config.adminAuditLimit,
      ipMask: this.config.auditIpMask,
      retentionDays: this.config.auditRetentionDays,
      roomId: this.config.roomId,
      log: this.log,
    });
    this.types = protoTypes();
    this.counters = {
      msgsIn: 0, msgsOut: 0, bytesIn: 0, bytesOut: 0,
      forwards: 0, connsTotal: 0, errors: 0, forgeries: 0,
      // 黑名单拦截次数（v1.3.0：拒绝不再逐条写记录，改由计数器观测；
      // 边缘层【Worker 入口】拒绝的连接不会到达 DO，不在此计数）
      blRejected: 0,
      // 单 IP 并发上限拦截次数（v1.4.1，DO 升级层口径）
      ipLimited: 0,
      // 单连接速率限制断开次数（v1.5，DO 层口径）
      rateLimited: 0,
      // 分组节点上限拒绝次数（v1.5，DO 层口径）
      groupLimited: 0,
      // ---- 资源滥用防线计数（全部为内存计数，零写入开销）----
      // 单帧路由条目数超限整帧拒绝次数（MAX_SYNC_ITEMS，4009）
      routeFlooded: 0,
      // 单条条目超字节上限丢弃次数（MAX_ROUTE_INFO_BYTES）
      routeOversized: 0,
      // 分组条目总数超限拒绝次数（MAX_ROUTES_PER_GROUP）
      routeCapped: 0,
      // 出站单帧超过 MAX_MESSAGE_BYTES 丢弃次数（触发即说明状态被异常注入）
      outboundDropped: 0,
      // GetGlobalPeerMap 全量响应冷却拦截次数（每连接 1s 一次）
      peerMapCooled: 0,
      // 会话重置（强制全量重推）冷却拦截次数（每连接 1s 一次）
      resyncCooled: 0,
      // 摘要抢占嫌疑次数（同网络名不同摘要；记录按「网络名+IP」去重节流）
      squatSuspect: 0,
      // 落盘降级次数（超预算丢 raw / 裁剪条目）
      flushDegraded: 0,
      // ---- 额度韧性可观测（v1.7 A4/C5/D5，全部内存计数零写入开销）----
      // KV 镜像写失败次数（按失败批内键数计；配额/网络异常时增长，失败键下轮重试）
      kvWriteFailed: 0,
      // KV 写日预算跳过键次（KV_WRITE_DAILY_BUDGET=900 耗尽时按牺牲序跳低优 rec 键）
      kvWriteBudgetSkipped: 0,
      // 今日 kill 计数（DO 口径：4008 速率限流断开 + DO 层黑名单握手拒绝；
      // 边缘层 403 不经过 DO 不计数；UTC 日重置，DO storage 持久化随 DO 重启保留）
      killsToday: 0,
      // RPC 分片重组完成次数（v1.7 B9：官方客户端大 RPC 自动切片，本端收齐重组）
      rpcPieceMerged: 0,
      // RPC 分片校验拒绝/超预算/超限淘汰次数（v1.7 B9：total_pieces 越界等畸形分片流）
      rpcPieceDropped: 0,
      // 限流违规自动临时拉黑次数（v1.7 C4：观察窗触发 blacklistAdd socket 类）
      autoBlacklisted: 0,
      // 转发放行次数（v1.7 B10：from ≠ 连接身份且被声称身份非直连——官方多跳
      // 转发语义；确证伪造走 forgeries，本计数只记合法转发放行）
      forwardedFrom: 0,
    };
    // v1.7 D5：AuditStore 上报 KV 写失败/预算跳过到宿主计数器
    // （audit 先于 counters 构造，构造后补挂引用）
    this.audit.counters = this.counters;
    this.startedAt = Date.now();
    this._dirty = false;
    this._storageFlushAt = 0;
    // v1.7 B9：RPC 分片重组在途事务表（官方 PacketMerger；经 _rpcCtx 供 rpc 层读写）
    this.rpcMerger = new Map();
    // v1.7 D5：kill 日计数持久化锚点 / v1.7 C5：黑名单降级重试节流锚点
    this._killsDirty = false;
    this._killsDate = null;
    this._lastBlReloadAt = 0;
    // v1.7 A3：审计 init 惰性化锚点——audit.init()（KV 恢复读键）必须在房间段
    // 就位后执行：fetch() 先解析房间（setRoomId）再触发本 promise；
    // 构造期的 _init 不再直接 init 审计（alarm 等无请求路径的 flush 对未初始化
    // 审计是自然 no-op：_kvDirty/_storageDirty 均为空）。
    this._auditInitPromise = null;
    // v1.7 A5：额度 shed 检查锚点（15 分钟门控）+ 无凭证自计数（UTC 日重置，
    // killsToday 同款持久化三件套；多 isolate 有误差——宁误 shed，管理页可手动清除）
    this._lastShedCheckAt = 0;
    this._selfCount = { date: utcDayStamp(), msgs: 0, conns: 0, alarms: 0 };
    this._selfCountDirty = false;
    // v1.7 C4：限流违规观察窗（ip -> 4008 断开时间戳数组；10 分钟滑动窗，
    // DO 内存不持久化——DO 重启清窗可接受，自动拉黑本身持久于黑名单）
    this._killWindow = new Map();
    this._initPromise = this._init().catch((e) => {
      this.log.error(`init failed: ${e && e.stack || e}`);
    });
  }

  async _init() {
    // 1) 恢复休眠前已存在的 socket（attachment 带回元数据）
    for (const ws of this.state.getWebSockets()) {
      this._restoreSocket(ws);
    }
    // 2) 载入持久化状态
    try {
      const saved = await this.state.storage.get(STATE_KEY);
      if (saved) this.pm.loadPersisted(saved);
    } catch (e) {
      this.log.warn(`load state failed: ${e.message}`);
    }
    // 3) 运行时长：持久化房间创建时间（DO 休眠唤醒/重建后不重置）
    try {
      const boot = await this.state.storage.get(BOOT_KEY);
      if (boot && Number(boot.bootAt) > 0) {
        this.startedAt = Number(boot.bootAt);
      } else {
        await this.state.storage.put(BOOT_KEY, { bootAt: this.startedAt });
      }
    } catch (e) {
      this.log.warn(`load boot time failed: ${e.message}`);
    }
    // 4) 审计存储初始化已惰性化（v1.7 A3）——audit.init() 由 _ensureAuditInit()
    //    在房间段就位（fetch 解析房间之后）触发；PeerManager 事件挂接不依赖它。
    // v1.7 D5：kill 日计数恢复（UTC 日重置；DO 重启不丢当日计数）
    this._killsDate = utcDayStamp();
    try {
      const k = await this.state.storage.get(KILLS_KEY);
      if (k && k.date === this._killsDate && Number(k.count) >= 0) {
        this.counters.killsToday = Number(k.count);
      }
    } catch { /* 恢复失败按 0 起算 */ }
    // v1.7 A5：无凭证自计数恢复（UTC 日重置；DO 重启不丢当日粗估）
    try {
      const sc = await this.state.storage.get(SELF_COUNT_KEY);
      if (sc && sc.date === utcDayStamp()
        && Number.isFinite(sc.msgs) && Number.isFinite(sc.conns) && Number.isFinite(sc.alarms)) {
        this._selfCount = { date: sc.date, msgs: Number(sc.msgs), conns: Number(sc.conns), alarms: Number(sc.alarms) };
      }
    } catch { /* 恢复失败按 0 起算 */ }
    this.pm.onEvent = (ev) => this._onPmEvent(ev);
    // 5) 确保清扫 alarm 存在
    await this._ensureAlarm();
  }

  /**
   * v1.7 A3：审计初始化（惰性、单次）——KV 恢复读键以「调用时刻的房间段」为准，
   * 因此必须在 fetch() 解析房间（audit.setRoomId）之后调用。构造期不再直接
   * init，避免分片部署（ROOM_HEADER/QUERY）在房间未知时从默认房间键恢复。
   */
  async _ensureAuditInit() {
    if (!this._auditInitPromise) {
      this._auditInitPromise = this.audit.init().catch((e) => {
        this.log.warn(`audit init failed: ${e && e.message}`);
      });
    }
    await this._auditInitPromise;
  }

  /** PeerManager 事件 → KV 审计记录 */
  _onPmEvent(ev) {
    if (!ev || !ev.kind) return;
    switch (ev.kind) {
      case 'routes-add-batch':
        // 审计记录按帧聚合（额度保护）：单帧新增条目过多时合并为一条记录，
        // 防洪泛帧挤爆 routes 记录环（100 条/类）——正常小帧仍逐条记录（route-add）
        this.audit.record('routes', {
          event: 'add-batch', groupKey: ev.groupKey, count: ev.count,
          ...(ev.reporter != null ? { reporter: ev.reporter } : {}),
        });
        break;
      case 'route-add':
        this.audit.record('routes', {
          event: 'add', groupKey: ev.groupKey, peerId: ev.peerId,
          source: ev.source, ...(ev.replaced ? { replaced: ev.replaced } : {}),
        });
        break;
      case 'route-remove':
        this.audit.record('routes', {
          event: 'remove', groupKey: ev.groupKey, peerId: ev.peerId, reason: ev.reason,
        });
        break;
      case 'group-remove':
        this.audit.record('groups', {
          event: 'delete', groupKey: ev.groupKey, networkName: ev.networkName,
          cause: ev.cause, routeInfos: ev.routeInfos,
        });
        break;
      case 'pc-report':
        this.audit.record('peercenter', { event: 'add', groupKey: ev.groupKey, peerId: ev.peerId });
        break;
      case 'pc-remove':
        this.audit.record('peercenter', {
          event: 'remove', groupKey: ev.groupKey, peerId: ev.peerId, cause: ev.cause,
        });
        break;
      default:
        break;
    }
  }

  async _ensureAlarm() {
    try {
      const current = await this.state.storage.getAlarm();
      if (current === null) {
        await this.state.storage.setAlarm(Date.now() + this.config.sweepIntervalMs);
      }
    } catch (e) {
      this.log.warn(`set alarm failed: ${e.message}`);
    }
  }

  // -------------------------------------------------------------------
  // HTTP 入口（来自 Worker fetch 转发）
  // -------------------------------------------------------------------

  async fetch(request) {
    // v1.7 A3：房间段先于一切审计操作就位——resolveRoomId 与 Worker 入口同源
    // （Header > Query > env ROOM_ID），未分片部署两处恒同值（setRoomId 幂等）；
    // 分片部署由此保证 audit.init()（KV 恢复读键）落在正确房间的键上。
    const url = new URL(request.url);
    // v1.7 复核修复：内部端点（仅 Worker 鉴权后转发；Upgrade+内部路径组合另有
    // 404 守卫，客户端不可直达）采信 Worker 注入的房间头——否则分片部署的
    // 内部请求无房间线索，DO 会回退 env 默认房间并跨房间写审计键；
    // WS 升级路径忽略该头（客户端可伪造，须走 resolveRoomId 的 Header/Query 规则）
    const internalRoom = url.pathname.startsWith('/internal/')
      ? String(request.headers.get(ROOM_HEADER_INTERNAL) || '').trim()
      : '';
    this.audit.setRoomId(internalRoom || resolveRoomId(request, url, this.env));
    await this._initPromise;
    await this._ensureAuditInit();
    const path = url.pathname;

    // v1.4.1 安全修复：内部端点只接受 index.js 鉴权后的改写转发（无 Upgrade 头）。
    // Worker 入口会把带 Upgrade 头的任意路径请求原样转发到 DO——若不拦截，
    // 攻击者可用「Upgrade: websocket 头 + /internal/* 路径」直达内部端点，
    // 绕过 ADMIN_TOKEN / METRICS_TOKEN 鉴权（读统计、删记录等）。
    if (path.startsWith('/internal/') && request.headers.get('Upgrade') === 'websocket') {
      return new Response('Not found', { status: 404 });
    }

    if (path === '/internal/stats') {
      return Response.json(this._stats());
    }
    // 账号级真实额度（v1.6.0 A6）：仅由管理端 Worker 鉴权后转发调用
    if (path === '/internal/quota' && request.method === 'GET') {
      return this._handleQuota();
    }
    // AE 趋势（v1.6.0 A5/D2）：?window=24h|7d
    if (path === '/internal/trends' && request.method === 'GET') {
      return this._handleTrends(url);
    }
    // 以下管理端内部端点仅由 Worker 入口在鉴权后转发调用（DO 无外部直达路径）。
    // x-admin-ip 为管理员来源 IP（Worker 入口注入），用于管理端审计（登录/操作）。
    const adminIp = request.headers.get('x-admin-ip') || '';
    if (path === '/internal/state' && request.method === 'GET') {
      this.audit.adminTouch(adminIp, 'view');
      const q = url.searchParams;
      return Response.json(this._snapshotState({
        tab: q.get('tab') || 'overview',
        offset: Number(q.get('offset')) > 0 ? Math.floor(Number(q.get('offset'))) : 0,
        limit: Number(q.get('limit')) > 0 ? Math.floor(Number(q.get('limit'))) : 50,
        groupKey: q.get('groupKey') || '',
      }));
    }
    // KV 审计：记录查询（type ∈ groups|peers|routes|peercenter|sockets|digests|admin|all）
    if (path === '/internal/records' && request.method === 'GET') {
      this.audit.adminTouch(adminIp, 'view');
      const q = url.searchParams;
      const r = this.audit.listRecords(
        q.get('type') || 'peers',
        Number(q.get('offset')) > 0 ? Math.floor(Number(q.get('offset'))) : 0,
        Number(q.get('limit')) > 0 ? Math.floor(Number(q.get('limit'))) : 50
      );
      return Response.json({ ok: true, ...r });
    }
    // KV 审计：删除记录（admin 类为硬审计不可删；type=all 按 id 跨类型删除）
    if (path === '/internal/records/delete' && request.method === 'POST') {
      const body = await this._readBody(request);
      const r = this.audit.deleteRecords(body.type, body.ids);
      await this._adminOp(adminIp, 'records-delete', { type: body.type, removed: r.removed || 0 });
      return Response.json(r);
    }
    // KV 审计：记录配置（每类开关 + 上限；admin 类为硬设置不可改）
    if (path === '/internal/record/config' && request.method === 'GET') {
      return Response.json({ ok: true, ...this.audit.getConfig() });
    }
    if (path === '/internal/record/config' && request.method === 'POST') {
      const body = await this._readBody(request);
      const r = this.audit.setConfig(body.types);
      await this._adminOp(adminIp, 'record-config');
      return Response.json(r);
    }
    // 黑名单：查询（cat ∈ peer|group|digest|socket）
    if (path === '/internal/blacklist' && request.method === 'GET') {
      this.audit.adminTouch(adminIp, 'view');
      const q = url.searchParams;
      const r = this.audit.listBlacklist(
        q.get('cat') || 'peer',
        Number(q.get('offset')) > 0 ? Math.floor(Number(q.get('offset'))) : 0,
        Number(q.get('limit')) > 0 ? Math.floor(Number(q.get('limit'))) : 50
      );
      return Response.json({ ok: true, ...r, counts: this.audit.blacklistCounts() });
    }
    // 黑名单：手工添加
    if (path === '/internal/blacklist/add' && request.method === 'POST') {
      const body = await this._readBody(request);
      const r = this.audit.blacklistAdd(body.cat, body.value, { reason: body.reason });
      await this._adminOp(adminIp, 'blacklist-add', { cat: body.cat, value: body.value });
      return Response.json(r);
    }
    // 黑名单：移除（解除封锁）
    if (path === '/internal/blacklist/delete' && request.method === 'POST') {
      const body = await this._readBody(request);
      const r = this.audit.blacklistRemove(body.cat, body.ids);
      // v1.7 C4：socket 类解除拉黑 → 清该 IP 的限流违规观察窗（解除 = 重新观察，
      // 否则旧 4008 记录会在下次限流时立即触发二次自动拉黑）
      if (body.cat === 'socket' && Array.isArray(r.values)) {
        for (const v of r.values) this._killWindow.delete(String(v));
      }
      await this._adminOp(adminIp, 'blacklist-remove', { cat: body.cat, removed: r.removed || 0 });
      return Response.json(r);
    }
    // 额度 shed 手动清除（v1.7 A5）：清除 KV 标记 + 复位当日自计数
    //（不复位则下一轮 15 分钟检查立即重新激活——管理员清除即明确接受风险）
    if (path === '/internal/shed/clear' && request.method === 'POST') {
      const changed = await this.audit.setShedFlag(false);
      this._selfCount = { date: utcDayStamp(), msgs: 0, conns: 0, alarms: 0 };
      this._selfCountDirty = true;
      this.log.warn(`quota shed manually cleared by admin (was ${changed ? 'active' : 'inactive'})`);
      await this._adminOp(adminIp, 'shed-clear', {});
      return Response.json({ ok: true, changed });
    }
    if (path === '/internal/group/delete' && request.method === 'POST') {
      const body = await this._readBody(request);
      // _deleteGroups 为 async（需落盘），必须 await，否则 Promise 被序列化为 {}
      return Response.json(await this._deleteGroups(body, adminIp));
    }
    if (path === '/internal/peer/kick' && request.method === 'POST') {
      const body = await this._readBody(request);
      const r = this._kickPeers(body);
      await this._adminOp(adminIp, 'peer-kick', { kicked: (r.kicked || []).length });
      return Response.json(r);
    }
    if (path === '/internal/route/delete' && request.method === 'POST') {
      const body = await this._readBody(request);
      const r = this._deleteRouteInfos(body);
      await this._adminOp(adminIp, 'route-delete', { removed: (r.removed || []).length });
      return Response.json(r);
    }
    if (path === '/internal/digest/delete' && request.method === 'POST') {
      const body = await this._readBody(request);
      return Response.json(await this._deleteDigests(body, adminIp));
    }
    if (path === '/internal/peercenter/delete' && request.method === 'POST') {
      const body = await this._readBody(request);
      const r = this._deletePeerCenter(body);
      await this._adminOp(adminIp, 'peercenter-delete', { removed: (r.removed || []).length });
      return Response.json(r);
    }
    if (path === '/internal/socket/close' && request.method === 'POST') {
      const body = await this._readBody(request);
      const r = this._closeSockets(body);
      await this._adminOp(adminIp, 'socket-close', { closed: (r.closed || []).length });
      return Response.json(r);
    }

    // 官方客户端使用用户配置的 URL 路径（默认 /），官方服务端接受任意路径的
    // WebSocket 升级；这里保持一致 —— 路径过滤由 Worker 入口（index.js）负责。
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Expected WebSocket upgrade', { status: 400 });
    }
    // 客户端 IP（黑名单 socket 类拦截 + 审计记录）。
    // 注：配置了 AUDIT_KV 时，Worker 入口已先做过边缘层 socket 黑名单拦截
    //（KV 直读，不唤醒 DO）；此处为权威兜底（KV 最终一致窗口内的新拉黑 IP）。
    const clientIp = request.headers.get('CF-Connecting-IP') || '';
    if (clientIp) {
      const bl = this.audit.checkAccess({ ip: clientIp });
      if (bl.blocked) {
        // v1.3.0：拒绝不写入 peers 记录（被拉黑客户端会不断重连，逐条记录
        // 会刷爆记录列表并徒增写入额度），只计数 + 打日志
        this.counters.blRejected += 1;
        this.log.warn(`connection rejected (ip blacklist): ip=${clientIp}`);
        return new Response('Forbidden', {
          status: 403,
          headers: { 'retry-after': RETRY_AFTER_SEC }, // 建议客户端退避重试
        });
      }
    }
    // 房间满拒绝统一在握手层（4029）：升级层无法识别「同 peerId 重连顶替」，
    // 若在此 429 会把已有节点的重连恢复也一并挡死（v1.5 修复）；握手层有
    // 顶替豁免，且黑名单/握手超时/速率限制在升级前已兜住滥用。
    // 单 IP 并发连接上限（v1.4.1）：与黑名单不同，这是事前限流——
    // 攻击者无需触发任何警报即可用普通握手占满房间，此检查补上该缺口。
    if (this.config.maxConnsPerIp > 0 && clientIp) {
      let same = 0;
      for (const s of this.state.getWebSockets()) {
        if (s.readyState !== WS_OPEN) continue;
        const ip = s._clientIp ?? this._loadAttachment(s).clientIp;
        if (ip === clientIp) same += 1;
      }
      if (same >= this.config.maxConnsPerIp) {
        this.counters.ipLimited += 1;
        this.log.warn(`connection rejected (per-ip limit): ip=${clientIp} open=${same}`);
        return new Response('Too many connections', {
          status: 429,
          headers: { 'retry-after': RETRY_AFTER_SEC },
        });
      }
    }

    // v1.7 A5：额度 shed——DO 层兜底拒绝新升级（边缘层 KV 标记未生效/未绑定
    // AUDIT_KV 时由此拦截）。与 per-IP 429 同形态零指纹；已建立的 Hibernation
    // 会话不走本路径（不吃 Worker 请求额度，存量 mesh 跑到当日复位）。
    if (this.audit.shedActive) {
      this.log.warn('connection rejected (quota shed active)');
      return new Response('Too many requests', {
        status: 429,
        headers: { 'retry-after': '300' },
      });
    }

    const pair = new WebSocketPair();
    const [client, server] = [pair[0], pair[1]];
    this._acceptSocket(server, clientIp);
    return new Response(null, { status: 101, webSocket: client });
  }

  /** 读取 JSON 请求体（解析失败回退空对象——管理端薄路由的既有约定） */
  async _readBody(request) {
    return request.json().catch(() => ({}));
  }

  // -------------------------------------------------------------------
  // Socket 生命周期
  // -------------------------------------------------------------------

  _acceptSocket(ws, clientIp = '') {
    this.state.acceptWebSocket(ws);
    const now = Date.now();
    this._socketSeq = (this._socketSeq || 0) + 1;
    ws._socketId = this._socketSeq; // 管理端连接列表的操作标识（DO 生命周期内唯一）
    ws._peerId = null;
    ws._groupKey = null;
    ws._networkName = null;
    ws._domainName = null;
    ws._clientIp = clientIp || null;
    ws._connectedAt = now;
    ws._serverSessionId = randomU64Long();
    ws._weAreInitiator = false;
    ws._lastSeen = now;
    ws._handshakedAt = null;
    ws._lastAttachSync = now;
    ws._serverPingSent = false;
    this._saveAttachment(ws, now);
    this.counters.connsTotal += 1;
    this._selfCountInc('conns'); // v1.7 A5：无凭证自计数（升级接受 = 1 个 DO 请求）
    this.audit.record('sockets', {
      event: 'open', socketId: ws._socketId, ...(ws._clientIp ? { ip: ws._clientIp } : {}),
    });
    this.log.info(`socket accepted (total conns=${this.counters.connsTotal})`);
  }

  _restoreSocket(ws) {
    const meta = this._loadAttachment(ws);
    const now = Date.now();
    this._socketSeq = (this._socketSeq || 0) + 1;
    ws._socketId = this._socketSeq;
    ws._peerId = meta.peerId ?? null;
    ws._groupKey = meta.groupKey ?? null;
    ws._networkName = meta.networkName ?? null;
    ws._domainName = meta.domainName ?? null;
    ws._clientIp = meta.clientIp ?? null; // v1.4.1：随 attachment 恢复（per-IP 计数依赖）
    ws._serverSessionId = meta.serverSessionId
      ? toU64Long(meta.serverSessionId)
      : randomU64Long();
    ws._weAreInitiator = false;
    ws._lastSeen = meta.lastSeen ?? meta.connectedAt ?? now;
    ws._handshakedAt = meta.handshakedAt ?? null;
    ws._lastAttachSync = now;
    ws._serverPingSent = false;
    // 冷却戳随 attachment 恢复（休眠唤醒后防线不失效）
    ws._lastFullPeerMapAt = Number(meta.lastFullPeerMapAt) || 0;
    ws._lastSessionResetAt = Number(meta.lastSessionResetAt) || 0;

    // 重新注册到分组（未完成握手的 socket 不注册，等待握手或超时清理）
    if (ws._peerId != null && ws._groupKey) {
      this.pm.addPeer(ws._groupKey, ws._peerId, ws);
    }
  }

  _saveAttachment(ws, lastSeenOverride) {
    try {
      ws.serializeAttachment({
        peerId: ws._peerId ?? null,
        groupKey: ws._groupKey ?? null,
        networkName: ws._networkName ?? null,
        domainName: ws._domainName ?? null,
        // clientIp 持久化（v1.4.1）：休眠重启后 per-IP 并发计数与连接列表 IP 展示依赖
        clientIp: ws._clientIp ?? null,
        serverSessionId: ws._serverSessionId ? ws._serverSessionId.toString() : null,
        connectedAt: ws._connectedAt ?? Date.now(),
        handshakedAt: ws._handshakedAt ?? null,
        lastSeen: lastSeenOverride ?? ws._lastSeen ?? Date.now(),
        // 资源滥用防线的每连接冷却戳：随 attachment 持久化，
        // 休眠唤醒后冷却仍然有效（内存戳会随 DO 重启丢失）
        lastFullPeerMapAt: ws._lastFullPeerMapAt ?? 0,
        lastSessionResetAt: ws._lastSessionResetAt ?? 0,
      });
    } catch {
      // attachment 不可用时忽略（极端运行时）
    }
  }

  _loadAttachment(ws) {
    try {
      return ws.deserializeAttachment() || {};
    } catch {
      return {};
    }
  }

  _getLastSeen(ws) {
    if (typeof ws._lastSeen === 'number') return ws._lastSeen;
    const meta = this._loadAttachment(ws);
    return meta.lastSeen ?? meta.connectedAt ?? 0;
  }

  _touch(ws, now) {
    ws._lastSeen = now;
    ws._serverPingSent = false;
    // 节流同步 lastSeen 到 attachment（休眠唤醒后仍可判定空闲）。
    // 说明：EasyTier 的 Ping payload 带自增 seq，无法用 setWebSocketAutoResponse
    // 做精确匹配的自动应答（该 API 仅支持固定字节的请求-应答模板），
    // 每条消息都会唤醒 DO 执行 webSocketMessage，内存 _lastSeen 即为权威值。
    if (now - (ws._lastAttachSync || 0) >= ATTACH_SYNC_INTERVAL_MS) {
      ws._lastAttachSync = now;
      this._saveAttachment(ws, now);
    }
  }

  // -------------------------------------------------------------------
  // WebSocket 事件（Hibernation API）
  // -------------------------------------------------------------------

  async webSocketMessage(ws, message) {
    await this._initPromise;
    // v1.7 A3：Hibernation 唤醒可能不经过 fetch（DO 代际首个消息）——审计
    // 惰性 init 在此兜底（房间段为构造期默认值；分片部署建议仅用 ROOM_ID）
    await this._ensureAuditInit();
    let buf;
    if (message instanceof ArrayBuffer) {
      buf = new Uint8Array(message);
    } else if (message instanceof Uint8Array) {
      buf = message;
    } else if (ArrayBuffer.isView(message)) {
      buf = new Uint8Array(message.buffer, message.byteOffset, message.byteLength);
    } else {
      this.log.warn(`unsupported message type: ${typeof message}`);
      return;
    }

    const now = Date.now();
    this._touch(ws, now);
    this.counters.msgsIn += 1;
    this._selfCountInc('msgs'); // v1.7 A5：无凭证自计数（入站消息 20:1 折算请求）
    this.counters.bytesIn += buf.length;

    // 单连接消息速率限制（v1.5，事前限流）：固定 1s 窗口计数，持续超限断开。
    // 计数包含全部消息类型（任何包都消耗 DO 唤醒与处理）。
    if (this.config.msgRateLimitPerSec > 0) {
      if (now - (ws._rateWindowStart || 0) >= 1000) {
        ws._rateWindowStart = now;
        ws._rateCount = 0;
      }
      ws._rateCount = (ws._rateCount || 0) + 1;
      if (ws._rateCount > this.config.msgRateLimitPerSec) {
        // v1.7 C4：断开指令发出后，运行时仍会投递该连接缓冲的残余消息——不去重
        // 会把「一次断开」重复记账（rateLimited/killsToday/C4 观察窗各爆表，
        // 观察窗会从 1 次断开瞬间凑满 AUTO_BLACKLIST_KILLS 触发误拉黑）
        if (ws._rateKilled) return;
        ws._rateKilled = true;
        this.counters.rateLimited += 1;
        this._killInc();
        this._noteRateLimitKill(ws._clientIp); // v1.7 C4：观察窗记录 + 阈值自动拉黑
        this.log.warn(
          `rate limit exceeded: peer=${ws._peerId} count=${ws._rateCount}/${this.config.msgRateLimitPerSec}/s`
        );
        this._close(ws, WS_CLOSE.RATE_LIMITED, 'rate limited');
        this._cleanupPeer(ws, 'rate-limited');
        return;
      }
    }

    if (buf.length > this.config.maxMessageBytes) {
      this.log.warn(`oversized message (${buf.length}) from socket, closing`);
      this._close(ws, WS_CLOSE.OVERSIZED, 'oversized');
      return;
    }

    const header = parseHeader(buf);
    if (!header) {
      this.log.warn(`malformed packet (len=${buf.length})`);
      this.counters.errors += 1;
      this._close(ws, WS_CLOSE.MALFORMED, 'malformed');
      return;
    }

    // 加密负载：本端不支持与客户端的加密会话（纯中继模式下转发不受影响）。
    if (header.packetType !== PacketType.HandShake &&
        header.packetType !== PacketType.Ping &&
        header.packetType !== PacketType.Pong &&
        (header.flags & HeaderFlags.ENCRYPTED)) {
      // 目标为本端却加密 -> 无法处理；转发场景不受影响（原样透传）
      if (header.toPeerId === this.config.serverPeerId) {
        this.log.debug(`drop encrypted packet addressed to server (type=${header.packetType})`);
        return;
      }
    }

    // v1.4.2 安全修复（外部安全加固）：未握手不处理任何 RPC（V-03 不退，
    // 匿名连接既不能驱动路由会话状态机、也不允许经其转发）；from ≡ 连接身份校验
    // 按 v1.7 B10 改为【直连在线判据】：fromPeerId ≠ 连接身份时——
    // a) 被声称身份在本组【直连在线】（有自己的连接）→ 确证伪造：该身份不可能
    //    经由他人连接发话，丢弃 + forgeries（冒名 SyncRouteInfo / 冒名
    //    ReportPeers / 伪造 RpcResp 清会话 防线不退）；
    // b) 被声称身份【非直连】→ 官方多跳转发语义放行（转发保持原始 from，官方
    //    非 secure 模式无连接身份校验）：生产 2026-11-21 实锤的父节点替子节点
    //    转发形态（drop forged rpc ×63，conn_peer 6 连接、claims 9+ PeerId）
    //    即此类，v1.4.2 的无差别校验把子节点密集网络的 RPC 全部丢弃。
    //    残余暴露面 = 非直连身份可被同组连接冒名（与官方语义等同，端到端加密
    //    在客户端层；收紧路径 NETWORK_SECRETS / secure mode——技术文档安全边界）。
    if (header.packetType === PacketType.RpcReq || header.packetType === PacketType.RpcResp) {
      if (ws._peerId == null) return;
      // v1.7 复核修复：本地会话态 RPC 路径同步补冒充中继自身 / 非法 from 的硬拒
      //（v1.4.2 的 from≡身份防线被 B10 放宽后，serverPeerId 恒非直连会被当成
      // 「非直连多跳」放行，可注入 PeerCenter/伪路由；_forward 侧本已有硬拒）
      if (header.fromPeerId !== ws._peerId
          && (header.fromPeerId === this.config.serverPeerId
            || header.fromPeerId <= 0
            || this._isDirectlyConnected(ws, header.fromPeerId))) {
        this.counters.forgeries += 1;
        this.log.warn(`drop forged rpc: conn_peer=${ws._peerId} claims from=${header.fromPeerId} type=${header.packetType}`);
        return;
      }
      if (header.fromPeerId !== ws._peerId) {
        this.counters.forwardedFrom += 1;
        this.log.info(`forward-from rpc: conn_peer=${ws._peerId} claims from=${header.fromPeerId} type=${header.packetType}`);
      }
    }

    // v1.7 B4：官方 liveness 数据面语义（peer_conn_liveness.rs:132-176）——
    // PROBE/ECHO 共用 header reserved 字节作 token，标记消费即清除、不跨跳传播：
    // 收到 PROBE → 在本连接排队 echo（附着到下一个经 _send 的出站包，官方
    // before_send 同款）；收到 ECHO → 客户端确认探针（服务端无动作）。
    // 两标记位与 reserved 在缓冲区一并清除——本地分发与 _forward 透传均不再
    // 携带（官方 after_received 同款，转发的包不向下游传播探针）。
    const lvMask = HeaderFlags.LIVENESS_PROBE | HeaderFlags.LIVENESS_ECHO;
    if (header.flags & lvMask) {
      if (header.flags & HeaderFlags.LIVENESS_PROBE) {
        ws._pendingEchoToken = header.reserved & 0xff;
        ws._pendingEchoValid = true;
      }
      buf[9] = header.flags & ~lvMask;
      buf[11] = 0;
      header.flags = buf[9];
      header.reserved = 0;
    }

    // 按 header.len 截断——官方语义 len = payload 长度，
    // len < 实际负载的部分视为填充；本地解析不再吞入填充字节。
    // 转发路径（_forward）仍逐字节搬运原帧，透传行为不变。
    const payload = payloadOf(buf, header.len);
    this.log.debug(
      `msg type=${header.packetType} from=${header.fromPeerId} to=${header.toPeerId} ` +
      `flags=${header.flags} len=${buf.length}`
    );

    switch (header.packetType) {
      case PacketType.HandShake:
        this._handleHandshake(ws, header, payload);
        return;
      case PacketType.Ping:
        this._handlePing(ws, header, payload);
        return;
      case PacketType.Pong:
        // 仅作为活性信号（_touch 已更新）
        return;
      case PacketType.RpcReq:
        if (header.toPeerId === this.config.serverPeerId || header.toPeerId === 0) {
          const ctx = this._rpcCtx();
          await handleRpcRequest(ctx, ws, header, payload);
          return;
        }
        this._forward(ws, header, buf);
        return;
      case PacketType.RpcResp:
        if (header.toPeerId === this.config.serverPeerId || header.toPeerId === 0) {
          handleRpcResponse(this._rpcCtx(), ws, header, payload);
          return;
        }
        this._forward(ws, header, buf);
        return;
      case PacketType.Data:
      case PacketType.KcpSrc:
      case PacketType.KcpDst:
        if (!this.config.relayData) {
          // 严格纯 P2P：丢弃数据面转发（控制面仍正常）
          return;
        }
        this._forward(ws, header, buf);
        return;
      case PacketType.NoiseHandshakeMsg1:
      case PacketType.NoiseHandshakeMsg2:
      case PacketType.NoiseHandshakeMsg3:
        // secure-mode（Noise）为官方较新的可选功能，本中继不支持；
        // 客户端需以普通模式连接（默认配置即为普通握手 + 可选 AES-GCM 透传）。
        this.log.info(`secure-mode handshake (type=${header.packetType}) not supported, closing`);
        this._close(ws, WS_CLOSE.UNSUPPORTED, 'secure mode unsupported');
        return;
      default:
        // ForeignNetworkPacket / Relay* / deprecated 类型：原样转发
        this._forward(ws, header, buf);
    }
  }

  async webSocketClose(ws, code, reason, wasClean) {
    await this._initPromise;
    // v1.7 复核修复：close/error 可能是一个 DO 代际的首个事件（Hibernation 驱逐
    // 后无 fetch）——必须先完成审计 init（KV/storage 恢复），否则 record() 置脏
    // 后 flush 会用未恢复的空快照覆盖 audit_state 与 KV 镜像
    await this._ensureAuditInit();
    this.audit.record('sockets', {
      event: 'close', socketId: ws._socketId ?? null, peerId: ws._peerId ?? null,
      ...(ws._clientIp ? { ip: ws._clientIp } : {}), code,
    });
    this._cleanupPeer(ws, 'close');
  }

  async webSocketError(ws) {
    await this._initPromise;
    await this._ensureAuditInit(); // v1.7 复核修复：同 webSocketClose
    this.audit.record('sockets', {
      event: 'error', socketId: ws._socketId ?? null, peerId: ws._peerId ?? null,
      ...(ws._clientIp ? { ip: ws._clientIp } : {}),
    });
    this._cleanupPeer(ws, 'error');
  }

  // -------------------------------------------------------------------
  // 协议处理
  // -------------------------------------------------------------------

  _handleHandshake(ws, header, payload) {
    if (ws._peerId != null) {
      this.log.warn(`duplicate handshake from peer=${ws._peerId}, ignore`);
      return;
    }
    let req;
    try {
      req = this.types.HandshakeRequest.decode(payload);
    } catch (e) {
      this.log.warn(`handshake decode failed: ${e.message}`);
      this._close(ws, WS_CLOSE.MALFORMED, 'bad handshake');
      return;
    }
    if (Number(req.magic) !== MAGIC) {
      this._close(ws, WS_CLOSE.MALFORMED, 'bad magic');
      return;
    }
    if (Number(req.version) !== VERSION) {
      this._close(ws, WS_CLOSE.MALFORMED, 'bad version');
      return;
    }
    const peerId = Number(req.myPeerId);
    if (!Number.isInteger(peerId) || peerId <= 0 || peerId === this.config.serverPeerId) {
      this._close(ws, WS_CLOSE.MALFORMED, 'bad peer id');
      return;
    }

    const networkName = String(req.networkName || '');
    const digestHex = bytesToHex(req.networkSecretDigest || new Uint8Array(0));

    // 空网络名 / 超长网络名拒绝：空名会生成退化
    // 分组 ":<digest>"；超长名直接进 groupKey 并持久化。官方客户端恒带
    // 非空、短于 DNS 域名长度上限的网络名，不影响兼容。
    if (!networkName || networkName.length > this.config.maxNetworkNameBytes) {
      this.log.warn(
        `handshake rejected: bad network name (len=${networkName.length}) peer=${peerId}`
      );
      this._close(ws, WS_CLOSE.MALFORMED, 'bad network name');
      return;
    }

    // 黑名单拦截：peerId / 网络名（group / digest 两类；digest 类 v1.4.2 起
    // 支持完整「网络名:摘要」粒度）
    {
      const bl = this.audit.checkAccess({
        ip: ws._clientIp || undefined, peerId, networkName, digestHex,
      });
      if (bl.blocked) {
        // v1.3.0：拒绝不写入 peers 记录（防重连风暴刷爆记录列表），只计数
        this.counters.blRejected += 1;
        this._killInc();
        this.log.warn(
          `handshake rejected (blacklist:${bl.cat}) network="${networkName}" peer=${peerId} value=${bl.value}`
        );
        this._close(ws, WS_CLOSE.BLACKLISTED, 'blacklisted');
        return;
      }
    }

    const digestRegisteredBefore = this.pm.digestRegistry.get(networkName);
    const groupExisted = this.pm.groups.has(`${networkName}:${digestHex}`);
    const resolved = resolveGroupKey(this.config, this.pm.digestRegistry, networkName, digestHex);
    if (resolved.error) {
      this.log.warn(
        `handshake rejected: digest mismatch network="${networkName}" peer=${peerId}`
      );
      // 抢占嫌疑：注册表已有该网络名的不同摘要——可能是
      // 先到者正常接入，也可能是恶意抢占（错误密钥堵门锁死网络名）。按
      // 「网络名+IP」去重节流记录（持续攻击至多每天几条，免费额度零压力），
      // 其余只进内存计数；管理员在摘要注册记录页可见攻击源并拉黑。
      this.counters.squatSuspect += 1;
      this.audit.recordSquatSuspect({
        networkName,
        digest: digestHex.slice(0, 16),
        ...(ws._clientIp ? { ip: ws._clientIp } : {}),
      });
      this._close(ws, WS_CLOSE.UNSUPPORTED, 'digest mismatch');
      return;
    }
    const groupKey = resolved.groupKey;

    // 房间满（v1.5：拒绝统一在握手层，升级层 429 已移除）——同 peerId 重连
    // 顶替豁免（顶替不增加节点总数，addPeer 会替换旧 socket），否则房间满时
    // 已有节点断线后永远无法重连恢复。
    if (this.pm.totalPeers() >= this.config.maxPeersPerRoom) {
      const existing = this.pm.getPeer(groupKey, peerId);
      if (!existing) {
        this._close(ws, WS_CLOSE.ROOM_FULL, 'room full');
        return;
      }
    }
    // 每分组 peer 上限（v1.5）：单个网络分组的在线节点数达到上限后，该网络
    // 的新节点被拒（其它网络不受影响）；0 = 不限。重连顶替（同 peerId）在
    // addPeer 时处理，不受此限制。
    if (this.config.maxPeersPerGroup > 0) {
      const g = this.pm.groups.get(groupKey);
      const isReconnect = g && g.peers.has(peerId);
      if (g && !isReconnect && g.peers.size >= this.config.maxPeersPerGroup) {
        this.counters.groupLimited = (this.counters.groupLimited || 0) + 1;
        this.log.warn(
          `handshake rejected: group full network="${networkName}" peers=${g.peers.size}/${this.config.maxPeersPerGroup}`
        );
        this._close(ws, WS_CLOSE.GROUP_FULL, 'group full');
        return;
      }
    }

    // 注册。顶替（同 peerId 重连）必须【先清理旧连接、再注册新连接】——
    // 同 peerId 后清会把【新连接】的注册一并删掉（removePeer 按 peerId 匹配）：
    // 顶替者/重连者成为「能发包、收不到包」的幽灵连接，房间容量计数被洗掉。
    // 先清后注复用既有单连接清理路径（removePeer：清条目/会话/广播/版本号），
    // 新连接注册后状态干净。
    ws._peerId = peerId;
    ws._groupKey = groupKey;
    ws._networkName = networkName;
    ws._domainName = networkName;
    ws._handshakedAt = Date.now();
    const prior = this.pm.getPeer(groupKey, peerId);
    const isReplace = !!(prior && prior !== ws);
    if (isReplace) {
      this.log.info(`peer=${peerId} reconnected, closing stale socket`);
      this._close(prior, WS_CLOSE.REPLACED, 'replaced');
      this._cleanupPeer(prior, 'replaced');
    }
    this.pm.addPeer(groupKey, peerId, ws);
    this._saveAttachment(ws);
    this._markDirty();

    // 审计记录：节点加入 / 分组创建 / 摘要注册
    this.audit.record('peers', {
      event: isReplace ? 'replace' : 'join', groupKey, networkName, peerId,
      ...(ws._clientIp ? { ip: ws._clientIp } : {}),
    });
    if (!groupExisted) {
      this.audit.record('groups', { event: 'create', groupKey, networkName });
    }
    if (!digestRegisteredBefore && this.pm.digestRegistry.get(networkName) === digestHex) {
      this.audit.record('digests', { event: 'register', networkName, digest: digestHex.slice(0, 16) });
    }

    // 握手响应（镜像 features，包含 liveness-echo-v1）
    const features = Array.isArray(req.features)
      ? req.features.filter((f) => typeof f === 'string')
      : [];
    const respFeatures = features.includes(LIVENESS_ECHO_FEATURE)
      ? [LIVENESS_ECHO_FEATURE]
      : SERVER_FEATURES;
    const respPayload = this.types.HandshakeRequest.encode({
      magic: MAGIC,
      myPeerId: this.config.serverPeerId,
      version: VERSION,
      features: respFeatures,
      networkName: this.config.serverNetworkName,
      networkSecretDigest: new Uint8Array(32),
    }).finish();
    this._send(ws, buildPacket(
      this.config.serverPeerId, peerId, PacketType.HandShake, respPayload
    ));

    this.log.info(
      `handshake ok peer=${peerId} network="${networkName}" group=${groupKey} ` +
      `peers=${this.pm.getGroup(groupKey).peers.size}`
    );

    // 初始路由推送（全量）+ 通知组内其他成员（增量）
    this._pushRoute(ws, true);
    this._broadcast(groupKey, peerId);
  }

  _handlePing(ws, header, payload) {
    // 回显 Pong；liveness 探针回显由 _send 统一附着（v1.7 B4：token 机制取代
    // 旧的无 token 镜像——探针方以 reserved 字节比对 token，无 token 的镜像无效）
    this._send(ws, buildPacket(
      this.config.serverPeerId, header.fromPeerId, PacketType.Pong,
      payload
    ));
  }

  /**
   * v1.7 B10：直连在线判据——被声称身份是否在本组有自己的连接。
   * 在线 → from ≠ 连接身份的包必属伪造（该身份有直连，不经他人连接发话）；
   * 非在线 → 官方多跳转发语义放行（父节点替子节点转发，原始 from 保持）。
   */
  _isDirectlyConnected(ws, peerId) {
    if (peerId == null) return false;
    return !!this.pm.getPeer(ws._groupKey, peerId);
  }

  _forward(ws, header, fullMessage) {
    if (ws._groupKey == null) return; // 未握手连接不允许转发
    // 加固：转发前源身份校验。from ≡ 连接身份照常转发；
    // from ≠ 连接身份时——冒充中继自身（from=serverPeerId）或被声称身份在本组
    // 直连在线 → 确证伪造（丢弃 + forgeries， 防线不退）；否则按官方
    // 多跳转发语义放行（原始 from 保持，转发不产生额外身份改写——官方行为）。
    if (header.fromPeerId !== ws._peerId) {
      if (header.fromPeerId === this.config.serverPeerId || header.fromPeerId <= 0
          || this._isDirectlyConnected(ws, header.fromPeerId)) {
        this.counters.forgeries += 1;
        this.log.warn(
          `drop forged packet: conn_peer=${ws._peerId} claims from=${header.fromPeerId} ` +
          `to=${header.toPeerId} type=${header.packetType}`
        );
        return;
      }
      this.counters.forwardedFrom += 1;
      this.log.info(
        `forward-from packet: conn_peer=${ws._peerId} claims from=${header.fromPeerId} ` +
        `to=${header.toPeerId} type=${header.packetType}`
      );
    }
    const target = this.pm.getPeer(ws._groupKey, header.toPeerId);
    if (!target || target === ws) return;
    if (target.readyState !== WS_OPEN) return;
    const out = bumpForward(fullMessage, MAX_FORWARD_COUNTER);
    if (!out) {
      this.log.debug(`drop packet: forward counter exceeded (type=${header.packetType})`);
      return;
    }
    // v1.7 复核修复：转发出站同样经 _attachEcho 附着待回显 token（官方
    // before_send 覆盖该连接的一切出站包，含转发的数据/控制帧）
    const framed = this._attachEcho(target, out);
    try {
      target.send(framed);
      this.counters.forwards += 1;
      this.counters.msgsOut += 1;
      this.counters.bytesOut += framed.length;
    } catch (e) {
      this.log.warn(`forward to ${header.toPeerId} failed: ${e.message}`);
      this._cleanupPeer(target, 'send-failed');
    }
  }

  /**
   * v1.7 B4 / 复核修复：liveness echo 附着（官方 peer_conn_liveness.rs before_send
   * 同款）——本连接有待回显 token 时，将其附到下一个出站包（ECHO 位 + reserved
   * 字节），一次性消费。_send 与 _forward 共用，覆盖一切出站路径。
   */
  _attachEcho(ws, bytes) {
    if (!ws || ws._pendingEchoValid !== true) return bytes;
    ws._pendingEchoValid = false;
    const out = bytes.slice();
    out[9] = (out[9] & ~(HeaderFlags.LIVENESS_PROBE | HeaderFlags.LIVENESS_ECHO))
      | HeaderFlags.LIVENESS_ECHO;
    out[11] = ws._pendingEchoToken & 0xff;
    return out;
  }

  _send(ws, bytes) {
    if (!ws || ws.readyState !== WS_OPEN) return;
    // 出站硬闸：入站有 MAX_MESSAGE_BYTES，出站同样收口。正常路由推送受
    // 「分组条目上限 × 单条字节上限 < 本上限」自洽不变量保护（128×768B=96KB），
    // 永不触发本闸；触发即说明状态被异常注入，丢弃并计数（不关闭连接：
    // 毒状态由分组条目上限与老化负责清除）。
    // v1.7 复核修复：大小闸前移——echo 附着会消费 token，若先附着后丢帧，
    // 探针回显会被吞掉（echo 不改变长度，重排无副作用）
    if (bytes.length > this.config.maxMessageBytes) {
      this.counters.outboundDropped += 1;
      this.log.warn(
        `outbound frame dropped: ${bytes.length} > ${this.config.maxMessageBytes} (peer=${ws._peerId})`
      );
      return;
    }
    // v1.7 B4：待回显 token 附着到本连接下一个出站包（探针后的第一个出站包
    // 通常就是 Pong）；旧实现（_handlePing 镜像 ECHO 位但不带 token）是残缺
    // 回显，本机制取代之
    bytes = this._attachEcho(ws, bytes);
    try {
      ws.send(bytes);
      this.counters.msgsOut += 1;
      this.counters.bytesOut += bytes.length;
    } catch (e) {
      this.log.warn(`send to peer=${ws._peerId} failed: ${e.message}`);
      this._cleanupPeer(ws, 'send-failed');
    }
  }

  _close(ws, code, reason) {
    try {
      ws.close(code, reason);
    } catch { /* ignore */ }
  }

  /** 当前 socket 汇总计数（连接列表 / 总览 / stats 共用同一口径） */
  _socketCounts() {
    let total = 0;
    let handshaked = 0;
    for (const ws of this.state.getWebSockets()) {
      total += 1;
      if (ws._peerId != null) handshaked += 1;
    }
    return { total, handshaked, pending: total - handshaked };
  }

  _cleanupPeer(ws, cause) {
    if (ws._peerId == null || ws._groupKey == null) return;
    const { _peerId: peerId, _groupKey: groupKey, _networkName: networkName } = ws;
    ws._peerId = null;
    ws._groupKey = null;
    const removed = this.pm.removePeer(groupKey, peerId);
    if (removed) {
      this.audit.record('peers', {
        event: 'leave', groupKey, networkName, peerId, cause,
        ...(ws._clientIp ? { ip: ws._clientIp } : {}),
      });
      this._markDirty();
      this._broadcast(groupKey, peerId);
      this.log.info(`peer=${peerId} left group=${groupKey} (${cause})`);
    }
  }

  // -------------------------------------------------------------------
  // 路由推送
  // -------------------------------------------------------------------

  _pushRoute(ws, forceFull) {
    if (ws._peerId == null || ws._groupKey == null) return;
    const built = this.pm.buildRoutePush(
      ws._groupKey, ws._peerId, forceFull,
      ws._weAreInitiator, ws._serverSessionId
    );
    if (!built) return;
    // wire 层重组：有原始字节的 RoutePeerInfo 逐字节搬运（保留未知字段）
    const innerBytes = encodeRoutePush(built);
    const rpcBytes = buildRpcRequest({
      fromPeer: this.config.serverPeerId,
      toPeer: ws._peerId,
      descriptor: {
        // 官方语义：proto_name = prost 服务短名，与 service_name 相同
        protoName: 'OspfRouteRpc',
        serviceName: 'OspfRouteRpc',
        methodIndex: 1, // 官方 1-based：SyncRouteInfo 是 OspfRouteRpc 的第 1 个方法
        domainName: ws._domainName || '',
      },
      innerBytes,
      domainName: ws._domainName || 'public_server',
    });
    this._send(ws, buildPacket(
      this.config.serverPeerId, ws._peerId, PacketType.RpcReq, rpcBytes
    ));
  }

  _broadcast(groupKey, excludePeerId) {
    const g = this.pm.getGroup(groupKey);
    if (!g) return;
    for (const [pid, target] of g.peers) {
      if (pid === excludePeerId) continue;
      if (target.readyState !== WS_OPEN) continue;
      this._pushRoute(target, false);
    }
  }

  _rpcCtx() {
    return {
      pm: this.pm,
      config: this.config,
      log: this.log,
      counters: this.counters,
      rpcMerger: this.rpcMerger, // v1.7 B9：RPC 分片重组在途事务表
      send: (ws, bytes) => this._send(ws, bytes),
      pushRoute: (ws, forceFull) => this._pushRoute(ws, forceFull),
      broadcast: (groupKey, excludePeerId) => this._broadcast(groupKey, excludePeerId),
      close: (ws, code, reason) => this._close(ws, code, reason),
      // 冷却戳写入后由 RPC 层立即持久化（防休眠重启丢失）
      saveAttachment: (ws) => this._saveAttachment(ws),
      // 冷却戳读取：内存优先，缺失（跨隔离体/休眠唤醒）时回落 attachment——
      // 保证冷却判定与实例调度方式无关（确定性防线）
      getStamp: (ws, key) => {
        const v = ws[key];
        if (typeof v === 'number' && v > 0) return v;
        const meta = this._loadAttachment(ws);
        return Number(meta && meta[key]) || 0;
      },
    };
  }

  // -------------------------------------------------------------------
  // Alarm：清扫 + 持久化
  // -------------------------------------------------------------------

  /**
   * v1.7 D5：kill 日计数（DO 口径）+1——UTC 日惰性重置，持久化挂 flush/alarm
   * 节奏（非逐次）。计数点：速率限流 4008 断开 + DO 层黑名单握手拒绝；
   * 边缘层 403 拒绝不经过 DO，不在此计数（与 blRejected 同口径边界）。
   */
  _killInc() {
    const today = utcDayStamp();
    if (this._killsDate !== today) {
      this._killsDate = today;
      this.counters.killsToday = 0;
    }
    this.counters.killsToday += 1;
    this._killsDirty = true;
  }

  /**
   * v1.7 C4：限流违规观察窗（单 IP 10 分钟滑动窗，DO 内存）——4008 断开即记录；
   * 窗内 ≥ AUTO_BLACKLIST_KILLS 次 → 自动对肇事 IP 拉黑（blacklistAdd socket 类，
   * reason 前缀 'auto rate-limit'，管理页黑名单可见、可一键解除）。
   * - 口径：仅统计 4008 速率限流断开（规划原文「4008/403」收窄——4013/403 命中者
   *   已在黑名单，无循环可言，计入窗口无增益；评估结论见规划文档 C4）；
   * - KV 写限幅评估结论：无需独立限幅器——自动路径走既有 10 分钟 flush 节奏
   *   （bl:socket ≤6 写/小时，天然满足 ≤30/小时）+ A4 日预算封顶；
   * - 解除拉黑时清窗（/internal/blacklist/delete 路由）= 给该 IP 重新观察的机会。
   */
  _noteRateLimitKill(ip) {
    if (!ip) return; // 本地 dev 无 CF-Connecting-IP / 极端环境缺头：不观察
    const now = Date.now();
    let arr = this._killWindow.get(ip);
    if (!arr) {
      if (this._killWindow.size >= AUTO_BLACKLIST_WINDOW_MAX_IPS) {
        const oldest = this._killWindow.keys().next().value;
        this._killWindow.delete(oldest); // FIFO 驱逐最旧 IP（防轮换 IP 撑爆内存）
      }
      arr = [];
      this._killWindow.set(ip, arr);
    }
    while (arr.length && now - arr[0] > AUTO_BLACKLIST_WINDOW_MS) arr.shift(); // 滑动窗修剪
    arr.push(now);
    if (arr.length < AUTO_BLACKLIST_KILLS) return;
    // 触发自动拉黑（blacklistAdd 幂等：已存在条目只刷新 ts/reason）
    const r = this.audit.blacklistAdd('socket', ip, {
      reason: `auto rate-limit: ${arr.length} kills/${AUTO_BLACKLIST_WINDOW_MS / 60_000}min`,
    });
    if (r && r.ok) {
      this.counters.autoBlacklisted += 1;
      this.log.warn(
        `auto rate-limit blacklist: ip=${ip} kills=${arr.length}/${AUTO_BLACKLIST_KILLS} `
        + `in ${AUTO_BLACKLIST_WINDOW_MS / 60_000}min${r.existed ? ' (refreshed)' : ''}`
      );
      arr.length = 0; // 拉黑后清窗（后续拒绝发生在升级/握手层，不再计入 4008 窗）
    }
  }

  /**
   * v1.7 A5：无凭证自计数增量（UTC 日惰性重置，killsToday 同款）。
   * 口径 = 前端估算卡同款公式（msgsIn/20 + conns + alarms，20:1 入站消息折算），
   * 多 isolate 有误差——宁误 shed（当日复位即恢复、管理页可手动清除）不漏 shed。
   */
  _selfCountInc(field) {
    const today = utcDayStamp();
    if (this._selfCount.date !== today) {
      this._selfCount = { date: today, msgs: 0, conns: 0, alarms: 0 };
    }
    this._selfCount[field] += 1;
    this._selfCountDirty = true;
  }

  /** v1.7 A5：无凭证自计数粗估（当日已用请求数估算；有凭证部署不使用本路径） */
  _selfEstimate() {
    const today = utcDayStamp();
    if (this._selfCount.date !== today) {
      this._selfCount = { date: today, msgs: 0, conns: 0, alarms: 0 };
      return 0;
    }
    return Math.ceil(this._selfCount.msgs / 20) + this._selfCount.conns + this._selfCount.alarms;
  }

  /**
   * v1.7 A5：额度 shed 检查（alarm 内 15 分钟门控调用）。
   * 有凭证（CF_ACCOUNT_ID + CF_API_TOKEN）→ GraphQL 账号当日真实用量
   * （复用额度卡链路 _fetchQuota，出站调用不吃入站请求额度）；
   * 无凭证 → DO 自计数粗估（_selfEstimate）。
   * 滞回：≥90% 激活、<85% 清除；查询失败/形状异常不动作（不误清也不误激活）。
   */
  async _checkQuotaShed() {
    // v1.7 复核修复：shed 键 KV 写失败后的幂等重试（每轮检查一次，非脏零开销）
    await this.audit.retryShedKvIfDirty();
    const account = this.config.cfAccountId;
    const token = this.config.cfApiToken;
    let usage = null;
    if (account && token) {
      const r = await this._fetchQuota(account, token, Date.now());
      // v1.7 复核修复：阈值口径只用 requests 单维——errors 是 requests 的子集
      // （再加一次属重复计数）、subrequests 不是 Workers 10 万请求配额的维度；
      // 三者相加会让阈值提前约一倍触发。subrequests/errors 仍在额度卡展示。
      if (r && r.source === 'cloudflare') usage = Number(r.requests) || 0;
    } else {
      usage = this._selfEstimate();
    }
    if (usage == null) return;
    const limit = FREE_DAILY_REQUESTS;
    if (!this.audit.shedActive && usage >= limit * SHED_ACTIVATE_RATIO) {
      await this.audit.setShedFlag(true);
      this.log.warn(`quota shed ACTIVATED: usage=${usage}/${limit} (>=${SHED_ACTIVATE_RATIO * 100}%) — new connections rejected until usage drops or UTC reset`);
    } else if (this.audit.shedActive && usage < limit * SHED_RESUME_RATIO) {
      await this.audit.setShedFlag(false);
      this.log.info(`quota shed cleared: usage=${usage}/${limit} (<${SHED_RESUME_RATIO * 100}%)`);
    }
  }

  async alarm() {
    await this._initPromise;
    // v1.7 复核修复：alarm 可能是 DO 代际的首个事件（持久化闹钟唤醒、无 fetch）——
    // 审计必须在任何 record/flush 之前完成恢复，否则快照会被未初始化数据覆盖
    await this._ensureAuditInit();
    const now = Date.now();
    const cfg = this.config;
    this.counters.alarmCount = (this.counters.alarmCount || 0) + 1; // v1.5 额度估算用
    this._selfCountInc('alarms'); // v1.7 A5：无凭证自计数（alarm 每次 = 1 个 DO 请求）
    this._maybeWriteDot(now); // v1.6 A5：AE 趋势打点（≥60s 一次，未绑定 AE 静默跳过）

    for (const ws of this.state.getWebSockets()) {
      if (ws.readyState !== WS_OPEN) continue;
      const lastSeen = this._getLastSeen(ws);

      // 防线 a：未握手超时
      if (ws._peerId == null) {
        const connectedAt = this._loadAttachment(ws).connectedAt ?? now;
        if (now - connectedAt > cfg.handshakeTimeoutMs) {
          this.log.info('closing un-handshaked socket (timeout)');
          this._close(ws, WS_CLOSE.TIMEOUT, 'handshake timeout');
        }
        continue;
      }

      // 防线 b：空闲超时（超过客户端最大 ping 间隔 32s 的安全余量）
      if (now - lastSeen > cfg.peerIdleTimeoutMs) {
        this.log.info(`peer=${ws._peerId} idle timeout, closing`);
        this._close(ws, WS_CLOSE.TIMEOUT, 'idle timeout');
        this._cleanupPeer(ws, 'idle-timeout');
        continue;
      }

      // 防线 c：主动探活（半开连接会因写失败快速触发 close）
      if (cfg.serverPingIdleMs > 0 && now - lastSeen > cfg.serverPingIdleMs && !ws._serverPingSent) {
        ws._serverPingSent = true;
        this._send(ws, buildPacket(
          this.config.serverPeerId, ws._peerId, PacketType.Ping,
          randomBytes(8)
        ));
      }
    }

    // 幽灵节点老化（官方 clear_expired_peer 语义：不可达 90s / 死亡 3660s）
    const expiredRoutes = this.pm.cleanupExpiredRouteInfos(now);
    for (const { groupKey, removed } of expiredRoutes) {
      this._markDirty();
      this.log.info(`route info expired: group=${groupKey} peers=[${removed.join(',')}]`);
      this._broadcast(groupKey, null);
    }

    // 空分组自动删除（含路由条目与摘要注册解除）
    const deletedGroups = this.pm.autoDeleteEmptyGroups(cfg.groupAutoDeleteMs, now);
    for (const dg of deletedGroups) {
      this._markDirty();
      this.log.info(`group auto-deleted (empty): key=${dg.groupKey} network=${dg.networkName}`);
    }

    // 持久化（脏数据节流，至少间隔 30s；立即场景由 _markDirty+短 alarm 处理）
    if (this._dirty && now - this._storageFlushAt >= 30_000) {
      await this._flushState();
    }

    // 留存清理（v1.6.0 C4）：至多每小时一次，按 AUDIT_RETENTION_DAYS 删过期记录
    if (cfg.auditRetentionDays > 0 && now - (this._lastPruneAt || 0) >= 3_600_000) {
      this._lastPruneAt = now;
      const pruned = this.audit.pruneExpired(now);
      if (pruned > 0) this.log.info(`audit retention pruned ${pruned} records (> ${cfg.auditRetentionDays}d)`);
    }

    // KV 审计刷盘：DO storage 脏即写；KV 镜像按 RECORD_FLUSH_MS 节流
    if (this.audit.isDirty()) {
      await this.audit.flush(now);
    }

    // v1.7 C5：黑名单降级恢复——init 时 KV 恢复失败则按 60s 节流重试
    //（成功即清除降级态；仅降级态存在，读配额 ≤5,760/天，评估见规划 §3 补录）
    if (this.audit.blDegraded && now - this._lastBlReloadAt >= 60_000) {
      this._lastBlReloadAt = now;
      await this.audit.reloadBlacklists();
    }

    // v1.7 A5：额度 shed 检查（15 分钟门控，≤96 次/天；有凭证走 GraphQL 账号用量，
    // 无凭证回退自计数粗估——评估见规划 §3「额度影响评估补录」）
    if (now - (this._lastShedCheckAt || 0) >= SHED_CHECK_MS) {
      this._lastShedCheckAt = now;
      try {
        await this._checkQuotaShed();
      } catch (e) {
        this.log.warn(`quota shed check failed: ${e && e.message}`);
      }
    }

    // v1.7 D5：kill 日计数持久化（UTC 日重置；挂 flush/alarm 节奏，非逐次）
    if (this._killsDirty) {
      try {
        await this.state.storage.put(KILLS_KEY, {
          date: this._killsDate || utcDayStamp(),
          count: this.counters.killsToday,
        });
        this._killsDirty = false;
      } catch (e) {
        this.log.warn(`persist kills today failed: ${e.message}`);
      }
    }

    // v1.7 A5：无凭证自计数持久化（同 killsToday 节奏；storage 不计请求数）
    if (this._selfCountDirty) {
      try {
        await this.state.storage.put(SELF_COUNT_KEY, this._selfCount);
        this._selfCountDirty = false;
      } catch (e) {
        this.log.warn(`persist self count failed: ${e.message}`);
      }
    }

    // v1.7 B9：RPC 重组事务 TTL 扫描（官方 server 10s 同款；feed 路径另有懒扫兜底）
    for (const [k, e] of this.rpcMerger) {
      if (now - e.lastAt > RPC_MERGER_TTL_MS) this.rpcMerger.delete(k);
    }

    // 重新挂 alarm（自适应排程：有连接时对齐最近的 socket 事件时刻，
    // 完全空闲时退避到 sweepIdleIntervalMs，见 _nextAlarmDelay）
    try {
      await this.state.storage.setAlarm(now + this._nextAlarmDelay(now));
    } catch (e) {
      this.log.warn(`re-arm alarm failed: ${e.message}`);
    }
  }

  /**
   * 自适应 alarm 排程（v1.4.0）：返回距下次 alarm 的毫秒数。
   * - 有连接：min(sweepIntervalMs, 最早的 socket 事件时刻)，事件 =
   *   未握手超时截止 / 探活触发 / 空闲超时截止（探活先于空闲超时发生）；
   * - 无连接但有脏数据/审计待刷：sweepIntervalMs（尽快走完清扫落盘路径）；
   * - 完全空闲：sweepIdleIntervalMs（0 则退回 sweepIntervalMs）。
   * 下限 1000ms：防止事件截止时刻密集导致的秒级连环唤醒。
   */
  _nextAlarmDelay(now) {
    const cfg = this.config;
    let earliest = Infinity;
    for (const ws of this.state.getWebSockets()) {
      if (ws.readyState !== WS_OPEN) continue;
      if (ws._peerId == null) {
        const meta = this._loadAttachment(ws);
        const connectedAt = meta.connectedAt ?? now;
        earliest = Math.min(earliest, connectedAt + cfg.handshakeTimeoutMs);
        continue;
      }
      const lastSeen = this._getLastSeen(ws);
      if (cfg.serverPingIdleMs > 0) {
        earliest = Math.min(earliest, lastSeen + cfg.serverPingIdleMs);
      }
      earliest = Math.min(earliest, lastSeen + cfg.peerIdleTimeoutMs);
    }
    if (earliest !== Infinity) {
      return Math.max(1_000, Math.min(cfg.sweepIntervalMs, earliest - now));
    }
    // v1.7 复核修复：用 hasFlushableDirty——A4 预算跳过键（等待次日）不应把
    // 空闲房间从 idle 退避拉回 15s 节奏（否则 5,760 请求/天，抵消 A4/A5 目的）
    if (this._dirty || this.audit.hasFlushableDirty()) return cfg.sweepIntervalMs;
    const idle = cfg.sweepIdleIntervalMs > 0 ? cfg.sweepIdleIntervalMs : cfg.sweepIntervalMs;
    return idle;
  }

  _markDirty() {
    this._dirty = true;
    // 成员变化尽快落盘：仅在「无 alarm 或已有 alarm 比目标更晚」时才安排短 alarm。
    // v1.4.0 修复：原版无条件 setAlarm(now+2000) 会（a）持续抖动时把闹钟无限推迟
    // 造成清扫饥饿（幽灵节点/路由老化/落盘停摆），（b）产生冗余 storage 写，
    // （c）破坏自适应排程把房间拽回 2s 一醒。现在绝不推迟已有更早的闹钟。
    const target = Date.now() + 2000;
    try {
      this.state.storage.getAlarm().then((cur) => {
        if (cur === null || cur > target) {
          return this.state.storage.setAlarm(target);
        }
      }).catch(() => {});
    } catch { /* ignore */ }
  }

  async _flushState() {
    this._storageFlushAt = Date.now();
    // 落盘预算降级：DO storage 单值上限 128 KiB。raw 字节
    // 以 JSON 数字数组持久化（4-5× 膨胀），被注入的巨型状态曾估算可超限——
    // 超限后每次 flush 白写（浪费存储写入）、重启丢状态。失败即降级重试
    //（正常网络永不触发、零额外开销）：全量 → 丢 raw（退对象路径）→ 裁剪最老条目。
    try {
      try {
        await this.state.storage.put(STATE_KEY, this.pm.toPersisted());
      } catch (e1) {
        this.counters.flushDegraded += 1;
        this.log.warn(`flush state over budget, retrying without raw bytes: ${e1.message}`);
        try {
          await this.state.storage.put(STATE_KEY, this.pm.toPersisted({ dropRaw: true }));
        } catch (e2) {
          this.counters.flushDegraded += 1;
          this.log.warn(`flush state still over budget, trimming oldest entries: ${e2.message}`);
          await this.state.storage.put(STATE_KEY, this.pm.toPersisted({ dropRaw: true, trimEntries: 16 }));
        }
      }
      // 仅在写盘成功后复位——三档全失败时保留脏标记，下个 alarm 自动重试
      this._dirty = false;
    } catch (e) {
      this.log.warn(`flush state failed: ${e.message}`);
    }
  }

  // -------------------------------------------------------------------
  // 管理端操作（由 Worker 入口鉴权后经 /internal/* 调用）
  // -------------------------------------------------------------------

  /**
   * /internal/state 与 /internal/stats 共用的配置视图。
   * 白名单式输出——cfApiToken 等敏感项绝不进入（cfAccountId 亦不列出）。
   */
  _configView() {
    const c = this.config;
    return {
      // —— 既有对外字段（顺序与语义保持不变）——
      serverHostname: c.serverHostname,
      serverVersionStr: c.serverVersionStr,
      serverNetworkName: c.serverNetworkName,
      avoidRelayData: c.avoidRelayData,
      relayData: c.relayData,
      strictDigest: c.strictDigest,
      maxPeersPerRoom: c.maxPeersPerRoom,
      maxPeersPerGroup: c.maxPeersPerGroup,
      maxConnsPerIp: c.maxConnsPerIp,
      maxMessageBytes: c.maxMessageBytes,
      msgRateLimitPerSec: c.msgRateLimitPerSec,
      handshakeTimeoutMs: c.handshakeTimeoutMs,
      peerIdleTimeoutMs: c.peerIdleTimeoutMs,
      serverPingIdleMs: c.serverPingIdleMs,
      sweepIntervalMs: c.sweepIntervalMs,
      sweepIdleIntervalMs: c.sweepIdleIntervalMs,
      digestValidation: !!c.networkSecrets,
      routeInfoTtlMs: c.routeInfoTtlMs,
      routeInfoUnreachableMs: c.routeInfoUnreachableMs,
      groupAutoDeleteMs: c.groupAutoDeleteMs,
      // 资源滥用防线
      maxSyncItems: c.maxSyncItems,
      maxRouteInfoBytes: c.maxRouteInfoBytes,
      maxRoutesPerGroup: c.maxRoutesPerGroup,
      maxDirectPeersReport: c.maxDirectPeersReport,
      fullResyncCooldownMs: c.fullResyncCooldownMs,
      // —— v1.6.2 补齐：协议与运维参数此前不可见 ——
      maxNetworkNameBytes: c.maxNetworkNameBytes,
      recordFlushMs: c.recordFlushMs,
      recordDefaultLimit: c.recordDefaultLimit,
      blacklistLimit: c.blacklistLimit,
      adminAudit: c.adminAudit,
      adminAuditLimit: c.adminAuditLimit,
      auditIpMask: c.auditIpMask,
      auditRetentionDays: c.auditRetentionDays,
      cfScriptName: c.cfScriptName,
      aeDataset: c.aeDataset,
    };
  }

  /** 管理端操作收尾：审计记录 + 强制刷盘（管理操作低频，每次 1 次 KV 写） */
  async _adminOp(adminIp, action, meta = {}) {
    this.audit.adminTouch(adminIp, 'op', { action, ...meta });
    await this.audit.flush(Date.now(), { forceKv: true });
  }

  /**
   * 分页状态快照（管理端按 tab 拉取；sockets tab 由本层处理，其余委托 pm）。
   * params: {tab, offset, limit, groupKey}
   */
  _snapshotState(params = {}) {
    const tab = String(params.tab || 'overview');
    const offset = Number.isInteger(params.offset) && params.offset > 0 ? params.offset : 0;
    const limit = Number.isInteger(params.limit) && params.limit > 0
      ? Math.min(200, params.limit) : 50;

    let snap;
    if (tab === 'sockets') {
      const items = [];
      for (const ws of this.state.getWebSockets()) {
        items.push({
          socketId: ws._socketId ?? null,
          peerId: ws._peerId ?? null,
          groupKey: ws._groupKey ?? null,
          handshaked: ws._peerId != null,
          connectedAt: ws._connectedAt ?? null,
          lastSeen: this._getLastSeen(ws),
          ...(ws._clientIp ? { ip: ws._clientIp } : {}),
        });
      }
      items.sort((a, b) => (b.connectedAt || 0) - (a.connectedAt || 0));
      snap = {
        tab,
        total: items.length,
        offset,
        limit,
        items: items.slice(offset, offset + limit),
        stats: this._socketCounts(),
      };
    } else {
      snap = this.pm.snapshotState({
        tab,
        offset,
        limit,
        groupKey: params.groupKey,
        getLastSeen: (ws) => this._getLastSeen(ws),
      });
    }
    // 总览补充：连接列表统计（侧边栏计数）+ 审计（记录/黑名单）概览
    if (tab === 'overview') {
      snap.stats = snap.stats || {};
      snap.stats.sockets = this._socketCounts();
      snap.stats.audit = {
        records: this.audit._counts(),
        blacklist: this.audit.blacklistCounts(),
        kvEnabled: !!this.audit.kv,
        // v1.7 复核修复：A4 预算视图补齐——管理页统计卡读 s.audit.kvBudget，
        // 此前只有 /internal/stats 的 _stats() 提供，/api/state 缺字段导致
        // 页面恒显示 fallback 值（0/900）
        kvBudget: { ...this.audit.kvBudget, budget: KV_WRITE_DAILY_BUDGET },
      };
    }
    return {
      ok: true,
      ...snap,
      startedAt: this.startedAt,
      uptimeSec: Math.floor((Date.now() - this.startedAt) / 1000),
      serverPeerId: this.config.serverPeerId,
      counters: this.counters,
      // v1.7 复核修复：C5/D5/A5 降级态数据源补齐（管理页统计卡与 shed 横幅读
      // s.blDegraded / s.shed；此前只在 _stats()/prometheus 提供）
      blDegraded: !!this.audit.blDegraded,
      shed: this.audit.shedActive === true,
      config: this._configView(),
    };
  }

  /**
   * 删除分组（管理端，支持批量）：断开组内全部连接、清除路由/会话数据，
   * 并在无同网络兄弟分组时删除摘要注册表条目。
   * 网络名同时进入黑名单 group 类（该网络的后续握手将被拒绝，可在黑名单页解除）。
   * body: {groupKey} | {groupKeys:[]} | {networkName} | {all:true}
   */
  async _deleteGroups(body, adminIp = '') {
    const targets = [];
    if (body && Array.isArray(body.groupKeys)) {
      for (const raw of body.groupKeys) {
        const gk = String(raw);
        if (this.pm.groups.has(gk) && !targets.includes(gk)) targets.push(gk);
      }
    } else if (body && body.all === true) {
      for (const gk of this.pm.groups.keys()) targets.push(gk);
    } else if (body && body.groupKey) {
      const gk = String(body.groupKey);
      if (this.pm.groups.has(gk)) targets.push(gk);
    } else if (body && body.networkName) {
      const name = String(body.networkName);
      for (const gk of this.pm.groups.keys()) {
        const g = this.pm.groups.get(gk);
        if ((g.networkName || gk.slice(0, gk.lastIndexOf(':'))) === name) targets.push(gk);
      }
    } else {
      return { ok: false, error: 'groupKey / groupKeys / networkName / all required' };
    }

    const deleted = [];
    for (const gk of targets) {
      const info = this.pm.clearGroup(gk);
      let closed = 0;
      for (const ws of this.state.getWebSockets()) {
        if (ws._groupKey === gk) {
          this._cleanupPeer(ws, 'group-deleted');
          this._close(ws, WS_CLOSE.GROUP_DELETED, 'group deleted');
          closed += 1;
        }
      }
      // 黑名单（digest 类，v1.4.2 安全加固）：拉黑「网络名+摘要」完整粒度——
      // 被删分组对应的抢占者摘要被精确拦截，同网络其它摘要（正主）不受影响；
      // 原先拉黑纯网络名会让管理员操作反而封锁合法用户。
      this.audit.blacklistAdd('digest', gk, {
        reason: 'group deleted by admin', networkName: info.networkName,
      });
      deleted.push({ groupKey: gk, networkName: info.networkName, closedPeers: closed });
      this.log.info(`admin: group deleted key=${gk} network=${info.networkName} closed=${closed}`);
    }
    if (deleted.length) {
      this._dirty = true;
      await this._flushState();
    }
    await this._adminOp(adminIp, 'group-delete', { count: deleted.length });
    return { ok: true, deleted };
  }

  /**
   * 踢出节点（管理端，支持批量）：关闭连接并广播路由更新。
   * body: {groupKey, peerId} | {peers: [{groupKey, peerId}]}
   */
  _kickPeers(body) {
    const kicks = [];
    if (body && Array.isArray(body.peers)) {
      for (const p of body.peers) {
        if (p && p.groupKey) kicks.push({ groupKey: String(p.groupKey), peerId: Number(p.peerId) });
      }
    } else if (body && body.groupKey) {
      kicks.push({ groupKey: String(body.groupKey), peerId: Number(body.peerId) });
    }
    if (!kicks.length) {
      return { ok: false, error: 'peers (array) or groupKey+peerId required' };
    }
    const kicked = [];
    const notFound = [];
    for (const { groupKey, peerId } of kicks) {
      if (!Number.isInteger(peerId) || peerId <= 0) continue;
      const ws = this.pm.getPeer(groupKey, peerId);
      if (!ws) { notFound.push({ groupKey, peerId }); continue; }
      this._cleanupPeer(ws, 'kicked');
      this._close(ws, WS_CLOSE.KICKED, 'kicked');
      // 黑名单（peer 类）：该 PeerId 后续握手被拒
      this.audit.blacklistAdd('peer', peerId, { reason: 'kicked by admin', groupKey });
      kicked.push({ groupKey, peerId });
      this.log.info(`admin: kicked peer=${peerId} group=${groupKey}`);
    }
    return { ok: true, kicked, notFound };
  }

  /**
   * 删除路由条目（管理端，支持批量）：body: {groupKey, peerIds:[]}
   */
  _deleteRouteInfos(body) {
    const groupKey = String((body && body.groupKey) || '');
    const peerIds = Array.isArray(body && body.peerIds) ? body.peerIds : [];
    if (!groupKey || !peerIds.length) {
      return { ok: false, error: 'groupKey and peerIds required' };
    }
    const r = this.pm.clearRouteInfos(groupKey, peerIds);
    if (r.ok && r.removed.length) {
      this._markDirty();
      this._broadcast(groupKey, null);
      this.log.info(`admin: route infos deleted group=${groupKey} peers=[${r.removed.join(',')}]`);
    }
    return r;
  }

  /**
   * 删除摘要注册项（管理端，支持批量）：body: {networkNames:[]}
   * 同时清除使用该摘要的分组（关闭其连接）。
   * 网络名同时进入黑名单 digest 类（该网络名的后续握手被拒）。
   */
  async _deleteDigests(body, adminIp = '') {
    const networkNames = Array.isArray(body && body.networkNames)
      ? body.networkNames.map(String)
      : (body && body.networkName ? [String(body.networkName)] : []);
    if (!networkNames.length) {
      return { ok: false, error: 'networkNames required' };
    }
    const r = this.pm.deleteDigests(networkNames);
    // 黑名单（digest 类，v1.4.2 安全加固）：按被删注册的完整「网络名:摘要」
    // 粒度拉黑——被删的抢占者摘要被拦截，同网络其它摘要不受影响
    //（本操作用于解锁抢占，拉黑整个网络名会连正主一并封锁）。
    for (const x of r.results || []) {
      if (!x.existed) continue;
      this.audit.blacklistAdd('digest', `${x.networkName}:${x.digest}`, {
        reason: 'digest deleted by admin', networkName: x.networkName,
      });
    }
    // 关闭被清除分组内的连接（分组已删，按 socket 的 groupKey 匹配）
    let closedTotal = 0;
    const clearedGroupKeys = new Set(
      (r.results || []).filter((x) => x.existed).map((x) => `${x.networkName}:${x.digest}`)
    );
    if (clearedGroupKeys.size > 0) {
      for (const ws of this.state.getWebSockets()) {
        if (ws._groupKey == null || !clearedGroupKeys.has(ws._groupKey)) continue;
        this._cleanupPeer(ws, 'digest-deleted');
        this._close(ws, WS_CLOSE.DIGEST_DELETED, 'digest deleted');
        closedTotal += 1;
      }
    }
    if (closedTotal > 0 || (r.results || []).some((x) => x.existed)) {
      this._dirty = true;
      await this._flushState();
      this.log.info(`admin: digests deleted names=[${networkNames.join(',')}] closed=${closedTotal}`);
    }
    await this._adminOp(adminIp, 'digest-delete', { count: networkNames.length });
    return { ok: true, ...r, closedPeers: closedTotal };
  }

  /**
   * 删除 PeerCenter 互联表条目（管理端，支持批量）：body: {groupKey, peerIds:[]}
   */
  _deletePeerCenter(body) {
    const groupKey = String((body && body.groupKey) || '');
    const peerIds = Array.isArray(body && body.peerIds) ? body.peerIds : [];
    if (!groupKey || !peerIds.length) {
      return { ok: false, error: 'groupKey and peerIds required' };
    }
    const r = this.pm.clearPeerCenter(groupKey, peerIds);
    if (r.ok && r.removed.length) {
      this._markDirty();
      this.log.info(`admin: peercenter entries deleted group=${groupKey} peers=[${r.removed.join(',')}]`);
    }
    return r;
  }

  /**
   * 断开连接（管理端，支持批量）：body: {socketIds:[]}
   * 已知客户端 IP 同时进入黑名单 socket 类（该 IP 的后续连接被拒）。
   */
  _closeSockets(body) {
    const socketIds = Array.isArray(body && body.socketIds)
      ? body.socketIds.map(Number).filter((n) => Number.isInteger(n) && n > 0)
      : [];
    if (!socketIds.length) {
      return { ok: false, error: 'socketIds required' };
    }
    const wanted = new Set(socketIds);
    const closed = [];
    const notFound = [...wanted];
    for (const ws of this.state.getWebSockets()) {
      const id = ws._socketId;
      if (id == null || !wanted.has(id)) continue;
      // 黑名单（socket 类）：该客户端 IP 的后续连接被拒
      if (ws._clientIp) {
        this.audit.blacklistAdd('socket', ws._clientIp, {
          reason: 'closed by admin', ...(id != null ? { socketId: id } : {}),
        });
      }
      this._cleanupPeer(ws, 'admin-closed');
      this._close(ws, WS_CLOSE.ADMIN_CLOSED, 'closed by admin');
      closed.push(id);
      const idx = notFound.indexOf(id);
      if (idx >= 0) notFound.splice(idx, 1);
    }
    if (closed.length) this.log.info(`admin: sockets closed ids=[${closed.join(',')}]`);
    return { ok: true, closed, notFound };
  }

  // -------------------------------------------------------------------
  // 统计
  // -------------------------------------------------------------------

  _stats() {
    const groups = {};
    for (const [gk, g] of this.pm.groups) {
      groups[gk] = {
        networkName: g.networkName || gk.slice(0, gk.lastIndexOf(':')),
        peers: Array.from(g.peers.keys()),
        knownInfos: g.infos.size,
      };
    }
    // 连接列表统计（v1.6.0 补齐：此前 JSON 只含 peers/groups 总数）
    return {
      ok: true,
      startedAt: this.startedAt,
      uptimeSec: Math.floor((Date.now() - this.startedAt) / 1000),
      serverPeerId: this.config.serverPeerId,
      totalPeers: this.pm.totalPeers(),
      groupCount: this.pm.groupCount(),
      groups,
      counters: this.counters,
      sockets: this._socketCounts(),
      // v1.7 D5：黑名单降级态（prometheus gauge easytier_blacklist_degraded / 总览红显）
      blDegraded: !!this.audit.blDegraded,
      // v1.7 A5：额度 shed 激活态（prometheus gauge easytier_shed_active / 总览红显 +
      // 额度卡横幅；激活期间新连接被 429 拒绝，存量会话不受影响）
      shed: this.audit.shedActive === true,
      audit: {
        kvEnabled: !!this.audit.kv,
        records: this.audit._counts(),
        blacklist: this.audit.blacklistCounts(),
        // v1.7 A4：KV 写日预算用量（date=UTC 日戳 / used=尝试数 / budget=上限）
        kvBudget: { ...this.audit.kvBudget, budget: KV_WRITE_DAILY_BUDGET },
      },
      // v1.6.0：config 对齐管理端白名单（此前仅 6 项，落后多个版本）
      config: this._configView(),
    };
  }

  // -------------------------------------------------------------------
  // 账号级真实额度（v1.6.0 A6）
  // -------------------------------------------------------------------

  /**
   * 额度查询（恒 200，响应恒带 ok:true —— 管理端统一门禁字段，与 /internal/trends
   * 同约定；前端按 source 渲染三态）：
   * - unconfigured：未配置 CF_ACCOUNT_ID/CF_API_TOKEN（零配置行为不变）；
   * - cloudflare：真实数据（DO storage 缓存 5 分钟，失败缓存 1 分钟）；
   * - unavailable：查询失败（凭证失效/API 变更等），管理页回退估算。
   * 响应体绝不包含 CF_API_TOKEN（仅聚合计数）。
   */
  async _handleQuota() {
    const account = this.config.cfAccountId;
    const token = this.config.cfApiToken;
    if (!account || !token) {
      return Response.json({ ok: true, source: 'unconfigured', dailyQuota: FREE_DAILY_REQUESTS });
    }
    const now = Date.now();
    try {
      const cached = await this.state.storage.get(QUOTA_CACHE_KEY);
      if (cached && typeof cached.fetchedAt === 'number') {
        const ttl = cached.source === 'cloudflare' ? QUOTA_CACHE_MS : QUOTA_FAIL_CACHE_MS;
        if (now - cached.fetchedAt < ttl) {
          return Response.json({ ok: true, ...cached, cached: true });
        }
      }
    } catch { /* 缓存读失败 → 直接查询 */ }
    const result = await this._fetchQuota(account, token, now);
    try {
      await this.state.storage.put(QUOTA_CACHE_KEY, result);
    } catch { /* 缓存写失败不影响返回 */ }
    return Response.json({ ok: true, ...result, cached: false });
  }

  /** 带超时的出站 fetch（额度查询 5s / AE 查询 8s 共用）：超时 abort，调用方负责解析响应 */
  async _fetchWithTimeout(url, init, timeoutMs) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      return await fetch(url, { ...init, signal: ctrl.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  /** 出站调 Cloudflare GraphQL Analytics API（出站调用不消耗 100k 入站请求额度） */
  async _fetchQuota(account, token, now) {
    const untilDate = new Date(now);
    // 统计窗口：当日 UTC 0 点 → 现在（免费计划额度每日 UTC 0 点重置 = 北京 8 点）
    const since = new Date(Date.UTC(
      untilDate.getUTCFullYear(), untilDate.getUTCMonth(), untilDate.getUTCDate()
    ));
    // 按小时桶取数（一天至多 24 行）后跨行求和：行数受控，limit 截断不再低估当日请求数；
    // datetime_leq 为官方 schema 拼写（geq/leq 一对）
    const query = `query($account: String!, $script: String!, $since: Time!, $until: Time!) {
      viewer { accounts(filter: { accountTag: $account }) {
        workersInvocationsAdaptive(
          limit: 1000,
          filter: { scriptName: $script, datetime_geq: $since, datetime_leq: $until },
          orderBy: [datetimeHour_ASC]
        ) { dimensions { datetimeHour } sum { requests subrequests errors } }
      } }
    }`;
    try {
      const res = await this._fetchWithTimeout('https://api.cloudflare.com/client/v4/graphql', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          query,
          variables: {
            account,
            script: this.config.cfScriptName,
            since: since.toISOString(),
            until: untilDate.toISOString(),
          },
        }),
      }, 5000);
      const j = await res.json();
      if (!res.ok || (j.errors && j.errors.length)) {
        const msg = (j.errors && j.errors[0] && j.errors[0].message) || `HTTP ${res.status}`;
        return { source: 'unavailable', error: String(msg).slice(0, 200), fetchedAt: now };
      }
      const rows = j && j.data && j.data.viewer && j.data.viewer.accounts
        && j.data.viewer.accounts[0] && j.data.viewer.accounts[0].workersInvocationsAdaptive;
      if (!Array.isArray(rows)) {
        return { source: 'unavailable', error: 'unexpected graphql shape', fetchedAt: now };
      }
      let requests = 0; let subrequests = 0; let errors = 0;
      for (const row of rows) {
        const s = (row && row.sum) || {};
        requests += Number(s.requests) || 0;
        subrequests += Number(s.subrequests) || 0;
        errors += Number(s.errors) || 0;
      }
      return {
        source: 'cloudflare',
        requests, subrequests, errors,
        sinceIso: since.toISOString(),
        untilIso: untilDate.toISOString(),
        scriptName: this.config.cfScriptName,
        fetchedAt: now,
      };
    } catch (e) {
      return { source: 'unavailable', error: String((e && e.message) || e).slice(0, 200), fetchedAt: now };
    }
  }

  // -------------------------------------------------------------------
  // Analytics Engine 趋势打点与查询（v1.6.0 A5/D2）
  // -------------------------------------------------------------------

  /**
   * alarm 周期打点：每 ≥60s 一个数据点（空闲退避时随 alarm 间隔自然变稀疏）。
   * 列映射（后续 AE SQL 按列号引用，勿调换顺序）：
   *   double1 在线节点数 | double2 分组数 | double3 收包累计 | double4 发包累计
   *   double5 流量累计(字节) | double6 累计连接 | double7 协议错误 | double8 alarm 累计
   * blob1 服务端版本（低基数）。计数器随 DO 重启归零属预期（趋势按增量/钳零展示）。
   * 未绑定 AE（env.AE 缺失）时静默跳过——零配置行为不变。
   */
  _maybeWriteDot(now) {
    const ae = this.env && this.env.AE;
    if (!ae || typeof ae.writeDataPoint !== 'function') return;
    if (now - (this._lastDotAt || 0) < AE_DOT_INTERVAL_MS) return;
    this._lastDotAt = now;
    try {
      ae.writeDataPoint({
        indexes: ['relay'],
        blobs: [this.config.serverVersionStr || ''],
        doubles: [
          this.pm.totalPeers(),
          this.pm.groupCount(),
          this.counters.msgsIn || 0,
          this.counters.msgsOut || 0,
          (this.counters.bytesIn || 0) + (this.counters.bytesOut || 0),
          this.counters.connsTotal || 0,
          this.counters.errors || 0,
          this.counters.alarmCount || 0,
        ],
      });
    } catch (e) {
      this.log.warn(`ae writeDataPoint failed: ${e && e.message || e}`);
    }
  }

  /**
   * 趋势查询（恒 200，前端按 source 渲染）：
   * - unconfigured：未绑定 AE 或未配 CF 凭证（reason: ae_not_bound / credentials_missing）；
   * - ae：返回分桶点列 [{t, peers, msgsPerMin}]。
   * 首选 SQL 服务端分桶（intDiv/toUInt32）；该查询失败时回退原始点查询 +
   * 服务端 JS 聚合（AE SQL 方言未文档化全部函数，防御式兼容）。
   * 结果缓存 5 分钟（防 30s 自动刷新打爆 SQL API）。
   */
  async _handleTrends(url) {
    const ae = this.env && this.env.AE;
    const account = this.config.cfAccountId;
    const token = this.config.cfApiToken;
    if (!ae || !account || !token) {
      return Response.json({
        ok: true, source: 'unconfigured',
        reason: !ae ? 'ae_not_bound' : 'credentials_missing',
      });
    }
    const window = url.searchParams.get('window') === '7d' ? '7d' : '24h';
    const now = Date.now();
    const cacheKey = 'trends_cache_' + window;
    try {
      const cached = await this.state.storage.get(cacheKey);
      if (cached && typeof cached.fetchedAt === 'number' && now - cached.fetchedAt < TRENDS_CACHE_MS) {
        return Response.json({ ...cached, cached: true });
      }
    } catch { /* 缓存读失败 → 直接查询 */ }
    const hours = window === '7d' ? 168 : 24;
    const bucketSec = TRENDS_BUCKET_SEC[window];
    let result;
    try {
      result = await this._trendsSqlBuckets(account, token, hours, bucketSec, now);
    } catch (e) {
      // SQL 分桶查询失败（方言差异/超时等）→ 回退原始点 JS 聚合
      try {
        result = await this._trendsRawFallback(account, token, hours, bucketSec, now);
      } catch (e2) {
        result = { source: 'unavailable', error: String((e2 && e2.message) || e2).slice(0, 200), fetchedAt: now };
      }
    }
    const payload = { ok: true, window, bucketSec, ...result };
    try {
      await this.state.storage.put(cacheKey, payload);
    } catch { /* 缓存写失败不影响返回 */ }
    return Response.json(payload);
  }

  /**
   * SQL 服务端分桶查询：返回 {source:'ae', points, fetchedAt} 或抛错。
   * msgsPerMin = 桶内收包累计增量 / 桶长分钟（DO 重启导致负增量钳为 0）。
   */
  async _trendsSqlBuckets(account, token, hours, bucketSec, now) {
    const { rows } = await this._aeSqlTry(token, this._trendsSqlForms(hours, bucketSec, 'buckets'));
    const points = [];
    const bucketMs = bucketSec * 1000;
    for (const r of rows) {
      // AE JSON 响应按列名取数（data 行对象），与列顺序无关；
      // UInt64 列可能以字符串给出，Number() 对数字/字符串双兼容
      const t = (Number(r.bucket) || 0) * 1000;
      const peers = Number(r.peers) || 0;
      const delta = Math.max(0, (Number(r.mi1) || 0) - (Number(r.mi0) || 0));
      points.push({ t, peers: Math.round(peers * 10) / 10, msgsPerMin: Math.round(delta / (bucketMs / 60000)) });
    }
    return { source: 'ae', points, fetchedAt: now };
  }

  /** 回退：原始点查询（≤LIMIT 10000）+ 服务端 JS 分桶聚合 */
  async _trendsRawFallback(account, token, hours, bucketSec, now) {
    const { rows } = await this._aeSqlTry(token, this._trendsSqlForms(hours, bucketSec, 'raw'));
    const buckets = new Map(); // bucketStartMs -> {peerSum, n, mi0, mi1}
    for (const r of rows) {
      const t = parseAeTimestamp(r.timestamp);
      if (!Number.isFinite(t)) continue;
      const b = Math.floor(t / (bucketSec * 1000)) * bucketSec * 1000;
      const cur = buckets.get(b) || { peerSum: 0, n: 0, mi0: Infinity, mi1: -Infinity };
      const peers = Number(r.double1) || 0;
      const mi = Number(r.double3) || 0;
      cur.peerSum += peers; cur.n += 1;
      cur.mi0 = Math.min(cur.mi0, mi);
      cur.mi1 = Math.max(cur.mi1, mi);
      buckets.set(b, cur);
    }
    const points = [];
    for (const [t, cur] of buckets) {
      const delta = Math.max(0, cur.mi1 - cur.mi0);
      points.push({
        t,
        peers: Math.round((cur.peerSum / Math.max(1, cur.n)) * 10) / 10,
        msgsPerMin: Math.round(delta / (bucketSec / 60)),
      });
    }
    points.sort((a, b) => a.t - b.t);
    return { source: 'ae', points, fetchedAt: now, fallback: true };
  }

  /**
   * AE 查询形态序列（端点 × 方言）：Cloudflare 2026-10 起新增 Analytics SQL API
   * （POST /client/v4/analytics/sql，schema 限定名 events.analyticsEngine."<名>"，
   * 含连字符的数据集名用双引号，WAE 数据集须带 accountTag 过滤）；而旧端点
   * /accounts/<id>/analytics_engine/sql 仍用旧语法——裸名、无任何引号机制，
   * 连字符数据集名在其语法中无法表达（422 Expected end of statement）。
   * 按数据集名是否含连字符生成序列并依次尝试，成功形态在内存记忆
   * （DO 重启后重探测，代价为至多 1 次失败请求/5min 缓存周期）。
   */
  _trendsSqlForms(hours, bucketSec, kind) {
    const acct = this.config.cfAccountId;
    const ds = this.config.aeDataset;
    const OLD = `https://api.cloudflare.com/client/v4/accounts/${acct}/analytics_engine/sql`;
    const NEW = 'https://api.cloudflare.com/client/v4/analytics/sql';
    const time = `timestamp > NOW() - INTERVAL '${hours}' HOUR`;
    const tag = `accountTag = '${acct}'`;
    const dashless = /^[A-Za-z0-9_]+$/.test(ds);
    const pairs = [];
    if (kind === 'buckets') {
      const agg = `intDiv(toUInt32(timestamp), ${bucketSec}) * ${bucketSec} AS bucket, `
        + `avg(double1) AS peers, min(double3) AS mi0, max(double3) AS mi1`;
      if (dashless) {
        pairs.push({ url: OLD, sql: `SELECT ${agg} FROM ${ds} WHERE ${time} GROUP BY bucket ORDER BY bucket ASC FORMAT JSON` });
      }
      pairs.push({ url: NEW, sql: `SELECT ${agg} FROM events.analyticsEngine."${ds}" WHERE ${tag} AND ${time} GROUP BY bucket ORDER BY bucket ASC` });
      if (!dashless) {
        pairs.push({ url: OLD, sql: `SELECT ${agg} FROM ${ds} WHERE ${time} GROUP BY bucket ORDER BY bucket ASC FORMAT JSON` });
      }
    } else {
      const sel = 'timestamp, double1, double3';
      if (dashless) {
        pairs.push({ url: OLD, sql: `SELECT ${sel} FROM ${ds} WHERE ${time} ORDER BY timestamp ASC LIMIT 10000 FORMAT JSON` });
      }
      pairs.push({ url: NEW, sql: `SELECT ${sel} FROM events.analyticsEngine."${ds}" WHERE ${tag} AND ${time} ORDER BY timestamp ASC LIMIT 10000` });
      if (!dashless) {
        pairs.push({ url: OLD, sql: `SELECT ${sel} FROM ${ds} WHERE ${time} ORDER BY timestamp ASC LIMIT 10000 FORMAT JSON` });
      }
    }
    return pairs;
  }

  /** 依次尝试形态序列：成功即记忆形态下标并返回 {rows}；全败抛聚合错误（含各形态诊断原文） */
  async _aeSqlTry(token, forms) {
    const start = Math.max(0, Math.min(this._trendsFormIdx || 0, forms.length - 1));
    const errs = [];
    for (let k = 0; k < forms.length; k++) {
      const i = (start + k) % forms.length;
      try {
        const rows = await this._aeSqlQuery(token, forms[i].url, forms[i].sql);
        this._trendsFormIdx = i;
        return { rows };
      } catch (e) {
        errs.push(`[${i}] ${e && e.message || e}`);
      }
    }
    throw new Error(`全部 ${forms.length} 个 AE 查询形态失败: ${errs.join(' | ').slice(0, 400)}`);
  }

  /** 执行 AE SQL 查询并解析 JSON 响应（响应 {meta,data} 或顶层数组，返回 data 行对象，按列名取数） */
  async _aeSqlQuery(token, url, sql) {
    const res = await this._fetchWithTimeout(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'content-type': 'text/plain' },
      body: sql,
    }, 8000);
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`ae sql HTTP ${res.status}: ${String(body).replace(/\s+/g, ' ').slice(0, 160)}`);
    }
    const j = await res.json();
    if (Array.isArray(j)) return j; // 防御：JSONEachRow 形状（顶层数组）
    return j && Array.isArray(j.data) ? j.data : [];
  }
}

/** AE SQL timestamp 解析：unix 秒数字串或 "YYYY-MM-DD HH:MM:SS"（UTC） */
export function parseAeTimestamp(s) {
  const v = String(s ?? '').trim();
  if (/^\d+$/.test(v)) return Number(v) * 1000;
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (!m) return NaN;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
}
