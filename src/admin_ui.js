/**
 * Web 管理端单页应用（内嵌 HTML，无外部依赖）。
 *
 * 由 Worker 入口在 ADMIN_PATH 提供页面壳（页面本身不含数据，无需鉴权）；
 * 所有数据操作经 /api/* 以 Authorization: Bearer <ADMIN_TOKEN> 鉴权。
 *
 * 设计要点（防止节点多时页面爆炸）：
 * - 侧边栏列表式导航，按功能块（tab）分区；
 * - 服务端分页（?tab=&offset=&limit=，limit 上限 200），列表区独立滚动；
 * - 每个功能块头部有独立统计（总数 / 直连 / 中转 / 幽灵等）；
 * - 每个功能块支持批量操作（勾选 + 批量按钮）；
 * - 自动刷新仅拉取当前 tab，开销可控。
 * 官方 easytier-cli 命令对照见「总览」底部。
 */
export const ADMIN_HTML = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>EasyTier CF Relay 控制台</title>
<style>
  :root{color-scheme:dark;--bg:#0f172a;--panel:#1e293b;--panel2:#16213a;--line:#334155;--fg:#e2e8f0;--muted:#94a3b8;--dim:#64748b;--accent:#0ea5e9;--ok:#34d399;--warn:#f59e0b;--bad:#f87171}
  *{box-sizing:border-box}
  body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif;background:var(--bg);color:var(--fg);margin:0;display:flex;min-height:100vh}
  a{color:#7dd3fc}
  .layout{display:flex;width:100%}
  /* 侧边栏（列表式功能导航） */
  .side{width:190px;flex:none;background:var(--panel2);border-right:1px solid var(--line);padding:14px 0;display:flex;flex-direction:column;gap:2px}
  .side .brand{padding:0 16px 12px;font-weight:700;font-size:14px;line-height:1.3}
  .side .brand small{display:block;color:var(--dim);font-weight:400;font-size:11px;margin-top:2px}
  .side button{display:flex;align-items:center;justify-content:space-between;background:none;border:none;color:var(--fg);font-size:13px;padding:9px 16px;cursor:pointer;text-align:left;border-left:2px solid transparent}
  .side button:hover{background:rgba(255,255,255,.04)}
  .side button.active{background:rgba(14,165,233,.12);border-left-color:var(--accent);color:#7dd3fc}
  .side .cnt{background:var(--line);border-radius:9px;font-size:11px;padding:0 7px;color:var(--muted);min-width:20px;text-align:center}
  .side .foot{margin-top:auto;padding:10px 16px;color:var(--dim);font-size:11px}
  /* 主区 */
  .main{flex:1;min-width:0;padding:18px 22px;display:flex;flex-direction:column;gap:12px}
  /* 顶栏 */
  .top{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .top h1{font-size:17px;margin:0 auto 0 0}
  .top input{background:var(--bg);border:1px solid var(--line);color:var(--fg);border-radius:6px;padding:6px 10px;width:230px}
  .status{color:var(--dim);font-size:12px;min-width:80px}
  button.act{background:var(--accent);border:none;color:#fff;border-radius:6px;padding:6px 12px;cursor:pointer;font-size:12px}
  button.act:disabled{opacity:.45;cursor:not-allowed}
  button.danger{background:#b91c1c}
  button.ghost{background:var(--line);color:var(--fg)}
  /* 统计片 */
  .chips{display:flex;gap:8px;flex-wrap:wrap}
  .chip{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:8px 12px;font-size:12px;color:var(--muted);display:flex;gap:6px;align-items:baseline}
  .chip b{font-size:16px;color:var(--fg);font-variant-numeric:tabular-nums}
  .chip.hl b{color:#7dd3fc}
  .chip.bad b{color:var(--bad)}
  .chip.good b{color:var(--ok)}
  /* 工具栏 */
  .toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .toolbar .sep{flex:1}
  .toolbar select{background:var(--bg);border:1px solid var(--line);color:var(--fg);border-radius:6px;padding:5px 8px;font-size:12px}
  .toolbar label{font-size:12px;color:var(--muted);display:flex;gap:4px;align-items:center}
  /* 列表（独立滚动 + 固定表头） */
  .listwrap{background:var(--panel);border:1px solid var(--line);border-radius:10px;flex:1;min-height:200px;max-height:calc(100vh - 320px);overflow:auto}
  table{width:100%;border-collapse:collapse;font-size:12.5px}
  thead th{position:sticky;top:0;background:var(--panel2);color:var(--muted);font-weight:500;text-align:left;padding:8px 10px;border-bottom:1px solid var(--line);white-space:nowrap;z-index:1}
  td{padding:7px 10px;border-bottom:1px solid rgba(51,65,85,.5);white-space:nowrap;vertical-align:middle}
  tbody tr:hover{background:rgba(255,255,255,.03)}
  td code{background:var(--bg);padding:1px 5px;border-radius:4px;font-size:11px}
  .tag{display:inline-block;border-radius:4px;padding:0 6px;font-size:11px}
  .tag.direct{background:#065f46;color:#a7f3d0}
  .tag.transit{background:#7c2d12;color:#fed7aa}
  .tag.on{background:#065f46;color:#a7f3d0}
  .tag.off{background:#374151;color:#cbd5e1}
  .tag.ghost{background:#7f1d1d;color:#fecaca}
  .muted{color:var(--dim);font-size:12px}
  .empty{padding:28px;text-align:center;color:var(--dim)}
  /* 分页 */
  .pager{display:flex;gap:8px;align-items:center;justify-content:flex-end;font-size:12px;color:var(--muted)}
  .pager button{background:var(--line);border:none;color:var(--fg);border-radius:6px;padding:4px 10px;cursor:pointer;font-size:12px}
  .pager button:disabled{opacity:.4;cursor:not-allowed}
  /* 总览卡片 */
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}
  .card{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px 14px}
  .card h3{margin:0 0 8px;font-size:13px;color:#7dd3fc}
  .kv{display:flex;justify-content:space-between;font-size:12.5px;padding:3px 0;color:var(--muted)}
  .kv b{color:var(--fg);font-weight:500;font-variant-numeric:tabular-nums}
  .nosel{user-select:none}
  #toast{position:fixed;right:18px;bottom:18px;background:var(--panel2);border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:8px;padding:10px 14px;font-size:12.5px;max-width:420px;display:none;z-index:9}
  #toast.err{border-left-color:var(--bad)}
</style>
</head>
<body>
<div class="layout">
<nav class="side">
  <div class="brand">EasyTier CF Relay<small>管理控制台</small></div>
  <button data-tab="overview" class="active">总览</button>
  <button data-tab="groups">网络分组 <span class="cnt" id="c-groups">-</span></button>
  <button data-tab="peers">节点在线 <span class="cnt" id="c-peers">-</span></button>
  <button data-tab="routes">路由信息 <span class="cnt" id="c-routes">-</span></button>
  <button data-tab="peercenter">全局互联 <span class="cnt" id="c-pc">-</span></button>
  <button data-tab="sockets">连接列表 <span class="cnt" id="c-sockets">-</span></button>
  <button data-tab="digests">摘要注册表 <span class="cnt" id="c-digests">-</span></button>
  <div class="foot">官方 easytier-cli 命令对照见「总览」页底</div>
</nav>
<div class="main">
  <div class="top">
    <h1 id="title">总览</h1>
    <input id="token" type="password" placeholder="管理令牌（ADMIN_TOKEN）" style="width:220px">
    <button class="act" id="save">保存并加载</button>
    <button class="act ghost" id="refresh">刷新</button>
    <label class="nosel" style="font-size:12px;color:var(--muted)"><input type="checkbox" id="auto" checked> 自动刷新(10s)</label>
    <span class="status" id="status"></span>
  </div>
  <div class="chips" id="chips"></div>
  <div class="toolbar" id="toolbar"></div>
  <div class="listwrap"><div id="content"></div></div>
  <div class="pager" id="pager"></div>
  <div id="content2"></div>
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
var S = null;          // 当前 tab 响应
var OVERVIEW = null;   // 最近一次 overview（侧边栏计数）
var SEL = {};          // 勾选集合：key -> row 数据

function $(id){ return document.getElementById(id); }
function esc(s){ var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }
function fmt(t){ return t ? new Date(t).toLocaleTimeString() : '-'; }
function dur(ms){ if (ms == null) return '-'; var s = Math.floor(ms / 1000); if (s < 60) return s + 's'; if (s < 3600) return Math.floor(s / 60) + 'm' + (s % 60) + 's'; return Math.floor(s / 3600) + 'h' + Math.floor((s % 3600) / 60) + 'm'; }
function toast(msg, isErr){ var t = $('toast'); t.textContent = msg; t.className = isErr ? 'err' : ''; t.style.display = 'block'; clearTimeout(t._h); t._h = setTimeout(function(){ t.style.display = 'none'; }, 3500); }

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

/* ---------------- 数据加载 ---------------- */
function loadTab(keepSel) {
  var qs = '?tab=' + TAB + '&offset=' + OFFSET + '&limit=' + LIMIT + (GROUP_FILTER ? '&groupKey=' + encodeURIComponent(GROUP_FILTER) : '');
  $('status').textContent = '加载中…';
  return api('/api/state' + qs).then(function (s) {
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
}

/* ---------------- 渲染 ---------------- */
var TABS = {
  overview: '总览', groups: '网络分组（foreign-network）', peers: '节点在线（peer）',
  routes: '路由信息（route）', peercenter: '全局互联（peer-center）',
  sockets: '连接列表（含未握手）', digests: '摘要注册表（网络名 → 摘要）'
};

function render(s) {
  $('title').textContent = TABS[TAB] || TAB;
  renderChips(s);
  renderToolbar(s);
  renderTable(s);
  renderPager(s);
}

function chip(label, val, cls) { return '<div class="chip ' + (cls || '') + '"><b>' + esc(val) + '</b><span>' + esc(label) + '</span></div>'; }

function renderChips(s) {
  var st = s && s.stats;
  var h = '';
  if (s && s.counters) {
    h += chip('运行时长', dur(s.uptimeSec * 1000), 'hl');
  }
  if (!st) { $('chips').innerHTML = h; return; }
  if (TAB === 'overview') {
    h += chip('网络分组', st.groups.total, 'hl');
    h += chip('在线节点', st.peers.total, 'good');
    h += chip('路由条目', st.routes.total);
    h += chip('幽灵条目', st.routes.ghost, st.routes.ghost ? 'bad' : 'good');
    h += chip('互联条目', st.peerCenter.total);
    h += chip('摘要注册', st.digests.total);
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
  var keys = (OVERVIEW && OVERVIEW._groupKeys) || [];
  var h = '<option value="">全部分组</option>';
  keys.forEach(function (k) { h += '<option value="' + esc(k) + '"' + (k === sel ? ' selected' : '') + '>' + esc(k) + '</option>'; });
  return h;
}
function ensureGroupKeys(s) {
  // 分组过滤选项：优先从已缓存 overview/_groupKeys 或当前数据行提取；
  // 缺失时后台拉取 groups tab（limit=200）补全后重绘工具栏。
  if (OVERVIEW && !OVERVIEW._groupKeys && s && s.items) {
    var set = {};
    s.items.forEach(function (it) { if (it.groupKey) set[it.groupKey] = 1; });
    OVERVIEW._groupKeys = Object.keys(set).sort();
  }
  if (!(OVERVIEW && OVERVIEW._groupKeys && OVERVIEW._groupKeys.length)) {
    api('/api/state?tab=groups&limit=200').then(function (g) {
      if (!OVERVIEW) OVERVIEW = {};
      OVERVIEW._groupKeys = (g.items || []).map(function (it) { return it.key; });
      renderToolbar(S);
    }).catch(function () { /* 静默 */ });
  }
  return OVERVIEW && OVERVIEW._groupKeys || [];
}

function renderToolbar(s) {
  var h = '';
  var hasSel = Object.keys(SEL).length > 0;
  if (TAB === 'groups') {
    h += '<button class="act danger" id="batch" ' + (hasSel ? '' : 'disabled') + '>删除选中分组（' + Object.keys(SEL).length + '）</button>';
    h += '<span class="sep"></span>';
  } else if (TAB === 'peers') {
    h += '<button class="act danger" id="batch" ' + (hasSel ? '' : 'disabled') + '>踢出选中节点（' + Object.keys(SEL).length + '）</button>';
    h += '<span class="sep"></span>';
  } else if (TAB === 'routes') {
    h += '<button class="act danger" id="batch" ' + (hasSel ? '' : 'disabled') + '>删除选中条目（' + Object.keys(SEL).length + '）</button>';
    h += '<span class="sep"></span>';
  } else if (TAB === 'peercenter') {
    h += '<button class="act danger" id="batch" ' + (hasSel ? '' : 'disabled') + '>删除选中条目（' + Object.keys(SEL).length + '）</button>';
    h += '<span class="sep"></span>';
  } else if (TAB === 'sockets') {
    h += '<button class="act danger" id="batch" ' + (hasSel ? '' : 'disabled') + '>断开选中连接（' + Object.keys(SEL).length + '）</button>';
    h += '<span class="sep"></span>';
  } else if (TAB === 'digests') {
    h += '<button class="act danger" id="batch" ' + (hasSel ? '' : 'disabled') + '>删除选中注册（' + Object.keys(SEL).length + '）</button>';
    h += '<span class="sep"></span>';
  }
  if (TAB === 'peers' || TAB === 'routes' || TAB === 'peercenter') {
    ensureGroupKeys(s);
    h += '<label>分组过滤 <select id="groupsel">' + groupOptions(GROUP_FILTER) + '</select></label>';
  }
  if (TAB !== 'overview') {
    h += '<label>每页 <select id="pagesize"><option' + (LIMIT === 20 ? ' selected' : '') + '>20</option><option' + (LIMIT === 50 ? ' selected' : '') + '>50</option><option' + (LIMIT === 100 ? ' selected' : '') + '>100</option><option' + (LIMIT === 200 ? ' selected' : '') + '>200</option></select> 条</label>';
  }
  $('toolbar').innerHTML = h;
  var batch = $('batch');
  if (batch) batch.onclick = onBatch;
  var gs = $('groupsel');
  if (gs) gs.onchange = function () { GROUP_FILTER = gs.value; OFFSET = 0; loadTab(); };
  var ps = $('pagesize');
  if (ps) ps.onchange = function () { LIMIT = Number(ps.value); OFFSET = 0; loadTab(); };
}

/* ---------------- 表格 ---------------- */
function selBox(key, data) {
  return '<input type="checkbox" data-sel="' + esc(key) + '"' + (SEL[key] ? ' checked' : '') + '>';
}
function rowKey(it) {
  if (TAB === 'groups') return it.key;
  if (TAB === 'peers' || TAB === 'routes') return it.groupKey + ':' + it.peerId;
  if (TAB === 'peercenter') return it.groupKey + ':' + it.myPeerId;
  if (TAB === 'sockets') return 'sock:' + it.socketId;
  if (TAB === 'digests') return it.networkName;
  return '';
}
function actionBtn(label, act, payload) {
  return '<button class="act ghost" data-act="' + esc(act) + '" data-payload="' + esc(JSON.stringify(payload)) + '">' + esc(label) + '</button>';
}

function renderTable(s) {
  if (TAB === 'overview') { renderOverview(s); return; }
  var items = s.items || [];
  if (!items.length) {
    $('content').innerHTML = '<div class="empty">暂无数据' + (GROUP_FILTER ? '（当前分组过滤）' : '') + '</div>';
    return;
  }
  var h = '<table><thead><tr>';
  if (TAB !== 'overview') h += '<th style="width:28px"><input type="checkbox" id="selall" title="全选本页"></th>';
  if (TAB === 'groups') h += '<th>网络名</th><th>在线节点</th><th>路由条目</th><th>互联条目</th><th>空闲时长</th><th>分组 Key</th><th>操作</th>';
  if (TAB === 'peers') h += '<th>分组</th><th>PeerId</th><th>连接时间</th><th>最近活动</th><th>操作</th>';
  if (TAB === 'routes') h += '<th>分组</th><th>PeerId</th><th>主机名</th><th>版本</th><th>EasyTier 版本</th><th>来源</th><th>状态</th><th>最后更新</th><th>操作</th>';
  if (TAB === 'peercenter') h += '<th>分组</th><th>上报方 PeerId</th><th>直连节点</th><th>最近上报</th><th>操作</th>';
  if (TAB === 'sockets') h += '<th>ID</th><th>PeerId</th><th>分组</th><th>已握手</th><th>连接时间</th><th>最近活动</th><th>操作</th>';
  if (TAB === 'digests') h += '<th>网络名</th><th>摘要</th><th>分组存在</th><th>操作</th>';
  h += '</tr></thead><tbody>';
  items.forEach(function (it) {
    var k = rowKey(it);
    h += '<tr><td class="nosel">' + selBox(k, it) + '</td>';
    if (TAB === 'groups') {
      h += '<td>' + esc(it.networkName) + '</td><td>' + it.peerCount + '</td><td>' + it.routeCount + '</td><td>' + it.peerCenterCount +
        '</td><td>' + (it.emptyForMs == null ? '-' : dur(it.emptyForMs)) + '</td><td><code>' + esc(it.key) + '</code></td>' +
        '<td>' + actionBtn('删除分组', 'del-group', { groupKey: it.key }) + '</td>';
    } else if (TAB === 'peers') {
      h += '<td>' + esc(it.networkName) + '</td><td>' + esc(it.peerId) + '</td><td>' + fmt(it.connectedAt) +
        '</td><td>' + fmt(it.lastSeen) + '</td>' +
        '<td>' + actionBtn('踢出', 'kick', { groupKey: it.groupKey, peerId: it.peerId }) + '</td>';
    } else if (TAB === 'routes') {
      var stTag = it.ghost ? '<span class="tag ghost">幽灵</span>'
        : (it.connected ? '<span class="tag on">在线</span>'
          : '<span class="tag off">离线</span>');
      h += '<td>' + esc(it.networkName) + '</td><td>' + esc(it.peerId) + '</td><td>' + esc(it.hostname || '-') +
        '</td><td>' + esc(it.version) + '</td><td>' + esc(it.easytierVersion || '-') +
        '</td><td><span class="tag ' + esc(it.source) + '">' + esc(it.source) + '</span></td><td>' + stTag +
        '</td><td>' + dur(it.ageMs) + ' 前</td>' +
        '<td>' + actionBtn('删除', 'del-route', { groupKey: it.groupKey, peerId: it.peerId }) + '</td>';
    } else if (TAB === 'peercenter') {
      h += '<td>' + esc(it.networkName) + '</td><td>' + esc(it.myPeerId) + '</td><td>' + esc(it.directPeerIds.join(', ') || '-') +
        '</td><td>' + fmt(it.lastSeen) + '</td>' +
        '<td>' + actionBtn('删除', 'del-pc', { groupKey: it.groupKey, peerId: it.myPeerId }) + '</td>';
    } else if (TAB === 'sockets') {
      h += '<td><code>#' + esc(it.socketId) + '</code></td><td>' + (it.peerId == null ? '-' : esc(it.peerId)) + '</td><td><code>' + esc(it.groupKey || '-') +
        '</code></td><td>' + (it.handshaked ? '是' : '否') + '</td><td>' + fmt(it.connectedAt) + '</td><td>' + fmt(it.lastSeen) +
        '</td><td>' + actionBtn('断开', 'close-sock', { socketId: it.socketId }) + '</td>';
    } else if (TAB === 'digests') {
      h += '<td>' + esc(it.networkName) + '</td><td><code>' + esc(String(it.digest).slice(0, 16)) + '…</code></td><td>' + (it.groupExists ? '是' : '否') +
        '</td><td>' + actionBtn('删除', 'del-digest', { networkName: it.networkName }) + '</td>';
    }
    h += '</tr>';
  });
  h += '</tbody></table>';
  $('content').innerHTML = h;
  var sa = $('selall');
  if (sa) sa.onclick = function () {
    var checked = sa.checked;
    (s.items || []).forEach(function (it) {
      var k = rowKey(it);
      if (checked) SEL[k] = it; else delete SEL[k];
    });
    renderToolbar(s);
    // 重绘勾选态
    document.querySelectorAll('input[data-sel]').forEach(function (cb) { cb.checked = !!SEL[cb.getAttribute('data-sel')]; });
  };
}

function renderOverview(s) {
  var st = s.stats || {};
  var h = '<div class="grid">';
  // 服务端
  h += '<div class="card"><h3>服务端（node / status）</h3>';
  h += kv('运行时长', dur(s.uptimeSec * 1000));
  h += kv('serverPeerId', s.serverPeerId);
  if (s.config) {
    h += kv('hostname', s.config.serverHostname);
    h += kv('版本', s.config.serverVersionStr);
    h += kv('纯 P2P', s.config.avoidRelayData ? '开' : '关');
    h += kv('数据中继', s.config.relayData ? '开' : '关');
    h += kv('密钥校验', s.config.digestValidation ? '开' : '关');
    h += kv('房间上限', s.config.maxPeersPerRoom);
    h += kv('幽灵老化', dur(s.config.routeInfoUnreachableMs) + ' / ' + dur(s.config.routeInfoTtlMs));
    h += kv('空组自动删除', s.config.groupAutoDeleteMs > 0 ? dur(s.config.groupAutoDeleteMs) : '关闭');
  }
  h += '</div>';
  // 统计
  h += '<div class="card"><h3>统计（stats）</h3>';
  var c = s.counters || {};
  h += kv('累计连接', c.connsTotal);
  h += kv('收包 / 发包', c.msgsIn + ' / ' + c.msgsOut);
  var bytes = (c.bytesIn || 0) + (c.bytesOut || 0);
  h += kv('流量', (bytes / 1024).toFixed(1) + ' KiB');
  h += kv('数据转发', c.forwards);
  h += kv('协议错误', c.errors);
  h += kv('伪造拦截', c.forgeries);
  h += '</div>';
  if (st.groups) {
    h += '<div class="card"><h3>网络分组（foreign-network）</h3>';
    h += kv('分组总数', st.groups.total);
    h += kv('空分组', st.groups.empty);
    h += kv('在线节点', st.peers ? st.peers.total : '-');
    h += '</div>';
  }
  if (st.routes) {
    h += '<div class="card"><h3>路由信息（route）</h3>';
    h += kv('条目总数', st.routes.total);
    h += kv('direct 自报', st.routes.direct);
    h += kv('transit 他报', st.routes.transit);
    h += kv('幽灵（待老化清除）', st.routes.ghost);
    h += '</div>';
  }
  if (st.peerCenter) {
    h += '<div class="card"><h3>全局互联（peer-center）</h3>';
    h += kv('互联条目', st.peerCenter.total);
    h += '</div>';
  }
  if (st.digests) {
    h += '<div class="card"><h3>摘要注册表</h3>';
    h += kv('注册总数', st.digests.total);
    h += '</div>';
  }
  h += '</div>';
  $('content').innerHTML = h;
  $('content2').innerHTML =
    '<h3 style="font-size:13px;color:#7dd3fc;margin:14px 0 6px">官方 easytier-cli 命令对照</h3>' +
    '<div class="card" style="overflow-x:auto"><table><tr><th>官方命令</th><th>本控制台</th><th>说明</th></tr>' +
    '<tr><td><code>peer</code></td><td>节点在线</td><td>各分组在线节点（连接级视图）</td></tr>' +
    '<tr><td><code>route</code></td><td>路由信息</td><td>RoutePeerInfo 路由表（含来源与幽灵标记）</td></tr>' +
    '<tr><td><code>peer-center</code></td><td>全局互联</td><td>PeerCenter 全局互联表</td></tr>' +
    '<tr><td><code>stats</code></td><td>总览-统计</td><td>收发包/字节/转发/错误计数</td></tr>' +
    '<tr><td><code>foreign-network</code></td><td>网络分组</td><td>按网络名+摘要隔离的分组</td></tr>' +
    '<tr><td><code>node / status</code></td><td>总览-服务端</td><td>服务端身份、运行时长、配置</td></tr>' +
    '<tr><td><code>connector / mapped-listener / stun / vpn-portal / proxy / acl / port-forward / whitelist / credential / service</code></td><td>不适用</td><td>依赖 UDP/TUN/系统服务，Cloudflare Workers 运行时不可用</td></tr>' +
    '</table></div>';
}
function kv(k, v) { return '<div class="kv"><span>' + esc(k) + '</span><b>' + esc(v) + '</b></div>'; }

/* ---------------- 分页 ---------------- */
function renderPager(s) {
  if (TAB === 'overview') { $('pager').innerHTML = ''; return; }
  var total = s.total || 0;
  var pages = Math.max(1, Math.ceil(total / LIMIT));
  var page = Math.floor(OFFSET / LIMIT) + 1;
  $('pager').innerHTML =
    '<span>共 ' + total + ' 条 / ' + pages + ' 页</span>' +
    '<button id="pg-first" ' + (OFFSET > 0 ? '' : 'disabled') + '>«</button>' +
    '<button id="pg-prev" ' + (OFFSET > 0 ? '' : 'disabled') + '>上一页</button>' +
    '<span>第 ' + page + ' / ' + pages + ' 页</span>' +
    '<button id="pg-next" ' + (OFFSET + LIMIT < total ? '' : 'disabled') + '>下一页</button>' +
    '<button id="pg-last" ' + (OFFSET + LIMIT < total ? '' : 'disabled') + '>»</button>';
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

function doAction(act, payloads) {
  var done = function (r) {
    toast(actLabel(act) + ' 完成' + (r && r.notFound && r.notFound.length ? '（部分未找到）' : ''));
    refreshSideCounters();
    loadTab();
  };
  var fail = function (err) { toast(actLabel(act) + ' 失败：' + err.message, true); loadTab(); };
  if (act === 'del-group') {
    var keys = payloads.map(function (p) { return p.groupKey; });
    if (!confirm('删除 ' + keys.length + ' 个分组？\\n将断开其全部节点连接并清除路由数据。')) return;
    post('/api/group/delete', { groupKeys: keys }).then(done).catch(fail);
  } else if (act === 'kick') {
    if (!confirm('踢出 ' + payloads.length + ' 个节点？')) return;
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
    if (!confirm('断开 ' + payloads.length + ' 个连接？')) return;
    post('/api/socket/close', { socketIds: payloads.map(function (p) { return p.socketId; }) }).then(done).catch(fail);
  } else if (act === 'del-digest') {
    if (!confirm('删除 ' + payloads.length + ' 条摘要注册？\\n将解除对应网络名注册并清除使用该摘要的分组。')) return;
    post('/api/digest/delete', { networkNames: payloads.map(function (p) { return p.networkName; }) }).then(done).catch(fail);
  }
}
function actLabel(act) {
  return { 'del-group': '删除分组', 'kick': '踢出节点', 'del-route': '删除路由条目', 'del-pc': '删除互联条目', 'close-sock': '断开连接', 'del-digest': '删除摘要注册' }[act] || '操作';
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
}

/* ---------------- 导航与初始化 ---------------- */
document.querySelectorAll('.side button[data-tab]').forEach(function (b) {
  b.onclick = function () {
    document.querySelectorAll('.side button[data-tab]').forEach(function (x) { x.classList.remove('active'); });
    b.classList.add('active');
    TAB = b.getAttribute('data-tab');
    OFFSET = 0;
    SEL = {};
    loadTab();
  };
});

$('save').onclick = function () {
  localStorage.setItem('et_admin_token', $('token').value.trim());
  OVERVIEW = null;
  loadTab().then(refreshSideCounters);
};
$('refresh').onclick = function () { loadTab(); refreshSideCounters(); };
$('auto').onchange = setAuto;
function setAuto() {
  if (window.__t) { clearInterval(window.__t); window.__t = null; }
  if ($('auto').checked) {
    window.__t = setInterval(function () {
      // 自动刷新保留勾选；当前已在 overview 时无需重复拉取侧边栏计数
      loadTab(true);
      if (TAB !== 'overview') refreshSideCounters();
    }, 10000);
  }
}
if (localStorage.getItem('et_admin_token')) { $('token').value = '••••••••'; }
loadTab().then(refreshSideCounters);
setAuto();
</script>
</body>
</html>`;
