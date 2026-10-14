import type { SVGProps } from 'react';

type FlowerProps = Omit<SVGProps<SVGSVGElement>, 'rotate'> & {
  variant?: 'rose' | 'white';
  rotate?: number;
};

// Layered-petal bloom drawn around the origin in a -50..50 viewBox.
export function Flower({ variant = 'rose', rotate = 0, ...svgProps }: FlowerProps) {
  const fill = variant === 'rose' ? 'url(#petal-rose)' : 'url(#petal-white)';
  const core = variant === 'rose' ? '#B8506E' : '#D8C08A';
  return (
    <svg viewBox="-50 -50 100 100" aria-hidden="true" {...svgProps}>
      <g transform={`rotate(${rotate})`}>
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse key={`o${i}`} cx="0" cy="-22" rx="15" ry="24" fill={fill} transform={`rotate(${i * 45})`} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <ellipse
            key={`m${i}`}
            cx="0"
            cy="-13"
            rx="11"
            ry="15"
            fill={fill}
            stroke="#ffffff"
            strokeOpacity="0.35"
            transform={`rotate(${i * 60 + 22})`}
          />
        ))}
        <circle r="9" fill={core} />
        <path d="M-5 0 a5 5 0 1 1 5 5 a3 3 0 1 1 -3 -3" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

type FlowerClusterProps = {
  className?: string;
  flip?: boolean;
};

// A spray of roses and white blooms on neon-veined leaves.
export function FlowerCluster({ className = '', flip = false }: FlowerClusterProps) {
  const leaf = 'M0 0 C 18 -14, 48 -14, 64 0 C 48 14, 18 14, 0 0 Z';
  const leaves = [
    { x: 40, y: 150, r: -150 },
    { x: 70, y: 160, r: -20 },
    { x: 120, y: 150, r: -60 },
    { x: 150, y: 165, r: 10 },
    { x: 95, y: 175, r: -110 },
    { x: 60, y: 120, r: -170 },
    { x: 165, y: 125, r: -30 },
  ];
  const blooms = [
    { x: 70, y: 105, s: 70, v: 'rose' as const, r: 0 },
    { x: 130, y: 95, s: 60, v: 'white' as const, r: 20 },
    { x: 100, y: 140, s: 52, v: 'rose' as const, r: 40 },
    { x: 35, y: 135, s: 40, v: 'white' as const, r: 10 },
    { x: 165, y: 140, s: 42, v: 'rose' as const, r: 30 },
  ];
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden="true"
    >
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.r})`}>
          <path d={leaf} fill="url(#leaf-fill)" />
          <path d="M2 0 H60" stroke="#3DFF9A" strokeWidth="1" strokeOpacity="0.9" filter="url(#neon-glow)" />
        </g>
      ))}
      {blooms.map((b, i) => (
        <Flower key={i} variant={b.v} rotate={b.r} x={b.x - b.s / 2} y={b.y - b.s / 2} width={b.s} height={b.s} />
      ))}
    </svg>
  );
}
