type GreekKeyProps = {
  className?: string;
  color?: string;
  height?: number;
};

// A horizontal meander (Greek key) band that tiles to any width.
export default function GreekKey({ className = '', color = '#3DFF9A', height = 24 }: GreekKeyProps) {
  const id = `meander-${color.replace(/[^a-z0-9]/gi, '')}`;
  return (
    <svg className={className} width="100%" height={height} aria-hidden="true">
      <defs>
        <pattern id={id} width={height} height={height} patternUnits="userSpaceOnUse">
          <path
            d={`M0 ${height * 0.875} H${height * 0.875} V${height * 0.125} H${height * 0.25} V${height * 0.625} H${height * 0.625} V${height * 0.375} H${height * 0.45}`}
            fill="none"
            stroke={color}
            strokeWidth={height / 12}
            strokeLinecap="square"
          />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${id})`} />
    </svg>
  );
}
