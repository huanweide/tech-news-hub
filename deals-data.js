/* 模型优惠圈 · 数据层（由 scripts/deals_update.cjs 依据 deals-sources.json 自动生成） */
window.DEALS_DATA = {
  "meta": {
    "updatedAt": "2026-08-03",
    "note": "模型优惠圈：中转站与大模型平台真实优惠资讯，依据 deals-sources.json 自动同步，超时自动下架。"
  },
  "deals": [
    {
      "id": "siliconflow-invite",
      "title": "硅基流动 SiliconFlow：邀请官双向代金券 + 新用户 2000 万 Tokens",
      "platformType": "official",
      "platform": "硅基流动",
      "type": "current",
      "summary": "通过邀请链接注册硅基流动，双方各得 16 元全平台通用代金券（约 2000 万 Tokens，永久有效）；聚合 DeepSeek / Qwen / GLM 等开源权重模型，API 兼容 OpenAI 格式。",
      "detail": "**硅基流动（SiliconFlow）薅羊毛指南**  \n1. 注册领券：通过官方链接（https://cloud.siliconflow.cn）注册并完成手机号验证，双方各得 **16元通用代金券**（约2000万Tokens，永久有效，支持Pro模型）。  \n2. 邀请返利：在「邀请有礼」生成专属链接，好友注册并消耗额度后，你持续获得代金券，**上不封顶**。  \n3. 使用方式：调用统一OpenAI兼容 `/v1` 接口，支持DeepSeek-V3/R1、Qwen3、GLM等模型，按token计费，代金券可直接抵扣。  \n注：具体面额以活动页为准。",
      "validFrom": null,
      "validUntil": null,
      "price": "新用户 2000 万 Tokens（约 ¥14）+ 双向邀请代金券",
      "valueScore": 88,
      "sourceUrl": "https://siliconflow.cn",
      "tags": [
        "硅基流动",
        "邀请官",
        "免费额度",
        "开源权重",
        "OpenAI兼容"
      ],
      "addedAt": "2026-07-26"
    },
    {
      "id": "volcengine-ark",
      "title": "火山引擎方舟 Ark：豆包大模型定价 + Coding Plan 新用户首月 ¥9.9 + 邀请有礼",
      "platformType": "official",
      "platform": "火山引擎",
      "type": "current",
      "summary": "豆包大模型推理输入 ¥6.00/百万 tokens、输出 ¥30.00/百万 tokens；方舟 Coding Plan 新用户首月 ¥9.9（原价 ¥40）；邀请好友订阅双方得优惠（好友 9 折，邀请人 10% 代金券）。",
      "detail": "火山方舟 Coding Plan 薅羊毛指南：\n\n1. **开通**：注册火山引擎账号，进入「火山方舟」开通模型服务。  \n2. **订阅**：新用户首月 ¥9.9（原价 ¥40），首季 ¥60（原价 ¥120），覆盖 Claude Code / Cursor / VSCode 等十余款工具，额度共享。  \n3. **邀请返利**：邀请好友订阅，好友享 9 折，你获 10% 代金券（可叠加续费，上不封顶）。  \n4. **按量计费**：豆包系列适合中文客服 / 内容生成 / RAG 高频场景。  \n\n⚠️ 代金券有效期与适用范围以官方活动页为准。",
      "validFrom": null,
      "validUntil": null,
      "price": "豆包推理 ¥6 / ¥30 每百万token · Coding Plan 首月 ¥9.9",
      "valueScore": 84,
      "sourceUrl": "https://www.volcengine.com/product/ark",
      "tags": [
        "火山引擎",
        "方舟",
        "豆包",
        "Coding Plan",
        "邀请有礼"
      ],
      "addedAt": "2026-07-26"
    },
    {
      "id": "deepseek-v4-pricecut",
      "title": "DeepSeek-V4 永久降价 75%：输入缓存命中低至 ¥0.025/百万 tokens",
      "platformType": "official",
      "platform": "DeepSeek",
      "type": "pricecut",
      "summary": "DeepSeek-V4-Pro API 价格永久降为原价 1/4：输入缓存命中 ¥0.025/百万、缓存未命中 ¥3/百万、输出 ¥6/百万；V4-Flash 缓存命中低至 ¥0.02/百万。原 2.5 折限时优惠已转为永久。",
      "detail": "**DeepSeek 降价薅羊毛指南（2026-05-31 起生效）**\n\n1. **价格核心**：V4-Flash 更便宜（缓存命中仅 $0.0028/百万，约¥0.02）；V4-Pro 适合高缓存场景（命中 $0.025/百万，未命中 $3，输出 $6），75% 折扣已永久化。\n2. **适用场景**：长文本、RAG、智能体等高频缓存命中场景，成本比闭源旗舰低一个数量级。\n3. **接口连接**：直接用 https://api.deepseek.com ，支持 OpenAI / Anthropic 双格式，无需额外改造。\n4. **注意**：价格为官方公示，随调整变化，以 https://api.deepseek.com 定价页为准。",
      "validFrom": "2026-05-31",
      "validUntil": null,
      "price": "V4-Flash 缓存命中 ¥0.02/百万 · V4-Pro ¥0.025/百万",
      "valueScore": 95,
      "sourceUrl": "https://api-docs.deepseek.com/quick_start/pricing",
      "tags": [
        "DeepSeek",
        "永久降价",
        "性价比",
        "V4",
        "缓存命中"
      ],
      "addedAt": "2026-07-26"
    },
    {
      "id": "aliyun-bailian-free",
      "title": "阿里云百炼 Bailian：新用户 7000 万免费 Tokens + Qwen-Turbo 永久免费",
      "platformType": "official",
      "platform": "阿里云百炼",
      "type": "current",
      "summary": "首次开通百炼送 7000 万免费 Tokens（有效期 90 天，覆盖通义千问全系列及第三方开源模型）；Qwen-Turbo 永久免费；Qwen3.7-Flash 输入 ¥0.03/百万、输出 ¥0.06/百万。",
      "detail": "**阿里云百炼大模型薅羊毛指南**  \n\n1. **新用户免费拿 7000 万 Tokens**：注册阿里云并完成实名认证，首次开通「百炼」即送 7000 万 Tokens（90 天有效，各模型共享），仅限实时推理，不抵 Batch/缓存/微调/部署。  \n2. **永久免费选项**：  \n   - **Qwen-Turbo**：永久免费，适合高频轻量调用。  \n   - **网页对话端**：永久免费（超高频长文本可能轻度限流）。  \n3. **超低价批量调用**：**Qwen3.7-Flash** 输入 ¥0.03/百万、输出 ¥0.06/百万，适合批量简单文本处理。  \n\n**直达链接**：阿里云百炼控制台（需登录/注册），按页面提示开通即可。",
      "validFrom": null,
      "validUntil": null,
      "price": "新用户 7000 万免费Tokens(90天) · Qwen-Turbo 永久免费",
      "valueScore": 90,
      "sourceUrl": "https://www.aliyun.com/product/bailian",
      "tags": [
        "阿里云",
        "百炼",
        "通义千问",
        "免费额度",
        "Qwen"
      ],
      "addedAt": "2026-07-26"
    },
    {
      "id": "zhipu-glm-new",
      "title": "智谱 GLM-5.2 新上线（MIT 开源）+ 新用户 2000 万 Tokens + GLM-4-Flash 永久免费",
      "platformType": "official",
      "platform": "智谱 BigModel",
      "type": "new",
      "summary": "智谱 GLM-5.2 于 2026-06-16 发布：744B MoE、MIT 开源、百万上下文，API 输入 $1.40/百万、缓存输入 $0.26/百万、输出 $4.40/百万；新用户注册再送 2000 万 Tokens（永久）；GLM-4-Flash / GLM-4.7-Flash 完全免费。",
      "detail": "### 薅羊毛指南（GLM 系列）\n\n1. **注册即送**：访问 [bigmodel.cn](https://bigmodel.cn) 注册，新用户得 **2000 万 Tokens（永久有效）**。\n2. **白嫖推荐**：`GLM-4-Flash`（128K 上下文）和 `GLM-4.7-Flash`（200K，编程 SOTA）**完全免费**，限 30 并发。\n3. **性价比之选**：`GLM-5.2` 已开源可自部署，API 价格约为闭源旗舰的 **1/6**。\n4. **接口兼容**：OpenAI 兼容格式，Base URL 为 `https://open.bigmodel.cn/api/paas/v4`。\n5. **注意**：免费版有并发限制，生产环境建议按量付费或订阅 **Coding Plan**。",
      "validFrom": "2026-06-16",
      "validUntil": null,
      "price": "新用户 2000 万Tokens(永久) · GLM-4-Flash 免费 · GLM-5.2 $1.40/百万",
      "valueScore": 89,
      "sourceUrl": "https://bigmodel.cn",
      "tags": [
        "智谱",
        "GLM",
        "GLM-5.2",
        "免费额度",
        "MIT开源"
      ],
      "addedAt": "2026-07-26"
    },
    {
      "id": "tencent-hunyuan-free",
      "title": "腾讯云混元 TokenHub：新人免费体验包 100 万 Tokens/年 + Hunyuan-Lite 永久免费",
      "platformType": "official",
      "platform": "腾讯云混元",
      "type": "current",
      "summary": "首次开通混元送 100 万 Tokens（1 年有效）+ 100 万 Embedding Tokens；语言 / 多模态模型均提供 100 万免费体验额度（1 年）；Hunyuan-Lite 永久免费，适合轻量任务。活动截至 2026-12-31。",
      "detail": "**腾讯云混元大模型白嫖指南（截至 2026-12-31）**  \n\n1. **领免费包**：注册并登录 [TokenHub](https://console.cloud.tencent.com/tokenhub)，开通服务即自动发放新人礼包（语言/多模态各 100 万 Tokens，1 年有效）。  \n2. **白嫖主力**：Hunyuan-Lite 模型**永久免费**，适合写正则、翻译、改注释等轻量任务。  \n3. **调用接口**：`https://api.hunyuan.cloud.tencent.com/v1`，兼容 OpenAI SDK，直接替换 base_url 即可。  \n\n> 注：免费额度仅限领取后 1 年，过期作废；活动截止 2026-12-31。",
      "validFrom": "2026-01-01",
      "validUntil": "2026-12-31",
      "price": "新人 100 万Tokens(1年) · Hunyuan-Lite 永久免费",
      "valueScore": 85,
      "sourceUrl": "https://cloud.tencent.com/product/tokenhub",
      "tags": [
        "腾讯云",
        "混元",
        "TokenHub",
        "免费额度",
        "永久免费"
      ],
      "addedAt": "2026-07-26"
    },
    {
      "id": "volc-arkclaw-invite",
      "title": "火山引擎 ArkClaw 邀新活动（已结束）",
      "platformType": "official",
      "platform": "火山引擎",
      "type": "current",
      "summary": "邀请好友开通 ArkClaw，好友享首购 9 折、邀请人得 10% 代金券（上不封顶）。活动已于 2026-07-09 结束，作为真实「超时自动下架」样例保留在数据层。",
      "detail": "### 火山引擎 ArkClaw 限时邀请返利（已过期，仅供验证）\n\n1. **活动时间**：2026.04.01 - 2026.07.09（已结束，前端自动隐藏）\n2. **邀请奖励**：好友首购享 9 折；邀请人得好友首单实付 **10% 代金券**（上不封顶）。\n3. **代金券用途**：仅限 ArkClaw 升级/续费。\n4. **验证提示**：此条 `validUntil=2026-07-09` 已到期，勾选「显示已过期」可查看，用于测试自动下架逻辑。",
      "validFrom": "2026-04-01",
      "validUntil": "2026-07-09",
      "price": "好友 9 折 + 邀请人 10% 代金券（已结束）",
      "valueScore": 70,
      "sourceUrl": "https://docs.volcengine.com/docs/86680/2288710?lang=zh",
      "tags": [
        "火山引擎",
        "ArkClaw",
        "邀请有礼",
        "已结束",
        "样例"
      ],
      "addedAt": "2026-07-26"
    },
    {
      "id": "openrouter-aggregator",
      "title": "OpenRouter：统一 API 聚合 300+ 模型 · 5.5% 充值费 · 免费模型 + BYOK",
      "platformType": "relay",
      "platform": "OpenRouter",
      "type": "current",
      "summary": "一个 API Key 调用 300+ 模型（OpenAI / Anthropic / Google / DeepSeek 等），无按 token 加价仅 5.5% 充值费；提供 26 款免费模型（免费账户 50 次/天）；支持自带密钥(BYOK)免平台费；自动故障转移。",
      "detail": "OpenRouter 薅羊毛指南：\n\n1. **注册并创建 Key**：前往 [https://openrouter.ai](https://openrouter.ai) 注册，生成 API Key（兼容 OpenAI SDK）。\n2. **免费模型白嫖**：使用 DeepSeek-R1、Llama 3.3 70B 等免费模型，**0 token 成本**，免费账户每天 50 次请求。\n3. **充值低费率**：付费模型价格与官方一致，仅收 **5.5% 平台费**，无加价。\n4. **BYOK 免平台费**：自带各厂商 API Key，可免除平台费，并支持多供应商自动故障转移。\n\n> ⚠️ 注意：免费模型有限频，高频生产建议充值或开启 BYOK。",
      "validFrom": null,
      "validUntil": null,
      "price": "聚合 300+ 模型 · 5.5% 充值费 · 26 款免费模型",
      "valueScore": 82,
      "sourceUrl": "https://openrouter.ai",
      "tags": [
        "OpenRouter",
        "中转站",
        "聚合",
        "多模型",
        "BYOK",
        "免费模型"
      ],
      "addedAt": "2026-07-26"
    },
    {
      "id": "value-pick-2026",
      "title": "2026 大模型性价比横向评测：按场景选最值的三档",
      "platformType": "official",
      "platform": "第三方评测",
      "type": "value",
      "summary": "基于各平台公开定价的 2026 大模型性价比评测：超低价高频 / RAG 首选 DeepSeek-V4-Flash（缓存命中 ¥0.02/百万）；中文免费兜底智谱 GLM-4-Flash（永久免费）；多模型统一接入选 OpenRouter / 硅基流动（省去多 Key 管理）。",
      "detail": "**薅羊毛指南（API 调用）**  \n1. **极限低价**：DeepSeek-V4-Flash，缓存命中仅 ¥0.02/百万，长文本/RAG/智能体最省。  \n2. **免费兜底**：智谱 GLM-4-Flash，128K 上下文，开发测试 0 成本。  \n3. **统一接入**：OpenRouter / 硅基流动，一个 Key 调所有模型，免多账号管理。  \n4. **策略**：先用免费/开源跑通，按需升级闭源；高频缓存场景务必开启上下文缓存。  \n（价格以官网为准，随时可能调整）",
      "validFrom": null,
      "validUntil": null,
      "price": "三档推荐 · 评分 82–95",
      "valueScore": 93,
      "sourceUrl": "https://api-docs.deepseek.com/quick_start/pricing",
      "tags": [
        "性价比",
        "评测",
        "推荐",
        "RAG",
        "免费",
        "聚合"
      ],
      "addedAt": "2026-07-26"
    },
    {
      "id": "jisuapi-market",
      "title": "极速数据大模型市场：一个 Key 调 13+ 国产模型，限时 95 折 + 充值赠 10% Credits",
      "platformType": "relay",
      "platform": "极速数据",
      "type": "new",
      "summary": "极速数据大模型市场新上线，一个 API Key 统一接入 DeepSeek / 智谱 GLM / 阿里 Qwen / 月之暗面 Kimi 等 13+ 主流模型；上线福利限时 95 折、充值即返 10% 额外额度（充多少送多少），2026-07-15 起限时名额有限。",
      "detail": "1. **注册领Key**：访问 https://www.jisuapi.com 注册，创建 OpenAI 兼容 API Key（一个 Key 通吃 13 个主流模型，含文本/多模态/代码/推理增强）。  \n2. **充值福利**：所有模型限时 **95 折（折上折）**，且充值即返 **10% 额外 Credits**（充多少送多少）。  \n3. **适用人群**：想快速试水多模型、又不想分别开户的开发者/小企业。  \n4. **注意**：活动 2026-07-15 起限时、名额有限，优惠以官方活动页为准（链接同上）。",
      "validFrom": "2026-07-15",
      "validUntil": null,
      "price": "限时 95 折 · 充值赠 10% Credits",
      "valueScore": 80,
      "sourceUrl": "https://www.jisuapi.com/news/detail/623",
      "tags": [
        "极速数据",
        "中转站",
        "聚合",
        "多模型",
        "限时折扣"
      ],
      "addedAt": "2026-07-27"
    }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = window.DEALS_DATA;
