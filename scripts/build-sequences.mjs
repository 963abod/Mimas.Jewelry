#!/usr/bin/env node
/**
 * MIMAS — ring scroll-sequence build pipeline
 * ------------------------------------------------------------------
 * Turns the two source videos (landscape + portrait) into:
 *   1. web-optimized H.264 masters      -> source-media/optimized/
 *   2. motion-adaptive WebP sequences   -> public/sequences/<version>/<id>/f0000.webp ...
 *   3. a per-sequence manifest.json     -> public/sequences/<version>/<id>/manifest.json
 *   4. the typed runtime config         -> src/data/ringSequences.ts
 *
 * The originals in source-media/original/ are only ever READ.
 *
 * Requirements: Node 18+, ffmpeg + ffprobe on PATH (libx264 + libwebp). No npm packages.
 *
 * Usage:
 *   node scripts/build-sequences.mjs                # everything
 *   node scripts/build-sequences.mjs --only=portrait
 *   node scripts/build-sequences.mjs --dry          # analysis + frame plan only, writes nothing
 *   node scripts/build-sequences.mjs --verify       # re-decode the written WebPs and check order/identity
 *   node scripts/build-sequences.mjs --force        # re-encode optimized masters even if present
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync, statSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = 'v1'; // bump when frames change: URLs are served immutable (see public/_headers)

/** Per-orientation settings. Resolution is the SOURCE resolution: nothing is upscaled. */
const SEQUENCES = [
  {
    id: 'landscape',
    source: 'source-media/original/mimas-ring-landscape.original.mp4',
    optimized: 'source-media/optimized/mimas-ring-landscape.web.mp4',
    targetFrames: 300, // approximate; the selector tunes its motion step to land near this
    maxGap: 4, // never skip more than this many source frames (0.16 s @ 25 fps)
    webpQuality: 76,
    posterIndexRatio: 0.3, // reduced-motion / data-saver still, as a fraction of the sequence
  },
  {
    id: 'portrait',
    source: 'source-media/original/mimas-ring-portrait.original.mp4',
    optimized: 'source-media/optimized/mimas-ring-portrait.web.mp4',
    targetFrames: 300,
    maxGap: 4,
    webpQuality: 76,
    posterIndexRatio: 0.3,
  },
];

const X264 = { crf: 18, preset: 'slow' }; // SSIM ~0.995 vs source, ~4-5x smaller than the supplied files

// ---------------------------------------------------------------- helpers
const args = new Set(process.argv.slice(2));
const only = [...args].find((a) => a.startsWith('--only='))?.split('=')[1];
const DRY = args.has('--dry');
const VERIFY = args.has('--verify');
const FORCE = args.has('--force');

const log = (...m) => console.log(...m);
const abs = (p) => join(ROOT, p);

function run(cmd, argv, opts = {}) {
  const r = spawnSync(cmd, argv, { maxBuffer: 1 << 30, ...opts });
  if (r.status !== 0) {
    throw new Error(`${cmd} ${argv.slice(0, 6).join(' ')} ... failed (${r.status})\n${r.stderr?.toString().slice(-1500)}`);
  }
  return r;
}

function probe(file) {
  const out = run('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,r_frame_rate,nb_frames,duration',
    '-of', 'json', file,
  ]).stdout.toString();
  const s = JSON.parse(out).streams[0];
  const [n, d] = s.r_frame_rate.split('/').map(Number);
  return { width: s.width, height: s.height, fps: n / d, frames: Number(s.nb_frames), duration: Number(s.duration) };
}

// ---------------------------------------------------------------- step 1: optimized master
function encodeOptimized(seq) {
  const input = abs(seq.source);
  const output = abs(seq.optimized);
  if (!existsSync(input)) throw new Error(`Missing source video: ${seq.source}`);
  if (existsSync(output) && !FORCE) {
    log(`  optimized master exists, skipping (use --force): ${seq.optimized}`);
    return;
  }
  mkdirSync(dirname(output), { recursive: true });
  log(`  encoding optimized master (libx264 crf ${X264.crf}, ${X264.preset}, audio dropped, faststart)...`);
  run('ffmpeg', [
    '-v', 'error', '-y', '-i', input,
    '-an', // frames only: the scroll experience has no soundtrack
    '-c:v', 'libx264', '-preset', X264.preset, '-crf', String(X264.crf),
    '-pix_fmt', 'yuv420p',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
    '-movflags', '+faststart',
    output,
  ]);
}

// ---------------------------------------------------------------- step 2: motion analysis
/** Decode to small grayscale frames and return per-frame arrays. */
function decodeGray(file, w, h) {
  const raw = run('ffmpeg', ['-v', 'error', '-i', file, '-vf', `scale=${w}:${h}:flags=area,format=gray`, '-f', 'rawvideo', '-']).stdout;
  const n = Math.floor(raw.length / (w * h));
  return { frames: Array.from({ length: n }, (_, i) => raw.subarray(i * w * h, (i + 1) * w * h)), count: n };
}

function meanAbsDiff(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
  return s / a.length;
}

const median = (arr) => [...arr].sort((x, y) => x - y)[Math.floor(arr.length / 2)];

/**
 * The supplied clips were frame-rate converted: some frames are repeated (a "hold"), which makes scrubbing
 * stall for one step and then jump. Repeated frames carry no information, so they are dropped.
 * A frame is a repeat when its difference to the previous frame is tiny relative to the local motion.
 */
function findKeepers(gray) {
  const n = gray.count;
  const d = new Array(n - 1);
  for (let i = 0; i < n - 1; i++) d[i] = meanAbsDiff(gray.frames[i], gray.frames[i + 1]);
  const keep = [0];
  const dropped = [];
  for (let i = 1; i < n; i++) {
    const lo = Math.max(0, i - 6);
    const hi = Math.min(n - 1, i + 5);
    const local = median(d.slice(lo, hi));
    const threshold = Math.max(0.03, 0.04 * local);
    if (d[i - 1] < threshold) dropped.push(i);
    else keep.push(i);
  }
  return { keep, dropped, d };
}

/**
 * Motion-adaptive selection: walk the de-duplicated frames and emit a frame every time the accumulated visual
 * change reaches `step` (or `maxGap` source frames have passed). Fast passages (diamond push-in) keep every frame;
 * near-static passages (opening dolly) are thinned. Order is always preserved and first/last frames are always kept.
 */
function selectFrames(gray, keep, step, maxGap) {
  const picked = [keep[0]];
  let acc = 0;
  for (let k = 1; k < keep.length; k++) {
    acc += meanAbsDiff(gray.frames[keep[k - 1]], gray.frames[keep[k]]);
    const last = picked[picked.length - 1];
    if (acc >= step || keep[k] - last >= maxGap) {
      picked.push(keep[k]);
      acc = 0;
    }
  }
  if (picked[picked.length - 1] !== keep[keep.length - 1]) picked.push(keep[keep.length - 1]);
  return picked;
}

function planFrames(seq, gray) {
  const { keep, dropped } = findKeepers(gray);
  let lo = 0.2;
  let hi = 30;
  let best = selectFrames(gray, keep, hi, seq.maxGap);
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2;
    const sel = selectFrames(gray, keep, mid, seq.maxGap);
    best = sel;
    if (sel.length > seq.targetFrames) lo = mid;
    else hi = mid;
  }
  best = selectFrames(gray, keep, hi, seq.maxGap);
  return { selected: best, dropped, keptCount: keep.length };
}

// ---------------------------------------------------------------- step 3: extraction
function extractFrames(seq, info, selected, outDir) {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const expr = selected.map((n) => `eq(n\\,${n})`).join('+');
  // BT.709 limited-range YUV -> RGB explicitly, so libwebp (which assumes BT.601 for YUV input) cannot shift the gold.
  const filter = `select='${expr}',scale=${info.width}:${info.height}:flags=lanczos:in_range=tv:out_range=pc:in_color_matrix=bt709,format=bgra`;
  const scriptPath = join(outDir, '.filter.txt');
  writeFileSync(scriptPath, filter);
  run('ffmpeg', [
    '-v', 'error', '-y', '-i', abs(seq.optimized),
    '-filter_script:v', scriptPath,
    '-fps_mode', 'passthrough',
    '-c:v', 'libwebp', '-quality', String(seq.webpQuality), '-compression_level', '6',
    '-start_number', '0',
    join(outDir, 'f%04d.webp'),
  ]);
  rmSync(scriptPath);
  const files = readdirSync(outDir).filter((f) => f.endsWith('.webp')).sort();
  if (files.length !== selected.length) {
    throw new Error(`Expected ${selected.length} frames, ffmpeg wrote ${files.length}`);
  }
  files.forEach((f, i) => {
    if (f !== `f${String(i).padStart(4, '0')}.webp`) throw new Error(`Gap/misnumbering at ${f} (expected index ${i})`);
  });
  const bytes = files.map((f) => statSync(join(outDir, f)).size);
  return { files, bytes };
}

// ---------------------------------------------------------------- step 4: verification
function verifySequence(seq, outDir, selected, gray, gw, gh) {
  // 1) chronological order is guaranteed by construction; assert it anyway
  for (let k = 1; k < selected.length; k++) {
    if (!(selected[k] > selected[k - 1])) throw new Error(`verify: source frame order broken at stored frame ${k}`);
  }
  // 2) decode what was actually written and compare each stored frame with the source frame it should be
  const decoded = decodeGray(join(outDir, 'f%04d.webp'), gw, gh);
  if (decoded.count !== selected.length) throw new Error(`verify: decoded ${decoded.count} frames, expected ${selected.length}`);
  let worst = 0;
  let maxStep = 0;
  let maxStepAt = 0;
  let minStep = Infinity;
  for (let k = 0; k < decoded.count; k++) {
    const err = meanAbsDiff(decoded.frames[k], gray.frames[selected[k]]);
    worst = Math.max(worst, err);
    if (err > 2.5) throw new Error(`verify: stored frame ${k} does not match source frame ${selected[k]} (err ${err.toFixed(2)})`);
    if (k > 0) {
      const step = meanAbsDiff(decoded.frames[k - 1], decoded.frames[k]);
      if (step < 0.02) throw new Error(`verify: stored frames ${k - 1} and ${k} are duplicates`);
      minStep = Math.min(minStep, step);
      if (step > maxStep) { maxStep = step; maxStepAt = k; }
    }
  }
  log(`  verify OK: ${decoded.count} frames match their source frames (worst decode error ${worst.toFixed(2)}/255); step between neighbours min ${minStep.toFixed(2)} / max ${maxStep.toFixed(2)} (at ${maxStepAt})`);
}

// ---------------------------------------------------------------- main
function main() {
  const targets = SEQUENCES.filter((s) => !only || s.id === only);
  const results = {};

  for (const seq of targets) {
    log(`\n== ${seq.id} ==`);
    const srcInfo = probe(abs(seq.source));
    log(`  source: ${srcInfo.width}x${srcInfo.height} @ ${srcInfo.fps} fps, ${srcInfo.frames} frames, ${srcInfo.duration.toFixed(2)} s`);

    if (!DRY) encodeOptimized(seq);
    const analysisFile = DRY && !existsSync(abs(seq.optimized)) ? abs(seq.source) : abs(seq.optimized);
    const info = probe(analysisFile);
    if (!DRY) {
      log(`  optimized: ${info.width}x${info.height} @ ${info.fps} fps, ${info.frames} frames, ${(statSync(abs(seq.optimized)).size / 1e6).toFixed(2)} MB`);
    }
    if (info.width !== srcInfo.width || info.height !== srcInfo.height) throw new Error('optimized master changed resolution');

    const portrait = info.height > info.width;
    const gw = portrait ? 144 : 256;
    const gh = portrait ? 256 : 144;
    const gray = decodeGray(analysisFile, gw, gh);
    log(`  analysed ${gray.count} frames`);

    const plan = planFrames(seq, gray);
    log(`  repeated frames dropped: ${plan.dropped.length} (${plan.dropped.slice(0, 12).join(', ')}${plan.dropped.length > 12 ? ', ...' : ''})`);
    log(`  frames selected: ${plan.selected.length} of ${gray.count} (${((plan.selected.length / gray.count) * 100).toFixed(0)}%)`);
    const gaps = plan.selected.slice(1).map((n, i) => n - plan.selected[i]);
    const hist = {};
    gaps.forEach((g) => (hist[g] = (hist[g] || 0) + 1));
    log(`  source-frame gap histogram: ${JSON.stringify(hist)}`);

    if (DRY) continue;

    const outDir = abs(`public/sequences/${VERSION}/${seq.id}`);
    const { files, bytes } = extractFrames(seq, info, plan.selected, outDir);
    const total = bytes.reduce((a, b) => a + b, 0);
    log(`  wrote ${files.length} WebP frames: ${(total / 1e6).toFixed(2)} MB total, avg ${(total / files.length / 1024).toFixed(1)} KB, max ${(Math.max(...bytes) / 1024).toFixed(1)} KB`);

    const posterIndex = Math.round((files.length - 1) * seq.posterIndexRatio);
    writeFileSync(
      join(outDir, 'manifest.json'),
      JSON.stringify(
        {
          id: seq.id,
          version: VERSION,
          width: info.width,
          height: info.height,
          sourceFps: info.fps,
          sourceFrames: gray.count,
          frameCount: files.length,
          posterIndex,
          totalBytes: total,
          // stored index -> { source frame number, time in seconds }
          frames: plan.selected.map((n, i) => ({ i, source: n, t: Number((n / info.fps).toFixed(3)), bytes: bytes[i] })),
        },
        null,
        1,
      ),
    );

    if (VERIFY) verifySequence(seq, outDir, plan.selected, gray, gw, gh);
    results[seq.id] = { width: info.width, height: info.height, frameCount: files.length, posterIndex, totalBytes: total };
  }

  if (DRY || Object.keys(results).length === 0) return;

  // Merge with whatever the existing config already knows (so --only=<id> does not erase the other entry).
  const cfgPath = abs('src/data/ringSequences.ts');
  const prev = existsSync(cfgPath) ? readFileSync(cfgPath, 'utf8') : '';
  for (const seq of SEQUENCES) {
    if (results[seq.id]) continue;
    const m = prev.match(new RegExp(`${seq.id}:\\s*\\{[^}]*frameCount:\\s*(\\d+)[^}]*width:\\s*(\\d+)[^}]*height:\\s*(\\d+)[^}]*posterIndex:\\s*(\\d+)[^}]*totalBytes:\\s*(\\d+)`));
    if (m) results[seq.id] = { frameCount: +m[1], width: +m[2], height: +m[3], posterIndex: +m[4], totalBytes: +m[5] };
  }

  const entry = (id) => {
    const r = results[id];
    if (!r) throw new Error(`No data for "${id}"; run the pipeline without --only first.`);
    return `  ${id}: {
    id: '${id}',
    frameCount: ${r.frameCount},
    width: ${r.width},
    height: ${r.height},
    posterIndex: ${r.posterIndex},
    totalBytes: ${r.totalBytes},
    baseUrl: '/sequences/${VERSION}/${id}/',
  },`;
  };
  mkdirSync(dirname(cfgPath), { recursive: true });
  writeFileSync(
    cfgPath,
    `// AUTO-GENERATED by scripts/build-sequences.mjs — do not edit by hand.
// Re-run \`npm run sequences\` after changing the source videos.

export type RingSequenceId = 'landscape' | 'portrait';

export interface RingSequenceConfig {
  id: RingSequenceId;
  /** Number of stored WebP frames (contiguous, f0000.webp ... f<count-1>.webp). */
  frameCount: number;
  /** Pixel size of every stored frame (the source video's native resolution). */
  width: number;
  height: number;
  /** Frame used for the static fallback (reduced motion / data saver). */
  posterIndex: number;
  /** Combined size of all frames, for budgeting. */
  totalBytes: number;
  /** Versioned, immutable-cacheable folder. */
  baseUrl: string;
}

export const RING_SEQUENCES: Record<RingSequenceId, RingSequenceConfig> = {
${entry('landscape')}
${entry('portrait')}
};

export function ringFrameUrl(config: RingSequenceConfig, index: number): string {
  return \`\${config.baseUrl}f\${String(index).padStart(4, '0')}.webp\`;
}
`,
  );
  log(`\nwrote src/data/ringSequences.ts`);
}

main();
