import FadeIn from '../components/FadeIn';
import Magnet from '../components/Magnet';
import ContactButton from '../components/ContactButton';
import GreekKey from '../components/greek/GreekKey';
import FitText from '../components/FitText';

const NAV_LINKS = ['About', 'Price', 'Projects', 'Contact'];

export default function HeroSection() {
  return (
    <section className="relative flex h-screen flex-col" style={{ overflowX: 'clip' }}>
      <FadeIn delay={0} y={-20}>
        <nav className="flex justify-between px-4 pt-6 sm:px-6 md:px-10 md:pt-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="font-cinzel text-xs font-semibold uppercase tracking-wide sm:text-sm sm:tracking-wider text-marble transition-all duration-200 hover:text-neon hover:opacity-90 md:text-lg lg:text-[1.4rem]"
            >
              {link}
            </a>
          ))}
        </nav>
        <GreekKey className="mt-4 opacity-40 md:mt-5" height={14} />
      </FadeIn>

      <div className="px-4 sm:px-6 md:px-10">
        <FadeIn delay={0.15} y={40}>
          <h1 className="mt-6 w-full sm:mt-4 md:mt-3">
            <FitText max={260} className="hero-heading pb-[0.08em] font-algerian font-black uppercase leading-none tracking-tight">
              Dhanancheyan
            </FitText>
          </h1>
        </FadeIn>
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 px-4 pb-7 sm:px-6 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20} className="relative z-20">
          <p
            className="max-w-[160px] font-serif font-medium italic leading-snug tracking-wide text-marble sm:max-w-[220px] md:max-w-[280px]"
            style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.7rem)' }}
          >
            a 3d creator driven by crafting striking and unforgettable projects
          </p>
          <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-neon/80 sm:text-xs">
            // est. olympus
          </span>
        </FadeIn>
        <FadeIn delay={0.5} y={20} className="relative z-20">
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
          >
            <ContactButton />
          </Magnet>
        </FadeIn>
      </div>

    </section>
  );
}
