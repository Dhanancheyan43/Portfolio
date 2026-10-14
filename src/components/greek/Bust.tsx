// A frontal classical bust with laurel crown, carved in marble.
export default function Bust({ className = '' }: { className?: string }) {
  const curls = [
    [72, 70], [86, 60], [100, 56], [114, 60], [128, 70], [64, 86], [136, 86],
    [78, 64], [122, 64], [92, 56], [108, 56], [60, 104], [140, 104],
  ];
  const laurel = Array.from({ length: 7 }, (_, i) => i);
  return (
    <svg viewBox="0 0 200 300" className={className} aria-hidden="true">
      {/* Pedestal */}
      <rect x="62" y="252" width="76" height="14" rx="2" fill="url(#marble-fill)" />
      <rect x="52" y="266" width="96" height="26" rx="3" fill="url(#marble-shade)" />
      <path d="M58 279 H142" stroke="#3DFF9A" strokeWidth="1.2" filter="url(#neon-glow)" />
      {/* Shoulders and drapery */}
      <path d="M100 180 C 60 184, 26 206, 22 252 H178 C 174 206, 140 184, 100 180 Z" fill="url(#marble-shade)" />
      <path d="M40 222 C 70 236, 92 232, 112 252 M120 196 C 128 216, 146 230, 168 236 M62 206 C 80 220, 98 222, 108 240"
        stroke="#9DB9A8" strokeWidth="2" fill="none" strokeOpacity="0.8" />
      {/* Neck */}
      <path d="M84 150 H116 L120 192 C 108 198, 92 198, 80 192 Z" fill="url(#marble-shade)" />
      {/* Head */}
      <ellipse cx="100" cy="112" rx="38" ry="48" fill="url(#marble-radial)" />
      {/* Hair curls */}
      {curls.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="10" fill="url(#marble-radial)" stroke="#C9D8CE" strokeWidth="1" />
      ))}
      {/* Laurel crown */}
      {laurel.map((i) => {
        const t = -70 + i * 23.3;
        const rad = (t * Math.PI) / 180;
        const x = 100 + Math.sin(rad) * 44;
        const y = 92 - Math.cos(rad) * 30;
        return <ellipse key={i} cx={x} cy={y} rx="9" ry="4" fill="url(#leaf-fill)" transform={`rotate(${t + 90} ${x} ${y})`} />;
      })}
      {/* Serene carved features */}
      <g stroke="#93AF9F" strokeWidth="1.8" fill="none" strokeLinecap="round">
        <path d="M80 106 q8 -5 16 0 M104 106 q8 -5 16 0" />
        <path d="M82 114 q6 3 12 0 M106 114 q6 3 12 0" />
        <path d="M100 108 L96 132 Q100 136 104 132" />
        <path d="M90 144 q10 5 20 0" />
      </g>
    </svg>
  );
}
