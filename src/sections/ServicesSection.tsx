import FadeIn from '../components/FadeIn';
import GreekKey from '../components/greek/GreekKey';

// Procedural marble veining for the section surface.
const MARBLE_VEINS = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='2400' height='2400'><filter id='v'><feTurbulence type='turbulence' baseFrequency='0.0025 0.009' numOctaves='5' seed='11' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.25  0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 -7 1.15'/></filter><rect width='100%' height='100%' filter='url(#v)'/></svg>`,
)}")`;

const SERVICES = [
  {
    name: '3D Modeling',
    description:
      'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.',
  },
  {
    name: 'Rendering',
    description:
      'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.',
  },
  {
    name: 'Motion Design',
    description:
      'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.',
  },
  {
    name: 'Branding',
    description:
      'Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.',
  },
  {
    name: 'Web Design',
    description:
      'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.',
  },
];

export default function ServicesSection() {
  return (
    <section
      id="price"
      className="relative overflow-hidden rounded-t-[40px] px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
      style={{
        background: 'linear-gradient(180deg, #FBF8F2 0%, #F2EDE4 55%, #E4EDE6 100%)',
        color: '#0A2418',
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: MARBLE_VEINS }} />
      <GreekKey className="absolute inset-x-0 top-8 opacity-50 sm:top-10" color="#14824D" height={18} />
      <FadeIn y={40} className="relative flex flex-col items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#14824D] sm:text-xs">// chapter ii</span>
        <h2
          className="mb-16 text-center font-display font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28"
          style={{
            fontSize: 'clamp(3rem, 12vw, 160px)',
            background: 'linear-gradient(180deg, #0A2418 0%, #14824D 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Services
        </h2>
      </FadeIn>

      <div className="relative mx-auto max-w-5xl">
        {SERVICES.map((service, i) => (
          <FadeIn
            key={service.name}
            delay={i * 0.1}
            className="group flex items-center gap-6 py-8 sm:gap-10 sm:py-10 md:gap-14 md:py-12"
            style={{
              borderTop: i === 0 ? 'none' : '1px solid rgba(10, 36, 24, 0.18)',
            }}
          >
            <span
              className="shrink-0 font-cinzel font-black leading-none text-[#0A2418] transition-colors duration-300 group-hover:text-[#14824D]"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-2 sm:gap-3">
              <h3 className="font-cinzel font-semibold uppercase tracking-wide" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>
                {service.name}
              </h3>
              <p
                className="max-w-2xl font-serif font-medium leading-relaxed"
                style={{ fontSize: 'clamp(1rem, 1.8vw, 1.45rem)', opacity: 0.7 }}
              >
                {service.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
