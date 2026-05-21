'use client';

import React, { useEffect as useWEffect, useRef as useWRef, useState as useWState } from 'react';
import { useScrollReveal } from './about.jsx';

const WORKS = [
  {
    year: '2025',
    period: '2025.11 — 2026.05',
    company: '云天励飞 · IntelliFusion',
    logo: 'I',
    role: 'AI Product Manager',
    project: '· 噜咔博士拍学机',
    overview: '负责噜咔博士 AI 拍学机产品规划与版本迭代，重点负责「家长管控中心」与「AI 创新特效」两大核心模块，同时承担搜索增长 (SEO+GEO) 工作。',
    achievements: [
      { metric: 46.2, unit: '%',    desc: ['家长端渗透率', '(23.6% → 46.2%，超目标值 45%)'] },
      { metric: -44,  unit: '%',    desc: ['AI 特效生成耗时', '(6.8s → 3.8s)'] },
      { metric: 52.3, unit: '%',    desc: ['30 日留存', '(31.2% → 52.3%)'] },
      { metric: 19,   unit: 'pts',  desc: ['NPS 提升', '(32 → 51)'], plus: true }
    ],
    details: [
      { boldStart: '家长管控中心', body: '需求梳理与功能设计，5 个月内上线 6 项核心功能（探索回放、使用时长管理、兴趣画像、勋章成就等），间接推动 7 天退货率由 8.2% → 4.7%。', lead: '主导' },
      { boldStart: 'AI 创新特效', body: '体验优化，新增 3 种场景特效 + 涂鸦上色，风格扩展至 14 种；联合算法组优化生成链路，失败率由 4.3% → 1.2%；日均使用次数 2.7 → 4.8 次。', lead: '主导' },
      { boldStart: '1565 条用户反馈', body: '识别高频问题，推动日漫特效专项优化方案落地，新增特效用户评分稳定在 4.3 分以上。', lead: '基于' },
      { boldStart: 'AI Coding 工具', body: '完成前端页面搭建与基础逻辑联调，输出可演示 Demo 用于验证产品流程和用户体验，让原型不再只停留在文档层面。', lead: '设计产品原型，借助' },
      { boldStart: 'SEO + GEO 可见性优化', body: '，梳理关键词体系、FAQ 内容建设、功能页信息结构优化，推动品牌在传统搜索与 AI 搜索场景下的收录、曝光、引用表现提升。', lead: '同时进行' }
    ]
  },
  {
    year: '2024',
    period: '2024.12 — 2025.10',
    company: '阅响数码科技',
    logo: 'Y',
    role: 'AI Product Manager',
    project: '· GEO 体系搭建',
    overview: '从 0 到 1 搭建品牌 GEO 体系，负责让 A10 在豆包、DeepSeek、Kimi、元宝、通义千问、文心一言 6 大主流 AI 搜索平台中获得品牌曝光与推荐位。',
    achievements: [
      { metric: 32, unit: '%', desc: ['6 大 AI 平台品牌可见率 (3% → 32%)', 'TOP3 推荐率 18%，TOP1 推荐率 6%'] },
      { metric: 6,  unit: '×', desc: ['AI 渠道带来官网咨询量增长', '占月咨询总量约 11%'] },
      { metric: 40, unit: '%', desc: ['品牌电商站内搜索量', '同比增长'], plus: true },
      { metric: 35, unit: '%', desc: ['知乎内容 AI 引用率', '(原 <10%，一周提升至 35%)'] }
    ],
    details: [
      { boldStart: '7 模块 GEO 自动化工作流', body: '（关键词挖掘 → AI 平台基线诊断 → AIGC 内容生产 → 人工审核 → 多平台分发），使用 Dify 搭建核心 AI 流程，n8n 实现跨平台分发，飞书多维表格作为数据中枢。', lead: '设计并落地' },
      { boldStart: 'FACTS Prompt 设计框架', body: '（Frequency 词频 / Authority 权威 / Clarity 清晰 / Triplet 三元组 / Schema 结构化），管理 30+ 核心 Prompt 模板的版本演进。', lead: '提出并迭代' },
      { boldStart: '权威层 + 种草层 + 印证层', body: ' 三层内容矩阵，采用「问-答-证」三段式结构提升 AI 识别效率。', lead: '横向测试 5 款 AI 搜索引擎，反向拆解 AI 引用四大机制（权威性、时效性、结构化程度、多源印证），设计' },
      { boldStart: 'AI 售后客服系统', body: '选型与落地，完成 SaaS 平台对接 + 自建知识库 + 多渠道接入（京东、天猫、抖店、官网）。', lead: '主导' },
      { boldStart: '"笔记过于感性、缺乏可被 AI 提取的量化信息"', body: '，调整策略（加入量化表述与"问答体"结构）后，一周内引用率从 <10% 提升至 35%。', lead: '通过监控数据发现知乎内容 AI 引用率持续低于 10%，定位原因为' }
    ]
  },
  {
    year: '2024',
    period: '2024.06 — 2024.11',
    company: '科大讯飞 · iFLYTEK',
    logo: 'F',
    role: 'AIGC Product Intern',
    project: '· 电商内容创新',
    overview: '参与电商 AIGC 产品的需求调研与功能设计，围绕商品标题生成、卖点提炼、详情页文案、营销素材、直播话术等 5 类场景输出产品方案与 PRD 文档。',
    achievements: [],
    details: [
      { boldStart: '商品信息结构化模板设计', body: '，联合算法团队迭代 Prompt 模板，推动生成内容在关键词覆盖与营销表达上的准确性提升。', lead: '主导' },
      { boldStart: '后续版本迭代', body: '。', lead: '整理用户反馈并识别高频问题，推动生成链路与交互体验优化，相关方案被纳入' }
    ]
  }
];

const PORTFOLIO_URL = 'https://rcnf9dsdscpk.feishu.cn/drive/folder/Fhk9fN2x1lbXlydr1SMcHz1znbh';

// Count-up metric component
function Metric({ value, unit, plus }) {
  const ref = useWRef(null);
  const [shown, setShown] = useWState(0);
  useWEffect(() => {
    const el = ref.current;
    if (!el) return;
    let played = false;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !played) {
          played = true;
          const target = value;
          const dur = 1200;
          const start = performance.now();
          const tick = (now) => {
            const t = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - t, 3);
            setShown(target * eased);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);
  const isInt = Number.isInteger(value);
  const display = isInt ? Math.round(shown) : shown.toFixed(1);
  return (
    <div className="metric" ref={ref}>
      {plus && value > 0 ? '+' : ''}{display}
      <small>{unit}</small>
    </div>
  );
}

function WorkEntry({ work, idx, expanded, onToggle }) {
  return (
    <article className={'work-entry' + (expanded ? ' expanded' : '')} onClick={onToggle} data-hover>
      <div className="work-date">
        <span className="year">{work.year}</span>
        <span>{work.period}</span>
      </div>
      <div className="work-body">
        <div className="work-company">
          <span className="logo-dot">{work.logo}</span>
          {work.company}
        </div>
        <h3 className="work-role">
          {work.role} <em>{work.project}</em>
          <span className="toggle">[{expanded ? '−' : '+'}]</span>
        </h3>
        <p className="work-overview">{work.overview}</p>

        <div className="work-collapsible">
          {work.achievements.length > 0 && (
            <div className="work-achievements">
              {work.achievements.map((a, i) => (
                <div className="achievement" key={i} data-hover>
                  <Metric value={a.metric} unit={a.unit} plus={a.plus} />
                  <div className="desc">
                    {a.desc.map((d, di) => (
                      <span key={di}>{d}{di < a.desc.length - 1 && <br />}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="work-details">
            {work.details.map((d, i) => (
              <div className="detail-item" key={i}>
                <span className="marker">→</span>
                <span>
                  {d.lead}{' '}
                  <strong>{d.boldStart}</strong>
                  {d.body}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Works() {
  const titleRef = useScrollReveal();
  const [openIdx, setOpenIdx] = useWState(0);

  return (
    <section className="page" id="page-works" data-screen-label="03 Works">
      <a
        className="portfolio-strip"
        href={PORTFOLIO_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-hover
      >
        <span>作品集</span>
        <span>飞书云文档 ↗</span>
      </a>

      <div className="works-header">
        <div className="section-label">03 / 精选作品</div>
        <h2 className="scroll-reveal" ref={titleRef}>
          我做过的<em>作品</em>。
        </h2>
        <p className="lede">点击任一项展开 / 收起完整内容。Click any role to expand or collapse.</p>
      </div>

      <div className="timeline">
        {WORKS.map((w, i) => (
          <WorkEntry
            key={i}
            work={w}
            idx={i}
            expanded={openIdx === i}
            onToggle={(e) => {
              e.stopPropagation();
              setOpenIdx(openIdx === i ? -1 : i);
            }}
          />
        ))}
      </div>
    </section>
  );
}
