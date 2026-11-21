/**
 * KV 审计存储：事件记录（连接/路由/互联/摘要等）+ 管理端黑名单。
 *
 * 设计（针对 Cloudflare 免费额度的成本控制）：
 * 1. 键值布局 —— 每类信息只占一条 KV 键（v1.4.1 起前缀为项目名，旧前缀仅迁移读取）：
 *    - 记录：easytier-cf-relay:<room>:rec:<type>（v1.7 A3 房间段，默认 room=global），
 *      type ∈ groups|peers|routes|peercenter|sockets|digests|admin
 *    - 黑名单：easytier-cf-relay:bl:<cat>（全局键，无房间段——边缘层在房间解析前读取），
 *      cat ∈ peer|group|digest|socket
 *    - 额度 shed 标记：easytier-cf-relay:shed:active（全局键，v1.7 A5，值 'true'/'false'）
 *    - 记录查询支持 type=all：跨类型按 id（全局时序）倒序合并，无需额外 KV 键
 * 2. 三级写入路径：
 *    - 事件发生 → 仅写内存（零成本）；
 *    - alarm 周期（15s）→ 脏数据刷入 DO storage（SQLite，免费额度充裕，防休眠丢失）；
 *    - KV 镜像 → 按 RECORD_FLUSH_MS（默认 10 分钟）节流，仅写脏键。
 *    KV 免费额度 1000 写/天：默认间隔下每键最多 144 写/天，典型小网络
 *    （每天几十次连接波动）实际写入远低于该值。
 * 3. 读取路径：管理端查询直接读内存；仅冷启动且 DO storage 为空时回读 KV
 *    （每键一次，全生命周期最多一次）。Worker 入口的边缘黑名单拦截只读
 *    bl:socket 一条键（BL_SOCKET_KV_KEY），被拒连接不唤醒 DO。
 * 4. 管理端审计（登录/操作）为硬设置（wrangler.toml ADMIN_AUDIT），
 *    管理页不可关闭；六类数据记录可由管理页单独开关并设置上限。
 *    v1.3.0 起不再记录"查看"事件（管理页 10s 自动刷新会刷屏且徒增写入）。
 * 5. 黑名单分四类（peer/group/digest/socket），管理操作（踢出/删除分组/
 *    删除摘要/断开连接）自动记录进对应类别；接入拦截分两层：
 *    Worker 入口边缘层（仅 socket/IP 类，KV 直读）+ DO 握手/升级层（权威兜底）。
 * 6. 黑名单拒绝不再产生 peers 记录（被拉黑客户端会不断重连，逐条记录会
 *    刷爆记录列表并浪费写入额度）；拒绝次数改由 room.js 计数器统计。
 */

import { KV_WRITE_DAILY_BUDGET, KV_SKIP_ORDER } from './constants.js';

const RECORD_TYPES = ['groups', 'peers', 'routes', 'peercenter', 'sockets', 'digests', 'admin'];
const RUNTIME_TYPES = ['groups', 'peers', 'routes', 'peercenter', 'sockets', 'digests'];
const BLACKLIST_CATS = ['peer', 'group', 'digest', 'socket'];

const STATE_KEY = 'audit_state';
/** v1.4.1：KV 键前缀由 et-relay: 更名为项目名 easytier-cf-relay: */
const KV_PREFIX = 'easytier-cf-relay:';
/** 旧前缀（v1.4.0 及之前）：仅用于一次性迁移读取，绝不写入 */
const LEGACY_KV_PREFIX = 'et-relay:';
/**
 * socket（客户端 IP）黑名单的 KV 键：Worker 入口边缘拦截只读这一条键，
 * 命中直接 403，不唤醒 Durable Object（省 DO 请求与时长计费）。
 */
export const BL_SOCKET_KV_KEY = KV_PREFIX + 'bl:socket';
/**
 * 额度 shed 标记键（v1.7 A5）：全局键（无房间段）——Worker 入口边缘层读同键，
 * 激活时对新 WS 升级直接 429（已建立的 Hibernation 会话不吃 Worker 请求额度，
 * 存量 mesh 不受影响）。值为 JSON 布尔（true/false）。
 */
export const SHED_KV_KEY = KV_PREFIX + 'shed:active';/** 管理端审计：同一 IP 的登录记录折叠窗口 */
const LOGIN_DEDUP_MS = 10 * 60_000;

/** 摘要抢占嫌疑（squat-suspect）记录的去重窗口与去重表上限 */
const SQUAT_DEDUP_MS = 10 * 60_000;
const SQUAT_DEDUP_MAX = 512;

/** 黑名单类别与记录类别的合法值归一化（peer 为数字，其余为字符串） */
function normValue(cat, value) {
  if (cat === 'peer') return Number(value);
  return String(value ?? '');
}

/**
 * UTC 日戳（YYYY-MM-DD）：KV 写日预算（v1.7 A4）与 kill 日计数（v1.7 D5，
 * room.js）共用的重置锚点。
 */
export function utcDayStamp(now = Date.now()) {
  return new Date(now).toISOString().slice(0, 10);
}

/**
 * KV 预算牺牲序的保留优先级（v1.7 A4）：值越小越优先保留写入。
 * 牺牲序（KV_SKIP_ORDER）内的键最后保留（预算耗尽时最先被跳），
 * 其余 rec:*（含 admin 硬审计）优先于牺牲序键；bl:* 不参与排序（永不跳）。
 */
function keepRank(kvKey) {
  const i = KV_SKIP_ORDER.indexOf(kvKey);
  return i === -1 ? -1 : i;
}

/**
 * v1.7 A3：审计记录键房间段清洗——房间 id 进 KV 键，空值回退 global。
 * （房间 id 来自 ROOM_ID / ROOM_HEADER / ROOM_QUERY，原样入键即可保证
 * 不同房间键不同；不解析回房间号，无需转义。）
 */
function normRoomId(roomId) {
  const r = String(roomId ?? '').trim();
  return r || 'global';
}

/**
 * IP 打码（v1.6.0 C4 数据最小化，AUDIT_IP_MASK）：
 * - IPv4 保留 /16 前缀：`1.2.3.4` → `1.2.x.x`（含 IPv4-mapped IPv6 `::ffff:1.2.3.4`）；
 * - IPv6 保留前 4 组：`2001:db8:1234:5678::1` → `2001:db8:1234:5678:x`。
 * 仅作用于【记录展示】——黑名单存储、踢人拉黑、边缘层 KV 拦截均使用完整 IP，
 * 不受影响（打码只在 record() 写入时发生）。
 */
export function maskIp(ip) {
  const s = String(ip ?? '');
  if (!s) return s;
  if (s.includes('.')) {
    const m = s.match(/(\d{1,3}\.\d{1,3})\./);
    return m ? `${m[1]}.x.x` : 'x';
  }
  if (s.includes(':')) {
    // 展开 '::' 折叠后取前 4 组（/64 前缀）：fe80::1 → fe80:0:0:0:x，2001:db8::8:8 → 2001:db8:0:0:x
    const h = s.split('::');
    const head = h[0] ? h[0].split(':') : [];
    const tail = h.length > 1 && h[1] ? h[1].split(':') : [];
    const fill = h.length > 1 ? Math.max(0, 8 - head.length - tail.length) : 0;
    const groups = head.concat(Array(fill).fill('0'), tail);
    const first4 = groups.slice(0, 4).join(':');
    return first4 ? `${first4}:x` : 'x';
  }
  return 'x';
}

export class AuditStore {
  /**
   * @param {object} opts
   *   - kv: KV namespace binding（env.AUDIT_KV，可为 null → 仅 DO storage）
   *   - storage: Durable Object storage
   *   - flushMs: KV 镜像最小间隔（RECORD_FLUSH_MS）
   *   - defaultLimit: 各类记录默认上限（RECORD_DEFAULT_LIMIT）
   *   - blacklistLimit: 各类黑名单上限（BLACKLIST_LIMIT，硬设置）
   *   - adminAudit: 管理端审计硬开关（ADMIN_AUDIT）
   *   - adminAuditLimit: 管理端审计上限（ADMIN_AUDIT_LIMIT，硬设置）
   *   - ipMask: 记录 IP 打码（AUDIT_IP_MASK，v1.6.0 C4；黑名单不受影响）
   *   - retentionDays: 记录留存天数（AUDIT_RETENTION_DAYS，0=不限，v1.6.0 C4）
   *   - log: logger
   */
  constructor(opts = {}) {
    this.kv = opts.kv || null;
    this.storage = opts.storage || null;
    this.flushMs = Number(opts.flushMs) > 0 ? Number(opts.flushMs) : 600_000;
    this.defaultLimit = Number(opts.defaultLimit) > 0 ? Number(opts.defaultLimit) : 100;
    this.blacklistLimit = Number(opts.blacklistLimit) > 0 ? Number(opts.blacklistLimit) : 1000;
    this.adminAudit = opts.adminAudit !== false;
    this.adminAuditLimit = Number(opts.adminAuditLimit) > 0 ? Number(opts.adminAuditLimit) : 200;
    this.ipMask = opts.ipMask === true;
    this.retentionDays = Number(opts.retentionDays) > 0 ? Math.floor(Number(opts.retentionDays)) : 0;
    /**
     * v1.7 A3：审计记录 KV 键房间段（rec 键 = easytier-cf-relay:<room>:rec:<type>）。
     * 默认 'global'（env ROOM_ID）；ROOM_HEADER/QUERY 分片时由 room.fetch 在
     * audit.init 之前 setRoomId 覆盖（此后写入/恢复都落在对应房间键上）。
     * 黑名单键（bl:*）不带房间段——边缘层读 bl:socket 发生在房间解析之前，
     * 且 socket(IP) 黑名单语义跨房间（同一肇事 IP 对任何房间都拦截）。
     */
    this.roomId = normRoomId(opts.roomId);
    // v1.7 C5：默认桩补 info——迁移路径（:167）与 reloadBlacklists 的 log.info
    // 在无 logger 注入时不再抛 TypeError 被 catch 误吞（后者会误置降级态）
    this.log = opts.log || { warn: () => {}, debug: () => {}, info: () => {} };

    /** v1.7 D5：宿主 room 计数器引用（kvWriteFailed / kvWriteBudgetSkipped 上报；可空） */
    this.counters = opts.counters || null;
    /**
     * v1.7 C5：黑名单降级态——init 时 KV 恢复失败（配额/异常）置位。
     * 置位期间本实例内存黑名单可能不完整（fail-open 窗口显式化），
     * room alarm 按 60s 节流调用 reloadBlacklists() 重试，成功即清除。
     */
    this.blDegraded = false;
    /** v1.7 A4：KV 写日预算（尝试口径；UTC 日重置；随 audit 状态持久化） */
    this.kvBudget = { date: utcDayStamp(), used: 0 };
    /**
     * v1.7 A5：额度 shed 激活态（本 DO 内存视图）。真源 = KV shed 键 +
     * audit_state 快照双份（KV 不可用时 DO storage 仍可恢复）；
     * room 层只读本字段做 DO 升级拒绝与统计展示。
     */
    this.shedActive = false;
    /**
     * v1.7 复核修复：shed 键 KV 镜像待重试标记——写失败（KV 异常）后置位，
     * room 每轮 shed 检查调用 retryShedKvIfDirty() 幂等重写（否则一次瞬时
     * 失败会让边缘层整天读不到标记）。
     */
    this.shedKvDirty = false;

    /** @type {Map<string, object[]>} type -> 记录数组（旧→新） */
    this.records = new Map(RECORD_TYPES.map((t) => [t, []]));
    /** @type {Map<string, object[]>} cat -> 黑名单条目（旧→新） */
    this.blacklist = new Map(BLACKLIST_CATS.map((c) => [c, []]));
    /** 运行时记录配置（管理页可改）：type -> {on:boolean, limit:number} */
    this.config = {};
    for (const t of RUNTIME_TYPES) this.config[t] = { on: true, limit: this.defaultLimit };

    this.seq = 0;                 // 记录/黑名单条目 id 计数器（持久化）
    this._loaded = false;
    this._storageDirty = false;   // 需要刷 DO storage
    this._kvDirty = new Set();    // 需要镜像到 KV 的键名（rec:xxx / bl:xxx）
    this._lastKvFlush = 0;
    this._lastLoginByIp = new Map(); // ip -> ts（登录去重）
    // 摘要抢占嫌疑去重：key "网络名|ip" -> ts，
    // 定长 FIFO 防无界增长（与 _lastLoginByIp 同类内存去重）
    this._squatDedup = new Map();
  }

  /**
   * v1.7 A3：KV 键拼接收口——rec 键插房间段，bl 键保持全局（见 constructor 注释）。
   * @param {string} shortKey 'rec:<type>' 或 'bl:<cat>'（_kvDirty 内的短键形态）
   */
  _kvKey(shortKey) {
    return KV_PREFIX + (shortKey.startsWith('rec:') ? this.roomId + ':' + shortKey : shortKey);
  }

  /**
   * v1.7 A3：分片部署的房间段更新。必须在 audit.init()（KV 恢复读键）之前
   * 调用才对恢复生效（room.fetch 首包先解析房间再惰性 init）；init 之后变更
   * 仅影响后续写入键名——恢复数据仍来自先前房间的键，打 warn 提示（分片
   * 部署建议仅用 ROOM_ID 配置房间，避免 header/query 动态房间跨 DO 代际）。
   */
  setRoomId(roomId) {
    const r = normRoomId(roomId);
    if (r === this.roomId) return;
    const wasLoaded = this._loaded;
    this.roomId = r;
    if (wasLoaded) {
      this.log.warn(`audit roomId changed to "${r}" after init; restored data came from the previous room's keys`);
    }
  }

  /**
   * v1.7 A5：额度 shed 标记翻转（全局键，无房间段；边缘层读同键）。
   * 过渡即写（不走 10 分钟 flush 节奏——激活延迟要求分钟级内生效）；
   * KV 写计入 A4 日预算（尝试口径）但【永不牺牲】：shed 激活恰是额度告急
   * 场景，标记写不出去等于没有防线。同时随 audit_state 快照持久化（KV
   * 不可用时 DO storage 仍可恢复）。
   * @param {boolean} active
   * @returns {boolean} 是否发生状态变化
   */
  async setShedFlag(active) {
    const next = active === true;
    if (next === this.shedActive) return false;
    this.shedActive = next;
    this._storageDirty = true; // 快照随下一轮 flush 落盘
    await this._writeShedKv();
    return true;
  }

  /**
   * v1.7 复核修复：shed 键 KV 镜像实际写入。
   * - KV put 只接受 string/ArrayBuffer/View/Stream——**布尔值会抛类型错误**
   *   （此前直接写 `next` 被 catch 吞掉：shedActive 只在 DO 内存生效，
   *   边缘层 lookupShedFlag 永远读不到，A5 边缘 429 实际失效）；
   * - 写字符串 'true'/'false'，读侧 get(key,'json') 仍得到布尔；
   * - 失败置 shedKvDirty，由 room 的下一轮检查幂等重试。
   */
  async _writeShedKv() {
    if (!this.kv) return;
    try {
      this._ensureBudgetDay(Date.now());
      await this.kv.put(SHED_KV_KEY, this.shedActive ? 'true' : 'false');
      this.kvBudget.used += 1;
      this.shedKvDirty = false;
    } catch (e) {
      this.kvBudget.used += 1; // 尝试口径：失败同样占用配额
      this.shedKvDirty = true;
      if (this.counters) this.counters.kvWriteFailed += 1;
      this.log.warn(`shed flag kv write failed: ${e.message}`);
    }
  }

  /** v1.7 复核修复：shed 键写失败后的幂等重试（room 每轮 shed 检查调用；非脏时零开销） */
  async retryShedKvIfDirty() {
    if (!this.shedKvDirty || !this.kv) return;
    await this._writeShedKv();
  }

  // -------------------------------------------------------------------
  // 初始化 / 持久化
  // -------------------------------------------------------------------

  async init() {
    if (this._loaded || !this.storage) return;
    this._loaded = true;
    try {
      const saved = await this.storage.get(STATE_KEY);
      if (saved) {
        this._loadSnapshot(saved);
        // v1.7 A5：KV shed 键可能比快照更新（过渡即写 vs 快照 30s 节奏）——取「或」；
        // v1.7 复核修复：快照与 KV 不一致（或 KV 读失败但快照为激活）时置 shedKvDirty，
        // 由下一轮检查幂等重写，避免「内存 true / KV false」长期分叉
        if (this.kv) {
          try {
            const shed = await this.kv.get(SHED_KV_KEY, 'json');
            if (shed === true) this.shedActive = true;
            if (this.shedActive !== (shed === true)) this.shedKvDirty = true;
          } catch {
            if (this.shedActive) this.shedKvDirty = true;
          }
        }
        return;
      }
    } catch (e) {
      this.log.warn(`audit load failed: ${e.message}`);
    }
    // 冷启动回退：DO storage 为空（首次部署/被重置）时从 KV 恢复。
    // 键层级（v1.7 A3）：rec 键 = <prefix><room>:rec:<t>；bl 键 = <prefix>bl:<c>（全局）。
    if (this.kv) {
      let restoredRec = false;
      let restoredBl = false;
      try {
        for (const t of RECORD_TYPES) {
          const v = await this.kv.get(this._kvKey('rec:' + t), 'json');
          if (Array.isArray(v) && v.length) { this.records.set(t, v); restoredRec = true; }
        }
        for (const c of BLACKLIST_CATS) {
          const v = await this.kv.get(this._kvKey('bl:' + c), 'json');
          if (Array.isArray(v) && v.length) { this.blacklist.set(c, v); restoredBl = true; }
        }
        // 一次性迁移 v2（v1.7 A3；v1.7 复核修复：按类型判定）：某类型在房间段键
        // 中无数据才回读 v1.6.x 无段键（easytier-cf-relay:rec:<t>）——单类型缺失
        // 不再被「其他类型有数据」挡住。数据随后由正常刷盘写回房间段键；旧键保留
        // 不删（回滚路径）。分片部署各房间会各自复制一份基线（升级前共享同组键，
        // 数据无法按房间归属）。
        let migrated = false;
        for (const t of RECORD_TYPES) {
          if ((this.records.get(t) || []).length) continue;
          const v = await this.kv.get(KV_PREFIX + 'rec:' + t, 'json');
          if (Array.isArray(v) && v.length) { this.records.set(t, v); migrated = true; }
        }
        if (migrated) {
          this.log.info(`audit rec data migrated to room-segmented keys (room=${this.roomId})`);
          restoredRec = true;
        }
        // 一次性迁移 v1（v1.4.1；v1.7 复核修复：rec/bl 分离触发）：仅当某一族在
        // 新前缀完全无数据时回读旧前缀 et-relay: 的对应族——既不让「新 rec 有数据
        // + 新 bl 为空」时旧 bl 永久丢失，也不复活已被清理的旧数据。
        if (!restoredRec) {
          let legacy = false;
          for (const t of RECORD_TYPES) {
            if ((this.records.get(t) || []).length) continue;
            const v = await this.kv.get(LEGACY_KV_PREFIX + 'rec:' + t, 'json');
            if (Array.isArray(v) && v.length) { this.records.set(t, v); legacy = true; }
          }
          if (legacy) {
            this.log.info('audit rec data migrated from legacy "et-relay:" keys');
            restoredRec = true;
          }
        }
        if (!restoredBl) {
          let legacy = false;
          for (const c of BLACKLIST_CATS) {
            if ((this.blacklist.get(c) || []).length) continue;
            const v = await this.kv.get(LEGACY_KV_PREFIX + 'bl:' + c, 'json');
            if (Array.isArray(v) && v.length) { this.blacklist.set(c, v); legacy = true; }
          }
          if (legacy) {
            this.log.info('audit bl data migrated from legacy "et-relay:" keys');
            restoredBl = true;
          }
        }
      } catch (e) {
        this.log.warn(`audit kv restore failed: ${e.message}`);
        // v1.7 C5 / 复核修复：审计恢复降级态——记录或黑名单任一族恢复失败均置位
        // （此前只覆盖黑名单，记录类会永久部分恢复并可能被后续 flush 固化）；
        // room alarm 周期重试（reloadBlacklists 同时回读记录类空类型）。
        this.blDegraded = true;
      }
      // v1.7 A5：shed 标记恢复（独立 try——失败不影响恢复降级态语义；
      // KV 不可用时由 audit_state 快照兜底，见 _loadSnapshot）
      try {
        const shed = await this.kv.get(SHED_KV_KEY, 'json');
        if (shed === true) this.shedActive = true;
      } catch { /* 读失败保持 false（放行 + DO 层兜底） */ }
      for (const t of RECORD_TYPES) {
        for (const r of this.records.get(t) || []) {
          if (Number.isFinite(r.id) && r.id > this.seq) this.seq = r.id;
        }
      }
      for (const c of BLACKLIST_CATS) {
        for (const r of this.blacklist.get(c) || []) {
          if (Number.isFinite(r.id) && r.id > this.seq) this.seq = r.id;
        }
      }
      this._storageDirty = true; // KV 恢复出的数据回写 DO storage
    }
  }

  _loadSnapshot(saved) {
    this.seq = Number(saved.seq) || 0;
    for (const t of RECORD_TYPES) {
      const arr = saved.records && saved.records[t];
      if (Array.isArray(arr)) this.records.set(t, arr);
    }
    for (const c of BLACKLIST_CATS) {
      const arr = saved.blacklist && saved.blacklist[c];
      if (Array.isArray(arr)) this.blacklist.set(c, arr);
    }
    if (saved.config && typeof saved.config === 'object') {
      for (const t of RUNTIME_TYPES) {
        const c = saved.config[t];
        if (c && typeof c === 'object') {
          this.config[t] = {
            on: c.on !== false,
            limit: Number(c.limit) > 0 ? Math.floor(Number(c.limit)) : this.defaultLimit,
          };
        }
      }
    }
    // v1.7 A4：KV 写日预算恢复——跨 UTC 日恢复直接按今天重置（used 不跨日累计）
    if (saved.kvBudget && typeof saved.kvBudget === 'object') {
      const d = utcDayStamp();
      const date = String(saved.kvBudget.date || '');
      this.kvBudget = date === d
        ? { date, used: Number(saved.kvBudget.used) || 0 }
        : { date: d, used: 0 };
    }
    // v1.7 A5：shed 态恢复（与 KV shed 键双源——快照优先级同 KV，取「真」即可；
    // 快照恢复路径不读 KV shed 键，二者由翻转时双写保持一致）
    this.shedActive = saved.shed === true;
  }

  _snapshot() {
    const records = {};
    for (const [t, arr] of this.records) records[t] = arr;
    const blacklist = {};
    for (const [c, arr] of this.blacklist) blacklist[c] = arr;
    // v1.7 A5：shed 态入快照（KV 不可用时 DO storage 恢复兜底）
    return { v: 1, seq: this.seq, records, blacklist, config: this.config, kvBudget: this.kvBudget, shed: this.shedActive };
  }

  /** v1.7 A4：KV 写日预算的 UTC 日惰性重置（flush 写路径入口调用） */
  _ensureBudgetDay(now = Date.now()) {
    const d = utcDayStamp(now);
    if (this.kvBudget.date !== d) {
      this.kvBudget.date = d;
      this.kvBudget.used = 0;
      this._storageDirty = true;
    }
  }

  /**
   * 刷盘：DO storage（脏即写）+ KV 镜像（节流或 force）。
   * @param {number} now
   * @param {object} [opts] {forceKv:boolean} 管理端操作后立即镜像黑名单等
   */
  async flush(now = Date.now(), opts = {}) {
    if (!this.storage) return;
    if (this._storageDirty) {
      try {
        await this.storage.put(STATE_KEY, this._snapshot());
        this._storageDirty = false;
      } catch (e) {
        this.log.warn(`audit flush to storage failed: ${e.message}`);
      }
    }
    if (!this.kv || this._kvDirty.size === 0) return;
    if (!opts.forceKv && now - this._lastKvFlush < this.flushMs) return;
    this._lastKvFlush = now;
    this._ensureBudgetDay(now);
    // v1.7 A4：KV 写日预算门禁——预算内全写；超预算按牺牲序跳 rec 键，
    // bl:* 黑名单键永不跳（安全语义优先于预算）。跳过键保持脏标记，
    // 次日 UTC 重置（或预算释放）后由下一轮 flush 自动补写。
    let budgetLeft = Math.max(0, KV_WRITE_DAILY_BUDGET - this.kvBudget.used);
    const all = Array.from(this._kvDirty);
    this._kvDirty.clear();
    const allowed = [];
    const skipped = [];
    if (all.length > budgetLeft) {
      const bl = [];
      const rec = [];
      for (const k of all) (k.startsWith('bl:') ? bl : rec).push(k);
      rec.sort((a, b) => keepRank(a) - keepRank(b));
      for (const k of rec) {
        if (budgetLeft > 0) { allowed.push(k); budgetLeft -= 1; }
        else skipped.push(k);
      }
      allowed.push(...bl);
    } else {
      allowed.push(...all);
    }
    if (skipped.length > 0) {
      for (const k of skipped) this._kvDirty.add(k);
      if (this.counters) this.counters.kvWriteBudgetSkipped += skipped.length;
      this.log.warn(
        `kv write budget exhausted (${this.kvBudget.used}/${KV_WRITE_DAILY_BUDGET}), ` +
        `skipped: ${skipped.join(', ')}`
      );
    }
    // v1.4.1：分批写 KV——免费计划单次调用同时打开的连接数上限为 6，
    // 脏键最多 11 个（7 记录 + 4 黑名单），一次性 Promise.all 会触发排队。
    // v1.7 D5：失败按批回滚脏标记 + kvWriteFailed 计数；预算按「尝试」计
    // （失败请求同样占用 KV 配额口径，防重试风暴双计）。
    const CHUNK = 6;
    for (let i = 0; i < allowed.length; i += CHUNK) {
      const batch = allowed.slice(i, i + CHUNK);
      try {
        await Promise.all(batch.map((k) => this.kv.put(
          this._kvKey(k),
          JSON.stringify(k.startsWith('rec:') ? this.records.get(k.slice(4)) : this.blacklist.get(k.slice(3)))
        )));
        this.kvBudget.used += batch.length;
      } catch (e) {
        this.log.warn(`audit flush to kv failed: ${e.message}`);
        for (const k of batch) this._kvDirty.add(k); // 失败下轮重试
        if (this.counters) this.counters.kvWriteFailed += batch.length;
        this.kvBudget.used += batch.length;
      }
    }
  }

  isDirty() {
    return this._storageDirty || this._kvDirty.size > 0;
  }

  /**
   * v1.7 复核修复：是否存在「可立即写入」的脏数据。
   * A4 预算耗尽后被跳过的 rec 键会常驻 _kvDirty 等待次日——isDirty() 因此恒真，
   * 若直接用于 alarm 排程会把空闲房间从 idle 退避（300s）拉回 15s 节奏（≈5,760
   * 请求/天，与 A4/A5 的省额度目标相反）。本方法在预算耗尽日忽略此类键
   *（bl:* 仍可写故仍算可写），跨日重置后由 idle 节奏的 flush 自动补齐。
   */
  hasFlushableDirty() {
    if (this._storageDirty) return true;
    if (this._kvDirty.size === 0 || !this.kv) return false;
    const today = utcDayStamp();
    const exhausted = this.kvBudget.date === today && this.kvBudget.used >= KV_WRITE_DAILY_BUDGET;
    if (!exhausted) return true;
    for (const k of this._kvDirty) if (k.startsWith('bl:')) return true;
    return false;
  }

  // -------------------------------------------------------------------
  // 记录（六类数据记录 + 管理端审计）
  // -------------------------------------------------------------------

  /**
   * 追加一条记录。持久化由 alarm 周期 / 管理端操作完成后的统一 flush 负责。
   * @param {string} type RECORD_TYPES 之一
   * @param {object} ev {event:'join'|'leave'|..., ...明细}
   */
  record(type, ev) {
    if (!RECORD_TYPES.includes(type)) return;
    if (type === 'admin') {
      if (!this.adminAudit) return; // 硬开关（wrangler.toml），管理页不可关闭
    } else {
      const cfg = this.config[type];
      if (!cfg || !cfg.on) return; // 管理页可单独开关
    }
    const limit = type === 'admin' ? this.adminAuditLimit : this.config[type].limit;
    const arr = this.records.get(type);
    this.seq += 1;
    // v1.6.0 C4：AUDIT_IP_MASK 开启时记录内 IP 打码（仅记录展示；黑名单仍完整 IP）
    const ev2 = this.ipMask && ev && typeof ev.ip === 'string' ? { ...ev, ip: maskIp(ev.ip) } : ev;
    arr.push({ id: this.seq, ts: Date.now(), ...ev2 });
    if (arr.length > limit) arr.splice(0, arr.length - limit);
    this._storageDirty = true;
    this._kvDirty.add('rec:' + type);
  }

  /**
   * 摘要抢占嫌疑记录：同网络名出现不同摘要的
   * 握手被拒事件——可能是先到者正常接入，也可能是恶意抢占（堵门）。
   * 按「网络名|ip」10 分钟窗口去重：持续攻击至多每天每来源几条记录
   *（免费额度零压力），其余由 room 层计数器观测。归入 digests 记录类，
   * 受「记录设置」既有开关控制，无新 KV 键。
   * @param {{networkName:string, digest?:string, ip?:string}} ev
   */
  recordSquatSuspect(ev) {
    const key = `${ev && ev.networkName || ''}|${ev && ev.ip || ''}`;
    const now = Date.now();
    const last = this._squatDedup.get(key) || 0;
    if (now - last < SQUAT_DEDUP_MS) return;
    // 定长 FIFO：超过上限清最旧键（Map 保持插入序），防内存无界增长
    if (this._squatDedup.size >= SQUAT_DEDUP_MAX) {
      const first = this._squatDedup.keys().next().value;
      this._squatDedup.delete(first);
    }
    this._squatDedup.set(key, now);
    this.record('digests', { event: 'squat-suspect', ...ev });
  }

  /**
   * 记录留存清理（v1.6.0 C4，AUDIT_RETENTION_DAYS）：按 ts 删除过期记录。
   * 仅清理 6 类运行记录——admin 为硬审计，不受留存策略影响。
   * 挂靠 alarm()（调用方自行节流，建议至多每小时一次）；清理后标记脏，
   * 由下一轮 flush 同步到 DO storage 与 KV 镜像。旧记录不回填打码。
   * @param {number} now 当前毫秒时间戳
   * @returns {number} 删除条数（retention 关闭时返回 0）
   */
  pruneExpired(now = Date.now()) {
    if (!this.retentionDays) return 0;
    const cutoff = now - this.retentionDays * 86_400_000;
    let removed = 0;
    for (const type of RUNTIME_TYPES) {
      const arr = this.records.get(type);
      if (!Array.isArray(arr) || arr.length === 0) continue;
      const kept = arr.filter((r) => typeof r.ts !== 'number' || r.ts >= cutoff);
      if (kept.length !== arr.length) {
        this.records.set(type, kept);
        removed += arr.length - kept.length;
        this._storageDirty = true;
        this._kvDirty.add('rec:' + type);
      }
    }
    return removed;
  }

  /**
   * 分页查询记录。
   * @param {string} type RECORD_TYPES 之一，或 'all'（跨类型合并：
   *        每条附带 type 字段，按全局 id 倒序即时间倒序，admin 硬记录一并展示）
   */
  listRecords(type, offset = 0, limit = 50) {
    if (type === 'all') {
      const merged = [];
      for (const t of RECORD_TYPES) {
        for (const r of this.records.get(t) || []) merged.push({ ...r, type: t });
      }
      merged.sort((a, b) => b.id - a.id);
      return {
        total: merged.length,
        offset,
        limit,
        items: merged.slice(offset, offset + limit),
      };
    }
    if (!RECORD_TYPES.includes(type)) return { total: 0, items: [] };
    const arr = this.records.get(type) || [];
    const items = arr.slice().reverse(); // 最新在前
    return {
      total: items.length,
      offset,
      limit,
      items: items.slice(offset, offset + limit),
    };
  }

  /**
   * 删除记录（单个/批量/清空）。admin 类记录不可通过管理页删除（硬审计）。
   * type='all' 时按 id 跨类型删除（ids='all' 清空全部六类数据记录），admin 永不删除。
   */
  deleteRecords(type, ids) {
    if (type === 'all') {
      let removed = 0;
      if (ids === 'all') {
        for (const t of RUNTIME_TYPES) {
          const arr = this.records.get(t);
          removed += arr.length;
          if (arr.length) {
            arr.length = 0;
            this._touch('rec:' + t);
          }
        }
        return { ok: true, removed };
      }
      const wanted = new Set((ids || []).map(Number));
      for (const t of RUNTIME_TYPES) {
        const arr = this.records.get(t);
        let changed = false;
        for (let i = arr.length - 1; i >= 0; i--) {
          if (wanted.has(arr[i].id)) {
            arr.splice(i, 1);
            removed += 1;
            changed = true;
          }
        }
        if (changed) this._touch('rec:' + t);
      }
      return { ok: true, removed };
    }
    if (!RECORD_TYPES.includes(type)) return { ok: false, error: 'bad_type' };
    if (type === 'admin') return { ok: false, error: 'admin_audit_immutable' };
    const arr = this.records.get(type);
    if (ids === 'all') {
      const n = arr.length;
      arr.length = 0;
      if (n > 0) this._touch('rec:' + type);
      return { ok: true, removed: n };
    }
    const wanted = new Set((ids || []).map(Number));
    const before = arr.length;
    for (let i = arr.length - 1; i >= 0; i--) {
      if (wanted.has(arr[i].id)) arr.splice(i, 1);
    }
    const removed = before - arr.length;
    if (removed > 0) this._touch('rec:' + type);
    return { ok: true, removed };
  }

  /** 运行时记录配置（管理页开关 + 上限） */
  getConfig() {
    return {
      types: this.config,
      adminAudit: this.adminAudit,           // 只读展示
      adminAuditLimit: this.adminAuditLimit, // 只读展示
      kvEnabled: !!this.kv,
      flushMs: this.flushMs,
      blacklistLimit: this.blacklistLimit,
      counts: this._counts(),
    };
  }

  setConfig(types) {
    if (!types || typeof types !== 'object') return { ok: false, error: 'types required' };
    for (const t of RUNTIME_TYPES) {
      const c = types[t];
      if (!c || typeof c !== 'object') continue;
      const cur = this.config[t];
      if (c.on !== undefined) cur.on = !!c.on;
      if (Number(c.limit) > 0) cur.limit = Math.min(10_000, Math.floor(Number(c.limit)));
      const arr = this.records.get(t);
      if (arr.length > cur.limit) { // 上限收紧：裁掉最旧记录
        arr.splice(0, arr.length - cur.limit);
        this._kvDirty.add('rec:' + t);
      }
    }
    this._storageDirty = true;
    return { ok: true, types: this.config };
  }

  _counts() {
    const counts = {};
    let total = 0;
    for (const t of RECORD_TYPES) {
      counts[t] = this.records.get(t).length;
      total += counts[t];
    }
    counts._total = total;
    return counts;
  }

  // -------------------------------------------------------------------
  // 黑名单（分四类，每类一条 KV 键）
  // -------------------------------------------------------------------

  blacklistAdd(cat, value, extra = {}) {
    if (!BLACKLIST_CATS.includes(cat)) return { ok: false, error: 'bad_cat' };
    const v = normValue(cat, value);
    if (cat === 'peer') {
      if (!Number.isInteger(v) || v <= 0) return { ok: false, error: 'bad_value' };
    } else if (!v) {
      return { ok: false, error: 'bad_value' };
    }
    const arr = this.blacklist.get(cat);
    const existing = arr.find((e) => e.value === v);
    if (existing) { // 已在黑名单：刷新时间/原因
      existing.ts = Date.now();
      if (extra.reason) existing.reason = String(extra.reason);
      this._touch('bl:' + cat);
      return { ok: true, existed: true, id: existing.id };
    }
    this.seq += 1;
    const entry = {
      id: this.seq,
      value: v,
      ts: Date.now(),
      reason: String(extra.reason || ''),
      ...(extra.groupKey != null ? { groupKey: extra.groupKey } : {}),
      ...(extra.networkName != null ? { networkName: extra.networkName } : {}),
    };
    arr.push(entry);
    if (arr.length > this.blacklistLimit) arr.splice(0, arr.length - this.blacklistLimit);
    this._touch('bl:' + cat);
    return { ok: true, existed: false, id: entry.id };
  }

  blacklistRemove(cat, ids) {
    if (!BLACKLIST_CATS.includes(cat)) return { ok: false, error: 'bad_cat' };
    const arr = this.blacklist.get(cat);
    if (ids === 'all') {
      const n = arr.length;
      const values = arr.map((e) => String(e.value));
      arr.length = 0;
      if (n > 0) this._touch('bl:' + cat);
      // v1.7 C4：values 供宿主清限流观察窗（解除拉黑 = 重新观察）
      return { ok: true, removed: n, values };
    }
    const wanted = new Set((ids || []).map(Number));
    const before = arr.length;
    const values = [];
    for (let i = arr.length - 1; i >= 0; i--) {
      if (wanted.has(arr[i].id)) { values.push(String(arr[i].value)); arr.splice(i, 1); }
    }
    const removed = before - arr.length;
    if (removed > 0) this._touch('bl:' + cat);
    return { ok: true, removed, values };
  }

  blacklistHas(cat, value) {
    const v = normValue(cat, value);
    return (this.blacklist.get(cat) || []).some((e) => e.value === v);
  }

  listBlacklist(cat, offset = 0, limit = 50) {
    if (!BLACKLIST_CATS.includes(cat)) return { total: 0, items: [] };
    const items = (this.blacklist.get(cat) || []).slice().reverse();
    return { total: items.length, offset, limit, items: items.slice(offset, offset + limit) };
  }

  blacklistCounts() {
    const counts = {};
    let total = 0;
    for (const c of BLACKLIST_CATS) {
      counts[c] = this.blacklist.get(c).length;
      total += counts[c];
    }
    counts._total = total;
    return counts;
  }

  /**
   * v1.7 C5：黑名单降级恢复——init 时 KV 恢复失败（配额/异常）后由 room alarm
   * 按 60s 节流调用本方法重试，成功即清除降态。与内存已有条目按 value 合并
   * （降级窗口内管理端新增不丢失），恢复出的条目由下一轮 flush 回写 DO storage。
   * @returns {boolean} 是否成功完成一次恢复尝试（无异常即 true，含无数据可恢复）
   */
  async reloadBlacklists() {
    if (!this.kv || !this.blDegraded) return false;
    try {
      let added = 0;
      // 黑名单：按 value 合并（降级窗口内管理端新增不丢失）
      for (const c of BLACKLIST_CATS) {
        const v = await this.kv.get(this._kvKey('bl:' + c), 'json');
        if (!Array.isArray(v) || !v.length) continue;
        const cur = this.blacklist.get(c);
        const have = new Set(cur.map((e) => String(e.value)));
        for (const e of v) {
          if (e && !have.has(String(e.value))) { cur.push(e); have.add(String(e.value)); added += 1; }
        }
      }
      // v1.7 复核修复：恢复降级语义扩展至记录类——仅回读「内存为空」的类型
      //（恢复失败的通常是空类型；非空类型不合并，避免覆盖/复活已清理数据），
      // 按 id 去重合并。
      for (const t of RECORD_TYPES) {
        const cur = this.records.get(t) || [];
        if (cur.length) continue;
        const v = await this.kv.get(this._kvKey('rec:' + t), 'json');
        if (!Array.isArray(v) || !v.length) continue;
        this.records.set(t, v);
        added += v.length;
      }
      for (const t of RECORD_TYPES) {
        for (const r of this.records.get(t) || []) {
          if (Number.isFinite(r.id) && r.id > this.seq) this.seq = r.id;
        }
      }
      for (const c of BLACKLIST_CATS) {
        for (const r of this.blacklist.get(c) || []) {
          if (Number.isFinite(r.id) && r.id > this.seq) this.seq = r.id;
        }
      }
      this.blDegraded = false;
      if (added > 0) this._storageDirty = true;
      this.log.info('audit restore recovered (records+blacklist, degraded cleared)');
      return true;
    } catch (e) {
      this.log.warn(`audit reload failed: ${e.message}`);
      return false;
    }
  }

  /**
   * 接入拦截判定：IP（连接建立即拦）/ peerId / 网络名（分组与摘要两类）。
   * digest 类 v1.4.2 起支持「网络名:摘要」完整粒度（删分组/删摘要注册时写入），
   * 同时回退匹配纯网络名（存量数据与管理端手工拉黑）。
   * @param {{ip?:string, peerId?:number, networkName?:string, digestHex?:string}} q
   * @returns {{blocked:boolean, cat?:string, value?:string|number}}
   */
  checkAccess({ ip, peerId, networkName, digestHex }) {
    if (ip && this.blacklistHas('socket', ip)) return { blocked: true, cat: 'socket', value: ip };
    if (peerId != null && this.blacklistHas('peer', peerId)) {
      return { blocked: true, cat: 'peer', value: peerId };
    }
    if (networkName) {
      // digest 类：先匹配完整「网络名:摘要」（新粒度），回退纯网络名（存量/手工）
      const full = digestHex ? `${networkName}:${digestHex}` : null;
      const digestHit = (full && this.blacklistHas('digest', full))
        ? full
        : (this.blacklistHas('digest', networkName) ? networkName : null);
      if (digestHit) {
        return { blocked: true, cat: 'digest', value: digestHit };
      }
      if (this.blacklistHas('group', networkName)) {
        return { blocked: true, cat: 'group', value: networkName };
      }
    }
    return { blocked: false };
  }

  // -------------------------------------------------------------------
  // 管理端审计（登录 / 操作）
  // -------------------------------------------------------------------

  /**
   * 管理端已鉴权请求入口：登录去重记录 + 操作明细记录。
   * v1.3.0 起"查看"（view）不再产生记录——管理页 10s 自动刷新会持续刷屏，
   * 且每条都会产生 DO storage/KV 写入；查看类请求仅触发登录去重判定。
   */
  adminTouch(ip, kind, detail) {
    const now = Date.now();
    const lastLogin = this._lastLoginByIp.get(ip) || 0;
    if (now - lastLogin > LOGIN_DEDUP_MS) {
      this._lastLoginByIp.set(ip, now);
      this.record('admin', { event: 'login', ip });
    }
    if (kind === 'view') return; // 查看不记录（v1.3.0）
    this.record('admin', { event: kind || 'op', ip, ...(detail || {}) });
  }

  // -------------------------------------------------------------------

  _touch(kvKey) {
    this._storageDirty = true;
    this._kvDirty.add(kvKey);
  }
}
