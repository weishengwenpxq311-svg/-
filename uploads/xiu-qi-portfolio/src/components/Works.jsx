import { useScrollReveal } from '../hooks/useScrollReveal';

const WORKS = [
  {
    year: '2025',
    period: 'Nov — Now',
    company: '云天励飞 · IntelliFusion',
    role: 'AI Product Manager',
    project: '· 噜咔博士拍学机',
    overview:
      '负责噜咔博士 AI 拍学机产品规划与版本迭代，重点负责「家长管控中心」与「AI 创新特效」两大核心模块，同时承担搜索增长 (SEO+GEO) 工作。',
    achievements: [
      { metric: '46.2', unit: '%', desc: ['家长端渗透率', '(23.6% → 46.2%，超目标值 45%)'] },
      { metric: '−44', unit: '%', desc: ['AI 特效生成耗时', '(6.8s → 3.8s)'] },
      { metric: '52.3', unit: '%', desc: ['30 日留存', '(31.2% → 52.3%)'] },
      { metric: '+19', unit: 'pts', desc: ['NPS 提升', '(32 → 51)'] },
    ],
    details: [
      <>
        主导<strong>家长管控中心</strong>需求梳理与功能设计，5 个月内上线 6 项核心功能（探索回放、使用时长管理、兴趣画像、勋章成就等），间接推动 7 天退货率由 8.2% → 4.7%。
      </>,
      <>
        主导 <strong>AI 创新特效</strong>体验优化，新增 3 种场景特效 + 涂鸦上色，风格扩展至 14 种；联合算法组优化生成链路，失败率由 4.3% → 1.2%；日均使用次数 2.7 → 4.8 次。
      </>,
      <>
        基于 <strong>1565 条用户反馈</strong>识别高频问题，推动日漫特效专项优化方案落地，新增特效用户评分稳定在 4.3 分以上。
      </>,
      <>
        同时进行 <strong>SEO + GEO 可见性优化</strong>，梳理关键词体系、FAQ 内容建设、功能页信息结构优化，推动品牌在传统搜索与 AI 搜索场景下的收录、曝光、引用表现提升。
      </>,
    ],
  },
  {
    year: '2024',
    period: 'Dec — 2025 Oct',
    company: '阅响数码科技',
    role: 'AI Product Manager',
    project: '· GEO 体系搭建',
    overview:
      '从 0 到 1 搭建品牌 GEO 体系，负责让 A10 在豆包、DeepSeek、Kimi、元宝、通义千问、文心一言 6 大主流 AI 搜索平台中获得品牌曝光与推荐位。',
    achievements: [
      { metric: '3', unit: '% → 32%', desc: ['6 大 AI 平台品牌可见率', 'TOP3 推荐率达 18%，TOP1 达 6%'] },
      { metric: '6', unit: '×', desc: ['AI 渠道带来官网咨询量增长', '占月咨询总量约 11%'] },
      { metric: '35', unit: '%', desc: ['知乎内容 AI 引用率', '(原 <10%，一周提升至 35%)'] },
      { metric: '5→2', unit: '人', desc: ['客服人力优化，满意度', '4.2 → 4.5，节假日不再加班'] },
    ],
    details: [
      <>
        设计并落地 <strong>7 模块 GEO 自动化工作流</strong>（关键词挖掘 → AI 平台基线诊断 → AIGC 内容生产 → 人工审核 → 多平台分发 → 效果回测 → 数据看板），使用 Dify 搭建核心 AI 流程，n8n 实现跨平台分发，飞书多维表格作为数据中枢。
      </>,
      <>
        提出并迭代 <strong>FACTS Prompt 设计框架</strong>（Frequency / Authority / Clarity / Triplet / Schema），管理 30+ 核心 Prompt 模板的版本演进。
      </>,
      <>
        横向测试 5 款 AI 搜索引擎，反向拆解 AI 引用四大机制（权威性、时效性、结构化程度、多源印证），设计「<strong>权威层 + 种草层 + 印证层</strong>」三层内容矩阵，采用「问-答-证」三段式结构提升 AI 识别效率。
      </>,
      <>
        主导 <strong>AI 售后客服系统</strong>选型与落地，完成 SaaS 平台对接 + 自建知识库 + 多渠道接入（京东、天猫、抖店、官网）。
      </>,
    ],
  },
  {
    year: '2024',
    period: 'Jun — Nov',
    company: '科大讯飞 · iFLYTEK',
    role: 'AIGC Product Intern',
    project: '· 电商内容创新',
    overview:
      '参与电商 AIGC 产品的需求调研与功能设计，围绕商品标题生成、卖点提炼、详情页文案、营销素材、直播话术等 5 类场景输出产品方案与 PRD 文档。',
    achievements: [],
    details: [
      <>
        主导<strong>商品信息结构化模板设计</strong>，联合算法团队迭代 Prompt 模板，推动生成内容在关键词覆盖与营销表达上的准确性提升。
      </>,
      <>
        整理用户反馈并识别高频问题，推动生成链路与交互体验优化，相关方案被纳入<strong>后续版本迭代</strong>。
      </>,
    ],
  },
];

export default function Works() {
  const titleRef = useScrollReveal();

  return (
    <section className="page" id="page-works">
      <div className="works-header">
        <div className="section-label">03 / Selected Works</div>
        <h2 className="scroll-reveal" ref={titleRef}>
          Things I've <em>built</em>.
        </h2>
      </div>

      <div className="timeline">
        {WORKS.map((w, i) => (
          <article className="work-entry" key={i}>
            <div className="work-date">
              <span className="year">{w.year}</span>
              <span>{w.period}</span>
            </div>
            <div className="work-body">
              <div className="work-company">{w.company}</div>
              <h3 className="work-role">
                {w.role} <em>{w.project}</em>
              </h3>
              <p className="work-overview">{w.overview}</p>

              {w.achievements.length > 0 && (
                <div className="work-achievements">
                  {w.achievements.map((a, idx) => (
                    <div className="achievement" key={idx}>
                      <div className="metric">
                        {a.metric}
                        <small>{a.unit}</small>
                      </div>
                      <div className="desc">
                        {a.desc.map((d, di) => (
                          <span key={di}>
                            {d}
                            {di < a.desc.length - 1 && <br />}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="work-details">
                {w.details.map((d, idx) => (
                  <div className="detail-item" key={idx}>
                    <span className="marker">→</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
