import { useEffect, useRef, useState } from "react";
import type { WorldId } from "@/content/types";
import { cachedFilm, filmFor } from "@/engine/film";
import { loadMemory } from "@/engine/memory";
import { cn } from "@/lib/utils";

export function FilmStage({ worldId, className }: { worldId: WorldId; className?: string }) {
  const aRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState(filmFor(worldId).video);
  const [still] = useState(filmFor(worldId).still);
  const [useStill, setUseStill] = useState(false);
  const reduce = loadMemory().settings.reduceMotion;
  const show = loadMemory().settings.showVideo;

  useEffect(() => {
    let alive = true;
    setSrc(filmFor(worldId).video);
    setUseStill(false);
    void cachedFilm(worldId).then((url) => {
      if (alive && url) setSrc(url);
    });
    return () => {
      alive = false;
    };
  }, [worldId]);

  useEffect(() => {
    const v = aRef.current;
    if (!v || useStill || reduce) return;
    const tryPlay = () => {
      void v.play().catch(() => {
        /* autoplay may wait for a gesture; muted should succeed */
      });
    };
    tryPlay();
    v.addEventListener("canplay", tryPlay);
    return () => v.removeEventListener("canplay", tryPlay);
  }, [src, useStill, reduce]);

  if (!show) {
    return <div className={cn("absolute inset-0 bg-bg", className)} />;
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-bg grain vignette", className)}>
      {useStill || reduce ? (
        <img
          src={filmFor(worldId).still}
          alt=""
          className={cn("h-full w-full object-cover", reduce ? "" : "kenburns")}
        />
      ) : (
        <video
          ref={aRef}
          key={src}
          src={src}
          muted
          playsInline
          autoPlay
          loop
          poster={still}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setUseStill(true)}
        />
      )}
    </div>
  );
}
