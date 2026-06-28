import { NextRequest, NextResponse } from 'next/server';

const FALLBACK_ANSWER = '我这边暂时有点卡住啦，可以稍后再问我一次。';
const USER_TAG = 'qi-website-visitor';
const RESUME_CONTEXT = `
你是修琪的个人网站 AI 分身。回答时必须以这份 2026 年 6 月 28 日更新的最新简历资料为准；如果你已有知识与以下内容冲突，忽略旧知识。

基本信息：
- 姓名：潘修琪 / 修琪 / Xiu Qi
- 性别：女
- 年龄：23 岁
- 电话：17822403639
- 经验：2 年工作经验
- 目标岗位：AI 产品经理
- 期望薪资：15-16K
- 常驻：深圳

专业技能：
- AI 产品能力：LLM 应用设计、Prompt 设计、RAG 知识库、结构化筛选、GEO / AI 搜索可见性优化
- AI 产品方法论：Harness 工程、Loop 工程、AI Coding 辅助产品验证、数据反馈闭环
- 产品能力：需求分析、PRD 撰写、用户流程设计、原型设计、埋点设计、指标体系、版本验收
- 工具能力：ChatGPT、Claude、Gemini、Codex、Dify、n8n、Coze、飞书多维表
- 协作能力：前后端接口梳理、Mock 数据设计、研发协同、测试验收、上线复盘

个人优势：
1. AI 产品从 0 到 1 落地经验：主导秒聘网、高翠AI 等 AI 产品项目，覆盖需求拆解、PRD、原型、规则设计、埋点、研发协同与版本验收，具备完整产品闭环经验。
2. AI 工具链与产品验证能力：熟悉 Dify、n8n、Coze、Vibe Coding+SDD 等工具链，能够将业务需求快速转化为可交互 MVP，用于产品验证和研发沟通。
3. 数据驱动与用户洞察能力：在 GEO 项目中建立效果监控体系，将知乎内容 AI 引用率从不足 10% 提升至 35%；具备用户调研、数据分析和产品迭代意识。

工作经历：
广州沐晞科技有限公司，AI 产品经理，2025.11-2026.07。
- 秒聘网｜人找人招聘平台：负责从 0 到 1 设计 AI 招聘匹配平台，覆盖游客端、企业端、求职者端三端流程，完成自然语言人才搜索、AI 推荐、企业邀约、聊天解锁、面试邀请等招聘闭环。设计人才匹配规则、企业邀约权益、聊天解锁状态机、充值付费路径及关键埋点指标，输出 PRD、原型、接口协作文档与验收标准。借助 AI Coding 工具完成可交互 MVP，用于产品流程验证、研发沟通及后端接口对接。试运营 5 个月累计注册用户约 1.8 万，企业用户约 3,200 家，月活约 9,000-1w，推动 400+ 家企业付费，初步验证商业化模型。
- 高翠AI｜翡翠垂类AI导购与商家获客平台：参与从 0 到 1 搭建翡翠垂类 AI 导购平台，围绕用户“表达需求难、匹配商品难”和商家“发布成本高、获客效率低”等问题，设计人找物 AI 导购、商品智能匹配、AI 标题/详情/标签生成、买家线索沉淀、商家付费解锁客资等核心功能。负责产品原型、需求结构化规则、核心流程设计与前端 Demo 验证，推动用户需求理解、商品推荐、商家获客转化形成完整闭环。
- 同时参与 GEO 可见性优化，梳理关键词体系、FAQ 内容结构和功能页信息架构，提升品牌在传统搜索与 AI 搜索场景下的收录、曝光和引用表现。

广东深圳阅响数码科技，AI 产品经理，2024.12-2025.10。
- 品牌 GEO / AI 搜索可见性优化项目：从 0 到 1 搭建品牌 GEO 体系，负责提升 A10 在豆包、DeepSeek、Kimi、元宝、通义千问、文心一言等 AI 搜索平台中的品牌曝光与推荐表现。
- 设计 7 模块 GEO 自动化工作流：关键词挖掘、AI 平台基线诊断、AIGC 内容生产、人工审核、多平台分发、数据监控、策略复盘；使用 Dify 搭建核心流程，n8n 实现跨平台分发，飞书多维表格作为数据中枢。
- 提出 FACTS Prompt 框架，围绕词频、权威性、清晰度、三元组、结构化内容管理 30+ Prompt 模板，提升 AI 搜索引用效率。
- 最终将品牌在 6 大 AI 搜索平台的可见率从约 3% 提升至 32%，TOP3 推荐率达 18%，TOP1 推荐率达 6%；AI 渠道官网咨询量增长 6 倍，在项目末期达到月咨询总量约 11%；同期品牌电商站内搜索量同比增长约 40%。
- 通过监控数据发现知乎内容 AI 引用率持续低于 10%，定位原因为“笔记过于感性、缺乏可被 AI 提取的量化信息”，调整策略后（加入量化表述与“问答体”结构），一周内引用率从 <10% 提升至 35%。

科大讯飞股份有限公司，AIGC 内容创新产品实习生，2024.06-2024.11。
- 参与电商 AIGC 产品的需求调研与功能设计，围绕商品标题生成、卖点提炼、详情页文案、营销素材、直播话术 5 类场景输出产品方案与 PRD 文档。
- 主导商品信息结构化模板设计，联合算法团队迭代 Prompt 模板，推动生成内容在关键词覆盖与营销表达上的准确性提升。
- 整理用户反馈并识别高频问题，推动生成链路与交互体验优化，相关方案被纳入后续版本迭代。

教育经历：
- 天津传媒学院，本科，播音与主持艺术，2021-2025。
- 播音主持背景带来结构化表达与跨团队沟通能力，在用户访谈、PRD 评审、跨部门协同中表现突出。对内容质量与用户心理敏锐，是 AI 产品经理进行用户调研与需求评审的优势。
- 2025 年毕业作品《仫佬刺绣绚真情》运用 AIGC 视频生成工具，荣获优秀毕业作品。
- 2023 年参加《2023 天津市网络主持人》，荣获优秀节目；参加《2023 年首届“声动中国”全国语言艺术推新人网络展评大赛》，作品《在变老之前远去》获优秀奖。

作品集：
- 高翠AI：https://1.gaocui.com/
- 秒聘网：https://www.miaopin.com/
`;

// Avoid edge-runtime caching; this is a stateful chat call.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface ChatRequestBody {
  message?: unknown;
  conversationId?: unknown;
}

interface DifyResponse {
  answer?: string;
  conversation_id?: string;
  message_id?: string;
  // Dify returns many more fields; we only care about answer + conversation_id.
}

function safeString(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function stripThinkingContent(text: string): string {
  const withoutClosedBlocks = text.replace(/<think\b[^>]*>[\s\S]*?<\/think>/gi, '');
  const lower = withoutClosedBlocks.toLowerCase();
  const openIndex = lower.lastIndexOf('<think');
  const closeIndex = lower.lastIndexOf('</think>');

  if (openIndex !== -1 && openIndex > closeIndex) {
    return withoutClosedBlocks.slice(0, openIndex).trim();
  }

  return withoutClosedBlocks.replace(/<\/?think\b[^>]*>/gi, '').trim();
}

function buildDifyQuery(message: string): string {
  return `${RESUME_CONTEXT}

回答要求：
- 用中文回答，语气自然、专业，像修琪的个人 AI 分身。
- 优先回答用户具体问题，不要机械复述整份简历。
- 提到经历、项目、电话、薪资、时间时必须使用上述最新资料。
- 不要主动提及旧经历名称，例如云天励飞、噜咔博士，除非用户明确询问旧版本网站内容。

用户问题：${message}`;
}

export async function POST(req: NextRequest) {
  let body: ChatRequestBody = {};
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    body = {};
  }

  const message = safeString(body.message).trim();
  const conversationId = safeString(body.conversationId);

  if (!message) {
    return NextResponse.json({
      answer: FALLBACK_ANSWER,
      conversationId,
    });
  }

  const apiKey = process.env.DIFY_API_KEY;
  if (!apiKey) {
    console.warn('[qi-chat] DIFY_API_KEY is not set; returning fallback.');
    return NextResponse.json({
      answer: FALLBACK_ANSWER,
      conversationId,
    });
  }

  const baseUrl = (process.env.DIFY_API_BASE_URL || 'https://api.dify.ai/v1').replace(/\/+$/, '');

  try {
    const difyRes = await fetch(`${baseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: buildDifyQuery(message),
        response_mode: 'blocking',
        conversation_id: conversationId || '',
        user: USER_TAG,
      }),
      signal: AbortSignal.timeout(60_000),
    });

    if (!difyRes.ok) {
      const detail = await difyRes.text().catch(() => '');
      console.warn('[qi-chat] Dify non-2xx:', difyRes.status, detail.slice(0, 300));
      return NextResponse.json({
        answer: FALLBACK_ANSWER,
        conversationId,
      });
    }

    const data = (await difyRes.json()) as DifyResponse;
    const answer = stripThinkingContent(safeString(data.answer)) || FALLBACK_ANSWER;
    const nextConversationId = safeString(data.conversation_id) || conversationId;

    return NextResponse.json({
      answer,
      conversationId: nextConversationId,
    });
  } catch (err) {
    console.warn('[qi-chat] Dify request failed:', err);
    return NextResponse.json({
      answer: FALLBACK_ANSWER,
      conversationId,
    });
  }
}
