/**
 * Worker 入口：HTTP 路由 + WebSocket 升级分发到 Durable Object。
 *
 * 路由规则：
 * - GET <HEALTH_PATH>          健康检查（无状态、零信息泄露，仅 {"ok":true}）
 *                             默认 /health；配置 HEALTH_PATH 后仅该路径生效，
 *                             原 /health 返回 404（防指纹扫描）
 * - GET <METRICS_PATH>        统计端点：自定义安全路径 + METRICS_TOKEN 双重防护
 *                             （不配置 METRICS_PATH 则完全禁用，默认 404）
 *                             v1.6.0：?format=prometheus 输出 Prometheus 文本格式
 * - GET <ADMIN_PATH>          Web 管理端页面壳（无数据）
 *     GET  <ADMIN_PATH>/api/state        分页状态（?tab=&offset=&limit=&groupKey=，需 ADMIN_TOKEN）
 *     GET  <ADMIN_PATH>/api/metrics      统计别名（需 ADMIN_TOKEN）
 *     GET  <ADMIN_PATH>/api/quota        账号级真实额度（v1.6，需 ADMIN_TOKEN；token 不下发浏览器）
 *     GET  <ADMIN_PATH>/api/trends       AE 趋势数据（v1.6，?window=24h|7d，需 ADMIN_TOKEN）
 *     POST <ADMIN_PATH>/api/group/delete     删除分组（单个/批量/全部，需 ADMIN_TOKEN）
 *     POST <ADMIN_PATH>/api/peer/kick        踢出节点（单个/批量，需 ADMIN_TOKEN）
 *     POST <ADMIN_PATH>/api/route/delete     删除路由条目（批量，需 ADMIN_TOKEN）
 *     POST <ADMIN_PATH>/api/digest/delete    删除摘要注册（批量，需 ADMIN_TOKEN）
 *     POST <ADMIN_PATH>/api/peercenter/delete 删除互联表条目（批量，需 ADMIN_TOKEN）
 *     POST <ADMIN_PATH>/api/socket/close      断开连接（批量，需 ADMIN_TOKEN）
 *     KV 审计（记录 + 黑名单）：
 *     GET  <ADMIN_PATH>/api/records          记录查询（?type=&offset=&limit=，type 支持 all=跨类型合并）
 *     POST <ADMIN_PATH>/api/records/delete    删除记录（admin 类为硬审计不可删）
 *     GET  <ADMIN_PATH>/api/record/config     记录配置（每类开关 + 上限）
 *     POST <ADMIN_PATH>/api/record/config     修改记录配置
 *     GET  <ADMIN_PATH>/api/blacklist         黑名单查询（?cat=&offset=&limit=）
 *     POST <ADMIN_PATH>/api/blacklist/add     黑名单手工添加
 *     POST <ADMIN_PATH>/api/blacklist/delete  黑名单移除（解除封锁）
 *                             （不配置 ADMIN_PATH + ADMIN_TOKEN 则完全禁用）
 * - 任意路径 WebSocket 升级 -> DO（官方客户端用用户配置的 URL，路径不定，
 *   官方服务端同样接受任意路径；保留路径除外）。升级前先做边缘层
 *   socket（IP）黑名单拦截：KV 直读 bl:socket 一条键，命中 403 不唤醒 DO
 * - 其余请求 404
 *
 * 鉴权说明（P0 整改）：
 * - token 支持 Authorization: Bearer <t> 头或 ?token=<t> 查询参数；
 * - 校验失败统一返回 404（不暴露端点存在性）；
 * - 比较使用常数时间算法，防时序侧信道。
 *
 * DO 命名：默认单一房间 "global"。可通过 ROOM_HEADER / ROOM_QUERY 自定义
 * 房间分片（例如按地域部署多个 Worker 路由不同房间），不同房间互不可见。
 */
import { RelayRoom } from './room.js';
import { ADMIN_HTML } from './admin_ui.js';
import { FAVICON_PNG } from './assets.js';
import { BL_SOCKET_KV_KEY } from './audit.js';
import { statsToPrometheus } from './prometheus.js';

export { RelayRoom };

function str(env, key, def) {
  const v = env && env[key];
  return v === undefined || v === null || v === '' ? def : String(v);
}

/**
 * 常数时间字符串比较（防时序侧信道）。
 * v1.4.2（安全加固）：长度差异折叠进结果、循环固定为较长串的长度——
 * 不再因「长度不等提前 return」泄露 token 长度。
 */
function safeEqual(a, b) {
  const x = String(a);
  const y = String(b);
  let r = x.length ^ y.length;
  const n = Math.max(x.length, y.length);
  for (let i = 0; i < n; i++) {
    r |= (x.charCodeAt(i) || 0) ^ (y.charCodeAt(i) || 0);
  }
  return r === 0;
}

/** 从 Bearer 头或 query 提取 token */
function bearerToken(request, url) {
  const h = request.headers.get('Authorization') || '';
  if (h.toLowerCase().startsWith('bearer ')) return h.slice(7).trim();
  const t = url.searchParams.get('token');
  return t ? t.trim() : '';
}

/** 规范化自定义路径：确保以 / 开头、无尾斜杠 */
function normalizePath(p) {
  if (!p) return '';
  let v = String(p).trim();
  if (!v.startsWith('/')) v = '/' + v;
  if (v.length > 1 && v.endsWith('/')) v = v.slice(0, -1);
  return v;
}

function resolveRoomId(request, url, env) {
  // 优先级：Header > Query 参数 > 环境变量默认值
  const headerName = str(env, 'ROOM_HEADER', '');
  if (headerName) {
    const v = request.headers.get(headerName);
    if (v) return v;
  }
  const queryName = str(env, 'ROOM_QUERY', '');
  if (queryName) {
    const v = url.searchParams.get(queryName);
    if (v) return v;
  }
  return str(env, 'ROOM_ID', 'global');
}

/** WebSocket 升级的保留路径：健康检查、统计/管理端点（含未启用时的默认字面量） */
function isReservedPath(pathname, metricsPath, adminPath, healthPath) {
  if (pathname === '/favicon.ico') return true;
  if (pathname === healthPath) return true; // healthPath 已含未配置时的默认 /health
  if (pathname === '/metrics') return true; // 未启用时也保留（禁用即 404）
  if (metricsPath && pathname === metricsPath) return true;
  if (adminPath && (pathname === adminPath || pathname.startsWith(adminPath + '/'))) return true;
  return false;
}

/**
 * 边缘层 socket 黑名单 isolate 缓存（v1.4.0）：
 * TTL 内的 WS 升级直接用缓存判定，不再每次连 KV。安全语义是
 * 「只延后拦截、绝不漏放」——缓存未命中（含 KV 读失败）照旧放行，
 * 由 DO 升级/握手层的权威黑名单兜底。代价仅是新拉黑 IP 的边缘拦截
 * 延后至多 TTL（叠加 KV 最终一致的约 1 分钟）。IP_BLOCK_CACHE_MS=0 关闭。
 */
const blCache = { at: 0, list: null };

function intEnv(env, key, def) {
  const v = env && env[key];
  if (v === undefined || v === null || v === '') return def;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : def;
}

async function lookupSocketBlacklist(env, ttlMs) {
  if (ttlMs > 0) {
    const now = Date.now();
    if (now - blCache.at < ttlMs) return blCache.list;
    const raw = await env.AUDIT_KV.get(BL_SOCKET_KV_KEY, 'json');
    const list = Array.isArray(raw) ? raw : null;
    blCache.at = now;
    blCache.list = list;
    return list;
  }
  const raw = await env.AUDIT_KV.get(BL_SOCKET_KV_KEY, 'json');
  return Array.isArray(raw) ? raw : null;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const metricsPath = normalizePath(env.METRICS_PATH);
    const adminPath = normalizePath(env.ADMIN_PATH);
    const healthPath = normalizePath(env.HEALTH_PATH) || '/health';

    // 健康检查（无状态；P0 整改：仅返回 {"ok":true}，零指纹）
    // v1.4.0：HEALTH_PATH 可自定义，配置后原 /health 返回 404（防指纹扫描）
    if (url.pathname === healthPath) {
      return Response.json({ ok: true });
    }

    // 站点图标（v1.4.1）：内嵌 PNG（128x128），浏览器缓存 1 天避免重复请求
    if (url.pathname === '/favicon.ico') {
      return new Response(FAVICON_PNG, {
        headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=86400' },
      });
    }

    if (!env.RELAY_ROOM) {
      return new Response('RELAY_ROOM binding missing', { status: 500 });
    }

    // 统计：自定义安全路径 + token（P0 整改：两者都未配置则完全禁用，fail-closed）
    // v1.6.0：?format=prometheus 输出 Prometheus 文本格式（鉴权同 JSON）
    if (metricsPath && url.pathname === metricsPath) {
      const token = str(env, 'METRICS_TOKEN', '');
      if (!token || !safeEqual(bearerToken(request, url), token)) {
        return new Response('Not found', { status: 404 });
      }
      const roomId = resolveRoomId(request, url, env);
      const stub = env.RELAY_ROOM.get(env.RELAY_ROOM.idFromName(roomId));
      if (url.searchParams.get('format') === 'prometheus') {
        const res = await stub.fetch(new Request('https://do/internal/stats', { method: 'GET' }));
        const stats = await res.json();
        return new Response(statsToPrometheus(stats), {
          headers: {
            'content-type': 'text/plain; version=0.0.4; charset=utf-8',
            'cache-control': 'no-store',
          },
        });
      }
      // /metrics 在 handleAdmin 作用域之外（doInternal 不可见）；统计 JSON
      // 本身无缓存指令，但管理 API 统一 no-store：这里直接补头
      const statsRes = await stub.fetch(new Request('https://do/internal/stats', { method: 'GET' }));
      const h2 = new Headers(statsRes.headers);
      h2.set('cache-control', 'no-store');
      return new Response(statsRes.body, { status: statsRes.status, headers: h2 });
    }

    // 管理端：页面壳公开（无数据），API 一律 token 鉴权
    if (adminPath && (url.pathname === adminPath || url.pathname.startsWith(adminPath + '/'))) {
      return handleAdmin(request, url, env, adminPath);
    }

    // WebSocket 升级（EasyTier 客户端）
    if (request.headers.get('Upgrade') === 'websocket'
        && !isReservedPath(url.pathname, metricsPath, adminPath, healthPath)) {
      // 边缘层 socket（IP）黑名单拦截（v1.3.0）：被拉黑客户端的重连风暴
      // 只消耗 Worker 请求额度，不再消耗 DO 请求与时长计费。
      // v1.4.0：黑名单 KV 读取加 isolate 缓存（IP_BLOCK_CACHE_MS，默认 30s），
      // 重连风暴时 KV 读从每次连接 1 次降为每 TTL 1 次。只延后拦截、
      // 绝不漏放：缓存未命中（含 KV 读失败）照旧放行走 DO 权威检查。
      // - CF-Connecting-IP 由 Cloudflare 边缘注入，客户端不可伪造（生产环境）；
      // - KV 为最终一致（约 1 分钟）+ 缓存 TTL：新拉黑 IP 的边缘拦截至多
      //   延后「约 1 分钟 + TTL」，由 DO 升级/握手层权威兜底；
      //   解除封锁后恢复可连的时间同理；
      // - 未绑定 AUDIT_KV 或读取异常时跳过本层，回落到 DO 内检查（功能不变）。
      if (env.AUDIT_KV) {
        const clientIp = request.headers.get('CF-Connecting-IP') || '';
        if (clientIp) {
          try {
            const ttlMs = intEnv(env, 'IP_BLOCK_CACHE_MS', 30_000);
            const bl = await lookupSocketBlacklist(env, ttlMs);
            if (Array.isArray(bl) && bl.some((e) => e && e.value === clientIp)) {
              return new Response('Forbidden', {
                status: 403,
                headers: { 'retry-after': '60' }, // 建议客户端退避重试
              });
            }
          } catch { /* KV 读失败：放行走 DO 权威检查 */ }
        }
      }
      const roomId = resolveRoomId(request, url, env);
      const stub = env.RELAY_ROOM.get(env.RELAY_ROOM.idFromName(roomId));
      // 升级请求必须原样转发（构造副本会破坏升级流，workerd 不支持）；
      // 「Upgrade 头 + /internal/*」的鉴权绕过由 DO 层守卫统一拦截（room.js fetch）。
      return stub.fetch(request);
    }

    // 其余未知路径（v1.4.1）：一律挂起不响应（tar pit）——不返回 404、不泄露
    // 服务器行为指纹，让路径扫描器空等到自身超时。仅影响非 WS 升级请求
    // （EasyTier 客户端只走升级，不受影响）；健康检查/favicon/统计/管理端等
    // 保留路径在上方各有自己的响应。CPU 成本为零（纯挂起流），
    // TARPIT_UNKNOWN="0" 关闭（恢复 404，排障用）。
    if (str(env, 'TARPIT_UNKNOWN', '1') !== '0') {
      return new Response(new ReadableStream({ /* 永不 enqueue/close */ }), {
        status: 200,
        headers: { 'content-type': 'application/octet-stream' },
      });
    }
    return new Response('Not found', { status: 404 });
  },
};

async function handleAdmin(request, url, env, adminPath) {
  const sub = url.pathname.slice(adminPath.length) || '/';

  // 页面壳（无数据，无需鉴权）。防嵌套双头：
  // X-Frame-Options 兼容旧浏览器，CSP frame-ancestors 为现代标准——
  // 管理页含批量删除/踢人/拉黑等高危操作，拒绝被恶意网站 iframe 嵌套
  // 诱导已登录管理员点击（点击劫持）。
  if (sub === '/' && request.method === 'GET') {
    return new Response(ADMIN_HTML, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
        'content-security-policy': "frame-ancestors 'none'",
      },
    });
  }

  // API：ADMIN_TOKEN 未配置或校验失败 -> 404（不暴露端点存在性）
  const token = str(env, 'ADMIN_TOKEN', '');
  if (!token || !safeEqual(bearerToken(request, url), token)) {
    return new Response('Not found', { status: 404 });
  }

  const roomId = resolveRoomId(request, url, env);
  const stub = env.RELAY_ROOM.get(env.RELAY_ROOM.idFromName(roomId));
  // 管理 API 响应统一 no-store：状态/记录含拓扑与 IP
  // 明细，不应进入任何缓存（页面壳此前已有 no-store，API 缺失）。
  const doInternal = (reqOrUrl, init) => stub.fetch(reqOrUrl, init).then((r) => {
    const h = new Headers(r.headers);
    h.set('cache-control', 'no-store');
    return new Response(r.body, { status: r.status, statusText: r.statusText, headers: h });
  });
  // 管理员来源 IP（DO 内部端点用于审计登录/操作/查看）
  const adminHeaders = {
    'content-type': 'application/json',
    'x-admin-ip': request.headers.get('CF-Connecting-IP') || '',
  };

  if (sub === '/api/state' && request.method === 'GET') {
    // 分页参数透传（tab/offset/limit/groupKey）
    const qs = url.searchParams.toString();
    return doInternal(new Request(`https://do/internal/state${qs ? '?' + qs : ''}`, {
      method: 'GET',
      headers: { 'x-admin-ip': adminHeaders['x-admin-ip'] },
    }));
  }
  if (sub === '/api/metrics' && request.method === 'GET') {
    return doInternal(new Request('https://do/internal/stats', { method: 'GET' }));
  }
  // 账号级真实额度（v1.6.0 A6）：CF_API_TOKEN 只在 DO 内使用，绝不下发浏览器
  if (sub === '/api/quota' && request.method === 'GET') {
    return doInternal(new Request('https://do/internal/quota', { method: 'GET' }));
  }
  // AE 趋势（v1.6.0 A5/D2）：window 参数透传，AE SQL 查询在 DO 内出站完成
  if (sub === '/api/trends' && request.method === 'GET') {
    const qs = url.searchParams.toString();
    return doInternal(new Request(`https://do/internal/trends${qs ? '?' + qs : ''}`, { method: 'GET' }));
  }

  // KV 审计：记录查询 / 记录删除 / 记录配置
  if (sub === '/api/records' && request.method === 'GET') {
    const qs = url.searchParams.toString();
    return doInternal(new Request(`https://do/internal/records${qs ? '?' + qs : ''}`, {
      method: 'GET',
      headers: { 'x-admin-ip': adminHeaders['x-admin-ip'] },
    }));
  }
  if (sub === '/api/record/config') {
    if (request.method === 'GET') {
      return doInternal(new Request('https://do/internal/record/config', {
        method: 'GET',
        headers: { 'x-admin-ip': adminHeaders['x-admin-ip'] },
      }));
    }
    if (request.method === 'POST') {
      const body = await request.text();
      return doInternal(new Request('https://do/internal/record/config', {
        method: 'POST', headers: adminHeaders, body,
      }));
    }
  }
  if (sub === '/api/records/delete' && request.method === 'POST') {
    const body = await request.text();
    return doInternal(new Request('https://do/internal/records/delete', {
      method: 'POST', headers: adminHeaders, body,
    }));
  }

  // 黑名单：查询 / 添加 / 移除
  if (sub === '/api/blacklist' && request.method === 'GET') {
    const qs = url.searchParams.toString();
    return doInternal(new Request(`https://do/internal/blacklist${qs ? '?' + qs : ''}`, {
      method: 'GET',
      headers: { 'x-admin-ip': adminHeaders['x-admin-ip'] },
    }));
  }
  if (sub === '/api/blacklist/add' && request.method === 'POST') {
    const body = await request.text();
    return doInternal(new Request('https://do/internal/blacklist/add', {
      method: 'POST', headers: adminHeaders, body,
    }));
  }
  if (sub === '/api/blacklist/delete' && request.method === 'POST') {
    const body = await request.text();
    return doInternal(new Request('https://do/internal/blacklist/delete', {
      method: 'POST', headers: adminHeaders, body,
    }));
  }

  const postRoutes = {
    '/api/group/delete': '/internal/group/delete',
    '/api/peer/kick': '/internal/peer/kick',
    '/api/route/delete': '/internal/route/delete',
    '/api/digest/delete': '/internal/digest/delete',
    '/api/peercenter/delete': '/internal/peercenter/delete',
    '/api/socket/close': '/internal/socket/close',
  };
  const internalPath = postRoutes[sub];
  if (internalPath && request.method === 'POST') {
    const body = await request.text();
    return doInternal(new Request(`https://do${internalPath}`, {
      method: 'POST',
      headers: adminHeaders,
      body,
    }));
  }
  return new Response('Not found', { status: 404 });
}
