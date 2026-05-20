import { useEffect, useRef, useState } from 'react';

const STAR_SVG_YELLOW = (
  <svg viewBox="0 0 24 24">
    <path fill="#d9f04a" d="M12 0l3 9h9l-7.5 5.5L19 24l-7-5-7 5 2.5-9.5L0 9h9z" />
  </svg>
);
const STAR_SVG_DARK = (
  <svg viewBox="0 0 24 24">
    <path d="M12 0l3 9h9l-7.5 5.5L19 24l-7-5-7 5 2.5-9.5L0 9h9z" />
  </svg>
);

export default function Hero() {
  const heroRef = useRef(null);
  const stageRef = useRef(null);
  const photoBgRef = useRef(null);
  const photoNumRef = useRef(null);
  const scrollCueRef = useRef(null);
  const measureRef = useRef(null);
  const topPathRef = useRef(null);
  const botPathRef = useRef(null);
  const topSvgRef = useRef(null);
  const botSvgRef = useRef(null);

  const [currentPhoto, setCurrentPhoto] = useState(0);

  const cards = [
    { src: '/photo1.jpg', bg: '#e8d8c2', heroBg: '#d8c8b4' },
    { src: '/photo2.jpg', bg: '#6fa9d4', heroBg: '#cdc4b8' },
    { src: '/photo3.jpg', bg: '#2a2520', heroBg: '#c9bda8' },
  ];
  const cueMessages = ['Scroll to discover', 'Keep going', 'Continue downward'];

  // ===== 曲线文字滚动 =====
  useEffect(() => {
    const measure = measureRef.current;
    const topPath = topPathRef.current;
    const botPath = botPathRef.current;
    const topSvg = topSvgRef.current;
    const botSvg = botSvgRef.current;
    if (!measure || !topPath || !botPath) return;

    const topRaw = '✦  Welcome to my personal universe  ';
    const botRaw = '  Xiu Qi · AI Product Manager  ·  ';

    const measureLen = (txt) => {
      measure.textContent = txt;
      return measure.getComputedTextLength();
    };
    const buildFill = (base, sp) => {
      const repeats = Math.max(2, Math.ceil(1800 / sp) + 2);
      return base.repeat(repeats);
    };

    let topSpacing = measureLen(topRaw);
    let botSpacing = measureLen(botRaw);
    topPath.textContent = buildFill(topRaw, topSpacing);
    botPath.textContent = buildFill(botRaw, botSpacing);
    topPath.setAttribute('startOffset', -topSpacing + 'px');
    botPath.setAttribute('startOffset', '0px');

    let topOffset = -topSpacing;
    let botOffset = 0;
    const topSpeed = 1.5;
    const botSpeed = -1.2;
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
      if (!topDragging && topSpacing > 0) {
        topOffset = tick(topPath, topOffset, topSpacing, topSpeed);
      }
      if (!botDragging && botSpacing > 0) {
        botOffset = tick(botPath, botOffset, botSpacing, botSpeed);
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    // 拖动
    const attachDrag = (svg, getOff, setOff, getSp, setDrag) => {
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

    const cleanTop =
      topSvg &&
      attachDrag(
        topSvg,
        () => topOffset,
        (v) => {
          topOffset = v;
          topPath.setAttribute('startOffset', v + 'px');
        },
        () => topSpacing,
        (d) => (topDragging = d)
      );
    const cleanBot =
      botSvg &&
      attachDrag(
        botSvg,
        () => botOffset,
        (v) => {
          botOffset = v;
          botPath.setAttribute('startOffset', v + 'px');
        },
        () => botSpacing,
        (d) => (botDragging = d)
      );

    return () => {
      cancelAnimationFrame(raf);
      cleanTop && cleanTop();
      cleanBot && cleanBot();
    };
  }, []);

  // ===== 照片切换 + 自动播放 + 滚轮控制 =====
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let isHovering = false;
    const stage = stageRef.current;
    const photoBg = photoBgRef.current;

    const AUTO = 5000;
    let timer;

    const setPhotoIdx = (idx) => {
      if (idx === currentPhotoRef.current) return;
      currentPhotoRef.current = idx;
      setCurrentPhoto(idx);
      if (photoBg) photoBg.style.backgroundColor = cards[idx].bg;
      hero.style.backgroundColor = cards[idx].heroBg;
    };

    const next = () => setPhotoIdx((currentPhotoRef.current + 1) % cards.length);

    const startAuto = () => {
      clearInterval(timer);
      timer = setInterval(() => {
        if (!isHovering) next();
      }, AUTO);
    };

    if (photoBg) photoBg.style.backgroundColor = cards[0].bg;

    // 鼠标 hover 暂停
    const onEnter = () => (isHovering = true);
    const onLeave = () => (isHovering = false);
    stage && stage.addEventListener('mouseenter', onEnter);
    stage && stage.addEventListener('mouseleave', onLeave);

    // 点击切换
    const onClick = (e) => {
      e.stopPropagation();
      next();
      startAuto();
    };
    stage && stage.addEventListener('click', onClick);

    // 滚轮控制切换
    let wheelLock = false;
    const onWheel = (e) => {
      const rect = hero.getBoundingClientRect();
      const inView = rect.top >= -10 && rect.bottom > window.innerHeight * 0.6;
      if (!inView) return;
      if (wheelLock) {
        e.preventDefault();
        return;
      }
      if (e.deltaY > 0) {
        if (currentPhotoRef.current < cards.length - 1) {
          e.preventDefault();
          wheelLock = true;
          setPhotoIdx(currentPhotoRef.current + 1);
          startAuto();
          setTimeout(() => (wheelLock = false), 700);
        }
      } else if (e.deltaY < 0) {
        if (currentPhotoRef.current > 0) {
          e.preventDefault();
          wheelLock = true;
          setPhotoIdx(currentPhotoRef.current - 1);
          startAuto();
          setTimeout(() => (wheelLock = false), 700);
        }
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });

    // 滚动时给 hero 加 scrolling 类
    const onScroll = () => {
      const rect = hero.getBoundingClientRect();
      if (rect.top < -50) hero.classList.add('scrolling');
      else hero.classList.remove('scrolling');
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    startAuto();

    return () => {
      clearInterval(timer);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      stage && stage.removeEventListener('mouseenter', onEnter);
      stage && stage.removeEventListener('mouseleave', onLeave);
      stage && stage.removeEventListener('click', onClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 用 ref 跟踪当前 index (因为 wheel 闭包需要)
  const currentPhotoRef = useRef(0);
  useEffect(() => {
    currentPhotoRef.current = currentPhoto;
  }, [currentPhoto]);

  // ===== 鼠标视差 =====
  useEffect(() => {
    const hero = heroRef.current;
    const stage = stageRef.current;
    if (!hero) return;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;
    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      tx = (e.clientX - rect.width / 2) / rect.width;
      ty = (e.clientY - rect.height / 2) / rect.height;
    };
    let raf;
    let stageReady = false;
    setTimeout(() => (stageReady = true), 1900);

    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      if (stage && stageReady) {
        stage.style.transform = `translate(${cx * -12}px, ${cy * -12}px)`;
      }
      const stars = hero.querySelectorAll('.star');
      stars.forEach((s) => {
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

  // 进度条状态
  const progress = (i) => {
    if (i < currentPhoto) return 'done';
    if (i === currentPhoto) return 'active';
    return '';
  };

  return (
    <section className="page" id="page-home" ref={heroRef}>
      {/* 弧形循环文字 - 上方 */}
      <div className="curved-loop" id="curvedTop">
        <svg
          className="curved-loop-svg"
          viewBox="0 0 1440 240"
          preserveAspectRatio="xMidYMid meet"
          ref={topSvgRef}
        >
          <text
            ref={measureRef}
            style={{
              visibility: 'hidden',
              opacity: 0,
              pointerEvents: 'none',
              fontSize: '130px',
              fontFamily: "'DM Serif Display', serif",
              fontWeight: 700,
              letterSpacing: '-0.01em',
            }}
            xmlSpace="preserve"
          >
            ✦ Welcome to my personal universe ✦
          </text>
          <defs>
            <path id="curveTopPath" d="M -100,200 Q 720,-80 1540,200" fill="none" stroke="transparent" />
          </defs>
          <text className="curved-loop-text" xmlSpace="preserve" fontWeight="700">
            <textPath ref={topPathRef} href="#curveTopPath" startOffset="0px" xmlSpace="preserve"></textPath>
          </text>
        </svg>
      </div>

      {/* 弧形循环文字 - 下方 */}
      <div className="curved-loop curved-loop-bottom" id="curvedBottom">
        <svg
          className="curved-loop-svg"
          viewBox="0 0 1440 240"
          preserveAspectRatio="xMidYMid meet"
          ref={botSvgRef}
        >
          <defs>
            <path id="curveBotPath" d="M -100,40 Q 720,320 1540,40" fill="none" stroke="transparent" />
          </defs>
          <text className="curved-loop-text curved-loop-text-bot" xmlSpace="preserve" fontWeight="700">
            <textPath ref={botPathRef} href="#curveBotPath" startOffset="0px" xmlSpace="preserve"></textPath>
          </text>
        </svg>
      </div>

      <div className="hero">
        {/* 中央照片画板 */}
        <div className="photo-stage" id="photoStage" ref={stageRef} role="button" aria-label="点击或滚动切换照片">
          <div className="photo-frame">
            <div className="photo-bg" ref={photoBgRef}></div>
            {cards.map((c, i) => (
              <div
                key={i}
                className={`photo-card ${i === currentPhoto ? 'active' : ''}`}
                data-idx={i}
                data-bg={c.bg}
              >
                <img src={c.src} alt={`photo ${i + 1}`} />
              </div>
            ))}
          </div>
          <div className="photo-progress">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`bar ${progress(i)}`} data-idx={i}></div>
            ))}
          </div>
          <div className="photo-counter">
            <span className="num" ref={photoNumRef}>
              {String(currentPhoto + 1).padStart(2, '0')}
            </span>{' '}
            <span style={{ fontSize: 12, opacity: 0.5 }}>/ 03</span>
          </div>
          <div className="photo-hint">
            <span>CLICK OR SCROLL</span>
          </div>
        </div>

        {/* 星星装饰 */}
        <div className="star s1" data-depth="0.3">{STAR_SVG_YELLOW}</div>
        <div className="star s2" data-depth="0.5">{STAR_SVG_YELLOW}</div>
        <div className="star s3" data-depth="0.4">{STAR_SVG_DARK}</div>
        <div className="star s4" data-depth="0.6">{STAR_SVG_DARK}</div>
        <div className="star s5" data-depth="0.8">{STAR_SVG_DARK}</div>
        <div className="star s6" data-depth="0.7">{STAR_SVG_YELLOW}</div>
      </div>

      <div className="hero-footer">© 2026 Xiu Qi · All rights reserved</div>
      <div className="hero-social">
        <span>AI Product Manager</span>
        <span>· Shenzhen ·</span>
      </div>
      <div className="scroll-cue">
        <span ref={scrollCueRef}>{cueMessages[currentPhoto]}</span>
        <div className="arrow"></div>
      </div>
    </section>
  );
}
