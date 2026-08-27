/**
 * 最小 protobuf wire 层 —— 对齐官方 easytier-core/src/peers/route/route_peer_wire.rs。
 *
 * 目的：路由反射时保留对端上报的 RoutePeerInfo 原始字节。
 * 官方要求（raw_peer_infos 机制）：服务端把客户端 A 的 RoutePeerInfo 原样转发给
 * 客户端 B，只允许改极少数字段；若走「decode -> 对象 -> encode」路径，本端 descriptor
 * 未覆盖的字段（tcp_nat_type=17、noise_static_pubkey=18、凭据=19、ipv6=22/24 等）
 * 会被静默丢弃，导致新版客户端功能降级。因此在 wire 层直接搬运字节。
 *
 * 本模块提供：
 * - varint / tag / length-delimited 的编解码原语；
 * - 从 SyncRouteInfoRequest 字节中提取每个 RoutePeerInfo 的原始字节；
 * - 以「原始字节为元素」在 wire 层重组 SyncRouteInfoRequest。
 */

const WT_VARINT = 0;
const WT_I64 = 1;
const WT_LEN = 2;
const WT_I32 = 5;

// SyncRouteInfoRequest 字段号（官方 peer_rpc.proto）
const SYNC_REQ_MY_PEER_ID = 1;
const SYNC_REQ_MY_SESSION_ID = 2;
const SYNC_REQ_IS_INITIATOR = 3;
const SYNC_REQ_PEER_INFOS = 4;
const SYNC_REQ_CONN_BITMAP = 5;
const SYNC_REQ_FOREIGN_NETWORK = 6;

// RoutePeerInfos.items 字段号
const ROUTE_PEER_INFOS_ITEM = 1;

// ---------------------------------------------------------------------------
// 编码原语
// ---------------------------------------------------------------------------

/** varint 编码（value: number|bigint），返回字节数组 */
export function encodeVarint(value) {
  let v = typeof value === 'bigint' ? value : BigInt(value);
  if (v < 0n) v &= (1n << 64n) - 1n; // 负数按 u64 补码（protobuf int64 语义）
  const out = [];
  while (v > 0x7fn) {
    out.push(Number((v & 0x7fn) | 0x80n));
    v >>= 7n;
  }
  out.push(Number(v));
  return out;
}

/** tag 编码：fieldNumber * 8 + wireType */
function encodeTag(fieldNumber, wireType) {
  return encodeVarint(fieldNumber * 8 + wireType);
}

/** 构造一个 length-delimited 字段（含 tag 与长度前缀） */
function lenDelim(fieldNumber, payload) {
  const tag = encodeTag(fieldNumber, WT_LEN);
  const len = encodeVarint(payload.length);
  const out = new Uint8Array(tag.length + len.length + payload.length);
  let off = 0;
  out.set(tag, off); off += tag.length;
  out.set(len, off); off += len.length;
  out.set(payload, off);
  return out;
}

/** 构造一个 varint 字段（含 tag） */
function varintField(fieldNumber, value) {
  const tag = encodeTag(fieldNumber, WT_VARINT);
  const val = encodeVarint(value);
  const out = new Uint8Array(tag.length + val.length);
  out.set(tag, 0);
  out.set(val, tag.length);
  return out;
}

/** 拼接多个 Uint8Array */
export function concat(...parts) {
  let total = 0;
  for (const p of parts) total += p.length;
  const out = new Uint8Array(total);
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.length;
  }
  return out;
}

// ---------------------------------------------------------------------------
// 解码原语
// ---------------------------------------------------------------------------

/**
 * 解析 message 的顶层 wire 字段。
 * @returns {Array<{fieldNumber:number, wireType:number, varint?:bigint, bytes?:Uint8Array, start:number, end:number}>}
 *          解析失败返回 null（非法输入，调用方应忽略整个包）。
 */
export function parseWireFields(buf) {
  const fields = [];
  let pos = 0;
  const readVarint = () => {
    let shift = 0n;
    let result = 0n;
    while (pos < buf.length) {
      const b = buf[pos++];
      result |= BigInt(b & 0x7f) << shift;
      if ((b & 0x80) === 0) return result;
      shift += 7n;
      if (shift > 63n) return null; // 超长 varint
    }
    return null; // 截断
  };

  while (pos < buf.length) {
    const start = pos;
    const key = readVarint();
    if (key == null) return null;
    const fieldNumber = Number(key >> 3n);
    const wireType = Number(key & 7n);
    if (fieldNumber === 0) return null;

    let varint;
    let bytes;
    switch (wireType) {
      case WT_VARINT: {
        const v = readVarint();
        if (v == null) return null;
        varint = v;
        break;
      }
      case WT_I64:
        if (pos + 8 > buf.length) return null;
        bytes = buf.subarray(pos, pos + 8);
        pos += 8;
        break;
      case WT_LEN: {
        const len = readVarint();
        if (len == null || len > BigInt(buf.length - pos)) return null;
        const n = Number(len);
        bytes = buf.subarray(pos, pos + n);
        pos += n;
        break;
      }
      case WT_I32:
        if (pos + 4 > buf.length) return null;
        bytes = buf.subarray(pos, pos + 4);
        pos += 4;
        break;
      default:
        return null; // group 等已废弃类型
    }
    fields.push({ fieldNumber, wireType, varint, bytes, start, end: pos });
  }
  return fields;
}

// ---------------------------------------------------------------------------
// RoutePeerInfo 原始字节提取 / 注入
// ---------------------------------------------------------------------------

/**
 * 从 SyncRouteInfoRequest 编码字节中提取每个 RoutePeerInfo 的原始字节。
 * 返回数组与 req.peerInfos.items 顺序一致；提取失败返回 null（调用方退回对象路径）。
 * @param {Uint8Array} syncReqBytes
 * @returns {Uint8Array[]|null}
 */
export function extractRawPeerInfos(syncReqBytes) {
  const top = parseWireFields(syncReqBytes);
  if (!top) return null;
  const peerInfosField = top.find((f) => f.fieldNumber === SYNC_REQ_PEER_INFOS && f.wireType === WT_LEN);
  if (!peerInfosField) return [];
  const items = parseWireFields(peerInfosField.bytes);
  if (!items) return null;
  const out = [];
  for (const f of items) {
    if (f.fieldNumber !== ROUTE_PEER_INFOS_ITEM || f.wireType !== WT_LEN) return null;
    out.push(f.bytes);
  }
  return out;
}

/**
 * wire 层重组 SyncRouteInfoRequest。
 * peerInfoItems 的每个元素是 RoutePeerInfo 的完整编码字节（原始转发或本端构造）。
 * @param {{myPeerId:number, mySessionId:bigint|number|Long, isInitiator:boolean,
 *          peerInfoItems?:Uint8Array[], connBitmapBytes?:Uint8Array|null,
 *          foreignNetworkInfosBytes?:Uint8Array|null}} parts
 * @returns {Uint8Array}
 */
export function buildSyncRouteInfoRequestBytes(parts) {
  const chunks = [];
  chunks.push(varintField(SYNC_REQ_MY_PEER_ID, parts.myPeerId >>> 0));
  const sid = typeof parts.mySessionId === 'object' && parts.mySessionId !== null
    ? parts.mySessionId.toUnsigned().toString() // Long
    : parts.mySessionId;
  chunks.push(varintField(SYNC_REQ_MY_SESSION_ID, sid));
  if (parts.isInitiator) {
    chunks.push(varintField(SYNC_REQ_IS_INITIATOR, 1));
  }
  if (parts.peerInfoItems && parts.peerInfoItems.length > 0) {
    // RoutePeerInfos { items: repeated field 1 }
    let innerLen = 0;
    for (const it of parts.peerInfoItems) innerLen += lenDelim(ROUTE_PEER_INFOS_ITEM, it).length;
    const inner = new Uint8Array(innerLen);
    let off = 0;
    for (const it of parts.peerInfoItems) {
      const c = lenDelim(ROUTE_PEER_INFOS_ITEM, it);
      inner.set(c, off);
      off += c.length;
    }
    chunks.push(lenDelim(SYNC_REQ_PEER_INFOS, inner));
  }
  if (parts.connBitmapBytes && parts.connBitmapBytes.length > 0) {
    chunks.push(lenDelim(SYNC_REQ_CONN_BITMAP, parts.connBitmapBytes));
  }
  if (parts.foreignNetworkInfosBytes && parts.foreignNetworkInfosBytes.length > 0) {
    chunks.push(lenDelim(SYNC_REQ_FOREIGN_NETWORK, parts.foreignNetworkInfosBytes));
  }
  return concat(...chunks);
}

/**
 * 提取 SyncRouteInfoRequest 的 my_session_id（u64，BigInt）。
 * @returns {bigint|null}
 */
export function extractMySessionId(syncReqBytes) {
  const top = parseWireFields(syncReqBytes);
  if (!top) return null;
  const f = top.find((x) => x.fieldNumber === SYNC_REQ_MY_SESSION_ID);
  return f ? (f.varint ?? 0n) : null;
}
