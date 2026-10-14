import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import statueLarge from '../assets/statue-2400.webp';
import statueSmall from '../assets/statue-1200.webp';

const STATUE_ASPECT = 1600 / 896;
const STATUE_SRCSET = `${statueSmall} 1200w, ${statueLarge} 2400w`;

// Deterministic pseudo-random spread so layouts are stable between renders.
const rand = (i: number, n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;

const PETALS = Array.from({ length: 16 }, (_, i) => ({
  left: `${rand(i, 1) * 100}%`,
  size: 10 + rand(i, 2) * 14,
  dur: `${14 + rand(i, 3) * 16}s`,
  delay: `${-rand(i, 4) * 30}s`,
  drift: `${(rand(i, 5) - 0.5) * 30}vw`,
  spin: `${(rand(i, 6) - 0.5) * 900}deg`,
  rose: i % 3 !== 0,
}));

// Digital rain clusters at the edges, echoing the code streams in the artwork.
const RAIN = Array.from({ length: 22 }, (_, i) => {
  const edge = rand(i, 7) < 0.7 ? 72 + rand(i, 8) * 27 : 1 + rand(i, 8) * 20;
  return {
    left: `${edge}%`,
    height: 60 + rand(i, 9) * 180,
    dur: `${3 + rand(i, 10) * 5}s`,
    delay: `${-rand(i, 11) * 8}s`,
    width: rand(i, 12) < 0.25 ? 3 : 1.5,
  };
});

function useViewport() {
  const read = () =>
    typeof window === 'undefined' ? { vw: 1440, vh: 900 } : { vw: window.innerWidth, vh: window.innerHeight };
  const [size, setSize] = useState(read);
  useEffect(() => {
    const onResize = () => setSize(read());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

// Fixed, non-interactive page backdrop: the statue artwork panning with scroll, pulsing neon
// cracks, digital rain, a scan sweep, falling petals and scanlines.
export default function Backdrop() {
  const { vw, vh } = useViewport();
  // Size the artwork to fill the width (with slack for parallax) and stay taller than the
  // viewport, so scrolling the page pans from the flower crown down to the lips.
  const artWidth = Math.max(vw * 1.04, (vh * 1.35) / STATUE_ASPECT);
  const artHeight = artWidth * STATUE_ASPECT;
  const pan = artHeight - vh * 1.02;

  // Finish the pan as the opaque Services section arrives, so the whole artwork is seen
  // across the hero, marquee and about sections.
  const [panEnd, setPanEnd] = useState(vh * 3);
  useEffect(() => {
    const measure = () => {
      const services = document.getElementById('price');
      if (services) setPanEnd(Math.max(vh, services.offsetTop - vh * 0.5));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, [vh]);

  const { scrollY } = useScroll();
  const panY = useSpring(
    useTransform(scrollY, [0, panEnd], [0, -pan]),
    { stiffness: 120, damping: 30, mass: 0.4 },
  );
  // Slightly deeper shade past the hero keeps section copy readable.
  const shade = useTransform(scrollY, [0, vh * 0.9], [0.1, 0.45]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const y = useSpring(mouseY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * -20);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * -16);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink" aria-hidden="true">
      <svg width="0" height="0" className="absolute">
        <defs>
          {/* Keeps only strongly green pixels (the cracks, eye ring and code streams) and blooms them. */}
          <filter id="neon-extract" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.15 0 0 0 0  0 1.4 0 0 0  0 0 0.95 0 0  -3 3.5 -0.5 0 -0.4"
              result="neon"
            />
            <feGaussianBlur in="neon" stdDeviation="5" result="bloom" />
            <feMerge>
              <feMergeNode in="bloom" />
              <feMergeNode in="bloom" />
              <feMergeNode in="neon" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <motion.div
        className="absolute"
        style={{ y: panY, width: artWidth, height: artHeight, left: (vw - artWidth) / 2, top: -12 }}
      >
        <motion.div className="absolute inset-0" style={{ x, y }}>
          <div className="animate-ken-burns absolute inset-0 origin-top">
            <img
              src={statueLarge}
              srcSet={STATUE_SRCSET}
              sizes={`${Math.ceil(artWidth)}px`}
              alt=""
              decoding="async"
              className="absolute inset-0 h-full w-full"
            />
            <img
              src={statueLarge}
              srcSet={STATUE_SRCSET}
              sizes={`${Math.ceil(artWidth)}px`}
              alt=""
              decoding="async"
              className="animate-crack-pulse absolute inset-0 h-full w-full mix-blend-screen"
              style={{ filter: 'url(#neon-extract)' }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Vignette keeps the nav and hero copy legible over the artwork. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(3,16,10,0.75) 0%, rgba(3,16,10,0.05) 22%, rgba(3,16,10,0.05) 60%, rgba(3,16,10,0.88) 100%),' +
            'radial-gradient(120% 80% at 50% 50%, transparent 55%, rgba(3,16,10,0.7) 100%)',
        }}
      />
      <motion.div className="absolute inset-0 bg-ink" style={{ opacity: shade }} />

      {RAIN.map((r, i) => (
        <span
          key={i}
          className="animate-rain-fall absolute top-0 block rounded-full"
          style={
            {
              left: r.left,
              width: r.width,
              height: r.height,
              background: 'linear-gradient(180deg, transparent, rgba(61,255,154,0.25) 40%, #3DFF9A)',
              boxShadow: '0 0 8px rgba(61,255,154,0.6)',
              '--dur': r.dur,
              '--delay': r.delay,
            } as CSSProperties
          }
        />
      ))}

      <div className="animate-scan-sweep absolute inset-x-0 top-0 h-24">
        <div className="h-full w-full bg-gradient-to-b from-transparent to-neon/10" />
        <div className="h-px w-full bg-neon/70 shadow-[0_0_12px_rgba(61,255,154,0.9)]" />
      </div>

      {PETALS.map((p, i) => (
        <span
          key={i}
          className="animate-petal-fall absolute top-0 block"
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size * 0.7,
              borderRadius: '80% 0 80% 0',
              background: p.rose
                ? 'linear-gradient(135deg, #FFE9EF, #F6B7C9 60%, #D9748F)'
                : 'linear-gradient(135deg, #FFFFFF, #F2EDE4 60%, #A8F5CF)',
              '--dur': p.dur,
              '--delay': p.delay,
              '--drift': p.drift,
              '--spin': p.spin,
            } as CSSProperties
          }
        />
      ))}
      <div className="scanlines absolute inset-0 opacity-50" />
    </div>
  );
}
