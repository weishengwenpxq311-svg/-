import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Footer() {
  const eduRef = useScrollReveal();
  const talkRef = useScrollReveal();

  return (
    <section className="footer-block">
      <div className="footer-grid">
        <div className="edu">
          <div className="section-label">04 / Education</div>
          <h3 className="scroll-reveal" ref={eduRef} style={{ marginTop: 20 }}>
            Academic Background
          </h3>
          <div className="school">天津传媒学院</div>
          <div className="major">本科 · 播音与主持艺术 · 2021 — 2025</div>
          <div className="awards">
            播音主持背景带来的差异化优势：极强的<strong>结构化表达与跨团队沟通能力</strong>，在用户访谈、PRD
            评审、跨部门协同中表现突出。对内容质量与用户心理有天然的敏锐度。
            <br />
            <br />
            🏆 <strong>2025 年</strong>毕业作品《仫佬刺绣绚真情》运用 AIGC 视频生成工具荣获优秀毕业作品
            <br />
            🏆 <strong>2023 年</strong>《2023 天津市网络主持人》荣获优秀节目
            <br />
            🏆 <strong>2023 年</strong>"声动中国"全国语言艺术展评大赛优秀奖
          </div>
        </div>
        <div className="contact">
          <div className="section-label">05 / Get in touch</div>
          <h3 className="scroll-reveal" ref={talkRef} style={{ marginTop: 20 }}>
            Let's talk.
          </h3>
          <div className="contact-row">
            <span>Phone</span>
            <span>147 7486 3219</span>
          </div>
          <div className="contact-row">
            <span>Location</span>
            <span>Shenzhen, China</span>
          </div>
          <div className="contact-row">
            <span>Expected</span>
            <span>15-16K · AI PM</span>
          </div>
          <div className="contact-row">
            <span>Portfolio</span>
            <span>飞书云文档</span>
          </div>
          <a className="contact-cta" href="tel:14774863219">
            <span>Start a chat</span>
            <svg
              className="arrow"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 修琪 — Designed & built with care</span>
        <span>Shenzhen · 深圳</span>
      </div>
    </section>
  );
}
