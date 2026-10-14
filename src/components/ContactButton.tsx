type ContactButtonProps = {
  className?: string;
};

export default function ContactButton({ className = '' }: ContactButtonProps) {
  return (
    <a
      href="#contact"
      className={`inline-block rounded-full px-8 py-3 font-cinzel text-xs font-semibold uppercase tracking-widest text-white transition-[filter] duration-200 hover:brightness-110 sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base ${className}`}
      style={{
        background: 'linear-gradient(123deg, #03140B 6%, #0F6B42 38%, #22C673 72%, #F6B7C9 100%)',
        boxShadow:
          '0px 4px 18px rgba(61, 255, 154, 0.35), 4px 4px 12px #14824D inset',
        outline: '2px solid #F2EDE4',
        outlineOffset: '-3px',
        textShadow: '0 1px 6px rgba(3, 16, 10, 0.6)',
      }}
    >
      Contact Me
    </a>
  );
}
