import type { WorldId } from "./types";

export const RECIPE_VERSION = 1;

export type AudioRecipe = {
  bed: "fire" | "hush" | "house";
  weather: "wind-drip" | "water" | "quiet";
  oneshots: Array<"resin" | "horn" | "tick" | "kettle" | "knock">;
  hornInterval?: [number, number];
};

export type VideoRecipe = {
  stillPrompt: string;
  stillPrompts: [string, string, string];
  videoPrompt: string;
};

export const audioRecipes: Record<WorldId, AudioRecipe> = {
  lookout: {
    bed: "fire",
    weather: "wind-drip",
    oneshots: ["resin", "kettle", "tick"],
  },
  archipelago: {
    bed: "hush",
    weather: "water",
    oneshots: ["horn", "knock", "tick"],
    hornInterval: [180, 480],
  },
  house: {
    bed: "house",
    weather: "quiet",
    oneshots: ["tick", "kettle"],
  },
};

export const videoRecipes: Record<WorldId, VideoRecipe> = {
  lookout: {
    stillPrompt:
      "Photoreal interior of a dim timber mountain cabin at night. A cast-iron wood stove glows with low embers. Rain on one west window. Kettle steam. Knitted quilt on a chair. No people, no faces, no text, film grain.",
    stillPrompts: [
      "Cabin stove and kettle at night, ember light, no people, film grain.",
      "West window of a timber cabin, rain streaks, dark slope beyond, no people.",
      "Quilt on a wooden chair beside a quiet wood stove, dim cabin, no people.",
    ],
    videoPrompt:
      "The cabin holds still. Fire flickers. Rain streaks the window. Steam from the kettle. Camera breathes a 2cm drift. Seamless loop, no people, no faces, no text, no logos, no camera whip, no jump cuts, photoreal nighttime, film grain.",
  },
  archipelago: {
    stillPrompt:
      "Photoreal fishing village at night in warm grey fog. Lanterns as soft coins on wet cobbles. Nets under a roof. Almost no horizon. No people, no faces, no text, film grain.",
    stillPrompts: [
      "Fog village lanterns on wet cobbles at night, no people, film grain.",
      "Nets drying under a roof that is also fog, lantern light, no people.",
      "Wooden pilings in warm grey mist, quiet water, no people, film grain.",
    ],
    videoPrompt:
      "Fog drifts slowly sideways through a fishing village. Lantern light holds. Wet cobbles gleam. Camera almost still. Seamless loop, no people, no faces, no text, no logos, no boats crashing, no jump cuts, photoreal nighttime, film grain.",
  },
  house: {
    stillPrompt:
      "Photoreal dim hallway of an old house at night. Hall table with an unopened envelope. Coats on a banister. A photograph with nobody facing the camera. No people, no faces, no text, film grain.",
    stillPrompts: [
      "Hall table with an unopened envelope at night, no people, film grain.",
      "Wool coats on a banister in a dim house, kitchen light far away, no people.",
      "Kitchen window fogged from something already finished, night, no people.",
    ],
    videoPrompt:
      "The hallway is almost still. Warm kitchen light pulses faintly. Dust motes drift. Camera breathes a 2cm drift. Seamless loop, no people, no faces, no text, no logos, no camera whip, no jump cuts, photoreal nighttime, film grain.",
  },
};

export const staticFilms: Record<WorldId, { still: string; video: string }> = {
  lookout: { still: "/films/lookout.jpg", video: "/films/lookout.mp4" },
  archipelago: { still: "/films/archipelago.jpg", video: "/films/archipelago.mp4" },
  house: { still: "/films/house.jpg", video: "/films/house.mp4" },
};
