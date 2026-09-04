import { RECIPE_VERSION, staticFilms } from "@/content/recipes";
import type { WorldId } from "@/content/types";

const DB = "nightHarbor.films";
const STORE = "clips";

function openDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  return new Promise((resolve) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}

export async function cachedFilm(world: WorldId): Promise<string | null> {
  const db = await openDb();
  if (!db) return null;
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(`${world}:${RECIPE_VERSION}`);
    req.onsuccess = () => {
      const blob = req.result as Blob | undefined;
      resolve(blob ? URL.createObjectURL(blob) : null);
    };
    req.onerror = () => resolve(null);
  });
}

export async function storeFilm(world: WorldId, blob: Blob) {
  const db = await openDb();
  if (!db) return;
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put(blob, `${world}:${RECIPE_VERSION}`);
}

export function filmFor(world: WorldId) {
  return staticFilms[world];
}
