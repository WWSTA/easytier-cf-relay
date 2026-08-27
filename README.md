# EasyTier Cloudflare Relay

在 Cloudflare Workers 免费额度内运行 EasyTier 自建 WebSocket 节点——无需 VPS，
客户端 `-p wss://<你的域名>/` 即可组网。纯 P2P 优先（中继仅兜底），
全 Hibernation API 空闲成本趋零。

已用 **easytier-core 2.6.4** 官方客户端实测：握手、路由同步、双节点互见、数据中继全部通过。

由于作者不太会Workers的开发，所以使用了国模**GLM5.3**进行全栈开发。虽然与国模经历来回扯皮，但是仍然有一些不影响使用的特性，下个版本再修，欢迎fork修理。~~（其实是没token了。。。总花费 61 RMB）~~

这是使用本项目部署好的节点[ouret.ccwu.cc](https://ouret.ccwu.cc)（为了更好使用，已禁中转）

## 功能

- **协议兼容**：字节级对齐官方实现（握手 / OSPF 路由同步 / PeerCenter / 包转发）
- **纯 P2P 优先**：宣告 `avoid_relay_data`，客户端优先直连，中继只做兜底（可完全关闭）
- **网络隔离**：网络名 + 密钥摘要（SipHash-1-3，与官方同算法）分组隔离，支持 `NETWORK_SECRETS` 服务端密钥校验
- **幽灵节点六重防线**：握手超时 / 空闲超时 / 主动探活（连接级）+
  direct 覆盖规则与 reporter 追踪 / 路由老化（对齐官方 `clear_expired_peer`）/ 空分组自动删除（路由级）——
  彻底解决多 PeerId 竞争残留的"幽灵路由条目"
- **安全加固**：`/health` 零指纹；`/metrics` 与管理端为自定义安全路径 + token 双门禁（fail-closed）；
  转发校验源身份、防路由投毒、防摘要抢占（注册表自愈）
- **Web 管理端**：侧边栏列表式导航（总览/节点/路由/互联/连接/分组/摘要注册），
  服务端分页 + 列表独立滚动（节点多时不爆炸），各功能块自带统计，
  全部支持**单个与批量操作**（踢出/删除分组/删除路由/删除互联/断开连接/删除摘要注册）
- **免费额度内稳定运行**：Hibernation + alarm 驱动，典型小网络日请求量约为限额的 5%

## 快速开始

```bash
npm install
npx wrangler login        # 浏览器授权
npm run deploy            # 部署
curl https://<worker域名>/health   # {"ok":true}
```

客户端接入（任意平台）：

```bash
easytier-core --network-name myteam --network-secret s3cret! \
  --hostname node-a -p wss://<你的域名>/
```

本地开发：`npm run dev` 启动 wrangler dev，用官方客户端连接 `ws://127.0.0.1:8787/` 验证。

## 文档

| 文档 | 内容 |
|---|---|
| [部署手册](docs/部署手册.md) | 快速部署、全部配置项、域名绑定、成本额度、运维、FAQ |
| [技术文档](docs/技术文档.md) | 协议实现详解、幽灵节点六重防线、与官方对比、Hibernation 设计、实测验证 |

## 项目结构

```
src/    index.js（入口路由/鉴权） room.js（DO） peer_manager.js（分组/路由）
        rpc.js wire.js packet.js siphash.js proto*.js admin_ui.js（管理端）
tools/  regen_proto.sh（从官方 .proto 重新生成静态 Protobuf 代码）
docs/   部署手册 / 技术文档
```

本地敏感变量放 `.dev.vars`（模板见 `.dev.vars.example`）——不入库、不随 deploy 上传生产。

## 致谢

本项目站在前人肩膀上，感谢以下项目：

- **[EasyTier](https://github.com/EasyTier/EasyTier)** — 官方去中心化 mesh VPN。
  本实现的协议行为全部以官方源码（tag v2.6.4）为基准逐项对齐，
  并以官方客户端实测验证兼容性。
- **[IceSoulHanxi/easytier-ws-relay](https://github.com/IceSoulHanxi/easytier-ws-relay)** —
  最早的 Cloudflare Workers 版 EasyTier WS 中继之一。
  其"幽灵节点"痛点直接催生了本项目的六重防线设计（握手超时 / 空闲超时 / 主动探活 +
  路由级老化管理）。
- **[Teleseon/cf-workers-et-ws](https://github.com/Teleseon/cf-workers-et-ws)** —
  活跃改进的 fork。已经解决“幽灵节点”的项目，本项目对其做了参考和改善。并且其 DO 计费与 protobuf 兼容性经验（setInterval 常驻计费、Workers 上的 eval 限制）直接影响了本项目"全 Hibernation + pbjs 静态代码生成"的技术路线。
- **[21paradox/easytier-wsrelay](https://github.com/21paradox/easytier-wsrelay)** 与
  **[PIKACHUIM/easytier-worker](https://github.com/PIKACHUIM/easytier-worker)** —
  社区多语言/带面板方向的探索，其踩过的协议细节坑（PacketType 枚举、method_index 基数等）
  为本项目"逐字段对照官方源码修正"提供了前车之鉴。

## 许可

[MIT License](https://github.com/WWSTA/easytier-cf-relay/blob/main/LICENSE)

## 免责声明

本项目仅供学习交流使用，请勿用于任何商业用途或非法用途。使用本项目代码造成的任何后果，原作者概不负责。
