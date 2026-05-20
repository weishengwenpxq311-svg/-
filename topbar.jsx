'use client';

import React, { useEffect as useTBEffect, useState as useTBState } from 'react';

const BUBBLE_LINKS = [
  { id: 'page-home',  num: '01', label: 'Home',  sub: '首页',
    bg: 'var(--accent)', color: 'var(--ink)',   hoverBg: 'var(--ink)', hoverColor: 'var(--accent)', rot: -2 },
  { id: 'page-about', num: '02', label: 'About', sub: '关于我',
    bg: 'var(--paper)',  color: 'var(--ink)',   hoverBg: 'var(--ink)', hoverColor: 'var(--paper)',  rot: 2.5 },
  { id: 'page-works', num: '03', label: 'Works', sub: '作品 · 经历',
    bg: 'var(--ink)',    color: 'var(--accent)', hoverBg: 'var(--accent)', hoverColor: 'var(--ink)', rot: -1.5 }
];

export function TopBar() {
  const [open, setOpen] = useTBState(false);
  const [active, setActive] = useTBState('page-home');

  useTBEffect(() => {
    const pages = ['page-home','page-about','page-works'];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && pages.includes(e.target.id)) setActive(e.target.id);
      });
    }, { threshold: 0.4 });
    pages.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // ESC closes
  useTBEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Prevent body scroll when open
  useTBEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const jump = (e, id) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 380);
  };

  const toggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen(o => !o);
  };

  const closeAndTop = (e) => {
    e.stopPropagation();
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <React.Fragment>
      <div className="bubble-menu fixed">
        <div className="bubble logo-bubble" onClick={closeAndTop} data-hover>
          <span className="pulse"></span>
          <span>Xiu Qi</span>
          <span className="sep">/</span>
          <span className="cn">修琪</span>
        </div>
        <button
          className={`bubble toggle-bubble menu-btn ${open ? 'open' : ''}`}
          onClick={toggle}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          data-hover
        >
          <span className="menu-line"></span>
          <span className="menu-line"></span>
        </button>
      </div>

      <div className={`bubble-menu-items fixed ${open ? 'open' : ''}`} aria-hidden={!open}>
        <ul className="pill-list">
          {BUBBLE_LINKS.map((l, i) => (
            <li key={l.id} className="pill-col" style={{ '--i': i }}>
              <a
                className={'pill-link' + (active === l.id ? ' active' : '')}
                href={'#' + l.id}
                onClick={(e) => jump(e, l.id)}
                style={{
                  '--pill-bg': l.bg,
                  '--pill-color': l.color,
                  '--hover-bg': l.hoverBg,
                  '--hover-color': l.hoverColor,
                  '--item-rot': l.rot + 'deg',
                  '--i': i
                }}
                data-hover
              >
                <span className="pill-num">{l.num}</span>
                <span className="pill-dot"></span>
                <span className="pill-label">{l.label}</span>
                <span className="pill-sub">{l.sub}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </React.Fragment>
  );
}

export function PageIndicator() {
  const [active, setActive] = useTBState(0);
  const pages = [
    { id: 'page-home',  label: 'Home' },
    { id: 'page-about', label: 'About' },
    { id: 'page-works', label: 'Works' }
  ];
  useTBEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = pages.findIndex(p => p.id === e.target.id);
          if (idx !== -1) setActive(idx);
        }
      });
    }, { threshold: 0.5 });
    pages.forEach(p => {
      const el = document.getElementById(p.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  const goTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  };
  return (
    <div className="page-indicator">
      {pages.map((p, i) => (
        <div key={p.id} className={'dot' + (i === active ? ' active' : '')} onClick={() => goTo(p.id)} data-hover>
          <span className="label">{p.label}</span>
        </div>
      ))}
    </div>
  );
}
