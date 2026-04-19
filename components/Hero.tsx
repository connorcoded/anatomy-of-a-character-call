export function Hero() {
  return (
    <section id="top" className="mx-auto max-w-measure px-6 pb-10 pt-16 md:pt-24">
      <p className="mb-6 font-mono text-xs tracking-[0.18em] text-accent">
        RUNWAY / CHARACTERS
      </p>
      <h1 className="font-serif text-[2.25rem] font-semibold leading-[1.1] tracking-tight text-ink md:text-[3.25rem] md:leading-[1.05]">
        Anatomy of a Character Call
      </h1>
      <p className="mt-5 font-serif text-[1.1rem] italic leading-snug text-mute md:text-[1.25rem]">
        What actually happens in the milliseconds between a user speaking and an avatar
        responding.
      </p>
      <p className="mt-6 font-sans text-sm text-mute">
        By <span className="text-ink">[Author]</span> · April 2026 · 5 min read
      </p>

      <div className="mt-10 border-l-2 border-accent bg-white/60 p-5">
        <p className="font-sans text-[0.95rem] font-semibold leading-relaxed text-ink">
          Runway Characters, launched March 2026, is a real-time video agent API that generates
          conversational avatars frame by frame over WebRTC. It runs on GWM-1, Runway&apos;s
          General World Model.
        </p>
      </div>
    </section>
  );
}
