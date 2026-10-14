import { motion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useRef } from 'react';
import type { CSSProperties } from 'react';

type AnimatedTextProps = {
  text: string;
  className?: string;
  style?: CSSProperties;
};

type CharProps = {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
};

function Char({ char, progress, range }: CharProps) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative inline-block whitespace-pre">
      <span className="invisible">{char}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity }}>
        {char}
      </motion.span>
    </span>
  );
}

export default function AnimatedText({ text, className = '', style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const words = text.split(' ');
  const total = text.length;
  let index = 0;

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((word, w) => {
        const wordStart = index;
        // Count the word plus its trailing space so progress spans the full text.
        index += word.length + 1;
        return (
          <span key={w}>
            {/* Keep a word's characters together so lines only break between words. */}
            <span className="inline-block whitespace-nowrap">
              {word.split('').map((char, c) => {
                const start = (wordStart + c) / total;
                const end = (wordStart + c + 1) / total;
                return <Char key={c} char={char} progress={scrollYProgress} range={[start, end]} />;
              })}
            </span>
            {w < words.length - 1 && ' '}
          </span>
        );
      })}
    </p>
  );
}
