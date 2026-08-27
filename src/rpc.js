/**
 * EasyTier Peer RPC 层：RpcPacket 编解码 + OspfRouteRpc / PeerCenterRpc 处理。
 *
 * 分帧结构（对齐官方 rpc_types）：
 *   ZCPacket(payload = RpcPacket{ body = RpcRequest{ request = SyncRouteInfoRequest } })
 *   响应：RpcPacket{ is_request=false, body = RpcResponse{ response = <inner> } }
 *
 * 兼容性策略：
 * - transaction_id (int64) 全程以 Long 透传，杜绝精度丢失（旧实现的常见 bug）；
 * - 本端不启用压缩（algo=None），因此客户端发往本端的请求也始终未压缩；
 *   若收到 Zstd(algo=2) 请求（不可能发生于当前协商路径），记录并忽略。
 * - method_index 官方语义为服务内方法序号（1-based，easytier-proto/build/rpc.rs
 *   生成 Method::new((i + 1) as u8)）：OspfRouteRpc.SyncRouteInfo=1，
 *   PeerCenterRpc.ReportPeers=1 / GetGlobalPeerMap=2。
 * - SyncRouteInfoRequest 出站走 wire 层重组（wire.js），逐字节保留对端上报的
 *   RoutePeerInfo 原始内容（对齐官方 route_peer_wire.rs raw_peer_infos 机制）。
 */
import { PacketType, CompressionAlgo, RpcProtoName } from './constants.js';
import {
  protoTypes, toU64Long, randomU64Long, longToString,
} from './proto.js';
import { buildPacket } from './packet.js';
import {
  extractRawPeerInfos, buildSyncRouteInfoRequestBytes,
} from './wire.js';

export { protoTypes };

/** 规范化服务名：剥离包前缀 */
function serviceNameOf(descriptor) {
  const raw = String((descriptor && descriptor.serviceName) || '');
  const idx = raw.lastIndexOf('.');
  return idx >= 0 ? raw.slice(idx + 1) : raw;
}

// ---------------------------------------------------------------------------
// 出站构造
// ---------------------------------------------------------------------------

/**
 * 构造 RpcPacket 字节。
 */
export function buildRpcPacket({ fromPeer, toPeer, transactionId, descriptor, body, isRequest }) {
  const types = protoTypes();
  const packet = {
    fromPeer: fromPeer,
    toPeer: toPeer,
    transactionId: toU64Long(transactionId),
    descriptor: {
      domainName: descriptor.domainName || '',
      protoName: descriptor.protoName || RpcProtoName,
      serviceName: descriptor.serviceName,
      // 官方 method_index 为 1-based（build/rpc.rs: (i + 1) as u8）
      methodIndex: descriptor.methodIndex ?? 1,
    },
    body: body,
    isRequest: !!isRequest,
    totalPieces: 1,
    pieceIdx: 0,
    traceId: 0,
    compressionInfo: { algo: CompressionAlgo.None, acceptedAlgo: CompressionAlgo.None },
  };
  return types.RpcPacket.encode(packet).finish();
}

/**
 * 构造一个 RPC 请求（RpcPacket 包 RpcRequest 包 inner 消息）。
 * innerMessage: {type, message} 走对象编码；innerBytes 直接使用原始字节。
 */
export function buildRpcRequest({ fromPeer, toPeer, descriptor, innerMessage, innerBytes, domainName }) {
  const types = protoTypes();
  let requestPayload = innerBytes;
  if (!requestPayload) {
    requestPayload = innerMessage
      ? types[innerMessage.type].encode(innerMessage.message).finish()
      : new Uint8Array(0);
  }
  const reqBytes = types.RpcRequest.encode({
    request: requestPayload,
    timeoutMs: 5000,
  }).finish();
  return buildRpcPacket({
    fromPeer,
    toPeer,
    transactionId: randomU64Long(),
    descriptor: { ...descriptor, domainName: domainName || descriptor.domainName || '' },
    body: reqBytes,
    isRequest: true,
  });
}

/**
 * 构造对某个 RpcPacket 的响应。
 */
export function buildRpcResponse({ fromPeer, toPeer, reqPacket, innerMessage }) {
  const types = protoTypes();
  const innerBytes = innerMessage
    ? types[innerMessage.type].encode(innerMessage.message).finish()
    : new Uint8Array(0);
  const respBytes = types.RpcResponse.encode({ response: innerBytes, runtimeUs: 0 }).finish();
  return buildRpcPacket({
    fromPeer,
    toPeer,
    transactionId: reqPacket.transactionId, // Long 原样回传
    descriptor: reqPacket.descriptor,
    body: respBytes,
    isRequest: false,
  });
}

// ---------------------------------------------------------------------------
// 出站：路由推送（wire 层重组）
// ---------------------------------------------------------------------------

/**
 * 将 PeerManager.buildRoutePush 的中间结构编码为 SyncRouteInfoRequest 字节。
 * 有 raw 字节的条目逐字节搬运；否则用对象编码。
 */
export function encodeRoutePush(push) {
  const types = protoTypes();
  const items = [];
  for (const it of push.items) {
    if (it.raw && it.raw.length > 0) {
      items.push(it.raw);
    } else {
      items.push(types.RoutePeerInfo.encode(it.info).finish());
    }
  }
  const connBitmapBytes = push.connBitmap
    ? types.RouteConnBitmap.encode(push.connBitmap).finish()
    : null;
  const foreignBytes = push.foreignNetworkInfos
    ? types.RouteForeignNetworkInfos.encode(push.foreignNetworkInfos).finish()
    : null;
  return buildSyncRouteInfoRequestBytes({
    myPeerId: push.myPeerId,
    mySessionId: push.mySessionId,
    isInitiator: push.isInitiator,
    peerInfoItems: items,
    connBitmapBytes,
    foreignNetworkInfosBytes: foreignBytes,
  });
}

// ---------------------------------------------------------------------------
// 入站处理
// ---------------------------------------------------------------------------

/**
 * 处理发往本端的 RpcReq。
 * @param {object} ctx { pm, config, log, send(ws, bytes), pushRoute(ws, forceFull), broadcast(groupKey, excludePeerId) }
 * @returns {boolean} 是否被识别处理
 */
export async function handleRpcRequest(ctx, ws, header, payload) {
  const types = protoTypes();
  let rpcPacket;
  try {
    rpcPacket = types.RpcPacket.decode(payload);
  } catch (e) {
    ctx.log.warn(`rpc decode failed from=${header.fromPeerId}: ${e.message}`);
    return false;
  }

  if (rpcPacket.compressionInfo && Number(rpcPacket.compressionInfo.algo) > CompressionAlgo.None) {
    ctx.log.warn(
      `compressed rpc from=${header.fromPeerId} algo=${rpcPacket.compressionInfo.algo} unsupported, drop`
    );
    return false;
  }

  // 解 RpcRequest 包装
  let innerBody = rpcPacket.body;
  try {
    const wrapper = types.RpcRequest.decode(rpcPacket.body);
    if (wrapper.request && wrapper.request.length > 0) innerBody = wrapper.request;
  } catch {
    // 兼容未包装的 body（防御式）
  }

  const service = serviceNameOf(rpcPacket.descriptor);
  const protoName = String((rpcPacket.descriptor && rpcPacket.descriptor.protoName) || '');
  const methodIndex = Number((rpcPacket.descriptor && rpcPacket.descriptor.methodIndex) || 0);
  ctx.log.debug(
    `rpc req from=${header.fromPeerId} service=${service} proto=${protoName} ` +
    `methodIndex=${methodIndex} bodyLen=${innerBody.length}`
  );

  // 官方语义（service_registry.rs::ServiceKey）：proto_name 是 prost 服务短名，
  // 与 service_name 相同（如 "OspfRouteRpc"）。历史上本实现用 "peer_rpc"，
  // 为兼容旧测试数据，两者都接受。
  if (protoName && protoName !== service && protoName !== RpcProtoName
      && protoName !== `peer_rpc.${service}`) {
    ctx.log.debug(`drop rpc with unknown proto_name=${protoName}`);
    return false;
  }

  if (service === 'OspfRouteRpc') {
    if (methodIndex !== 1) {
      ctx.log.debug(`OspfRouteRpc unknown methodIndex=${methodIndex}`);
      return false;
    }
    await handleSyncRouteInfo(ctx, ws, header, rpcPacket, innerBody);
    return true;
  }

  if (service === 'PeerCenterRpc') {
    if (methodIndex === 1) {
      await handleReportPeers(ctx, ws, header, rpcPacket, innerBody);
      return true;
    }
    if (methodIndex === 2) {
      await handleGetGlobalPeerMap(ctx, ws, header, rpcPacket, innerBody);
      return true;
    }
    return false;
  }

  return false;
}

/**
 * 处理 OspfRouteRpc.SyncRouteInfo。
 */
async function handleSyncRouteInfo(ctx, ws, header, rpcPacket, innerBody) {
  const types = protoTypes();
  const groupKey = ws._groupKey;
  const fromPeerId = header.fromPeerId;

  let req;
  try {
    req = types.SyncRouteInfoRequest.decode(innerBody);
  } catch (e) {
    ctx.log.warn(`SyncRouteInfo decode failed from=${fromPeerId}: ${e.message}`);
    return;
  }

  const pm = ctx.pm;
  const session = pm.getSession(groupKey, fromPeerId, true);

  // 会话角色（官方：响应方 is_initiator = !请求方 is_initiator）
  if (typeof req.isInitiator === 'boolean') {
    ws._weAreInitiator = !req.isInitiator;
  }
  session.dstSessionId = longToString(req.mySessionId);

  // 提取原始 RoutePeerInfo 字节（未知字段保留），与解码后的 items 一一对应
  const rawItems = extractRawPeerInfos(innerBody);

  // 合并对端上报的 peer 信息。
  // F-07 加固：条目 peerId === 上报者本人 -> direct（可信自报）；
  // 其余为 transit（他报），PeerManager 会拒绝其覆盖 direct 条目（防路由投毒）。
  let hasNew = false;
  const items = (req.peerInfos && req.peerInfos.items) || [];
  for (let i = 0; i < items.length; i++) {
    const info = items[i];
    if (typeof info.peerId === 'number') {
      const source = info.peerId === fromPeerId ? 'direct' : 'transit';
      // 幽灵防线：reporterPid 让 PeerManager 追踪 transit 条目来源，
      // 上报者断开后其上报的无主条目立即清除
      const r = pm.updatePeerInfo(groupKey, info, rawItems ? rawItems[i] : null, source, fromPeerId);
      if (r.isNew) hasNew = true;
      if (r.rejected) {
        ctx.log.warn(
          `drop transit route info for peer=${info.peerId} (owned by connected peer), from=${fromPeerId}`
        );
      }
    }
  }

  // 响应 SyncRouteInfoResponse
  const resp = buildRpcResponse({
    fromPeer: ctx.config.serverPeerId,
    toPeer: fromPeerId,
    reqPacket: rpcPacket,
    innerMessage: {
      type: 'SyncRouteInfoResponse',
      message: {
        isInitiator: !req.isInitiator,
        sessionId: toU64Long(ws._serverSessionId),
      },
    },
  });
  ctx.send(ws, buildZC(ctx, fromPeerId, PacketType.RpcResp, resp));

  // 回推本端路由（客户端会话变化时自动全量）
  ctx.pushRoute(ws, false);

  // 拓扑有新增成员时广播其余成员
  if (hasNew) {
    ctx.broadcast(groupKey, fromPeerId);
  }
}

/**
 * 处理 PeerCenterRpc.ReportPeers (method 0)。
 */
async function handleReportPeers(ctx, ws, header, rpcPacket, innerBody) {
  const types = protoTypes();
  let req;
  try {
    req = types.ReportPeersRequest.decode(innerBody);
  } catch (e) {
    ctx.log.warn(`ReportPeers decode failed: ${e.message}`);
    return;
  }
  // 官方语义（peer_center/server.rs::report_peers）：整体替换该上报方的条目。
  // F-08 加固：上报者身份以连接注册的 header.fromPeerId 为准（连接级鉴权），
  // 内层 my_peer_id 不一致时覆盖（防冒名上报他人直连表）。
  const reporter = header.fromPeerId;
  if (Number(req.myPeerId) !== reporter) {
    ctx.log.warn(
      `ReportPeers my_peer_id=${req.myPeerId} != conn peer=${reporter}, overriding`
    );
  }
  const directPeers = {};
  const src = (req.peerInfos && req.peerInfos.directPeers) || {};
  for (const [pid, info] of Object.entries(src)) {
    directPeers[String(pid)] = {
      ...(info && typeof info.latencyMs === 'number' ? { latencyMs: info.latencyMs } : {}),
    };
  }
  ctx.pm.reportPeers(ws._groupKey, reporter, { directPeers });
  const resp = buildRpcResponse({
    fromPeer: ctx.config.serverPeerId,
    toPeer: header.fromPeerId,
    reqPacket: rpcPacket,
    innerMessage: { type: 'ReportPeersResponse', message: {} },
  });
  ctx.send(ws, buildZC(ctx, header.fromPeerId, PacketType.RpcResp, resp));
}

/**
 * 处理 PeerCenterRpc.GetGlobalPeerMap (method 1)。带摘要缓存。
 */
async function handleGetGlobalPeerMap(ctx, ws, header, rpcPacket, innerBody) {
  const types = protoTypes();
  let req;
  try {
    req = types.GetGlobalPeerMapRequest.decode(innerBody);
  } catch (e) {
    ctx.log.warn(`GetGlobalPeerMap decode failed: ${e.message}`);
    return;
  }
  const groupKey = ws._groupKey;
  const pc = ctx.pm.getPeerCenter(groupKey);
  const snapshot = ctx.pm.buildGlobalPeerMapSnapshot(groupKey);
  const digest = await computePeerCenterDigest(snapshot);

  // 摘要相同：回空响应（客户端保留本地缓存）
  if (pc.digest === digest && longToString(req.digest) !== '0') {
    const resp = buildRpcResponse({
      fromPeer: ctx.config.serverPeerId,
      toPeer: header.fromPeerId,
      reqPacket: rpcPacket,
      innerMessage: { type: 'GetGlobalPeerMapResponse', message: {} },
    });
    ctx.send(ws, buildZC(ctx, header.fromPeerId, PacketType.RpcResp, resp));
    return;
  }

  pc.digest = digest;
  const resp = buildRpcResponse({
    fromPeer: ctx.config.serverPeerId,
    toPeer: header.fromPeerId,
    reqPacket: rpcPacket,
    innerMessage: {
      type: 'GetGlobalPeerMapResponse',
      message: { globalPeerMap: snapshot, digest: toU64Long(digest) },
    },
  });
  ctx.send(ws, buildZC(ctx, header.fromPeerId, PacketType.RpcResp, resp));
}

/**
 * 处理发往本端的 RpcResp：只关心 SyncRouteInfoResponse 的会话确认。
 */
export function handleRpcResponse(ctx, ws, header, payload) {
  const types = protoTypes();
  let rpcPacket;
  try {
    rpcPacket = types.RpcPacket.decode(payload);
  } catch {
    return;
  }
  const service = serviceNameOf(rpcPacket.descriptor);
  if (service !== 'OspfRouteRpc') return;

  let body = rpcPacket.body;
  try {
    const wrapper = types.RpcResponse.decode(body);
    if (wrapper.response && wrapper.response.length > 0) body = wrapper.response;
  } catch {
    return;
  }
  try {
    const resp = types.SyncRouteInfoResponse.decode(body);
    if (resp && resp.sessionId != null) {
      ctx.pm.onRouteSessionAck(ws._groupKey, header.fromPeerId, resp.sessionId);
    }
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// 工具
// ---------------------------------------------------------------------------

/** 组装 ZCPacket（header + payload） */
function buildZC(ctx, toPeerId, packetType, payload) {
  return buildPacket(ctx.config.serverPeerId, toPeerId, packetType, payload);
}

/**
 * 官方摘要算法：sha256(排序键 + 延迟) 前 8 字节 -> u64 字符串。
 */
async function computePeerCenterDigest(snapshot) {
  const keys = Object.keys(snapshot).sort();
  const parts = [];
  for (const k of keys) {
    parts.push(k);
    const dp = snapshot[k].directPeers || {};
    for (const dk of Object.keys(dp).sort()) {
      parts.push(dk);
      parts.push(String(dp[dk].latencyMs ?? 0));
    }
  }
  const data = new TextEncoder().encode(parts.join('|'));
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', data));
  let x = 0n;
  for (let i = 0; i < 8; i++) x = (x << 8n) | BigInt(hash[i]);
  return (x & 0xffffffffffffffffn).toString();
}
