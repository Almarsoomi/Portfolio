/**
 * Tiny Web Audio groove box for the Metal East Records demo.
 * Every track is original and generated live in the browser — no audio files,
 * nothing copyrighted, ~0 KB of downloads.
 */

export type Track = {
  bpm: number;
  /** MIDI note of the root (e.g. 52 = E3). */
  root: number;
  /** Scale intervals in semitones; pattern numbers index into this. */
  scale: number[];
  /** 16-step drum patterns, "x" = hit. */
  kick: string;
  snare: string;
  hat: string;
  /** 16 steps of scale degrees (null = rest). */
  bass: (number | null)[];
  lead: (number | null)[];
  leadWave: OscillatorType;
  /** Distorted power chords instead of single notes. */
  heavy?: boolean;
  /** 0..0.3 — delays every off-beat 16th for a lazy groove. */
  swing?: number;
};

const midiToHz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

function degreeToMidi(t: Track, deg: number, octave: number) {
  const len = t.scale.length;
  const oct = Math.floor(deg / len);
  const idx = ((deg % len) + len) % len;
  return t.root + 12 * (octave + oct) + t.scale[idx];
}

export class VinylPlayer {
  private ctx: AudioContext | null = null;
  /** Input bus every instrument connects into (the tone filter). */
  private master: AudioNode | null = null;
  private noise: AudioBuffer | null = null;
  private crackle: AudioBufferSourceNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private track: Track | null = null;
  private step = 0;
  private nextTime = 0;

  /** Must be called from a user gesture (click) the first time. */
  private ensure() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return this.ctx;
    }
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    this.ctx = ctx;

    // White-noise buffer reused by snare, hats and crackle.
    const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    this.noise = buf;
    return ctx;
  }

  /** Wakes audio inside the click handler so a delayed start isn't blocked. */
  unlock() {
    this.ensure();
  }

  play(track: Track, delaySec = 0) {
    const ctx = this.ensure();
    this.stop(true);

    // Warm, slightly dull "record" tone.
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 4800;
    const master = ctx.createGain();
    master.gain.value = 0;
    master.gain.setTargetAtTime(0.55, ctx.currentTime + delaySec, 0.08);
    tone.connect(master).connect(ctx.destination);
    this.master = tone;
    this.masterGain = master;

    // Vinyl crackle bed.
    const crackleSrc = ctx.createBufferSource();
    crackleSrc.buffer = this.makeCrackle(ctx);
    crackleSrc.loop = true;
    const cg = ctx.createGain();
    cg.gain.value = 0.18;
    crackleSrc.connect(cg).connect(tone);
    crackleSrc.start(ctx.currentTime + Math.max(0, delaySec - 0.3));
    this.crackle = crackleSrc;

    this.track = track;
    this.step = 0;
    this.nextTime = ctx.currentTime + delaySec + 0.05;
    this.timer = setInterval(() => this.schedule(), 25);
  }

  private masterGain: GainNode | null = null;

  stop(immediate = false) {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    const ctx = this.ctx;
    const g = this.masterGain;
    const crackle = this.crackle;
    if (ctx && g) {
      // Quick "power-off" fade.
      g.gain.cancelScheduledValues(ctx.currentTime);
      g.gain.setTargetAtTime(0, ctx.currentTime, immediate ? 0.01 : 0.12);
      const node = g;
      setTimeout(() => node.disconnect(), immediate ? 80 : 700);
    }
    if (ctx && crackle) {
      try {
        crackle.stop(ctx.currentTime + (immediate ? 0.05 : 0.6));
      } catch {
        /* already stopped */
      }
    }
    this.masterGain = null;
    this.master = null;
    this.crackle = null;
    this.track = null;
  }

  dispose() {
    this.stop(true);
    const ctx = this.ctx;
    this.ctx = null;
    if (ctx) setTimeout(() => void ctx.close(), 150);
  }

  // ---- scheduling -------------------------------------------------------

  private schedule() {
    const ctx = this.ctx;
    const t = this.track;
    if (!ctx || !t || !this.master) return;
    const stepDur = 60 / t.bpm / 4;
    while (this.nextTime < ctx.currentTime + 0.12) {
      const s = this.step % 16;
      const swing = s % 2 === 1 ? (t.swing ?? 0) * stepDur : 0;
      const at = this.nextTime + swing;
      if (t.kick[s] === "x") this.kick(at, t.heavy);
      if (t.snare[s] === "x") this.snare(at);
      if (t.hat[s] === "x") this.hat(at);
      const b = t.bass[s];
      if (b !== null && b !== undefined) this.bass(at, midiToHz(degreeToMidi(t, b, -1)), stepDur, t.heavy);
      const l = t.lead[s];
      if (l !== null && l !== undefined) this.lead(at, t, l, stepDur);
      this.nextTime += stepDur;
      this.step++;
    }
  }

  private makeCrackle(ctx: AudioContext) {
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * 0.012; // surface hiss
      if (Math.random() < 0.0004) d[i] += (Math.random() * 2 - 1) * 0.6; // pops
    }
    return buf;
  }

  private env(at: number, peak: number, decay: number) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(peak, at + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
    g.connect(this.master!);
    return g;
  }

  private kick(at: number, heavy?: boolean) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(heavy ? 170 : 150, at);
    o.frequency.exponentialRampToValueAtTime(42, at + 0.12);
    o.connect(this.env(at, heavy ? 1 : 0.9, 0.28));
    o.start(at);
    o.stop(at + 0.3);
  }

  private snare(at: number) {
    const ctx = this.ctx!;
    const n = ctx.createBufferSource();
    n.buffer = this.noise;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1900;
    bp.Q.value = 0.7;
    n.connect(bp).connect(this.env(at, 0.45, 0.16));
    n.start(at);
    n.stop(at + 0.2);
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = 190;
    o.connect(this.env(at, 0.25, 0.08));
    o.start(at);
    o.stop(at + 0.1);
  }

  private hat(at: number) {
    const ctx = this.ctx!;
    const n = ctx.createBufferSource();
    n.buffer = this.noise;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7500;
    n.connect(hp).connect(this.env(at, 0.12, 0.045));
    n.start(at);
    n.stop(at + 0.06);
  }

  private bass(at: number, hz: number, stepDur: number, heavy?: boolean) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = heavy ? "sawtooth" : "square";
    o.frequency.value = hz;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(heavy ? 900 : 1200, at);
    lp.frequency.exponentialRampToValueAtTime(220, at + stepDur * 1.5);
    o.connect(lp).connect(this.env(at, 0.32, stepDur * 1.9));
    o.start(at);
    o.stop(at + stepDur * 2);
  }

  private lead(at: number, t: Track, deg: number, stepDur: number) {
    const ctx = this.ctx!;
    const notes = t.heavy
      ? [degreeToMidi(t, deg, 0), degreeToMidi(t, deg, 0) + 7, degreeToMidi(t, deg, 1)] // power chord
      : [degreeToMidi(t, deg, 1)];
    const out = this.env(at, t.heavy ? 0.16 : 0.13, stepDur * (t.heavy ? 1.8 : 2.6));
    let dest: AudioNode = out;
    if (t.heavy) {
      const shaper = ctx.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = (i / 128) - 1;
        curve[i] = Math.tanh(x * 6);
      }
      shaper.curve = curve;
      shaper.connect(out);
      dest = shaper;
    }
    for (const m of notes) {
      const o = ctx.createOscillator();
      o.type = t.leadWave;
      o.frequency.value = midiToHz(m);
      o.connect(dest);
      o.start(at);
      o.stop(at + stepDur * 3);
    }
  }
}

const _ = null;

/** One original groove per record in the crate. */
export const TRACKS: Record<string, Track> = {
  // Pop-funk, four-on-the-floor dance groove.
  midnight: {
    bpm: 114,
    root: 52, // E
    scale: [0, 3, 5, 7, 10],
    kick: "x...x...x...x...",
    snare: "....x.......x...",
    hat: "x.xxx.xxx.xxx.xx",
    bass: [0, _, _, 0, _, _, 2, _, 0, _, _, 3, _, 4, 3, _],
    lead: [_, _, 7, _, _, _, 8, _, _, _, 7, _, _, 5, _, _],
    leadWave: "square",
    swing: 0.08,
  },
  // Heavy metal gallop.
  thunder: {
    bpm: 150,
    root: 40, // E
    scale: [0, 1, 3, 5, 7, 8, 10],
    kick: "x.xxx.xxx.xxx.xx",
    snare: "....x.......x...",
    hat: "x.x.x.x.x.x.x.x.",
    bass: [0, _, 0, 0, 0, _, 0, 0, 0, _, 0, 0, 1, _, 2, _],
    lead: [0, _, 0, 0, 0, _, 0, 0, 0, _, 0, 0, 1, _, 2, _],
    leadWave: "sawtooth",
    heavy: true,
  },
  // Synthwave arpeggio.
  ember: {
    bpm: 100,
    root: 57, // A
    scale: [0, 2, 3, 5, 7, 8, 10],
    kick: "x...x...x...x...",
    snare: "....x.......x...",
    hat: "..x...x...x...x.",
    bass: [0, _, 0, _, 0, _, 0, _, 5, _, 5, _, 3, _, 4, _],
    lead: [0, 2, 4, 7, 4, 2, 0, 2, 5, 7, 9, 7, 3, 4, 6, 4],
    leadWave: "triangle",
  },
  // Lo-fi with a Middle-Eastern (hijaz) melody.
  souk: {
    bpm: 84,
    root: 50, // D
    scale: [0, 1, 4, 5, 7, 8, 10],
    kick: "x......x..x.....",
    snare: "....x.......x...",
    hat: "x.x.x.x.x.x.x.x.",
    bass: [0, _, _, _, _, _, _, _, 3, _, _, _, 4, _, _, _],
    lead: [7, _, 6, 5, _, 4, _, _, 5, 4, _, 1, 0, _, _, _],
    leadWave: "sine",
    swing: 0.18,
  },
};
