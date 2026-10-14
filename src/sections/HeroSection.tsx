import { useState } from 'react';
import FadeIn from '../components/FadeIn';
import Magnet from '../components/Magnet';
import ContactButton from '../components/ContactButton';
import GreekKey from '../components/greek/GreekKey';
import Bust from '../components/greek/Bust';
import { FlowerCluster } from '../components/greek/Flower';

const NAV_LINKS = ['About', 'Price', 'Projects', 'Contact'];

// Drop the portrait into /public under this name; the marble bust shows until it exists.
const PORTRAIT_URL = '/hero-portrait.png';

function Shrine() {
  const [hasPortrait, setHasPortrait] = useState(true);

  return (
    <div className="relative">
      <div className="neon-border relative aspect-[3/4] w-full overflow-hidden rounded-t-full border-2 bg-gradient-to-b from-moss/80 via-ink/70 to-moss">
        <div className="cyber-grid absolute inset-0 opacity-60" />
        {hasPortrait ? (
          <img
            src={PORTRAIT_URL}
            alt="Portrait of Jack"
            className="relative h-full w-full select-none object-cover object-top"
            draggable={false}
            onError={() => setHasPortrait(false)}
          />
        ) : (
          <Bust className="relative mx-auto mt-[12%] h-[88%] w-auto" />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ink/80 to-transparent" />
      </div>
      <FlowerCluster className="absolute -bottom-[6%] -left-[22%] w-[48%]" />
      <FlowerCluster flip className="absolute -bottom-[6%] -right-[22%] w-[48%]" />
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative flex h-screen flex-col" style={{ overflowX: 'clip' }}>
      <FadeIn delay={0} y={-20}>
        <nav className="flex justify-between px-6 pt-6 md:px-10 md:pt-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="font-cinzel text-sm font-semibold uppercase tracking-wider text-marble transition-all duration-200 hover:text-neon hover:opacity-90 md:text-lg lg:text-[1.4rem]"
            >
              {link}
            </a>
          ))}
        </nav>
        <GreekKey className="mt-4 opacity-40 md:mt-5" height={14} />
      </FadeIn>

      <div className="overflow-hidden">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading mt-6 w-full pb-[0.12em] whitespace-nowrap text-center font-display text-[11vw] font-black uppercase leading-none tracking-tight sm:mt-4 sm:text-[11.5vw] md:mt-2 md:text-[12vw] lg:text-[12.5vw]">
            Hi, i&apos;m jack
          </h1>
        </FadeIn>
      </div>

      <div className="mt-auto flex items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
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
          <ContactButton />
        </FadeIn>
      </div>

      <div className="absolute left-1/2 top-1/2 z-10 w-[220px] -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:w-[260px] sm:translate-y-0 md:w-[300px] lg:w-[340px]">
        <FadeIn delay={0.6} y={30}>
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
            wrapperClassName="w-full"
          >
            <Shrine />
          </Magnet>
        </FadeIn>
      </div>
    </section>
  );
}
