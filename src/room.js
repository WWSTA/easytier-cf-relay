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
} from './constants.js';
import { parseHeader, buildPacket, bumpForward, payloadOf } from './packet.js';
import { PeerManager, resolveGroupKey } from './peer_manager.js';
import { AuditStore } from './audit.js';
import {
  protoTypes, buildRpcRequest, encodeRoutePush, handleRpcRequest, handleRpcResponse,
} from './rpc.js';
import { toU64Long, randomU64Long } from './proto.js';
import { bytesToHex, randomBytes } from './siphash.js';

const WS_OPEN = 1;
const STATE_KEY = 'room_state';
const BOOT_KEY = 'room_boot';
const ATTACH_SYNC_INTERVAL_MS = 5000;

function str(env, key, def) {
  const v = env && env[key];
  return v === undefined || v === null || v === '' ? def : String(v);
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
  let networkSecrets = null;
  const raw = str(env, 'NETWORK_SECRETS', '');
  if (raw) {
    try {
      networkSecrets = JSON.parse(raw);
    } catch {
      networkSecrets = null;
    }
  }
  return {
    serverPeerId: int(env, 'SERVER_PEER_ID', 10000001) >>> 0,
    serverNetworkName: str(env, 'SERVER_NETWORK_NAME', 'public_server'),
    serverHostname: str(env, 'SERVER_HOSTNAME', 'easytier-cf-relay'),
    serverVersionStr: str(env, 'SERVER_VERSION_STR', 'easytier-cf-relay/1.3.0'),
    avoidRelayData: bool(env, 'AVOID_RELAY_DATA', true),
    relayData: bool(env, 'RELAY_DATA', true),
    maxPeersPerRoom: int(env, 'MAX_PEERS_PER_ROOM', 64),
    maxMessageBytes: int(env, 'MAX_MESSAGE_BYTES', 131072),
    handshakeTimeoutMs: int(env, 'HANDSHAKE_TIMEOUT_MS', 15000),
    peerIdleTimeoutMs: int(env, 'PEER_IDLE_TIMEOUT_MS', 75000),
    serverPingIdleMs: int(env, 'SERVER_PING_IDLE_MS', 40000),
    sweepIntervalMs: int(env, 'SWEEP_INTERVAL_MS', 15000),
    strictDigest: bool(env, 'STRICT_DIGEST', true),
    logLevel: str(env, 'LOG_LEVEL', 'info'),
    networkSecrets,
    // 幽灵节点老化（官方 clear_expired_peer 语义，见 constants.js 注释）
    routeInfoTtlMs: int(env, 'ROUTE_INFO_TTL_MS', 3_660_000),
    routeInfoUnreachableMs: int(env, 'ROUTE_INFO_UNREACHABLE_MS', 90_000),
    // 空分组自动删除宽限（0 = 关闭）
    groupAutoDeleteMs: intOrZero(env, 'GROUP_AUTO_DELETE_MS', 60_000),
    // ---- KV 审计（记录 / 黑名单）----
    recordFlushMs: int(env, 'RECORD_FLUSH_MS', 600_000),
    recordDefaultLimit: int(env, 'RECORD_DEFAULT_LIMIT', 100),
    blacklistLimit: int(env, 'BLACKLIST_LIMIT', 1000),
    adminAudit: bool(env, 'ADMIN_AUDIT', true), // 硬设置：管理端审计不可由管理页关闭
    adminAuditLimit: int(env, 'ADMIN_AUDIT_LIMIT', 200),
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
    this.pm = new PeerManager(this.config);
    // KV 审计：记录（每类一条 KV 键）+ 黑名单（每类一条 KV 键）
    this.audit = new AuditStore({
      kv: env && env.AUDIT_KV ? env.AUDIT_KV : null,
      storage: state.storage,
      flushMs: this.config.recordFlushMs,
      defaultLimit: this.config.recordDefaultLimit,
      blacklistLimit: this.config.blacklistLimit,
      adminAudit: this.config.adminAudit,
      adminAuditLimit: this.config.adminAuditLimit,
      log: this.log,
    });
    this.types = protoTypes();
    this.counters = {
      msgsIn: 0, msgsOut: 0, bytesIn: 0, bytesOut: 0,
      forwards: 0, connsTotal: 0, errors: 0, forgeries: 0,
      // 黑名单拦截次数（v1.3.0：拒绝不再逐条写记录，改由计数器观测；
      // 边缘层【Worker 入口】拒绝的连接不会到达 DO，不在此计数）
      blRejected: 0,
    };
    this.startedAt = Date.now();
    this._dirty = false;
    this._storageFlushAt = 0;
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
    // 4) 审计存储初始化 + PeerManager 事件挂接
    await this.audit.init();
    this.pm.onEvent = (ev) => this._onPmEvent(ev);
    // 5) 确保清扫 alarm 存在
    await this._ensureAlarm();
  }

  /** PeerManager 事件 → KV 审计记录 */
  _onPmEvent(ev) {
    if (!ev || !ev.kind) return;
    switch (ev.kind) {
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
    await this._initPromise;
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/internal/stats') {
      return Response.json(this._stats());
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
      const body = await request.json().catch(() => ({}));
      const r = this.audit.deleteRecords(body.type, body.ids);
      this.audit.adminTouch(adminIp, 'op', { action: 'records-delete', type: body.type, removed: r.removed || 0 });
      await this.audit.flush(Date.now(), { forceKv: true });
      return Response.json(r);
    }
    // KV 审计：记录配置（每类开关 + 上限；admin 类为硬设置不可改）
    if (path === '/internal/record/config' && request.method === 'GET') {
      return Response.json({ ok: true, ...this.audit.getConfig() });
    }
    if (path === '/internal/record/config' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const r = this.audit.setConfig(body.types);
      this.audit.adminTouch(adminIp, 'op', { action: 'record-config' });
      await this.audit.flush(Date.now(), { forceKv: true });
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
      const body = await request.json().catch(() => ({}));
      const r = this.audit.blacklistAdd(body.cat, body.value, { reason: body.reason });
      this.audit.adminTouch(adminIp, 'op', { action: 'blacklist-add', cat: body.cat, value: body.value });
      await this.audit.flush(Date.now(), { forceKv: true });
      return Response.json(r);
    }
    // 黑名单：移除（解除封锁）
    if (path === '/internal/blacklist/delete' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const r = this.audit.blacklistRemove(body.cat, body.ids);
      this.audit.adminTouch(adminIp, 'op', { action: 'blacklist-remove', cat: body.cat, removed: r.removed || 0 });
      await this.audit.flush(Date.now(), { forceKv: true });
      return Response.json(r);
    }
    if (path === '/internal/group/delete' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      // _deleteGroups 为 async（需落盘），必须 await，否则 Promise 被序列化为 {}
      return Response.json(await this._deleteGroups(body, adminIp));
    }
    if (path === '/internal/peer/kick' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const r = this._kickPeers(body);
      this.audit.adminTouch(adminIp, 'op', { action: 'peer-kick', kicked: (r.kicked || []).length });
      await this.audit.flush(Date.now(), { forceKv: true });
      return Response.json(r);
    }
    if (path === '/internal/route/delete' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const r = this._deleteRouteInfos(body);
      this.audit.adminTouch(adminIp, 'op', { action: 'route-delete', removed: (r.removed || []).length });
      await this.audit.flush(Date.now(), { forceKv: true });
      return Response.json(r);
    }
    if (path === '/internal/digest/delete' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      return Response.json(await this._deleteDigests(body, adminIp));
    }
    if (path === '/internal/peercenter/delete' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const r = this._deletePeerCenter(body);
      this.audit.adminTouch(adminIp, 'op', { action: 'peercenter-delete', removed: (r.removed || []).length });
      await this.audit.flush(Date.now(), { forceKv: true });
      return Response.json(r);
    }
    if (path === '/internal/socket/close' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const r = this._closeSockets(body);
      this.audit.adminTouch(adminIp, 'op', { action: 'socket-close', closed: (r.closed || []).length });
      await this.audit.flush(Date.now(), { forceKv: true });
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
          headers: { 'retry-after': '60' }, // 建议客户端退避重试
        });
      }
    }
    if (this.pm.totalPeers() >= this.config.maxPeersPerRoom) {
      return new Response('Room full', { status: 429 });
    }

    const pair = new WebSocketPair();
    const [client, server] = [pair[0], pair[1]];
    this._acceptSocket(server, clientIp);
    return new Response(null, { status: 101, webSocket: client });
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
    ws._serverSessionId = meta.serverSessionId
      ? toU64Long(meta.serverSessionId)
      : randomU64Long();
    ws._weAreInitiator = false;
    ws._lastSeen = meta.lastSeen ?? meta.connectedAt ?? now;
    ws._handshakedAt = meta.handshakedAt ?? null;
    ws._lastAttachSync = now;
    ws._serverPingSent = false;

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
        serverSessionId: ws._serverSessionId ? ws._serverSessionId.toString() : null,
        connectedAt: ws._connectedAt ?? Date.now(),
        handshakedAt: ws._handshakedAt ?? null,
        lastSeen: lastSeenOverride ?? ws._lastSeen ?? Date.now(),
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
    this.counters.bytesIn += buf.length;

    if (buf.length > this.config.maxMessageBytes) {
      this.log.warn(`oversized message (${buf.length}) from socket, closing`);
      this._close(ws, 4009, 'oversized');
      return;
    }

    const header = parseHeader(buf);
    if (!header) {
      this.log.warn(`malformed packet (len=${buf.length})`);
      this.counters.errors += 1;
      this._close(ws, 4002, 'malformed');
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

    const payload = payloadOf(buf);
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
        this._close(ws, 4003, 'secure mode unsupported');
        return;
      default:
        // ForeignNetworkPacket / Relay* / deprecated 类型：原样转发
        this._forward(ws, header, buf);
    }
  }

  async webSocketClose(ws, code, reason, wasClean) {
    await this._initPromise;
    this.audit.record('sockets', {
      event: 'close', socketId: ws._socketId ?? null, peerId: ws._peerId ?? null,
      ...(ws._clientIp ? { ip: ws._clientIp } : {}), code,
    });
    this._cleanupPeer(ws, 'close');
  }

  async webSocketError(ws) {
    await this._initPromise;
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
      this._close(ws, 4002, 'bad handshake');
      return;
    }
    if (Number(req.magic) !== MAGIC) {
      this._close(ws, 4002, 'bad magic');
      return;
    }
    if (Number(req.version) !== VERSION) {
      this._close(ws, 4002, 'bad version');
      return;
    }
    const peerId = Number(req.myPeerId);
    if (!Number.isInteger(peerId) || peerId <= 0 || peerId === this.config.serverPeerId) {
      this._close(ws, 4002, 'bad peer id');
      return;
    }

    const networkName = String(req.networkName || '');
    const digestHex = bytesToHex(req.networkSecretDigest || new Uint8Array(0));

    // 黑名单拦截：peerId / 网络名（group / digest 两类）
    {
      const bl = this.audit.checkAccess({ ip: ws._clientIp || undefined, peerId, networkName });
      if (bl.blocked) {
        // v1.3.0：拒绝不写入 peers 记录（防重连风暴刷爆记录列表），只计数
        this.counters.blRejected += 1;
        this.log.warn(
          `handshake rejected (blacklist:${bl.cat}) network="${networkName}" peer=${peerId} value=${bl.value}`
        );
        this._close(ws, 4013, 'blacklisted');
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
      this._close(ws, 4003, 'digest mismatch');
      return;
    }
    const groupKey = resolved.groupKey;

    if (this.pm.totalPeers() >= this.config.maxPeersPerRoom) {
      this._close(ws, 4029, 'room full');
      return;
    }

    // 注册
    ws._peerId = peerId;
    ws._groupKey = groupKey;
    ws._networkName = networkName;
    ws._domainName = networkName;
    ws._handshakedAt = Date.now();
    const replaced = this.pm.addPeer(groupKey, peerId, ws);
    if (replaced) {
      this.log.info(`peer=${peerId} reconnected, closing stale socket`);
      try {
        replaced.close(4000, 'replaced');
      } catch { /* ignore */ }
      this._cleanupPeer(replaced, 'replaced');
    }
    this._saveAttachment(ws);
    this._markDirty();

    // 审计记录：节点加入 / 分组创建 / 摘要注册
    this.audit.record('peers', {
      event: replaced ? 'replace' : 'join', groupKey, networkName, peerId,
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
    // 回显 Pong；若客户端使用 liveness-echo 探针（flags 带 token），镜像 flags
    const flags = header.flags & HeaderFlags.LIVENESS_ECHO;
    this._send(ws, buildPacket(
      this.config.serverPeerId, header.fromPeerId, PacketType.Pong,
      payload, { flags }
    ));
  }

  _forward(ws, header, fullMessage) {
    if (ws._groupKey == null) return; // 未握手连接不允许转发
    // F-06 加固：转发前校验源身份。包内 from_peer_id 必须与连接注册的
    // peerId 一致，否则视为伪造（丢弃并计数），防源地址欺骗。
    if (header.fromPeerId !== ws._peerId) {
      this.counters.forgeries += 1;
      this.log.warn(
        `drop forged packet: conn_peer=${ws._peerId} claims from=${header.fromPeerId} ` +
        `to=${header.toPeerId} type=${header.packetType}`
      );
      return;
    }
    const target = this.pm.getPeer(ws._groupKey, header.toPeerId);
    if (!target || target === ws) return;
    if (target.readyState !== WS_OPEN) return;
    const out = bumpForward(fullMessage, MAX_FORWARD_COUNTER);
    if (!out) {
      this.log.debug(`drop packet: forward counter exceeded (type=${header.packetType})`);
      return;
    }
    try {
      target.send(out);
      this.counters.forwards += 1;
      this.counters.msgsOut += 1;
      this.counters.bytesOut += out.length;
    } catch (e) {
      this.log.warn(`forward to ${header.toPeerId} failed: ${e.message}`);
      this._cleanupPeer(target, 'send-failed');
    }
  }

  _send(ws, bytes) {
    if (!ws || ws.readyState !== WS_OPEN) return;
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
      send: (ws, bytes) => this._send(ws, bytes),
      pushRoute: (ws, forceFull) => this._pushRoute(ws, forceFull),
      broadcast: (groupKey, excludePeerId) => this._broadcast(groupKey, excludePeerId),
    };
  }

  // -------------------------------------------------------------------
  // Alarm：清扫 + 持久化
  // -------------------------------------------------------------------

  async alarm() {
    await this._initPromise;
    const now = Date.now();
    const cfg = this.config;

    for (const ws of this.state.getWebSockets()) {
      if (ws.readyState !== WS_OPEN) continue;
      const lastSeen = this._getLastSeen(ws);

      // 防线 a：未握手超时
      if (ws._peerId == null) {
        const connectedAt = this._loadAttachment(ws).connectedAt ?? now;
        if (now - connectedAt > cfg.handshakeTimeoutMs) {
          this.log.info('closing un-handshaked socket (timeout)');
          this._close(ws, 4001, 'handshake timeout');
        }
        continue;
      }

      // 防线 b：空闲超时（超过客户端最大 ping 间隔 32s 的安全余量）
      if (now - lastSeen > cfg.peerIdleTimeoutMs) {
        this.log.info(`peer=${ws._peerId} idle timeout, closing`);
        this._close(ws, 4001, 'idle timeout');
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

    // KV 审计刷盘：DO storage 脏即写；KV 镜像按 RECORD_FLUSH_MS 节流
    if (this.audit.isDirty()) {
      await this.audit.flush(now);
    }

    // 重新挂 alarm
    try {
      await this.state.storage.setAlarm(now + cfg.sweepIntervalMs);
    } catch (e) {
      this.log.warn(`re-arm alarm failed: ${e.message}`);
    }
  }

  _markDirty() {
    this._dirty = true;
    // 成员变化尽快落盘：若当前无近期 alarm，安排一个短 alarm
    try {
      this.state.storage.setAlarm(Date.now() + 2000).catch(() => {});
    } catch { /* ignore */ }
  }

  async _flushState() {
    this._storageFlushAt = Date.now();
    this._dirty = false;
    try {
      await this.state.storage.put(STATE_KEY, this.pm.toPersisted());
    } catch (e) {
      this.log.warn(`flush state failed: ${e.message}`);
    }
  }

  // -------------------------------------------------------------------
  // 管理端操作（由 Worker 入口鉴权后经 /internal/* 调用）
  // -------------------------------------------------------------------

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
      let handshaked = 0;
      for (const ws of this.state.getWebSockets()) {
        if (ws._peerId != null) handshaked += 1;
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
        stats: { total: items.length, handshaked, pending: items.length - handshaked },
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
      let socketsTotal = 0;
      let socketsHandshaked = 0;
      for (const ws of this.state.getWebSockets()) {
        socketsTotal += 1;
        if (ws._peerId != null) socketsHandshaked += 1;
      }
      snap.stats = snap.stats || {};
      snap.stats.sockets = { total: socketsTotal, handshaked: socketsHandshaked };
      snap.stats.audit = {
        records: this.audit._counts(),
        blacklist: this.audit.blacklistCounts(),
        kvEnabled: !!this.audit.kv,
      };
    }
    return {
      ok: true,
      ...snap,
      startedAt: this.startedAt,
      uptimeSec: Math.floor((Date.now() - this.startedAt) / 1000),
      serverPeerId: this.config.serverPeerId,
      counters: this.counters,
      config: {
        serverHostname: this.config.serverHostname,
        serverVersionStr: this.config.serverVersionStr,
        avoidRelayData: this.config.avoidRelayData,
        relayData: this.config.relayData,
        strictDigest: this.config.strictDigest,
        maxPeersPerRoom: this.config.maxPeersPerRoom,
        peerIdleTimeoutMs: this.config.peerIdleTimeoutMs,
        digestValidation: !!this.config.networkSecrets,
        routeInfoTtlMs: this.config.routeInfoTtlMs,
        routeInfoUnreachableMs: this.config.routeInfoUnreachableMs,
        groupAutoDeleteMs: this.config.groupAutoDeleteMs,
      },
    };
  }

  /**
   * 删除分组（管理端，支持批量）：断开组内全部连接、清除路由/会话数据，
   * 并在无同网络兄弟分组时删除摘要注册表条目（解除 F-05 抢占封锁）。
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
          try { ws.close(4010, 'group deleted'); } catch { /* ignore */ }
          closed += 1;
        }
      }
      // 黑名单（group 类）：该网络名的后续接入被拒
      this.audit.blacklistAdd('group', info.networkName, {
        reason: 'group deleted by admin', groupKey: gk,
      });
      deleted.push({ groupKey: gk, networkName: info.networkName, closedPeers: closed });
      this.log.info(`admin: group deleted key=${gk} network=${info.networkName} closed=${closed}`);
    }
    if (deleted.length) {
      this._dirty = true;
      await this._flushState();
    }
    this.audit.adminTouch(adminIp, 'op', { action: 'group-delete', count: deleted.length });
    await this.audit.flush(Date.now(), { forceKv: true });
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
      try { ws.close(4008, 'kicked'); } catch { /* ignore */ }
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
    // 黑名单（digest 类）+ 审计
    for (const name of networkNames) {
      this.audit.blacklistAdd('digest', name, { reason: 'digest deleted by admin' });
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
        try { ws.close(4011, 'digest deleted'); } catch { /* ignore */ }
        closedTotal += 1;
      }
    }
    if (closedTotal > 0 || (r.results || []).some((x) => x.existed)) {
      this._dirty = true;
      await this._flushState();
      this.log.info(`admin: digests deleted names=[${networkNames.join(',')}] closed=${closedTotal}`);
    }
    this.audit.adminTouch(adminIp, 'op', { action: 'digest-delete', count: networkNames.length });
    await this.audit.flush(Date.now(), { forceKv: true });
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
      try { ws.close(4012, 'closed by admin'); } catch { /* ignore */ }
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
    return {
      ok: true,
      startedAt: this.startedAt,
      uptimeSec: Math.floor((Date.now() - this.startedAt) / 1000),
      serverPeerId: this.config.serverPeerId,
      totalPeers: this.pm.totalPeers(),
      groupCount: this.pm.groupCount(),
      groups,
      counters: this.counters,
      config: {
        avoidRelayData: this.config.avoidRelayData,
        relayData: this.config.relayData,
        strictDigest: this.config.strictDigest,
        maxPeersPerRoom: this.config.maxPeersPerRoom,
        peerIdleTimeoutMs: this.config.peerIdleTimeoutMs,
        digestValidation: !!this.config.networkSecrets,
      },
    };
  }
}
