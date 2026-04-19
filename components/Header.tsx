export function Header() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-breakout items-center justify-between px-6 py-5">
        <a href="#top" className="font-serif text-lg font-semibold tracking-tight text-ink">
          Runway
        </a>
        <nav aria-label="primary" className="hidden gap-7 font-sans text-sm text-mute md:flex">
          <a href="#read" className="hover:text-ink">
            Read
          </a>
          <a href="#work" className="hover:text-ink">
            Work
          </a>
          <a href="#about" className="hover:text-ink">
            About
          </a>
        </nav>
      </div>
    </header>
  );
}
