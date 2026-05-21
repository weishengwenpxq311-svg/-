'use client';

import React, { useEffect as useHEffect, useRef as useHRef } from 'react';

const STAR_PATH = 'M12 0l3 9h9l-7.5 5.5L19 24l-7-5-7 5 2.5-9.5L0 9h9z';
const STAR_YELLOW = (<svg viewBox="0 0 24 24"><path fill="var(--accent)" d={STAR_PATH} /></svg>);
const STAR_DARK = (<svg viewBox="0 0 24 24"><path d={STAR_PATH} /></svg>);

const HEADSHOT_SRC = '/assets/qi-lanyard.png';

export default function Hero() {
  const heroRef = useHRef(null);
  const stageRef = useHRef(null);
  const badgeRef = useHRef(null);
  const leftCordRef = useHRef(null);
  const rightCordRef = useHRef(null);
  const measureRef = useHRef(null);
  const topPathRef = useHRef(null);
  const botPathRef = useHRef(null);
  const topSvgRef = useHRef(null);
  const botSvgRef = useHRef(null);

  useHEffect(() => {
    const measure = measureRef.current;
    const topPath = topPathRef.current;
    const botPath = botPathRef.current;
    if (!measure || !topPath || !botPath) return;

    const topRaw = '✦  Welcome to my personal universe  ';
    const botRaw = '  Xiu Qi · AI Product Manager  ·  ';

    const measureLen = (txt) => {
      measure.textContent = txt;
      return measure.getComputedTextLength();
    };
    const buildFill = (base, sp) => base.repeat(Math.max(2, Math.ceil(1800 / sp) + 2));

    let topSpacing = measureLen(topRaw);
    let botSpacing = measureLen(botRaw);
    topPath.textContent = buildFill(topRaw, topSpacing);
    botPath.textContent = buildFill(botRaw, botSpacing);
    topPath.setAttribute('startOffset', -topSpacing + 'px');
    botPath.setAttribute('startOffset', '0px');

    let topOffset = -topSpacing;
    let botOffset = 0;
    let topDragging = false;
    let botDragging = false;

    const tick = (pathEl, off, spacing, speed) => {
      let v = off + speed;
      if (v >= 0) v -= spacing;
      if (v <= -spacing * 2) v += spacing;
      pathEl.setAttribute('startOffset', v + 'px');
      return v;
    };

    let raf;
    const animate = () => {
      if (!topDragging && topSpacing > 0) topOffset = tick(topPath, topOffset, topSpacing, 1.2);
      if (!botDragging && botSpacing > 0) botOffset = tick(botPath, botOffset, botSpacing, -1);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const attachDrag = (svg, getOffset, setOffset, getSpacing, setDrag) => {
      if (!svg) return () => {};
      let lastX = 0;
      const down = (e) => {
        setDrag(true);
        lastX = e.clientX;
        svg.setPointerCapture(e.pointerId);
      };
      const move = (e) => {
        if (!svg.hasPointerCapture(e.pointerId)) return;
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        const spacing = getSpacing();
        let offset = getOffset() + dx;
        if (offset >= 0) offset -= spacing;
        if (offset <= -spacing * 2) offset += spacing;
        setOffset(offset);
      };
      const up = () => setDrag(false);
      svg.addEventListener('pointerdown', down);
      svg.addEventListener('pointermove', move);
      svg.addEventListener('pointerup', up);
      svg.addEventListener('pointercancel', up);
      return () => {
        svg.removeEventListener('pointerdown', down);
        svg.removeEventListener('pointermove', move);
        svg.removeEventListener('pointerup', up);
        svg.removeEventListener('pointercancel', up);
      };
    };

    const cleanTop = attachDrag(
      topSvgRef.current,
      () => topOffset,
      (v) => {
        topOffset = v;
        topPath.setAttribute('startOffset', v + 'px');
      },
      () => topSpacing,
      (d) => (topDragging = d),
    );
    const cleanBot = attachDrag(
      botSvgRef.current,
      () => botOffset,
      (v) => {
        botOffset = v;
        botPath.setAttribute('startOffset', v + 'px');
      },
      () => botSpacing,
      (d) => (botDragging = d),
    );

    return () => {
      cancelAnimationFrame(raf);
      cleanTop();
      cleanBot();
    };
  }, []);

  useHEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.width / 2) / r.width;
      ty = (e.clientY - r.height / 2) / r.height;
    };

    let raf;
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      hero.querySelectorAll('.star').forEach((s) => {
        const depth = parseFloat(s.dataset.depth || 0.3);
        s.style.setProperty('--px', cx * 30 * depth + 'px');
        s.style.setProperty('--py', cy * 30 * depth + 'px');
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    hero.addEventListener('mousemove', onMove);

    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener('mousemove', onMove);
    };
  }, []);

  useHEffect(() => {
    const stage = stageRef.current;
    const badge = badgeRef.current;
    const leftCord = leftCordRef.current;
    const rightCord = rightCordRef.current;
    if (!stage || !badge || !leftCord || !rightCord) return;

    const state = {
      x: -52,
      y: -520,
      vx: 10,
      vy: 48,
      t: 0,
    };

    const restY = 0;
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const updateCords = () => {
      const pullX = state.x * 0.35;
      const pullY = state.y * 0.42;
      const leftEndX = 125 + state.x * 0.1;
      const rightEndX = 155 + state.x * 0.1;
      const endY = 150 + pullY;
      const leftD = `M66 0 C82 ${48 + pullY * 0.2}, ${96 + pullX} ${108 + pullY * 0.42}, ${leftEndX} ${endY}`;
      const rightD = `M214 0 C198 ${48 + pullY * 0.2}, ${184 + pullX} ${108 + pullY * 0.42}, ${rightEndX} ${endY}`;

      stage.querySelectorAll('.cord-left, .cord-left-shadow').forEach((path) => path.setAttribute('d', leftD));
      stage.querySelectorAll('.cord-right, .cord-right-shadow').forEach((path) => path.setAttribute('d', rightD));
    };

    const render = () => {
      const speed = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
      const rotate = clamp(state.x * 0.14 + state.vx * 0.045, -28, 28);
      const tiltX = clamp(-state.y * 0.02 - state.vy * 0.014, -14, 14);
      const tiltY = clamp(state.x * 0.045 + state.vx * 0.014, -14, 14);
      const scale = 1 + Math.min(speed / 3600, 0.025);

      badge.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${rotate}deg) scale(${scale})`;
      stage.style.setProperty('--lanyard-pull-x', `${state.x * 0.12}px`);
      stage.style.setProperty('--lanyard-pull-y', `${state.y * 0.1}px`);
      updateCords();
    };

    const animate = () => {
      state.t += 1;

      const dx = -state.x;
      const dy = restY - state.y;
      const settle = state.t < 120 ? 0.058 : 0.048;
      const sway = Math.sin(state.t / 13) * Math.max(0, 1 - state.t / 210) * 1.15;
      const gravity = state.t < 170 ? 0.34 : 0;

      state.vx += dx * 0.034 + sway;
      state.vy += dy * settle + gravity;
      state.vx *= state.t < 130 ? 0.94 : 0.88;
      state.vy *= state.t < 110 ? 0.91 : 0.84;
      state.x += state.vx;
      state.y += state.vy;

      state.x = clamp(state.x, -140, 140);
      state.y = clamp(state.y, -560, 170);

      const motionSpeed = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
      render();
      if (state.t > 290 && motionSpeed < 0.05 && Math.abs(state.x) < 0.5 && Math.abs(state.y - restY) < 0.5) {
        state.x = 0;
        state.y = restY;
        state.vx = 0;
        state.vy = 0;
        render();
        return;
      }
      raf = requestAnimationFrame(animate);
    };

    updateCords();
    let raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);

  const explodeStar = (e) => {
    e.stopPropagation();
    const el = e.currentTarget;
    if (el.classList.contains('exploded')) return;
    const ex = (Math.random() - 0.5) * 600;
    const ey = (Math.random() - 0.5) * 600;
    el.style.setProperty('--ex', ex + 'px');
    el.style.setProperty('--ey', ey + 'px');
    el.classList.add('exploded');
    setTimeout(() => {
      el.classList.remove('exploded');
      el.style.removeProperty('--ex');
      el.style.removeProperty('--ey');
    }, 1100);
  };

  return (
    <section className="page" id="page-home" data-screen-label="01 Hero" ref={heroRef}>
      <div className="curved-loop" id="curvedTop">
        <svg className="curved-loop-svg" viewBox="0 0 1440 240" preserveAspectRatio="xMidYMid meet" ref={topSvgRef}>
          <text ref={measureRef} style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none', fontSize: '130px', fontFamily: "'DM Serif Display', serif", fontWeight: 700, letterSpacing: '-0.01em' }} xmlSpace="preserve">✦ Welcome to my personal universe ✦</text>
          <defs>
            <path id="curveTopPath" d="M -100,200 Q 720,-80 1540,200" fill="none" stroke="transparent" />
          </defs>
          <text className="curved-loop-text" xmlSpace="preserve" fontWeight="700">
            <textPath ref={topPathRef} href="#curveTopPath" startOffset="0px" xmlSpace="preserve" />
          </text>
        </svg>
      </div>

      <div className="curved-loop curved-loop-bottom" id="curvedBottom">
        <svg className="curved-loop-svg" viewBox="0 0 1440 240" preserveAspectRatio="xMidYMid meet" ref={botSvgRef}>
          <defs>
            <path id="curveBotPath" d="M -100,40 Q 720,320 1540,40" fill="none" stroke="transparent" />
          </defs>
          <text className="curved-loop-text curved-loop-text-bot" xmlSpace="preserve" fontWeight="700">
            <textPath ref={botPathRef} href="#curveBotPath" startOffset="0px" xmlSpace="preserve" />
          </text>
        </svg>
      </div>

      <div className="hero">
        <div className="lanyard-stage" ref={stageRef} data-hover>
          <div className="lanyard-cord" aria-hidden="true">
            <svg viewBox="0 0 280 220" preserveAspectRatio="none">
              <path className="cord-shadow cord-left-shadow" d="M66 0 C82 48, 96 108, 125 150" />
              <path className="cord-shadow cord-right-shadow" d="M214 0 C198 48, 184 108, 155 150" />
              <path ref={leftCordRef} className="cord-main cord-left" d="M66 0 C82 48, 96 108, 125 150" />
              <path ref={rightCordRef} className="cord-main cord-right" d="M214 0 C198 48, 184 108, 155 150" />
            </svg>
          </div>
          <div className="lanyard-badge" ref={badgeRef}>
            <div className="lanyard-clip" aria-hidden="true">
              <span />
            </div>
            <div className="lanyard-card">
              <div className="lanyard-hole" aria-hidden="true" />
              <div className="lanyard-photo">
                <img src={HEADSHOT_SRC} alt="Xiu Qi portrait" draggable="false" suppressHydrationWarning />
              </div>
              <div className="lanyard-meta">
                <span>AI Product Manager</span>
                <strong>Xiu Qi · 修琪</strong>
                <em>Portfolio · 2026</em>
              </div>
            </div>
          </div>
        </div>

        <div className="star s1" data-depth="0.3" data-hover onClick={explodeStar}>{STAR_YELLOW}</div>
        <div className="star s2" data-depth="0.5" data-hover onClick={explodeStar}>{STAR_YELLOW}</div>
        <div className="star s3" data-depth="0.4" data-hover onClick={explodeStar}>{STAR_DARK}</div>
        <div className="star s4" data-depth="0.6" data-hover onClick={explodeStar}>{STAR_DARK}</div>
        <div className="star s5" data-depth="0.8" data-hover onClick={explodeStar}>{STAR_DARK}</div>
        <div className="star s6" data-depth="0.7" data-hover onClick={explodeStar}>{STAR_YELLOW}</div>
      </div>

      <div className="hero-footer">© 2026 Xiu Qi · All rights reserved</div>
      <div className="hero-social">
        <span>AI Product Manager</span>
        <span>· Shenzhen · 深圳</span>
      </div>
      <div className="scroll-cue">
        <span>Scroll to discover</span>
        <div className="arrow" />
      </div>
    </section>
  );
}
