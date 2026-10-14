import type { CSSProperties } from 'react';

const PETALS = Array.from({ length: 16 }, (_, i) => {
  // Deterministic pseudo-random spread so the layout is stable between renders.
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return {
    left: `${r(1) * 100}%`,
    size: 10 + r(2) * 14,
    dur: `${14 + r(3) * 16}s`,
    delay: `${-r(4) * 30}s`,
    drift: `${(r(5) - 0.5) * 30}vw`,
    spin: `${(r(6) - 0.5) * 900}deg`,
    rose: i % 3 !== 0,
  };
});

// Fixed, non-interactive page backdrop: green glows, cyber grid, scanlines and falling petals.
export default function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 15% 10%, rgba(61,255,154,0.14) 0%, transparent 70%),' +
            'radial-gradient(50% 45% at 90% 30%, rgba(246,183,201,0.10) 0%, transparent 70%),' +
            'radial-gradient(70% 60% at 50% 110%, rgba(20,130,77,0.30) 0%, transparent 70%),' +
            '#03100A',
        }}
      />
      <div
        className="cyber-grid absolute inset-0"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 10%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 10%, transparent 75%)',
        }}
      />
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
      <div className="scanlines absolute inset-0 opacity-60" />
    </div>
  );
}
