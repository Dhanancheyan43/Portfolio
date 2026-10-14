// Shared gradients for the marble/neon SVG art. Rendered once near the root so every
// SVG on the page can reference these ids.
export default function MarbleDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="marble-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFDF8" />
          <stop offset="45%" stopColor="#EDE6DA" />
          <stop offset="100%" stopColor="#B9C9BE" />
        </linearGradient>
        <linearGradient id="marble-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C7D3CB" />
          <stop offset="35%" stopColor="#FBF8F2" />
          <stop offset="70%" stopColor="#E9E2D6" />
          <stop offset="100%" stopColor="#A9BDB1" />
        </linearGradient>
        <radialGradient id="marble-radial" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0%" stopColor="#FFFDF8" />
          <stop offset="60%" stopColor="#E7E0D3" />
          <stop offset="100%" stopColor="#A7BBAF" />
        </radialGradient>
        <radialGradient id="petal-rose" cx="0.5" cy="0.9" r="0.9">
          <stop offset="0%" stopColor="#FFE9EF" />
          <stop offset="55%" stopColor="#F6B7C9" />
          <stop offset="100%" stopColor="#D9748F" />
        </radialGradient>
        <radialGradient id="petal-white" cx="0.5" cy="0.9" r="0.9">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#F2EDE4" />
          <stop offset="100%" stopColor="#C9DCCF" />
        </radialGradient>
        <linearGradient id="leaf-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3DFF9A" />
          <stop offset="45%" stopColor="#14824D" />
          <stop offset="100%" stopColor="#0A2418" />
        </linearGradient>
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
