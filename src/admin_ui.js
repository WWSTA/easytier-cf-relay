/**
 * Web 管理端单页应用（内嵌 HTML，无外部依赖）。
 *
 * 由 Worker 入口在 ADMIN_PATH 提供页面壳（页面本身不含数据，无需鉴权）；
 * 所有数据操作经 /api/* 以 Authorization: Bearer <ADMIN_TOKEN> 鉴权。
 *
 * v1.6.0 视觉翻新（方案 A2「定制版」）：白色浅色默认 + 明暗/主色/圆角可定制
 * （设置弹层，记忆键 et_admin_*）、侧栏可收缩（桌面图标栏 / 移动抽屉）、
 * 总览瀑布流（卡片可收起逐卡记忆、板块可显隐）、趋势卡全宽双轴 + 悬停提示、
 * 命令对照与术语说明移入「帮助」抽屉。实现基准与移植映射见
 * easytier-cf-relay-ui-proto/方案A2-定制版设计方案.md。
 *
 * 设计要点（防止节点多时页面爆炸）：
 * - 侧边栏列表式导航，按功能块（tab）分区；
 * - 服务端分页（?tab=&offset=&limit=，limit 上限 200），列表区独立滚动；
 * - 每个功能块头部有独立统计（总数 / 直连 / 中转 / 幽灵等）；
 * - 每个功能块支持批量操作（勾选 + 批量按钮）；
 * - 自动刷新仅拉取当前 tab（间隔可在设置中调整，页面不可见时暂停）。
 */
export const ADMIN_HTML = `<!doctype html>
<html lang="zh-CN" data-theme="light" data-accent="easytier" data-radius="standard">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" type="image/png" href="/favicon.ico">
<title>EasyTier CF Relay 控制台</title>
<style>
  /* ---------- 主题令牌（设置弹层可切换，记忆键 et_admin_*） ---------- */
  :root{
    --bg:#f8fafc; --surface:#ffffff; --border:#e5e7eb; --fg:#1f2937; --muted:#6b7280; --dim:#9ca3af;
    --ok:#16a34a; --warn:#d97706; --bad:#dc2626;
    --accent:#6699ff; --accent-fg:#ffffff;
    --radius:10px; --radius-sm:8px; --sbw:224px; --sbw-rail:64px;
  }
  [data-theme="dark"]{
    --bg:#0d1424; --surface:#131c30; --border:#263450; --fg:#e6ebf5; --muted:#8c96ab; --dim:#5b6579;
  }
  [data-accent="easytier"]{--accent:#6699ff}
  [data-accent="indigo"]{--accent:#6366f1}
  [data-accent="teal"]{--accent:#0d9488}
  [data-accent="amber"]{--accent:#d97706}
  :root{--soft:color-mix(in srgb, var(--accent) 11%, transparent); --soft-fg:color-mix(in srgb, var(--accent) 72%, var(--fg))}
  [data-theme="dark"]{--soft:color-mix(in srgb, var(--accent) 17%, transparent); --soft-fg:color-mix(in srgb, var(--accent) 55%, var(--fg))}
  [data-radius="compact"]{--radius:6px; --radius-sm:5px}
  [data-radius="standard"]{--radius:10px; --radius-sm:8px}
  [data-radius="round"]{--radius:14px; --radius-sm:11px}

  *{box-sizing:border-box}
  html,body{margin:0}
  body{
    background:var(--bg); color:var(--fg);
    font:14px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif;
    display:grid; grid-template-columns:var(--sbw) 1fr; min-height:100vh;
    transition:grid-template-columns .18s ease;
  }
  body.rail{grid-template-columns:var(--sbw-rail) 1fr}
  a{color:var(--soft-fg)}
  code{background:var(--bg); padding:1px 5px; border-radius:4px; font-size:11.5px}

  /* ---------- 侧栏 ---------- */
  .sidebar{background:var(--surface); border-right:1px solid var(--border); padding:14px 12px; display:flex; flex-direction:column; gap:2px; position:sticky; top:0; height:100vh; overflow:hidden}
  .brand{display:flex; align-items:center; gap:9px; font-weight:700; padding:6px 8px 14px; white-space:nowrap}
  .brand .logo{width:28px;height:28px;flex:none;display:grid;place-items:center}
  .brand .logo svg{width:28px;height:28px;display:block}
  .nav{display:flex; flex-direction:column; gap:2px; overflow-y:auto; overflow-x:hidden; flex:1; min-height:0}
  .nav .group-label{font-size:11px; color:var(--muted); padding:13px 10px 5px; letter-spacing:.06em; white-space:nowrap}
  .nav button{display:flex; align-items:center; gap:9px; width:100%; padding:7px 10px; border-radius:var(--radius-sm); border:none; background:none; color:var(--fg); font:inherit; cursor:pointer; text-align:left; white-space:nowrap; position:relative}
  .nav button:hover{background:var(--bg)}
  .nav button.active{background:var(--soft); color:var(--soft-fg); font-weight:600}
  .nav button svg{width:16px;height:16px;flex:none}
  .nav .cnt{margin-left:auto; font-size:11px; color:var(--muted); background:var(--bg); border:1px solid var(--border); border-radius:999px; padding:0 7px; line-height:16px}
  .nav button.active .cnt{color:var(--soft-fg); border-color:transparent; background:var(--soft)}
  .side-foot{border-top:1px solid var(--border); padding-top:9px; display:flex; flex-direction:column; gap:3px}
  .side-link{display:flex; align-items:center; gap:9px; width:100%; padding:7px 10px; border-radius:var(--radius-sm); border:none; background:none; color:var(--muted); font:inherit; font-size:13px; cursor:pointer; text-align:left; white-space:nowrap}
  .side-link:hover{background:var(--bg); color:var(--fg)}
  .side-link svg{width:15px;height:15px;flex:none}
  .side-foot .ver{font-size:11px; color:var(--dim); padding:4px 10px 0; white-space:nowrap}
  .collapse-btn{display:flex; align-items:center; gap:9px; width:100%; padding:7px 10px; border-radius:var(--radius-sm); border:1px solid var(--border); background:none; color:var(--muted); font:inherit; font-size:12.5px; cursor:pointer; white-space:nowrap}
  .collapse-btn:hover{background:var(--bg); color:var(--fg)}
  .collapse-btn svg{width:15px;height:15px;flex:none}

  body.rail .brand .brand-name, body.rail .nav button .label, body.rail .nav button .cnt,
  body.rail .nav .group-label, body.rail .side-link .label, body.rail .side-foot .ver,
  body.rail .collapse-btn .label{display:none}
  body.rail .brand{justify-content:center; padding-left:0; padding-right:0}
  body.rail .side-link, body.rail .collapse-btn, body.rail .nav button{justify-content:center; padding:8px 0}
  body.rail .side-link:hover::after, body.rail .collapse-btn:hover::after, body.rail .nav button:hover::after{
    content:attr(data-tip); position:absolute; left:calc(100% + 10px); top:50%; transform:translateY(-50%);
    background:var(--fg); color:var(--bg); font-size:12px; font-weight:500; padding:3px 9px; border-radius:6px; white-space:nowrap; z-index:60;
  }

  /* ---------- 主区 ---------- */
  main{min-width:0; padding:0 26px 48px}
  .topbar{padding:13px 0; display:flex; justify-content:space-between; align-items:center; gap:12px; border-bottom:1px solid var(--border); margin-bottom:20px; flex-wrap:wrap; position:relative}
  .topbar h1{font-size:19px; margin:0; letter-spacing:-.01em; display:flex; align-items:center; gap:10px}
  .topbar .right{display:flex; align-items:center; gap:10px; color:var(--muted); flex-wrap:wrap}
  .status{font-size:12px; color:var(--dim); min-width:70px}
  .hamburger{display:none; width:38px; height:38px; border-radius:var(--radius-sm); border:1px solid var(--border); background:var(--surface); color:var(--fg); cursor:pointer; place-items:center}
  .chip-auto{font-size:12px; display:flex; align-items:center; gap:5px}
  button{font:inherit; cursor:pointer}
  .btn{padding:6px 13px; border-radius:var(--radius-sm); border:1px solid var(--border); background:var(--surface); color:var(--fg)}
  .btn:hover{background:var(--bg)}
  .btn.primary{background:var(--accent); border-color:var(--accent); color:var(--accent-fg)}
  .btn.danger{color:var(--bad); border-color:color-mix(in srgb,var(--bad) 35%, var(--border))}
  .icon-btn{width:34px; height:34px; display:grid; place-items:center; padding:0}
  .icon-btn svg{width:16px;height:16px}
  .token-inline{background:var(--bg); border:1px solid var(--border); color:var(--fg); border-radius:var(--radius-sm); padding:6px 10px; width:200px}
  .token-lock{display:none}
  .tin{background:var(--bg); border:1px solid var(--border); color:var(--fg); border-radius:var(--radius-sm); padding:6px 9px; font-size:13px; width:150px}

  .chips{display:flex; gap:8px; flex-wrap:wrap; margin-bottom:18px}
  .chip{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-sm); padding:6px 12px; font-size:12px; color:var(--muted); display:flex; gap:6px; align-items:baseline}
  .chip b{font-size:15px; color:var(--fg); font-variant-numeric:tabular-nums; letter-spacing:-.01em}
  .chip.hl b{color:var(--soft-fg)}
  .chip.bad b{color:var(--bad)}
  .chip.good b{color:var(--ok)}

  /* ---------- 总览瀑布流（卡片可收起，逐卡记忆） ---------- */
  .masonry{position:relative; margin-bottom:14px}
  .masonry .card{position:absolute; margin:0; transition:left .18s ease, top .18s ease}
  .masonry.no-anim .card{transition:none}
  .ov-hidden{display:none !important}
  .grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:14px; margin-bottom:14px}
  .card{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:14px 18px}
  .card-h{margin:0; font-size:13px; font-weight:600; color:var(--muted); cursor:pointer; user-select:none; display:flex; justify-content:space-between; align-items:center; gap:8px}
  .card-h:hover{color:var(--fg)}
  .card-h .chev{flex:none; width:14px; height:14px; transition:transform .15s; color:var(--dim)}
  .card.collapsed .chev{transform:rotate(-90deg)}
  .card-b{margin-top:9px}
  .card.collapsed .card-b{display:none}
  .card-h .tabs{margin-left:auto; display:flex; gap:4px}
  .card-h .tabs button{border:none; background:none; padding:2px 8px; border-radius:calc(var(--radius-sm) - 3px); font-size:11.5px; color:var(--muted)}
  .card-h .tabs button.on{background:var(--soft); color:var(--soft-fg); font-weight:600}
  .kv{display:flex; justify-content:space-between; gap:10px; font-size:13px; padding:3.5px 0; color:var(--muted)}
  .kv b{color:var(--fg); font-weight:500; font-variant-numeric:tabular-nums; text-align:right}
  .kv b.good{color:var(--ok)} .kv b.badv{color:var(--bad)}
  .bar{background:var(--bg); border:1px solid var(--border); border-radius:999px; height:9px; margin:8px 0 4px; overflow:hidden}
  .bar i{display:block; height:100%; background:var(--accent); border-radius:999px}
  .foot-note{font-size:12px; color:var(--dim); margin-top:4px}

  /* ---------- 趋势图（全宽固定顶部，双轴 + 悬停提示） ---------- */
  .chart-wrap{position:relative; margin:0 -18px 12px}
  .chart{height:220px; position:relative; background:linear-gradient(180deg, var(--soft), transparent); border-bottom:1px solid var(--border); overflow:visible; border-radius:var(--radius) var(--radius) 0 0}
  .chart svg{width:100%; height:100%; display:block}
  .chart-tip{position:absolute; display:none; pointer-events:none; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-sm); padding:5px 9px; font-size:11.5px; color:var(--fg); white-space:nowrap; box-shadow:0 6px 18px rgba(2,8,23,.18); z-index:8}
  .chart-tip b.ok{color:var(--ok)} .chart-tip b.warn{color:var(--warn)}
  .legend{display:flex; gap:14px; font-size:12px; color:var(--muted); flex-wrap:wrap; margin-top:10px}
  .legend .sw{display:inline-block; width:8px; height:8px; border-radius:2px; margin-right:5px; vertical-align:1px}

  /* ---------- 表格页 ---------- */
  .toolbar{display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-bottom:12px}
  .toolbar select{font:inherit; font-size:13px; padding:6px 9px; border-radius:var(--radius-sm); border:1px solid var(--border); background:var(--surface); color:var(--fg)}
  .toolbar .sep{flex:1}
  .toolbar label{font-size:12.5px; color:var(--muted); display:flex; gap:5px; align-items:center; white-space:nowrap}
  .tablewrap{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); overflow:auto}
  table{width:100%; border-collapse:collapse; font-size:13.5px}
  th,td{text-align:left; padding:9px 12px; border-top:1px solid var(--border); white-space:nowrap}
  tr:first-child th, tr:first-child td{border-top:none}
  th{font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:.06em; font-weight:600; background:var(--surface)}
  td{font-variant-numeric:tabular-nums}
  tbody tr:hover{background:var(--bg)}
  .pill{display:inline-block; font-size:11px; padding:2px 9px; border-radius:999px; background:var(--bg); border:1px solid var(--border); color:var(--muted)}
  .pill.good{color:var(--ok); border-color:color-mix(in srgb,var(--ok) 30%, transparent)}
  .pill.badv{color:var(--bad); border-color:color-mix(in srgb,var(--bad) 30%, transparent)}
  .pill.info{color:var(--soft-fg); border-color:color-mix(in srgb,var(--accent) 30%, transparent)}
  .tag{display:inline-block; border-radius:4px; padding:0 6px; font-size:11px}
  .tag.direct{background:#065f46;color:#a7f3d0}
  .tag.transit{background:#7c2d12;color:#fed7aa}
  .tag.on{background:#065f46;color:#a7f3d0}
  .tag.off{background:#374151;color:#cbd5e1}
  .tag.ghost{background:#7f1d1d;color:#fecaca}
  .muted{color:var(--dim); font-size:12px}
  .empty{padding:28px; text-align:center; color:var(--dim)}
  .nosel{user-select:none}
  .pager{display:flex; gap:8px; align-items:center; justify-content:flex-end; font-size:12.5px; color:var(--muted); margin-top:10px}
  .page-note{font-size:12.5px; color:var(--muted); margin:0 0 12px}

  /* 记录设置页表单 */
  .setgrid .row{display:flex; align-items:center; gap:12px; padding:8px 0; border-top:1px solid var(--border); flex-wrap:wrap}
  .setgrid .row:first-child{border-top:none}
  .setgrid .name{width:130px; font-weight:600; font-size:13px}
  .setgrid input[type="number"]{width:90px; padding:5px 8px; border-radius:var(--radius-sm); border:1px solid var(--border); background:var(--bg); color:var(--fg); font:inherit}
  .setgrid .hint{color:var(--muted); font-size:12px; flex:1; min-width:160px}
  .setgrid input[type="number"]:disabled, .setgrid input[type="checkbox"]:disabled{opacity:.55}

  /* ---------- 设置弹层 ---------- */
  .modal-mask{display:none; position:fixed; inset:0; background:rgba(15,23,42,.45); z-index:80; align-items:center; justify-content:center; padding:16px}
  .modal-mask.open{display:flex}
  .modal{background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); width:min(440px,94vw); max-height:90vh; overflow:auto; box-shadow:0 20px 60px rgba(2,8,23,.3)}
  .modal header{display:flex; justify-content:space-between; align-items:center; padding:14px 18px; border-bottom:1px solid var(--border); font-weight:700; font-size:14.5px}
  .modal .body{padding:16px 18px; display:flex; flex-direction:column; gap:16px}
  .set-group-title{font-size:11px; color:var(--dim); letter-spacing:.06em; text-transform:uppercase; margin:-2px 0 -6px}
  .set-row{display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap}
  .set-label{font-size:13px; font-weight:600}
  .set-label small{display:block; font-weight:400; color:var(--muted); font-size:11.5px; margin-top:1px}
  .seg{display:flex; gap:4px; background:var(--bg); border:1px solid var(--border); border-radius:var(--radius-sm); padding:3px}
  .seg button{border:none; background:none; padding:5px 12px; border-radius:calc(var(--radius-sm) - 3px); font-size:12.5px; color:var(--muted)}
  .seg button.on{background:var(--surface); color:var(--soft-fg); font-weight:600; box-shadow:0 1px 3px rgba(2,8,23,.12)}
  .swatches{display:flex; gap:10px}
  .swatch{width:30px; height:30px; border-radius:50%; border:2px solid transparent; background:var(--c); cursor:pointer}
  .swatch.on{border-color:var(--fg); box-shadow:0 0 0 3px var(--bg), 0 0 0 4.5px var(--accent)}
  .ov-toggles{display:flex; gap:8px 16px; flex-wrap:wrap; font-size:12.5px; color:var(--muted); max-width:320px}
  .ov-toggles label{display:flex; gap:5px; align-items:center; cursor:pointer; white-space:nowrap}
  .modal .foot{padding:12px 18px 16px; color:var(--dim); font-size:11.5px; border-top:1px solid var(--border)}

  /* ---------- 帮助抽屉 ---------- */
  .drawer-mask{display:none; position:fixed; inset:0; background:rgba(15,23,42,.45); z-index:70}
  .drawer-mask.open{display:block}
  .drawer{position:fixed; top:0; right:0; height:100vh; width:min(440px,94vw); background:var(--surface); border-left:1px solid var(--border); z-index:75; transform:translateX(103%); transition:transform .22s ease; display:flex; flex-direction:column}
  .drawer.open{transform:translateX(0)}
  .drawer header{display:flex; justify-content:space-between; align-items:center; padding:14px 18px; border-bottom:1px solid var(--border); font-weight:700; font-size:14.5px}
  .drawer .body{padding:14px 18px 20px; overflow-y:auto; flex:1}
  .drawer h4{margin:16px 0 8px; font-size:12px; color:var(--muted); letter-spacing:.05em; text-transform:uppercase}
  .drawer h4:first-child{margin-top:0}
  .help-sec{background:var(--bg); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px 12px; margin-bottom:8px; font-size:12.5px; color:var(--muted)}
  .help-sec b{color:var(--fg); display:block; margin-bottom:2px; font-size:12.5px}
  .drawer .tablewrap{border:1px solid var(--border); border-radius:var(--radius-sm); max-height:300px; overflow:auto}
  .drawer table{font-size:12.5px}
  .drawer th,.drawer td{padding:7px 10px}
  .drawer th{position:sticky; top:0; z-index:2}

  /* token 弹层（手机） */
  .token-pop{display:none; position:absolute; right:0; top:calc(100% + 6px); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px; box-shadow:0 10px 30px rgba(2,8,23,.25); z-index:65; gap:8px}
  .token-pop.open{display:flex}
  .token-pop input{background:var(--bg); border:1px solid var(--border); color:var(--fg); border-radius:var(--radius-sm); padding:8px 10px; width:190px}

  #toast{position:fixed; right:18px; bottom:18px; background:var(--surface); border:1px solid var(--border); border-left:3px solid var(--accent); border-radius:var(--radius-sm); padding:10px 14px; font-size:12.5px; max-width:420px; display:none; z-index:90; box-shadow:0 10px 30px rgba(2,8,23,.2)}
  #toast.err{border-left-color:var(--bad)}

  /* ---------- 响应式 ---------- */
  @media (max-width:920px){
    body{grid-template-columns:1fr}
    .sidebar{position:fixed; z-index:85; width:min(288px,85vw); left:0; top:0; transform:translateX(-103%); transition:transform .2s ease; box-shadow:0 8px 30px rgba(2,8,23,.3)}
    body.rail .sidebar{width:min(288px,85vw)}
    body.drawer-open .sidebar{transform:translateX(0)}
    body.rail .brand .brand-name, body.rail .nav button .label, body.rail .nav button .cnt,
    body.rail .nav .group-label, body.rail .side-link .label, body.rail .side-foot .ver,
    body.rail .collapse-btn .label{display:revert}
    body.rail .nav button, body.rail .side-link, body.rail .collapse-btn{justify-content:flex-start; padding:9px 11px}
    body.rail .side-link:hover::after, body.rail .collapse-btn:hover::after, body.rail .nav button:hover::after{content:none}
    .hamburger{display:grid}
    .token-inline{display:none}
    .token-lock{display:grid}
    .btn{padding:9px 15px}
    td .btn{min-height:40px; min-width:64px}
    .icon-btn{width:40px; height:40px}
    main{padding:0 14px 40px}
    #toast{left:14px; right:14px; bottom:14px; max-width:none}
  }
  @media (max-width:700px){ .col-opt{display:none} }
</style>
</head>
<body>
<nav class="side sidebar" id="sidebar">
  <div class="brand">
    <span class="logo" id="brandIcon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>EasyTier CF Relay</title><defs><path id="cf-cloud" d="M219,247 A38,38 0 1 1 219.5,171 A46,46 0 0 1 297.4,178.9 A34,34 0 0 1 297,247 Z"/><mask id="cloud-tone" maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512"><rect width="512" height="512" fill="#fff"/><polygon points="270,251 296,147 304,147 278,251" fill="#000"/></mask><clipPath id="cloud-light-region" clipPathUnits="userSpaceOnUse"><polygon points="270,251 296,147 340,147 340,251"/></clipPath><mask id="cloud-halo" maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512"><rect width="512" height="512" fill="#fff"/><use href="#cf-cloud" fill="#000" stroke="#000" stroke-width="12" stroke-linejoin="round"/></mask><g id="et-user"><path d="M-38,0 A38,38 0 0 1 38,0 Z" fill="none" stroke="#6699FF" stroke-width="13" stroke-linejoin="round"/><circle cx="0" cy="-46" r="20" fill="#9BC9FF" stroke="#6699FF" stroke-width="12"/></g><g id="server-unit"><rect x="-66" y="-45" width="132" height="90" rx="14" fill="#9BC9FF" stroke="#6699FF" stroke-width="12"/><line x1="-54" y1="-16" x2="54" y2="-16" stroke="#6699FF" stroke-width="7" stroke-linecap="round"/><rect x="-46" y="-36" width="52" height="16" rx="8" fill="none" stroke="#6699FF" stroke-width="7"/><circle cx="30" cy="-28" r="5.5" fill="#6699FF"/><circle cx="47" cy="-28" r="5.5" fill="#6699FF"/><rect x="-46" y="-12" width="52" height="16" rx="8" fill="none" stroke="#6699FF" stroke-width="7"/><circle cx="30" cy="-4" r="5.5" fill="#6699FF"/><circle cx="47" cy="-4" r="5.5" fill="#6699FF"/></g></defs><g id="ring"><circle cx="256" cy="256" r="224" fill="none" stroke="#6699FF" stroke-width="18"/></g><g id="links" fill="none" stroke="#6699FF" stroke-width="9" stroke-linecap="round" stroke-dasharray="18 14" stroke-opacity=".55"><path d="M140,339 L256,137 L372,339 Z"/></g><g id="nodes"><g mask="url(#cloud-halo)"><g transform="translate(256,137)"><use href="#server-unit"/></g></g><use href="#et-user" x="140" y="385"/><use href="#et-user" x="372" y="385"/></g><g mask="url(#cloud-tone)"><use href="#cf-cloud" fill="#F58220"/><use href="#cf-cloud" fill="#FBAE40" clip-path="url(#cloud-light-region)"/></g></svg>
  </span>
  <span class="brand-name">EasyTier CF Relay</span>
  </div>
  <div class="nav" id="nav">
    <div class="group-label">监控</div>
    <button class="active" data-tab="overview" data-tip="总览"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/></svg><span class="label">总览</span></button>
    <button data-tab="groups" data-tip="网络分组"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg><span class="label">网络分组</span><span class="cnt" id="c-groups">-</span></button>
    <button data-tab="peers" data-tip="节点在线"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5"/></svg><span class="label">节点在线</span><span class="cnt" id="c-peers">-</span></button>
    <button data-tab="routes" data-tip="路由信息"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8 8c6 2 6 6 8 8" stroke-dasharray="3 3"/></svg><span class="label">路由信息</span><span class="cnt" id="c-routes">-</span></button>
    <button data-tab="peercenter" data-tip="全局互联"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14 0 18-3-4-3-14.5 0-18z"/></svg><span class="label">全局互联</span><span class="cnt" id="c-pc">-</span></button>
    <button data-tab="sockets" data-tip="连接列表"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 7V4h6v3M9 17v3h6v-3M5 7h14v10H5z" stroke-linejoin="round"/></svg><span class="label">连接列表</span><span class="cnt" id="c-sockets">-</span></button>
    <div class="group-label">运维</div>
    <button data-tab="digests" data-tip="摘要注册表"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg><span class="label">摘要注册表</span><span class="cnt" id="c-digests">-</span></button>
    <button data-tab="records" data-tip="记录查询"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 4h14v16H5z" stroke-linejoin="round"/><path d="M8.5 9h7M8.5 13h7M8.5 17h4"/></svg><span class="label">记录查询</span><span class="cnt" id="c-records">-</span></button>
    <button data-tab="reccfg" data-tip="记录设置"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2.5"/><circle cx="10" cy="17" r="2.5"/></svg><span class="label">记录设置</span></button>
    <button data-tab="blacklist" data-tip="黑名单"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke-linejoin="round"/><path d="M9.5 9.5l5 5M14.5 9.5l-5 5"/></svg><span class="label">黑名单</span><span class="cnt" id="c-bl">-</span></button>
  </div>
  <div class="side-foot">
    <button class="side-link" id="openSettings" data-tip="设置">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1"/></svg>
      <span class="label">设置</span>
    </button>
    <button class="side-link" id="openHelp" data-tip="帮助">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9.6 9.2a2.5 2.5 0 1 1 3.4 2.9c-.8.4-1 .9-1 1.9"/><circle cx="12" cy="17.2" r=".6" fill="currentColor"/></svg>
      <span class="label">帮助</span>
    </button>
    <div class="ver" id="verLine">easytier-cf-relay</div>
    <button class="collapse-btn" id="collapseBtn" data-tip="收缩 / 展开侧栏">
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      <span class="label">收缩侧栏</span>
    </button>
  </div>
</nav>
<div class="drawer-mask" id="mask"></div>

<main>
  <div class="topbar">
    <h1>
      <button class="hamburger" id="hamburger" aria-label="打开导航"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
      <span id="title">总览</span>
    </h1>
    <div class="right">
      <span class="chip-auto"><input type="checkbox" checked id="auto"> <label for="auto" id="autoLabel">自动刷新 30s</label></span>
      <input class="token-inline" id="token" type="password" placeholder="管理令牌（ADMIN_TOKEN）" style="width:200px">
      <button class="btn icon-btn token-lock" id="tokenLock" title="管理令牌"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg></button>
      <button class="btn icon-btn" id="themeBtn" title="切换明暗"><span id="themeIcon"></span></button>
      <button class="btn primary" id="save">保存并加载</button>
      <button class="btn" id="refresh">刷新</button>
      <span class="status" id="status"></span>
    </div>
    <div class="token-pop" id="tokenPop">
      <input type="password" id="tokenPopInput" placeholder="管理令牌（ADMIN_TOKEN）">
      <button class="btn primary" id="tokenPopSave">保存并加载</button>
    </div>
  </div>
  <div class="chips" id="chips"></div>
  <div class="toolbar" id="toolbar"></div>
  <div id="content"></div>
  <div class="pager" id="pager"></div>
</main>

<!-- 设置弹层 -->
<div class="modal-mask" id="settingsMask">
  <div class="modal" role="dialog" aria-label="设置">
    <header><span>设置</span><button class="btn icon-btn" id="closeSettings" aria-label="关闭"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button></header>
    <div class="body">
      <div class="set-group-title">外观</div>
      <div class="set-row">
        <div class="set-label">主题<small>跟随系统时随设备明暗自动切换</small></div>
        <div class="seg" id="segTheme">
          <button data-v="light">浅色</button><button data-v="dark">深色</button><button data-v="auto">跟随系统</button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">主色<small>EasyTier 蓝 / 靛蓝 / 青绿 / 琥珀橙</small></div>
        <div class="swatches" id="swAccent">
          <button class="swatch" data-v="easytier" style="--c:#6699ff" title="EasyTier 蓝"></button>
          <button class="swatch" data-v="indigo" style="--c:#6366f1" title="靛蓝"></button>
          <button class="swatch" data-v="teal" style="--c:#0d9488" title="青绿"></button>
          <button class="swatch" data-v="amber" style="--c:#d97706" title="琥珀橙"></button>
        </div>
      </div>
      <div class="set-row">
        <div class="set-label">圆角<small>界面元素的圆角大小</small></div>
        <div class="seg" id="segRadius">
          <button data-v="compact">紧凑</button><button data-v="standard">标准</button><button data-v="round">圆润</button>
        </div>
      </div>
      <div class="set-group-title">总览板块</div>
      <div class="set-row">
        <div class="set-label">显示 / 隐藏<small>隐藏的板块不在总览页渲染</small></div>
        <div class="ov-toggles" id="ovToggles">
          <label><input type="checkbox" data-ov="trend"> 趋势图</label>
          <label><input type="checkbox" data-ov="quota"> 额度观测</label>
          <label><input type="checkbox" data-ov="server"> 服务端</label>
          <label><input type="checkbox" data-ov="stats"> 统计</label>
          <label><input type="checkbox" data-ov="groups"> 网络分组</label>
          <label><input type="checkbox" data-ov="routes"> 路由信息</label>
          <label><input type="checkbox" data-ov="peercenter"> 全局互联</label>
          <label><input type="checkbox" data-ov="sockets"> 连接列表</label>
          <label><input type="checkbox" data-ov="digests"> 摘要注册表</label>
          <label><input type="checkbox" data-ov="audit"> 审计</label>
        </div>
      </div>
      <div class="set-group-title">行为</div>
      <div class="set-row">
        <div class="set-label">自动刷新间隔<small>顶栏开关为总开关；页面不可见时暂停</small></div>
        <div class="seg" id="segRefresh">
          <button data-v="0">关闭</button><button data-v="10">10s</button><button data-v="30">30s</button><button data-v="60">60s</button><button data-v="120">120s</button>
        </div>
      </div>
    </div>
    <div class="foot">设置即时生效并保存在本浏览器（localStorage），不会写入服务端。</div>
  </div>
</div>

<!-- 帮助抽屉 -->
<div class="drawer" id="helpDrawer" role="dialog" aria-label="帮助">
  <header><span>帮助</span><button class="btn icon-btn" id="closeHelp" aria-label="关闭"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button></header>
  <div class="body">
    <h4>官方 easytier-cli 命令对照</h4>
    <div class="tablewrap">
      <table>
        <thead><tr><th>官方命令</th><th>本控制台</th></tr></thead>
        <tbody>
          <tr><td><code>peer</code></td><td>节点在线</td></tr>
          <tr><td><code>route</code></td><td>路由信息</td></tr>
          <tr><td><code>peer-center</code></td><td>全局互联</td></tr>
          <tr><td><code>stats</code></td><td>总览-统计</td></tr>
          <tr><td><code>foreign-network</code></td><td>网络分组</td></tr>
          <tr><td><code>node / status</code></td><td>总览-服务端</td></tr>
          <tr><td><code>connector</code></td><td>不适用（依赖 UDP/TUN/系统服务）</td></tr>
          <tr><td><code>mapped-listener</code></td><td>不适用</td></tr>
          <tr><td><code>stun</code></td><td>不适用</td></tr>
          <tr><td><code>vpn-portal</code></td><td>不适用</td></tr>
          <tr><td><code>proxy / acl / port-forward</code></td><td>不适用</td></tr>
          <tr><td><code>whitelist / credential / service</code></td><td>不适用</td></tr>
        </tbody>
      </table>
    </div>
    <h4>术语速查</h4>
    <div class="help-sec"><b>幽灵条目</b>节点断开后残留的路由表项。服务端用握手超时 / 空闲超时 / 主动探活 + 路由老化 / 空分组自动删除六重防线自动清理，无需手工处理。</div>
    <div class="help-sec"><b>摘要（digest）与密钥校验</b>网络密钥的 SipHash-1-3 摘要用于分组隔离；配置 NETWORK_SECRETS 后服务端校验摘要，错密钥接入被拒（4003）。</div>
    <div class="help-sec"><b>direct / transit</b>direct 是节点自报的路由（可信）；transit 是其他节点转述的（仅参考，不覆盖 direct）。来源标记见路由信息页。</div>
    <div class="help-sec"><b>额度口径</b>「额度观测」优先显示 Cloudflare 账号级真实请求数（GraphQL Analytics API，需配置只读 Token）；未配置时回退自观测估算（入站消息÷20 + 连接 + alarm 折算），仅作参考。</div>
    <div class="help-sec"><b>数据保留与打码</b>AUDIT_RETENTION_DAYS 控制记录留存天数；AUDIT_IP_MASK 开启后记录中 IP 打码展示（黑名单不受影响）。</div>
    <h4>相关链接</h4>
    <div class="help-sec"><b><a href="https://wwsta.github.io/easytier-cf-relay-web/" target="_blank" rel="noopener">介绍站点</a></b>项目主页 / wrangler.toml 配置生成器 / 文档网页版</div>
    <div class="help-sec"><b><a href="https://github.com/WWSTA/easytier-cf-relay" target="_blank" rel="noopener">GitHub 仓库</a></b>部署手册与技术文档见仓库 docs/ 目录</div>
    <h4>版本</h4>
    <div class="help-sec" id="helpVer"><b>easytier-cf-relay</b>协议对齐 easytier-core 2.6.4</div>
  </div>
</div>

<div id="toast"></div>

<script>
'use strict';
var BASE = location.pathname.replace(/\\/+$/, '');
var TAB = 'overview';
var OFFSET = 0;
var LIMIT = 50;
var GROUP_FILTER = '';
var GROUP_KEYS = null; // 分组下拉选项缓存：null=未拉取；[] 表示已拉取但房间 0 分组（与 OVERVIEW 解耦，不被侧栏刷新冲掉）
var REC_TYPE = 'all';    // 记录查询当前类型（默认"全部"，跨类型合并视图）
var BL_CAT = 'peer';       // 黑名单当前类别
var TREND_WIN = '24h';     // 趋势窗口：'24h' | '7d'
// 服务端报告"未配置"后记住状态并跳过轮询（省请求：总览自动刷新不再
// 反复打 /api/quota 与 /api/trends）；页面刷新或手动「重新检测」时重置
var QUOTA_UNCONF = false;
var TREND_UNCONF = false;
var S = null;          // 当前 tab 响应
var OVERVIEW = null;   // 最近一次 overview（侧边栏计数）
var SEL = {};          // 勾选集合：key -> row 数据

var REC_TYPE_NAMES = {
  all: '全部',
  groups: '网络分组', peers: '节点在线', routes: '路由信息', peercenter: '全局互联',
  sockets: '连接列表', digests: '摘要注册表', admin: '管理端审计（硬记录）'
};
var BL_CAT_NAMES = { peer: '节点（PeerId）', group: '网络分组（网络名）', digest: '摘要注册（网络名）', socket: '连接（客户端 IP）' };
var EVENT_LABELS = {
  join: '加入', leave: '离开', replace: '顶替重连', kick: '踢出', reject: '拒绝',
  create: '创建', delete: '删除', register: '注册',
  add: '新增', remove: '移除', open: '打开', close: '关闭', error: '异常',
  expire: '老化清除', login: '登录', view: '查看', op: '操作'
};
var REMOVE_REASONS = {
  'peer-left': '节点离开', 'reporter-gone': '上报者断开', expire: '老化清除',
  admin: '管理端删除', reconnect: '重连清理', remove: '移除'
};

function $(id){ return document.getElementById(id); }
/**
 * HTML 转义（文本 + 属性双上下文安全）。
 * 双引号一并转义为 &quot;，属性与文本两种位置均可安全使用。
 */
function esc(s){ var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML.replace(/"/g, '&quot;'); }
function fmt(t){ return t ? new Date(t).toLocaleTimeString() : '-'; }
function dur(ms){ if (ms == null) return '-'; var s = Math.floor(ms / 1000); if (s < 60) return s + 's'; if (s < 3600) return Math.floor(s / 60) + 'm' + (s % 60) + 's'; return Math.floor(s / 3600) + 'h' + Math.floor((s % 3600) / 60) + 'm'; }
function toast(msg, isErr){ var t = $('toast'); t.textContent = msg; t.className = isErr ? 'err' : ''; t.style.display = 'block'; clearTimeout(t._h); t._h = setTimeout(function(){ t.style.display = 'none'; }, 3500); }
function lsGet(k, d){ try { return localStorage.getItem(k) || d; } catch (e) { return d; } }
function lsSet(k, v){ try { localStorage.setItem(k, v); } catch (e) { /* 隐私模式忽略 */ } }
function fmtHM(t){ var d = new Date(t); return (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes(); }

function api(path, opts) {
  opts = opts || {};
  var headers = opts.headers || {};
  headers['Authorization'] = 'Bearer ' + (localStorage.getItem('et_admin_token') || '');
  return fetch(BASE + path, { method: opts.method || 'GET', headers: headers, body: opts.body })
    .then(function (r) {
      if (r.status === 404) throw new Error('鉴权失败（令牌错误或端点未启用）');
      return r.json();
    });
}
function post(path, body) {
  return api(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
}

/* ---------------- 外观（设置弹层可切换，记忆键 et_admin_*） ---------------- */
var mqDark = window.matchMedia('(prefers-color-scheme: dark)');
function resolvedTheme(raw) { return raw === 'auto' ? (mqDark.matches ? 'dark' : 'light') : raw; }
function getTheme(){ return lsGet('et_admin_theme', 'light'); }
function paintIcon(resolved) {
  $('themeIcon').innerHTML = resolved === 'dark'
    ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></svg>'
    : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a6.8 6.8 0 0 0 9.5 9.5z" stroke-linejoin="round"/></svg>';
}
function applyTheme() {
  var raw = getTheme();
  var resolved = resolvedTheme(raw);
  document.documentElement.setAttribute('data-theme', resolved);
  paintIcon(resolved);
  markSeg('segTheme', raw);
}
function applyAccent() {
  document.documentElement.setAttribute('data-accent', lsGet('et_admin_accent', 'easytier'));
  markSwatch(lsGet('et_admin_accent', 'easytier'));
}
function applyRadius() {
  document.documentElement.setAttribute('data-radius', lsGet('et_admin_radius', 'standard'));
  markSeg('segRadius', lsGet('et_admin_radius', 'standard'));
}
function getRefresh(){ return lsGet('et_admin_refresh', '30'); }
function applyRefresh() {
  markSeg('segRefresh', getRefresh());
  var v = getRefresh();
  $('autoLabel').textContent = v === '0' ? '自动刷新（已关）' : '自动刷新 ' + v + 's';
}
function markSeg(segId, v) {
  document.querySelectorAll('#' + segId + ' button').forEach(function (b) {
    b.classList.toggle('on', b.getAttribute('data-v') === v);
  });
}
function markSwatch(v) {
  document.querySelectorAll('#swAccent .swatch').forEach(function (b) {
    b.classList.toggle('on', b.getAttribute('data-v') === v);
  });
}
document.querySelectorAll('#segTheme button').forEach(function (b) {
  b.onclick = function () { lsSet('et_admin_theme', b.getAttribute('data-v')); applyTheme(); };
});
document.querySelectorAll('#segRadius button').forEach(function (b) {
  b.onclick = function () { lsSet('et_admin_radius', b.getAttribute('data-v')); applyRadius(); };
});
document.querySelectorAll('#swAccent .swatch').forEach(function (b) {
  b.onclick = function () { lsSet('et_admin_accent', b.getAttribute('data-v')); applyAccent(); };
});
document.querySelectorAll('#segRefresh button').forEach(function (b) {
  b.onclick = function () {
    var v = b.getAttribute('data-v');
    setRefresh(v); // 统一入口：写档位 + 顶栏勾联动 + 重排调度器
    toast('自动刷新间隔：' + (v === '0' ? '已关闭' : v + ' 秒'));
  };
});
$('themeBtn').onclick = function () {
  var cur = resolvedTheme(getTheme());
  lsSet('et_admin_theme', cur === 'dark' ? 'light' : 'dark');
  applyTheme();
};
mqDark.addEventListener('change', function () { if (getTheme() === 'auto') applyTheme(); });

/* ---------------- 数据加载 ---------------- */
function loadTab(keepSel) {
  var p;
  if (TAB === 'records') {
    p = api('/api/records?type=' + REC_TYPE + '&offset=' + OFFSET + '&limit=' + LIMIT);
  } else if (TAB === 'reccfg') {
    p = api('/api/record/config');
  } else if (TAB === 'blacklist') {
    p = api('/api/blacklist?cat=' + BL_CAT + '&offset=' + OFFSET + '&limit=' + LIMIT);
  } else {
    var qs = '?tab=' + TAB + '&offset=' + OFFSET + '&limit=' + LIMIT + (GROUP_FILTER ? '&groupKey=' + encodeURIComponent(GROUP_FILTER) : '');
    p = api('/api/state' + qs);
  }
  $('status').textContent = '加载中…';
  return p.then(function (s) {
    S = s;
    if (s.tab === 'overview') OVERVIEW = s;
    if (!keepSel) SEL = {}; // 翻页/切页清空勾选；自动刷新保留用户勾选
    render(s);
    $('status').textContent = '更新于 ' + new Date().toLocaleTimeString();
  }).catch(function (e) {
    $('status').textContent = e.message;
    $('content').innerHTML = '<div class="empty">' + esc(e.message) + '</div>';
    renderChips(null);
  });
}
function refreshSideCounters() {
  api('/api/state?tab=overview').then(function (o) {
    OVERVIEW = o;
    applySideCounters();
  }).catch(function () { /* 静默 */ });
}
function applySideCounters() {
  if (!OVERVIEW || !OVERVIEW.stats) return;
  var st = OVERVIEW.stats;
  $('c-groups').textContent = st.groups ? st.groups.total : '-';
  $('c-peers').textContent = st.peers ? st.peers.total : '-';
  $('c-routes').textContent = st.routes ? st.routes.total : '-';
  $('c-pc').textContent = st.peerCenter ? st.peerCenter.total : '-';
  $('c-digests').textContent = st.digests ? st.digests.total : '-';
  $('c-sockets').textContent = st.sockets ? st.sockets.total : '-';
  $('c-records').textContent = st.audit && st.audit.records ? st.audit.records._total : '-';
  $('c-bl').textContent = st.audit && st.audit.blacklist ? st.audit.blacklist._total : '-';
}

/* ---------------- 渲染 ---------------- */
var TABS = {
  overview: '总览', groups: '网络分组（foreign-network）', peers: '节点在线（peer）',
  routes: '路由信息（route）', peercenter: '全局互联（peer-center）',
  sockets: '连接列表（含未握手）', digests: '摘要注册表（网络名 → 摘要）',
  records: '记录查询（KV 审计）', reccfg: '记录设置', blacklist: '黑名单（分四类）'
};

function render(s) {
  $('title').textContent = TABS[TAB] || TAB;
  renderChips(s);
  renderToolbar(s);
  renderTable(s);
  renderPager(s);
  if (TAB === 'overview') layoutMasonry();
}

function chip(label, val, cls, title) { return '<div class="chip ' + (cls || '') + '"' + (title ? ' title="' + esc(title) + '"' : '') + '><b>' + esc(val) + '</b><span>' + esc(label) + '</span></div>'; }

var UPTIME_TITLE = '自房间（Durable Object）首次创建起累计，含休眠时间；仅 DO 存储重置时重新计时';

function renderChips(s) {
  var st = s && s.stats;
  var h = '';
  if (s && s.counters) {
    h += chip('运行时长', dur(s.uptimeSec * 1000), 'hl', UPTIME_TITLE);
  }
  // 记录 / 记录设置 / 黑名单（非 state 端点，无 stats 结构）
  if (TAB === 'records') {
    h += chip(REC_TYPE === 'all' ? '全部记录' : '该类记录', s.total, 'hl');
    if (REC_TYPE !== 'all') {
      var cnt = (OVERVIEW && OVERVIEW.stats && OVERVIEW.stats.audit && OVERVIEW.stats.audit.records) || null;
      if (cnt) h += chip('全部记录', cnt._total);
    }
    var kvOn = OVERVIEW && OVERVIEW.stats && OVERVIEW.stats.audit && OVERVIEW.stats.audit.kvEnabled;
    h += chip('KV 存储', kvOn ? '启用' : '未启用（仅 DO 存储）', kvOn ? 'good' : '');
  } else if (TAB === 'reccfg') {
    h += chip('KV 存储', s.kvEnabled ? '启用' : '未启用（仅 DO 存储）', s.kvEnabled ? 'good' : '');
    h += chip('KV 刷写间隔', s.flushMs ? dur(s.flushMs) : '-');
    h += chip('管理端审计', s.adminAudit ? '开（硬设置）' : '关（硬设置）', s.adminAudit ? 'good' : 'bad',
      '由 wrangler.toml ADMIN_AUDIT 硬设置，管理页不可修改；记录管理员登录（IP/时间）与操作（v1.3.0 起不再记录查看事件）');
  } else if (TAB === 'blacklist') {
    var bc = s.counts || {};
    h += chip('该类条目', s.total, 'hl');
    h += chip('全部黑名单', bc._total != null ? bc._total : '-');
  }
  if (!st) { $('chips').innerHTML = h; return; }
  if (TAB === 'overview') {
    h += chip('网络分组', st.groups.total, 'hl');
    h += chip('在线节点', st.peers.total, 'good');
    h += chip('路由条目', st.routes.total);
    h += chip('幽灵条目', st.routes.ghost, st.routes.ghost ? 'bad' : 'good');
    h += chip('互联条目', st.peerCenter.total);
    h += chip('摘要注册', st.digests.total);
    if (st.sockets) h += chip('当前连接', st.sockets.total);
    if (st.audit) {
      h += chip('审计记录', st.audit.records ? st.audit.records._total : '-');
      h += chip('黑名单', st.audit.blacklist ? st.audit.blacklist._total : '-',
        st.audit.blacklist && st.audit.blacklist._total ? 'bad' : 'good');
    }
  } else if (TAB === 'groups') {
    h += chip('分组总数', st.total, 'hl');
    h += chip('空分组', st.empty, st.empty ? 'bad' : 'good');
    h += chip('在线节点', st.peersTotal, 'good');
  } else if (TAB === 'peers') {
    h += chip('在线节点', st.total, 'good');
    h += chip('所属分组', st.groups);
  } else if (TAB === 'routes') {
    h += chip('条目总数', st.total, 'hl');
    h += chip('direct 自报', st.direct, 'good');
    h += chip('transit 他报', st.transit);
    h += chip('无连接', st.offline, st.offline ? '' : 'good');
    h += chip('幽灵', st.ghost, st.ghost ? 'bad' : 'good');
  } else if (TAB === 'peercenter') {
    h += chip('互联条目', st.total, 'hl');
  } else if (TAB === 'sockets') {
    h += chip('连接总数', st.total, 'hl');
    h += chip('已握手', st.handshaked, 'good');
    h += chip('待握手', st.pending, st.pending ? '' : 'good');
  } else if (TAB === 'digests') {
    h += chip('注册总数', st.total, 'hl');
  }
  $('chips').innerHTML = h;
}

/* ---------------- 工具栏（分组过滤 + 批量操作） ---------------- */
function groupOptions(sel) {
  var keys = GROUP_KEYS || [];
  var h = '<option value="">全部分组</option>';
  keys.forEach(function (k) { h += '<option value="' + esc(k) + '"' + (k === sel ? ' selected' : '') + '>' + esc(k) + '</option>'; });
  return h;
}
function ensureGroupKeys(s) {
  // 分组过滤选项：优先从当前数据行实时提取；行内没有时拉取 groups tab（limit=200）补全。
  if (s && s.items) {
    var set = {};
    s.items.forEach(function (it) { if (it.groupKey) set[it.groupKey] = 1; });
    var derived = Object.keys(set).sort();
    if (derived.length) GROUP_KEYS = derived; // 行内出现分组即以实时数据为准（新建分组后自愈）
  }
  if (!GROUP_KEYS) {
    // 一次性拉取守卫（模块级，不挂 OVERVIEW）：0 分组房间若不设守卫，每次渲染都会
    // 重新拉取 → 响应触发渲染 → 无限循环刷 /api/state（旧版遗留潜伏 bug）。
    // 此前守卫挂 OVERVIEW 上，会被 refreshSideCounters 的新对象冲掉导致每轮 tick 重复拉取。
    GROUP_KEYS = []; // 先同步占位，防同一渲染周期内并发重复拉取
    api('/api/state?tab=groups&limit=200').then(function (g) {
      GROUP_KEYS = (g.items || []).map(function (it) { return it.key; });
      renderToolbar(S);
    }).catch(function () { GROUP_KEYS = null; /* 失败允许下次渲染重试 */ });
  }
  return GROUP_KEYS || [];
}

function renderToolbar(s) {
  var h = '';
  var hasSel = Object.keys(SEL).length > 0;
  if (TAB === 'groups') {
    h += '<button class="btn danger" id="batch" ' + (hasSel ? '' : 'disabled') + '>删除选中分组（' + Object.keys(SEL).length + '）</button>';
    h += '<span class="sep"></span>';
  } else if (TAB === 'peers') {
    h += '<button class="btn danger" id="batch" ' + (hasSel ? '' : 'disabled') + '>踢出选中节点（' + Object.keys(SEL).length + '）</button>';
    h += '<span class="sep"></span>';
  } else if (TAB === 'routes') {
    h += '<button class="btn danger" id="batch" ' + (hasSel ? '' : 'disabled') + '>删除选中条目（' + Object.keys(SEL).length + '）</button>';
    h += '<span class="sep"></span>';
  } else if (TAB === 'peercenter') {
    h += '<button class="btn danger" id="batch" ' + (hasSel ? '' : 'disabled') + '>删除选中条目（' + Object.keys(SEL).length + '）</button>';
    h += '<span class="sep"></span>';
  } else if (TAB === 'sockets') {
    h += '<button class="btn danger" id="batch" ' + (hasSel ? '' : 'disabled') + '>断开选中连接（' + Object.keys(SEL).length + '）</button>';
    h += '<span class="sep"></span>';
  } else if (TAB === 'digests') {
    h += '<button class="btn danger" id="batch" ' + (hasSel ? '' : 'disabled') + '>删除选中注册（' + Object.keys(SEL).length + '）</button>';
    h += '<span class="sep"></span>';
  } else if (TAB === 'records') {
    var isAdminType = REC_TYPE === 'admin';
    h += '<label>记录类型 <select id="rectype">';
    Object.keys(REC_TYPE_NAMES).forEach(function (t) {
      h += '<option value="' + t + '"' + (t === REC_TYPE ? ' selected' : '') + '>' + REC_TYPE_NAMES[t] + '</option>';
    });
    h += '</select></label>';
    h += '<button class="btn danger" id="batch" ' + (hasSel && !isAdminType ? '' : 'disabled') + (isAdminType ? ' title="管理端审计为硬记录，不可删除"' : '') + '>删除选中记录（' + Object.keys(SEL).length + '）</button>';
    if (REC_TYPE !== 'all') {
      h += '<button class="btn" id="clearall" ' + (isAdminType ? 'disabled' : '') + '>清空该类</button>';
    }
    h += '<span class="sep"></span>';
  } else if (TAB === 'blacklist') {
    h += '<label>类别 <select id="blcat">';
    Object.keys(BL_CAT_NAMES).forEach(function (c) {
      h += '<option value="' + c + '"' + (c === BL_CAT ? ' selected' : '') + '>' + BL_CAT_NAMES[c] + '</option>';
    });
    h += '</select></label>';
    h += '<input id="blvalue" class="tin" placeholder="' + (BL_CAT === 'peer' ? 'PeerId（数字）' : (BL_CAT === 'socket' ? 'IP 地址' : '网络名')) + '">';
    h += '<input id="blreason" class="tin" placeholder="原因（可选）" style="width:130px">';
    h += '<button class="btn primary" id="bladd">加入黑名单</button>';
    h += '<button class="btn danger" id="batch" ' + (hasSel ? '' : 'disabled') + '>移除选中（' + Object.keys(SEL).length + '）</button>';
    h += '<button class="btn" id="blclear">清空该类</button>';
    h += '<span class="sep"></span>';
  } else if (TAB === 'reccfg') {
    h += '<button class="btn primary" id="reccfgsave">保存设置</button>';
    h += '<span class="sep"></span>';
  }
  if (TAB === 'peers' || TAB === 'routes' || TAB === 'peercenter') {
    ensureGroupKeys(s);
    h += '<label>分组过滤 <select id="groupsel">' + groupOptions(GROUP_FILTER) + '</select></label>';
  }
  if (TAB !== 'overview' && TAB !== 'reccfg') {
    h += '<label>每页 <select id="pagesize"><option' + (LIMIT === 20 ? ' selected' : '') + '>20</option><option' + (LIMIT === 50 ? ' selected' : '') + '>50</option><option' + (LIMIT === 100 ? ' selected' : '') + '>100</option><option' + (LIMIT === 200 ? ' selected' : '') + '>200</option></select> 条</label>';
  }
  $('toolbar').innerHTML = h;
  var batch = $('batch');
  if (batch) batch.onclick = onBatch;
  var gs = $('groupsel');
  if (gs) gs.onchange = function () { GROUP_FILTER = gs.value; OFFSET = 0; loadTab(); };
  var ps = $('pagesize');
  if (ps) ps.onchange = function () { LIMIT = Number(ps.value); OFFSET = 0; loadTab(); };
  var rt = $('rectype');
  if (rt) rt.onchange = function () { REC_TYPE = rt.value; OFFSET = 0; SEL = {}; loadTab(); };
  var ca = $('clearall');
  if (ca) ca.onclick = function () { doAction('clear-records', [{}]); };
  var bc2 = $('blcat');
  if (bc2) bc2.onchange = function () { BL_CAT = bc2.value; OFFSET = 0; SEL = {}; loadTab(); };
  var ba = $('bladd');
  if (ba) ba.onclick = onBlAdd;
  var bclr = $('blclear');
  if (bclr) bclr.onclick = function () { doAction('bl-clear', [{}]); };
  var rs = $('reccfgsave');
  if (rs) rs.onclick = onRecCfgSave;
}

/* ---------------- 表格 ---------------- */
function selBox(key, data) {
  // 记录查询：admin 为硬记录不可删——admin 类型或"全部"视图中的 admin 行禁用勾选
  var dis = TAB === 'records'
    && (REC_TYPE === 'admin' || (REC_TYPE === 'all' && data && data.type === 'admin'));
  return '<input type="checkbox" data-sel="' + esc(key) + '"' + (SEL[key] ? ' checked' : '')
    + (dis ? ' disabled title="管理端审计为硬记录，不可选择删除"' : '') + '>';
}
function rowKey(it) {
  if (TAB === 'groups') return it.key;
  if (TAB === 'peers' || TAB === 'routes') return it.groupKey + ':' + it.peerId;
  if (TAB === 'peercenter') return it.groupKey + ':' + it.myPeerId;
  if (TAB === 'sockets') return 'sock:' + it.socketId;
  if (TAB === 'digests') return it.networkName;
  if (TAB === 'records') return 'rec:' + it.id;
  if (TAB === 'blacklist') return 'bl:' + it.id;
  return '';
}
function actionBtn(label, act, payload) {
  return '<button class="btn" data-act="' + esc(act) + '" data-payload="' + esc(JSON.stringify(payload)) + '">' + esc(label) + '</button>';
}

function renderTable(s) {
  if (TAB === 'overview') { renderOverview(s); return; }
  if (TAB === 'reccfg') { renderRecCfg(s); return; }
  var items = s.items || [];
  if (!items.length) {
    $('content').innerHTML = '<div class="empty">暂无数据' + (GROUP_FILTER ? '（当前分组过滤）' : '') + '</div>';
    return;
  }
  var h = '<div class="tablewrap"><table><thead><tr>';
  h += '<th style="width:34px"><input type="checkbox" id="selall" title="全选本页"' + (TAB === 'records' && REC_TYPE === 'admin' ? ' disabled' : '') + '></th>';
  if (TAB === 'groups') h += '<th>网络名</th><th>在线节点</th><th>路由条目</th><th>互联条目</th><th>空闲时长</th><th>分组 Key</th><th>操作</th>';
  if (TAB === 'peers') h += '<th>分组</th><th>PeerId</th><th class="col-opt">连接时间</th><th>最近活动</th><th>操作</th>';
  if (TAB === 'routes') h += '<th>分组</th><th>PeerId</th><th>主机名</th><th class="col-opt">版本</th><th class="col-opt">EasyTier 版本</th><th>来源</th><th>状态</th><th>最后更新</th><th>操作</th>';
  if (TAB === 'peercenter') h += '<th>分组</th><th>上报方 PeerId</th><th>直连节点</th><th>最近上报</th><th>操作</th>';
  if (TAB === 'sockets') h += '<th>ID</th><th>PeerId</th><th>分组</th><th>已握手</th><th>客户端 IP</th><th class="col-opt">连接时间</th><th>最近活动</th><th>操作</th>';
  if (TAB === 'digests') h += '<th>网络名</th><th>摘要</th><th>分组存在</th><th>操作</th>';
  if (TAB === 'records') h += (REC_TYPE === 'all' ? '<th>类型</th>' : '') + '<th>时间</th><th>事件</th><th>明细</th>' + (REC_TYPE === 'admin' ? '' : '<th>操作</th>');
  if (TAB === 'blacklist') h += '<th>值</th><th>加入时间</th><th>原因</th><th>附加</th><th>操作</th>';
  h += '</tr></thead><tbody>';
  items.forEach(function (it) {
    var k = rowKey(it);
    h += '<tr><td class="nosel">' + selBox(k, it) + '</td>';
    if (TAB === 'groups') {
      h += '<td>' + esc(it.networkName) + '</td><td>' + it.peerCount + '</td><td>' + it.routeCount + '</td><td>' + it.peerCenterCount +
        '</td><td>' + (it.emptyForMs == null ? '-' : dur(it.emptyForMs)) + '</td><td><code>' + esc(it.key) + '</code></td>' +
        '<td>' + actionBtn('删除分组', 'del-group', { groupKey: it.key }) + '</td>';
    } else if (TAB === 'peers') {
      h += '<td>' + esc(it.networkName) + '</td><td>' + esc(it.peerId) + '</td><td class="col-opt">' + fmt(it.connectedAt) +
        '</td><td>' + fmt(it.lastSeen) + '</td>' +
        '<td>' + actionBtn('踢出', 'kick', { groupKey: it.groupKey, peerId: it.peerId }) + '</td>';
    } else if (TAB === 'routes') {
      var stTag = it.ghost ? '<span class="tag ghost">幽灵</span>'
        : (it.connected ? '<span class="tag on">在线</span>'
          : '<span class="tag off">离线</span>');
      h += '<td>' + esc(it.networkName) + '</td><td>' + esc(it.peerId) + '</td><td>' + esc(it.hostname || '-') +
        '</td><td class="col-opt">' + esc(it.version) + '</td><td class="col-opt">' + esc(it.easytierVersion || '-') +
        '</td><td><span class="tag ' + esc(it.source) + '">' + esc(it.source) + '</span></td><td>' + stTag +
        '</td><td>' + dur(it.ageMs) + ' 前</td>' +
        '<td>' + actionBtn('删除', 'del-route', { groupKey: it.groupKey, peerId: it.peerId }) + '</td>';
    } else if (TAB === 'peercenter') {
      h += '<td>' + esc(it.networkName) + '</td><td>' + esc(it.myPeerId) + '</td><td>' + esc(it.directPeerIds.join(', ') || '-') +
        '</td><td>' + fmt(it.lastSeen) + '</td>' +
        '<td>' + actionBtn('删除', 'del-pc', { groupKey: it.groupKey, peerId: it.myPeerId }) + '</td>';
    } else if (TAB === 'sockets') {
      h += '<td><code>#' + esc(it.socketId) + '</code></td><td>' + (it.peerId == null ? '-' : esc(it.peerId)) + '</td><td><code>' + esc(it.groupKey || '-') +
        '</code></td><td>' + (it.handshaked ? '是' : '否') + '</td><td>' + (it.ip ? esc(it.ip) : '-') + '</td><td class="col-opt">' + fmt(it.connectedAt) + '</td><td>' + fmt(it.lastSeen) +
        '</td><td>' + actionBtn('断开', 'close-sock', { socketId: it.socketId }) + '</td>';
    } else if (TAB === 'digests') {
      h += '<td>' + esc(it.networkName) + '</td><td><code>' + esc(String(it.digest).slice(0, 16)) + '…</code></td><td>' + (it.groupExists ? '是' : '否') +
        '</td><td>' + actionBtn('删除', 'del-digest', { networkName: it.networkName }) + '</td>';
    } else if (TAB === 'records') {
      // admin 为硬记录：该行不可勾选/删除（"全部"视图按行的 type 判定）
      var rowAdmin = REC_TYPE === 'admin' || (REC_TYPE === 'all' && it.type === 'admin');
      var ev = EVENT_LABELS[it.event] || it.event;
      if (it.count > 1) ev += ' ×' + it.count;
      if (REC_TYPE === 'all') {
        h += '<td><span class="pill info">' + esc(REC_TYPE_NAMES[it.type] || it.type) + '</span></td>';
      }
      h += '<td>' + new Date(it.ts).toLocaleString() + '</td><td>' + esc(ev) + '</td><td>' + recDetail(it) + '</td>';
      if (!rowAdmin) h += '<td>' + actionBtn('删除', 'del-record', { id: it.id }) + '</td>';
    } else if (TAB === 'blacklist') {
      h += '<td><code>' + esc(it.value) + '</code></td><td>' + new Date(it.ts).toLocaleString() + '</td><td>' + esc(it.reason || '-') + '</td><td>' +
        esc([it.groupKey, it.networkName, it.socketId != null ? 'socket #' + it.socketId : null].filter(Boolean).join(' · ') || '-') +
        '</td><td>' + actionBtn('移除', 'bl-remove-one', { id: it.id }) + '</td>';
    }
    h += '</tr>';
  });
  h += '</tbody></table></div>';
  $('content').innerHTML = h;
  var sa = $('selall');
  if (sa) sa.onclick = function () {
    if (sa.disabled) return;
    var checked = sa.checked;
    (s.items || []).forEach(function (it) {
      // "全部"视图：admin 硬记录不可选（禁用行跳过）
      if (TAB === 'records' && REC_TYPE === 'all' && it.type === 'admin') return;
      var k = rowKey(it);
      if (checked) SEL[k] = it; else delete SEL[k];
    });
    renderToolbar(s);
    // 重绘勾选态
    document.querySelectorAll('input[data-sel]').forEach(function (cb) { cb.checked = !!SEL[cb.getAttribute('data-sel')]; });
  };
}

/** 记录明细：紧凑 k=v 渲染 */
function recDetail(it) {
  var skip = { id: 1, ts: 1, event: 1, count: 1 };
  var parts = [];
  Object.keys(it).forEach(function (k) {
    if (skip[k]) return;
    var v = it[k];
    if (v == null || v === '') return;
    if (k === 'reason' && REMOVE_REASONS[v]) v = REMOVE_REASONS[v];
    if (k === 'cause' && REMOVE_REASONS[v]) v = REMOVE_REASONS[v];
    if (k === 'cause' && /^blacklist:/.test(v)) v = '黑名单拦截（' + v.slice(10) + '）';
    parts.push('<span class="muted">' + esc(k) + '</span> ' + esc(v));
  });
  return parts.length ? parts.join('<span class="muted"> · </span>') : '-';
}

/** 记录设置页 */
function renderRecCfg(s) {
  var types = s.types || {};
  var h = '<div class="card" style="max-width:860px"><h3 class="card-h" style="cursor:default"><span>各类记录开关与上限</span></h3><div class="card-b">';
  h += '<div class="muted" style="margin-bottom:10px">每类信息只占一条 KV 键；关闭后该类事件不再记录，已存记录可到「记录查询」清空。</div>';
  h += '<div class="setgrid">';
  Object.keys(REC_TYPE_NAMES).forEach(function (t) {
    if (t === 'admin' || t === 'all') return; // admin 为硬设置；all 为查询视图（非记录类型）
    var c = types[t] || {};
    var n = (s.counts && s.counts[t]) != null ? s.counts[t] : '-';
    h += '<div class="row"><span class="name">' + REC_TYPE_NAMES[t] + '</span><span class="muted">当前 ' + n + ' 条</span>' +
      '<label><input type="checkbox" data-rec-on="' + t + '"' + (c.on !== false ? ' checked' : '') + '> 启用</label>' +
      '<input type="number" min="1" max="10000" value="' + esc(c.limit || 100) + '" data-rec-limit="' + t + '"></div>';
  });
  h += '</div></div>';
  h += '<div class="card" style="max-width:860px;margin-top:14px"><h3 class="card-h" style="cursor:default"><span>管理端审计（硬设置）</span></h3><div class="card-b setgrid">';
  h += '<div class="row"><span class="name">管理端审计</span><label><input type="checkbox" checked disabled> ' + (s.adminAudit ? '开' : '关') + '</label><input type="number" value="' + esc(s.adminAuditLimit) + '" disabled><span class="hint">记录管理员登录（IP/时间，10 分钟去重）与操作；不可关闭、admin 记录不可删除；v1.3.0 起不再记录查看事件</span></div>';
  h += '<div class="row"><span class="name">KV 存储</span><span class="hint">' + (s.kvEnabled ? '已启用' : '未启用（仅 DO 存储）') + ' · 刷写间隔 ' + (s.flushMs ? dur(s.flushMs) : '-') + '（RECORD_FLUSH_MS）· 黑名单上限 ' + esc(s.blacklistLimit) + ' 条/类（硬设置）</span></div>';
  h += '</div></div>';
  $('content').innerHTML = h;
}

function onRecCfgSave() {
  var types = {};
  document.querySelectorAll('input[data-rec-on]').forEach(function (cb) {
    var t = cb.getAttribute('data-rec-on');
    types[t] = types[t] || {};
    types[t].on = cb.checked;
  });
  document.querySelectorAll('input[data-rec-limit]').forEach(function (inp) {
    var t = inp.getAttribute('data-rec-limit');
    types[t] = types[t] || {};
    var v = Number(inp.value);
    if (Number.isFinite(v) && v > 0) types[t].limit = Math.floor(v);
  });
  post('/api/record/config', { types: types }).then(function (r) {
    toast(r.ok ? '记录设置已保存' : '保存失败：' + (r.error || '未知错误'), !r.ok);
    loadTab();
    refreshSideCounters();
  }).catch(function (e) { toast('保存失败：' + e.message, true); });
}

function onBlAdd() {
  var v = ($('blvalue').value || '').trim();
  if (!v) { toast('请输入要拉黑的值', true); return; }
  var reason = ($('blreason').value || '').trim() || 'manual';
  post('/api/blacklist/add', { cat: BL_CAT, value: v, reason: reason }).then(function (r) {
    if (!r.ok) { toast('添加失败：' + (r.error || '未知错误'), true); return; }
    toast(r.existed ? '已在该类黑名单中（时间已刷新）' : '已加入黑名单');
    loadTab();
    refreshSideCounters();
  }).catch(function (e) { toast('添加失败：' + e.message, true); });
}

/* ---------------- 总览（趋势全宽固定顶部 + 其余卡瀑布流） ---------------- */
var CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6"/></svg>';
function getOvMap() { try { return JSON.parse(lsGet('et_admin_ovcards', '{}')); } catch (e) { return {}; } }

function renderOverview(s) {
  var st = s.stats || {};
  var c = s.counters || {};
  var ov = getOvMap();
  var h = '';
  // 趋势卡：全宽、固定在卡片区最上方、不参与瀑布流（et_admin_ovcards.trend===false 时不渲染）
  if (ov.trend !== false) {
    h += '<div class="card chartcard" id="card-trend">';
    h += '<h3 class="card-h" data-card="trend"><span>趋势 · ' + (TREND_WIN === '7d' ? '近 7 天' : '近 24 小时') + '（Analytics Engine）</span>' +
      '<span class="tabs" id="trend-tabs">' + trendTabsHtml() + '</span>' + CHEV + '</h3>';
    h += '<div class="card-b"><div class="chart-wrap" id="trend-body">' +
      (TREND_UNCONF ? unconfHintHtml('trend') : '<div class="chart" id="trendChart"><div class="chart-tip" id="trendTip"></div></div>') +
      '</div></div>';
    h += '</div>';
  }
  h += '<div class="masonry" id="masonry">';
  // 额度观测（v1.5 A4 自观测估算；v1.6 A6 真实额度优先——配置凭证后异步替换本卡显示）
  if (ov.quota !== false) {
    var alarmDaily = s.uptimeSec > 0 ? Math.round((c.alarmCount || 0) / s.uptimeSec * 86400) : (c.alarmCount || 0);
    var est = Math.round((c.msgsIn || 0) / 20) + (c.connsTotal || 0) + alarmDaily;
    var quota = 100000;
    var pct = Math.min(100, Math.round(est / quota * 1000) / 10);
    var pctColor = pct >= 80 ? 'var(--bad)' : pct >= 50 ? 'var(--warn)' : 'var(--ok)';
    h += '<div class="card" id="card-quota">';
    h += '<h3 class="card-h" data-card="quota"><span>额度观测（quota）</span>' + CHEV + '</h3>';
    h += '<div class="card-b">';
    h += '<div id="quota-real">' + (QUOTA_UNCONF ? unconfHintHtml('quota') : '') + '</div>';
    h += '<div id="quota-est">';
    h += kv('今日计费请求（估算）', '≈ ' + est.toLocaleString() + ' / ' + quota.toLocaleString());
    h += '<div class="bar"><i style="width:' + pct + '%;background:' + pctColor + '"></i></div>';
    h += kv('占比', pct + '%', pct >= 80 ? 'bad' : null);
    h += '</div>';
    h += '<div id="quota-cal">' + kv('口径', '自观测：入站消息÷20 + 连接建立 + alarm 折算日均', null,
      '自观测口径（降级显示）。配置 CF_ACCOUNT_ID + CF_API_TOKEN（wrangler secret put，' +
      '最小权限 Account Analytics: Read）后自动切换为真实额度（GraphQL Analytics API）。' +
      '自观测不含 Worker 入口请求、随 DO 重启归零，会低估') + '</div>';
    h += '</div></div>';
  }
  // 服务端
  if (ov.server !== false) {
    h += '<div class="card" id="card-server">';
    h += '<h3 class="card-h" data-card="server"><span>服务端（node / status）</span>' + CHEV + '</h3>';
    h += '<div class="card-b">';
    h += kv('运行时长', dur(s.uptimeSec * 1000), null, UPTIME_TITLE);
    h += kv('serverPeerId', s.serverPeerId);
    if (s.config) {
      h += kv('hostname', s.config.serverHostname);
      h += kv('版本', s.config.serverVersionStr);
      h += kv('服务端网络名', s.config.serverNetworkName, null,
        '握手响应中宣告的网络名（SERVER_NETWORK_NAME）。与客户端网络名不同即外部网络中继模式');
      h += kv('纯 P2P', s.config.avoidRelayData ? '开' : '关');
      h += kv('数据中继', s.config.relayData ? '开' : '关');
      h += kv('密钥校验', s.config.digestValidation ? '开' : '关');
      h += kv('摘要策略', s.config.strictDigest ? '不同摘要拒绝' : '不同摘要隔离', null,
        '同一网络名出现不同密钥摘要时（STRICT_DIGEST）：拒绝新摘要接入，或隔离为不同分组');
      h += kv('单房间节点数上限', s.config.maxPeersPerRoom, null,
        '同一房间（Durable Object）内允许的最大在线节点数（MAX_PEERS_PER_ROOM）');
      h += kv('单分组节点数上限', s.config.maxPeersPerGroup > 0 ? s.config.maxPeersPerGroup : '不限', null,
        '单个网络分组的在线节点数上限（MAX_PEERS_PER_GROUP，v1.5），防单网络占满房间');
      h += kv('单 IP 连接数上限', s.config.maxConnsPerIp > 0 ? s.config.maxConnsPerIp : '不限', null,
        '同一客户端 IP 的并发连接数上限（MAX_CONNS_PER_IP，v1.4.1 事前限流）');
      h += kv('消息速率上限', s.config.msgRateLimitPerSec > 0 ? s.config.msgRateLimitPerSec + '/秒' : '不限', null,
        '单连接每秒最大消息数（MSG_RATE_LIMIT_PER_SEC，v1.5），持续超限断开');
      h += kv('消息大小上限', (s.config.maxMessageBytes / 1024).toFixed(0) + ' KiB');
      h += kv('握手超时', dur(s.config.handshakeTimeoutMs));
      h += kv('空闲超时', dur(s.config.peerIdleTimeoutMs), null,
        '必须大于客户端 Ping 最大间隔 32s（PEER_IDLE_TIMEOUT_MS）');
      h += kv('探活阈值', dur(s.config.serverPingIdleMs), null,
        '空闲超过该时长服务端主动发 Ping 探测半开连接（SERVER_PING_IDLE_MS）');
      h += kv('清扫周期 / 空闲退避', dur(s.config.sweepIntervalMs) + ' / ' +
        (s.config.sweepIdleIntervalMs > 0 ? dur(s.config.sweepIdleIntervalMs) : '关闭'), null,
        'alarm 清扫周期上限（SWEEP_INTERVAL_MS）与空房间退避间隔（SWEEP_IDLE_INTERVAL_MS，v1.4.0）');
      h += kv('路由条目老化', dur(s.config.routeInfoUnreachableMs) + ' / ' + dur(s.config.routeInfoTtlMs), null,
        '斜杠前：条目未刷新且节点不可达超过该时长（1m30s = 90 秒）即删除；' +
        '斜杠后：条目未刷新超过该时长（1h1m = 61 分钟）无条件删除。活跃节点会周期性刷新，不受影响');
      h += kv('空组自动删除', s.config.groupAutoDeleteMs > 0 ? dur(s.config.groupAutoDeleteMs) : '关闭');
      // 资源滥用防线：旧实例无这些字段时跳过显示
      if (s.config.maxSyncItems != null) {
        var capTxt = function (v, unit) { return v > 0 ? v + (unit || '') : '关闭'; };
        h += kv('路由滥用防线',
          capTxt(s.config.maxSyncItems, '条/帧') + ' · ' +
          capTxt(s.config.maxRouteInfoBytes, 'B/条') + ' · ' +
          capTxt(s.config.maxRoutesPerGroup, '条/组'),
          null,
          '单帧路由条目数（MAX_SYNC_ITEMS）/ 单条字节（MAX_ROUTE_INFO_BYTES）/ 分组条目总数' +
          '（MAX_ROUTES_PER_GROUP）上限，0 = 关闭。超限整帧拒绝（4009）或丢弃条目；' +
          '三条上限自洽（条目×字节 < 消息上限），合法全量推送不受影响');
      }
    }
    h += '</div></div>';
  }
  // 统计
  if (ov.stats !== false) {
    h += '<div class="card" id="card-stats">';
    h += '<h3 class="card-h" data-card="stats"><span>统计（stats）</span>' + CHEV + '</h3>';
    h += '<div class="card-b">';
    h += kv('累计连接', c.connsTotal);
    h += kv('收包 / 发包', c.msgsIn + ' / ' + c.msgsOut);
    var bytes = (c.bytesIn || 0) + (c.bytesOut || 0);
    h += kv('流量', (bytes / 1024).toFixed(1) + ' KiB');
    h += kv('数据转发', c.forwards);
    h += kv('协议错误', c.errors);
    h += kv('伪造拦截', c.forgeries);
    h += kv('黑名单拦截', c.blRejected || 0, (c.blRejected || 0) > 0 ? 'bad' : 'good',
      'DO 层（升级/握手）黑名单拒绝次数。v1.3.0 起拒绝不再逐条写记录（防重连风暴刷爆记录列表），' +
      '改由此计数观测；边缘层（Worker 入口 KV 直读）拒绝的连接不经过 DO，不在此计数。' +
      '计数随 DO 重启归零');
    h += kv('IP 限流', c.ipLimited || 0, (c.ipLimited || 0) > 0 ? 'bad' : 'good',
      '单 IP 并发连接超限拒绝次数（MAX_CONNS_PER_IP，v1.4.1 事前限流，DO 升级层口径）。' +
      '计数随 DO 重启归零');
    h += kv('速率限流', c.rateLimited || 0, (c.rateLimited || 0) > 0 ? 'bad' : 'good',
      '单连接消息速率超限断开次数（MSG_RATE_LIMIT_PER_SEC，v1.5 事前限流）。' +
      '计数随 DO 重启归零');
    h += kv('分组限流', c.groupLimited || 0, (c.groupLimited || 0) > 0 ? 'bad' : 'good',
      '单分组节点数超限拒绝次数（MAX_PEERS_PER_GROUP，v1.5 事前限流）。' +
      '计数随 DO 重启归零');
    // 资源滥用防线：全部为内存计数，随 DO 重启归零
    h += kv('路由洪泛拦截', c.routeFlooded || 0, (c.routeFlooded || 0) > 0 ? 'bad' : 'good',
      '单帧路由条目数超限（MAX_SYNC_ITEMS）整帧拒绝并断开（4009）的次数。' +
      '非零说明有人尝试路由洪泛（免密即可发动的房间级 DoS）。计数随 DO 重启归零');
    h += kv('条目超限丢弃', (c.routeOversized || 0) + (c.routeCapped || 0),
      ((c.routeOversized || 0) + (c.routeCapped || 0)) > 0 ? 'bad' : 'good',
      '单条条目超字节上限（MAX_ROUTE_INFO_BYTES）丢弃 + 分组条目总数超限（MAX_ROUTES_PER_GROUP）拒绝的合计次数。' +
      '计数随 DO 重启归零');
    h += kv('出站超限丢弃', c.outboundDropped || 0, (c.outboundDropped || 0) > 0 ? 'bad' : 'good',
      '出站单帧超过消息大小上限（MAX_MESSAGE_BYTES）丢弃次数——出站受分组条目上限约束，' +
      '触发即说明路由状态被异常注入。计数随 DO 重启归零');
    h += kv('互联响应冷却', c.peerMapCooled || 0, (c.peerMapCooled || 0) > 0 ? 'warn' : 'good',
      'GetGlobalPeerMap 全量响应被每连接 1s 冷却拦截的次数（防小请求大响应放大）。' +
      '正常客户端仅在启动与表变化后请求全量，不受影响。计数随 DO 重启归零');
    h += kv('重推冷却', c.resyncCooled || 0, (c.resyncCooled || 0) > 0 ? 'warn' : 'good',
      '会话重置（强制全量路由重推）被每连接 1s 冷却拦截的次数（防伪造 RpcResp 反复触发全量重推）。' +
      '计数随 DO 重启归零');
    h += kv('摘要抢占嫌疑', c.squatSuspect || 0, (c.squatSuspect || 0) > 0 ? 'bad' : 'good',
      '同网络名出现不同密钥摘要的握手被拒次数（疑似抢占堵门）。' +
      '攻击源见「记录查询 → 摘要注册」中的 squat-suspect 事件（含 IP，按网络名+IP 10 分钟去重），可拉黑。' +
      '计数随 DO 重启归零');
    h += '</div></div>';
  }
  // 网络分组
  if (ov.groups !== false && st.groups) {
    h += '<div class="card" id="card-groups">';
    h += '<h3 class="card-h" data-card="groups"><span>网络分组（foreign-network）</span>' + CHEV + '</h3>';
    h += '<div class="card-b">';
    h += kv('分组总数', st.groups.total);
    h += kv('空分组', st.groups.empty);
    h += kv('在线节点', st.peers ? st.peers.total : '-');
    h += '</div></div>';
  }
  // 路由信息
  if (ov.routes !== false && st.routes) {
    h += '<div class="card" id="card-routes">';
    h += '<h3 class="card-h" data-card="routes"><span>路由信息（route）</span>' + CHEV + '</h3>';
    h += '<div class="card-b">';
    h += kv('条目总数', st.routes.total);
    h += kv('direct 自报', st.routes.direct);
    h += kv('transit 他报', st.routes.transit);
    h += kv('幽灵（待老化清除）', st.routes.ghost);
    h += '</div></div>';
  }
  // 全局互联
  if (ov.peercenter !== false && st.peerCenter) {
    h += '<div class="card" id="card-peercenter">';
    h += '<h3 class="card-h" data-card="peercenter"><span>全局互联（peer-center）</span>' + CHEV + '</h3>';
    h += '<div class="card-b">';
    h += kv('互联条目', st.peerCenter.total);
    h += '</div></div>';
  }
  // 摘要注册表
  if (ov.digests !== false && st.digests) {
    h += '<div class="card" id="card-digests">';
    h += '<h3 class="card-h" data-card="digests"><span>摘要注册表</span>' + CHEV + '</h3>';
    h += '<div class="card-b">';
    h += kv('注册总数', st.digests.total);
    h += '</div></div>';
  }
  // 连接列表
  if (ov.sockets !== false && st.sockets) {
    h += '<div class="card" id="card-sockets">';
    h += '<h3 class="card-h" data-card="sockets"><span>连接列表</span>' + CHEV + '</h3>';
    h += '<div class="card-b">';
    h += kv('当前连接', st.sockets.total);
    h += kv('已握手', st.sockets.handshaked);
    h += kv('待握手', st.sockets.pending);
    h += '</div></div>';
  }
  // 审计
  if (ov.audit !== false && st.audit) {
    h += '<div class="card" id="card-audit">';
    h += '<h3 class="card-h" data-card="audit"><span>审计（KV 记录 + 黑名单）</span>' + CHEV + '</h3>';
    h += '<div class="card-b">';
    var rc = st.audit.records || {};
    h += kv('记录总数', rc._total != null ? rc._total : '-');
    h += kv('网络分组 / 节点', (rc.groups || 0) + ' / ' + (rc.peers || 0));
    h += kv('路由 / 互联', (rc.routes || 0) + ' / ' + (rc.peercenter || 0));
    h += kv('连接 / 摘要 / 管理端', (rc.sockets || 0) + ' / ' + (rc.digests || 0) + ' / ' + (rc.admin || 0));
    var blc = st.audit.blacklist || {};
    h += kv('黑名单总数', blc._total != null ? blc._total : '-',
      blc._total ? 'bad' : 'good');
    h += kv('黑名单（节点/分组/摘要/IP）',
      (blc.peer || 0) + ' / ' + (blc.group || 0) + ' / ' + (blc.digest || 0) + ' / ' + (blc.socket || 0));
    h += kv('KV 存储', st.audit.kvEnabled ? '启用' : '未启用（仅 DO 存储）');
    h += '</div></div>';
  }
  h += '</div>';
  $('content').innerHTML = h;
  refreshQuotaCard();
  loadTrends();
  layoutMasonry();
}
function kv(k, v, cls, title) { return '<div class="kv"' + (title ? ' title="' + esc(title) + '"' : '') + '><span>' + esc(k) + '</span><b class="' + (cls || '') + '" style="' + (cls === 'bad' ? 'color:var(--bad)' : (cls === 'good' ? 'color:var(--ok)' : '')) + '">' + esc(v) + '</b></div>'; }

/* ---------------- 真实额度（v1.6 A6）---------------- */
function quotaBarHtml(pct) {
  var pctColor = pct >= 80 ? 'var(--bad)' : pct >= 50 ? 'var(--warn)' : 'var(--ok)';
  return '<div class="bar"><i style="width:' + pct + '%;background:' + pctColor + '"></i></div>';
}
/**
 * 异步拉取账号级真实额度并替换额度卡显示。
 * 三态：cloudflare（真实优先，隐藏估算块）/ unavailable（保留估算 + 失败原因）/
 * unconfigured（记住状态、跳过后续轮询，总览自动刷新不再打本接口；
 * 页面刷新或手动「重新检测」时重试）。CF_API_TOKEN 只在服务端使用，
 * 该接口返回聚合计数，浏览器侧无凭证。
 */
function refreshQuotaCard(force) {
  if (QUOTA_UNCONF && !force) return; // 已记住未配置：跳过轮询
  api('/api/quota').then(function (q) {
    var el = $('quota-real');
    if (!el || !q || q.ok !== true) return;
    if (q.source === 'unconfigured') {
      QUOTA_UNCONF = true; // 记住，后续自动刷新跳过
      el.innerHTML = unconfHintHtml('quota');
      layoutMasonry(); // 异步替换后卡片高度变化，瀑布流需重排（否则同列下方卡片遮挡）
      return;
    }
    if (q.source === 'cloudflare') {
      var quota = q.dailyQuota || 100000;
      var used = q.requests || 0;
      var pct = Math.min(100, Math.round(used / quota * 1000) / 10);
      var nowMs = Date.now();
      var reset = new Date();
      reset.setUTCHours(24, 0, 0, 0); // 下一个 UTC 0 点（免费计划额度重置时刻）
      var leftM = Math.max(0, Math.round((reset.getTime() - nowMs) / 60000));
      var age = typeof q.fetchedAt === 'number' ? Math.max(0, Math.round((nowMs - q.fetchedAt) / 60000)) : null;
      var html = kv('今日真实请求（Cloudflare 账号级）', used.toLocaleString() + ' / ' + quota.toLocaleString(), pct >= 80 ? 'bad' : null,
        '数据源：GraphQL Analytics API workersInvocationsAdaptive（脚本 ' + esc(q.scriptName || '-') + '）。' +
        '计费口径以 Cloudflare 控制台为准（WebSocket 消息按 20:1 折算）。' +
        '子请求 ' + (q.subrequests || 0).toLocaleString() + ' 次 / 错误 ' + (q.errors || 0).toLocaleString() + ' 次');
      html += quotaBarHtml(pct);
      html += kv('占比', pct + '%', pct >= 80 ? 'bad' : null);
      html += kv('距额度重置', dur(leftM * 60000) + '（UTC 0 点 / 北京 8 点）');
      if (age != null) html += kv('数据更新于', age === 0 ? '刚刚' : age + ' 分钟前' + (q.cached ? '（服务端缓存 ≤5min）' : ''));
      el.innerHTML = html;
      var estEl = $('quota-est');
      if (estEl) estEl.style.display = 'none';
      var calEl = $('quota-cal');
      if (calEl) calEl.innerHTML = kv('口径', '真实额度：Cloudflare GraphQL（Account Analytics: Read），缓存 5 分钟', null,
        '查询失败时自动回退自观测估算，不影响总览页可用性');
      layoutMasonry(); // 真实模式卡片变高，重排瀑布流
    } else if (q.source === 'unavailable') {
      el.innerHTML = kv('真实额度', '查询失败，当前显示估算', 'bad',
        '原因：' + (q.error || '未知') + '。请检查 CF_ACCOUNT_ID / CF_API_TOKEN（wrangler secret put）及其权限（Account Analytics: Read）');
      layoutMasonry();
    }
  }).catch(function () { /* 静默：保留估算显示（404 时 api 已有统一语义） */ });
}

/** 未配置提示（含手动重新检测；onclick 传参走 data-* 属性，见内联 JS 约束注释） */
function unconfHintHtml(kind) {
  var text = kind === 'trend'
    ? '未启用：未绑定 Analytics Engine 或未配置 CF 凭证（CF_ACCOUNT_ID / CF_API_TOKEN）'
    : '未配置 CF 凭证（CF_ACCOUNT_ID / CF_API_TOKEN），显示自观测估算';
  return '<div class="empty">' + esc(text) +
    '。<a href="javascript:void(0)" data-recheck="' + kind + '" onclick="unconfRecheck(this.dataset.recheck)">重新检测</a></div>';
}
function unconfRecheck(kind) {
  if (kind === 'trend') { TREND_UNCONF = false; loadTrends(true); return; }
  QUOTA_UNCONF = false;
  var el = $('quota-real');
  if (el) el.innerHTML = '<div class="empty">检测中…</div>';
  refreshQuotaCard(true);
}

/* ---------------- AE 趋势（v1.6 A5+D2，双轴 + 悬停提示，纯 SVG 零图表库）----------------
 * 注意：本文件是模板字符串，页面内联 JS 里【不能用 \\'】（模板会把转义吃成裸引号，
 * 截断字符串导致整个脚本 SyntaxError）。onclick 传参一律走 data-* 属性。 */
function trendTabsHtml() {
  return '<button class="' + (TREND_WIN === '24h' ? 'on' : '') + '" data-win="24h" onclick="setTrendWin(this.dataset.win)">近 24h</button>' +
    '<button class="' + (TREND_WIN === '7d' ? 'on' : '') + '" data-win="7d" onclick="setTrendWin(this.dataset.win)">近 7 天</button>';
}
function setTrendWin(w) {
  if (TREND_WIN === w) return;
  TREND_WIN = w;
  var tabs = $('trend-tabs');
  if (tabs) tabs.innerHTML = trendTabsHtml();
  var el = $('trend-body');
  if (el) el.innerHTML = TREND_UNCONF ? unconfHintHtml('trend') : '<div class="chart" id="trendChart"><div class="chart-tip" id="trendTip"></div></div>';
  loadTrends();
}
function loadTrends(force) {
  var el = $('trend-body');
  if (!el) return;
  if (TREND_UNCONF && !force) return; // 已记住未配置：跳过轮询
  api('/api/trends?window=' + TREND_WIN).then(drawTrends).catch(function (e) {
    var el2 = $('trend-body');
    if (el2) el2.innerHTML = '<div class="empty">趋势加载失败：' + esc(e.message) + '</div>';
  });
}
/**
 * 渲染趋势图（方案 A2 移植）：双纵轴刻度（左=在线节点、右=收包速率/min）+
 * 横轴时间刻度 + 悬停最近点吸附（引导线 + tooltip）。数据来自 /api/trends。
 */
function drawTrends(j) {
  var el = $('trend-body');
  if (!el || !j || j.ok !== true) return;
  if (j.source === 'unconfigured') {
    TREND_UNCONF = true; // 记住，后续自动刷新跳过
    el.innerHTML = unconfHintHtml('trend');
    return;
  }
  if (j.source === 'unavailable') {
    el.innerHTML = '<div class="empty">AE 查询失败：' + esc(j.error || '未知') + '</div>';
    return;
  }
  var pts = Array.isArray(j.points) ? j.points : [];
  if (pts.length === 0) {
    el.innerHTML = '<div class="empty">暂无数据（打点启用后约一个桶周期内出现；重启/换名不影响已上报数据）</div>';
    return;
  }
  window.__trendLast = j; // 缓存：趋势卡收起后重新展开时按当前宽度重绘
  var W = el.clientWidth || 600, H = 220;
  if (W <= 40) W = 600;
  var padL = 34, padR = 46, padT = 14, padB = 22;
  var t0 = pts[0].t, t1 = pts[pts.length - 1].t;
  if (t1 <= t0) t1 = t0 + 1;
  var maxPeersRaw = 1, maxRateRaw = 1;
  for (var i = 0; i < pts.length; i++) {
    if (pts[i].peers > maxPeersRaw) maxPeersRaw = pts[i].peers;
    if (pts[i].msgsPerMin > maxRateRaw) maxRateRaw = pts[i].msgsPerMin;
  }
  var maxPeers = Math.max(4, Math.ceil(maxPeersRaw / 2) * 2);       // 偶数刻度
  var maxRate = Math.max(20, Math.ceil(maxRateRaw / 10) * 10);      // 10 的倍数刻度
  var iw = W - padL - padR, ih = H - padT - padB;
  var xAt = function (i2) { return padL + i2 / (pts.length - 1) * iw; };
  var yP = function (v) { return padT + (1 - v / maxPeers) * ih; };
  var yR = function (v) { return padT + (1 - v / maxRate) * ih; };
  var fmtT = TREND_WIN === '7d'
    ? function (t) { var d = new Date(t); return (d.getMonth() + 1) + '/' + d.getDate(); }
    : fmtHM;
  var s = '';
  // 网格 + 左右轴刻度（5 段）
  for (var g = 0; g <= 5; g++) {
    var frac = g / 5;
    var y = padT + frac * ih;
    s += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y + '" stroke="var(--border)" stroke-width="1"' + (g === 0 ? '' : ' stroke-dasharray="3 4"') + '/>';
    s += '<text x="' + (padL - 6) + '" y="' + (y + 3) + '" text-anchor="end" font-size="9.5" fill="var(--dim)">' + Math.round(maxPeers * (1 - frac)) + '</text>';
    s += '<text x="' + (W - padR + 6) + '" y="' + (y + 3) + '" font-size="9.5" fill="var(--dim)">' + Math.round(maxRate * (1 - frac)) + '</text>';
  }
  // X 轴时间刻度（4 段）
  for (var tk = 0; tk <= 4; tk++) {
    var idx = Math.min(pts.length - 1, Math.round(tk / 4 * (pts.length - 1)));
    s += '<text x="' + xAt(idx) + '" y="' + (H - 7) + '" text-anchor="middle" font-size="9.5" fill="var(--dim)">' + fmtT(pts[idx].t) + '</text>';
  }
  // 轴说明
  s += '<text x="' + padL + '" y="9" font-size="9" fill="var(--dim)">节点数</text>';
  s += '<text x="' + (W - padR) + '" y="9" text-anchor="end" font-size="9" fill="var(--dim)">包/min</text>';
  // 双折线
  var lp = pts.map(function (p, i2) { return xAt(i2).toFixed(1) + ',' + yP(p.peers).toFixed(1); }).join(' ');
  var lr = pts.map(function (p, i2) { return xAt(i2).toFixed(1) + ',' + yR(p.msgsPerMin).toFixed(1); }).join(' ');
  s += '<polyline fill="none" stroke="var(--ok)" stroke-width="1.8" stroke-linejoin="round" points="' + lp + '"/>';
  s += '<polyline fill="none" stroke="var(--warn)" stroke-width="1.8" stroke-linejoin="round" points="' + lr + '"/>';
  // 悬停引导（默认隐藏）
  s += '<g id="trendGuide" style="opacity:0">'
    + '<line id="tg-line" x1="0" x2="0" y1="' + padT + '" y2="' + (padT + ih) + '" stroke="var(--dim)" stroke-dasharray="3 3"/>'
    + '<circle id="tg-p" r="3.5" fill="var(--ok)" stroke="var(--surface)" stroke-width="1.5"/>'
    + '<circle id="tg-r" r="3.5" fill="var(--warn)" stroke="var(--surface)" stroke-width="1.5"/>'
    + '</g>';
  var legend = '<div class="legend">' +
    '<span><span class="sw" style="background:var(--ok)"></span>在线节点（峰值 ' + maxPeersRaw + '）</span>' +
    '<span><span class="sw" style="background:var(--warn)"></span>收包速率（峰值 ' + maxRateRaw + '/min）</span>' +
    '<span style="margin-left:auto">每 ' + (j.bucketSec / 60) + ' 分钟一桶' + (j.cached ? ' · 服务端缓存' : '') + '</span></div>';
  el.innerHTML = '<div class="chart" id="trendChart"></div>' + legend;
  var chartBox = $('trendChart');
  // 悬停提示层必须与 svg 同批注入——innerHTML 重写容器，分两步写会清掉先建的提示层
  chartBox.innerHTML = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">' + s + '</svg><div class="chart-tip" id="trendTip"></div>';
  // 悬停最近点吸附
  chartBox.onmousemove = function (ev) {
    var rect = chartBox.getBoundingClientRect();
    var mx = ev.clientX - rect.left;
    var idx = Math.round((mx - padL) / iw * (pts.length - 1));
    idx = Math.max(0, Math.min(pts.length - 1, idx));
    var d = pts[idx];
    var x = xAt(idx);
    var guide = document.getElementById('trendGuide');
    if (!guide) return;
    guide.style.opacity = 1;
    var line = document.getElementById('tg-line');
    line.setAttribute('x1', x); line.setAttribute('x2', x);
    var cp = document.getElementById('tg-p');
    cp.setAttribute('cx', x); cp.setAttribute('cy', yP(d.peers));
    var cr = document.getElementById('tg-r');
    cr.setAttribute('cx', x); cr.setAttribute('cy', yR(d.msgsPerMin));
    var tip = document.getElementById('trendTip');
    if (!tip) return;
    tip.style.display = 'block';
    tip.innerHTML = '<b>' + fmtT(d.t) + '</b> · 在线 <b class="ok">' + d.peers + '</b> 节点 · 收包 <b class="warn">' + d.msgsPerMin + '/min</b>';
    var tw = tip.offsetWidth;
    var lx = Math.max(padL + tw / 2, Math.min(W - padR - tw / 2, x));
    tip.style.left = lx + 'px';
    tip.style.top = Math.max(2, Math.min(yP(d.peers), yR(d.msgsPerMin)) - 42) + 'px';
  };
  chartBox.onmouseleave = function () {
    var guide = document.getElementById('trendGuide');
    if (guide) guide.style.opacity = 0;
    var tip = document.getElementById('trendTip');
    if (tip) tip.style.display = 'none';
  };
}

/* ---------------- 总览瀑布流（真收起：收起后下方与后续板块自动顶上来） ---------------- */
function layoutMasonry() {
  var wrap = document.getElementById('masonry');
  if (!wrap) return;
  if (TAB !== 'overview') return; // 隐藏期间无法测量，切回时由 render 触发
  var w = wrap.clientWidth;
  if (w <= 0) return;
  var cards = [];
  wrap.querySelectorAll(':scope > .card').forEach(function (card) {
    if (!card.classList.contains('ov-hidden')) cards.push(card);
  });
  var gap = 14, minCol = 300;
  var cols = Math.max(1, Math.floor((w + gap) / (minCol + gap)));
  var cw = Math.floor((w - gap * (cols - 1)) / cols);
  var hs = [];
  for (var i = 0; i < cols; i++) hs.push(0);
  cards.forEach(function (card) {
    card.style.width = cw + 'px';
    var ci = 0;
    for (var j = 1; j < cols; j++) if (hs[j] < hs[ci]) ci = j;
    card.style.left = (ci * (cw + gap)) + 'px';
    card.style.top = hs[ci] + 'px';
    hs[ci] += card.offsetHeight + gap;
  });
  wrap.style.height = (hs.length ? Math.max.apply(null, hs) : 0) + 'px';
}
function applyOvCards() {
  // 板块显隐在 renderOverview 渲染时生效（隐藏卡不渲染）；总览激活时重渲染
  if (TAB === 'overview' && S) render(S);
}

/* ---------------- 分页 ---------------- */
function renderPager(s) {
  if (TAB === 'overview' || TAB === 'reccfg') { $('pager').innerHTML = ''; return; }
  var total = s.total || 0;
  var pages = Math.max(1, Math.ceil(total / LIMIT));
  var page = Math.floor(OFFSET / LIMIT) + 1;
  $('pager').innerHTML =
    '<span>共 ' + total + ' 条 / ' + pages + ' 页</span>' +
    '<button class="btn" id="pg-first" ' + (OFFSET > 0 ? '' : 'disabled') + '>«</button>' +
    '<button class="btn" id="pg-prev" ' + (OFFSET > 0 ? '' : 'disabled') + '>上一页</button>' +
    '<span>第 ' + page + ' / ' + pages + ' 页</span>' +
    '<button class="btn" id="pg-next" ' + (OFFSET + LIMIT < total ? '' : 'disabled') + '>下一页</button>' +
    '<button class="btn" id="pg-last" ' + (OFFSET + LIMIT < total ? '' : 'disabled') + '>»</button>';
  var go = function (o) { OFFSET = Math.max(0, o); loadTab(); };
  if (OFFSET > 0) { $('pg-first').onclick = function () { go(0); }; $('pg-prev').onclick = function () { go(OFFSET - LIMIT); }; }
  if (OFFSET + LIMIT < total) {
    $('pg-next').onclick = function () { go(OFFSET + LIMIT); };
    $('pg-last').onclick = function () { go((pages - 1) * LIMIT); };
  }
}

/* ---------------- 事件：勾选 / 单操作 / 批量 ---------------- */
document.addEventListener('change', function (e) {
  var cb = e.target.closest('input[data-sel]');
  if (!cb) return;
  var key = cb.getAttribute('data-sel');
  if (cb.checked) { if (S && S.items) { var it = S.items.find(function (x) { return rowKey(x) === key; }); if (it) SEL[key] = it; } }
  else delete SEL[key];
  renderToolbar(S);
});

document.addEventListener('click', function (e) {
  var el = e.target.closest('button[data-act]');
  if (!el || !S) return;
  var act = el.getAttribute('data-act');
  var payload = {};
  try { payload = JSON.parse(el.getAttribute('data-payload') || '{}'); } catch (err) { payload = {}; }
  doAction(act, [payload]);
});

// 总览卡片收起（事件委托：renderOverview 每 30s 重渲染后无需重绑；逐卡记忆）
document.addEventListener('click', function (e) {
  var h = e.target.closest('.card-h[data-card]');
  if (!h || e.target.closest('.tabs')) return; // 趋势卡标题上的窗口切换按钮不触发收起
  var card = h.parentElement;
  card.classList.toggle('collapsed');
  lsSet('et_admin_card_' + h.getAttribute('data-card'), card.classList.contains('collapsed') ? '1' : '0');
  if (h.getAttribute('data-card') === 'trend' && !card.classList.contains('collapsed')) {
    // 趋势卡重新展开：按当前容器宽度重绘（收起期间宽度为 0）
    drawTrends(window.__trendLast || { ok: true, points: [], bucketSec: 900 });
  }
  layoutMasonry();
});

function doAction(act, payloads) {
  var done = function (r) {
    toast(actLabel(act) + ' 完成' + (r && r.notFound && r.notFound.length ? '（部分未找到）' : ''));
    refreshSideCounters();
    loadTab();
  };
  var fail = function (err) { toast(actLabel(act) + ' 失败：' + err.message, true); loadTab(); };
  if (act === 'del-group') {
    var keys = payloads.map(function (p) { return p.groupKey; });
    if (!confirm('删除 ' + keys.length + ' 个分组？\\n将断开其全部节点连接并清除路由数据；\\n对应网络名将进入黑名单（可在「黑名单」页解除）。')) return;
    post('/api/group/delete', { groupKeys: keys }).then(done).catch(fail);
  } else if (act === 'kick') {
    if (!confirm('踢出 ' + payloads.length + ' 个节点？\\n被踢出的 PeerId 将进入黑名单（可在「黑名单」页解除）。')) return;
    post('/api/peer/kick', { peers: payloads.map(function (p) { return { groupKey: p.groupKey, peerId: p.peerId }; }) }).then(done).catch(fail);
  } else if (act === 'del-route') {
    var byGroup = {};
    payloads.forEach(function (p) { (byGroup[p.groupKey] = byGroup[p.groupKey] || []).push(p.peerId); });
    if (!confirm('删除 ' + payloads.length + ' 条路由条目？')) return;
    Promise.all(Object.keys(byGroup).map(function (gk) {
      return post('/api/route/delete', { groupKey: gk, peerIds: byGroup[gk] });
    })).then(done).catch(fail);
  } else if (act === 'del-pc') {
    var byGroup2 = {};
    payloads.forEach(function (p) { (byGroup2[p.groupKey] = byGroup2[p.groupKey] || []).push(p.peerId); });
    if (!confirm('删除 ' + payloads.length + ' 条互联条目？')) return;
    Promise.all(Object.keys(byGroup2).map(function (gk) {
      return post('/api/peercenter/delete', { groupKey: gk, peerIds: byGroup2[gk] });
    })).then(done).catch(fail);
  } else if (act === 'close-sock') {
    if (!confirm('断开 ' + payloads.length + ' 个连接？\\n已知客户端 IP 将进入黑名单（可在「黑名单」页解除）。')) return;
    post('/api/socket/close', { socketIds: payloads.map(function (p) { return p.socketId; }) }).then(done).catch(fail);
  } else if (act === 'del-digest') {
    if (!confirm('删除 ' + payloads.length + ' 条摘要注册？\\n将解除对应网络名注册并清除使用该摘要的分组；\\n对应网络名将进入黑名单（可在「黑名单」页解除）。')) return;
    post('/api/digest/delete', { networkNames: payloads.map(function (p) { return p.networkName; }) }).then(done).catch(fail);
  } else if (act === 'del-record') {
    if (!confirm('删除 ' + payloads.length + ' 条记录？')) return;
    post('/api/records/delete', { type: REC_TYPE, ids: payloads.map(function (p) { return p.id; }) }).then(done).catch(fail);
  } else if (act === 'clear-records') {
    if (!confirm('清空「' + REC_TYPE_NAMES[REC_TYPE] + '」的全部记录？')) return;
    post('/api/records/delete', { type: REC_TYPE, ids: 'all' }).then(done).catch(fail);
  } else if (act === 'bl-remove-one' || act === 'bl-remove') {
    if (!confirm('从黑名单移除 ' + payloads.length + ' 项？移除后对应节点/网络/IP 可重新接入。')) return;
    post('/api/blacklist/delete', { cat: BL_CAT, ids: payloads.map(function (p) { return p.id; }) }).then(done).catch(fail);
  } else if (act === 'bl-clear') {
    if (!confirm('清空「' + BL_CAT_NAMES[BL_CAT] + '」类黑名单？')) return;
    post('/api/blacklist/delete', { cat: BL_CAT, ids: 'all' }).then(done).catch(fail);
  }
}
function actLabel(act) {
  return {
    'del-group': '删除分组', 'kick': '踢出节点', 'del-route': '删除路由条目', 'del-pc': '删除互联条目',
    'close-sock': '断开连接', 'del-digest': '删除摘要注册', 'del-record': '删除记录', 'clear-records': '清空记录',
    'bl-remove': '移除黑名单', 'bl-remove-one': '移除黑名单', 'bl-clear': '清空黑名单', 'bl-add': '加入黑名单',
    'save-reccfg': '保存记录设置'
  }[act] || '操作';
}

function onBatch() {
  var payloads = Object.keys(SEL).map(function (k) { return SEL[k]; });
  if (!payloads.length) return;
  // 统一转化为对应 action 的 payload 列表
  if (TAB === 'groups') doAction('del-group', payloads.map(function (it) { return { groupKey: it.key }; }));
  else if (TAB === 'peers') doAction('kick', payloads);
  else if (TAB === 'routes') doAction('del-route', payloads);
  else if (TAB === 'peercenter') doAction('del-pc', payloads);
  else if (TAB === 'sockets') doAction('close-sock', payloads);
  else if (TAB === 'digests') doAction('del-digest', payloads);
  else if (TAB === 'records') doAction('del-record', payloads);
  else if (TAB === 'blacklist') doAction('bl-remove', payloads);
}

/* ---------------- 设置 / 帮助 弹层与抽屉 ---------------- */
function openSettings() {
  $('settingsMask').classList.add('open');
  syncSettingsUI(); // 打开时按存储回填全部选中态（含总览板块勾选）
}
function syncSettingsUI() {
  var map = getOvMap();
  document.querySelectorAll('#ovToggles input').forEach(function (cb) {
    cb.checked = map[cb.getAttribute('data-ov')] !== false;
  });
  markSeg('segTheme', getTheme());
  markSwatch(lsGet('et_admin_accent', 'easytier'));
  markSeg('segRadius', lsGet('et_admin_radius', 'standard'));
  markSeg('segRefresh', getRefresh());
}
function closeSettings() { $('settingsMask').classList.remove('open'); }
function openHelp() {
  $('helpDrawer').classList.add('open'); $('mask').classList.add('open');
  var v = (OVERVIEW && OVERVIEW.config && OVERVIEW.config.serverVersionStr) || '';
  var el = $('helpVer');
  if (el && v) el.innerHTML = '<b>' + esc(v) + '</b>协议对齐 easytier-core 2.6.4';
}
function closeHelp() { $('helpDrawer').classList.remove('open'); $('mask').classList.remove('open'); }
$('openSettings').onclick = openSettings;
$('closeSettings').onclick = closeSettings;
$('settingsMask').onclick = function (e) { if (e.target === $('settingsMask')) closeSettings(); };
$('openHelp').onclick = openHelp;
$('closeHelp').onclick = closeHelp;
$('mask').onclick = function () {
  closeHelp();
  document.body.classList.remove('drawer-open');
};
document.querySelectorAll('#ovToggles input').forEach(function (cb) {
  cb.onchange = function () {
    var map = getOvMap();
    map[cb.getAttribute('data-ov')] = cb.checked;
    lsSet('et_admin_ovcards', JSON.stringify(map));
    applyOvCards();
  };
});

/* ---------------- 侧栏：收缩（桌面）/ 抽屉（手机） ---------------- */
function isMobile() { return window.matchMedia('(max-width: 920px)').matches; }
function applyRail(rail) {
  document.body.classList.toggle('rail', rail);
  document.querySelector('#collapseBtn .label').textContent = rail ? '展开侧栏' : '收缩侧栏';
  lsSet('et_admin_sidebar', rail ? '1' : '0');
  layoutMasonry();
}
applyRail(lsGet('et_admin_sidebar', '0') === '1');
$('collapseBtn').onclick = function () {
  if (isMobile()) document.body.classList.toggle('drawer-open');
  else applyRail(!document.body.classList.contains('rail'));
};
$('hamburger').onclick = function () { document.body.classList.add('drawer-open'); $('mask').classList.add('open'); };

/* ---------------- token（桌面内联 / 手机锁形弹层） ---------------- */
$('tokenLock').onclick = function () {
  var pop = $('tokenPop');
  pop.classList.toggle('open');
  if (pop.classList.contains('open')) $('tokenPopInput').focus();
};
function saveTokenFrom(v) {
  // 初始化会把输入框预填为圆点（表示"已保存"）；此时直接点保存应沿用已存令牌，
  // 而不是把圆点存进去（圆点是非 ISO-8859-1 字符，会导致后续 fetch 全部失败）
  if ((v || '').trim() === '••••••••') v = localStorage.getItem('et_admin_token') || '';
  localStorage.setItem('et_admin_token', (v || '').trim());
  OVERVIEW = null;
  QUOTA_UNCONF = false; TREND_UNCONF = false; // 新会话重新检测额度/趋势
  loadTab().then(refreshSideCounters);
}
$('save').onclick = function () { saveTokenFrom($('token').value); };
$('tokenPopSave').onclick = function () {
  $('tokenPop').classList.remove('open');
  saveTokenFrom($('tokenPopInput').value);
};
$('refresh').onclick = function () { loadTab(); refreshSideCounters(); };

/* ---------------- 导航 ---------------- */
document.querySelectorAll('.side button[data-tab]').forEach(function (b) {
  b.onclick = function () {
    document.querySelectorAll('.side button[data-tab]').forEach(function (x) { x.classList.remove('active'); });
    b.classList.add('active');
    TAB = b.getAttribute('data-tab');
    OFFSET = 0;
    SEL = {};
    if (isMobile()) document.body.classList.remove('drawer-open');
    loadTab();
  };
});

/* ---------------- 自动刷新（间隔可配置；页面不可见暂停） ---------------- */
function refreshIntervalMs() { var v = Number(getRefresh()); return Number.isFinite(v) && v > 0 ? v * 1000 : 0; }
// 单一 setInterval 调度器：任何时机重启都先 stopAuto 清掉旧定时器，保证全页只有一条定时链。
// （旧版递归 setTimeout 链在反复切档/切可见性后会并存多条链，同一秒倍发请求）
function stopAuto() { if (window.__autoTimer) { clearInterval(window.__autoTimer); window.__autoTimer = null; } }
function startAuto() {
  stopAuto();
  if (!$('auto').checked) return; // 顶栏总开关是主开关
  var ms = refreshIntervalMs();
  if (!(ms > 0)) return; // 间隔为 0（关闭）时不启动
  window.__autoTimer = setInterval(function () {
    // 页面不可见时本轮跳过（不清定时器，恢复可见后按原节奏继续）
    if (document.visibilityState !== 'visible') return;
    // 自动刷新保留勾选；记录设置页不自动刷新（避免覆盖未保存的编辑）
    if (TAB !== 'reccfg') loadTab(true);
    if (TAB !== 'overview') refreshSideCounters();
  }, ms);
}
/* 顶栏勾 = 快捷开关，与设置弹层「刷新间隔」双向联动：
   取消勾选 → 档位置为「关闭」（关闭前的秒数记入 et_admin_refresh_prev）；
   重新勾选 → 恢复上次非零档（无记忆则 30s）；设置里选「关闭」→ 勾自动取消，
   选非零档 → 勾自动勾上。 */
function getRefreshPrev() {
  var v = Number(lsGet('et_admin_refresh_prev', '30'));
  return Number.isFinite(v) && v > 0 ? String(v) : '30';
}
function setRefresh(v) {
  v = String(v);
  lsSet('et_admin_refresh', v);
  if (Number(v) > 0) lsSet('et_admin_refresh_prev', v); // 记住最近非零档，供顶栏勾恢复
  $('auto').checked = Number(v) > 0;
  applyRefresh();
  startAuto();
}
function onAutoToggle() {
  if ($('auto').checked) {
    setRefresh(getRefreshPrev()); // 勾上：恢复关闭前的档位
  } else {
    var cur = Number(getRefresh());
    if (cur > 0) lsSet('et_admin_refresh_prev', String(cur)); // 关闭前先记住当前档
    setRefresh('0');
  }
}
$('auto').onchange = onAutoToggle;

/* ---------------- 初始化 ---------------- */
(function () {
  // favicon：由品牌区真实图标 SVG 生成
  var svg = document.querySelector('#brandIcon svg');
  if (svg) {
    var clone = svg.cloneNode(true);
    clone.setAttribute('width', '512'); clone.setAttribute('height', '512');
    var link = document.createElement('link');
    link.rel = 'icon'; link.type = 'image/svg+xml';
    link.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
    document.head.appendChild(link);
  }
})();
if (localStorage.getItem('et_admin_token')) { $('token').value = '••••••••'; }
window.addEventListener('resize', function () { layoutMasonry(); drawTrends(window.__trendLast); });
applyTheme();
applyAccent();
applyRadius();
applyRefresh();
$('auto').checked = Number(getRefresh()) > 0; // 存储为 0（设置「关闭」）时顶栏勾取消，保持一致
applyOvCards(); // 同步设置弹层开关态（板块显隐在渲染时生效）
loadTab().then(refreshSideCounters);
startAuto();
</script>
</body>
</html>`;
