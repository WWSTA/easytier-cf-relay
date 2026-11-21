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
# - 生成产物依赖 protobufjs ^8（运行时）与 long（64 位精度）；
# - B5（来源可复现）：启动即打印源仓库 commit，并把「源 commit + 生成日期 +
#   输入摘要」写入产物头注释——"对齐哪个版本"以产物头为准，可复现。
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="${1:-$ROOT/../research/EasyTier-official/easytier-proto/proto}"

if [ ! -f "$SRC_DIR/peer_rpc.proto" ]; then
  echo "error: $SRC_DIR/peer_rpc.proto not found" >&2
  echo "usage: $0 [easytier-proto/proto 目录]" >&2
  exit 1
fi

cd "$ROOT"

# B5：来源可复现——源仓库 commit / 提交日期 / 输入文件摘要（非 git 目录时标记 unknown）
SRC_REPO_ROOT="$(cd "$SRC_DIR/../.." 2>/dev/null && pwd)"
SRC_COMMIT="$(git -C "$SRC_REPO_ROOT" rev-parse HEAD 2>/dev/null || echo unknown)"
SRC_COMMIT_DATE="$(git -C "$SRC_REPO_ROOT" log -1 --format=%cI 2>/dev/null || echo unknown)"
DIGEST_PEER_RPC="$(sha256sum "$SRC_DIR/peer_rpc.proto" | cut -c1-12 2>/dev/null || echo unknown)"
DIGEST_COMMON="$(sha256sum "$SRC_DIR/common.proto" | cut -c1-12 2>/dev/null || echo unknown)"
DIGEST_ERROR="$(sha256sum "$SRC_DIR/error.proto" | cut -c1-12 2>/dev/null || echo unknown)"
echo "proto source: $SRC_REPO_ROOT"
echo "  commit: $SRC_COMMIT ($SRC_COMMIT_DATE)"
echo "  inputs: peer_rpc=$DIGEST_PEER_RPC common=$DIGEST_COMMON error=$DIGEST_ERROR"

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

# B5：把来源声明写入产物头注释（pbjs 每次全量覆写，因此生成后前置拼接）
GEN_DATE="$(date +%Y-%m-%d)"
TMP_HEADER="$(mktemp)"
cat > "$TMP_HEADER" <<EOF
/**
 * 静态 Protobuf 模块（pbjs 生成，勿手改）——由 tools/regen_proto.sh 重新生成。
 *
 * proto 来源：EasyTier-official main@${SRC_COMMIT}（${SRC_COMMIT_DATE} 快照）；
 * schema 与 easytier-core v2.7.0 等价，口径详见 docs/技术文档.md §4.2。
 * 生成日期：${GEN_DATE}
 * 输入摘要：peer_rpc=${DIGEST_PEER_RPC} common=${DIGEST_COMMON} error=${DIGEST_ERROR}
 */
EOF
cat "$TMP_HEADER" src/proto_gen.js > src/proto_gen.js.tmp && mv src/proto_gen.js.tmp src/proto_gen.js
rm -f "$TMP_HEADER"

echo "generated: src/proto_gen.js ($(wc -l < src/proto_gen.js) lines, source commit $SRC_COMMIT)"
echo "validate on the dev side (syntax check + codec smoke tests)"
