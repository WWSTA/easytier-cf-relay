/**
 * Prometheus text exposition format 输出（v1.6.0 D1）。
 *
 * `/metrics?format=prometheus` 在 JSON 输出之外提供机器可读格式，
 * 供长期监控/告警（Prometheus + Grafana、UptimeRobot 等）抓取。
 * 鉴权与 JSON 共用同一门禁（METRICS_PATH + METRICS_TOKEN，index.js）。
 *
 * 设计约束：
 * - 指标命名空间 `easytier_`，无 label（避免高基数；分组级数据请走管理端）；
 * - gauge：uptime/peers/groups/当前连接（随 DO 重启部分计数归零属预期，见技术文档）；
 * - counter：统一 `_total` 后缀（Prometheus 命名惯例，rate() 依赖）；
 * - 输出遵守 text format 0.0.4：TYPE 行在样本行之前、值必须为有限数字、
 *   末尾换行。可被 `promtool check metrics` 校验。
 */

/** 有限数字化：缺失/NaN 统一为 0（text format 不接受非法值） */
function num(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}

/**
 * 将 /internal/stats 的 JSON 转为 Prometheus 文本。
 * @param {object} stats - DO `_stats()` 输出（含 counters/config 等，宽容缺失）
 * @returns {string} text/plain; version=0.0.4
 */
export function statsToPrometheus(stats) {
  const s = stats || {};
  const c = s.counters || {};
  const lines = [];
  const gauge = (name, v) => lines.push(`# TYPE ${name} gauge`, `${name} ${num(v)}`);
  const counter = (name, v) => lines.push(`# TYPE ${name} counter`, `${name} ${num(v)}`);

  gauge('easytier_uptime_seconds', s.uptimeSec);
  gauge('easytier_peers', s.totalPeers);
  gauge('easytier_groups', s.groupCount);
  // 当前连接（v1.6.0 补齐：_stats JSON 补 sockets 概览后同步提供）
  gauge('easytier_sockets', s.sockets ? s.sockets.total : 0);
  gauge('easytier_sockets_handshaked', s.sockets ? s.sockets.handshaked : 0);
  counter('easytier_msgs_in_total', c.msgsIn);
  counter('easytier_msgs_out_total', c.msgsOut);
  counter('easytier_bytes_in_total', c.bytesIn);
  counter('easytier_bytes_out_total', c.bytesOut);
  counter('easytier_forwards_total', c.forwards);
  counter('easytier_conns_total', c.connsTotal);
  counter('easytier_errors_total', c.errors);
  counter('easytier_forgeries_total', c.forgeries);
  counter('easytier_blacklist_rejected_total', c.blRejected);
  counter('easytier_ip_limited_total', c.ipLimited);
  counter('easytier_rate_limited_total', c.rateLimited);
  counter('easytier_group_limited_total', c.groupLimited);
  counter('easytier_alarms_total', c.alarmCount);
  // 资源滥用防线：非零即有滥用尝试，适合接告警
  counter('easytier_route_flooded_total', c.routeFlooded);
  counter('easytier_route_oversized_total', c.routeOversized);
  counter('easytier_route_capped_total', c.routeCapped);
  counter('easytier_outbound_dropped_total', c.outboundDropped);
  counter('easytier_peermap_cooled_total', c.peerMapCooled);
  counter('easytier_resync_cooled_total', c.resyncCooled);
  counter('easytier_squat_suspect_total', c.squatSuspect);

  return lines.join('\n') + '\n';
}
