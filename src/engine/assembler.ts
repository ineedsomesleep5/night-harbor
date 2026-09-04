import { worlds } from "@/content/worlds";
import type { DurationMode, HouseTokens, SceneCard, WorldId } from "@/content/types";

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rng: () => number) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function dayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function assembleNight(opts: {
  worldId: WorldId;
  duration: DurationMode;
  heardIds: string[];
  generated?: SceneCard | null;
  day?: string;
}): SceneCard[] {
  const world = worlds[opts.worldId];
  const rng = mulberry32(hash(`${opts.worldId}:${opts.day ?? dayKey()}`));
  const place = world.scenes.find((s) => s.kind === "place") ?? world.scenes[0];
  const close = world.scenes.find((s) => s.kind === "close");
  const rest = world.scenes.filter((s) => s.id !== place.id && s.kind !== "close");

  const unheard = rest.filter((s) => !opts.heardIds.includes(s.id));
  const heard = rest.filter((s) => opts.heardIds.includes(s.id));
  const ranked = [...shuffle(unheard, rng), ...shuffle(heard, rng)];

  const count = opts.duration === "five" ? 2 : opts.duration === "fifteen" ? 6 : 10;
  const bodyCount = Math.max(0, count - 1 - (opts.duration === "five" ? 0 : close ? 1 : 0));

  const body: SceneCard[] = [];
  for (const s of ranked) {
    if (body.length >= bodyCount) break;
    const prev = body[body.length - 1] ?? place;
    if (s.kind === "horn" && prev.kind === "horn") continue;
    body.push(s);
  }

  if (opts.generated && opts.worldId === "house" && opts.duration !== "five") {
    const insertAt = Math.max(1, Math.floor(body.length / 2));
    body.splice(insertAt, 0, opts.generated);
    if (body.length > bodyCount + 1) {
      const cut = body.findIndex((s, i) => i !== insertAt && s.kind !== "horn");
      if (cut >= 0 && cut !== insertAt) body.splice(cut, 1);
    }
  }

  const out = [place, ...body];
  if (close && opts.duration !== "five") out.push(close);
  return out;
}

export function houseGeneratedFromMemory(
  generatedScenes: Array<{ id: string; title: string; text: string; created: string }>,
  day: string,
): SceneCard | null {
  const today = generatedScenes.find((s) => s.created.slice(0, 10) === day);
  if (!today) return null;
  return { id: today.id, title: today.title, text: today.text, kind: "body" };
}

export function tokensFingerprint(t: HouseTokens) {
  return `${t.climate}-${t.pace}-${t.weight}-${t.light}-${t.room}`;
}
