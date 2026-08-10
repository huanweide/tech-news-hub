/* 模型优惠圈 · 数据层（由 scripts/deals_update.cjs 依据 deals-sources.json 自动生成） */
window.DEALS_DATA = {
  "meta": {
    "updatedAt": "2026-08-10",
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
      "detail": "**硅基流动（SiliconFlow）薅羊毛指南**  \n\n1. **注册领券**：通过官方链接（https://cloud.siliconflow.cn）注册并完成手机验证，双方各得 **16元通用券**（≈2000万Tokens，永久有效，Pro模型可用）。  \n2. **邀请返利**：在「邀请有礼」生成专属链接，好友注册并消耗额度后，你持续得券，**上不封顶**。  \n3. **API调用**：使用统一OpenAI兼容接口（`/v1`），支持DeepSeek-V3/R1、Qwen3、GLM等模型，按token计费。  \n\n*注：代金券具体面额以活动页为准，通用全平台模型。*",
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
      "detail": "**火山方舟 Coding Plan 薅羊毛指南**  \n1. **注册开通**：注册[火山引擎](https://www.volcengine.com/)账号，进入「火山方舟」开通模型服务。  \n2. **订阅优惠**：新用户首月 **¥9.9**（原价 ¥40），首季 **¥60**（原价 ¥120）；支持 Claude Code/Cursor/VSCode 等 10+ 工具，额度共享。  \n3. **邀请返利**：邀请好友订阅，好友享 9 折，你得 **10% 代金券**（可续费，上不封顶）。  \n4. **豆包按量计费**：适合中文客服/内容生成/RAG 高频场景。  \n注：代金券有效期及适用范围见官方活动页。",
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
      "title": "DeepSeek-V4 降价 75%（拟整体上调·待生效）：缓存命中低至 ¥0.025/百万 tokens",
      "platformType": "official",
      "platform": "DeepSeek",
      "type": "pricecut",
      "summary": "DeepSeek-V4 当前价为 2026-05-31 起降价 75% 后的水平（V4-Pro 输入缓存命中 ¥0.025/百万、V4-Flash 缓存命中 ¥0.02/百万）；但 8月6日官方公告称计划近期整体上调 API 定价（预计涨幅较大，具体方案待正式通知），当前低价仍有效、建议尽早锁定用量。",
      "detail": "DeepSeek API 薅羊毛指南（2026-05-31 起生效）\n\n**1. 核心羊毛（新价格）**\n- **Flash 版**：缓存命中仅 $0.0028/百万（≈¥0.02），未命中 $0.14/百万，输出 $0.28/百万。\n- **Pro 版**：缓存命中 $0.025/百万（≈¥0.18），未命中 $3/百万，输出 $6/百万；75% 折扣已永久化。\n\n**2. 适用场景**\n- 长文本、RAG、智能体等高缓存命中场景，成本比闭源旗舰低一个数量级。\n\n**3. 接口与操作**\n- 接口：`https://api.deepseek.com`，支持 OpenAI / Anthropic 双格式，直接切换即可。\n\n**4. 风险预警（必看）**\n- 官方 2026-08-06 公告：近期将整体上调 API 价格，涨幅较大；6 月底已引入峰谷定价（高峰 2 倍）。\n- **建议**：高频用户趁现价尽早锁定用量，或评估多云 / 自部署对冲。\n\n> 价格以官方定价页为准，随时可能变动。",
      "validFrom": "2026-05-31",
      "validUntil": null,
      "price": "V4-Flash 缓存命中 ¥0.02/百万 · V4-Pro ¥0.025/百万",
      "valueScore": 95,
      "sourceUrl": "https://api-docs.deepseek.com/quick_start/pricing",
      "tags": [
        "DeepSeek",
        "降价",
        "性价比",
        "V4",
        "缓存命中",
        "拟上调"
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
      "detail": "**阿里云百炼模型薅羊毛指南**  \n\n1. **新用户免费额度**：注册并完成实名认证，首次开通「百炼」即送 **7000 万 Tokens**（90 天有效，所有模型共享）。  \n2. **永久免费选项**：  \n   - **Qwen-Turbo** 永久免费，适合高频轻量调用。  \n   - **网页对话端** 永久免费（超高频长文本会轻度限流）。  \n3. **低价模型**：**Qwen3.7-Flash** 输入 ¥0.03/百万、输出 ¥0.06/百万，适合批量简单文本。  \n\n**注意**：免费额度仅限实时推理，不抵扣 Batch / 缓存 / 微调 / 部署费用。  \n\n👉 注册链接：[阿里云百炼](https://bailian.console.aliyun.com/)",
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
      "detail": "### 智谱AI 薅羊毛指南\n\n1. **注册领免费Tokens**：访问 [bigmodel.cn](https://bigmodel.cn) 注册，新用户送 **2000万 Tokens（永久有效）**。\n\n2. **免费模型直接用**：**GLM-4-Flash**（128K上下文）和 **GLM-4.7-Flash**（200K上下文，编程SOTA）**完全免费**，限30并发。\n\n3. **高性价比主力**：**GLM-5.2** 已上线，MIT开源可自部署，API定价约闭源旗舰的 **1/6**。\n\n4. **接口对接**：接口地址 `https://open.bigmodel.cn/api/paas/v4`，**OpenAI兼容**，无缝切换。\n\n> ⚠️ 注意：免费版有并发限制，生产环境建议按量付费或订阅 **Coding Plan**。",
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
      "detail": "**腾讯云混元大模型免费薅羊毛指南**  \n\n1. **领取入口**：登录 [TokenHub 开通服务](https://console.cloud.tencent.com/tokenhub) 即自动发新人包（无需手动领取）。  \n2. **免费额度**：语言模型 100 万 Tokens（1 年）、多模态理解模型 100 万 Tokens（1 年）＋视觉/3D 等额度；另有 **Hunyuan-Lite 永久免费**（够用，适合正则/翻译/改注释）。  \n3. **白嫖用法**：接口 `https://api.hunyuan.cloud.tencent.com/v1`，完全兼容 OpenAI SDK，直接替换 base_url 即可接入。  \n4. **注意**：免费包自领取起 1 年有效，过期作废；活动截止 **2026-12-31**，速领。",
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
      "detail": "### 火山引擎 ArkClaw 邀新返券指南\n\n- **活动时间**：2026.04.01 - 2026.07.09（已过期，前端自动隐藏，勾选「显示已过期」可查看验证）\n- **核心权益**：好友首购 9 折；邀请人得好友首单实付 10% 代金券，上不封顶。\n- **代金券用途**：仅限 ArkClaw 升级 / 续费。\n- **操作路径**：分享专属邀请链接 → 好友完成首次开通 → 返券自动到账。\n\n> 注：当前日期已超过 validUntil，活动已失效，此条目用于验证自动下架机制。",
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
      "detail": "**OpenRouter 薅羊毛指南**  \n\n1. **注册并免费调用**：前往 [OpenRouter](https://openrouter.ai) 注册，创建 API Key 后直接用 OpenAI SDK 调用；免费模型（DeepSeek-R1、Llama 3.3 70B）零 token 成本，每日 50 次。  \n2. **低价充值**：充值仅收 5.5% 平台费，模型价格与官方一致，无加价。  \n3. **终极免费**：开启 BYOK（自带各厂商 Key）免平台费，且多供应商自动故障转移，提升可用性。  \n4. **注意**：免费模型限频；生产环境高频建议充值或 BYOK。",
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
      "detail": "这里帮你把信息浓缩成一份“薅羊毛”快速指南，保留核心动作与成本：\n\n**薅羊毛指南（精简版）**\n\n1. **预算为零选智谱**：GLM-4-Flash 完全免费，128K 上下文，直接用于开发测试，零成本跑通。\n2. **量大低价选 DeepSeek-V4-Flash**：缓存命中仅 ¥0.02/百万，适合长文本、RAG 等高频场景，务必开启上下文缓存，成本最低。\n3. **多模型统一管理选 OpenRouter / 硅基流动**：用一个 Key 调全部模型，省去多平台多账号烦恼。\n4. **使用顺序建议**：先用免费/开源（GLM-Flash）跑通，再按效果升级闭源；高频场景优先用 DeepSeek（开缓存）。\n\n> 价格以各平台官网实时公示为准。",
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
      "detail": "**薅羊毛指南**  \n\n1. **注册领 Key**：访问 [极速API](https://www.jisuapi.com) 注册，创建 OpenAI 兼容的 API Key（一个 Key 通用 13 个主流模型，免逐个对接）。  \n2. **限时折扣**：所有模型 95 折（折上折），充值再返 10% 额外 Credits（充多少送多少）。  \n3. **适用人群**：想快速试水多模型、不想分别开户的开发者/小企业。  \n4. **注意**：活动 2026-07-15 起限时、名额有限，以官方活动页为准。",
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
    },
    {
      "id": "qoder-qwen38-free",
      "title": "Qoder × Qwen3.8-Max 限时免费调用：新/老用户各领 800 次 + 错峰 5 折",
      "platformType": "official",
      "platform": "Qoder",
      "type": "new",
      "summary": "Qoder 一周年叠加 Qwen3.8-Max（2.4T 参数新旗舰）全端首发：新注册与活动前付费用户各领 800 次免费调用，活动期间下单再叠 2000 次；错峰时段（22:00–08:00）5 折。领取截止 2026-09-03，调用有效期至 2026-09-30。",
      "detail": "**Qwen3.8-Max 薅羊毛指南（个人版）**\n\n1. **领基础额度**：8月3日起在 Qoder（桌面端/插件/CLI/移动端）内一键领取，新注册用户（Pro Trial）及8月3日前有付费订单的存量用户，各得 **800 次免费调用**（限领1次）。\n2. **叠加新单福利**：活动期内新购 Pro/Pro+/Ultra/个人资源包，再得 **2000 次调用**（可与800次叠加，约200个任务）。\n3. **错峰5折**：白天原价，22:00–08:00 调用 Qwen3.8-Max 享 **5折**，适合夜间批量跑代码/推理。\n4. **截止与范围**：个人版专属，领取截止 **2026-09-03 23:59**，额度有效期至 **2026-09-30**；详见官方活动页。",
      "validFrom": "2026-08-03",
      "validUntil": "2026-09-03",
      "price": "新/老用户 800 次 + 下单叠 2000 次 · 错峰 5 折",
      "valueScore": 81,
      "sourceUrl": "https://docs.qoder.com/zh/events/qwen-max",
      "tags": [
        "Qoder",
        "Qwen3.8-Max",
        "限时免费",
        "通义千问",
        "阿里"
      ],
      "addedAt": "2026-08-10"
    }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = window.DEALS_DATA;
