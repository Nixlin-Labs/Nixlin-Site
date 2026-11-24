'use client';

import AskAnythingButton from './AskAnythingButton';
import PrimaryActionButton from './PrimaryActionButton';

export default function Hero({ onOpenAskRail, onFocusContact }) {
  return (
    <section className="hero-section relative z-10 flex min-h-[calc(100svh-5rem)] w-full items-center px-6 py-16 sm:px-10 sm:py-20 md:px-14 lg:px-20">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(15rem,0.7fr)] lg:gap-16">
        <div className="hero-copy relative">
          <div className="mb-7 flex items-center gap-3 sm:mb-9">
            <span className="h-px w-7 bg-accent/65" aria-hidden="true" />
            <span className="text-[10px] font-mono-meta tracking-[0.12em] text-secondary/75 sm:text-[11px]">
              WEB · APPS · SEO
            </span>
          </div>

          <h1 className="max-w-[11ch] text-[clamp(3.4rem,7.2vw,6.9rem)] font-normal leading-[0.99] tracking-[-0.055em] text-primary">
            Ideas,
            <br />
            built into
            <br />
            <span className="font-display italic tracking-[-0.035em] text-accent">momentum.</span>
          </h1>

          <p className="mt-7 max-w-34rem text-[15px] font-light leading-[1.8] text-secondary/85 sm:mt-8 sm:text-base md:text-[17px]">
            Nixlin builds practical websites, applications and digital growth solutions for
            freelancers, teams and businesses ready to move forward.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 sm:mt-10">
            <PrimaryActionButton onClick={onFocusContact} />
            <AskAnythingButton onClick={onOpenAskRail} showShortcut />
          </div>
        </div>

        <div className="hero-services lg:justify-self-end lg:pb-3">
          <h2 className="mb-5 font-mono-meta text-[10px] tracking-[0.12em] text-secondary/70">CAPABILITIES</h2>
          <div id="services" className="border-t border-border/35">
            {[
              ['01', 'Web', 'Bespoke websites & landing experiences.'],
              ['02', 'Apps', 'Tailored digital products & web applications.'],
              ['03', 'SEO', 'Organic search visibility & discoverability.'],
              ['04', 'Marketing', 'Driving attention with targeted strategies.'],
            ].map(([number, title, description]) => (
              <div key={title} className="service-line grid grid-cols-[2.25rem_4.2rem_minmax(0,1fr)] items-baseline gap-2 border-b border-border/25 py-4 sm:gap-3">
                <span className="font-mono-meta text-[10px] text-accent/70">{number}</span>
                <h2 className="text-sm font-medium text-primary">{title}</h2>
                <p className="text-[12px] leading-relaxed text-secondary/70 sm:text-[13px]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
