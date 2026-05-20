'use client';

import React, { useEffect as useAEffect, useRef as useARef, useState as useAState } from 'react';

// ===== Word-level scroll reveal hook =====
export function useScrollReveal() {
  const ref = useARef(null);
  useAEffect(() => {
    const el = ref.current;
    if (!el) return;
    const isCJK = (ch) => /[\u3000-\u303f\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\uff00-\uffef\u3040-\u309f\u30a0-\u30ff]/.test(ch);
    const isCJKPunct = (ch) => /[，。！？、；：""''（）【】《》…—·]/.test(ch);

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) { if (n.nodeValue && n.nodeValue.trim()) nodes.push(n); }
    nodes.forEach(tn => {
      const text = tn.nodeValue;
      const frag = document.createDocumentFragment();
      let buf = '';
      const flush = () => {
        if (!buf) return;
        buf.split(/(\s+)/).forEach(p => {
          if (p === '') return;
          if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p));
          else {
            const s = document.createElement('span');
            s.className = 'word';
            s.textContent = p;
            frag.appendChild(s);
          }
        });
        buf = '';
      };
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (isCJK(ch) || isCJKPunct(ch)) {
          flush();
          const s = document.createElement('span');
          s.className = 'word'; s.textContent = ch;
          frag.appendChild(s);
        } else {
          buf += ch;
        }
      }
      flush();
      tn.parentNode.replaceChild(frag, tn);
    });
    el.style.transform = 'rotate(4deg)';
    el.style.transformOrigin = '0% 60%';
    el.style.willChange = 'transform';

    const update = () => {
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const startY = vh * 1.0;
      const endY = vh * 0.35;
      const top = r.top;
      let p = (startY - top) / (startY - endY);
      p = Math.max(0, Math.min(1, p));
      const rot = 4 * (1 - p);
      el.style.transform = `rotate(${rot}deg)`;
      const words = el.querySelectorAll('.word');
      const total = words.length;
      if (!total) return;
      const stagger = 1 / Math.max(total + 4, 1);
      words.forEach((w, i) => {
        const ws = i * stagger;
        const we = ws + stagger * 4;
        let wp = (p - ws) / (we - ws);
        wp = Math.max(0, Math.min(1, wp));
        const op = 0.12 + 0.88 * wp;
        const bl = 4 * (1 - wp);
        w.style.setProperty('--w-opacity', op);
        w.style.setProperty('--w-blur', bl + 'px');
      });
    };
    let raf = false;
    const onScroll = () => {
      if (raf) return;
      raf = true;
      requestAnimationFrame(() => { raf = false; update(); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return ref;
}

// ===== Skill data with years/usage =====
const SKILL_CATS = [
  { name: 'AI Tools',    tags: [
    { t: 'Codex', y: 'Daily · since 2024' },
    { t: 'Claude', y: 'Daily · since 2024' },
    { t: 'ChatGPT', y: 'Daily · since 2023' },
    { t: 'Gemini', y: 'Weekly · since 2024' },
    { t: 'Midjourney', y: 'Project-based' },
    { t: '即梦', y: 'Weekly · 2024' },
    { t: '可灵', y: 'Weekly · 2025' },
    { t: 'HeyGen', y: 'Project-based' }
  ]},
  { name: 'Product',     tags: [
    { t: 'Figma', y: 'Daily · 2 yrs' },
    { t: 'Axure', y: '2023 — present' },
    { t: '飞书多维表格', y: 'Daily · data ops' }
  ]},
  { name: 'Workflow',    tags: [
    { t: 'Dify', y: 'Built 7-module GEO flow' },
    { t: 'n8n', y: 'Cross-platform sync' },
    { t: 'Coze', y: 'Agents · 2025' }
  ]},
  { name: 'Methodology', tags: [
    { t: 'Harness 工程', y: '产研标准化' },
    { t: 'Prompt Engineering', y: 'FACTS framework' },
    { t: 'RAG 知识库', y: 'Knowledge base' },
    { t: 'Vibe Coding', y: '独立写 Demo' },
    { t: 'SDD', y: 'Spec → Design → Demo' },
    { t: 'GEO / SEO', y: '3% → 32% visibility' }
  ]}
];

// ===== AI Agent (calls our own /api/qi-chat → Dify) =====
const SUGGESTIONS = [
  { label: '💼 项目经历', q: '你做过哪些 AI 产品项目？挑一个最有代表性的讲讲' },
  { label: '✨ 技能优势', q: '你最擅长哪些 AI 工具和方法论？有什么独特优势？' },
  { label: '🎯 岗位匹配', q: '你和 AI 产品经理岗位是怎么匹配的？请结合你的经验说说' },
  { label: '🛠 产品方法', q: '介绍一下你的 Vibe Coding + SDD 产研流程是怎么落地的？' },
  { label: '📬 联系方式', q: '怎么联系修琪？方便加个微信或电话吗？' }
];

const QI_ENDPOINT = '/api/qi-chat';
const FALLBACK_MSG = '我这边暂时有点卡住啦，可以稍后再问我一次。';

function Agent() {
  const [messages, setMessages] = useAState([
    { who: 'bot', text: '你好！我是修琪的 AI 分身。问我任何关于她经历、技能或项目的问题吧 ✨' }
  ]);
  const [input, setInput] = useAState('');
  const [loading, setLoading] = useAState(false);
  const [conversationId, setConversationId] = useAState('');
  const threadRef = useARef(null);

  useAEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [messages, loading]);

  const ask = async (q) => {
    const query = (q || '').trim();
    if (!query || loading) return;
    setMessages(m => [...m, { who: 'me', text: query }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(QI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, conversationId })
      });
      if (!res.ok) throw new Error('bad-status');
      const data = await res.json();
      const answer = (data && typeof data.answer === 'string' && data.answer.trim()) ? data.answer : FALLBACK_MSG;
      setMessages(m => [...m, { who: 'bot', text: answer }]);
      if (data && typeof data.conversationId === 'string' && data.conversationId) {
        setConversationId(data.conversationId);
      }
    } catch (err) {
      setMessages(m => [...m, { who: 'bot', text: FALLBACK_MSG }]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    ask(input);
  };

  const onInputKeyDown = (e) => {
    if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent?.isComposing) return;
    e.preventDefault();
    ask(input);
  };

  return (
    <aside className="agent-slot" data-screen-label="Agent">
      <div className="agent-placeholder-note">// Qi · AI 分身</div>
      <div className="agent-header">
        <div className="agent-avatar">
          <svg viewBox="0 0 24 24">
            <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z" />
          </svg>
        </div>
        <div>
          <div className="agent-name">Qi · AI 分身</div>
          <div className="agent-status">Online · Ready</div>
        </div>
      </div>

      <div className="agent-thread" ref={threadRef}>
        {messages.map((m, i) => (
          <div key={i} className={'agent-bubble' + (m.who === 'me' ? ' me' : '')}>{m.text}</div>
        ))}
        {loading && (
          <div className="agent-bubble thinking">Qi 正在认真想怎么回答你<span className="dots">…</span></div>
        )}
      </div>

      <div className="agent-suggestions">
        {SUGGESTIONS.map(s => (
          <button
            key={s.label}
            type="button"
            className="chip"
            onClick={() => ask(s.q)}
            disabled={loading}
            title={s.q}
            data-hover
          >
            {s.label}
          </button>
        ))}
      </div>

      <form className="agent-input" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="向 Qi 提问..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onInputKeyDown}
          disabled={loading}
        />
        <button type="submit" aria-label="发送" disabled={loading || !input.trim()} data-hover>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </form>
    </aside>
  );
}

export default function About() {
  const helloRef    = useScrollReveal();
  const buildingRef = useScrollReveal();
  const introRef    = useScrollReveal();
  const [pinned, setPinned] = useAState(-1);

  const togglePin = (i) => setPinned(p => p === i ? -1 : i);

  const STRENGTHS = [
    {
      num: '01.',
      title: '完整 AI 产品闭环经验',
      body: (
        <p>
          主导噜咔博士 AI 拍学机「家长管控中心」与「AI 创新特效」两大核心模块，独立完成需求拆解、PRD 撰写、Figma 原型、埋点设计与版本推进全流程；
          <span className="hl">5 个月内推动小程序 MAU 由 16.5K 提升至 38.2K</span>。
        </p>
      )
    },
    {
      num: '02.',
      title: '能下场的 AI 工具链实操能力',
      body: (
        <p>
          独立用 Dify 搭建 GEO 全链路自动化工作流（关键词挖掘→内容生产→多平台分发），
          <span className="hl">将原本依赖人工的内容运营流程系统化落地</span>；
          通过 Vibe Coding 独立实现噜咔博士小程序主页面交互 Demo，直接参与产品验证而非停留在文档层面。
        </p>
      )
    },
    {
      num: '03.',
      title: '精通 Vibe Coding + SDD 标准化产研流程',
      body: (
        <p>
          熟练运用 <strong>Vibe Coding</strong> 自然语言驱动开发范式，依照 <span className="hl">SDD（Spec → Design → Demo）</span> 三步法，可独立完成 AI 产品从需求拆解、规则定义、架构设计到 API 对接、可交互原型落地的全链路；快速验证产品创意，大幅缩短研发周期，适配 AI 产品快速迭代节奏。
        </p>
      )
    },
    {
      num: '04.',
      title: '数据驱动的产品迭代闭环 + 真实 C 端用户洞察',
      body: (
        <p>
          在 GEO 项目中独立建立效果监控体系，
          <span className="hl">将知乎内容 AI 引用率从不足 10% 提升至 35%</span>，习惯以量化指标推动迭代。2 年直播带货经验，单场峰值 5000+ 在线，亲历用户决策链路，对用户真实痛点有直接感知。
        </p>
      )
    }
  ];

  return (
    <section className="page" id="page-about" data-screen-label="02 About">
      <div className="about-layout">
        <div className="about-header">
          <div>
            <div className="section-label">01 / About Me</div>
            <h2 className="scroll-reveal" ref={helloRef}>
              Hello, <em>I'm 修琪.</em>
            </h2>
          </div>
          <div className="about-meta">
            <div className="row"><span>Role</span><span>AI Product Manager</span></div>
            <div className="row"><span>Experience</span><span>2 Years</span></div>
            <div className="row"><span>Based</span><span>Shenzhen, CN</span></div>
            <div className="row"><span>Status</span><span><span className="status-dot"></span>Open to work</span></div>
          </div>
        </div>

        <div className="about-content">
          <div className="about-main">
            <h3 className="scroll-reveal" ref={buildingRef}>
              Building AI that <span className="hl">actually ships</span>.
            </h3>
            <p className="intro scroll-reveal" ref={introRef}>
              我是修琪，一位 23 岁的<strong>AI 产品经理</strong>，专注于让 AI 产品真正走进用户的生活。
              从 0 到 1 搭建过品牌 GEO 体系，主导过千万级用户硬件产品的核心模块，
              既能写 PRD、画原型，也能下场用 Dify、n8n、Vibe Coding 直接做出可用的产品 Demo——
              让 AI 不止停留在文档里，而是真正解决问题。
            </p>

            <div className="strengths">
              {STRENGTHS.map((s, i) => (
                <div
                  key={i}
                  className={'strength' + (pinned === i ? ' pinned' : '')}
                  onClick={() => togglePin(i)}
                  data-hover
                >
                  <div className="num">{s.num}</div>
                  <div className="body">
                    <h4>{s.title}</h4>
                    <span className="read-hint">Hover or click to read · 悬停或点击展开</span>
                    <div className="desc"><div>{s.body}</div></div>
                  </div>
                  <div className="arrow">{pinned === i ? '↓' : '→'}</div>
                </div>
              ))}
            </div>
          </div>

          <Agent />
        </div>

        <div className="skills-block">
          <div className="section-label">02 / Toolkit</div>
          <div className="skills-grid">
            {SKILL_CATS.map(cat => (
              <div key={cat.name} className="skill-cat">
                <div className="cat-name">
                  <span>{cat.name}</span>
                  <span className="cnt">{String(cat.tags.length).padStart(2,'0')}</span>
                </div>
                <div className="tags">
                  {cat.tags.map(tag => (
                    <span key={tag.t} className="tag" data-year={tag.y} data-hover>{tag.t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
