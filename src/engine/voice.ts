import type { SceneCard } from "@/content/types";

export type NarratorKind = "system" | "grok";

function pickSystemVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const en = voices.filter((v) => /en/i.test(v.lang));
  const preferred = en.find((v) => /uk|gb|daniel|male|arthur|rishi|gordon|david|mark|zira/i.test(v.name + v.lang));
  return preferred ?? en[0] ?? voices[0] ?? null;
}

export class Narrator {
  kind: NarratorKind = "system";
  rate = 0.84;
  paused = false;
  speaking = false;
  volume = 0.85;
  private queue: SceneCard[] = [];
  private index = 0;
  private audio: HTMLAudioElement | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private fetchGrok: ((text: string) => Promise<string | null>) | undefined;
  private volumePaused = false;
  onTitle: (title: string | null) => void = () => {};
  onEnded: () => void = () => {};
  private cancelled = false;
  private keepAlive: number | null = null;

  get active() {
    return this.queue.length > 0 && !this.cancelled;
  }

  setKind(k: NarratorKind) {
    this.kind = k;
  }

  unlock() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.getVoices();
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      u.rate = 2;
      window.speechSynthesis.speak(u);
    } catch {
      /* ignore */
    }
  }

  arm() {
    this.cancelled = false;
    this.unlock();
    this.startKeep();
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.utterance) this.utterance.volume = this.volume;
    if (this.audio) this.audio.volume = this.volume;
    if (this.volume < 0.02) {
      if (this.speaking && !this.paused && !this.volumePaused) {
        this.volumePaused = true;
        try {
          window.speechSynthesis.pause();
        } catch {
          /* ignore */
        }
        this.audio?.pause();
      }
      return;
    }
    if (this.volumePaused) {
      this.volumePaused = false;
      try {
        window.speechSynthesis.resume();
      } catch {
        /* ignore */
      }
      void this.audio?.play();
    }
  }

  async play(scenes: SceneCard[], fetchGrok?: (text: string) => Promise<string | null>) {
    this.stopKeep();
    this.cancelled = false;
    this.queue = scenes;
    this.index = 0;
    this.fetchGrok = fetchGrok;
    this.startKeep();
    await this.next();
  }

  private startKeep() {
    this.stopKeep();
    if (typeof window === "undefined") return;
    this.keepAlive = window.setInterval(() => {
      if (this.cancelled || this.paused) return;
      try {
        window.speechSynthesis.resume();
      } catch {
        /* ignore */
      }
    }, 8000) as unknown as number;
  }

  private stopKeep() {
    if (this.keepAlive != null) {
      window.clearInterval(this.keepAlive);
      this.keepAlive = null;
    }
  }

  private async next() {
    if (this.cancelled) return;
    if (this.index >= this.queue.length) {
      this.speaking = false;
      this.onTitle(null);
      this.onEnded();
      return;
    }
    const scene = this.queue[this.index];
    this.onTitle(scene.title);
    this.speaking = true;
    if (this.kind === "grok" && this.fetchGrok) {
      const url = await this.fetchGrok(scene.text);
      if (url && !this.cancelled) {
        await this.playUrl(url);
        return;
      }
    }
    await this.speakSystem(scene.text);
  }

  private speakSystem(text: string) {
    return new Promise<void>((resolve) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        this.advance();
        resolve();
        return;
      }
      const speak = () => {
        if (this.cancelled) {
          resolve();
          return;
        }
        const u = new SpeechSynthesisUtterance(text);
        const voice = pickSystemVoice();
        if (voice) u.voice = voice;
        u.rate = this.rate;
        u.pitch = 0.9;
        u.volume = Math.max(0.15, this.volume);
        this.utterance = u;
        u.onend = () => {
          this.speaking = false;
          this.utterance = null;
          this.advance();
          resolve();
        };
        u.onerror = () => {
          this.speaking = false;
          this.utterance = null;
          this.advance();
          resolve();
        };
        try {
          window.speechSynthesis.resume();
        } catch {
          /* ignore */
        }
        window.speechSynthesis.speak(u);
      };
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) {
        const once = () => {
          window.speechSynthesis.removeEventListener("voiceschanged", once);
          speak();
        };
        window.speechSynthesis.addEventListener("voiceschanged", once);
        window.setTimeout(speak, 300);
      } else {
        speak();
      }
    });
  }

  private playUrl(url: string) {
    return new Promise<void>((resolve) => {
      const a = new Audio(url);
      this.audio = a;
      a.volume = this.volume;
      a.onended = () => {
        this.speaking = false;
        this.advance();
        resolve();
      };
      a.onerror = () => {
        this.speaking = false;
        this.advance();
        resolve();
      };
      void a.play();
    });
  }

  private advance() {
    if (this.cancelled) return;
    this.index += 1;
    const pause = 2200 + Math.random() * 1200;
    window.setTimeout(() => {
      void this.next();
    }, pause);
  }

  pause() {
    this.paused = true;
    try {
      window.speechSynthesis.pause();
    } catch {
      /* ignore */
    }
    this.audio?.pause();
  }

  resume() {
    this.paused = false;
    if (this.volume < 0.02) {
      this.volumePaused = true;
      return;
    }
    this.volumePaused = false;
    try {
      window.speechSynthesis.resume();
    } catch {
      /* ignore */
    }
    void this.audio?.play();
  }

  stop() {
    this.cancelled = true;
    this.speaking = false;
    this.paused = false;
    this.volumePaused = false;
    this.queue = [];
    this.index = 0;
    this.utterance = null;
    this.stopKeep();
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio = null;
    }
    this.onTitle(null);
  }
}

export const narrator = new Narrator();
