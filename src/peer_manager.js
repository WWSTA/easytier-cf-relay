/**
 * 房间状态管理（每个 Durable Object 实例独立持有，非模块级单例）。
 *
 * 修复的既有开源实现问题：
 * 1. icesoulhanxi 将 PeerManager 放在模块级 —— 同一 isolate 内多个 DO 实例共享状态，
 *    存在跨房间数据污染风险。本实现挂在 DO 实例上。
 * 2. 路由同步采用「版本 + 会话」增量机制（对齐官方 OSPF 行为）：
 *    - RoutePeerInfo.version 增量推送；
 *    - peer_route_id 变化视为新路由实例（官方语义，处理客户端重启后版本回退）；
 *    - conn bitmap / foreign network 基于签名去重，仅在变化时携带。
 * 3. RoutePeerInfo 原始字节保留（对齐官方 route_peer_wire.rs raw_peer_infos）：
 *    客户端上报的信息以原始 wire 字节存储，转发给其他客户端时逐字节原样搬运，
 *    本端 descriptor 未覆盖的新字段（17+）不会丢失。
 * 4. 只推送真实存在的 peer 信息（server 自身 + 客户端上报），不发 version=0 的
 *    stub（官方 build_route_info 语义：仅发送版本更新且可达的 peer）。
 */
import Long from 'long';
import {
  PEER_CENTER_TTL_MS, SESSION_TTL_MS,
  ROUTE_INFO_TTL_MS, ROUTE_INFO_UNREACHABLE_MS,
} from './constants.js';
import { randomU64Long, longToString } from './proto.js';
import { generateNetworkDigest, bytesToHex } from './siphash.js';
function nowTs() {
  const ms = Date.now();
  return { seconds: Long.fromNumber(Math.floor(ms / 1000)), nanos: (ms % 1000) * 1e6 };
}

/** 摘要注册表：同名网络不同摘要的处理 */
export function resolveGroupKey(config, digestRegistry, networkName, digestHex) {
  const name = String(networkName || '');
  if (config.networkSecrets && Object.prototype.hasOwnProperty.call(config.networkSecrets, name)) {
    const expected = bytesToHex(
      generateNetworkDigest(name, String(config.networkSecrets[name] ?? ''))
    );
    if (expected !== digestHex) {
      return { error: 'digest_mismatch' };
    }
    // F-05 加固：已登记密钥的网络以服务端摘要为准（自愈注册表），
    // 先占者写入的错误摘要无法封锁持正确密钥的后来者。
    digestRegistry.set(name, expected);
    return { groupKey: `${name}:${expected}` };
  }
  if (config.strictDigest) {
    const existing = digestRegistry.get(name);
    if (existing && existing !== digestHex) {
      return { error: 'digest_mismatch' };
    }
    if (!existing) digestRegistry.set(name, digestHex);
  }
  return { groupKey: `${name}:${digestHex}` };
}

export class PeerManager {
  /**
   * @param {object} config 已归一化的运行配置
   */
  constructor(config) {
    this.config = config;
    // 老化配置兜底（直接构造 PeerManager 的场景，如单元测试）
    if (!Number.isFinite(this.config.routeInfoTtlMs) || !(this.config.routeInfoTtlMs > 0)) {
      this.config.routeInfoTtlMs = ROUTE_INFO_TTL_MS;
    }
    if (!Number.isFinite(this.config.routeInfoUnreachableMs) || !(this.config.routeInfoUnreachableMs > 0)) {
      this.config.routeInfoUnreachableMs = ROUTE_INFO_UNREACHABLE_MS;
    }
    /** @type {Map<string, {peers:Map<number,WebSocket>, infos:Map<number,object>, rawInfos:Map<number,Uint8Array>, connVersions:Map<number,number>, sessions:Map<number,object>, peerCenter:object}>} */
    this.groups = new Map();
    /** @type {Map<string,string>} networkName -> digestHex（仅 strictDigest 模式使用） */
    this.digestRegistry = new Map();
    /** 服务端身份（持久化，重启稳定） */
    this.serverIdentity = null;
    this._lastSessionClean = 0;
    this._lastPeerCenterClean = 0;
  }

  // ---------- 服务端身份 ----------

  ensureServerIdentity() {
    if (this.serverIdentity) return this.serverIdentity;
    this.serverIdentity = {
      instId: {
        part1: Math.floor(Math.random() * 0xffffffff),
        part2: Math.floor(Math.random() * 0xffffffff),
        part3: Math.floor(Math.random() * 0xffffffff),
        part4: Math.floor(Math.random() * 0xffffffff),
      },
      peerRouteId: randomU64Long(),
      startedAt: Date.now(),
    };
    return this.serverIdentity;
  }

  /** 服务端 RoutePeerInfo（不含虚拟 IP —— 外部网络中继模式下无需 IP） */
  buildServerInfo() {
    const id = this.ensureServerIdentity();
    return {
      peerId: this.config.serverPeerId,
      instId: id.instId,
      cost: 1,
      version: 1,
      lastUpdate: nowTs(),
      hostname: this.config.serverHostname,
      easytierVersion: this.config.serverVersionStr,
      featureFlag: {
        isPublicServer: true,
        avoidRelayData: this.config.avoidRelayData,
        kcpInput: false,
        noRelayKcp: false,
      },
      networkLength: 24,
      peerRouteId: id.peerRouteId,
      groups: [],
    };
  }

  // ---------- 分组 ----------

  ensureGroup(groupKey, networkName) {
    let g = this.groups.get(groupKey);
    if (!g) {
      g = {
        peers: new Map(),
        infos: new Map(),
        rawInfos: new Map(),
        infoSource: new Map(), // F-07：pid -> 'direct'（自报）| 'transit'（他报）
        infoUpdatedAt: new Map(), // 幽灵防线：pid -> 最后接受该条目的服务端时间
        infoReporters: new Map(), // 幽灵防线：pid -> Set(上报该 transit 条目的在线节点)
        connVersions: new Map(),
        sessions: new Map(),
        peerCenter: { globalPeerMap: new Map(), digest: '0' },
        networkName: networkName || networkNameOfKey(groupKey),
        emptySince: Date.now(), // 在线节点归零的时刻（用于空分组自动删除）
      };
      this.groups.set(groupKey, g);
    } else if (networkName) {
      g.networkName = networkName;
    }
    return g;
  }

  getGroup(groupKey) {
    return this.groups.get(groupKey);
  }

  groupCount() {
    return this.groups.size;
  }

  totalPeers() {
    let n = 0;
    for (const g of this.groups.values()) n += g.peers.size;
    return n;
  }

  // ---------- 成员管理 ----------

  /**
   * 注册已握手 peer。返回被顶替的旧连接（同一 peerId 重连）。
   */
  addPeer(groupKey, peerId, ws) {
    const g = this.ensureGroup(groupKey);
    const old = g.peers.get(peerId);
    g.peers.set(peerId, ws);
    g.emptySince = null; // 分组重新有在线节点，撤销自动删除计时
    if (!old) this.bumpAllConnVersions(groupKey);
    // 幽灵防线：节点（重）连时清掉其名下遗留的路由条目（transit 幽灵 /
    // 持久化残留的过期 direct），由节点随后的自报（direct）重建干净条目。
    if (g.infos.has(peerId)) this._removeInfoEntry(g, peerId);
    return old && old !== ws ? old : null;
  }

  /**
   * 移除 peer。返回是否确实移除（触发拓扑变化）。
   */
  removePeer(groupKey, peerId) {
    const g = this.groups.get(groupKey);
    if (!g) return false;
    const removed = g.peers.delete(peerId);
    this._removeInfoEntry(g, peerId);
    g.sessions.delete(peerId);
    if (removed) this.bumpAllConnVersions(groupKey);
    if (g.peers.size === 0 && g.emptySince == null) {
      g.emptySince = Date.now(); // 启动空分组自动删除计时（含摘要注册一并解除）
    }
    // 幽灵防线：该节点断开后，其上报过的 transit 条目失去来源；
    // 无其他在线上报者的条目立即删除（返回 pid 列表供上层广播）。
    this._removeReporterFromGroup(g, peerId);
    return removed;
  }

  /** 删除一条路由条目的全部关联状态 */
  _removeInfoEntry(g, pid) {
    g.infos.delete(pid);
    g.rawInfos.delete(pid);
    g.infoSource.delete(pid);
    g.infoUpdatedAt.delete(pid);
    g.infoReporters.delete(pid);
  }

  /** 从该分组所有 transit 条目的上报者集合中移除 reporterPid，清理失去来源的条目 */
  _removeReporterFromGroup(g, reporterPid) {
    const removed = [];
    for (const [pid, reporters] of g.infoReporters) {
      if (!reporters.delete(reporterPid)) continue;
      if (reporters.size === 0 && !g.peers.has(pid)) {
        this._removeInfoEntry(g, pid);
        removed.push(pid);
      }
    }
    if (removed.length) {
      const groupKey = this._keyOfGroup(g) || '';
      if (groupKey) this.bumpAllConnVersions(groupKey);
    }
    return removed;
  }

  /** 反查分组 key（线性扫描，仅在清理路径使用） */
  _keyOfGroup(target) {
    for (const [k, g] of this.groups) {
      if (g === target) return k;
    }
    return null;
  }

  getPeer(groupKey, peerId) {
    const g = this.groups.get(groupKey);
    return g ? g.peers.get(peerId) : undefined;
  }

  listPeerIds(groupKey) {
    const g = this.groups.get(groupKey);
    return g ? Array.from(g.peers.keys()) : [];
  }

  // ---------- 连接版本（conn bitmap 变更通知） ----------

  bumpAllConnVersions(groupKey) {
    const g = this.getGroup(groupKey);
    if (!g) return;
    const ids = new Set(g.peers.keys());
    for (const pid of g.infos.keys()) ids.add(pid);
    ids.add(this.config.serverPeerId);
    for (const pid of ids) {
      g.connVersions.set(pid, (g.connVersions.get(pid) || 0) + 1);
    }
  }

  // ---------- peer 信息 ----------

  /**
   * 更新 peer 的 RoutePeerInfo（对象 + 原始字节同时保存）。
   * @param {string} groupKey
   * @param {object} info 已解码的 RoutePeerInfo
   * @param {Uint8Array|null} rawBytes 该条信息的原始 wire 字节（未知字段保留）
   * @param {'direct'|'transit'} source direct=该 peer 本人上报；transit=其他 peer 转述
   * @param {number|null} reporterPid 上报者 peerId（transit 时用于追踪来源）
   * @returns {{isNew:boolean, changed:boolean, rejected:boolean}}
   */
  updatePeerInfo(groupKey, info, rawBytes = null, source = 'direct', reporterPid = null) {
    if (!info || typeof info.peerId !== 'number') {
      return { isNew: false, changed: false, rejected: false };
    }
    const pid = info.peerId;
    if (pid === this.config.serverPeerId) return { isNew: false, changed: false, rejected: false };
    const g = this.ensureGroup(groupKey);
    const now = Date.now();
    const existing = g.infos.get(pid);
    const existingSource = g.infoSource.get(pid);

    // 幽灵防线 A：已连接节点的条目只接受其本人自报（防他报覆盖在线节点）
    if (source === 'transit' && g.peers.has(pid)) {
      return { isNew: false, changed: false, rejected: true };
    }
    // F-07 加固：他报（transit）信息不得覆盖直连成员的自报（direct）信息，
    // 防止路由投毒污染在线成员的路由条目。直连成员离线后其条目随 removePeer 删除，
    // 此时 transit 信息可重新作为唯一来源被接受（保持 mesh 可达性）。
    if (source === 'transit' && existingSource === 'direct') {
      return { isNew: false, changed: false, rejected: true };
    }

    if (!existing) {
      g.infos.set(pid, info);
      g.infoSource.set(pid, source);
      g.infoUpdatedAt.set(pid, now);
      if (rawBytes) g.rawInfos.set(pid, rawBytes);
      if (source === 'transit') {
        g.infoReporters.set(pid, reporterPid != null ? new Set([reporterPid]) : new Set());
      }
      this.bumpAllConnVersions(groupKey);
      return { isNew: true, changed: true, rejected: false };
    }

    // 幽灵防线 B：direct 自报无条件覆盖遗留 transit 条目（忽略版本号）——
    // 场景：节点重启后 version 从 1 重新计数，而遗留 transit 幽灵持有高版本，
    // 版本比较会拒绝节点自报，使幽灵永久存活。自报是权威来源，必须接受。
    if (source === 'direct' && existingSource === 'transit') {
      g.infos.set(pid, info);
      g.infoSource.set(pid, 'direct');
      g.infoUpdatedAt.set(pid, now);
      g.infoReporters.delete(pid);
      if (rawBytes) g.rawInfos.set(pid, rawBytes);
      else g.rawInfos.delete(pid);
      return { isNew: false, changed: true, rejected: false };
    }

    const existingRouteId = longToString(existing.peerRouteId);
    const incomingRouteId = longToString(info.peerRouteId);
    const existingVer = Number(existing.version) || 0;
    const incomingVer = Number(info.version) || 0;
    // 官方语义：peer_route_id 变化 = 新路由实例，无条件替换（处理版本回退）
    if (incomingRouteId !== existingRouteId || incomingVer >= existingVer) {
      g.infos.set(pid, info);
      g.infoSource.set(pid, source);
      g.infoUpdatedAt.set(pid, now);
      if (source === 'transit') {
        let reporters = g.infoReporters.get(pid);
        if (!reporters) {
          reporters = new Set();
          g.infoReporters.set(pid, reporters);
        }
        if (reporterPid != null) reporters.add(reporterPid);
      }
      if (rawBytes) {
        g.rawInfos.set(pid, rawBytes);
      } else {
        g.rawInfos.delete(pid); // 无法保留原始字节时退回对象路径
      }
      return { isNew: false, changed: incomingRouteId !== existingRouteId || incomingVer !== existingVer, rejected: false };
    }
    return { isNew: false, changed: false, rejected: false };
  }

  // ---------- 路由条目老化（幽灵清除，官方 clear_expired_peer 语义） ----------

  /**
   * PeerCenter 可达判定：任一新鲜上报将 pid 列为其直连节点则视为可达。
   * （等价官方 topology_peer_reachable —— 本中继以 PeerCenter 直连表为拓扑）
   */
  _peerCenterReachable(g, pid, now) {
    for (const e of g.peerCenter.globalPeerMap.values()) {
      if (now - (e.lastSeen || 0) > PEER_CENTER_TTL_MS) continue;
      if (e.directPeers && Object.prototype.hasOwnProperty.call(e.directPeers, pid)) return true;
    }
    return false;
  }

  /**
   * 路由条目老化清理（由 alarm 周期调用）：
   * - 死亡层：条目超过 routeInfoTtlMs 未被刷新 → 无条件删除；
   * - 不可达层：条目超过 routeInfoUnreachableMs 未刷新、节点未连接且
   *   PeerCenter 无新鲜可达记录 → 删除。
   * 活跃节点（含经其他在线节点 P2P 可达的 transit 条目）会周期性刷新
   * （官方 UPDATE_PEER_INFO_PERIOD=3600s 强制 version+1），因此不受影响。
   * @returns {{groupKey:string, removed:number[]}[]} 被清理的条目（供上层广播）
   */
  cleanupExpiredRouteInfos(now = Date.now()) {
    const out = [];
    for (const [gk, g] of this.groups) {
      const removed = [];
      for (const pid of g.infos.keys()) {
        if (g.peers.has(pid)) continue; // 在线节点由连接生命周期管理
        const age = now - (g.infoUpdatedAt.get(pid) ?? now);
        if (age > this.config.routeInfoTtlMs) {
          removed.push(pid);
          continue;
        }
        if (age > this.config.routeInfoUnreachableMs && !this._peerCenterReachable(g, pid, now)) {
          removed.push(pid);
        }
      }
      if (removed.length) {
        for (const pid of removed) this._removeInfoEntry(g, pid);
        this.bumpAllConnVersions(gk);
        out.push({ groupKey: gk, removed });
      }
    }
    return out;
  }

  /**
   * 空分组自动删除：在线节点归零持续超过宽限期的分组整组删除
   * （含路由条目与摘要注册，返回删除明细供上层落盘）。
   * 同时清理无对应分组的孤儿摘要注册项（分组已删而注册残留的场景）。
   * @param {number} graceMs 宽限期（<=0 关闭该功能）
   */
  autoDeleteEmptyGroups(graceMs, now = Date.now()) {
    if (!(graceMs > 0)) return [];
    const deleted = [];
    for (const [gk, g] of Array.from(this.groups)) {
      if (g.peers.size > 0) continue;
      const since = g.emptySince ?? now;
      if (now - since >= graceMs) {
        const info = this.clearGroup(gk);
        deleted.push({ groupKey: gk, networkName: info.networkName, routeInfos: 0 });
      }
    }
    // 孤儿摘要注册：分组不存在（或同样为空）时一并解除，防注册项永久残留
    for (const [name, digest] of Array.from(this.digestRegistry)) {
      const g = this.groups.get(`${name}:${digest}`);
      if (!g || (g.peers.size === 0 && now - (g.emptySince ?? now) >= graceMs)) {
        this.digestRegistry.delete(name);
      }
    }
    return deleted;
  }

  // ---------- 路由同步会话 ----------

  getSession(groupKey, peerId, create = false) {
    this._maybeCleanSessions();
    const g = this.ensureGroup(groupKey);
    let s = g.sessions.get(peerId);
    if (!s && create) {
      s = {
        mySessionId: null, // 本端（服务端）会话 id，按连接存在；此处缓存最近一次
        dstSessionId: null, // 对端会话 id
        sentVersions: new Map(),
        lastBitmapSig: null,
        lastForeignSig: null,
        foreignVer: 0,
        lastTouch: Date.now(),
      };
      g.sessions.set(peerId, s);
    }
    if (s) s.lastTouch = Date.now();
    return s;
  }

  /**
   * 对端 SyncRouteInfoResponse 确认。会话 id 变化 -> 全量重同步。
   */
  onRouteSessionAck(groupKey, peerId, remoteSessionId) {
    const s = this.getSession(groupKey, peerId, true);
    const idStr = longToString(remoteSessionId);
    if (s.dstSessionId !== idStr) {
      s.dstSessionId = idStr;
      s.sentVersions.clear();
      s.lastBitmapSig = null;
      s.lastForeignSig = null;
      s.foreignVer = 0;
    }
  }

  _maybeCleanSessions() {
    const now = Date.now();
    if (now - this._lastSessionClean < 60_000) return;
    this._lastSessionClean = now;
    for (const g of this.groups.values()) {
      for (const [pid, s] of g.sessions) {
        if (now - s.lastTouch > SESSION_TTL_MS) g.sessions.delete(pid);
      }
    }
  }

  // ---------- 路由推送构造 ----------

  /**
   * 构造发往 targetPeerId 的路由推送中间结构（由上层 wire 重组为字节）。
   *
   * @param {string} groupKey
   * @param {number} targetPeerId
   * @param {boolean} forceFull
   * @param {boolean} weAreInitiator 本端在该会话中的角色
   * @param {Long} serverSessionId 本端（服务端）在该连接上的会话 id
   * @returns {{myPeerId:number, mySessionId:Long, isInitiator:boolean,
   *            items:{info:object, raw:Uint8Array|null}[],
   *            connBitmap:object|null, foreignNetworkInfos:object|null}|null}
   */
  buildRoutePush(groupKey, targetPeerId, forceFull, weAreInitiator, serverSessionId) {
    const g = this.ensureGroup(groupKey);
    const session = this.getSession(groupKey, targetPeerId, true);
    session.mySessionId = serverSessionId;
    const fullSync = forceFull || !session.dstSessionId;

    // 候选 peer 集合：已连接 + 已知信息 + 目标自身 + 服务端
    const ids = new Set(g.peers.keys());
    for (const pid of g.infos.keys()) ids.add(pid);
    ids.add(targetPeerId);
    ids.add(this.config.serverPeerId);
    const sortedIds = Array.from(ids)
      .filter((p) => p !== this.config.serverPeerId)
      .sort((a, b) => a - b);
    const allIds = [this.config.serverPeerId, ...sortedIds];

    // 1) 增量 peer_infos（server 自身 + 已上报的客户端信息；不发 stub）
    const items = [];
    if (fullSync) session.sentVersions.delete(this.config.serverPeerId);
    {
      const serverInfo = this.buildServerInfo();
      const ver = Number(serverInfo.version) || 0;
      const sent = fullSync ? -1 : session.sentVersions.get(this.config.serverPeerId) ?? -1;
      if (ver > sent) {
        items.push({ info: serverInfo, raw: null });
        session.sentVersions.set(this.config.serverPeerId, ver);
      }
    }
    for (const pid of sortedIds) {
      if (pid === targetPeerId) continue; // 不回显目标自身
      const info = g.infos.get(pid);
      if (!info) continue;
      const ver = Number(info.version) || 0;
      const sent = fullSync ? -1 : session.sentVersions.get(pid) ?? -1;
      if (ver > sent) {
        items.push({ info, raw: g.rawInfos.get(pid) ?? null });
        session.sentVersions.set(pid, ver);
      }
    }

    // 2) conn bitmap（星型：全部经服务端中转）
    const N = allIds.length;
    const bitmap = new Uint8Array(Math.ceil((N * N) / 8));
    const idx = new Map(allIds.map((p, i) => [p, i]));
    const setBit = (r, c) => {
      const i = r * N + c;
      bitmap[(i / 8) | 0] |= 1 << (i % 8);
    };
    const serverIdx = idx.get(this.config.serverPeerId);
    for (let i = 0; i < N; i++) {
      setBit(i, i);
      if (i !== serverIdx) {
        setBit(serverIdx, i);
        setBit(i, serverIdx);
      }
    }
    const peerIdVersions = allIds.map((pid) => ({
      peerId: pid,
      version: g.connVersions.get(pid) || 1,
    }));
    const bitmapSig = peerIdVersions.map((p) => `${p.peerId}:${p.version}`).join(',') + '|' + bytesToHex(bitmap);
    let connBitmap = null;
    if (fullSync || bitmapSig !== session.lastBitmapSig) {
      session.lastBitmapSig = bitmapSig;
      connBitmap = { peerIds: peerIdVersions, bitmap };
    }

    // 3) foreign network infos（对端可见的其他成员，签名去重）
    const foreignPeerIds = sortedIds.filter(
      (p) => p !== targetPeerId && g.peers.has(p)
    );
    const foreignSig = foreignPeerIds.join(',');
    let foreignNetworkInfos = null;
    if (fullSync || foreignSig !== session.lastForeignSig) {
      session.lastForeignSig = foreignSig;
      session.foreignVer += 1;
      foreignNetworkInfos = {
        infos: [
          {
            key: {
              peerId: this.config.serverPeerId,
              networkName: this.config.serverNetworkName,
            },
            value: {
              foreignPeerIds,
              lastUpdate: nowTs(),
              version: session.foreignVer,
              networkSecretDigest: new Uint8Array(32),
              myPeerIdForThisNetwork: this.config.serverPeerId,
            },
          },
        ],
      };
    }

    if (items.length === 0 && !connBitmap && !foreignNetworkInfos) return null;

    return {
      myPeerId: this.config.serverPeerId,
      mySessionId: session.mySessionId,
      isInitiator: !!weAreInitiator,
      items,
      connBitmap,
      foreignNetworkInfos,
    };
  }

  // ---------- PeerCenter（全局 peer 图） ----------

  getPeerCenter(groupKey) {
    this._maybeCleanPeerCenter();
    const g = this.ensureGroup(groupKey);
    g.peerCenter.lastTouch = Date.now();
    return g.peerCenter;
  }

  _maybeCleanPeerCenter() {
    const now = Date.now();
    if (now - this._lastPeerCenterClean < 60_000) return;
    this._lastPeerCenterClean = now;
    // 仅清理过期的 PeerCenter 上报条目；空分组的删除统一由
    // autoDeleteEmptyGroups 处理（含摘要注册解除，避免孤儿注册项）
    for (const g of this.groups.values()) {
      for (const [pid, e] of g.peerCenter.globalPeerMap) {
        if (now - (e.lastSeen || 0) > PEER_CENTER_TTL_MS) g.peerCenter.globalPeerMap.delete(pid);
      }
    }
  }

  reportPeers(groupKey, myPeerId, peerInfo) {
    const pc = this.getPeerCenter(groupKey);
    pc.globalPeerMap.set(String(myPeerId), {
      directPeers: (peerInfo && peerInfo.directPeers) || {},
      lastSeen: Date.now(),
    });
    pc.digest = '0'; // 失效缓存
  }

  /**
   * 构造全局 peer map 快照。
   * 官方语义（peer_center/server.rs::get_global_peer_map）：直接返回各端
   * ReportPeers 上报的直连表，服务端不做合成/推断 —— 客户端的
   * RouteCostCalculator 用 latency_ms 计算路由代价，合成数据会污染代价计算。
   */
  buildGlobalPeerMapSnapshot(groupKey) {
    const g = this.ensureGroup(groupKey);
    const pc = g.peerCenter;
    const out = {};
    for (const [key, entry] of pc.globalPeerMap) {
      out[key] = { directPeers: { ...(entry.directPeers || {}) } };
    }
    return out;
  }

  // ---------- 管理端：删除操作与状态快照 ----------

  /**
   * 删除整个分组（管理端）。清除路由/会话/PeerCenter 数据；
   * 若摘要注册表条目属于该分组且无同网络其他分组，则一并删除（解除抢占封锁）。
   * 返回被关闭的 peer 列表，由 room 层负责关闭 socket。
   */
  clearGroup(groupKey) {
    const g = this.groups.get(groupKey);
    if (!g) return { existed: false, peerIds: [], networkName: networkNameOfKey(groupKey) };
    const networkName = g.networkName || networkNameOfKey(groupKey);
    const peerIds = Array.from(g.peers.keys());
    this.groups.delete(groupKey);
    const regDigest = this.digestRegistry.get(networkName);
    if (regDigest && `${networkName}:${regDigest}` === groupKey) {
      // 同网络名下没有其他分组时才删注册表（strictDigest=false 时可能存在多摘要分组）
      let hasSibling = false;
      for (const otherKey of this.groups.keys()) {
        if (otherKey !== groupKey && networkNameOfKey(otherKey) === networkName) {
          hasSibling = true;
          break;
        }
      }
      if (!hasSibling) this.digestRegistry.delete(networkName);
    }
    return { existed: true, peerIds, networkName };
  }

  /**
   * 删除指定路由条目（管理端，支持批量）。
   * 在线节点的条目由连接生命周期管理，跳过并归入 skipped。
   * @returns {{ok:boolean, removed:number[], skipped:number[]}}
   */
  clearRouteInfos(groupKey, peerIds) {
    const g = this.groups.get(groupKey);
    if (!g) return { ok: false, error: 'not_found', removed: [], skipped: [] };
    const removed = [];
    const skipped = [];
    for (const raw of peerIds || []) {
      const pid = Number(raw);
      if (!Number.isInteger(pid) || pid <= 0) continue;
      if (!g.infos.has(pid)) continue;
      if (g.peers.has(pid)) { skipped.push(pid); continue; }
      this._removeInfoEntry(g, pid);
      removed.push(pid);
    }
    if (removed.length) this.bumpAllConnVersions(groupKey);
    return { ok: true, removed, skipped };
  }

  /**
   * 删除摘要注册项（管理端，支持批量）：解除网络名注册，
   * 并清除使用该摘要的分组（其注册已被撤销；返回 peerIds 由 room 层关闭连接）。
   */
  deleteDigests(networkNames) {
    const results = [];
    for (const rawName of networkNames || []) {
      const name = String(rawName);
      const digest = this.digestRegistry.get(name);
      if (!digest) {
        results.push({ networkName: name, existed: false });
        continue;
      }
      this.digestRegistry.delete(name);
      const cleared = this.clearGroup(`${name}:${digest}`);
      results.push({
        networkName: name,
        existed: true,
        digest,
        clearedGroup: cleared.existed,
        peerIds: cleared.peerIds,
      });
    }
    return { ok: true, results };
  }

  /**
   * 删除 PeerCenter 互联表条目（管理端，支持批量）。
   * @returns {{ok:boolean, removed:number[]}}
   */
  clearPeerCenter(groupKey, peerIds) {
    const g = this.groups.get(groupKey);
    if (!g) return { ok: false, error: 'not_found', removed: [] };
    const removed = [];
    for (const raw of peerIds || []) {
      const pid = Number(raw);
      if (!Number.isInteger(pid) || pid <= 0) continue;
      if (g.peerCenter.globalPeerMap.delete(String(pid))) removed.push(pid);
    }
    g.peerCenter.digest = '0'; // 失效缓存
    return { ok: true, removed };
  }

  // ---------- 管理端：分页状态快照 ----------

  /**
   * 分页状态快照（管理端按 tab 拉取，防止数据量大时响应爆炸）。
   * @param {object} opts {tab, offset, limit, groupKey, getLastSeen}
   *   - tab: overview|groups|peers|routes|peercenter|digests
   *   - getLastSeen(ws): 可选，room 层提供的 lastSeen 解析（含 attachment 兜底）
   */
  snapshotState(opts = {}) {
    const tab = String(opts.tab || 'overview');
    const offset = Number.isInteger(opts.offset) && opts.offset > 0 ? opts.offset : 0;
    const limit = Number.isInteger(opts.limit) && opts.limit > 0 ? Math.min(200, opts.limit) : 50;
    const groupFilter = opts.groupKey ? String(opts.groupKey) : '';
    const now = Date.now();
    const getLastSeen = opts.getLastSeen || ((ws) => ws?._lastSeen ?? ws?._connectedAt ?? null);

    const page = (items) => ({
      total: items.length,
      offset,
      limit,
      items: items.slice(offset, offset + limit),
    });

    if (tab === 'groups') {
      const items = [];
      for (const [gk, g] of this.groups) {
        items.push({
          key: gk,
          networkName: g.networkName || networkNameOfKey(gk),
          peerCount: g.peers.size,
          routeCount: g.infos.size,
          peerCenterCount: g.peerCenter.globalPeerMap.size,
          emptyForMs: g.peers.size === 0 ? now - (g.emptySince ?? now) : null,
        });
      }
      items.sort((a, b) => a.networkName.localeCompare(b.networkName) || a.key.localeCompare(b.key));
      return {
        tab,
        ...page(items),
        stats: {
          total: items.length,
          empty: items.filter((i) => i.peerCount === 0).length,
          peersTotal: this.totalPeers(),
        },
      };
    }

    if (tab === 'peers') {
      const items = [];
      for (const [gk, g] of this.groups) {
        if (groupFilter && gk !== groupFilter) continue;
        const networkName = g.networkName || networkNameOfKey(gk);
        for (const [pid, ws] of g.peers) {
          items.push({
            groupKey: gk,
            networkName,
            peerId: pid,
            connectedAt: ws?._connectedAt ?? null,
            lastSeen: ws ? getLastSeen(ws) : null,
          });
        }
      }
      items.sort((a, b) => a.groupKey.localeCompare(b.groupKey) || a.peerId - b.peerId);
      return {
        tab,
        ...page(items),
        stats: { total: items.length, groups: this.groups.size },
      };
    }

    if (tab === 'routes') {
      const items = [];
      let direct = 0;
      let transit = 0;
      let offline = 0;
      let ghost = 0;
      for (const [gk, g] of this.groups) {
        if (groupFilter && gk !== groupFilter) continue;
        const networkName = g.networkName || networkNameOfKey(gk);
        for (const [pid, info] of g.infos) {
          const source = g.infoSource.get(pid) || 'direct';
          const connected = g.peers.has(pid);
          const ageMs = now - (g.infoUpdatedAt.get(pid) ?? now);
          const reachable = connected || this._peerCenterReachable(g, pid, now);
          const isGhost = !connected && !reachable
            && ageMs > (this.config.routeInfoUnreachableMs ?? 90_000);
          if (source === 'direct') direct += 1; else transit += 1;
          if (!connected) offline += 1;
          if (isGhost) ghost += 1;
          items.push({
            groupKey: gk,
            networkName,
            peerId: pid,
            hostname: info.hostname || '',
            version: Number(info.version) || 0,
            source,
            connected,
            reachable,
            ageMs,
            ghost: isGhost,
            easytierVersion: info.easytierVersion || '',
          });
        }
      }
      items.sort((a, b) => a.groupKey.localeCompare(b.groupKey) || a.peerId - b.peerId);
      return {
        tab,
        ...page(items),
        stats: { total: items.length, direct, transit, offline, ghost },
      };
    }

    if (tab === 'peercenter') {
      const items = [];
      for (const [gk, g] of this.groups) {
        if (groupFilter && gk !== groupFilter) continue;
        const networkName = g.networkName || networkNameOfKey(gk);
        for (const [pidStr, e] of g.peerCenter.globalPeerMap) {
          const directPeers = e.directPeers || {};
          items.push({
            groupKey: gk,
            networkName,
            myPeerId: Number(pidStr),
            directPeerIds: Object.keys(directPeers).map(Number),
            lastSeen: e.lastSeen || null,
          });
        }
      }
      items.sort((a, b) => a.groupKey.localeCompare(b.groupKey) || a.myPeerId - b.myPeerId);
      return {
        tab,
        ...page(items),
        stats: { total: items.length },
      };
    }

    if (tab === 'digests') {
      const items = [];
      for (const [name, digest] of this.digestRegistry) {
        items.push({
          networkName: name,
          digest,
          groupExists: this.groups.has(`${name}:${digest}`),
        });
      }
      items.sort((a, b) => a.networkName.localeCompare(b.networkName));
      return {
        tab,
        ...page(items),
        stats: { total: items.length },
      };
    }

    // overview（默认）：仅统计 + 计数器，不含明细列表
    let routesTotal = 0;
    let routesDirect = 0;
    let routesTransit = 0;
    let routesGhost = 0;
    let peerCenterTotal = 0;
    let emptyGroups = 0;
    for (const g of this.groups.values()) {
      if (g.peers.size === 0) emptyGroups += 1;
      peerCenterTotal += g.peerCenter.globalPeerMap.size;
      for (const pid of g.infos.keys()) {
        routesTotal += 1;
        if (g.infoSource.get(pid) === 'direct') routesDirect += 1; else routesTransit += 1;
        if (!g.peers.has(pid)
          && !this._peerCenterReachable(g, pid, now)
          && now - (g.infoUpdatedAt.get(pid) ?? now) > (this.config.routeInfoUnreachableMs ?? 90_000)) {
          routesGhost += 1;
        }
      }
    }
    return {
      tab: 'overview',
      stats: {
        groups: { total: this.groups.size, empty: emptyGroups },
        peers: { total: this.totalPeers() },
        routes: { total: routesTotal, direct: routesDirect, transit: routesTransit, ghost: routesGhost },
        peerCenter: { total: peerCenterTotal },
        digests: { total: this.digestRegistry.size },
      },
    };
  }

  // ---------- 持久化 ----------

  toPersisted() {
    const id = this.ensureServerIdentity();
    const groups = {};
    for (const [gk, g] of this.groups) {
      if (g.infos.size === 0) continue;
      const infos = {};
      for (const [pid, info] of g.infos) {
        const raw = g.rawInfos.get(pid);
        const entry = raw ? { info, raw: Array.from(raw) } : { info };
        const source = g.infoSource.get(pid);
        if (source) entry.source = source;
        const updated = g.infoUpdatedAt.get(pid);
        if (updated != null) entry.updated = updated;
        const reporters = g.infoReporters.get(pid);
        if (reporters && reporters.size) entry.reporters = Array.from(reporters);
        infos[String(pid)] = entry;
      }
      groups[gk] = {
        infos,
        networkName: g.networkName || networkNameOfKey(gk),
        emptySince: g.peers.size === 0 ? (g.emptySince ?? Date.now()) : null,
      };
    }
    const digests = {};
    for (const [name, hex] of this.digestRegistry) digests[name] = hex;
    return {
      v: 4,
      server: {
        instId: id.instId,
        peerRouteId: longToString(id.peerRouteId),
        startedAt: id.startedAt,
      },
      digests,
      groups,
    };
  }

  loadPersisted(saved) {
    if (!saved) return;
    const version = saved.v || 1;
    try {
      this.serverIdentity = {
        instId: saved.server?.instId || {
          part1: 0, part2: 0, part3: 0, part4: 0,
        },
        peerRouteId: Long.fromString(String(saved.server?.peerRouteId || '0'), true),
        startedAt: Number(saved.server?.startedAt) || Date.now(),
      };
      for (const [name, hex] of Object.entries(saved.digests || {})) {
        this.digestRegistry.set(name, String(hex));
      }
      for (const [gk, g] of Object.entries(saved.groups || {})) {
        const group = this.ensureGroup(gk, g.networkName);
        for (const [pidStr, entry] of Object.entries(g.infos || {})) {
          const pid = Number(pidStr);
          if (!Number.isInteger(pid)) continue;
          // v1 格式：直接是 info；v2+ 格式：{info, raw, source?}
          const info = version >= 2 ? entry?.info : entry;
          const raw = version >= 2 && Array.isArray(entry?.raw)
            ? Uint8Array.from(entry.raw)
            : null;
          const source = version >= 3 && entry?.source === 'transit' ? 'transit' : 'direct';
          if (!info) continue;
          group.infos.set(pid, reviveInfo(info));
          group.infoSource.set(pid, source);
          if (raw) group.rawInfos.set(pid, raw);
          // v4：恢复老化时间戳与上报者（无则视为刚加载，宽限一个周期）
          if (version >= 4 && Number.isFinite(entry?.updated)) {
            group.infoUpdatedAt.set(pid, Number(entry.updated));
          } else {
            group.infoUpdatedAt.set(pid, Date.now());
          }
          if (source === 'transit' && version >= 4 && Array.isArray(entry?.reporters)) {
            group.infoReporters.set(pid, new Set(entry.reporters.map(Number)));
          } else if (source === 'transit') {
            group.infoReporters.set(pid, new Set());
          }
        }
        // v4：恢复空分组计时（该分组若当前无在线节点）
        if (group.peers.size === 0) {
          group.emptySince = version >= 4 && Number.isFinite(g?.emptySince)
            ? Number(g.emptySince)
            : Date.now();
        }
      }
    } catch (e) {
      // 持久化数据损坏时静默丢弃，等待客户端重新同步
      this.serverIdentity = null;
      this.digestRegistry.clear();
      this.groups.clear();
    }
  }
}

/** 从 groupKey 还原网络名：key = "<网络名>:<hex 摘要>"，hex 不含冒号 */
function networkNameOfKey(groupKey) {
  const idx = groupKey.lastIndexOf(':');
  return idx > 0 ? groupKey.slice(0, idx) : groupKey;
}

/** JSON 反序列化后恢复 Long 字段 */
function reviveInfo(info) {
  const out = { ...info };
  if (out.peerRouteId != null && !Long.isLong(out.peerRouteId)) {
    out.peerRouteId = Long.fromValue(out.peerRouteId, true);
  }
  if (out.lastUpdate && out.lastUpdate.seconds != null && !Long.isLong(out.lastUpdate.seconds)) {
    out.lastUpdate = {
      ...out.lastUpdate,
      seconds: Long.fromValue(out.lastUpdate.seconds, true),
    };
  }
  return out;
}
