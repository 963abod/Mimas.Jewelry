import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import './RingScrollSequence.css';
import { RING_SEQUENCES, ringFrameUrl } from '../data/ringSequences';
import type { RingSequenceId } from '../data/ringSequences';
import type { ScrollSequence } from '../lib/scrollSequence/engine';

/**
 * Orientation rule. The two videos are 16:9 and 9:16, and the geometric mean of those aspect ratios is exactly 1:1,
 * so "viewport taller than wide -> portrait video, otherwise landscape video" always picks the closer match.
 * It also covers tablets (portrait iPad -> vertical footage) and desktop windows dragged narrow.
 */
const PORTRAIT_QUERY = '(orientation: portrait)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const SWITCH_DEBOUNCE_MS = 200; // ignore transient flips (rotation animation, on-screen keyboard)

const LABEL = 'خاتم ذهبي بالألماس من مجوهرات الميماس — تتحرك الصورة مع التمرير';

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

const hints = (): NavigatorWithHints => navigator as NavigatorWithHints;

function readSequenceId(): RingSequenceId {
  return window.matchMedia(PORTRAIT_QUERY).matches ? 'portrait' : 'landscape';
}

/** Re-evaluated only when the media query flips (rotation / crossing 1:1), not on every resize event. */
function useSequenceId(): RingSequenceId {
  const [id, setId] = useState<RingSequenceId>(readSequenceId);
  useEffect(() => {
    const query = window.matchMedia(PORTRAIT_QUERY);
    let timer = 0;
    const onChange = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setId(readSequenceId()), SWITCH_DEBOUNCE_MS);
    };
    query.addEventListener('change', onChange);
    return () => {
      window.clearTimeout(timer);
      query.removeEventListener('change', onChange);
    };
  }, []);
  return id;
}

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
const getReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
const getServerReducedMotion = () => false;

/** Conditions under which scrubbing 300 frames is the wrong trade-off: show one still frame instead. */
function shouldUseStaticFallback(): boolean {
  const { connection, deviceMemory } = hints();
  if (connection?.saveData) return true;
  if (deviceMemory !== undefined && deviceMemory <= 1) return true;
  return typeof ResizeObserver === 'undefined' || typeof IntersectionObserver === 'undefined';
}

function engineTuning(id: RingSequenceId) {
  const { connection, deviceMemory } = hints();
  const constrained = id === 'portrait' || (deviceMemory !== undefined && deviceMemory <= 4);
  const goodConnection = !connection?.effectiveType || connection.effectiveType === '4g';
  return {
    // ~3.7 MB per decoded frame: keep the window small on phones / low-memory devices.
    maxDecodedFrames: constrained ? 16 : 28,
    concurrency: constrained ? 4 : 6,
    // Slow or unknown-quality connections only fetch the coarse set until the section is near.
    eagerPrefetch: goodConnection,
  };
}

interface RingScrollSequenceProps {
  /** Optional hook for diagnostics/tests; receives the live engine (or null on teardown). */
  onEngine?: (engine: ScrollSequence | null) => void;
}

export const RingScrollSequence: React.FC<RingScrollSequenceProps> = ({ onEngine }) => {
  const sequenceId = useSequenceId();
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getServerReducedMotion);
  const [lowCapability] = useState(shouldUseStaticFallback);
  const [failed, setFailed] = useState(false);
  const useStatic = reducedMotion || lowCapability || failed;

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startedBefore = useRef(false);
  const onEngineRef = useRef(onEngine);
  onEngineRef.current = onEngine;

  // Pin the stage directly below the (sticky) site header, whatever height it currently has.
  useEffect(() => {
    const section = sectionRef.current;
    const header = document.querySelector('header');
    if (!section || !header) return;
    const apply = () => section.style.setProperty('--ring-header', `${header.getBoundingClientRect().height}px`);
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(header);
    return () => observer.disconnect();
  }, [useStatic]);

  // Engine lifecycle: one engine per source. Switching orientation tears down the old one (aborting its downloads and
  // releasing its decoded frames) before the new one starts, so the two sequences are never held at the same time.
  useEffect(() => {
    if (useStatic) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!canvas || !section || !stage) return;

    const config = RING_SEQUENCES[sequenceId];
    let cancelled = false;
    let engine: ScrollSequence | null = null;
    let idleHandle = 0;
    let timer = 0;

    const begin = async () => {
      if (cancelled) return;
      try {
        // Loaded on demand so the engine is not part of the initial bundle.
        const { ScrollSequence: Engine } = await import('../lib/scrollSequence/engine');
        if (cancelled) return;
        engine = new Engine({
          canvas,
          section,
          stage,
          source: {
            frameCount: config.frameCount,
            width: config.width,
            height: config.height,
            frameUrl: (index) => ringFrameUrl(config, index),
          },
          ...engineTuning(sequenceId),
          onFirstFrame: () => {
            section.dataset.ready = 'true';
          },
          onFatalError: () => setFailed(true),
        });
        engine.start();
        startedBefore.current = true;
        onEngineRef.current?.(engine);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    // First start: wait for the page to finish loading, then for an idle moment, so frame downloads never compete
    // with the hero. A later start (device rotation) happens immediately because the visitor is already looking.
    const schedule = () => {
      if (startedBefore.current) void begin();
      else if (typeof window.requestIdleCallback === 'function') {
        idleHandle = window.requestIdleCallback(() => void begin(), { timeout: 3000 });
      } else timer = window.setTimeout(() => void begin(), 1500); // Safari has no requestIdleCallback
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('load', schedule);
      if (idleHandle && typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleHandle);
      window.clearTimeout(timer);
      engine?.destroy();
      onEngineRef.current?.(null);
    };
  }, [sequenceId, useStatic]);

  if (useStatic) {
    const landscape = RING_SEQUENCES.landscape;
    const portrait = RING_SEQUENCES.portrait;
    return (
      <section ref={sectionRef} className="mimas-ring mimas-ring--static" aria-label={LABEL}>
        <picture>
          <source media={PORTRAIT_QUERY} srcSet={ringFrameUrl(portrait, portrait.posterIndex)} />
          <img
            className="mimas-ring__poster"
            src={ringFrameUrl(landscape, landscape.posterIndex)}
            alt={LABEL}
            width={landscape.width}
            height={landscape.height}
            loading="lazy"
            decoding="async"
          />
        </picture>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="mimas-ring" data-orientation={sequenceId} aria-label={LABEL}>
      <div ref={stageRef} className="mimas-ring__stage" data-bars-x="0" data-bars-y="0">
        <canvas ref={canvasRef} className="mimas-ring__canvas" role="img" aria-label={LABEL} />
        <div className="mimas-ring__edge mimas-ring__edge--left" aria-hidden="true" />
        <div className="mimas-ring__edge mimas-ring__edge--right" aria-hidden="true" />
        <div className="mimas-ring__edge mimas-ring__edge--top" aria-hidden="true" />
        <div className="mimas-ring__edge mimas-ring__edge--bottom" aria-hidden="true" />
      </div>
    </section>
  );
};

export default RingScrollSequence;
