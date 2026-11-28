'use client';

import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full py-12 px-6 sm:px-10 md:px-14 lg:px-20 max-w-7xl mx-auto border-t border-border/20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Brand & services */}
        <div className="flex items-center">
          <Logo
            className="h-11 w-36 sm:h-12 sm:w-40 md:w-44"
            imageClassName="object-cover object-center"
          />
        </div>

        {/* Center: Contact and social links */}
        <div className="flex items-center gap-2 text-[12px] font-sans text-secondary/60 sm:gap-3">
          <a
            href="mailto:nixlinlabs@gmail.com"
            className="group inline-flex items-center gap-2 rounded-full text-primary/90 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border/40 transition-colors group-hover:border-accent/60">
              <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            </span>
            {/* <span>nixlinlabs@gmail.com</span> */}
          </a>
          <a
            href="https://www.instagram.com/nixlinlabs/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Nixlin Labs on Instagram (opens in a new tab)"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border/40 text-primary/90 transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>

        {/* Right: Copyright */}
        <div className="text-[11px] font-sans text-secondary/50">
          <span>© {currentYear} Nixlin. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
