'use strict';
/*
 * AOA 中间件（AutonomousOptimizationArchitect）—— tech-news-hub
 * 零依赖通用防护层，包裹任意 fetch 调用，提供：
 *   1) 硬性超时（AbortController）—— 防止请求挂死
 *   2) 熔断（连续失败达阈值后 OPEN，半开自动恢复）—— 防止故障级联
 *   3) 预算（AI FinOps，调用前 canSpend + 调用后按 usage 计费）
 *   4) 缓存（按 cacheKey 命中则返回缓存，仅缓存 2xx 文本响应）
 *
 * 设计铁律：每个外部请求必须有严格超时、熔断上限、失败降级（降级由业务层负责）。
 */

class CircuitOpenError extends Error {
  constructor(msg) { super(msg); this.name = 'CircuitOpenError'; }
}
class BudgetExceeded extends Error {
  constructor(msg) { super(msg); this.name = 'BudgetExceeded'; }
}

/* ---------- 熔断器：CLOSED -> OPEN -> HALF_OPEN -> CLOSED ---------- */
class CircuitBreaker {
  constructor(failureThreshold = 3, resetTimeout = 60000) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
    this.failures = 0;
    this.state = 'CLOSED';
    this.openedAt = 0;
  }
  allow() {
    if (this.state === 'OPEN') {
      if (Date.now() - this.openedAt >= this.resetTimeout) {
        this.state = 'HALF_OPEN'; // 半开探测，放行一次
        return true;
      }
      return false;
    }
    return true;
  }
  onSuccess() { this.failures = 0; this.state = 'CLOSED'; }
  onFailure() {
    this.failures++;
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      this.openedAt = Date.now();
    }
  }
  reset() { this.failures = 0; this.state = 'CLOSED'; this.openedAt = 0; }
}

/* ---------- TTL 内存缓存 ---------- */
class CallCache {
  constructor(ttl = 300000) { this.ttl = ttl; this.map = new Map(); }
  get(key) {
    const e = this.map.get(key);
    if (!e) return null;
    if (Date.now() - e.t >= (e.ttl || this.ttl)) { this.map.delete(key); return null; }
    return e.v;
  }
  put(key, v, ttl) { this.map.set(key, { v, t: Date.now(), ttl: ttl || this.ttl }); }
  clear() { this.map.clear(); }
}

/* ---------- Token 预算 ---------- */
class CostBudget {
  constructor(maxTokens = 200000) { this.maxTokens = maxTokens; this.used = 0; }
  canSpend(n = 0) {
    if (this.used + n > this.maxTokens) {
      throw new BudgetExceeded('预算超限: used=' + this.used + ' +' + n + ' > ' + this.maxTokens);
    }
    return true;
  }
  charge(n = 0) { this.used += n; return this.used; }
  remaining() { return Math.max(0, this.maxTokens - this.used); }
}

/* ---------- 命名空间单例 ---------- */
const _BREAKERS = new Map();
const _BUDGETS = new Map();
function getBreaker(name, failureThreshold = 3, resetTimeout = 60000) {
  if (!_BREAKERS.has(name)) _BREAKERS.set(name, new CircuitBreaker(failureThreshold, resetTimeout));
  return _BREAKERS.get(name);
}
function getBudget(name, maxTokens = 200000) {
  if (!_BUDGETS.has(name)) _BUDGETS.set(name, new CostBudget(maxTokens));
  return _BUDGETS.get(name);
}

/* 让缓存命中可返回一个兼容业务层 r.json()/r.text()/r.ok 的响应对象 */
class CachedResponse {
  constructor(body, contentType) {
    this.ok = true; this.status = 200; this.statusText = 'OK';
    this._body = body; this._ct = contentType || 'application/json';
  }
  async json() { return typeof this._body === 'string' ? JSON.parse(this._body) : this._body; }
  async text() { return typeof this._body === 'string' ? this._body : JSON.stringify(this._body); }
}

/*
 * fetchWithAOA：包裹一次 fetch。
 * opts: { timeout=15000, breaker, budget, cacheKey, cacheTtl, maxTokens=0, chargeUsage=false }
 * 返回真实 Response（未启用缓存时）或 CachedResponse（命中缓存时）。
 */
async function fetchWithAOA(name, url, fetchOpts = {}, opts = {}) {
  const {
    timeout = 15000,
    breaker = getBreaker(name),
    budget = null,
    cacheKey = null,
    cacheTtl = 300000,
    maxTokens = 0,
    chargeUsage = false,
  } = opts;

  if (!breaker.allow()) {
    throw new CircuitOpenError('[' + name + '] 熔断器 OPEN，跳过请求');
  }

  if (cacheKey) {
    const cache = fetchWithAOA._cache || (fetchWithAOA._cache = new CallCache());
    const hit = cache.get(name + ':' + cacheKey);
    if (hit != null) return new CachedResponse(hit);
  }

  if (budget) budget.canSpend(maxTokens);

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  let resp;
  try {
    resp = await fetch(url, Object.assign({}, fetchOpts, { signal: ctrl.signal }));
  } catch (e) {
    clearTimeout(timer);
    breaker.onFailure();
    throw e;
  }
  clearTimeout(timer);
  breaker.onSuccess();

  if (budget && chargeUsage && resp.ok) {
    try {
      const j = await resp.clone().json();
      const used = (j.usage && j.usage.total_tokens) || maxTokens || 0;
      budget.charge(used);
    } catch (_) { /* 解析失败忽略计费 */ }
  }

  if (cacheKey && resp.ok) {
    try {
      const txt = await resp.clone().text();
      const cache = fetchWithAOA._cache || (fetchWithAOA._cache = new CallCache());
      cache.put(name + ':' + cacheKey, txt, cacheTtl);
    } catch (_) { /* 忽略 */ }
  }

  return resp;
}

module.exports = {
  CircuitOpenError, BudgetExceeded,
  CircuitBreaker, CallCache, CostBudget,
  getBreaker, getBudget,
  fetchWithAOA, CachedResponse,
};
