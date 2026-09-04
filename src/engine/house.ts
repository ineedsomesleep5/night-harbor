import type { HouseTokens, SceneCard } from "@/content/types";

/**
 * Token → indoor weather mapper.
 * Web MVP uses chips only. Later, replace `tokensFromSignals()` with EventKit
 * shape + WeatherKit (busy/free, rain, travel) — never event titles or names.
 */
export const TOKEN_MAP = {
  rain: "porch boards smell of tomorrow’s coats; windows think in rivers",
  early: "the stove is considering an early fire; a bag is not packed",
  travel: "shoes face the door but are not committed",
  gathering: "a second cup, extra chairs that will be wrong in the morning",
  letter: "an envelope on the hall table that will still be there",
  winter: "iron in the pipes, a quilt pulled higher",
  late_summer: "insects ticking the screen, heat stored in plaster",
  kitchen: "a kettle, fogged glass, a pan left to cool",
  porch: "a wet rail, a moth, one chair at an angle",
  hall: "a banister, a photograph with nobody facing the camera",
  empty_light: "the house practicing being unneeded",
} as const;

export function tokenPreview(t: HouseTokens): string {
  const bits = [t.climate, t.pace === "early" ? "early start" : t.pace, t.weight === "letter" ? "a letter waiting" : t.weight, t.room];
  return bits.join(" · ");
}

export function fragmentsFor(t: HouseTokens): string[] {
  const out: string[] = [];
  if (t.climate === "rain") out.push(TOKEN_MAP.rain);
  if (t.climate === "wind") out.push("a draft uses the stairwell as a small instrument and then thinks better of music");
  if (t.climate === "heat") out.push("plaster keeps the day’s warmth as if it were a saved letter");
  if (t.climate === "clear") out.push("windows hold a darker, simpler outside and do not comment");
  if (t.pace === "early") out.push(TOKEN_MAP.early);
  if (t.pace === "travel") out.push(TOKEN_MAP.travel);
  if (t.pace === "gathering") out.push(TOKEN_MAP.gathering);
  if (t.pace === "empty" && t.weight === "light") out.push(TOKEN_MAP.empty_light);
  if (t.weight === "letter") out.push(TOKEN_MAP.letter);
  if (t.light === "winter") out.push(TOKEN_MAP.winter);
  if (t.light === "late_summer") out.push(TOKEN_MAP.late_summer);
  if (t.room === "kitchen") out.push(TOKEN_MAP.kitchen);
  if (t.room === "porch") out.push(TOKEN_MAP.porch);
  if (t.room === "hall") out.push(TOKEN_MAP.hall);
  return out;
}

export function stitchHouseScene(tokens: HouseTokens): SceneCard {
  const frags = fragmentsFor(tokens).slice(0, 4);
  const body = frags.length
    ? frags.map((f) => f.charAt(0).toUpperCase() + f.slice(1) + ".").join(" ")
    : "The hall table practices patience. The house keeps the week without reading it aloud.";
  const text = [
    "The house receives the week as indoor weather, never as a name.",
    body,
    "Nothing here is an appointment. A coat sleeve on the banister performs the shape of going out and then declines.",
    "The pipes talk in a language that is not news. A pan left to cool answers once.",
    "If a letter is on the table it remains a letter. If rain is in the boards it remains rain.",
    "The house does not recap. It holds. That is the whole of the work for this hour.",
    "Furniture keeps its occupations. The road, if there is a road, means nothing for now.",
    "Warmth stays where warmth was asked to stay. The rooms continue being rooms.",
  ].join(" ");
  return {
    id: `house.gen.${Date.now()}`,
    title: "Tonight’s indoor weather",
    kind: "body",
    text,
  };
}

export const HOUSE_SYSTEM_PROMPT = `You are the night clerk of The House. Write one 180–220 word scene in present tense. Sensory, specific objects, no plot, no questions, no second person, no clock times, no dates, no proper names, no cities, no workplaces, no medical or financial facts. Banned words: tomorrow at, AM, PM, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday as schedule, deadline, email, calendar, dentist, flight number. Reuse at most two of the given indoor-weather fragments. End without a moral.`;
