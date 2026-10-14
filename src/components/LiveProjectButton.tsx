type LiveProjectButtonProps = {
  href?: string;
};

export default function LiveProjectButton({ href = '#' }: LiveProjectButtonProps) {
  return (
    <a
      href={href}
      className="neon-border inline-block shrink-0 rounded-full border-2 px-8 py-3 font-mono text-sm uppercase tracking-widest text-neon transition-colors duration-200 hover:bg-neon/10 sm:px-10 sm:py-3.5 sm:text-base"
    >
      Live Project
    </a>
  );
}
