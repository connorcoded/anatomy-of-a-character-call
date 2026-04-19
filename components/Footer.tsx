export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-bg">
      <div className="mx-auto grid max-w-breakout gap-8 px-6 py-14 md:grid-cols-3">
        <div>
          <p className="font-serif text-lg font-semibold tracking-tight">Runway</p>
          <p className="mt-2 font-sans text-sm text-bg/60">
            Research and products for generative video.
          </p>
        </div>
        <div className="font-sans text-sm text-bg/70">
          <p>Published April 2026</p>
          <p className="mt-1">5 min read</p>
          <div className="mt-3 flex gap-4">
            <a
              href="https://twitter.com/intent/tweet?text=Anatomy%20of%20a%20Character%20Call"
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent"
            >
              Twitter
            </a>
            <a
              href="https://www.linkedin.com/sharing/share-offsite/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent"
            >
              LinkedIn
            </a>
            <a href="#top" className="hover:text-accent">
              Copy link
            </a>
          </div>
        </div>
        <div className="font-sans text-sm text-bg/70 md:text-right">
          <p>
            <a href="#" className="underline-offset-4 hover:underline">
              About Runway Characters
            </a>
          </p>
          <p className="mt-1">
            <a href="#" className="underline-offset-4 hover:underline">
              Read the docs
            </a>
          </p>
          <p className="mt-1">
            <a href="#" className="underline-offset-4 hover:underline">
              Contact sales
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
