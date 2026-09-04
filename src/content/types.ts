export type WorldId = "lookout" | "archipelago" | "house";

export type SceneKind = "place" | "body" | "horn" | "close";

export type SceneCard = {
  id: string;
  title: string;
  text: string;
  kind: SceneKind;
};

export type DurationMode = "five" | "fifteen" | "morning";
export type MixMode = "voice" | "balanced" | "weather";

export type HouseTokens = {
  climate: "clear" | "rain" | "wind" | "heat";
  pace: "empty" | "early" | "travel" | "gathering";
  weight: "light" | "ordinary" | "letter";
  light: "winter" | "late_summer" | "in_between";
  room: "kitchen" | "porch" | "hall";
};

export type NightMemory = {
  lastWorld: WorldId;
  houseTokens: HouseTokens;
  useTokens: boolean;
  rememberLastNight: boolean;
  heardIds: string[];
  openThreads: string[];
  generatedScenes: Array<{
    id: string;
    title: string;
    text: string;
    tokens: HouseTokens;
    created: string;
  }>;
  tonightPlaylist: Array<{ id: string; title: string }>;
  settings: {
    reduceMotion: boolean;
    startMuted: boolean;
    showVideo: boolean;
    narrator: "system" | "grok";
    speechVol: number;
    atmosphereVol: number;
  };
};
