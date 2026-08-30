'use client';

export default function Background() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Deep Base Layer */}
      <div className="absolute inset-0 bg-[#021B16]" />

      {/* Layer 1: Radial Glows */}
      <div className="absolute inset-0 glow-radial-1 opacity-70" />
      <div className="absolute inset-0 glow-radial-2 opacity-60" />

      {/* Layer 2: Technical Grid Layer */}
      <div className="absolute inset-0 bg-grid-tech opacity-40" />

      {/* Layer 3: Subtle Diagonal Weave Texture */}
      <div className="absolute inset-0 bg-weave opacity-60" />

      {/* Subtle Structural Framing Lines */}
      <div className="absolute top-0 left-8 right-8 structural-line-h opacity-40 hidden md:block" />
      <div className="absolute bottom-0 left-8 right-8 structural-line-h opacity-40 hidden md:block" />
      <div className="absolute top-0 bottom-0 left-8 structural-line-v opacity-30 hidden lg:block" />
      <div className="absolute top-0 bottom-0 right-8 structural-line-v opacity-30 hidden lg:block" />

      {/* Subtle Noise / Gradient Accent Bloom */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-3xl opacity-20 bg-gradient-to-b from-[#7ED957] to-[#0A3D31] pointer-events-none"
      />
    </div>
  );
}
