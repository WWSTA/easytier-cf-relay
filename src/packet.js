/**
 * ZCPacket PeerManagerHeader 解析/构造（纯 Uint8Array，无 Node Buffer）。
 *
 * 布局（全部小端，官方 packet/mod.rs::PeerManagerHeader，packed struct 16 字节）:
 *   [0..4)   from_peer_id  u32 LE
 *   [4..8)   to_peer_id    u32 LE
 *   [8]      packet_type   u8
 *   [9]      flags         u8
 *   [10]     forward_counter u8
 *   [11]     reserved      u8
 *   [12..16) len           u32 LE  (payload 长度)
 *
 * WebSocket 传输时每个二进制帧 = [header(16) | payload]（官方 tunnel/websocket.rs，
 * DummyTunnel 的 tunnel_payload 从 peer_manager_header_offset=0 开始）。
 */
import { HEADER_SIZE } from './constants.js';

/**
 * 解析 16 字节头。返回 null 表示数据不完整/非法。
 * @param {Uint8Array} buf
 * @param {number} [offset=0]
 */
export function parseHeader(buf, offset = 0) {
  if (!buf || buf.length - offset < HEADER_SIZE) return null;
  const dv = new DataView(buf.buffer, buf.byteOffset + offset, HEADER_SIZE);
  const header = {
    fromPeerId: dv.getUint32(0, true),
    toPeerId: dv.getUint32(4, true),
    packetType: buf[offset + 8],
    flags: buf[offset + 9],
    forwardCounter: buf[offset + 10],
    reserved: buf[offset + 11],
    len: dv.getUint32(12, true),
  };
  // len 与实际 payload 长度一致性校验（容忍多余填充，但不足则非法）
  const payloadLen = buf.length - offset - HEADER_SIZE;
  if (header.len > payloadLen) return null;
  return header;
}

/**
 * 构造完整数据包（header + payload）。
 * @param {number} fromPeerId
 * @param {number} toPeerId
 * @param {number} packetType
 * @param {Uint8Array} payload
 * @param {{flags?: number, forwardCounter?: number}} [opts]
 * @returns {Uint8Array}
 */
export function buildPacket(fromPeerId, toPeerId, packetType, payload, opts = {}) {
  const body = payload instanceof Uint8Array ? payload : new Uint8Array(0);
  const out = new Uint8Array(HEADER_SIZE + body.length);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, fromPeerId >>> 0, true);
  dv.setUint32(4, toPeerId >>> 0, true);
  out[8] = packetType & 0xff;
  out[9] = (opts.flags ?? 0) & 0xff;
  // 官方语义：本端新构造的包 forward_counter 起始为 1（packet/mod.rs fill_peer_manager_hdr）
  out[10] = (opts.forwardCounter ?? 1) & 0xff;
  out[11] = 0;
  dv.setUint32(12, body.length, true);
  out.set(body, HEADER_SIZE);
  return out;
}

/**
 * 转发时重写头：forward_counter+1、可选清理 latency_first（官方 peer_manager.rs 行为）。
 * 超过 MAX_FORWARD_COUNTER 返回 null（调用方应丢弃）。
 * @param {Uint8Array} fullMessage
 * @param {number} maxForwardCounter
 */
export function bumpForward(fullMessage, maxForwardCounter) {
  const dv = new DataView(fullMessage.buffer, fullMessage.byteOffset);
  const counter = fullMessage[10] + 1;
  if (counter > maxForwardCounter) return null;
  const out = fullMessage.slice();
  out[10] = counter;
  // 官方：forward_counter > 2 时清除 LATENCY_FIRST
  if (counter > 2) {
    out[9] = out[9] & ~0b0000_0010;
  }
  return out;
}

/** 提取 payload 视图（不拷贝） */
export function payloadOf(buf) {
  return buf.subarray(HEADER_SIZE);
}
