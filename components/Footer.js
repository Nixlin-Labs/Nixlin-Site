'use client';

import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full py-12 px-6 sm:px-10 md:px-14 lg:px-20 max-w-7xl mx-auto border-t border-border/20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Brand & services */}
        <div className="flex items-center gap-3">
          <Logo className="w-6 h-6" />
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-xs tracking-[0.12em] text-primary">NIXLIN</span>
            <span className="text-[11px] text-secondary/60 font-sans">
              Software products &amp; services
            </span>
          </div>
        </div>

        {/* Center: Direct Contact */}
        <div className="text-[12px] font-sans text-secondary/60">
          <span className="mr-2">Email:</span>
          <a
            href="mailto:nixlinlabs@gmail.com"
            className="text-primary/90 hover:text-accent underline decoration-border/40 hover:decoration-accent/60 transition-colors"
          >
            nixlinlabs@gmail.com
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
