'use client';

import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const trailRef = useRef([]);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    const onMove = (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    };

    // Build trail dots (up to 10)
    const TRAIL = 10;
    const trail = [];
    for (let i = 0; i < TRAIL; i++) {
      const d = document.createElement('div');
      d.className = 'cursor-trail-dot';
      d.style.opacity = '0';
      document.body.appendChild(d);
      trail.push({ el: d, x: 0, y: 0 });
    }
    trailRef.current = trail;

    let raf;
    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';

      // chain the trail dots
      let prevX = mouseX, prevY = mouseY;
      trail.forEach((t, i) => {
        t.x += (prevX - t.x) * 0.35;
        t.y += (prevY - t.y) * 0.35;
        t.el.style.left = t.x + 'px';
        t.el.style.top = t.y + 'px';
        const factor = (TRAIL - i) / TRAIL;
        t.el.style.opacity = String(factor * 0.55);
        t.el.style.transform = `translate(-50%, -50%) scale(${factor * 0.8 + 0.2})`;
        prevX = t.x; prevY = t.y;
      });

      raf = requestAnimationFrame(tick);
    };
    tick();

    document.addEventListener('mousemove', onMove);

    const HOVER_SEL = 'a, button, .strength, .tag, .chip, .achievement, .photo-stage, .dot, .contact-cta, .contact-row, .work-entry, .star, [data-hover]';
    const onOver = (e) => {
      if (e.target.closest(HOVER_SEL)) {
        dot.classList.add('active');
        ring.classList.add('active');
      }
    };
    const onOut = (e) => {
      if (e.target.closest(HOVER_SEL)) {
        dot.classList.remove('active');
        ring.classList.remove('active');
      }
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    // Click particle burst
    const symbols = ['✦','✧','★','✶','◆','●','✱','◉'];
    const onClick = (e) => {
      if (e.target.closest('input, textarea, [contenteditable]')) return;
      const count = 10;
      const root = getComputedStyle(document.body);
      const colors = [
        root.getPropertyValue('--accent').trim() || '#d9f04a',
        root.getPropertyValue('--accent-2').trim() || '#ff5a3c',
        root.getPropertyValue('--ink').trim() || '#1a1815',
        root.getPropertyValue('--paper').trim() || '#f5ede1'
      ];
      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'click-particle';
        p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        p.style.left = e.clientX + 'px';
        p.style.top = e.clientY + 'px';
        p.style.color = colors[Math.floor(Math.random() * colors.length)];
        p.style.fontSize = 12 + Math.random() * 18 + 'px';
        p.style.fontWeight = '700';
        const ang = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const dist = 60 + Math.random() * 90;
        const tx = Math.cos(ang) * dist;
        const ty = Math.sin(ang) * dist;
        const rot = Math.random() * 720 - 360;
        document.body.appendChild(p);
        p.animate(
          [
            { transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1) rotate(${rot}deg)`, opacity: 0 }
          ],
          { duration: 800 + Math.random() * 400, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
        ).onfinish = () => p.remove();
      }
    };
    document.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('click', onClick);
      trail.forEach(t => t.el.remove());
    };
  }, []);

  return (
    <React.Fragment>
      <div className="cursor-dot" ref={dotRef}></div>
      <div className="cursor-ring" ref={ringRef}></div>
    </React.Fragment>
  );
}
