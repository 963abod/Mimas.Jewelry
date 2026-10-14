/**
 * Scroll-driven image-sequence engine (framework-free, no dependencies).
 *
 * Responsibilities
 *  - FrameStore: progressive, prioritised loading of WebP frames + a *bounded* cache of decoded frames.
 *  - ScrollSequence: maps scroll position to a frame and paints it on a canvas, only when something changed.
 *
 * Memory model
 *  - Compressed frames (Blob, ~20 KB each) are kept for every frame that has been fetched.
 *  - Decoded frames (ImageBitmap, ~3.7 MB each) are kept only for a small window around the current frame.
 *    The whole sequence is therefore never decoded into memory at once.
 */

export interface SequenceSource {
  frameCount: number;
  /** Native pixel size of every frame. */
  width: number;
  height: number;
  frameUrl: (index: number) => string;
}

export interface ScrollSequenceOptions {
  canvas: HTMLCanvasElement;
  /** Tall wrapper whose scroll distance drives the animation. */
  section: HTMLElement;
  /** The sticky element inside `section` that stays pinned while the sequence plays. */
  stage: HTMLElement;
  source: SequenceSource;
  /** Upper bound of decoded frames held at once (>= 14). */
  maxDecodedFrames: number;
  /** Parallel frame downloads. */
  concurrency: number;
  /** Fetch every frame in the background right away, or only the coarse set until the section is near. */
  eagerPrefetch: boolean;
  onFirstFrame?: () => void;
  onFatalError?: (error: unknown) => void;
}

export interface SequenceStats {
  frameCount: number;
  fetched: number;
  decoded: number;
  inflight: number;
  drawnIndex: number;
  wantedIndex: number;
  progress: number;
  active: boolean;
  canvasWidth: number;
  canvasHeight: number;
  draws: number;
}

interface DecodedFrame {
  image: CanvasImageSource;
  release: () => void;
}

const COARSE_STRIDE = 12; // first pass loads every 12th frame so the whole animation is scrubbable early
const REFINE_STRIDES = [4, 2, 1];
const SMOOTHING_MS = 70; // time constant of the scroll->frame glide
const DECODE_AHEAD = 8;
const DECODE_BEHIND = 4;
const MAX_PARALLEL_DECODES = 3;
const NEAREST_RADIUS = 40; // while the exact frame is still decoding, show the closest decoded one within this range
const IDLE = 0;
const LOADING = 1;
const READY = 2;
const FAILED = 3;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

async function decodeBlob(blob: Blob): Promise<DecodedFrame> {
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(blob);
    return { image: bitmap, release: () => bitmap.close() };
  }
  // Fallback for browsers without createImageBitmap (older Safari).
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
  try {
    await img.decode();
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
  return { image: img, release: () => URL.revokeObjectURL(url) };
}

interface StoreListener {
  onFetched: (index: number) => void;
  onDecoded: (index: number) => void;
  onFatal: (error: unknown) => void;
}

class FrameStore {
  private readonly blobs: (Blob | null)[];
  private readonly state: Uint8Array;
  private readonly decoded = new Map<number, DecodedFrame>();
  private readonly decoding = new Map<number, Promise<DecodedFrame | null>>();
  private direction = 1;
  private readonly abort = new AbortController();
  private order: number[] = [];
  private orderPos = 0;
  private coarseEnd = 0;
  private orderFocus = -1000;
  private focus = 0;
  private inflight = 0;
  private fetchedCount = 0;
  private failedCount = 0;
  private hot = false;
  private depthAll: boolean;
  private destroyed = false;

  private readonly source: SequenceSource;
  private readonly maxDecoded: number;
  private readonly concurrency: number;
  private readonly listener: StoreListener;

  constructor(source: SequenceSource, maxDecoded: number, concurrency: number, eager: boolean, listener: StoreListener) {
    this.source = source;
    this.maxDecoded = maxDecoded;
    this.concurrency = concurrency;
    this.listener = listener;
    this.blobs = new Array<Blob | null>(source.frameCount).fill(null);
    this.state = new Uint8Array(source.frameCount);
    this.depthAll = eager;
  }

  get fetched() {
    return this.fetchedCount;
  }
  get decodedCount() {
    return this.decoded.size;
  }
  get inflightCount() {
    return this.inflight;
  }
  start(focus: number) {
    this.setFocus(focus, true);
  }

  /** Re-prioritise loading around the frame being viewed. Cheap enough to call every tick (it throttles itself). */
  setFocus(index: number, force = false) {
    this.focus = index;
    if (!force && Math.abs(index - this.orderFocus) < 8) return;
    this.orderFocus = index;
    this.rebuildOrder();
    this.orderPos = 0;
    this.pump();
  }

  /** `hot` = the section is close to the viewport: fetch with high priority and load every refinement level. */
  setHot(hot: boolean) {
    this.hot = hot;
    if (hot) this.depthAll = true;
    this.pump();
  }

  getFrame(index: number): DecodedFrame | undefined {
    return this.decoded.get(index);
  }

  /** Index of the closest decoded frame within `maxDistance`, or -1. */
  nearestDecoded(index: number, maxDistance: number): number {
    for (let d = 0; d <= maxDistance; d++) {
      if (this.decoded.has(index - d)) return index - d;
      if (this.decoded.has(index + d)) return index + d;
    }
    return -1;
  }

  /**
   * Latest-wins decode scheduling. Decodes cannot be cancelled once started, so only a few run at a time and every time
   * a slot frees up the frame nearest the *current* position is started next. A fast fling therefore never builds a
   * backlog of obsolete decodes: the picture is at most one decode behind the scroll position.
   */
  pumpDecodes(index: number, direction: number) {
    if (this.destroyed) return;
    this.direction = direction < 0 ? -1 : 1;
    const n = this.source.frameCount;
    const start = (i: number): boolean => {
      if (i < 0 || i >= n) return true;
      if (!this.blobs[i] || this.decoded.has(i) || this.decoding.has(i)) return true;
      if (this.decoding.size >= MAX_PARALLEL_DECODES) return false;
      this.startDecode(i);
      return true;
    };
    if (!start(index)) return;
    for (let k = 1; k <= DECODE_AHEAD; k++) if (!start(index + this.direction * k)) return;
    for (let k = 1; k <= DECODE_BEHIND; k++) if (!start(index - this.direction * k)) return;
  }

  private startDecode(index: number) {
    const blob = this.blobs[index];
    if (!blob) return;
    const promise = decodeBlob(blob)
      .then((frame) => {
        this.decoding.delete(index);
        if (this.destroyed) {
          frame.release();
          return null;
        }
        this.decoded.set(index, frame);
        this.evict();
        if (this.decoded.has(index)) this.listener.onDecoded(index);
        this.pumpDecodes(this.focus, this.direction); // a slot just freed: continue with whatever is nearest *now*
        return frame;
      })
      .catch(() => {
        this.decoding.delete(index);
        if (!this.destroyed) this.pumpDecodes(this.focus, this.direction);
        return null;
      });
    this.decoding.set(index, promise);
  }

  destroy() {
    this.destroyed = true;
    this.abort.abort();
    for (const frame of this.decoded.values()) frame.release();
    this.decoded.clear();
    this.decoding.clear();
    this.blobs.fill(null);
  }

  // ------------------------------------------------------------------ internals

  private rebuildOrder() {
    const n = this.source.frameCount;
    const seen = new Uint8Array(n);
    const order: number[] = [];
    const focus = this.focus;
    const push = (list: number[]) => {
      list.sort((a, b) => Math.abs(a - focus) - Math.abs(b - focus) || a - b);
      for (const i of list) {
        if (!seen[i]) {
          seen[i] = 1;
          order.push(i);
        }
      }
    };

    const near: number[] = [];
    for (let i = Math.max(0, focus - 2); i <= Math.min(n - 1, focus + 6); i++) near.push(i);
    push(near);

    [COARSE_STRIDE, ...REFINE_STRIDES].forEach((stride) => {
      const list: number[] = [];
      for (let i = 0; i < n; i += stride) list.push(i);
      if (list[list.length - 1] !== n - 1) list.push(n - 1);
      push(list);
      if (stride === COARSE_STRIDE) this.coarseEnd = order.length;
    });
    this.order = order;
  }

  private pump() {
    if (this.destroyed) return;
    const limit = this.depthAll ? this.order.length : this.coarseEnd;
    while (this.inflight < this.concurrency && this.orderPos < limit) {
      const index = this.order[this.orderPos++];
      if (this.state[index] === IDLE) void this.fetchFrame(index);
    }
  }

  private async request(index: number): Promise<Blob> {
    const url = this.source.frameUrl(index);
    const response = await fetch(url, {
      signal: this.abort.signal,
      priority: this.hot ? 'high' : 'low',
    } as RequestInit);
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
    return response.blob();
  }

  private async fetchFrame(index: number) {
    this.state[index] = LOADING;
    this.inflight++;
    let blob: Blob | null = null;
    let failure: unknown = null;
    try {
      blob = await this.request(index);
    } catch (firstError) {
      failure = firstError;
      if (!this.destroyed) {
        await new Promise((resolve) => setTimeout(resolve, 700)); // one retry for flaky mobile networks
        try {
          blob = await this.request(index);
          failure = null;
        } catch (secondError) {
          failure = secondError;
        }
      }
    }
    this.inflight--;
    if (this.destroyed) return;

    if (blob) {
      this.blobs[index] = blob;
      this.state[index] = READY;
      this.fetchedCount++;
      this.listener.onFetched(index);
      this.pumpDecodes(this.focus, this.direction);
    } else {
      this.state[index] = FAILED;
      this.failedCount++;
      if (this.fetchedCount === 0 && this.failedCount >= 3) this.listener.onFatal(failure);
    }
    this.pump();
  }

  private evict() {
    while (this.decoded.size > this.maxDecoded) {
      let farthest = -1;
      let farthestDistance = -1;
      for (const index of this.decoded.keys()) {
        const distance = Math.abs(index - this.focus);
        if (distance > farthestDistance) {
          farthest = index;
          farthestDistance = distance;
        }
      }
      if (farthest < 0) return;
      this.decoded.get(farthest)?.release();
      this.decoded.delete(farthest);
    }
  }
}

interface Geometry {
  stageW: number;
  stageH: number;
  cssW: number;
  cssH: number;
  pxW: number;
  pxH: number;
  barX: number;
  barY: number;
}

export class ScrollSequence {
  private readonly canvas: HTMLCanvasElement;
  private readonly section: HTMLElement;
  private readonly stage: HTMLElement;
  private readonly source: SequenceSource;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly store: FrameStore;
  private resizeObserver?: ResizeObserver;
  private intersectionObserver?: IntersectionObserver;

  private geometry: Geometry | null = null;
  private appliedGeometry: Geometry | null = null;
  private runway = 0;
  private stickTop = 0;

  private raf = 0;
  private lastTime = 0;
  private progress = 0;
  private lastTarget = 0; // scroll-derived progress as of the last tick (before any resize)
  private snap = true;
  private active = false;
  private listening = false;
  private wantedIndex = 0;
  private drawnIndex = -1;
  private lastDirection = 1;
  private draws = 0;
  private ready = false;
  private destroyed = false;

  private readonly options: ScrollSequenceOptions;

  constructor(options: ScrollSequenceOptions) {
    this.options = options;
    this.canvas = options.canvas;
    this.section = options.section;
    this.stage = options.stage;
    this.source = options.source;
    const ctx = this.canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('2D canvas is not available');
    this.ctx = ctx;
    this.store = new FrameStore(
      this.source,
      Math.max(14, options.maxDecodedFrames),
      options.concurrency,
      options.eagerPrefetch,
      {
        onFetched: (index) => {
          // The first frame, or one near where we are looking, just arrived: try to paint.
          if (this.drawnIndex < 0 || Math.abs(index - this.wantedIndex) <= 6) this.requestTick();
        },
        onDecoded: (index) => {
          // Paint only if this frame is closer to the target than what is on screen (or a resize is waiting for a frame).
          const better = Math.abs(index - this.wantedIndex) < Math.abs(this.drawnIndex - this.wantedIndex);
          if (this.drawnIndex < 0 || better || this.geometry !== this.appliedGeometry) this.requestTick();
        },
        onFatal: (error) => options.onFatalError?.(error),
      },
    );
  }

  start() {
    if (this.destroyed) return;
    this.measure();
    this.progress = this.readProgress();
    this.wantedIndex = this.indexFor(this.progress);
    this.store.start(this.wantedIndex);

    this.resizeObserver = new ResizeObserver(() => {
      this.onLayoutChange();
      this.requestTick();
    });
    this.resizeObserver.observe(this.stage);
    this.resizeObserver.observe(this.section);

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (entry) this.setActive(entry.isIntersecting);
      },
      { rootMargin: '100% 0px 100% 0px' },
    );
    this.intersectionObserver.observe(this.section);
    this.requestTick();
  }

  destroy() {
    this.destroyed = true;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.detachScroll();
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.store.destroy();
  }

  stats(): SequenceStats {
    return {
      frameCount: this.source.frameCount,
      fetched: this.store.fetched,
      decoded: this.store.decodedCount,
      inflight: this.store.inflightCount,
      drawnIndex: this.drawnIndex,
      wantedIndex: this.wantedIndex,
      progress: this.progress,
      active: this.active,
      canvasWidth: this.canvas.width,
      canvasHeight: this.canvas.height,
      draws: this.draws,
    };
  }

  // ------------------------------------------------------------------ scroll & layout

  private readonly onScroll = () => this.requestTick();

  private attachScroll() {
    if (this.listening) return;
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.listening = true;
  }

  private detachScroll() {
    if (!this.listening) return;
    window.removeEventListener('scroll', this.onScroll);
    this.listening = false;
  }

  private setActive(active: boolean) {
    if (this.destroyed || active === this.active) return;
    this.active = active;
    this.store.setHot(active);
    this.snap = true; // never glide in from a stale position
    if (active) this.attachScroll();
    else this.detachScroll();
    this.requestTick(); // on leaving, this paints the final (first/last) frame once
  }

  /** Contain-fit the frame inside the stage: the ring is never cropped or stretched. */
  private measure() {
    const stageW = this.stage.clientWidth;
    const stageH = this.stage.clientHeight;
    if (stageW === 0 || stageH === 0) return;
    const scale = Math.min(stageW / this.source.width, stageH / this.source.height);
    const cssW = Math.max(1, Math.round(this.source.width * scale));
    const cssH = Math.max(1, Math.round(this.source.height * scale));
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    // Never allocate more backing pixels than the source frame actually has: extra pixels would be pure upscaling.
    const density = Math.min(dpr, 1 / scale);
    this.geometry = {
      stageW,
      stageH,
      cssW,
      cssH,
      pxW: clamp(Math.round(cssW * density), 1, this.source.width),
      pxH: clamp(Math.round(cssH * density), 1, this.source.height),
      barX: (stageW - cssW) / 2,
      barY: (stageH - cssH) / 2,
    };
    this.runway = this.section.offsetHeight - this.stage.offsetHeight;
    this.stickTop = parseFloat(getComputedStyle(this.stage).top) || 0;
  }

  /** Apply canvas size + letterbox variables in the same task as a draw, so a resize can never show a blank canvas. */
  private applyGeometry() {
    const g = this.geometry;
    if (!g || g === this.appliedGeometry) return;
    const sizeChanged = !this.appliedGeometry || this.appliedGeometry.pxW !== g.pxW || this.appliedGeometry.pxH !== g.pxH;
    if (sizeChanged) {
      this.canvas.width = g.pxW;
      this.canvas.height = g.pxH;
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
    }
    this.canvas.style.width = `${g.cssW}px`;
    this.canvas.style.height = `${g.cssH}px`;
    const s = this.stage.style;
    s.setProperty('--ring-bar-x', `${g.barX}px`);
    s.setProperty('--ring-bar-y', `${g.barY}px`);
    s.setProperty('--ring-feather-x', `${Math.round(g.cssW * 0.06)}px`);
    s.setProperty('--ring-feather-y', `${Math.round(g.cssH * 0.06)}px`);
    this.stage.dataset.barsX = g.barX >= 1.5 ? '1' : '0';
    this.stage.dataset.barsY = g.barY >= 1.5 ? '1' : '0';
    this.appliedGeometry = g;
  }

  /**
   * The layout changed (rotation, window resize). Re-measure, and keep the animation where it was instead of letting the
   * same scroll offset land on a different frame. `lastTarget` is only ever written from fresh geometry (see tick), so
   * it still holds the position from before the change.
   */
  private onLayoutChange() {
    const before = this.lastTarget;
    const previousRunway = this.runway;
    const wasPlaying = this.active && before > 0 && before < 1;
    this.measure();
    if (wasPlaying && this.runway > 0 && Math.abs(this.runway - previousRunway) > 1) this.restoreProgress(before);
  }

  /** True when the cached measurements no longer match the live layout (a tick can run before ResizeObserver does). */
  private geometryIsStale(): boolean {
    const g = this.geometry;
    if (!g) return true;
    return (
      g.stageW !== this.stage.clientWidth ||
      g.stageH !== this.stage.clientHeight ||
      this.runway !== this.section.offsetHeight - this.stage.offsetHeight
    );
  }

  private restoreProgress(progress: number) {
    const top = this.section.getBoundingClientRect().top;
    const delta = top - (this.stickTop - progress * this.runway);
    if (Math.abs(delta) > 1) window.scrollBy(0, delta);
  }

  private readProgress(): number {
    if (this.runway <= 0) return 0;
    const top = this.section.getBoundingClientRect().top;
    return clamp((this.stickTop - top) / this.runway, 0, 1);
  }

  private indexFor(progress: number): number {
    return clamp(Math.round(progress * (this.source.frameCount - 1)), 0, this.source.frameCount - 1);
  }

  // ------------------------------------------------------------------ rendering

  private requestTick() {
    if (this.raf || this.destroyed) return;
    this.raf = requestAnimationFrame(this.tick);
  }

  private readonly tick = (now: number) => {
    this.raf = 0;
    if (this.destroyed) return;

    if (this.geometryIsStale()) this.onLayoutChange();
    const target = this.readProgress();
    this.lastTarget = target;
    const dt = this.lastTime ? Math.min(64, now - this.lastTime) : 16;
    this.lastTime = now;

    if (this.snap) {
      this.progress = target;
      this.snap = false;
    } else {
      this.progress += (target - this.progress) * (1 - Math.exp(-dt / SMOOTHING_MS));
      if (Math.abs(target - this.progress) * (this.source.frameCount - 1) < 0.05) this.progress = target;
    }

    const index = this.indexFor(this.progress);
    if (index !== this.wantedIndex) this.lastDirection = index > this.wantedIndex ? 1 : -1;
    this.wantedIndex = index;
    this.store.setFocus(index);
    this.present(index);

    if (this.progress !== target) this.requestTick(); // still gliding
    else this.lastTime = 0;
  };

  private present(index: number) {
    const exact = this.store.getFrame(index);
    let drawIndex = index;
    let frame = exact;

    if (!exact) {
      const near = this.store.nearestDecoded(index, NEAREST_RADIUS);
      // Show the closest decoded frame rather than holding one that is further from the target (or nothing at all).
      if (near >= 0 && (this.drawnIndex < 0 || Math.abs(near - index) < Math.abs(this.drawnIndex - index))) {
        drawIndex = near;
        frame = this.store.getFrame(near);
      }
    }

    const geometryPending = this.geometry !== this.appliedGeometry;
    if (frame && (drawIndex !== this.drawnIndex || geometryPending)) {
      // Resizing the canvas clears it, so the new size and the frame that fills it go out in the same task.
      this.applyGeometry();
      this.ctx.drawImage(frame.image, 0, 0, this.canvas.width, this.canvas.height);
      this.drawnIndex = drawIndex;
      this.draws++;
      if (!this.ready) {
        this.ready = true;
        this.options.onFirstFrame?.();
      }
    }
    this.store.pumpDecodes(index, this.lastDirection);
  }
}
