import { useEffect, useRef } from 'react';

// 按词/字拆分文字 + 滚动驱动揭示 (旋转+blur+opacity)
// 用法: ref={useScrollReveal()}
export function useScrollReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // ---- 1. 拆分文字 ----
    const isCJK = (ch) =>
      /[\u3000-\u303f\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\uff00-\uffef\u3040-\u309f\u30a0-\u30ff]/.test(
        ch
      );
    const isCJKPunct = (ch) => /[，。！？、；：""''（）【】《》…—·]/.test(ch);

    function splitText(root) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      const nodes = [];
      let n;
      while ((n = walker.nextNode())) {
        if (n.nodeValue && n.nodeValue.trim()) nodes.push(n);
      }
      nodes.forEach((tn) => {
        const text = tn.nodeValue;
        const frag = document.createDocumentFragment();
        let buffer = '';
        const flush = () => {
          if (!buffer) return;
          const parts = buffer.split(/(\s+)/);
          parts.forEach((p) => {
            if (p === '') return;
            if (/^\s+$/.test(p)) {
              frag.appendChild(document.createTextNode(p));
            } else {
              const s = document.createElement('span');
              s.className = 'word';
              s.textContent = p;
              frag.appendChild(s);
            }
          });
          buffer = '';
        };
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (isCJK(ch) || isCJKPunct(ch)) {
            flush();
            const s = document.createElement('span');
            s.className = 'word';
            s.textContent = ch;
            frag.appendChild(s);
          } else {
            buffer += ch;
          }
        }
        flush();
        tn.parentNode.replaceChild(frag, tn);
      });
    }
    splitText(el);
    el.style.transform = 'rotate(4deg)';
    el.style.transformOrigin = '0% 60%';
    el.style.willChange = 'transform';

    // ---- 2. 滚动驱动更新 ----
    const update = () => {
      const vh = window.innerHeight;
      const rect = el.getBoundingClientRect();
      const startY = vh * 1.0;
      const endY = vh * 0.35;
      const top = rect.top;
      let progress = (startY - top) / (startY - endY);
      progress = Math.max(0, Math.min(1, progress));

      const rot = 4 * (1 - progress);
      el.style.transform = `rotate(${rot}deg)`;

      const words = el.querySelectorAll('.word');
      const total = words.length;
      if (!total) return;
      const stagger = 1 / Math.max(total + 4, 1);
      words.forEach((w, i) => {
        const ws = i * stagger;
        const we = ws + stagger * 4;
        let wp = (progress - ws) / (we - ws);
        wp = Math.max(0, Math.min(1, wp));
        const opacity = 0.12 + 0.88 * wp;
        const blur = 4 * (1 - wp);
        w.style.setProperty('--w-opacity', opacity);
        w.style.setProperty('--w-blur', blur + 'px');
      });
    };

    let raf = false;
    const onScroll = () => {
      if (raf) return;
      raf = true;
      requestAnimationFrame(() => {
        raf = false;
        update();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(update);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return ref;
}
