'use client';

export default function PrimaryActionButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex min-h-12 items-center justify-center gap-5 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-background-deep shadow-[0_6px_18px_rgba(0,252,137,0.12)] transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-[0_8px_24px_rgba(0,252,137,0.2)] active:translate-y-px active:shadow-[0_3px_10px_rgba(0,252,137,0.12)] focus-visible:outline-offset-4 sm:px-6"
    >
      <span>Start a project</span>
      <span
        className="transition-transform duration-200 group-hover:translate-x-1"
        aria-hidden="true"
      >
        →
      </span>
    </button>
  );
}
