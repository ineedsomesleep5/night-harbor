import { create } from "zustand";
import type { DurationMode, MixMode, SceneCard, WorldId } from "@/content/types";
import { assembleNight, dayKey } from "./assembler";
import { atmosphere } from "./audio";
import { fragmentsFor, stitchHouseScene } from "./house";
import { loadMemory, patchMemory } from "./memory";
import { narrator } from "./voice";
import { generateHouseSceneFn, speakSceneFn } from "@/lib/ai";
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

function sessionMs(d: DurationMode) {
  if (d === "five") return 5 * 60 * 1000;
  if (d === "fifteen") return 15 * 60 * 1000;
  return null;
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
    if (s.playing && !s.paused && v > 0.02 && !narrator.active && s.mix !== "weather") {
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
    const mem = loadMemory();
    const s = get();
    if (s.playing) get().stop();

    let generated = null as SceneCard | null;
    if (worldId === "house" && mem.useTokens) {
      const today = dayKey();
      const existing = mem.generatedScenes.find((g) => g.created.slice(0, 10) === today);
      if (existing) {
        generated = { id: existing.id, title: existing.title, text: existing.text, kind: "body" };
      } else {
        const frags = fragmentsFor(mem.houseTokens);
        try {
          const res = await generateHouseSceneFn({ data: { tokens: mem.houseTokens, fragments: frags } });
          if (res.ok) {
            generated = {
              id: `house.gen.${Date.now()}`,
              title: "Tonight’s indoor weather",
              kind: "body",
              text: res.text,
            };
          }
        } catch {
          generated = null;
        }
        if (!generated) generated = stitchHouseScene(mem.houseTokens);
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
    await atmosphere.start(worldId, s.weatherVol);
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
        set({ currentTitle: null });
      }, ms) as unknown as number;
    }

    if (s.mix !== "weather" && s.voiceVol > 0.02) {
      await narrator.play(playlist, grokVoice);
    }
  },

  pause: async () => {
    narrator.pause();
    await atmosphere.pause();
    set({ paused: true, chromeVisible: true });
  },
  resume: async () => {
    narrator.resume();
    await atmosphere.resume();
    set({ paused: false });
    get().showChrome();
  },
  stop: () => {
    if (duckTimer) window.clearTimeout(duckTimer);
    if (hideTimer) window.clearTimeout(hideTimer);
    narrator.stop();
    atmosphere.stop();
    document.title = "Night Harbor";
    set({ playing: false, paused: false, currentTitle: null, chromeVisible: true });
  },
}));
