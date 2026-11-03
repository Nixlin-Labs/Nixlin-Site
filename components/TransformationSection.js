'use client';

import AskAnythingButton from './AskAnythingButton';

export default function TransformationSection({ onFocusContact, onOpenAskRail }) {
  return (
    <section
      id="transformation"
      className="relative z-10 w-full px-6 py-20 sm:px-10 md:px-14 md:py-28 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 h-px w-full bg-gradient-to-r from-transparent via-border/40 to-transparent md:mb-28" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-24">
        <div className="launch-copy relative flex flex-col gap-7">
          <div className="flex items-center gap-2.5">
            <span className="h-px w-5 bg-accent/50" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.18em] text-accent/80">
              A clear path to launch
            </span>
          </div>

          <h2 className="text-2xl font-normal leading-[1.2] tracking-tight text-primary sm:text-3xl md:text-4xl">
            Give your idea{' '}
            <span className="font-display italic text-accent">a clear path to launch.</span>
          </h2>

          <p className="max-w-lg text-[15px] font-light leading-[1.75] text-secondary/75 sm:text-base">
            Shape your core message, build an experience that helps people understand what you
            offer, and use their feedback to guide what comes next.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              type="button"
              onClick={onFocusContact}
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-background-deep transition-colors hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-deep"
            >
              Plan your launch
              <span aria-hidden="true">→</span>
            </button>
            <AskAnythingButton onClick={onOpenAskRail} />
          </div>
        </div>

        <div className="flex flex-col gap-10 sm:gap-12">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <span className="font-mono-meta text-[10px] tabular-nums tracking-[0.15em] text-accent/60">01</span>
              <span className="h-px max-w-[2rem] flex-1 bg-border/20" aria-hidden="true" />
              <h3 className="text-base font-medium text-primary">Clarify the idea</h3>
            </div>
            <p className="pl-8 text-[13px] font-light leading-relaxed text-secondary/65 sm:text-sm">
              Define the core message and what the experience needs to do.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <span className="font-mono-meta text-[10px] tabular-nums tracking-[0.15em] text-accent/60">02</span>
              <span className="h-px max-w-[2rem] flex-1 bg-border/20" aria-hidden="true" />
              <h3 className="text-base font-medium text-primary">Build the launch experience</h3>
            </div>
            <p className="pl-8 text-[13px] font-light leading-relaxed text-secondary/65 sm:text-sm">
              Create a landing page, website, or product experience people can explore.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <span className="font-mono-meta text-[10px] tabular-nums tracking-[0.15em] text-accent/60">03</span>
              <span className="h-px max-w-[2rem] flex-1 bg-border/20" aria-hidden="true" />
              <h3 className="text-base font-medium text-primary">Plan the next move</h3>
            </div>
            <p className="pl-8 text-[13px] font-light leading-relaxed text-secondary/65 sm:text-sm">
              Use what you learn to guide future improvements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
