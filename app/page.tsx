'use client';

import { useEffect } from 'react';
import About from '../about.jsx';
import CustomCursor from '../cursor.jsx';
import Footer from '../footer.jsx';
import Hero from '../hero.jsx';
import { PageIndicator, TopBar } from '../topbar.jsx';
import Works from '../works.jsx';

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
