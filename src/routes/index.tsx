import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { worldList, type WorldDef } from "@/content/worlds";
import type { WorldId } from "@/content/types";
import { SettingsSheet } from "@/components/settings-sheet";
import { loadMemory } from "@/engine/memory";
import { filmFor } from "@/engine/film";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [last, setLast] = useState<WorldId>("lookout");
  useEffect(() => {
    setLast(loadMemory().lastWorld);
  }, []);

  return (
    <main className="min-h-dvh bg-bg text-fg">
      <header className="flex items-start justify-between px-5 pt-6 pb-4">
        <div>
          <h1 className="font-display text-4xl tracking-tight text-fg">Night Harbor</h1>
          <p className="mt-2 max-w-sm text-sm text-muted">Somewhere it is always almost bedtime.</p>
        </div>
        <SettingsSheet />
      </header>
      <ul className="mx-auto grid max-w-5xl gap-4 px-4 pb-16 sm:grid-cols-3">
        {worldList.map((w) => {
          const still = filmFor(w.id).still;
          return (
            <li key={w.id}>
              {w.id === "house" ? (
                <Link
                  to="/house"
                  className={cn(
                    "group relative block overflow-hidden rounded-lg ring-1 ring-border",
                    last === w.id && "ring-accent/40",
                  )}
                >
                  <CardBody w={w} last={last} still={still} />
                </Link>
              ) : (
                <Link
                  to="/world/$id"
                  params={{ id: w.id }}
                  className={cn(
                    "group relative block overflow-hidden rounded-lg ring-1 ring-border",
                    last === w.id && "ring-accent/40",
                  )}
                >
                  <CardBody w={w} last={last} still={still} />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}

function CardBody({ w, last, still }: { w: WorldDef; last: WorldId; still: string }) {
  const video = filmFor(w.id).video;
  return (
    <div className="relative aspect-[3/4] bg-surface">
      <img src={still} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        src={video}
        poster={still}
        muted
        playsInline
        loop
        preload="metadata"
        onMouseEnter={(e) => void e.currentTarget.play()}
        onMouseLeave={(e) => {
          e.currentTarget.pause();
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="font-display text-2xl tracking-tight">{w.name}</p>
        <p className="mt-1 text-sm text-muted">{w.tagline}</p>
        {last === w.id ? (
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-accent">Last visited</p>
        ) : null}
      </div>
    </div>
  );
}
