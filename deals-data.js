/* 模型优惠圈 · 数据层（由 scripts/deals_update.cjs 依据 deals-sources.json 自动生成） */
window.DEALS_DATA = {
  "meta": {
    "updatedAt": "2026-07-26",
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
      "detail": "薅羊毛步骤：\n1. 通过官方邀请链接（https://cloud.siliconflow.cn）注册账号；\n2. 完成手机号验证后，双方各得 16 元通用代金券（约 2000 万 Tokens，永久有效，Pro 模型也可用）；\n3. 在「邀请有礼」生成自己的邀请链接，好友注册并消耗额度后你持续获得代金券，上不封顶；\n4. 调用统一 OpenAI 兼容 /v1 接口，模型列表含 DeepSeek-V3/R1、Qwen3、GLM 等，按 token 计费。\n注：代金券为平台通用权益，具体面额以活动页为准。",
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
      "detail": "薅羊毛步骤：\n1. 注册火山引擎账号，进入「火山方舟」开通模型服务；\n2. 订阅 Coding Plan：新用户首月 ¥9.9（原价 ¥40），首季 ¥60（原价 ¥120），支持 Claude Code / Cursor / VSCode 等十多款工具，额度共享；\n3. 参与「限时邀请有礼」：邀请好友订阅 Coding Plan，好友享 9 折，邀请人得 10% 代金券（可用于续费，上不封顶）；\n4. 豆包系列按量计费，适合中文客服 / 内容生成 / RAG 高频场景。\n注：代金券有效期与适用范围以官方活动页为准。",
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
      "detail": "降价要点（官方定价页，2026-05-31 起生效）：\n1. DeepSeek-V4-Flash：输入缓存命中 $0.0028/百万（≈¥0.02），缓存未命中 $0.14/百万，输出 $0.28/百万；\n2. DeepSeek-V4-Pro：输入缓存命中 $0.025/百万（≈¥0.18）官方公示 ¥0.025/百万档，缓存未命中 $3/百万，输出 $6/百万；75% 折扣已永久化；\n3. 适用：长文本、RAG、智能体等高缓存命中场景，成本较闭源旗舰低一个数量级；\n4. 接口：https://api.deepseek.com ，OpenAI / Anthropic 双格式兼容。\n注：价格为官方公示，随官方调整而变化，以定价页为准。",
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
      "detail": "薅羊毛步骤：\n1. 注册阿里云账号并完成实名认证，首次开通「百炼」即获 7000 万免费 Tokens（90 天有效，各模型共享）；\n2. Qwen-Turbo 永久免费，适合高频轻量调用；\n3. Qwen3.7-Flash 输入 ¥0.03/百万、输出 ¥0.06/百万，适合批量简单文本；\n4. 网页对话端永久免费（超高频长文本会轻度限流）。\n注：免费额度仅用于实时推理，不抵 Batch / 缓存 / 微调 / 部署。",
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
      "detail": "薅羊毛步骤：\n1. 访问 https://bigmodel.cn 注册，新用户即送 2000 万 Tokens（永久有效）；\n2. GLM-4-Flash（128K 上下文）、GLM-4.7-Flash（200K 上下文，编程 SOTA）完全免费，限 30 并发；\n3. GLM-5.2 新上线，MIT 开源可自部署，API 定价约闭源旗舰 1/6；\n4. 接口：https://open.bigmodel.cn/api/paas/v4 ，OpenAI 兼容。\n注：免费版有并发限制，生产建议按量或订阅 Coding Plan。",
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
      "detail": "薅羊毛步骤：\n1. 登录腾讯云大模型服务平台 TokenHub，开通服务后自动发放新人免费体验包；\n2. 语言模型 100 万 Tokens（1 年）、多模态理解模型 100 万 Tokens（1 年）、视觉 / 3D 等也有免费额度；\n3. Hunyuan-Lite 永久免费，写正则、翻译、改注释等轻量任务够用；\n4. 接口：https://api.hunyuan.cloud.tencent.com/v1 ，完全兼容 OpenAI SDK。\n注：免费额度自领取起 1 年有效，过期未用自动失效；本期活动截至 2026-12-31。",
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
      "detail": "真实活动规则（来源：火山引擎官方文档）：\n1. 活动时间 2026.04.01 - 2026.07.09；\n2. 受邀好友首次开通 ArkClaw，可享首购活动价 9 折；\n3. 邀请人每成功邀请 1 名有效好友，得该好友首单实付金额 10% 的产品代金券，上不封顶；\n4. 代金券可用于 ArkClaw 升级 / 续费。\n该条目 validUntil=2026-07-09 已过期，前端默认自动隐藏（勾选「显示已过期」可见），用于验证自动下架机制。",
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
      "detail": "薅羊毛步骤：\n1. 在 https://openrouter.ai 注册并创建 API Key（OpenAI SDK 直接可用）；\n2. 免费模型（如 DeepSeek-R1、Llama 3.3 70B）零 token 成本，免费账户 50 次/天；\n3. 充值仅收 5.5% 平台费，模型价格与官方一致，无额外加价；\n4. 开启 BYOK（自带各厂商 Key）可免平台费；多供应商自动故障转移提升可用性。\n注：免费模型限频；生产高频建议充值或 BYOK。",
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
      "detail": "性价比推荐（评分 1–100，越高越值；依据各平台官方定价页）：\n★ 极限低价档（95）：DeepSeek-V4-Flash，缓存命中 ¥0.02/百万，长文本 / RAG / 智能体场景成本最低；\n★ 中文免费兜底档（89）：智谱 GLM-4-Flash 完全免费（128K 上下文），开发测试零成本；\n★ 多模型统一接入档（85）：OpenRouter / 硅基流动，一个 Key 调全部模型，省去多账号多 Key 管理；\n结论：先用开源 / 免费跑通，再按质量缺口升级闭源；高频缓存场景务必开启上下文缓存。\n注：价格为各平台官网公示，随官方调整而变化。",
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
    }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = window.DEALS_DATA;
