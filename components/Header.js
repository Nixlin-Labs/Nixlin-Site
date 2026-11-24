'use client';

import Logo from './Logo';
import AskAnythingButton from './AskAnythingButton';

export default function Header({ onOpenAskRail }) {
  return (
    <header className="relative z-10 w-full px-6 sm:px-10 md:px-14 lg:px-20">
      {/* Transparent top bar — no heavy background, integrates with the cosmic environment */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between sm:h-[4.5rem] md:h-20">

        {/* Left: Brand Identity */}
        <div className="flex items-center">
          <Logo
            className="h-11 w-36 sm:h-12 sm:w-40 md:w-44"
            imageClassName="object-cover object-center"
            priority={true}
          />
        </div>

        <div className="flex items-center gap-5 sm:gap-8">
          <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
            {/* <a href="#services" className="text-[11px] text-secondary/70 transition-colors hover:text-primary">Services</a> */}
            <a href="#transformation" className="text-[11px] text-secondary/70 transition-colors hover:text-primary">Approach</a>
            <a href="#contact" className="text-[11px] text-secondary/70 transition-colors hover:text-primary">Contact</a>
          </nav>

          {/* <AskAnythingButton onClick={onOpenAskRail} showShortcut /> */}
        </div>
      </div>
    </header>
  );
}
