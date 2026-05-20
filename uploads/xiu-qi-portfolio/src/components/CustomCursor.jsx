import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0,
      mouseY = 0,
      ringX = 0,
      ringY = 0;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    };

    let rafId;
    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      rafId = requestAnimationFrame(tick);
    };
    tick();

    document.addEventListener('mousemove', onMove);

    // hover 状态:监听所有可交互元素 (用 event delegation)
    const onOver = (e) => {
      if (e.target.closest('a, button, .strength, .tag, .chip, .achievement, .photo-stage, .dot, .contact-cta')) {
        dot.classList.add('active');
        ring.classList.add('active');
      }
    };
    const onOut = (e) => {
      if (e.target.closest('a, button, .strength, .tag, .chip, .achievement, .photo-stage, .dot, .contact-cta')) {
        dot.classList.remove('active');
        ring.classList.remove('active');
      }
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    // 点击粒子
    const symbols = ['✦', '✧', '★', '✶', '◆', '●'];
    const colors = ['#d9f04a', '#ff5a3c', '#1a1815', '#f5ede1'];
    const onClick = (e) => {
      const count = 8;
      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'click-particle';
        p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        p.style.left = e.clientX + 'px';
        p.style.top = e.clientY + 'px';
        p.style.color = colors[Math.floor(Math.random() * colors.length)];
        p.style.fontSize = 12 + Math.random() * 16 + 'px';
        p.style.fontWeight = '700';
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const distance = 60 + Math.random() * 80;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const rotation = Math.random() * 720 - 360;
        document.body.appendChild(p);
        p.animate(
          [
            { transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', opacity: 1 },
            {
              transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1) rotate(${rotation}deg)`,
              opacity: 0,
            },
          ],
          {
            duration: 800 + Math.random() * 400,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }
        ).onfinish = () => p.remove();
      }
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef}></div>
      <div className="cursor-ring" ref={ringRef}></div>
    </>
  );
}
