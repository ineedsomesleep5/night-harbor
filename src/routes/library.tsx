import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SettingsSheet } from "@/components/settings-sheet";
import { stitchHouseScene } from "@/engine/house";
import { dayKey } from "@/engine/assembler";
import { loadMemory, patchMemory } from "@/engine/memory";

export const Route = createFileRoute("/library")({ component: Library });

function Library() {
  const [tick, setTick] = useState(0);
  const mem = useMemo(() => loadMemory(), [tick]);
  const heard = new Set(mem.heardIds);

  function regenerate() {
    const scene = stitchHouseScene(mem.houseTokens);
    const next = {
      id: scene.id,
      title: scene.title,
      text: scene.text,
      tokens: mem.houseTokens,
      created: new Date().toISOString(),
    };
    const filtered = mem.generatedScenes.filter((g) => g.created.slice(0, 10) !== dayKey());
    patchMemory({
      generatedScenes: [...filtered, next].slice(-20),
      tonightPlaylist: [{ id: scene.id, title: scene.title }, ...mem.tonightPlaylist.filter((p) => !p.id.startsWith("house.gen."))],
    });
    setTick((n) => n + 1);
  }

  return (
    <main className="min-h-dvh bg-bg text-fg">
      <header className="flex items-center justify-between px-5 pt-6">
        <div>
          <Link to="/" className="text-xs uppercase tracking-wider text-muted">
            Night Harbor
          </Link>
          <h1 className="font-display mt-1 text-3xl">Library</h1>
          <p className="mt-1 text-sm text-muted">Tonight’s titles only. The rooms keep the rest.</p>
        </div>
        <SettingsSheet />
      </header>

      <section className="mx-auto max-w-lg p-5">
        <h2 className="text-xs uppercase tracking-wider text-subtle">Tonight</h2>
        {mem.tonightPlaylist.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Begin a world to gather tonight’s cards.</p>
        ) : (
          <ol className="mt-3 space-y-2">
            {mem.tonightPlaylist.map((p, i) => (
              <li key={p.id} className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-muted">{i + 1}</span>
                <span className="flex-1 font-display text-base text-fg">{p.title}</span>
                {heard.has(p.id) ? <span className="text-xs uppercase tracking-wider text-subtle">Heard</span> : null}
              </li>
            ))}
          </ol>
        )}

        <button
          type="button"
          onClick={regenerate}
          className="mt-8 h-11 w-full rounded-md text-sm text-muted ring-1 ring-border hover:text-fg"
        >
          Regenerate tonight’s card
        </button>
        <p className="mt-2 text-xs text-subtle">The House only. Writes a new indoor-weather card from tonight’s tokens.</p>

        <h2 className="mt-10 text-xs uppercase tracking-wider text-subtle">Worlds</h2>
        <ul className="mt-3 space-y-2">
          <li>
            <Link to="/world/$id" params={{ id: "lookout" }} className="font-display text-xl text-fg hover:text-accent">
              The Lookout
            </Link>
          </li>
          <li>
            <Link to="/world/$id" params={{ id: "archipelago" }} className="font-display text-xl text-fg hover:text-accent">
              Fog Archipelago
            </Link>
          </li>
          <li>
            <Link to="/house" className="font-display text-xl text-fg hover:text-accent">
              The House
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
