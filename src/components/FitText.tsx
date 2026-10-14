import { useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';

type FitTextProps = {
  children: ReactNode;
  className?: string;
  /** Largest font size in px; the text never grows past this. */
  max?: number;
  /** Fraction of the container width the text should occupy. */
  fill?: number;
  /** Fill used when the container is narrower than 520px (phones). */
  fillNarrow?: number;
};

// Sizes a single line of text to fill its container's width. Re-measures on resize and once
// web fonts finish loading, because the display font's width differs from the fallback's.
export default function FitText({ children, className = '', max = 400, fill = 1, fillNarrow = fill }: FitTextProps) {
  const box = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const fit = () => {
      if (!box.current || !text.current) return;
      text.current.style.fontSize = '100px';
      const natural = text.current.getBoundingClientRect().width;
      if (!natural) return;
      const width = box.current.clientWidth;
      const size = Math.min(max, (width * (width < 520 ? fillNarrow : fill) * 100) / natural);
      text.current.style.fontSize = `${size}px`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    if (box.current) observer.observe(box.current);
    document.fonts?.ready.then(fit);
    document.fonts?.addEventListener('loadingdone', fit);
    return () => {
      observer.disconnect();
      document.fonts?.removeEventListener('loadingdone', fit);
    };
  }, [max, fill, fillNarrow]);

  return (
    <div ref={box} className="w-full text-center">
      <span ref={text} className={`inline-block whitespace-nowrap ${className}`}>
        {children}
      </span>
    </div>
  );
}
