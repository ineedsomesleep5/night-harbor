import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FilmStage } from "@/components/film-stage";
import type { HouseTokens } from "@/content/types";
import { tokenPreview } from "@/engine/house";
import { loadMemory, patchMemory } from "@/engine/memory";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/house")({ component: HouseSetup });

const CLIMATE = ["clear", "rain", "wind", "heat"] as const;
const PACE = ["empty", "early", "travel", "gathering"] as const;
const WEIGHT = ["light", "ordinary", "letter"] as const;
const LIGHT = ["winter", "late_summer", "in_between"] as const;
const ROOM = ["kitchen", "porch", "hall"] as const;

function HouseSetup() {
  const nav = useNavigate();
  const initial = loadMemory();
  const [tokens, setTokens] = useState<HouseTokens>(initial.houseTokens);
  const [useTokens, setUseTokens] = useState(initial.useTokens);
  const [remember, setRemember] = useState(initial.rememberLastNight);

  function save() {
    patchMemory({
      houseTokens: tokens,
      useTokens,
      rememberLastNight: remember,
      lastWorld: "house",
    });
  }

  return (
    <main className="relative min-h-dvh bg-bg text-fg">
      <FilmStage worldId="house" />
      <div className="relative z-10 min-h-dvh bg-bg/55">
        <header className="px-5 pt-6">
          <Link to="/" className="text-xs uppercase tracking-[0.16em] text-muted">
            Night Harbor
          </Link>
          <h1 className="font-display mt-1 text-3xl tracking-tight">The House</h1>
          <p className="mt-1 max-w-md text-sm text-muted">
            Indoor weather only. Nothing here is a name, a date, or a plan.
          </p>
        </header>

        <div className="mx-auto max-w-lg space-y-6 p-5 pb-28">
          <Group label="Climate" value={tokens.climate} options={CLIMATE} labels={{ clear: "clear", rain: "rain", wind: "wind", heat: "heat" }} onChange={(v) => setTokens({ ...tokens, climate: v })} />
          <Group
            label="Pace of tomorrow"
            value={tokens.pace}
            options={PACE}
            labels={{ empty: "empty", early: "early start", travel: "travel", gathering: "gathering" }}
            onChange={(v) => setTokens({ ...tokens, pace: v })}
          />
          <Group
            label="Weight"
            value={tokens.weight}
            options={WEIGHT}
            labels={{ light: "light", ordinary: "ordinary", letter: "a letter waiting" }}
            onChange={(v) => setTokens({ ...tokens, weight: v })}
          />
          <Group
            label="Season light"
            value={tokens.light}
            options={LIGHT}
            labels={{ winter: "winter", late_summer: "late summer", in_between: "in-between" }}
            onChange={(v) => setTokens({ ...tokens, light: v })}
          />
          <Group
            label="Indoor mood"
            value={tokens.room}
            options={ROOM}
            labels={{ kitchen: "kitchen", porch: "porch", hall: "upstairs hall" }}
            onChange={(v) => setTokens({ ...tokens, room: v })}
          />

          <p className="font-display text-lg text-fg/90">{tokenPreview(tokens)}</p>

          <Toggle label="Use these tokens tonight" on={useTokens} onChange={setUseTokens} />
          <Toggle label="Remember last night" on={remember} onChange={setRemember} />
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            className="mx-auto block h-12 w-full max-w-lg rounded-full bg-accent text-sm font-medium text-accent-fg"
            onClick={() => {
              save();
              void nav({ to: "/world/$id", params: { id: "house" } });
            }}
          >
            Enter the house
          </button>
        </div>
      </div>
    </main>
  );
}

function Group<T extends string>({
  label,
  value,
  options,
  labels,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-subtle">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={cn(
              "h-11 rounded-full px-4 text-sm ring-1 ring-border",
              value === o ? "bg-accent text-accent-fg" : "text-muted",
            )}
          >
            {labels[o]}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" className="flex w-full items-center justify-between py-2 text-sm" onClick={() => onChange(!on)}>
      <span>{label}</span>
      <span className={cn("h-7 w-12 rounded-full p-0.5 ring-1 ring-border-strong", on ? "bg-accent" : "bg-surface")}>
        <span className={cn("block size-6 rounded-full bg-fg", on ? "translate-x-5 bg-accent-fg" : "")} />
      </span>
    </button>
  );
}
