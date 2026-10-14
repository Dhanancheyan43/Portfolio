import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense, useEffect, useState } from 'react';
import Backdrop from './components/Backdrop';
import MarbleDefs from './components/greek/MarbleDefs';
import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import AboutSection from './sections/AboutSection';
import ServicesSection from './sections/ServicesSection';
import ProjectsSection from './sections/ProjectsSection';

// three.js is heavy, so the intro ships as its own chunk.
const CupidIntro = lazy(() => import('./intro/CupidIntro'));

function IntroLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-ink font-mono text-xs uppercase tracking-[0.4em] text-neon">
      <span className="animate-flicker">summoning cupids…</span>
    </div>
  );
}

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = introDone ? '' : 'hidden';
    if (!introDone) window.scrollTo(0, 0);
  }, [introDone]);

  return (
    <>
      <MarbleDefs />
      <Backdrop />

      <AnimatePresence>
        {!introDone && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-[100]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          >
            <Suspense fallback={<IntroLoader />}>
              <CupidIntro onFinish={() => setIntroDone(true)} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10" style={{ overflowX: 'clip' }}>
        {/* The hero mounts after the intro so its entrance animation is actually seen. */}
        {introDone ? <HeroSection /> : <div className="h-screen" />}
        <MarqueeSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
      </main>
    </>
  );
}
