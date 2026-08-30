'use client';

import Logo from './Logo';

export default function Header({ onOpenAskRail }) {
  return (
    <header className="relative z-10 w-full pt-8 pb-6 px-6 sm:px-10 md:px-14 lg:px-20 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      {/* Left: Brand & Identity */}
      <div className="flex items-center gap-3.5">
        <div className="p-1.5 rounded-lg bg-surface border border-border/40 flex items-center justify-center shadow-inner">
          <Logo className="w-8 h-8" priority={true} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg tracking-wider text-primary">NIXLIN</span>
            <span className="text-xs text-secondary/70 font-mono-meta hidden sm:inline-block">/ 2026</span>
          </div>
          <p className="text-xs text-secondary/80 tracking-wide font-sans">
            Built to move ideas forward.
          </p>
        </div>
      </div>

      {/* Right: Studio Metadata & Ask Nixlin Trigger */}
      <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-6 sm:gap-8">
        <div className="hidden sm:flex flex-col text-right font-mono-meta text-[11px] text-secondary/70 uppercase tracking-widest leading-relaxed">
          <span>Software products & services</span>
          <span className="text-accent/80 flex items-center justify-end gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
            Remote
          </span>
        </div>

        {/* Ask Nixlin Button with / shortcut badge */}
        <button
          type="button"
          onClick={onOpenAskRail}
          aria-label="Open Ask Nixlin conversational assistant (Shortcut: /)"
          className="group relative inline-flex items-center gap-2.5 px-4 py-2 rounded-md bg-surface/90 hover:bg-surface border border-border/60 hover:border-accent/40 text-xs font-mono-meta text-primary transition-all duration-200 cursor-pointer shadow-sm hover:shadow-accent/10 focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-125 transition-transform" />
          <span className="font-medium text-primary tracking-wide">Ask Nixlin</span>
          <span className="px-1.5 py-0.5 text-[10px] rounded bg-background-deep/80 text-secondary border border-border/40 font-mono group-hover:text-accent group-hover:border-accent/30 transition-colors">
            /
          </span>
        </button>
      </div>
    </header>
  );
}
