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
/**
 * PeerCenter 条目上限（v1.7 复核修复）：B10 放开非直连 from 后，单个连接可在
 * 50 msg/s 下以任意身份持续新建 ReportPeers 条目（每条 TTL 180s，无条数上限）
 * ——按 lastSeen 最旧淘汰兜底内存放大面。
 */
export const PEER_CENTER_MAX_ENTRIES = 4096;

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

// ---------------------------------------------------------------------------
// 资源滥用防线（v1.6.0）：
// 全部为处理途中的同步检查——零新增请求路径 / KV 键 / 定时器，免费额度零开销。
// 上限经 env 可配（0 = 关闭该防线），默认值对合法客户端留数倍余量：
// 默认房间 64 peer / 分组 32 peer（部署手册 §5.3）。
//
// 上限自洽不变量（看护用例锁定，运维改大配置时 room 启动日志 warn 提醒）：
//   MAX_ROUTES_PER_GROUP × MAX_ROUTE_INFO_BYTES = 128 × 768 = 96 KiB
//   < MAX_MESSAGE_BYTES(128 KiB) —— 合法全量路由推送永不触发出站硬闸。
// ---------------------------------------------------------------------------

/** 单帧 SyncRouteInfo 路由条目数上限：超出整帧拒绝（close 4009，与入站超大消息同类）。默认 256 = 默认房间 64 peer 的 4× 余量 */
export const MAX_SYNC_ITEMS = 256;
/** 单条 RoutePeerInfo 原始字节上限：超出丢弃该条（防巨型条目状态膨胀；官方典型条目 ~100-300B） */
export const MAX_ROUTE_INFO_BYTES = 768;
/** 每分组路由条目总数上限：transit/幽灵条目的总量闸门，兼作出站全量推送的体积上界 */
export const MAX_ROUTES_PER_GROUP = 128;
/** ReportPeers 单上报者 directPeers 条目上限：控制 GetGlobalPeerMap 响应体积 */
export const MAX_DIRECT_PEERS_REPORT = 64;
/** 全量重推最小间隔（毫秒）：会话重置与 GetGlobalPeerMap 全量响应共用的每连接冷却 */
export const FULL_RESYNC_COOLDOWN_MS = 1000;
/** 握手网络名长度上限：超长网络名会直接进 groupKey/持久化 */
export const MAX_NETWORK_NAME_BYTES = 128;

// ---------------------------------------------------------------------------
// WebSocket close code（4000-4030，本实现自定义区间）。
// 历史原因存在双语义码：用双键同值显式表达（同一数值，语义随调用点不同——
// 4008 既用于速率限流也用被踢出，4009 既用于入站超大消息也用于路由洪泛整帧拒绝）。
// ---------------------------------------------------------------------------
export const WS_CLOSE = Object.freeze({
  REPLACED: 4000,        // 新连接顶替旧连接（同 peerId 重连）
  TIMEOUT: 4001,         // 握手超时 / 空闲超时
  MALFORMED: 4002,       // 帧格式或握手字段非法（bad handshake/magic/version/peer id/network name）
  UNSUPPORTED: 4003,     // 安全模式不支持 / 网络摘要不匹配
  RATE_LIMITED: 4008,    // 单连接消息速率超限（MSG_RATE_LIMIT_PER_SEC）
  KICKED: 4008,          // 与 RATE_LIMITED 同码：被管理员踢出
  OVERSIZED: 4009,       // 单帧超过消息大小上限（MAX_MESSAGE_BYTES）
  ROUTE_FLOOD: 4009,     // 与 OVERSIZED 同码：单帧路由条目数超限整帧拒绝（MAX_SYNC_ITEMS）
  GROUP_DELETED: 4010,   // 管理员删除分组
  DIGEST_DELETED: 4011,  // 管理员删除摘要注册
  ADMIN_CLOSED: 4012,    // 管理员关闭连接
  BLACKLISTED: 4013,     // 黑名单拒绝
  ROOM_FULL: 4029,       // 房间满（MAX_PEERS_PER_ROOM）
  GROUP_FULL: 4030,      // 分组满（MAX_PEERS_PER_GROUP）
});

// ---------------------------------------------------------------------------
// 额度韧性（v1.7 A4/C5）：
// 与资源滥用防线同一设计哲学——处理途中的同步检查，正常用户免费额度零开销。
// ---------------------------------------------------------------------------

/**
 * KV 写日预算（v1.7 A4）：UTC 日内 KV 镜像写「尝试」上限。
 * 900 = 免费额度 1000 写/天留 10% 余量——KV 节流只有时间维度（每键 144 写/天上限），
 * 11 条键（7 记录 + 4 黑名单）全部持续脏时数学最坏 1,584 写/天，本预算把上限
 * 结构性压进免费额度内。达到预算按 KV_SKIP_ORDER 牺牲序跳键，bl:* 永不跳。
 */
export const KV_WRITE_DAILY_BUDGET = 900;
/** 预算耗尽时的牺牲序（先跳）：routes → peercenter → digests → 其余 rec:*；bl:* 永不跳 */
export const KV_SKIP_ORDER = ['rec:routes', 'rec:peercenter', 'rec:digests'];
/**
 * 边缘黑名单 KV 读失败负缓存 TTL（v1.7 C5）：读失败后短窗内不再重试——
 * 重连风暴期每个新 isolate 生成首次升级读，无退避会逐请求重试；
 * 窗口内放行走 DO 权威兜底（「只延后拦截、绝不漏放」语义不变）。
 */
export const BL_NEG_CACHE_TTL_MS = 8_000;

// ---------------------------------------------------------------------------
// RPC 分片重组（v1.7 B9，官方 PacketMerger 语义对齐 rpc/packet.rs）：
// 官方客户端对编码后 >1260 字节的 RPC 自动切片，本端此前无重组逻辑导致
// 大路由表网络的 SyncRouteInfo 逐片解码全部失败（生产 2026-11-21 实锤）。
// ---------------------------------------------------------------------------

/** 重组事务 TTL：官方 server 同款 10s 未更新淘汰（packet.rs / server.rs:200-207） */
export const RPC_MERGER_TTL_MS = 10_000;
/** 并发重组事务硬上限（本端加码）：超出 FIFO 淘汰最旧，防巨型分片流内存滥用 */
export const RPC_MERGER_MAX_ENTRIES = 1024;
/**
 * total_pieces 上限（v1.7 复核修复：官方 32 * 1024 → 本端 1024 的内存安全收紧）。
 * 官方上限 32k 针对通用场景；本端重组目标消息受 MAX_MESSAGE_BYTES(131072) 约束，
 * 官方发送端每片 ~1260 字节 ⇒ 合法消息 ≤ ~104 片，1024 为 10× 余量。原值配合
 * 「每片 new Array(total)」+ protobufjs body subarray 会发生远程内存放大
 * （1024 事务 × 32768 槽 ≈ 128~256MB/D0），故收紧；超出即拒绝（rpcPieceDropped）。
 */
export const RPC_MERGER_MAX_PIECES = 1024;
/**
 * 全局重组内存预算（v1.7 复核修复）：跨全部在途事务的 body 字节累计上限。
 * 超出按 lastSeen 最旧事务淘汰（计入 rpcPieceDropped）——单事务字节上限
 * （MAX_MESSAGE_BYTES）之外再加总量兜底，防「1024 个事务各持 128KB」的聚合放大。
 */
export const RPC_MERGER_MAX_TOTAL_BYTES = 4 * 1024 * 1024;

// ---------------------------------------------------------------------------
// 额度 shed 优雅降级（v1.7 A5）：平台硬限（Workers/DO 100k 请求/天）超限即
// Error 1027 全端点瘫痪。唯一结构机会：已建立的 Hibernation 会话不吃 Worker
// 请求额度——用量触顶时拒绝【新】连接，存量 mesh 跑到当日 UTC 复位。
// ---------------------------------------------------------------------------

/** shed 激活阈值：当日用量 ≥ 90%（GraphQL 账号用量或无凭证自计数粗估） */
export const SHED_ACTIVATE_RATIO = 0.9;
/** shed 恢复阈值：回落到 < 85% 才清除（滞回防抖，避免阈值附近反复翻转 KV 写） */
export const SHED_RESUME_RATIO = 0.85;
/** shed 检查间隔（DO alarm 内的时间戳门控，≤96 次/天；出站 GraphQL 不吃入站请求额度） */
export const SHED_CHECK_MS = 15 * 60_000;
/**
 * 内部房间头（v1.7 复核修复）：Worker 的 internal/admin 转发请求会带上已解析的
 * 房间 id——分片部署（ROOM_HEADER/ROOM_QUERY）下内部请求本身不含房间线索，
 * 不带此头会让 DO 回退 env 默认房间并跨房间写审计键。DO 侧仅对 `/internal/*`
 * 路径采信该头（WS 升级路径忽略，防客户端伪造）。
 */
export const ROOM_HEADER_INTERNAL = 'x-etcf-room';
/** 边缘层 shed 标记读缓存 TTL（与 IP_BLOCK_CACHE_MS 同量级；读失败维持上次值） */
export const SHED_EDGE_CACHE_MS = 30_000;

// ---------------------------------------------------------------------------
// 限流违规自动临时拉黑（v1.7 C4）：4008 断开不拉黑时，攻击/故障客户端可无限
// 重连——每循环 ≈1 Worker 升级 + 1 DO fetch + 消息折算 ≈3.5 计费请求/秒/连接，
// 分钟~小时级烧穿双墙（2026-11-17/18 额度事故指纹）。
// ---------------------------------------------------------------------------

/** 单 IP 滑动窗内触发自动拉黑的 4008 次数（保守起步：合法客户端单次偶发不受影响） */
export const AUTO_BLACKLIST_KILLS = 5;
/** 滑动窗时长（10 分钟）：窗内 ≥5 次 4008 断开 → 自动拉黑肇事 IP */
export const AUTO_BLACKLIST_WINDOW_MS = 10 * 60_000;
/** 观察窗按 IP 分桶的容量上限（FIFO 驱逐最旧，防轮换 IP 撑爆 DO 内存） */
export const AUTO_BLACKLIST_WINDOW_MAX_IPS = 1_000;
