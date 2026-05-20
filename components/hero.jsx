'use client';

import React, { useEffect as useHEffect, useRef as useHRef, useState as useHState } from 'react';

const STAR_PATH = "M12 0l3 9h9l-7.5 5.5L19 24l-7-5-7 5 2.5-9.5L0 9h9z";
const STAR_YELLOW = (<svg viewBox="0 0 24 24"><path fill="var(--accent)" d={STAR_PATH} /></svg>);
const STAR_DARK   = (<svg viewBox="0 0 24 24"><path d={STAR_PATH} /></svg>);

const CARDS = [
  { src: '/assets/photo1.jpg', bg: '#cfdbc4', heroBg: 'oklch(88% 0.04 130)', caption: 'Portrait · 修琪',                tag: 'NO. 01' },
  { src: '/assets/photo2.jpg', bg: '#6fa9d4', heroBg: 'oklch(82% 0.04 75)',  caption: 'Heart Balloon · 终极浪漫',         tag: 'NO. 02' },
  { src: '/assets/photo3.jpg', bg: '#2a2520', heroBg: 'oklch(80% 0.04 70)',  caption: 'Pop Culture · 玩具店 · Shenzhen', tag: 'NO. 03' }
];
const CUE_MSG = ['Scroll to discover', 'Keep going', 'Continue downward'];

export default function Hero() {
  const heroRef  = useHRef(null);
  const stageRef = useHRef(null);
  const photoBgRef = useHRef(null);
  const measureRef = useHRef(null);
  const topPathRef = useHRef(null);
  const botPathRef = useHRef(null);
  const topSvgRef = useHRef(null);
  const botSvgRef = useHRef(null);
  const currentRef = useHRef(0);
  const prevRef = useHRef(0);

  const [current, setCurrent] = useHState(0);

  // ============ curved text =============
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
    const topSpeed = 1.2;
    const botSpeed = -1.0;
    let topDragging = false;
    let botDragging = false;

    const tick = (pathEl, off, sp, sp_speed) => {
      let v = off + sp_speed;
      if (v >= 0) v -= sp;
      if (v <= -sp * 2) v += sp;
      pathEl.setAttribute('startOffset', v + 'px');
      return v;
    };

    let raf;
    const animate = () => {
      if (!topDragging && topSpacing > 0) topOffset = tick(topPath, topOffset, topSpacing, topSpeed);
      if (!botDragging && botSpacing > 0) botOffset = tick(botPath, botOffset, botSpacing, botSpeed);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const attachDrag = (svg, getOff, setOff, getSp, setDrag) => {
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
        const sp = getSp();
        let off = getOff() + dx;
        if (off >= 0) off -= sp;
        if (off <= -sp * 2) off += sp;
        setOff(off);
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
    const cleanTop = attachDrag(topSvgRef.current,
      () => topOffset,
      (v) => { topOffset = v; topPath.setAttribute('startOffset', v + 'px'); },
      () => topSpacing, (d) => (topDragging = d));
    const cleanBot = attachDrag(botSvgRef.current,
      () => botOffset,
      (v) => { botOffset = v; botPath.setAttribute('startOffset', v + 'px'); },
      () => botSpacing, (d) => (botDragging = d));

    return () => {
      cancelAnimationFrame(raf);
      cleanTop && cleanTop();
      cleanBot && cleanBot();
    };
  }, []);

  // ============ photo switching + autoplay + wheel + scroll-class =============
  useHEffect(() => {
    const hero = heroRef.current;
    const stage = stageRef.current;
    const photoBg = photoBgRef.current;
    if (!hero || !stage) return;

    let isHovering = false;
    const AUTO = 5200;
    let timer;

    const setPhotoIdx = (idx) => {
      if (idx === currentRef.current) return;
      prevRef.current = currentRef.current;
      currentRef.current = idx;
      setCurrent(idx);
      if (photoBg) photoBg.style.backgroundColor = CARDS[idx].bg;
      hero.style.backgroundColor = CARDS[idx].heroBg;
    };
    const next = () => setPhotoIdx((currentRef.current + 1) % CARDS.length);
    const startAuto = () => {
      clearInterval(timer);
      timer = setInterval(() => { if (!isHovering) next(); }, AUTO);
    };
    if (photoBg) photoBg.style.backgroundColor = CARDS[0].bg;

    const onEnter = () => (isHovering = true);
    const onLeave = () => (isHovering = false);
    stage.addEventListener('mouseenter', onEnter);
    stage.addEventListener('mouseleave', onLeave);

    const onClick = (e) => {
      e.stopPropagation();
      next();
      startAuto();
    };
    stage.addEventListener('click', onClick);

    let wheelLock = false;
    const onWheel = (e) => {
      const rect = hero.getBoundingClientRect();
      const inView = rect.top >= -10 && rect.bottom > window.innerHeight * 0.6;
      if (!inView) return;
      if (wheelLock) { e.preventDefault(); return; }
      if (e.deltaY > 0 && currentRef.current < CARDS.length - 1) {
        e.preventDefault(); wheelLock = true;
        setPhotoIdx(currentRef.current + 1); startAuto();
        setTimeout(() => (wheelLock = false), 700);
      } else if (e.deltaY < 0 && currentRef.current > 0) {
        e.preventDefault(); wheelLock = true;
        setPhotoIdx(currentRef.current - 1); startAuto();
        setTimeout(() => (wheelLock = false), 700);
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });

    const onScroll = () => {
      const r = hero.getBoundingClientRect();
      if (r.top < -50) hero.classList.add('scrolling');
      else hero.classList.remove('scrolling');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    startAuto();

    return () => {
      clearInterval(timer);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      stage.removeEventListener('mouseenter', onEnter);
      stage.removeEventListener('mouseleave', onLeave);
      stage.removeEventListener('click', onClick);
    };
  }, []);

  // ============ mouse parallax + magnetic photo =============
  useHEffect(() => {
    const hero = heroRef.current;
    const stage = stageRef.current;
    if (!hero || !stage) return;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    // Magnetic offset
    let mx = 0, my = 0;
    let isOverStage = false;

    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.width / 2) / r.width;
      ty = (e.clientY - r.height / 2) / r.height;

      // magnetic pull when cursor near
      const sr = stage.getBoundingClientRect();
      const scx = sr.left + sr.width / 2;
      const scy = sr.top + sr.height / 2;
      const dx = e.clientX - scx;
      const dy = e.clientY - scy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const PULL = 220;
      if (dist < PULL) {
        const f = (1 - dist / PULL) * 18;
        mx = (dx / dist) * f;
        my = (dy / dist) * f;
        isOverStage = dist < sr.width / 2;
      } else {
        mx *= 0.85; my *= 0.85;
        isOverStage = false;
      }
    };

    let raf;
    let stageReady = false;
    setTimeout(() => (stageReady = true), 1700);

    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      if (stage && stageReady) {
        const tilt = isOverStage ? (cx * 4) : 0;
        stage.style.transform = `translate(${cx * -10 + mx}px, ${cy * -10 + my}px) rotateY(${tilt}deg) rotateX(${-cy * (isOverStage ? 4 : 0)}deg)`;
      }
      const stars = hero.querySelectorAll('.star');
      stars.forEach(s => {
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

  // explode a star on click
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

  const progress = (i) => {
    if (i < current) return 'done';
    if (i === current) return 'active';
    return '';
  };

  return (
    <section className="page" id="page-home" data-screen-label="01 Hero" ref={heroRef}>
      {/* top curved text */}
      <div className="curved-loop" id="curvedTop">
        <svg className="curved-loop-svg" viewBox="0 0 1440 240" preserveAspectRatio="xMidYMid meet" ref={topSvgRef}>
          <text ref={measureRef} style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none', fontSize: '130px', fontFamily: "'DM Serif Display', serif", fontWeight: 700, letterSpacing: '-0.01em' }} xmlSpace="preserve">✦ Welcome to my personal universe ✦</text>
          <defs>
            <path id="curveTopPath" d="M -100,200 Q 720,-80 1540,200" fill="none" stroke="transparent" />
          </defs>
          <text className="curved-loop-text" xmlSpace="preserve" fontWeight="700">
            <textPath ref={topPathRef} href="#curveTopPath" startOffset="0px" xmlSpace="preserve"></textPath>
          </text>
        </svg>
      </div>

      {/* bottom curved text */}
      <div className="curved-loop curved-loop-bottom" id="curvedBottom">
        <svg className="curved-loop-svg" viewBox="0 0 1440 240" preserveAspectRatio="xMidYMid meet" ref={botSvgRef}>
          <defs>
            <path id="curveBotPath" d="M -100,40 Q 720,320 1540,40" fill="none" stroke="transparent" />
          </defs>
          <text className="curved-loop-text curved-loop-text-bot" xmlSpace="preserve" fontWeight="700">
            <textPath ref={botPathRef} href="#curveBotPath" startOffset="0px" xmlSpace="preserve"></textPath>
          </text>
        </svg>
      </div>

      <div className="hero">
        <div className="photo-stage" ref={stageRef} role="button" aria-label="Click or scroll to switch photo">
          <div className="photo-frame">
            <div className="photo-bg" ref={photoBgRef}></div>
            {CARDS.map((c, i) => (
              <div key={i} className={`photo-card ${i === current ? 'active' : ''} ${i === prevRef.current && i !== current ? 'curtain-leave' : ''} ${i === current && prevRef.current !== current ? 'curtain-enter' : ''}`} data-idx={i}>
                <img src={c.src} alt={c.caption} suppressHydrationWarning />
              </div>
            ))}
          </div>
          <div className="photo-progress">
            {[0,1,2].map(i => <div key={i} className={`bar ${progress(i)}`} data-idx={i}></div>)}
          </div>
          <div className="photo-counter">
            <span className="num">{String(current + 1).padStart(2, '0')}</span>{' '}
            <span style={{ fontSize: 12, opacity: 0.5 }}>/ 03</span>
          </div>
          <div className="photo-hint"><span>CLICK · SCROLL</span></div>
          <div className="photo-caption">
            <span>{CARDS[current].caption}</span>
            <span>{CARDS[current].tag}</span>
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
        <span>{CUE_MSG[current]}</span>
        <div className="arrow"></div>
      </div>
    </section>
  );
}
