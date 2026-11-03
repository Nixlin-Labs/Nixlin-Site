'use client';

export default function AskAnythingButton({ onClick, showShortcut = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Ask anything about Nixlin"
      className="ask-anything-button group inline-flex min-h-11 items-center gap-2.5 px-3.5 py-1.5 text-[12px] font-semibold text-background-deep transition-colors focus-visible:outline-offset-4"
    >
      <span className="ask-anything-bot" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none" className="h-full w-full">
          <path d="M16 3.5v3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="16" cy="3.5" r="1.5" fill="currentColor" />
          <rect x="5" y="7.5" width="22" height="19" rx="7" fill="#DCEFE3" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="16" r="1.8" fill="currentColor" />
          <circle cx="20" cy="16" r="1.8" fill="currentColor" />
          <path d="M12 21c1.1 1 2.4 1.5 4 1.5s2.9-.5 4-1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="3.5" cy="13" r="1" fill="#4FAE68" />
          <circle cx="28.5" cy="20" r="1" fill="#4FAE68" />
        </svg>
      </span>
      <span>Ask anything</span>
      {showShortcut && (
        <kbd className="ask-anything-shortcut ml-0.5 rounded-full px-1.5 py-0.5 font-mono-meta text-[9px]">/</kbd>
      )}
    </button>
  );
}
