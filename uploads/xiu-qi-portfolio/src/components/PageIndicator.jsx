import { useEffect, useState } from 'react';

export default function PageIndicator() {
  const [active, setActive] = useState(0);
  const pages = ['page-home', 'page-about', 'page-works'];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = pages.indexOf(entry.target.id);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { threshold: 0.5 }
    );
    pages.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page-indicator">
      {pages.map((id, i) => (
        <div
          key={id}
          className={`dot ${i === active ? 'active' : ''}`}
          data-target={id}
          onClick={() => goTo(id)}
        ></div>
      ))}
    </div>
  );
}
