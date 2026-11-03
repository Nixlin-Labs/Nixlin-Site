'use client';

import UniverseCanvas from './universe/UniverseCanvas';

export default function Background({ onUniverseStateChange }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Deep emerald atmosphere keeps the content readable while the field moves. */}
      <div className="absolute inset-0 bg-[#021B16]" />
      <div className="cosmic-atmosphere absolute inset-0" />

      {/* 2. WebGL Cosmic Universe Engine */}
      <UniverseCanvas onStateChange={onUniverseStateChange} />

      <div className="cosmic-vignette absolute inset-0 pointer-events-none" />
    </div>
  );
}
