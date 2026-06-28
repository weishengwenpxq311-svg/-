'use client';

import React, { useEffect as useWEffect, useRef as useWRef, useState as useWState } from 'react';
import { useScrollReveal } from './about.jsx';

const WORKS = [
  {
    year: '2025',
    period: '2025.11 — 2026.07',
    company: '广州沐晞科技有限公司',
    logo: 'M',
    role: 'AI Product Manager',
    project: '· 秒聘网 / 高翠AI',
    overview: '负责从 0 到 1 设计 AI 招聘匹配平台，并参与搭建翡翠垂类 AI 导购与商家获客平台，覆盖需求拆解、PRD、原型、规则设计、前端 Demo 验证、研发协同、后端接口对接与版本验收。',
    achievements: [
      { metric: 1.8, unit: '万', desc: ['秒聘网试运营累计注册用户', '约 1.8 万'] },
      { metric: 3200, unit: '+', desc: ['企业用户', '约 3,200 家'] },
      { metric: 9000, unit: '+', desc: ['月活用户', '约 9,000-1w'] },
      { metric: 400, unit: '+', desc: ['推动企业付费', '初步验证商业化模型'] }
    ],
    details: [
      { boldStart: '秒聘网｜人找人招聘平台：', body: '负责从 0 到 1 设计 AI 招聘匹配平台，覆盖游客端、企业端、求职者端三端流程，完成自然语言人才搜索、AI 推荐、企业邀约、聊天解锁、面试邀请等招聘闭环。设计人才匹配规则、企业邀约权益、聊天解锁状态机、充值付费路径及关键埋点指标，输出 PRD、原型、接口协作文档与验收标准。借助 AI Coding 工具完成可交互 MVP，用于产品流程验证、研发沟通及后端接口对接。试运营 5 个月累计注册用户约 1.8 万，企业用户约 3,200 家，月活约 9,000-1w，推动 400+ 家企业付费，初步验证商业化模型。', lead: '' },
      { boldStart: '高翠AI｜翡翠垂类AI导购与商家获客平台：', body: '参与从 0 到 1 搭建翡翠垂类 AI 导购平台，围绕用户“表达需求难、匹配商品难”和商家“发布成本高、获客效率低”等问题，设计人找物 AI 导购、商品智能匹配、AI 标题/详情/标签生成、买家线索沉淀、商家付费解锁客资等核心功能。负责产品原型、需求结构化规则、核心流程设计与前端 Demo 验证，推动用户需求理解、商品推荐、商家获客转化形成完整闭环。', lead: '' },
      { boldStart: 'GEO 可见性优化：', body: '同时参与 GEO 可见性优化，梳理关键词体系、FAQ 内容结构和功能页信息架构，提升品牌在传统搜索与 AI 搜索场景下的收录、曝光和引用表现。', lead: '' }
    ]
  },
  {
    year: '2024',
    period: '2024.12 — 2025.10',
    company: '广东深圳阅响数码科技',
    logo: 'Y',
    role: 'AI Product Manager',
    project: '· 品牌 GEO / AI 搜索可见性优化项目',
    overview: '从 0 到 1 搭建品牌 GEO 体系，负责让 A10 在豆包、DeepSeek、Kimi、元宝、通义千问、文心一言 6 大主流 AI 搜索平台中获得品牌曝光与推荐位。',
    achievements: [
      { metric: 32, unit: '%', desc: ['6 大 AI 平台品牌可见率 (3% → 32%)', 'TOP3 推荐率 18%，TOP1 推荐率 6%'] },
      { metric: 6,  unit: '×', desc: ['AI 渠道带来官网咨询量增长', '占月咨询总量约 11%'] },
      { metric: 40, unit: '%', desc: ['品牌电商站内搜索量', '同比增长'], plus: true },
      { metric: 35, unit: '%', desc: ['知乎内容 AI 引用率', '(原 <10%，一周提升至 35%)'] }
    ],
    details: [
      { boldStart: '7 模块 GEO 自动化工作流', body: '（关键词挖掘 → AI 平台基线诊断 → AIGC 内容生产 → 人工审核 → 多平台分发 → 数据监控 → 策略复盘），使用 Dify 搭建核心流程，n8n 实现跨平台分发，飞书多维表格作为数据中枢。', lead: '设计' },
      { boldStart: 'FACTS Prompt 设计框架', body: '（Frequency 词频 / Authority 权威 / Clarity 清晰 / Triplet 三元组 / Schema 结构化），管理 30+ 核心 Prompt 模板的版本演进。', lead: '提出并迭代' },
      { boldStart: '品牌可见率', body: '从约 3% 提升至 32%，TOP3 推荐率达 18%，TOP1 推荐率达 6%，在「家庭 KTV 一体机推荐」类核心问题中实现品牌稳定曝光。', lead: '最终将 6 大 AI 搜索平台的' },
      { boldStart: 'AI 渠道官网咨询量', body: '增长 6 倍，在项目末期达到月咨询总量的约 11%。同期品牌电商站内搜索量同比增长约 40%。', lead: '推动' },
      { boldStart: '"笔记过于感性、缺乏可被 AI 提取的量化信息"', body: '，调整策略（加入量化表述与"问答体"结构）后，一周内引用率从 <10% 提升至 35%。', lead: '通过监控数据发现知乎内容 AI 引用率持续低于 10%，定位原因为' }
    ]
  },
  {
    year: '2024',
    period: '2024.06 — 2024.11',
    company: '科大讯飞 · iFLYTEK',
    logo: 'F',
    role: 'AIGC 内容创新产品实习生',
    project: '· 电商内容创新',
    overview: '参与电商 AIGC 产品的需求调研与功能设计，围绕商品标题生成、卖点提炼、详情页文案、营销素材、直播话术等 5 类场景输出产品方案与 PRD 文档。',
    achievements: [],
    details: [
      { boldStart: '商品信息结构化模板设计', body: '，联合算法团队迭代 Prompt 模板，推动生成内容在关键词覆盖与营销表达上的准确性提升。', lead: '主导' },
      { boldStart: '后续版本迭代', body: '。', lead: '整理用户反馈并识别高频问题，推动生成链路与交互体验优化，相关方案被纳入' }
    ]
  }
];

const PROJECT_LINKS = [
  { label: '高翠AI ↗', href: 'https://1.gaocui.com/' },
  { label: '秒聘网 ↗', href: 'https://www.miaopin.com/' }
];
const CARD_SOUND_SRC = '/assets/dealing-cards.mp3';
const PORTFOLIO_SOUND_SRC = '/assets/dodge-ball.mp3';

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
  const cardSoundRef = useWRef(null);
  const portfolioSoundRef = useWRef(null);

  const playCardSound = () => {
    if (!cardSoundRef.current) {
      cardSoundRef.current = new Audio(CARD_SOUND_SRC);
      cardSoundRef.current.preload = 'auto';
      cardSoundRef.current.volume = 0.42;
    }

    cardSoundRef.current.currentTime = 0;
    cardSoundRef.current.play().catch(() => {});
  };

  const playPortfolioSound = () => {
    if (!portfolioSoundRef.current) {
      portfolioSoundRef.current = new Audio(PORTFOLIO_SOUND_SRC);
      portfolioSoundRef.current.preload = 'auto';
      portfolioSoundRef.current.volume = 0.46;
    }

    portfolioSoundRef.current.currentTime = 0;
    portfolioSoundRef.current.play().catch(() => {});
  };

  return (
    <section className="page" id="page-works" data-screen-label="03 Works">
      <div className="portfolio-strip" data-hover>
        <span>项目集</span>
        <span style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {PROJECT_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playPortfolioSound}
              data-hover
            >
              {link.label}
            </a>
          ))}
        </span>
      </div>

      <div className="works-header">
        <div className="section-label">03 / 过往经历</div>
        <h2 className="scroll-reveal" ref={titleRef}>
          我的<em>过往经历</em>。
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
              playCardSound();
              setOpenIdx(openIdx === i ? -1 : i);
            }}
          />
        ))}
      </div>
    </section>
  );
}
