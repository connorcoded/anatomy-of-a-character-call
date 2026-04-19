type Props = {
  eyebrow: string;
  id: string;
  children: React.ReactNode;
};

export function SectionHeading({ eyebrow, id, children }: Props) {
  return (
    <div className="anchor-offset h2-anchor mt-20 mb-8" id={id}>
      <p className="mb-3 font-serif text-[0.95rem] italic text-mute">{eyebrow}</p>
      <h2 className="font-serif text-[1.65rem] font-semibold leading-tight tracking-tight text-ink md:text-[2rem]">
        {children}
        <a
          href={`#${id}`}
          aria-label="Link to section"
          className="anchor-link ml-2 align-middle font-sans text-base text-mute no-underline hover:text-accent"
        >
          #
        </a>
      </h2>
    </div>
  );
}
