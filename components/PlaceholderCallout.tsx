type Props = {
  children: React.ReactNode;
};

export function PlaceholderCallout({ children }: Props) {
  return (
    <aside
      role="note"
      aria-label="Placeholder — insider data needed"
      className="my-8 border-l-4 border-ph-border bg-ph-bg px-5 py-4"
    >
      <p className="mb-1 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ph-label">
        Placeholder
      </p>
      <p className="font-serif text-[0.98rem] italic leading-relaxed text-ink/90">{children}</p>
    </aside>
  );
}
