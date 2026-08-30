'use client';

export default function Hero({ onOpenAskRail, onFocusContact }) {
  return (
    <section className="relative z-10 w-full pt-12 pb-16 md:pt-20 md:pb-24 px-6 sm:px-10 md:px-14 lg:px-20 max-w-7xl mx-auto flex flex-col justify-center">
      {/* Editorial Category Pill / Technical Monospace Meta */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <span className="h-px w-6 bg-accent/60" />
        <span className="font-mono-meta text-xs uppercase tracking-[0.2em] text-accent font-medium">
          Web · Apps · SEO
        </span>
      </div>

      {/* Main Headline with Editorial Serif Emphasis */}
      <div className="max-w-4xl">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-primary font-normal leading-[1.08] sm:leading-[1.04]">
          <span>Ideas,</span>
          <br />
          <span className="text-secondary/90 font-light">built into </span>
          <span className="font-display italic text-accent font-normal decoration-accent/30 underline-offset-8">
            momentum.
          </span>
        </h1>
      </div>

      {/* Supporting Editorial Paragraph and Services Summary */}
      <div className="mt-8 sm:mt-12 max-w-2xl">
        <p className="text-base sm:text-lg md:text-xl text-secondary leading-relaxed font-light">
          Nixlin builds practical websites, applications and digital growth solutions for freelancers, teams and businesses ready to move forward.
        </p>

        {/* Studio Capabilities Overview */}
        <div className="mt-10 pt-8 border-t border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono-meta text-xs">
          <div className="flex flex-col gap-1.5">
            <span className="text-accent/90 font-semibold uppercase tracking-wider">01 / Web</span>
            <span className="text-secondary/80 leading-normal">Fast, bespoke websites & landing experiences.</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-accent/90 font-semibold uppercase tracking-wider">02 / Apps</span>
            <span className="text-secondary/80 leading-normal">Tailored digital products & web applications.</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-accent/90 font-semibold uppercase tracking-wider">03 / SEO</span>
            <span className="text-secondary/80 leading-normal">Organic search visibility & discoverability.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
