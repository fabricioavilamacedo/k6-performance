import http from "k6/http";
import { check } from "k6";
import { apiDuration, apiSuccessRate, apiFailRate } from "../metrics/apiMetrics.js";

function logError(res, method, url) {
  if (res.status >= 400) {
    console.error(
      `>>>> HTTP ERROR | method: ${method} | status: ${res.status} | url: ${url} | body: ${res.body}`
    );
  }
}

export function post(url, payload, params = {}) {

  const res = http.post(url, JSON.stringify(payload), params);

  apiDuration.add(res.timings.duration);
  apiSuccessRate.add(res.status < 400);
  apiFailRate.add(res.status >= 400);

  check(res, {
    "status is 200 or 201": (r) => r.status === 200 || r.status === 201,
    "response time < 2s": (r) => r.timings.duration < 2000,
  });

  logError(res, "POST", url);

  return res;
}

export function get(url, params = {}) {

  const res = http.get(url, params);

  apiDuration.add(res.timings.duration);
  apiSuccessRate.add(res.status < 400);
  apiFailRate.add(res.status >= 400);

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  logError(res, "GET", url);

  return res;
}