'use client';

import { useEffect } from 'react';
import About from '../components/about.jsx';
import CustomCursor from '../components/cursor.jsx';
import Footer from '../components/footer.jsx';
import Hero from '../components/hero.jsx';
import { PageIndicator, TopBar } from '../components/topbar.jsx';
import Works from '../components/works.jsx';

export default function Page() {
  useEffect(() => {
    document.body.setAttribute('data-vibe', 'warm');
    document.body.setAttribute('data-accent', 'chartreuse');
    document.body.setAttribute('data-cursor', 'trail');
  }, []);

  return (
    <>
      <CustomCursor />
      <TopBar />
      <PageIndicator />
      <Hero />
      <About />
      <Works />
      <Footer />
    </>
  );
}
