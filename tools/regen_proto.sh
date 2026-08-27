#!/usr/bin/env bash
# 从官方 EasyTier 源码重新生成静态 Protobuf 模块（src/proto_gen.js）。
#
# 背景：Cloudflare Workers 禁止 eval / new Function，protobufjs 反射模式
# （Root.fromJSON + 运行期 codegen）不可用，必须使用 pbjs 静态代码生成。
#
# 用法：
#   ./tools/regen_proto.sh [easytier 源码根目录]
#   默认目录：../research/EasyTier-official（相对本工程）
#
# 说明：
# - 仅生成 encode/decode（--no-create/--no-verify/--no-convert 等），
#   覆盖 peer_rpc.proto + common.proto + error.proto 全部消息；
# - protobufjs-cli 的 --filter 无法处理 google.protobuf.Timestamp 三段名
#   （会静默失败并生成全量），因此不用 filter，靠 --no-* 选项控制体积；
# - 生成产物依赖 protobufjs ^8（运行时）与 long（64 位精度）。
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="${1:-$ROOT/../research/EasyTier-official/easytier-proto/proto}"

if [ ! -f "$SRC_DIR/peer_rpc.proto" ]; then
  echo "error: $SRC_DIR/peer_rpc.proto not found" >&2
  echo "usage: $0 [easytier-proto/proto 目录]" >&2
  exit 1
fi

cd "$ROOT"

npx pbjs \
  -t static-module \
  -w esm \
  --es6 \
  --force-long \
  --no-create \
  --no-verify \
  --no-convert \
  --no-delimited \
  --no-typeurl \
  --no-service \
  -o src/proto_gen.js \
  "$SRC_DIR/peer_rpc.proto" \
  "$SRC_DIR/common.proto" \
  "$SRC_DIR/error.proto"

echo "generated: src/proto_gen.js ($(wc -l < src/proto_gen.js) lines)"
echo "run 'npm test' to validate"
