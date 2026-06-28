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
  { name: 'AI Product', tags: [
    { t: 'LLM 应用设计', y: 'AI product design' },
    { t: 'Prompt 设计', y: 'Prompt workflow' },
    { t: 'RAG 知识库', y: 'Knowledge base' },
    { t: '结构化筛选', y: 'Structured matching' },
    { t: 'GEO / AI 搜索可见性优化', y: '3% → 32% visibility' }
  ]},
  { name: 'Methodology', tags: [
    { t: 'Harness 工程', y: 'Product engineering' },
    { t: 'Loop 工程', y: 'Feedback loop' },
    { t: 'AI Coding', y: 'Demo validation' },
    { t: 'Vibe Coding', y: 'Spec to demo' },
    { t: 'SDD', y: 'Spec → Design → Demo' },
    { t: '数据反馈闭环', y: 'Data-driven iteration' }
  ]},
  { name: 'Product', tags: [
    { t: '需求分析', y: 'Requirements' },
    { t: 'PRD 撰写', y: 'PRD writing' },
    { t: '用户流程设计', y: 'User flow' },
    { t: '原型设计', y: 'Prototype' },
    { t: '埋点设计', y: 'Tracking design' },
    { t: '指标体系', y: 'Metric system' },
    { t: '版本验收', y: 'Release acceptance' }
  ]},
  { name: 'Tools', tags: [
    { t: 'ChatGPT', y: 'Daily' },
    { t: 'Claude', y: 'Daily' },
    { t: 'Gemini', y: 'Weekly' },
    { t: 'Codex', y: 'AI coding' },
    { t: 'Dify', y: 'AI workflow' },
    { t: 'n8n', y: 'Automation' },
    { t: 'Coze', y: 'Agents' },
    { t: '飞书多维表', y: 'Data ops' }
  ]}
];

// ===== AI Agent (calls our own /api/qi-chat → Dify) =====
const SUGGESTIONS = [
  { label: '💼 秒聘网项目', q: '请介绍修琪在秒聘网 AI 招聘匹配平台中负责的工作和结果' },
  { label: '💎 高翠AI项目', q: '请介绍修琪在高翠AI翡翠导购平台中的产品设计经验' },
  { label: '📈 GEO增长经验', q: '修琪做过哪些 GEO / AI 搜索可见性优化项目？结果怎么样？' },
  { label: '✨ AI工具链能力', q: '修琪熟悉哪些 AI 工具链和产品验证方法？' },
  { label: '📬 联系方式', q: '怎么联系修琪？方便电话沟通吗？' }
];

const QI_ENDPOINT = '/api/qi-chat';
const LOCK_SOUND_SRC = '/assets/turning-a-lock.mp3';

function stripThinkingContent(text) {
  const withoutClosedBlocks = text.replace(/<think\b[^>]*>[\s\S]*?<\/think>/gi, '');
  const lower = withoutClosedBlocks.toLowerCase();
  const openIndex = lower.lastIndexOf('<think');
  const closeIndex = lower.lastIndexOf('</think>');

  if (openIndex !== -1 && openIndex > closeIndex) {
    return withoutClosedBlocks.slice(0, openIndex).trim();
  }

  return withoutClosedBlocks.replace(/<\/?think\b[^>]*>/gi, '').trim();
}
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
      const rawAnswer = data && typeof data.answer === 'string' ? data.answer : '';
      const answer = stripThinkingContent(rawAnswer) || FALLBACK_MSG;
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
  const lockSoundRef = useARef(null);
  const lastSoundAtRef = useARef(0);

  const playLockSound = () => {
    const now = Date.now();
    if (now - lastSoundAtRef.current < 220) return;
    lastSoundAtRef.current = now;

    if (!lockSoundRef.current) {
      lockSoundRef.current = new Audio(LOCK_SOUND_SRC);
      lockSoundRef.current.preload = 'auto';
      lockSoundRef.current.volume = 0.42;
    }

    lockSoundRef.current.currentTime = 0;
    lockSoundRef.current.play().catch(() => {});
  };

  const togglePin = (i) => {
    playLockSound();
    setPinned(p => p === i ? -1 : i);
  };

  const STRENGTHS = [
    {
      num: '01.',
      title: 'AI 产品从 0 到 1 落地经验',
      body: (
        <p>
          主导秒聘网、高翠AI 等 AI 产品项目，覆盖需求拆解、PRD、原型、规则设计、埋点、研发协同与版本验收，
          <span className="hl">具备完整产品闭环经验</span>。
        </p>
      )
    },
    {
      num: '02.',
      title: 'AI 工具链与产品验证能力',
      body: (
        <p>
          熟悉 Dify、n8n、Coze、Vibe Coding + SDD 等工具链，
          <span className="hl">能够将业务需求快速转化为可交互 MVP</span>，
          用于产品验证和研发沟通。
        </p>
      )
    },
    {
      num: '03.',
      title: '数据驱动与用户洞察能力',
      body: (
        <p>
          在 GEO 项目中建立效果监控体系，
          <span className="hl">将知乎内容 AI 引用率从不足 10% 提升至 35%</span>；
          具备用户调研、数据分析和产品迭代意识。
        </p>
      )
    },
    {
      num: '04.',
      title: '跨团队沟通与结构化表达能力',
      body: (
        <p>
          播音主持背景带来较强的结构化表达与跨团队沟通能力，
          <span className="hl">在用户访谈、PRD 评审、跨部门协同中表现突出</span>，
          对内容质量与用户心理有敏锐度。
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
              我是修琪，一位 23 岁的<strong>AI 产品经理</strong>，专注于 LLM 应用、AI 招聘匹配、垂类 AI 导购与 GEO / AI 搜索可见性优化。
              我可以完成需求拆解、PRD、原型、规则设计、埋点、研发协同、AI Coding Demo 验证与上线复盘，
              把业务需求快速转化为可验证、可落地的 AI 产品。
            </p>

            <div className="strengths">
              {STRENGTHS.map((s, i) => (
                <div
                  key={i}
                  className={'strength' + (pinned === i ? ' pinned' : '')}
                  onClick={() => togglePin(i)}
                  onMouseEnter={playLockSound}
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
