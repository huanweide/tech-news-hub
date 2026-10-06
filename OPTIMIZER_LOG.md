# OPTIMIZER_LOG · tech-news-hub（第 1 轮 · 2026-10-06）

> 改这个项目之前先看这个文件，避免推翻上一轮已经想清楚的决定。

## 一、轮转状态

| 项 | 值 |
|---|---|
| 仓库 | huanweide/tech-news-hub |
| star | 0 |
| 主语言 | JavaScript（纯静态，无框架无构建） |
| 本轮判定 | **保留 + 整体转向新方向** |
| 基线 commit | 95dec90 |
| Pages 部署 | **master 分支根路径**（改动立即上线，必须慎重） |
| 状态文件 | `GH_OPTIMIZER_STATE.json` |

## 二、先摸清事实

- 24 个文件、29 万行以内的小而全的静态站：新闻数据层 + 优惠圈 + LLM 助手抽屉 + 可检索知识库。
- **完成度罕见地高**：193 项断言、`axe-core` 无障碍回归 + WCAG AA 对比度校验、每周自动更新的 Actions 流水线、写得相当好的 README。
- 用户本人**每周日依赖** `scripts/weekly_update.cjs` 产出内容。
- 已经有「配置驱动」的先例：`deals-sources.json` 是优惠圈的唯一事实来源。

**结论**：这个项目不缺测试、不缺文档、不缺 CI。**继续做小修小补就是典型的「小农主义」**，必须回答一个更根本的问题：它还缺点什么？

## 三、存活评估（规范一）

同类是各类科技 newsletter / 资讯聚合站。它们的共同短板是「只给信息流」。
本项目的差异化（可溯源、8 维度深读、可检索知识库、BYOK 本地助手、0 元静态托管）是成立的。

**但真正的瓶颈不在外部竞争，而在内部：除作者本人之外没人能用。**

## 四、方向选择（规范二：二选一）

选 **整体转向新方向**。

第一性原理：这套站的外壳 —— 8 维度模板、内联 SVG 架构图、可检索知识库、BYOK 助手、
axe 无障碍回归 —— **跟「科技」一点关系都没有**。真正把它锁死成一个人的周报的，
是硬编码在 `scripts/weekly_update.cjs` 里的这几样东西：

```js
const FEEDS = [ { name: '量子位', ... }, { name: '机器之心', ... }, ... ];
const AI_KW = ['ai', '大模型', '模型', ...];
function tagsOf(...) { const pool = ['AI', '大模型', ...]; }
const ARCH_LABELS = { ai: {...}, tech: {...} };
```

想换个领域？改脚本源码。这就把 95% 的潜在用户挡在门外了。

而同一个仓库里的「模型优惠圈」**早就做对了** —— 它从 `deals-sources.json` 读源。
所以这里补上缺的那一半，让两边方式一致。

**转向目标**：从「作者个人的科技周报站」变成「**TechPulse 引擎 —— 改一个 `pulse.config.js` 就能生成任意领域周刊**」。

**代价与三条底线**（规范里写明要慎重）：

1. **用户本人的每周任务不能受影响** —— 所以配置默认值与原先硬编码**逐项相同**，
   并由 `scripts/config_test.cjs` 的 35 项等价性断言守着。已用 `DRY_RUN=1` 实跑验证。
2. **Pages 从 master 根部署** —— 改任何文件都会立即上线。本次未改动任何影响页面渲染的内容
   （`index.html` 只把 Chart.js 从 CDN 换成本地文件，且该文件随 PR 一起提交）。
3. **不动作者的数据与前端** —— `app.js` / `style.css` / `news-data.js` 等一块没碰。

## 五、本轮改了什么

### 5.1 配置外置（转向的核心）

新增 `pulse.config.js`，包含 `site` / `feeds` / `categories` / `categoryKeywords` /
`tagPool` / `tagMax` / `archLabels` / `harvest`。

`scripts/weekly_update.cjs` 改为读配置，**变量名一个都没改**（`FEEDS` / `AI_KW` /
`ARCH_LABELS`），所以下游引用点零改动 —— 这是刻意的，把风险压到最小。

```bash
# 换领域只要改配置
vim pulse.config.js
# 或者不用动默认配置，另指一份
PULSE_CONFIG=./my-weekly.config.js node scripts/weekly_update.cjs
```

### 5.2 【差点造成线上事故】Chart.js 的 CDN 依赖

我写的体检脚本报告「外链脚本缺少 SRI」，按通用最佳实践这该补 `integrity`。
**但这个建议在这个场景里是错的。**

下载那个文件看了头部注释：

```
/**
 * Skipped minification because the original files appears to be already minified.
 * Do NOT use SRI with dynamically generated files!
 * More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
```

jsdelivr 会对文件做动态处理，内容可能变化，**加了 SRI 反而会被浏览器拒绝加载** ——
本来正常显示的图表会被自己搞挂。而 Pages 是从 master 根部署的，改坏了立刻线上可见。

正确解法是**本地化**：把 `chart.js@4.4.1` 放进 `vendor/`，一次性解决三个问题：

| 问题 | 本地化后 |
|---|---|
| 中国大陆访问 jsdelivr 不稳，图表经常加载不出来 | 同源加载，稳定 |
| 加 SRI 会被拒（动态文件） | 不需要 SRI |
| 「纯静态零后端」的定位被一个 CDN 破功 | 真正离线可用 |

### 5.3 README 三处真问题

| 问题 | 处理 |
|---|---|
| 有两个「许可证」章节，其中一个写「详见 LICENSE」，但**仓库里根本没有 LICENSE 文件**（README 唯一的本地链接是死链） | 补 MIT `LICENSE`，两个章节合并为一个，并区分「代码 MIT」与「内容公益科普」 |
| 「CI 门禁用法」整段讲的是「本工具输出健康分与严重度」—— 这是**别的命令行工具模板的残留**，跟这个新闻站毫无关系 | 删除 |
| 「确保 139 项断言全绿」—— 数字会过期 | 改为不写死数字 |

### 5.4 新增两道门禁

| 门禁 | 拦什么 |
|---|---|
| `scripts/site_scan.cjs` | 资源 404 / 死按钮（内联 handler 调用未定义函数）/ 同名全局定义互相覆盖 / 加载顺序颠倒 |
| `scripts/config_test.cjs` | 配置与改动前旧行为不等价 / 配置自洽性（cat 未声明、url 非法） |

顺带把原先没进 `npm test` 的 `scripts/aoa_test.cjs` 也接了进去。

## 六、自检证据

| 检查 | 结果 |
|---|---|
| 全量 `npm test` | **193 项断言全绿** |
| `DRY_RUN=1` 实跑 weekly_update | 抓到 14 条（= 配置的 `maxItems`），流程正常 |
| `site_scan` | 0 问题 |
| 线上站点 | 6 个资源全 200，数据层 423KB 正常 |
| **变异测试** | **7/7 被拦截，基线全绿** |

变异明细：

| 注入的错误 | 应该被谁拦 | 结果 |
|---|---|---|
| 引用不存在的 JS | `site_scan` | 拦截 ✓ |
| 内联 onclick 调用未定义函数 | `site_scan` | 拦截 ✓ |
| 两个文件定义同名全局函数 | `site_scan` | 拦截 ✓ |
| 加载顺序颠倒（数据在逻辑之后） | `site_scan` | 拦截 ✓ |
| 配置少一个关键词 | `config_test` | 拦截 ✓ |
| 标签截断数被改 | `config_test` | 拦截 ✓ |
| 抓取源的 cat 写成未声明分类 | `config_test` | 拦截 ✓ |
| 基线（干净副本） | —— | 全绿 ✓ |

## 七、我自己犯的错

1. **差点照搬教条制造线上事故。** 体检脚本说「缺 SRI」，我差点直接补 `integrity`。
   是下载文件读了 jsdelivr 的头部注释才发现这条建议在此场景是错的。
   **教训：静态检查工具的建议也可能在特定上下文失效，动手前必须理解底层事实。**
   已把这条写进 `site_scan.cjs` 的注释，避免以后有人（或又一个我）再补 SRI。
2. **变异脚手架自己出 bug，制造了假警报。** 第一版变异往 `index.html` 注入了一个
   它根本没有的属性（这个项目零内联事件处理器），而基线副本又排除了 `node_modules`
   导致 `npm test` 必红。两处都不是门禁的问题 —— 正好印证「变异前必须确认注入生效」。
3. **写长文本时混入外文字符**（两处），写完必须回读。

## 八、回滚与兼容

- squash 单 commit，一条 `git revert <commit>` 整体撤销。
- 用户每周日跑的自动更新任务**行为零变化**（默认配置逐项等同旧硬编码，有 35 项断言守着，并已实跑验证）。
- 线上页面渲染未受影响（改的都是不参与渲染的文件；`index.html` 唯一的改动是 Chart.js 来源，本地文件随 PR 提交）。

## 九、下一轮建议

1. **前端站名也从 `pulse.config.js` 读** —— 现在 `index.html` 里的标题仍是硬编码，
   换领域还得手改 HTML，这是「最后一公里」没做完。
2. 把 `site_scan.cjs` 也接进 `weekly-update` workflow（现在只在 `npm test` 里）。
3. `vendor/` 加第三方库版本清单与升级说明。
4. 新闻的 `sources[]` 可加自动可达性巡检（死链提醒）。
