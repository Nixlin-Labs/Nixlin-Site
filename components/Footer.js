'use client';

import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full py-12 px-6 sm:px-10 md:px-14 lg:px-20 max-w-7xl mx-auto border-t border-border/20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Left: Brand name & services description */}
        <div className="flex items-center gap-3">
          <Logo className="w-8 h-8" />
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wider text-primary">NIXLIN</span>
            <span className="text-xs text-secondary/70 font-mono-meta">
              Software products & services
            </span>
          </div>
        </div>

        {/* Center: Direct Contact */}
        <div className="font-mono-meta text-xs">
          <span className="text-secondary/60 mr-2">Email:</span>
          <a
            href="mailto:nixlinlabs@gmail.com"
            className="text-primary hover:text-accent underline decoration-border hover:decoration-accent transition-colors"
          >
            nixlinlabs@gmail.com
          </a>
        </div>

        {/* Right: Copyright */}
        <div className="font-mono-meta text-xs text-secondary/60">
          <span>© {currentYear} Nixlin. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
