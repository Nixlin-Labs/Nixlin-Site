'use client';

import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from 'react';
import { CosmicEngine } from '../../lib/universe/CosmicEngine';

function checkWebGLSupport() {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl') ||
        canvas.getContext('webgl2'))
    );
  } catch {
    return false;
  }
}

function checkReducedMotionPreference() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

function subscribeToDebugQuery(callback) {
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
}

function getDebugQuerySnapshot() {
  return new URLSearchParams(window.location.search).get('universeDebug') === '1';
}

function getServerDebugQuerySnapshot() {
  return false;
}

// Development-only HUD states (never rendered in production)
const DEV_STATES = [
  { id: 0, label: 'Emergence' },
  { id: 1, label: 'Expansion' },
  { id: 2, label: 'Convergence' },
  { id: 3, label: 'Hourglass' },
  { id: 4, label: 'Reorganization' },
];

export default function UniverseCanvas({ onStateChange }) {
  const containerRef = useRef(null);
  const engineRef = useRef(null);

  const [hasWebGL] = useState(() => checkWebGLSupport());
  const [activeStateIndex, setActiveStateIndex] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(() => checkReducedMotionPreference());
  const showDevControls = useSyncExternalStore(
    subscribeToDebugQuery,
    getDebugQuerySnapshot,
    getServerDebugQuerySnapshot
  );

  const isDev = process.env.NODE_ENV === 'development';

  // State transition handler (used by dev HUD and programmatic triggers)
  const triggerStateTransition = useCallback(
    (index) => {
      setActiveStateIndex(index);
      engineRef.current?.setVisualState(index);
      onStateChange?.(index);
    },
    [onStateChange]
  );

  const toggleReducedMotion = () => {
    setIsReducedMotion((prev) => {
      const nextVal = !prev;
      engineRef.current?.setReducedMotion(nextVal);
      return nextVal;
    });
  };

  // Subscribe to system reduced-motion preference changes
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e) => {
      setIsReducedMotion(e.matches);
      engineRef.current?.setReducedMotion(e.matches);
    };

    motionQuery.addEventListener('change', handleMotionChange);
    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Initialize CosmicEngine & Scroll/Event subscriptions
  useEffect(() => {
    if (!hasWebGL || !containerRef.current) return;

    const engine = new CosmicEngine({
      reducedMotion: isReducedMotion,
      onStateChange: (stateIndex) => {
        setActiveStateIndex(stateIndex);
        onStateChange?.(stateIndex);
      },
    });

    engine.init(containerRef.current);
    engineRef.current = engine;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1.0, Math.max(0.0, scrollTop / docHeight)) : 0;

      engine.setScrollProgress(progress);
    };

    const handleCustomStateEvent = (e) => {
      if (typeof e.detail?.stateIndex === 'number') {
        triggerStateTransition(e.detail.stateIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('nixlin:setUniverseState', handleCustomStateEvent);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('nixlin:setUniverseState', handleCustomStateEvent);
      engine.destroy();
      engineRef.current = null;
    };
  }, [hasWebGL, isReducedMotion, onStateChange, triggerStateTransition]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Graceful Fallback if WebGL is unavailable */}
      {!hasWebGL && (
        <div className="absolute inset-0 bg-[#021B16] pointer-events-none">
          <div className="cosmic-atmosphere absolute inset-0" />
        </div>
      )}

      {/*
        Development-Only State Controller HUD
        Visible only when NODE_ENV=development.
        Never rendered in production builds.
      */}
      {isDev && showDevControls && (
        <div
          role="region"
          aria-label="[DEV] Universe Visual State Controller"
          className="fixed bottom-4 left-6 z-20 pointer-events-auto select-none"
        >
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#021B16]/90 backdrop-blur-md border border-[#7ED957]/30 shadow-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7ED957] animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#7ED957]/60 mr-1">
              DEV
            </span>
            {DEV_STATES.map((s) => {
              const isActive = activeStateIndex === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => triggerStateTransition(s.id)}
                  aria-label={`Dev: Set universe state to ${s.label}`}
                  aria-pressed={isActive}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#7ED957] text-[#021B16] font-bold'
                      : 'text-[#9CB9AC]/60 hover:text-[#9CB9AC] border border-[#9CB9AC]/20'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={toggleReducedMotion}
              aria-label={isReducedMotion ? 'Dev: Enable full motion' : 'Dev: Reduce motion'}
              className="ml-1 px-2 py-0.5 rounded text-[9px] font-mono border border-[#9CB9AC]/20 text-[#9CB9AC]/60 hover:text-[#9CB9AC] cursor-pointer transition-colors"
            >
              {isReducedMotion ? 'Motion: Off' : 'Motion: On'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
