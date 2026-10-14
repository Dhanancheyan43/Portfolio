import capital from '../assets/pillar-capital.webp';
import shaft from '../assets/pillar-shaft.webp';

// Shaft position inside the pillar artwork, as fractions of its width.
export const SHAFT_LEFT = 0.274;
export const SHAFT_RIGHT = 0.723;

function Pillar({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      className={`absolute inset-y-0 flex flex-col ${side === 'left' ? 'left-0' : 'right-0'}`}
      style={{
        width: 'var(--pillar-w)',
        // Mirror the right pillar so both catch the light from the page centre.
        transform: side === 'right' ? 'scaleX(-1)' : undefined,
        filter: 'drop-shadow(0 0 14px rgba(0, 0, 0, 0.55)) drop-shadow(0 0 22px rgba(61, 255, 154, 0.12))',
      }}
    >
      <img src={capital} alt="" className="block h-auto w-full select-none" draggable={false} />
      <div
        className="w-full flex-1"
        style={{
          backgroundImage: `url(${shaft})`,
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto',
          // Each tile starts exactly where the capital's shaft ends.
          backgroundPosition: 'top center',
          marginTop: -1,
        }}
      />
    </div>
  );
}

// Endless Corinthian columns framing the page from the first pixel to the last.
export default function Pillars() {
  return (
    <div className="pointer-events-none absolute inset-0 z-30" aria-hidden="true">
      <Pillar side="left" />
      <Pillar side="right" />
    </div>
  );
}
