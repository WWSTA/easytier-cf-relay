/**
 * Protobuf 消息类型入口（静态代码生成版）。
 *
 * 背景：Cloudflare Workers 禁止动态 eval / new Function，而 protobufjs 的
 * 反射模式（Root.fromJSON + Type.encode/decode）会在运行期通过 codegen
 * 动态生成编解码函数，在 Workers 上被拒绝。因此本工程改用 pbjs 静态生成的
 * proto_gen.js（仅 encode/decode，无 verify/convert/service），零运行时代码生成。
 *
 * proto_gen.js 由 tools/regen_proto.sh 从官方 easytier-proto 重新生成；
 * 字段号与 wire 类型严格对齐官方 proto 文件，字段名保持 protobufjs 默认的
 * camelCase 转换（线上格式只由字段号 + wire 类型决定，与名字无关）。
 *
 * 注意：必须在任何 encode/decode 之前配置 $protobuf.util.Long（64 位字段
 * 需要 Long 表示，否则回退 number 丢精度）。模块导入顺序无要求——生成代码
 * 在模块加载期只做类定义，Long 只在实际编解码时被读取。
 */
import Long from 'long';
import $protobuf from 'protobufjs/minimal.js';
import * as gen from './proto_gen.js';

// 64 位字段精度：配置 Long（幂等，重复设置无副作用）
if (!$protobuf.util.Long || !$protobuf.util.Long.isLong) {
  $protobuf.util.Long = Long;
}
$protobuf.configure();

/**
 * 消息类型表：短名 -> 静态生成类。
 * 与旧反射版 protoTypes() 返回结构保持一致（rpc.js / room.js 消费）。
 */
export function protoTypes() {
  return {
    HandshakeRequest: gen.peer_rpc.HandshakeRequest,
    RpcPacket: gen.common.RpcPacket,
    RpcRequest: gen.common.RpcRequest,
    RpcResponse: gen.common.RpcResponse,
    SyncRouteInfoRequest: gen.peer_rpc.SyncRouteInfoRequest,
    SyncRouteInfoResponse: gen.peer_rpc.SyncRouteInfoResponse,
    RoutePeerInfo: gen.peer_rpc.RoutePeerInfo,
    RouteConnBitmap: gen.peer_rpc.RouteConnBitmap,
    RoutePeerInfos: gen.peer_rpc.RoutePeerInfos,
    RouteForeignNetworkInfos: gen.peer_rpc.RouteForeignNetworkInfos,
    ReportPeersRequest: gen.peer_rpc.ReportPeersRequest,
    ReportPeersResponse: gen.peer_rpc.ReportPeersResponse,
    GetGlobalPeerMapRequest: gen.peer_rpc.GetGlobalPeerMapRequest,
    GetGlobalPeerMapResponse: gen.peer_rpc.GetGlobalPeerMapResponse,
    PeerInfoForGlobalMap: gen.peer_rpc.PeerInfoForGlobalMap,
    DirectConnectedPeerInfo: gen.peer_rpc.DirectConnectedPeerInfo,
  };
}

/** 按命名空间取静态类（peer_rpc.Xxx / common.Xxx / google.protobuf.Xxx） */
export function typeOf(qualifiedName) {
  const parts = String(qualifiedName).split('.');
  let node = gen;
  for (const p of parts) {
    node = node && node[p];
    if (!node) throw new Error(`unknown proto type: ${qualifiedName}`);
  }
  return node;
}

/** u64 值（number|string|BigInt|Long）-> unsigned Long，供 protobufjs 编码 */
export function toU64Long(value) {
  if (value == null) return Long.UZERO;
  if (Long.isLong(value)) return value.unsigned ? value : value.toUnsigned();
  if (typeof value === 'bigint') return Long.fromValue(value, true);
  if (typeof value === 'string') {
    if (/^-?\d+$/.test(value)) return Long.fromString(value, true);
    return Long.fromString(value, true);
  }
  if (typeof value === 'number') return Long.fromNumber(value >>> 0 === value ? value : 0, true);
  return Long.UZERO;
}

/** 随机 u64 Long */
export function randomU64Long() {
  const b = new Uint8Array(8);
  crypto.getRandomValues(b);
  const dv = new DataView(b.buffer);
  return Long.fromBits(dv.getUint32(0, true), dv.getUint32(4, true), true);
}

/**
 * Long -> 十进制字符串（null 安全）。
 * 统一按无符号解释输出：int64 字段（如 transaction_id）解码得到有符号 Long，
 * 但其位模式与无符号值一致，规范化后比较/展示不受符号影响。
 */
export function longToString(v) {
  if (v == null) return '0';
  if (Long.isLong(v)) return (v.unsigned ? v : v.toUnsigned()).toString();
  if (typeof v === 'bigint') return (v & 0xffffffffffffffffn).toString();
  return String(v);
}
