/**
 * SipHash-1-3 与 EasyTier 网络摘要（digest）生成。
 *
 * 与官方对齐：
 * - Rust `std::collections::hash_map::DefaultHasher` == SipHasher13，密钥 (0, 0)，
 *   `finish()` 输出 u64；多次 `write()` 后 `finish()` 对"全部已写字节"取哈希且不重置状态。
 * - `easytier/src/tunnel/mod.rs::generate_digest_from_str(name, secret, digest)`：
 *   digest 长度为 8 的倍数（EasyTier 使用 32 字节），按 8 字节分片：
 *     digest[i*8..(i+1)*8] = hasher.finish().to_be_bytes()
 *     hasher.write(digest[..(i+1)*8])   // 反馈已生成部分
 *
 * 本文件用 BigInt 实现 64 位轮函数，保证与 Rust 位级一致。
 */

const U64_MASK = (1n << 64n) - 1n;

function rotl64(x, b) {
  const bb = BigInt(b);
  return ((x << bb) | (x >> (64n - bb))) & U64_MASK;
}

/** 单轮 SipRound */
function sipRound(v) {
  v.v0 = (v.v0 + v.v1) & U64_MASK;
  v.v1 = rotl64(v.v1, 13);
  v.v1 ^= v.v0;
  v.v0 = rotl64(v.v0, 32);

  v.v2 = (v.v2 + v.v3) & U64_MASK;
  v.v3 = rotl64(v.v3, 16);
  v.v3 ^= v.v2;

  v.v0 = (v.v0 + v.v3) & U64_MASK;
  v.v3 = rotl64(v.v3, 21);
  v.v3 ^= v.v0;

  v.v2 = (v.v2 + v.v1) & U64_MASK;
  v.v1 = rotl64(v.v1, 17);
  v.v1 ^= v.v2;
  v.v2 = rotl64(v.v2, 32);
}

/**
 * SipHash-1-3（密钥 0,0）。
 * @param {Uint8Array} msg
 * @returns {bigint} u64
 */
export function sipHash13(msg) {
  const len = msg.length;
  const v = {
    v0: 0x736f6d6570736575n,
    v1: 0x646f72616e646f6dn,
    v2: 0x6c7967656e657261n,
    v3: 0x7465646279746573n,
  };

  const fullLen = len - (len % 8);
  const dv = new DataView(msg.buffer, msg.byteOffset, msg.byteLength);
  for (let i = 0; i < fullLen; i += 8) {
    const m = dv.getBigUint64(i, true); // little-endian 字序
    v.v3 ^= m;
    sipRound(v); // 1 轮压缩
    v.v0 ^= m;
  }

  // 末块：低 56 位放残余字节，最高字节为 (len & 0xff)（标准 SipHash 规范）
  let m = BigInt(len & 0xff) << 56n;
  for (let i = 0; i < len % 8; i++) {
    m |= BigInt(msg[fullLen + i]) << (8n * BigInt(i));
  }

  v.v3 ^= m;
  sipRound(v);
  v.v0 ^= m;

  v.v2 ^= 0xffn;
  for (let i = 0; i < 3; i++) sipRound(v); // 3 轮终结

  return (v.v0 ^ v.v1 ^ v.v2 ^ v.v3) & U64_MASK;
}

/** 状态累积哈希器：模拟 Rust DefaultHasher 的 write/finish 语义（finish 不重置） */
class DefaultHasher {
  constructor() {
    this.parts = [];
    this.total = 0;
  }
  write(buf) {
    if (!buf || buf.length === 0) return;
    this.parts.push(buf);
    this.total += buf.length;
  }
  finish() {
    let msg;
    if (this.parts.length === 1) {
      msg = this.parts[0];
    } else {
      msg = new Uint8Array(this.total);
      let off = 0;
      for (const p of this.parts) {
        msg.set(p, off);
        off += p.length;
      }
    }
    return sipHash13(msg);
  }
}

/** u64 -> 8 字节大端 */
function u64ToBeBytes(x) {
  const out = new Uint8Array(8);
  let v = x & U64_MASK;
  for (let i = 7; i >= 0; i--) {
    out[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  return out;
}

/**
 * 生成网络摘要（与官方 generate_digest_from_str 一致）。
 * @param {string} networkName
 * @param {string} networkSecret
 * @param {number} [digestLen=32]
 * @returns {Uint8Array}
 */
export function generateNetworkDigest(networkName, networkSecret, digestLen = 32) {
  if (!Number.isInteger(digestLen) || digestLen <= 0 || digestLen % 8 !== 0) {
    throw new Error('digest length must be multiple of 8');
  }
  const enc = new TextEncoder();
  const hasher = new DefaultHasher();
  hasher.write(enc.encode(String(networkName ?? '')));
  hasher.write(enc.encode(String(networkSecret ?? '')));

  const digest = new Uint8Array(digestLen);
  const shards = digestLen / 8;
  for (let i = 0; i < shards; i++) {
    u64ToBeBytes(hasher.finish()).forEach((b, j) => {
      digest[i * 8 + j] = b;
    });
    hasher.write(digest.subarray(0, (i + 1) * 8));
  }
  return digest;
}

/** bytes -> hex 小写 */
export function bytesToHex(bytes) {
  let s = '';
  for (const b of bytes) s += b.toString(16).padStart(2, '0');
  return s;
}

/** hex -> bytes */
export function hexToBytes(hex) {
  const clean = String(hex || '').replace(/[^0-9a-fA-F]/g, '');
  if (clean.length % 2 !== 0) return new Uint8Array(0);
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return out;
}

/** 加密安全的随机字节 */
export function randomBytes(n) {
  const out = new Uint8Array(n);
  crypto.getRandomValues(out);
  return out;
}
