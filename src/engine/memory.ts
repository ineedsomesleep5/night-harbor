import type { HouseTokens, NightMemory, WorldId } from "@/content/types";

const KEY = "nightHarbor.memory";
const TOKEN_KEY = "nightHarbor.houseTokens";

export const defaultTokens: HouseTokens = {
  climate: "rain",
  pace: "early",
  weight: "letter",
  light: "in_between",
  room: "hall",
};

export const defaultMemory = (): NightMemory => ({
  lastWorld: "lookout",
  houseTokens: defaultTokens,
  useTokens: true,
  rememberLastNight: true,
  heardIds: [],
  openThreads: ["the letter on the hall table"],
  generatedScenes: [],
  tonightPlaylist: [],
  settings: {
    reduceMotion: false,
    startMuted: false,
    showVideo: true,
    narrator: "system",
    speechVol: 0.85,
    atmosphereVol: 0.85,
  },
});

export function loadMemory(): NightMemory {
  if (typeof window === "undefined") return defaultMemory();
  try {
    const raw = localStorage.getItem(KEY);
    const tokensRaw = localStorage.getItem(TOKEN_KEY);
    const base = defaultMemory();
    const parsed = raw ? (JSON.parse(raw) as Partial<NightMemory>) : {};
    const tokens = tokensRaw ? (JSON.parse(tokensRaw) as HouseTokens) : parsed.houseTokens;
    return {
      ...base,
      ...parsed,
      houseTokens: { ...base.houseTokens, ...tokens },
      settings: { ...base.settings, ...parsed.settings },
      generatedScenes: (parsed.generatedScenes ?? []).slice(-20),
    };
  } catch {
    return defaultMemory();
  }
}

export function saveMemory(m: NightMemory) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(m));
  localStorage.setItem(TOKEN_KEY, JSON.stringify(m.houseTokens));
}

export function patchMemory(p: Partial<NightMemory>) {
  const next = { ...loadMemory(), ...p };
  if (p.settings) next.settings = { ...loadMemory().settings, ...p.settings };
  saveMemory(next);
  return next;
}

export function rememberWorld(id: WorldId) {
  return patchMemory({ lastWorld: id });
}
