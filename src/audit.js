/**
 * KV 审计存储：事件记录（连接/路由/互联/摘要等）+ 管理端黑名单。
 *
 * 设计（针对 Cloudflare 免费额度的成本控制）：
 * 1. 键值布局 —— 每类信息只占一条 KV 键：
 *    - 记录：et-relay:rec:<type>，type ∈ groups|peers|routes|peercenter|sockets|digests|admin
 *    - 黑名单：et-relay:bl:<cat>，cat ∈ peer|group|digest|socket
 * 2. 三级写入路径：
 *    - 事件发生 → 仅写内存（零成本）；
 *    - alarm 周期（15s）→ 脏数据刷入 DO storage（SQLite，免费额度充裕，防休眠丢失）；
 *    - KV 镜像 → 按 RECORD_FLUSH_MS（默认 10 分钟）节流，仅写脏键。
 *    KV 免费额度 1000 写/天：默认间隔下每键最多 144 写/天，典型小网络
 *    （每天几十次连接波动）实际写入远低于该值。
 * 3. 读取路径：管理端查询直接读内存；仅冷启动且 DO storage 为空时回读 KV
 *    （每键一次，全生命周期最多一次）。
 * 4. 管理端审计（登录/操作/查看）为硬设置（wrangler.toml ADMIN_AUDIT），
 *    管理页不可关闭；六类数据记录可由管理页单独开关并设置上限。
 * 5. 黑名单分四类（peer/group/digest/socket），管理操作（踢出/删除分组/
 *    删除摘要/断开连接）自动记录进对应类别；握手时按类别拦截。
 */

export const RECORD_TYPES = ['groups', 'peers', 'routes', 'peercenter', 'sockets', 'digests', 'admin'];
const RUNTIME_TYPES = ['groups', 'peers', 'routes', 'peercenter', 'sockets', 'digests'];
export const BLACKLIST_CATS = ['peer', 'group', 'digest', 'socket'];

const STATE_KEY = 'audit_state';
const KV_PREFIX = 'et-relay:';
/** 管理端审计：同一 IP 的查看记录折叠窗口（管理页 10s 自动刷新不刷屏） */
const VIEW_DEDUP_MS = 5 * 60_000;
/** 管理端审计：同一 IP 的登录记录折叠窗口 */
const LOGIN_DEDUP_MS = 10 * 60_000;

/** 黑名单类别与记录类别的合法值归一化（peer 为数字，其余为字符串） */
function normValue(cat, value) {
  if (cat === 'peer') return Number(value);
  return String(value ?? '');
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
    this.log = opts.log || { warn: () => {}, debug: () => {} };

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
    this._lastViewIdByIp = new Map(); // ip -> 最近一条查看记录 id（计数折叠）
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
        return;
      }
    } catch (e) {
      this.log.warn(`audit load failed: ${e.message}`);
    }
    // 冷启动回退：DO storage 为空（首次部署/被重置）时从 KV 恢复
    if (this.kv) {
      try {
        for (const t of RECORD_TYPES) {
          const v = await this.kv.get(KV_PREFIX + 'rec:' + t, 'json');
          if (Array.isArray(v) && v.length) this.records.set(t, v);
        }
        for (const c of BLACKLIST_CATS) {
          const v = await this.kv.get(KV_PREFIX + 'bl:' + c, 'json');
          if (Array.isArray(v) && v.length) this.blacklist.set(c, v);
        }
      } catch (e) {
        this.log.warn(`audit kv restore failed: ${e.message}`);
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
  }

  _snapshot() {
    const records = {};
    for (const [t, arr] of this.records) records[t] = arr;
    const blacklist = {};
    for (const [c, arr] of this.blacklist) blacklist[c] = arr;
    return { v: 1, seq: this.seq, records, blacklist, config: this.config };
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
    const keys = Array.from(this._kvDirty);
    this._kvDirty.clear();
    try {
      await Promise.all(keys.map((k) => this.kv.put(
        KV_PREFIX + k,
        JSON.stringify(k.startsWith('rec:') ? this.records.get(k.slice(4)) : this.blacklist.get(k.slice(3)))
      )));
    } catch (e) {
      this.log.warn(`audit flush to kv failed: ${e.message}`);
      for (const k of keys) this._kvDirty.add(k); // 失败下轮重试
    }
  }

  isDirty() {
    return this._storageDirty || this._kvDirty.size > 0;
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
    arr.push({ id: this.seq, ts: Date.now(), ...ev });
    if (arr.length > limit) arr.splice(0, arr.length - limit);
    this._storageDirty = true;
    this._kvDirty.add('rec:' + type);
  }

  listRecords(type, offset = 0, limit = 50) {
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

  /** 删除记录（单个/批量/清空）。admin 类记录不可通过管理页删除（硬审计）。 */
  deleteRecords(type, ids) {
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
      arr.length = 0;
      if (n > 0) this._touch('bl:' + cat);
      return { ok: true, removed: n };
    }
    const wanted = new Set((ids || []).map(Number));
    const before = arr.length;
    for (let i = arr.length - 1; i >= 0; i--) {
      if (wanted.has(arr[i].id)) arr.splice(i, 1);
    }
    const removed = before - arr.length;
    if (removed > 0) this._touch('bl:' + cat);
    return { ok: true, removed };
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
   * 接入拦截判定：IP（连接建立即拦）/ peerId / 网络名（分组与摘要两类）。
   * @returns {{blocked:boolean, cat?:string, value?:string|number}}
   */
  checkAccess({ ip, peerId, networkName }) {
    if (ip && this.blacklistHas('socket', ip)) return { blocked: true, cat: 'socket', value: ip };
    if (peerId != null && this.blacklistHas('peer', peerId)) {
      return { blocked: true, cat: 'peer', value: peerId };
    }
    if (networkName) {
      if (this.blacklistHas('digest', networkName)) {
        return { blocked: true, cat: 'digest', value: networkName };
      }
      if (this.blacklistHas('group', networkName)) {
        return { blocked: true, cat: 'group', value: networkName };
      }
    }
    return { blocked: false };
  }

  // -------------------------------------------------------------------
  // 管理端审计（登录 / 查看 / 操作）
  // -------------------------------------------------------------------

  /** 管理端已鉴权请求入口：登录去重 + 查看折叠计数 */
  adminTouch(ip, kind, detail) {
    const now = Date.now();
    if (kind === 'view') {
      const lastLogin = this._lastLoginByIp.get(ip) || 0;
      if (now - lastLogin > LOGIN_DEDUP_MS) {
        this._lastLoginByIp.set(ip, now);
        this.record('admin', { event: 'login', ip });
      }
      const lastId = this._lastViewIdByIp.get(ip);
      const arr = this.records.get('admin');
      const last = lastId != null ? arr.find((r) => r.id === lastId) : null;
      if (last && now - last.ts <= VIEW_DEDUP_MS) {
        last.ts = now;
        last.count = (last.count || 1) + 1;
        this._storageDirty = true;
        this._kvDirty.add('rec:admin');
        return;
      }
      this.seq += 1;
      arr.push({ id: this.seq, ts: now, event: 'view', ip, count: 1 });
      if (arr.length > this.adminAuditLimit) arr.splice(0, arr.length - this.adminAuditLimit);
      this._lastViewIdByIp.set(ip, this.seq);
      this._storageDirty = true;
      this._kvDirty.add('rec:admin');
      return;
    }
    // kind === 'op'（或其它显式事件）：登录去重后记录操作明细
    const lastLogin = this._lastLoginByIp.get(ip) || 0;
    if (now - lastLogin > LOGIN_DEDUP_MS) {
      this._lastLoginByIp.set(ip, now);
      this.record('admin', { event: 'login', ip });
    }
    this.record('admin', { event: kind || 'op', ip, ...(detail || {}) });
  }

  // -------------------------------------------------------------------

  _touch(kvKey) {
    this._storageDirty = true;
    this._kvDirty.add(kvKey);
  }
}
