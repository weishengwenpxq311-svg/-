import CustomCursor from './components/CustomCursor';
import TopBar from './components/TopBar';
import PageIndicator from './components/PageIndicator';
import Hero from './components/Hero';
import About from './components/About';
import Works from './components/Works';
import Footer from './components/Footer';

export default function App() {
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
