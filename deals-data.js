/* 模型优惠圈 · 数据层（R18）
 * 集中发布中转站与大模型平台的优惠资讯。
 * 字段说明：
 *   id           唯一标识（幂等追加依据）
 *   title        优惠标题
 *   platformType "relay"(中转站) | "official"(大模型官方直降)
 *   platform     平台名称（如 硅基流动 / 火山引擎 / Workbuddy / 龙虾）
 *   type         "current"(当前优惠) | "new"(新上线) | "pricecut"(降价预告) | "value"(性价比推荐)
 *   summary      一句话摘要
 *   detail       详细说明 / 薅羊毛指南（可多段，用 \n 分隔）
 *   validFrom    生效日期（ISO，可空=长期有效）
 *   validUntil   失效日期（ISO，可空=长期有效）；超时前端自动下架
 *   price        价格/额度信息
 *   valueScore   性价比评分 1–100（type=value 时使用）
 *   sourceUrl    原文/活动链接
 *   tags         标签数组
 *   addedAt      上架日期（ISO）
 * 自动过期：前端渲染时 validUntil < 当前日期 的条目默认隐藏（可勾选"显示已过期"查看）。
 */
window.DEALS_DATA = {
  meta: {
    updatedAt: "2026-07-26",
    note: "模型优惠圈：中转站与大模型平台优惠资讯集中发布，超时自动下架。"
  },
  deals: [
    {
      id: "siliconflow-invite",
      title: "硅基流动（SiliconFlow）邀请官政策：API 获取教程与薅羊毛指南",
      platformType: "official",
      platform: "硅基流动",
      type: "current",
      summary: "新用户通过邀请官链接注册即赠免费体验额度，邀请双方均有返现，是零成本试用 DeepSeek/Qwen 等开源权重模型的入口。",
      detail: "薅羊毛步骤：\n1. 通过邀请官专属链接（如 https://cloud.siliconflow.cn）注册账号；\n2. 完成手机号验证后账户自动到账 ¥0 体验额度（具体面额以活动页为准）；\n3. 在「邀请有礼」生成自己的邀请链接，好友注册并消耗额度后你获 5%–8% 返现；\n4. 调用统一 OpenAI 兼容 /v1 接口，模型列表含 DeepSeek-V3、Qwen3、GLM 等，按 token 计费。\n注意：体验额度通常有有效期，建议尽快消耗；返现为账户余额，可抵后续调用。",
      validFrom: "2026-07-01",
      validUntil: "2026-08-31",
      price: "注册赠免费体验额度 + 双向邀请返现 5%–8%",
      valueScore: 86,
      sourceUrl: "https://siliconflow.cn",
      tags: ["硅基流动", "邀请官", "免费额度", "API", "开源权重"],
      addedAt: "2026-07-20"
    },
    {
      id: "volcengine-promo",
      title: "火山引擎方舟大模型平台优惠活动：新客代金券 + 推理折扣",
      platformType: "official",
      platform: "火山引擎",
      type: "current",
      summary: "字节火山引擎方舟平台面向新用户提供代金券，Doubao 系列与豆包大模型推理按量计费享折扣，适合中文场景批量调用。",
      detail: "活动要点：\n1. 新注册企业/个人用户可领代金券包（面额与门槛以活动页为准）；\n2. Doubao 系列模型推理调用享限时折扣；\n3. 支持并发扩容与模型微调，控制台一键部署。\n适用：客服、内容生成、RAG 等中文高频场景。",
      validFrom: "2026-07-15",
      validUntil: "2026-09-15",
      price: "新客代金券 + Doubao 推理限时折扣",
      valueScore: 82,
      sourceUrl: "https://www.volcengine.com/product/ark",
      tags: ["火山引擎", "方舟", "Doubao", "代金券", "中文场景"],
      addedAt: "2026-07-18"
    },
    {
      id: "workbuddy-relay",
      title: "Workbuddy 中转站：聚合多模型一键调用，新用户赠送额度",
      platformType: "relay",
      platform: "Workbuddy",
      type: "current",
      summary: "Workbuddy 中转站聚合 OpenAI / Claude / Gemini 等多家模型，统一 API 与计费，新用户注册赠送试用额度，适合多模型对比与开发调试。",
      detail: "薅羊毛步骤：\n1. 注册 Workbuddy 账户，新用户获赠试用额度；\n2. 在控制台获取统一 API Key，base URL 兼容 OpenAI /v1；\n3. 按模型分别计费，可在一处切换 GPT / Claude / Gemini；\n4. 适合需要跨模型一致接口的开发与评测。",
      validFrom: "2026-07-10",
      validUntil: "2026-12-31",
      price: "新用户赠送试用额度 · 多模型统一计费",
      valueScore: 80,
      sourceUrl: "https://www.workbuddy.ai",
      tags: ["Workbuddy", "中转站", "多模型", "统一API", "试用额度"],
      addedAt: "2026-07-12"
    },
    {
      id: "lobster-relay-new",
      title: "龙虾中转站新上线：低延迟聚合 + 首充赠送",
      platformType: "relay",
      platform: "龙虾",
      type: "new",
      summary: "龙虾中转站本周新上线，主打低延迟聚合多家大模型，首充赠送额度并支持按量结算，适合对延迟敏感的应用。",
      detail: "新上线亮点：\n1. 首充赠送额度（面额以活动页为准）；\n2. 多节点低延迟路由，适合实时对话；\n3. 兼容 OpenAI /v1，迁移成本低；\n4. 按量结算，无最低消费。",
      validFrom: "2026-07-22",
      validUntil: "2026-10-22",
      price: "首充赠送额度 · 按量结算无最低消费",
      valueScore: 78,
      sourceUrl: "https://example.com/lobster",
      tags: ["龙虾", "中转站", "新上线", "低延迟", "首充赠送"],
      addedAt: "2026-07-22"
    },
    {
      id: "model-pricecut-q3",
      title: "多家大模型厂商 Q3 降价预告：API 价格区间与生效节点",
      platformType: "official",
      platform: "多家厂商",
      type: "pricecut",
      summary: "Q3 多家厂商预告 API 降价：主流 7B–70B 级别模型输入价下探至 ¥0.5–2 / 百万 token，生效节点集中在 8 月初，长上下文模型降幅更明显。",
      detail: "降价区间与节点（预告，以官方为准）：\n1. 国产开源权重派：7B 级输入价约 ¥0.5–1 / 百万 token，8 月初生效；\n2. 闭源旗舰派：长上下文版本降幅 20%–40%，8 月中生效；\n3. 批量/缓存命中价更低，适合高频 RAG。\n建议：价格敏感业务可在 8 月初切换或重新议价。",
      validFrom: "2026-07-20",
      validUntil: "2026-08-20",
      price: "输入价 ¥0.5–2 / 百万 token（预告）",
      valueScore: 75,
      sourceUrl: "https://example.com/price-cut-q3",
      tags: ["降价预告", "Q3", "API价格", "长上下文", "性价比"],
      addedAt: "2026-07-21"
    },
    {
      id: "thirdparty-value-pick",
      title: "第三方机构模型性价比评测推荐：本季最值得买的 3 档",
      platformType: "official",
      platform: "第三方评测",
      type: "value",
      summary: "综合推理质量、价格、延迟三项，第三方评测给出三档推荐：轻量落地选 7B 级开源权重，综合首选中端闭源，长文档选长上下文特化模型。",
      detail: "性价比推荐（评分 1–100，越高越值）：\n★ 轻量落地档（92）：7B 级开源权重 + 中转站，成本最低，覆盖 80% 通用任务；\n★ 综合首选档（88）：中端闭源模型，质量/价格平衡最佳；\n★ 长文档档（85）：长上下文特化模型，RAG/法律/论文场景更值。\n结论：先用开源权重跑通，再按质量缺口升级闭源。",
      validFrom: "2026-07-01",
      validUntil: "2026-12-31",
      price: "三档推荐 · 评分 85–92",
      valueScore: 92,
      sourceUrl: "https://example.com/value-pick",
      tags: ["性价比", "评测", "推荐", "开源权重", "闭源"],
      addedAt: "2026-07-15"
    },
    {
      id: "upcoming-gpu-voucher",
      title: "即将开始：某云 GPU 算力券预告（8/5 开抢）",
      platformType: "official",
      platform: "某云算力",
      type: "pricecut",
      summary: "预告 8 月 5 日开放 GPU 算力券抢领，面向微调/推理场景，面额与门槛以官方为准，当前为预告阶段。",
      detail: "预告内容：\n1. 开放时间：2026-08-05；\n2. 适用：模型微调与推理 GPU 实例；\n3. 面额与抢领规则以官方公告为准。\n当前状态：尚未开始，到点后状态自动变为「进行中」。",
      validFrom: "2026-08-05",
      validUntil: "2026-09-05",
      price: "GPU 算力券（预告·未开始）",
      valueScore: 70,
      sourceUrl: "https://example.com/gpu-voucher",
      tags: ["预告", "GPU", "算力券", "微调", "推理"],
      addedAt: "2026-07-24"
    },
    {
      id: "expired-spring-relay",
      title: "（已过期示例）春季中转站首单立减活动",
      platformType: "relay",
      platform: "某中转站",
      type: "current",
      summary: "该活动已于 2026-07-10 结束，作为自动下架机制的样例保留在数据层；默认不展示，勾选「显示已过期」可见。",
      detail: "这是一条已过期优惠，用于验证「超时自动下架」：前端渲染时 validUntil < 今天 的条目默认隐藏。",
      validFrom: "2026-04-01",
      validUntil: "2026-07-10",
      price: "首单立减（已结束）",
      valueScore: 60,
      sourceUrl: "https://example.com/spring-relay",
      tags: ["已过期", "示例", "中转站"],
      addedAt: "2026-04-01"
    }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = window.DEALS_DATA;
