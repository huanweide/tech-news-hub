'use strict';
/*
 * AOA 中间件单元测试（零依赖，全局 mock fetch）。
 * 运行：node scripts/aoa_test.cjs
 */
const { CircuitBreaker, CallCache, CostBudget,
  fetchWithAOA, CircuitOpenError, BudgetExceeded } = require('./aoa.cjs');

let pass = 0, fail = 0; const fails = [];
function ok(c, m) { if (c) pass++; else { fail++; fails.push(m); } }
const delay = (ms) => new Promise(r => setTimeout(r, ms));

const realFetch = global.fetch;
function restoreFetch() { global.fetch = realFetch; }
function makeAbort() { const e = new Error('The operation was aborted'); e.name = 'AbortError'; return e; }

// 立即成功响应（感知 signal.aborted）
function okFetch(counter) {
  return async (url, opts) => {
    if (counter) counter.n++;
    if (opts && opts.signal && opts.signal.aborted) throw makeAbort();
    return {
      ok: true, status: 200,
      json: async () => ({ ok: 1, usage: { total_tokens: 123 } }),
      text: async () => '{"ok":1}',
      clone() { return this; },
    };
  };
}
// 慢响应（感知 signal abort）
function slowFetch(ms) {
  return (url, opts) => new Promise((resolve, reject) => {
    const sig = opts && opts.signal;
    if (sig) {
      if (sig.aborted) return reject(makeAbort());
      sig.addEventListener('abort', () => reject(makeAbort()));
    }
    setTimeout(() => resolve({ ok: true, json: async () => ({}), text: async () => '{}', clone() { return this; } }), ms);
  });
}

(async function run() {
  // 1. CircuitBreaker
  {
    const b = new CircuitBreaker(3, 50);
    ok(b.allow() === true, 'breaker 初始 CLOSED 允许');
    for (let i = 0; i < 3; i++) b.onFailure();
    ok(b.allow() === false, '达到阈值后 OPEN 拒绝');
    await delay(80);
    ok(b.allow() === true, 'resetTimeout 后进入半开放行');
    b.onSuccess();
    ok(b.allow() === true, '半开成功后恢复 CLOSED');
  }
  // 2. CallCache
  {
    const c = new CallCache(50);
    c.put('k', 'v');
    ok(c.get('k') === 'v', 'cache 命中');
    ok(c.get('x') === null, 'cache 未命中返回 null');
    await delay(80);
    ok(c.get('k') === null, 'cache 过期返回 null');
  }
  // 3. CostBudget
  {
    const b = new CostBudget(100);
    b.charge(30);
    ok(b.remaining() === 70, '预算扣减正确');
    let threw = false;
    try { b.canSpend(71); } catch (e) { threw = e instanceof BudgetExceeded; }
    ok(threw, '超预算抛 BudgetExceeded');
  }
  // 4. fetchWithAOA 成功
  {
    const counter = { n: 0 };
    global.fetch = okFetch(counter);
    const r = await fetchWithAOA('t1', 'http://x', {}, { timeout: 1000 });
    ok(r.ok === true, 'fetchWithAOA 成功返回响应');
    ok(counter.n === 1, '成功时真实发起一次请求');
    restoreFetch();
  }
  // 5. fetchWithAOA 超时 -> abort 错误并记熔断
  {
    global.fetch = slowFetch(200);
    const br = new CircuitBreaker(3, 60000);
    let err = null;
    try { await fetchWithAOA('t2', 'http://x', {}, { timeout: 50, breaker: br }); }
    catch (e) { err = e; }
    ok(err != null && (err.name === 'AbortError' || /abort/i.test(String(err.message))), '超时触发 abort 错误');
    ok(br.failures === 1, '超时计入熔断失败');
    restoreFetch();
  }
  // 6. 熔断 OPEN 时直接抛 CircuitOpenError（不发请求）
  {
    const counter = { n: 0 };
    global.fetch = okFetch(counter);
    const br = new CircuitBreaker(1, 60000);
    br.onFailure(); br.onFailure(); // 直接置 OPEN
    let err = null;
    try { await fetchWithAOA('t3', 'http://x', {}, { breaker: br }); }
    catch (e) { err = e; }
    ok(err instanceof CircuitOpenError, 'OPEN 时抛 CircuitOpenError');
    ok(counter.n === 0, 'OPEN 时不发起真实请求');
    restoreFetch();
  }
  // 7. 预算超限抛 BudgetExceeded（fetch 前拦截）
  {
    const counter = { n: 0 };
    global.fetch = okFetch(counter);
    const budget = new CostBudget(10);
    budget.charge(10);
    let err = null;
    try { await fetchWithAOA('t4', 'http://x', {}, { budget, maxTokens: 1, chargeUsage: true }); }
    catch (e) { err = e; }
    ok(err instanceof BudgetExceeded, '预算超限抛 BudgetExceeded');
    ok(counter.n === 0, '超限时不发起真实请求');
    restoreFetch();
  }
  // 8. 缓存命中：首次请求后写缓存，二次命中不重复请求
  {
    const counter = { n: 0 };
    global.fetch = okFetch(counter);
    const r1 = await fetchWithAOA('t5', 'http://x', {}, { cacheKey: 'u1', cacheTtl: 60000 });
    const t1 = await r1.text();
    ok(counter.n === 1, '首次请求真实发起');
    const r2 = await fetchWithAOA('t5', 'http://x', {}, { cacheKey: 'u1', cacheTtl: 60000 });
    const t2 = await r2.text();
    ok(counter.n === 1, '缓存命中不发二次请求');
    ok(t1 === t2, '缓存返回值与首次一致');
    restoreFetch();
  }

  console.log('\n=== AOA 中间件单元测试 ===');
  console.log('PASS: ' + pass + '   FAIL: ' + fail);
  fails.forEach(m => console.log('  ✗ ' + m));
  process.exit(fail === 0 ? 0 : 1);
})();
