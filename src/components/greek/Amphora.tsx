// Mirror a right-hand outline into a symmetric closed path around x = 100.
function symmetricPath(right: [number, number][]) {
  const left = [...right].reverse().map(([x, y]) => [200 - x, y] as [number, number]);
  const pts = [...right, ...left];
  return `M${pts.map(([x, y]) => `${x} ${y}`).join(' L')} Z`;
}

const BODY = symmetricPath([
  [126, 18],
  [122, 26],
  [114, 32],
  [113, 70],
  [130, 86],
  [152, 104],
  [166, 128],
  [170, 154],
  [164, 186],
  [148, 220],
  [128, 246],
  [114, 258],
  [116, 270],
  [130, 282],
  [130, 292],
]);

export default function Amphora({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 300" className={className} aria-hidden="true">
      {/* Handles */}
      <path d="M86 44 C 50 40, 40 80, 66 96" fill="none" stroke="url(#marble-shade)" strokeWidth="9" strokeLinecap="round" />
      <path d="M114 44 C 150 40, 160 80, 134 96" fill="none" stroke="url(#marble-shade)" strokeWidth="9" strokeLinecap="round" />
      <path d={BODY} fill="url(#marble-radial)" />
      {/* Neon meander band and rings */}
      <g stroke="#3DFF9A" fill="none" strokeWidth="1.6" filter="url(#neon-glow)">
        <path d="M40 140 H160 M42 168 H158" />
        {Array.from({ length: 7 }, (_, i) => {
          const x = 46 + i * 16;
          return <path key={i} d={`M${x} 166 V144 H${x + 12} V160 H${x + 5} V151`} />;
        })}
        <path d="M86 70 H114 M78 246 H122" strokeOpacity="0.7" />
      </g>
      <path d="M80 200 q20 -14 40 0" stroke="#F6B7C9" strokeWidth="2" fill="none" strokeOpacity="0.8" />
    </svg>
  );
}
