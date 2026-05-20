'use client';

import React, { useState as useFState } from 'react';
import { useScrollReveal } from './about.jsx';

export default function Footer() {
  const eduRef = useScrollReveal();
  const talkRef = useScrollReveal();
  const [copied, setCopied] = useFState('');

  const rows = [
    { k: 'Phone',     v: '147 7486 3219', copy: '14774863219' },
    { k: 'Location',  v: 'Shenzhen, China', copy: 'Shenzhen, China' },
    { k: 'Expected',  v: '15-16K · AI PM', copy: '15-16K · AI PM' },
    { k: 'Portfolio', v: '飞书云文档 ↗',  copy: 'https://rcnf9dsdscpk.feishu.cn/drive/folder/Fhk9fN2x1lbXlydr1SMcHz1znbh', link: 'https://rcnf9dsdscpk.feishu.cn/drive/folder/Fhk9fN2x1lbXlydr1SMcHz1znbh' }
  ];

  const onCopy = (key, value, link) => {
    if (link) {
      window.open(link, '_blank', 'noopener');
      return;
    }
    try {
      navigator.clipboard?.writeText(value);
    } catch (e) {}
    setCopied(key);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <section className="footer-block" data-screen-label="04 Footer">
      <div className="footer-grid">
        <div className="edu">
          <div className="section-label">04 / Education</div>
          <h3 className="scroll-reveal" ref={eduRef}>Academic Background</h3>
          <div className="school">天津传媒学院</div>
          <div className="major">本科 · 播音与主持艺术 · 2021 — 2025</div>
          <p style={{ fontSize: 13, lineHeight: 1.85, color: 'var(--ink-soft)', fontFamily: 'var(--serif-cn)', fontWeight: 300, marginBottom: 24, maxWidth: 480 }}>
            播音主持背景带来的差异化优势：极强的<strong style={{ color: 'var(--ink)', fontWeight: 500 }}>结构化表达与跨团队沟通能力</strong>，在用户访谈、PRD 评审、跨部门协同中表现突出。对内容质量与用户心理有天然的敏锐度。
          </p>
          <div className="awards">
            <div className="award-row">
              <span>🏆</span>
              <span className="y">2025</span>
              <span>毕业作品《仫佬刺绣绚真情》运用 AIGC 视频生成工具荣获<strong>优秀毕业作品</strong></span>
            </div>
            <div className="award-row">
              <span>🏆</span>
              <span className="y">2023</span>
              <span>《2023 天津市网络主持人》荣获<strong>优秀节目</strong></span>
            </div>
            <div className="award-row">
              <span>🏆</span>
              <span className="y">2023</span>
              <span>"声动中国"全国语言艺术展评大赛<strong>优秀奖</strong></span>
            </div>
          </div>
        </div>

        <div className="contact">
          <div className="section-label">05 / Get in touch</div>
          <h3 className="scroll-reveal" ref={talkRef}>Let's talk.</h3>

          {rows.map(r => (
            <div
              key={r.k}
              className={'contact-row' + (copied === r.k ? ' copied' : '')}
              data-hover
              onClick={() => onCopy(r.k, r.copy, r.link)}
            >
              <span>{r.k}</span>
              <span>{r.v}</span>
              <span className="copy-hint">{r.link ? 'Click to open' : (copied === r.k ? 'Copied ✓' : 'Click to copy')}</span>
            </div>
          ))}

          <a className="contact-cta" href="tel:14774863219" data-hover>
            <span>Start a chat</span>
            <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 修琪 — Designed &amp; built with care</span>
        <span className="ascii">◆ ◇ ◆ ◇ ◆</span>
        <span>Shenzhen · 深圳</span>
      </div>
    </section>
  );
}
