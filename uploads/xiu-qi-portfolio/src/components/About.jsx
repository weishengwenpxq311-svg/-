import { useScrollReveal } from '../hooks/useScrollReveal';

export default function About() {
  const helloRef = useScrollReveal();
  const buildingRef = useScrollReveal();
  const introRef = useScrollReveal();

  return (
    <section className="page" id="page-about">
      <div className="about-layout">
        {/* 顶部标题 */}
        <div className="about-header">
          <div>
            <div className="section-label">01 / About Me</div>
            <h2 className="scroll-reveal" ref={helloRef}>
              Hello, <em>I'm 修琪.</em>
            </h2>
          </div>
          <div className="about-meta">
            <div className="row">
              <span>Role</span>
              <span>AI Product Manager</span>
            </div>
            <div className="row">
              <span>Experience</span>
              <span>2 Years</span>
            </div>
            <div className="row">
              <span>Based</span>
              <span>Shenzhen, CN</span>
            </div>
            <div className="row">
              <span>Status</span>
              <span>Open to work</span>
            </div>
          </div>
        </div>

        {/* 主介绍 */}
        <div className="about-main">
          <h3 className="scroll-reveal" ref={buildingRef}>
            Building AI that{' '}
            <span
              style={{
                background: 'linear-gradient(180deg, transparent 60%, var(--accent) 60%)',
                padding: '0 4px',
              }}
            >
              actually ships
            </span>
            .
          </h3>
          <p className="intro scroll-reveal" ref={introRef}>
            我是修琪，一位 23 岁的<strong>AI 产品经理</strong>，专注于让 AI 产品真正走进用户的生活。
            从 0 到 1 搭建过品牌 GEO 体系，主导过千万级用户硬件产品的核心模块，
            既能写 PRD、画原型，也能下场用 Dify、n8n、Vibe Coding 直接做出可用的产品 Demo——
            让 AI 不止停留在文档里，而是真正解决问题。
          </p>

          <div className="strengths">
            <div className="strength">
              <div className="num">01.</div>
              <div className="body">
                <h4>完整 AI 产品闭环经验</h4>
                <p>
                  主导噜咔博士 AI 拍学机「家长管控中心」与「AI
                  创新特效」两大核心模块，独立完成需求拆解、PRD 撰写、Figma 原型、埋点设计与版本推进全流程；
                  <span className="hl">5 个月内推动小程序 MAU 由 16.5K 提升至 38.2K</span>。
                </p>
              </div>
            </div>
            <div className="strength">
              <div className="num">02.</div>
              <div className="body">
                <h4>能下场的 AI 工具链实操能力</h4>
                <p>
                  独立用 Dify 搭建 GEO 全链路自动化工作流（关键词挖掘→内容生产→多平台分发→效果回测）；通过{' '}
                  <span className="hl">Vibe Coding 独立实现噜咔博士小程序主页面交互 Demo</span>
                  ，直接参与产品验证而非停留在文档层面。
                </p>
              </div>
            </div>
            <div className="strength">
              <div className="num">03.</div>
              <div className="body">
                <h4>数据驱动 + 真实 C 端用户洞察</h4>
                <p>
                  在 GEO 项目中独立建立效果监控体系，
                  <span className="hl">将知乎内容 AI 引用率从不足 10% 提升至 35%</span>。2
                  年直播带货经验，单场峰值 5000+ 在线，亲历用户决策链路，对用户真实痛点有直接感知。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Agent 占位 */}
        <aside className="agent-slot">
          <div className="agent-placeholder-note">// Agent Slot</div>
          <div className="agent-header">
            <div className="agent-avatar">
              <svg viewBox="0 0 24 24">
                <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z" />
              </svg>
            </div>
            <div>
              <div className="agent-name">Qi · AI Agent</div>
              <div className="agent-status">Online</div>
            </div>
          </div>

          <div className="agent-bubble">
            你好！我是修琪的 AI 分身。问我任何关于她经历、技能或项目的问题吧 ✨
          </div>
          <div className="agent-bubble me">她最擅长什么？</div>
          <div className="agent-bubble">
            从 0 到 1 搭建 AI 产品闭环，特别是 GEO 内容自动化和 AI 硬件家长端体验设计。要看具体案例吗？
          </div>

          <div className="agent-suggestions">
            <div className="chip">💼 项目经历</div>
            <div className="chip">🛠 技能详情</div>
            <div className="chip">📊 数据成果</div>
            <div className="chip">📬 联系方式</div>
          </div>

          <div className="agent-input">
            <input type="text" placeholder="向 Qi 提问...(即将上线)" disabled />
            <button aria-label="发送">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </aside>

        {/* 技能区 */}
        <div className="skills-block">
          <div className="section-label">02 / Toolkit</div>
          <div className="skills-grid">
            <div className="skill-cat">
              <div className="cat-name">AI Tools</div>
              <div className="tags">
                {['Codex', 'Claude', 'ChatGPT', 'Gemini', 'Midjourney', '即梦', '可灵', 'HeyGen'].map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="skill-cat">
              <div className="cat-name">Product</div>
              <div className="tags">
                {['Figma', 'Axure', '飞书多维表格'].map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="skill-cat">
              <div className="cat-name">Workflow</div>
              <div className="tags">
                {['Dify', 'n8n', 'Coze'].map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="skill-cat">
              <div className="cat-name">Methodology</div>
              <div className="tags">
                {['Prompt Engineering', 'RAG', 'Vibe Coding', 'GEO / SEO'].map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
