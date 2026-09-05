import { useState } from "react";
import type { WorldId } from "@/content/types";
import { filmFor } from "@/engine/film";
import { loadMemory } from "@/engine/memory";
import { WorldMotion } from "@/components/world-motion";
import { cn } from "@/lib/utils";

export function FilmStage({ worldId, className }: { worldId: WorldId; className?: string }) {
  const [still] = useState(filmFor(worldId).still);
  const reduce = loadMemory().settings.reduceMotion;
  const show = loadMemory().settings.showVideo;

  if (!show) {
    return <div className={cn("absolute inset-0 bg-bg", className)} />;
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-bg grain vignette", className)}>
      <img src={still} alt="" className="h-full w-full object-cover" />
      {reduce ? null : <WorldMotion worldId={worldId} />}
    </div>
  );
}
