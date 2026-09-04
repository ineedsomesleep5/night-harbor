import { Pause, Play } from "lucide-react";
import type { DurationMode } from "@/content/types";
import { cn } from "@/lib/utils";

export function NightTray({
  playing,
  paused,
  speech,
  atmosphere,
  duration,
  onToggle,
  onSpeech,
  onAtmosphere,
  onDuration,
}: {
  playing: boolean;
  paused: boolean;
  speech: number;
  atmosphere: number;
  duration: DurationMode;
  onToggle: () => void;
  onSpeech: (v: number) => void;
  onAtmosphere: (v: number) => void;
  onDuration: (d: DurationMode) => void;
}) {
  const listening = playing && !paused;
  return (
    <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-10">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <button
          type="button"
          onClick={onToggle}
          className="mx-auto grid size-16 place-items-center rounded-full bg-accent text-accent-fg transition-transform duration-150 active:scale-[0.98]"
        >
          {listening ? (
            <Pause className="size-6" fill="currentColor" />
          ) : (
            <Play className="size-6 translate-x-px" fill="currentColor" />
          )}
          <span className="sr-only">{listening ? "Pause" : "Begin"}</span>
        </button>
        <p className="font-display -mt-2 text-center text-lg text-fg/90">
          {!playing ? "Begin" : paused ? "Paused" : "Listening"}
        </p>

        <MixSlider label="Speech" value={speech} onChange={onSpeech} />
        <MixSlider label="Atmosphere" value={atmosphere} onChange={onAtmosphere} />

        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-subtle">Duration</p>
          <div className="mt-2 flex gap-2">
            {(
              [
                ["five", "5 min"],
                ["fifteen", "15 min"],
                ["morning", "Until morning"],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => onDuration(k)}
                className={cn(
                  "h-11 flex-1 rounded-full text-xs tracking-wide ring-1 ring-border sm:text-sm",
                  duration === k ? "bg-accent text-accent-fg" : "text-muted",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MixSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const pct = Math.round(value * 100);
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.16em] text-subtle">{label}</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mix-slider mt-2 w-full"
        style={{ "--mix-pct": `${pct}%` } as React.CSSProperties}
      />
    </label>
  );
}
