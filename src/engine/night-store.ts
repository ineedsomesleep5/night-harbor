import { create } from "zustand";
import type { DurationMode, MixMode, SceneCard, WorldId } from "@/content/types";
import { assembleNight, dayKey } from "./assembler";
import { atmosphere } from "./audio";
import { stitchHouseScene } from "./house";
import { loadMemory, patchMemory } from "./memory";
import { narrator } from "./voice";
import { speakSceneFn } from "@/lib/ai";
import { worlds } from "@/content/worlds";

type NightState = {
  worldId: WorldId;
  playing: boolean;
  paused: boolean;
  mix: MixMode;
  duration: DurationMode;
  voiceVol: number;
  weatherVol: number;
  currentTitle: string | null;
  playlist: SceneCard[];
  chromeVisible: boolean;
  filmStatus: string | null;
  begin: (worldId: WorldId) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => void;
  setMix: (m: MixMode) => void;
  setDuration: (d: DurationMode) => void;
  setVoiceVol: (v: number) => void;
  setWeatherVol: (v: number) => void;
  setTitle: (t: string | null) => void;
  showChrome: () => void;
};

let duckTimer: number | null = null;
let hideTimer: number | null = null;
let speechTimer: number | null = null;
let speechDueAt = 0;
let speechRemainMs = 3000;
let pendingPlaylist: SceneCard[] | null = null;

function sessionMs(d: DurationMode) {
  if (d === "five") return 5 * 60 * 1000;
  if (d === "fifteen") return 15 * 60 * 1000;
  return null;
}

function clearSpeechTimer() {
  if (speechTimer != null) {
    window.clearTimeout(speechTimer);
    speechTimer = null;
  }
}

function armNarrator(get: () => NightState) {
  clearSpeechTimer();
  const wait = Math.max(0, speechDueAt - Date.now());
  speechTimer = window.setTimeout(() => {
    speechTimer = null;
    const s = get();
    const pl = pendingPlaylist;
    if (!pl || !s.playing || s.paused) return;
    if (s.mix === "weather" || s.voiceVol <= 0.02) return;
    pendingPlaylist = null;
    void narrator.play(pl, grokVoice);
  }, wait) as unknown as number;
}

function hydrateVols() {
  if (typeof window === "undefined") return { speech: 0.72, atmo: 0.7 };
  const s = loadMemory().settings;
  return {
    speech: typeof s.speechVol === "number" ? s.speechVol : 0.72,
    atmo: typeof s.atmosphereVol === "number" ? s.atmosphereVol : 0.7,
  };
}

async function grokVoice(text: string) {
  try {
    const r = await speakSceneFn({ data: { text } });
    if (r.ok) return r.audio;
  } catch {
    /* system voice */
  }
  return null;
}

const initial = hydrateVols();

export const useNight = create<NightState>((set, get) => ({
  worldId: "lookout",
  playing: false,
  paused: false,
  mix: "balanced",
  duration: "fifteen",
  voiceVol: initial.speech,
  weatherVol: initial.atmo,
  currentTitle: null,
  playlist: [],
  chromeVisible: true,
  filmStatus: null,

  setTitle: (t) => set({ currentTitle: t }),
  setDuration: (d) => set({ duration: d }),
  setVoiceVol: (v) => {
    set({ voiceVol: v });
    patchMemory({ settings: { ...loadMemory().settings, speechVol: v } });
    const s = get();
    atmosphere.applyMix(s.mix, v, s.weatherVol);
    narrator.setVolume(s.mix === "weather" ? 0 : v);
    if (
      s.playing &&
      !s.paused &&
      v > 0.02 &&
      !narrator.active &&
      s.mix !== "weather" &&
      !pendingPlaylist
    ) {
      void narrator.play(s.playlist, grokVoice);
    }
  },
  setWeatherVol: (v) => {
    set({ weatherVol: v });
    patchMemory({ settings: { ...loadMemory().settings, atmosphereVol: v } });
    const s = get();
    atmosphere.applyMix(s.mix, s.voiceVol, v);
  },
  setMix: (m) => {
    set({ mix: m });
    const s = get();
    atmosphere.applyMix(m, s.voiceVol, s.weatherVol);
    narrator.setVolume(m === "weather" ? 0 : s.voiceVol);
    if (m === "weather") narrator.stop();
  },
  showChrome: () => {
    set({ chromeVisible: true });
    if (hideTimer) window.clearTimeout(hideTimer);
    if (get().playing && !get().paused) {
      hideTimer = window.setTimeout(() => set({ chromeVisible: false }), 8000) as unknown as number;
    }
  },

  begin: async (worldId) => {
    atmosphere.unlock();
    narrator.arm();
    const mem = loadMemory();
    const s = get();
    if (s.playing) get().stop();
    atmosphere.unlock();
    narrator.arm();

    let generated = null as SceneCard | null;
    if (worldId === "house" && mem.useTokens) {
      const today = dayKey();
      const existing = mem.generatedScenes.find((g) => g.created.slice(0, 10) === today);
      generated = existing
        ? { id: existing.id, title: existing.title, text: existing.text, kind: "body" }
        : stitchHouseScene(mem.houseTokens);
      if (!existing && generated) {
        patchMemory({
          generatedScenes: [
            ...mem.generatedScenes,
            {
              id: generated.id,
              title: generated.title,
              text: generated.text,
              tokens: mem.houseTokens,
              created: new Date().toISOString(),
            },
          ].slice(-20),
        });
      }
    }

    const playlist = assembleNight({
      worldId,
      duration: s.duration,
      heardIds: mem.rememberLastNight ? mem.heardIds : [],
      generated,
    });

    patchMemory({
      lastWorld: worldId,
      tonightPlaylist: playlist.map((p) => ({ id: p.id, title: p.title })),
      heardIds: [...new Set([...mem.heardIds, ...playlist.map((p) => p.id)])].slice(-80),
    });

    atmosphere.muted = mem.settings.startMuted;
    void atmosphere.start(worldId, s.weatherVol);
    atmosphere.applyMix(s.mix, s.voiceVol, s.weatherVol);
    narrator.setKind(mem.settings.narrator);
    narrator.setVolume(s.mix === "weather" ? 0 : s.voiceVol);
    narrator.onTitle = (t) => set({ currentTitle: t });
    narrator.onEnded = () => set({ currentTitle: null });

    document.title = `Night Harbor — ${worlds[worldId].name}`;
    if (navigator.mediaSession) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: worlds[worldId].name,
        artist: "Night Harbor",
        album: "Night Harbor",
      });
      navigator.mediaSession.setActionHandler("play", () => void get().resume());
      navigator.mediaSession.setActionHandler("pause", () => void get().pause());
    }

    set({ worldId, playing: true, paused: false, playlist, chromeVisible: true });
    if (hideTimer) window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => set({ chromeVisible: false }), 8000) as unknown as number;

    const ms = sessionMs(s.duration);
    if (duckTimer) window.clearTimeout(duckTimer);
    if (ms) {
      duckTimer = window.setTimeout(() => {
        atmosphere.duckToWeather(45);
        narrator.stop();
        pendingPlaylist = null;
        clearSpeechTimer();
        set({ currentTitle: null });
      }, ms) as unknown as number;
    }

    pendingPlaylist = playlist;
    speechRemainMs = 3000;
    speechDueAt = Date.now() + 3000;
    if (s.mix !== "weather" && s.voiceVol > 0.02) armNarrator(get);
    else pendingPlaylist = null;
  },

  pause: async () => {
    if (pendingPlaylist && speechTimer != null) {
      speechRemainMs = Math.max(0, speechDueAt - Date.now());
      clearSpeechTimer();
    }
    narrator.pause();
    await atmosphere.pause();
    set({ paused: true, chromeVisible: true });
  },
  resume: async () => {
    narrator.arm();
    if (pendingPlaylist) {
      speechDueAt = Date.now() + speechRemainMs;
      armNarrator(get);
    } else {
      narrator.resume();
    }
    await atmosphere.resume();
    set({ paused: false });
    get().showChrome();
  },
  stop: () => {
    if (duckTimer) window.clearTimeout(duckTimer);
    if (hideTimer) window.clearTimeout(hideTimer);
    pendingPlaylist = null;
    clearSpeechTimer();
    narrator.stop();
    atmosphere.stop();
    document.title = "Night Harbor";
    set({ playing: false, paused: false, currentTitle: null, chromeVisible: true });
  },
}));
