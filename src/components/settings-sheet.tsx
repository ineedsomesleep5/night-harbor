import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { loadMemory, patchMemory } from "@/engine/memory";
import { cn } from "@/lib/utils";

export function SettingsSheet() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState(() => loadMemory().settings);

  useEffect(() => {
    if (open) setS(loadMemory().settings);
  }, [open]);

  function update<K extends keyof typeof s>(k: K, v: (typeof s)[K]) {
    const next = { ...s, [k]: v };
    setS(next);
    patchMemory({ settings: next });
  }

  return (
    <>
      <button
        type="button"
        aria-label="Settings"
        onClick={() => setOpen(true)}
        className="grid size-11 place-items-center rounded-full text-muted hover:text-fg"
      >
        <Settings className="size-5" strokeWidth={1.5} />
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-bg/70"
            aria-label="Close settings"
            onClick={() => setOpen(false)}
          />
          <div className="relative m-4 w-full max-w-md rounded-xl bg-elevated p-6 shadow-xl ring-1 ring-border">
            <h2 className="font-display text-xl text-fg">Settings</h2>
            <ul className="mt-5 space-y-4 text-sm">
              <Row
                label="Reduce motion"
                on={s.reduceMotion}
                onChange={(v) => update("reduceMotion", v)}
              />
              <Row label="Start muted" on={s.startMuted} onChange={(v) => update("startMuted", v)} />
              <Row label="Show video" on={s.showVideo} onChange={(v) => update("showVideo", v)} />
            </ul>
            <p className="mt-6 text-xs uppercase tracking-wider text-subtle">Narrator</p>
            <div className="mt-2 flex gap-2">
              {(["system", "grok"] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => update("narrator", n)}
                  className={cn(
                    "h-11 flex-1 rounded-md text-sm capitalize ring-1 ring-border",
                    s.narrator === n ? "bg-accent text-accent-fg" : "text-muted",
                  )}
                >
                  {n === "grok" ? "Grok voice" : "System voice"}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-subtle">
              Grok voice uses a quiet server voice when available. Otherwise the system narrator is used.
            </p>
            <button
              type="button"
              className="mt-6 h-11 w-full rounded-md bg-surface text-sm text-fg ring-1 ring-border"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Row({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <li className="flex items-center justify-between gap-4">
      <span className="text-fg">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        className={cn(
          "h-7 w-12 rounded-full p-0.5 ring-1 ring-border-strong",
          on ? "bg-accent" : "bg-surface",
        )}
      >
        <span
          className={cn(
            "block size-6 rounded-full bg-fg transition-transform duration-150",
            on ? "translate-x-5 bg-accent-fg" : "translate-x-0",
          )}
        />
      </button>
    </li>
  );
}
