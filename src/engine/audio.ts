import { audioRecipes } from "@/content/recipes";
import type { MixMode, WorldId } from "@/content/types";

function noiseBuffer(ctx: AudioContext, seconds: number, color: "white" | "pink" | "brown") {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buffer.getChannelData(ch);
    let b0 = 0, b1 = 0, b2 = 0, last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (color === "white") d[i] = w * 0.4;
      else if (color === "pink") {
        b0 = 0.99886 * b0 + w * 0.0555179;
        b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.969 * b2 + w * 0.153852;
        d[i] = (b0 + b1 + b2 + w * 0.3) * 0.12;
      } else {
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 3.5;
      }
    }
  }
  return buffer;
}

function loopSource(ctx: AudioContext, buffer: AudioBuffer, dest: AudioNode) {
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  src.connect(dest);
  src.start();
  return src;
}

export class AtmosphereEngine {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;
  atmo: GainNode | null = null;
  bed: GainNode | null = null;
  weather: GainNode | null = null;
  oneshot: GainNode | null = null;
  voiceBus: GainNode | null = null;
  sources: AudioNode[] = [];
  timers: number[] = [];
  world: WorldId = "lookout";
  startedAt = 0;
  muted = false;

  async start(world: WorldId, atmosphereVol = 0.7) {
    this.stop();
    const ctx = new AudioContext();
    this.ctx = ctx;
    if (ctx.state === "suspended") await ctx.resume();
    this.world = world;
    this.startedAt = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = this.muted ? 0 : 0.9;
    master.connect(ctx.destination);
    const atmo = ctx.createGain();
    const bed = ctx.createGain();
    const weather = ctx.createGain();
    const oneshot = ctx.createGain();
    const voiceBus = ctx.createGain();
    atmo.gain.value = atmosphereVol;
    bed.gain.value = 0.45;
    weather.gain.value = 1;
    oneshot.gain.value = 0.35;
    voiceBus.gain.value = 1;
    atmo.connect(master);
    bed.connect(atmo);
    weather.connect(atmo);
    oneshot.connect(atmo);
    voiceBus.connect(master);
    this.master = master;
    this.atmo = atmo;
    this.bed = bed;
    this.weather = weather;
    this.oneshot = oneshot;
    this.voiceBus = voiceBus;

    const recipe = audioRecipes[world];
    this.buildBed(ctx, recipe.bed, bed);
    this.buildWeather(ctx, recipe.weather, weather);
    this.scheduleOneshots(recipe.oneshots, recipe.hornInterval);
  }

  private buildBed(ctx: AudioContext, kind: "fire" | "hush" | "house", dest: GainNode) {
    if (kind === "fire") {
      const n = loopSource(ctx, noiseBuffer(ctx, 4, "brown"), dest);
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 800;
      n.disconnect();
      n.connect(filter);
      filter.connect(dest);
      this.sources.push(n, filter);
      this.crackle(ctx, dest);
    } else if (kind === "hush") {
      const n = loopSource(ctx, noiseBuffer(ctx, 6, "pink"), dest);
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1200;
      n.disconnect();
      n.connect(filter);
      const lfo = ctx.createOscillator();
      const lfoG = ctx.createGain();
      lfo.frequency.value = 0.07;
      lfoG.gain.value = 0.08;
      lfo.connect(lfoG);
      lfoG.connect(dest.gain);
      lfo.start();
      filter.connect(dest);
      this.sources.push(n, filter, lfo);
    } else {
      const n = loopSource(ctx, noiseBuffer(ctx, 5, "brown"), dest);
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 500;
      n.disconnect();
      n.connect(filter);
      filter.connect(dest);
      dest.gain.value = 0.28;
      this.sources.push(n, filter);
    }
  }

  private crackle(ctx: AudioContext, dest: AudioNode) {
    const tick = () => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const f = this.ctx.createBiquadFilter();
      o.type = "square";
      o.frequency.value = 80 + Math.random() * 180;
      f.type = "bandpass";
      f.frequency.value = 1200 + Math.random() * 1800;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.08 + Math.random() * 0.06, now + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.04 + Math.random() * 0.05);
      o.connect(f);
      f.connect(g);
      g.connect(dest);
      o.start(now);
      o.stop(now + 0.12);
      this.timers.push(window.setTimeout(tick, 400 + Math.random() * 1400) as unknown as number);
    };
    this.timers.push(window.setTimeout(tick, 800) as unknown as number);
  }

  private buildWeather(ctx: AudioContext, kind: "wind-drip" | "water" | "quiet", dest: GainNode) {
    const rain = loopSource(ctx, noiseBuffer(ctx, 3, "white"), dest);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = kind === "quiet" ? 1800 : 900;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = kind === "water" ? 2400 : kind === "quiet" ? 1600 : 3200;
    rain.disconnect();
    rain.connect(hp);
    hp.connect(lp);
    const g = ctx.createGain();
    g.gain.value = kind === "quiet" ? 0.15 : kind === "water" ? 0.35 : 0.45;
    lp.connect(g);
    g.connect(dest);
    this.sources.push(rain, hp, lp);

    if (kind === "wind-drip" || kind === "water") {
      const wind = loopSource(ctx, noiseBuffer(ctx, 5, "pink"), dest);
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 400;
      bp.Q.value = 0.6;
      wind.disconnect();
      wind.connect(bp);
      const wg = ctx.createGain();
      wg.gain.value = 0.2;
      bp.connect(wg);
      wg.connect(dest);
      const lfo = ctx.createOscillator();
      const lfoG = ctx.createGain();
      lfo.frequency.value = 0.05;
      lfoG.gain.value = 180;
      lfo.connect(lfoG);
      lfoG.connect(bp.frequency);
      lfo.start();
      this.sources.push(wind, bp, lfo);
    }
  }

  private scheduleOneshots(
    kinds: Array<"resin" | "horn" | "tick" | "kettle" | "knock">,
    hornInterval?: [number, number],
  ) {
    const fire = (kind: (typeof kinds)[number]) => {
      if (!this.ctx || !this.oneshot) return;
      const elapsed = this.ctx.currentTime - this.startedAt;
      if (elapsed < 20) return;
      if (kind === "horn") this.playHorn();
      else if (kind === "resin") this.playPop(180, 0.07);
      else if (kind === "tick") this.playPop(90, 0.04);
      else if (kind === "kettle") this.playKettle();
      else this.playPop(220, 0.05);
    };

    const loopKind = (kind: (typeof kinds)[number]) => {
      const isHorn = kind === "horn";
      const min = isHorn ? (hornInterval?.[0] ?? 180) * 1000 : 90_000;
      const max = isHorn ? (hornInterval?.[1] ?? 480) * 1000 : 280_000;
      const wait = min + Math.random() * (max - min);
      this.timers.push(
        window.setTimeout(() => {
          fire(kind);
          loopKind(kind);
        }, wait) as unknown as number,
      );
    };
    kinds.forEach((k) => loopKind(k));
  }

  private playHorn() {
    if (!this.ctx || !this.oneshot) return;
    const now = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.value = 118;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.045, now + 0.8);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
    o.connect(g);
    g.connect(this.oneshot);
    o.start(now);
    o.stop(now + 3.4);
  }

  private playPop(freq: number, amp: number) {
    if (!this.ctx || !this.oneshot) return;
    const now = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "triangle";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(amp, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    o.connect(g);
    g.connect(this.oneshot);
    o.start(now);
    o.stop(now + 0.22);
  }

  private playKettle() {
    if (!this.ctx || !this.oneshot) return;
    const now = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(420, now);
    o.frequency.linearRampToValueAtTime(480, now + 0.4);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.03, now + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
    o.connect(g);
    g.connect(this.oneshot);
    o.start(now);
    o.stop(now + 0.75);
  }

  setAtmosphereVolume(v: number) {
    if (this.atmo) this.atmo.gain.setTargetAtTime(Math.max(0, v), this.ctx?.currentTime ?? 0, 0.08);
  }

  setWeatherVolume(v: number) {
    this.setAtmosphereVolume(v);
  }

  setSpeechVolume(v: number) {
    if (this.voiceBus) this.voiceBus.gain.setTargetAtTime(Math.max(0, v), this.ctx?.currentTime ?? 0, 0.08);
  }

  setMaster(v: number) {
    if (this.master) this.master.gain.setTargetAtTime(this.muted ? 0 : v, this.ctx?.currentTime ?? 0, 0.08);
  }

  duckToWeather(seconds = 45) {
    if (!this.ctx || !this.voiceBus) return;
    const now = this.ctx.currentTime;
    this.voiceBus.gain.cancelScheduledValues(now);
    this.voiceBus.gain.setValueAtTime(this.voiceBus.gain.value, now);
    this.voiceBus.gain.linearRampToValueAtTime(0, now + seconds);
  }

  applyMix(mix: MixMode, voiceVol: number, weatherVol: number) {
    const voice = mix === "weather" ? 0 : mix === "voice" ? Math.min(1, voiceVol * 1.15) : voiceVol;
    const weather = mix === "voice" ? weatherVol * 0.55 : weatherVol;
    this.setSpeechVolume(voice);
    this.setAtmosphereVolume(weather);
  }

  async pause() {
    if (this.ctx && this.ctx.state === "running") await this.ctx.suspend();
  }

  async resume() {
    if (this.ctx && this.ctx.state === "suspended") await this.ctx.resume();
  }

  stop() {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers = [];
    this.sources.forEach((n) => {
      try {
        if ("stop" in n && typeof n.stop === "function") n.stop();
      } catch {
        /* already stopped */
      }
    });
    this.sources = [];
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
    this.master = this.atmo = this.bed = this.weather = this.oneshot = this.voiceBus = null;
  }
}

export const atmosphere = new AtmosphereEngine();
