import FadeIn from '../components/FadeIn';
import AnimatedText from '../components/AnimatedText';
import ContactButton from '../components/ContactButton';
import Column from '../components/greek/Column';
import Amphora from '../components/greek/Amphora';
import Bust from '../components/greek/Bust';
import { FlowerCluster } from '../components/greek/Flower';

const DECORATIONS = [
  {
    Art: () => <Column className="h-auto w-full" />,
    className: 'top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[70px] sm:w-[90px] md:w-[120px]',
    delay: 0.1,
    x: -80,
  },
  {
    Art: () => <FlowerCluster className="h-auto w-full" />,
    className: 'bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]',
    delay: 0.25,
    x: -80,
  },
  {
    Art: () => <Amphora className="h-auto w-full" />,
    className: 'top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[100px] sm:w-[130px] md:w-[170px]',
    delay: 0.15,
    x: 80,
  },
  {
    Art: () => <Bust className="h-auto w-full" />,
    className: 'bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[110px] sm:w-[150px] md:w-[190px]',
    delay: 0.3,
    x: 80,
  },
];

const ABOUT_TEXT =
  "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen items-center justify-center px-5 py-20 sm:px-8 md:px-10"
    >
      {DECORATIONS.map((item, i) => (
        <FadeIn
          key={i}
          delay={item.delay}
          x={item.x}
          y={0}
          duration={0.9}
          className={`pointer-events-none absolute opacity-80 md:opacity-100 ${item.className}`}
        >
          <item.Art />
        </FadeIn>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn delay={0} y={40} className="flex flex-col items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-neon/80 sm:text-xs">
              // chapter i
            </span>
            <h2
              className="hero-heading text-center font-display font-black uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
            >
              About me
            </h2>
          </FadeIn>
          <AnimatedText
            text={ABOUT_TEXT}
            className="max-w-[600px] text-center font-serif font-medium leading-relaxed text-marble"
            style={{ fontSize: 'clamp(1.15rem, 2.3vw, 1.65rem)' }}
          />
        </div>
        <ContactButton />
      </div>
    </section>
  );
}
