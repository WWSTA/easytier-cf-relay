/**
 * EasyTier 协议常量 —— 与官方 easytier-core (Rust) 对齐。
 *
 * 参考:
 * - easytier-core/src/packet/mod.rs  (PeerManagerHeader, PacketType, flags)
 * - easytier-proto/proto/peer_rpc.proto / common.proto
 */

export const MAGIC = 0xd1e1a5e1;
export const VERSION = 1;

/** PeerManagerHeader 固定长度（字节） */
export const HEADER_SIZE = 16;

/**
 * PacketType 枚举值（官方 packet/mod.rs::PacketType）。
 * 与旧实现不同：这里只保留语义上需要区分的值，其余原样转发。
 */
export const PacketType = Object.freeze({
  Invalid: 0,
  Data: 1,
  HandShake: 2,
  RoutePacket: 3, // deprecated
  Ping: 4,
  Pong: 5,
  TaRpc: 6, // deprecated
  Route: 7, // deprecated
  RpcReq: 8,
  RpcResp: 9,
  ForeignNetworkPacket: 10,
  KcpSrc: 11,
  KcpDst: 12,
  NoiseHandshakeMsg1: 13,
  NoiseHandshakeMsg2: 14,
  NoiseHandshakeMsg3: 15,
  QuicSrc: 16,
  QuicDst: 17,
  RelayHandshake: 20,
  RelayHandshakeAck: 21,
});

/**
 * PeerManagerHeaderFlags 位定义（官方 bitflags）。
 */
export const HeaderFlags = Object.freeze({
  ENCRYPTED: 0b0000_0001,
  LATENCY_FIRST: 0b0000_0010,
  EXIT_NODE: 0b0000_0100,
  NO_PROXY: 0b0000_1000,
  COMPRESSED: 0b0001_0000,
  LIVENESS_PROBE: 0b0010_0000, // deprecated
  NOT_SEND_TO_TUN: 0b0100_0000,
  LIVENESS_ECHO: 0b1000_0000,
});

/** 官方 peer_manager.rs：forward_counter > 7 丢弃 */
export const MAX_FORWARD_COUNTER = 7;

/** 官方握手 features：客户端会发送 liveness-echo-v1，服务端镜像宣告以获得最佳兼容性 */
export const LIVENESS_ECHO_FEATURE = 'liveness-echo-v1';

/** 握手响应宣告的 features */
export const SERVER_FEATURES = [LIVENESS_ECHO_FEATURE];

/** RpcCompressionInfo.algo：官方枚举 Invalid=0 / None=1 / Zstd=2 */
export const CompressionAlgo = Object.freeze({ Invalid: 0, None: 1, Zstd: 2 });

/** RPC descriptor 常量 */
export const RpcProtoName = 'peer_rpc';

/** PeerCenterRpc 状态 TTL（毫秒）：ReportPeers 数据过期清理 */
export const PEER_CENTER_TTL_MS = 180_000;

/** 会话（路由同步 session）空闲过期（毫秒） */
export const SESSION_TTL_MS = 3 * 60_000;

/**
 * 路由条目老化（对齐官方 peer_ospf_route.rs::clear_expired_peer 语义）：
 * - 不可达层：条目对应节点未连接、且 PeerCenter 无新鲜可达记录时，
 *   超过该时长即删除（官方 REMOVE_UNREACHABLE_PEER_INFO_AFTER = 90s）；
 * - 死亡层：无论可达性，超过该时长一律删除
 *   （官方 REMOVE_DEAD_PEER_INFO_AFTER = 3660s = 3600s 强制重广播 + 60s 余量）。
 * 官方保证活跃节点每 ≤3600s 强制 version+1 重广播，因此活跃 transit 条目
 * 的 last_update 始终新鲜；死亡节点（幽灵）停止刷新后被老化清除。
 */
export const ROUTE_INFO_UNREACHABLE_MS = 90_000;
export const ROUTE_INFO_TTL_MS = 3_660_000;

/** 空分组自动删除宽限（毫秒）：分组内在线节点归零后持续该时长仍为空则整组删除 */
export const GROUP_AUTO_DELETE_MS = 60_000;
