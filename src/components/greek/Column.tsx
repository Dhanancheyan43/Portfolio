type ColumnProps = {
  className?: string;
  broken?: boolean;
};

// Ionic column in marble with neon edge lines.
export default function Column({ className = '', broken = false }: ColumnProps) {
  const flutes = [30, 42, 54, 66, 78, 90];
  return (
    <svg viewBox="0 0 120 400" className={className} aria-hidden="true">
      {/* Capital: abacus + volutes */}
      {!broken && (
        <g>
          <rect x="6" y="8" width="108" height="12" rx="2" fill="url(#marble-fill)" />
          <path d="M14 20 H106 Q110 34 96 36 H24 Q10 34 14 20 Z" fill="url(#marble-shade)" />
          <circle cx="18" cy="34" r="13" fill="url(#marble-radial)" />
          <circle cx="102" cy="34" r="13" fill="url(#marble-radial)" />
          <path d="M18 34 m-8 0 a8 8 0 1 0 8 -8 a5 5 0 1 0 5 5" fill="none" stroke="#7BBF99" strokeWidth="1.6" />
          <path d="M102 34 m8 0 a8 8 0 1 1 -8 -8 a5 5 0 1 1 -5 5" fill="none" stroke="#7BBF99" strokeWidth="1.6" />
          <rect x="24" y="44" width="72" height="8" fill="url(#marble-fill)" />
        </g>
      )}
      {/* Shaft */}
      <path
        d={
          broken
            ? 'M26 120 L40 104 L52 118 L66 98 L80 116 L94 108 V352 H26 Z'
            : 'M26 52 H94 L92 352 H28 Z'
        }
        fill="url(#marble-shade)"
      />
      {flutes.map((x) => (
        <line
          key={x}
          x1={x + 1}
          y1={broken ? 122 : 58}
          x2={x + 1}
          y2="346"
          stroke="#9DB9A8"
          strokeOpacity="0.7"
          strokeWidth="2"
        />
      ))}
      {/* Base */}
      <rect x="20" y="352" width="80" height="12" rx="3" fill="url(#marble-fill)" />
      <rect x="10" y="364" width="100" height="18" rx="2" fill="url(#marble-shade)" />
      <rect x="4" y="382" width="112" height="14" rx="2" fill="url(#marble-fill)" />
      {/* Neon edge */}
      <path
        d={broken ? 'M26 120 V352 M94 108 V352' : 'M26 52 L28 352 M94 52 L92 352'}
        stroke="#3DFF9A"
        strokeWidth="1.2"
        strokeOpacity="0.8"
        filter="url(#neon-glow)"
      />
    </svg>
  );
}
