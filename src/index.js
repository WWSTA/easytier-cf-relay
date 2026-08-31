/**
 * Worker 入口：HTTP 路由 + WebSocket 升级分发到 Durable Object。
 *
 * 路由规则：
 * - GET /health               健康检查（无状态、零信息泄露，仅 {"ok":true}）
 * - GET <METRICS_PATH>        统计端点：自定义安全路径 + METRICS_TOKEN 双重防护
 *                             （不配置 METRICS_PATH 则完全禁用，默认 404）
 * - GET <ADMIN_PATH>          Web 管理端页面壳（无数据）
 *     GET  <ADMIN_PATH>/api/state        分页状态（?tab=&offset=&limit=&groupKey=，需 ADMIN_TOKEN）
 *     GET  <ADMIN_PATH>/api/metrics      统计别名（需 ADMIN_TOKEN）
 *     POST <ADMIN_PATH>/api/group/delete     删除分组（单个/批量/全部，需 ADMIN_TOKEN）
 *     POST <ADMIN_PATH>/api/peer/kick        踢出节点（单个/批量，需 ADMIN_TOKEN）
 *     POST <ADMIN_PATH>/api/route/delete     删除路由条目（批量，需 ADMIN_TOKEN）
 *     POST <ADMIN_PATH>/api/digest/delete    删除摘要注册（批量，需 ADMIN_TOKEN）
 *     POST <ADMIN_PATH>/api/peercenter/delete 删除互联表条目（批量，需 ADMIN_TOKEN）
 *     POST <ADMIN_PATH>/api/socket/close      断开连接（批量，需 ADMIN_TOKEN）
 *     KV 审计（记录 + 黑名单）：
 *     GET  <ADMIN_PATH>/api/records          记录查询（?type=&offset=&limit=）
 *     POST <ADMIN_PATH>/api/records/delete    删除记录（admin 类为硬审计不可删）
 *     GET  <ADMIN_PATH>/api/record/config     记录配置（每类开关 + 上限）
 *     POST <ADMIN_PATH>/api/record/config     修改记录配置
 *     GET  <ADMIN_PATH>/api/blacklist         黑名单查询（?cat=&offset=&limit=）
 *     POST <ADMIN_PATH>/api/blacklist/add     黑名单手工添加
 *     POST <ADMIN_PATH>/api/blacklist/delete  黑名单移除（解除封锁）
 *                             （不配置 ADMIN_PATH + ADMIN_TOKEN 则完全禁用）
 * - 任意路径 WebSocket 升级 -> DO（官方客户端用用户配置的 URL，路径不定，
 *   官方服务端同样接受任意路径；保留路径除外）
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

export { RelayRoom };

function str(env, key, def) {
  const v = env && env[key];
  return v === undefined || v === null || v === '' ? def : String(v);
}

/** 常数时间字符串比较（防时序侧信道） */
function safeEqual(a, b) {
  const x = String(a);
  const y = String(b);
  if (x.length !== y.length) return false;
  let r = 0;
  for (let i = 0; i < x.length; i++) r |= x.charCodeAt(i) ^ y.charCodeAt(i);
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
function isReservedPath(pathname, metricsPath, adminPath) {
  if (pathname === '/health' || pathname === '/favicon.ico') return true;
  if (pathname === '/metrics') return true; // 未启用时也保留（禁用即 404）
  if (metricsPath && pathname === metricsPath) return true;
  if (adminPath && (pathname === adminPath || pathname.startsWith(adminPath + '/'))) return true;
  return false;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const metricsPath = normalizePath(env.METRICS_PATH);
    const adminPath = normalizePath(env.ADMIN_PATH);

    // 健康检查（无状态；P0 整改：仅返回 {"ok":true}，零指纹）
    if (url.pathname === '/health') {
      return Response.json({ ok: true });
    }

    if (!env.RELAY_ROOM) {
      return new Response('RELAY_ROOM binding missing', { status: 500 });
    }

    // 统计：自定义安全路径 + token（P0 整改：两者都未配置则完全禁用，fail-closed）
    if (metricsPath && url.pathname === metricsPath) {
      const token = str(env, 'METRICS_TOKEN', '');
      if (!token || !safeEqual(bearerToken(request, url), token)) {
        return new Response('Not found', { status: 404 });
      }
      const roomId = resolveRoomId(request, url, env);
      const stub = env.RELAY_ROOM.get(env.RELAY_ROOM.idFromName(roomId));
      return stub.fetch(new Request('https://do/internal/stats', { method: 'GET' }));
    }

    // 管理端：页面壳公开（无数据），API 一律 token 鉴权
    if (adminPath && (url.pathname === adminPath || url.pathname.startsWith(adminPath + '/'))) {
      return handleAdmin(request, url, env, adminPath);
    }

    // WebSocket 升级（EasyTier 客户端）
    if (request.headers.get('Upgrade') === 'websocket'
        && !isReservedPath(url.pathname, metricsPath, adminPath)) {
      const roomId = resolveRoomId(request, url, env);
      const stub = env.RELAY_ROOM.get(env.RELAY_ROOM.idFromName(roomId));
      return stub.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  },
};

async function handleAdmin(request, url, env, adminPath) {
  const sub = url.pathname.slice(adminPath.length) || '/';

  // 页面壳（无数据，无需鉴权）
  if (sub === '/' && request.method === 'GET') {
    return new Response(ADMIN_HTML, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
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
  // 管理员来源 IP（DO 内部端点用于审计登录/操作/查看）
  const adminHeaders = {
    'content-type': 'application/json',
    'x-admin-ip': request.headers.get('CF-Connecting-IP') || '',
  };

  if (sub === '/api/state' && request.method === 'GET') {
    // 分页参数透传（tab/offset/limit/groupKey）
    const qs = url.searchParams.toString();
    return stub.fetch(new Request(`https://do/internal/state${qs ? '?' + qs : ''}`, {
      method: 'GET',
      headers: { 'x-admin-ip': adminHeaders['x-admin-ip'] },
    }));
  }
  if (sub === '/api/metrics' && request.method === 'GET') {
    return stub.fetch(new Request('https://do/internal/stats', { method: 'GET' }));
  }

  // KV 审计：记录查询 / 记录删除 / 记录配置
  if (sub === '/api/records' && request.method === 'GET') {
    const qs = url.searchParams.toString();
    return stub.fetch(new Request(`https://do/internal/records${qs ? '?' + qs : ''}`, {
      method: 'GET',
      headers: { 'x-admin-ip': adminHeaders['x-admin-ip'] },
    }));
  }
  if (sub === '/api/record/config') {
    if (request.method === 'GET') {
      return stub.fetch(new Request('https://do/internal/record/config', {
        method: 'GET',
        headers: { 'x-admin-ip': adminHeaders['x-admin-ip'] },
      }));
    }
    if (request.method === 'POST') {
      const body = await request.text();
      return stub.fetch(new Request('https://do/internal/record/config', {
        method: 'POST', headers: adminHeaders, body,
      }));
    }
  }
  if (sub === '/api/records/delete' && request.method === 'POST') {
    const body = await request.text();
    return stub.fetch(new Request('https://do/internal/records/delete', {
      method: 'POST', headers: adminHeaders, body,
    }));
  }

  // 黑名单：查询 / 添加 / 移除
  if (sub === '/api/blacklist' && request.method === 'GET') {
    const qs = url.searchParams.toString();
    return stub.fetch(new Request(`https://do/internal/blacklist${qs ? '?' + qs : ''}`, {
      method: 'GET',
      headers: { 'x-admin-ip': adminHeaders['x-admin-ip'] },
    }));
  }
  if (sub === '/api/blacklist/add' && request.method === 'POST') {
    const body = await request.text();
    return stub.fetch(new Request('https://do/internal/blacklist/add', {
      method: 'POST', headers: adminHeaders, body,
    }));
  }
  if (sub === '/api/blacklist/delete' && request.method === 'POST') {
    const body = await request.text();
    return stub.fetch(new Request('https://do/internal/blacklist/delete', {
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
    return stub.fetch(new Request(`https://do${internalPath}`, {
      method: 'POST',
      headers: adminHeaders,
      body,
    }));
  }
  return new Response('Not found', { status: 404 });
}
