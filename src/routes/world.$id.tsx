import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { FilmStage } from "@/components/film-stage";
import { NightTray } from "@/components/night-tray";
import { worlds } from "@/content/worlds";
import type { WorldId } from "@/content/types";
import { rememberWorld } from "@/engine/memory";
import { atmosphere } from "@/engine/audio";
import { narrator } from "@/engine/voice";
import { useNight } from "@/engine/night-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/world/$id")({ component: WorldRoom });

function isWorld(id: string): id is WorldId {
  return id === "lookout" || id === "archipelago" || id === "house";
}

function WorldRoom() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const night = useNight();

  useEffect(() => {
    if (!isWorld(id)) {
      void nav({ to: "/" });
      return;
    }
    rememberWorld(id);
    try {
      window.speechSynthesis.getVoices();
    } catch {
      /* no speech */
    }
    atmosphere.unlock();
    narrator.unlock();
    return () => {
      useNight.getState().stop();
    };
  }, [id, nav]);

  if (!isWorld(id)) return null;
  const worldId: WorldId = id;
  const world = worlds[worldId];
  const hide = night.playing && !night.paused && !night.chromeVisible;

  return (
    <main
      className="relative min-h-dvh overflow-hidden bg-bg text-fg"
      onPointerDown={() => night.showChrome()}
    >
      <FilmStage worldId={worldId} />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-bg/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/5 bg-gradient-to-t from-bg via-bg/55 to-transparent" />

      <div className="relative z-20 flex min-h-dvh flex-col justify-between">
        <header
          className={cn(
            "flex items-start justify-between px-5 pt-6 transition-opacity duration-500",
            hide ? "pointer-events-none opacity-0" : "opacity-100",
          )}
        >
          <div>
            <Link to="/" className="text-xs uppercase tracking-[0.16em] text-muted hover:text-fg">
              Night Harbor
            </Link>
            <h1 className="font-display mt-1 text-3xl tracking-tight">{world.name}</h1>
            {worldId === "house" ? (
              <Link to="/house" className="mt-2 inline-block text-xs text-muted hover:text-fg">
                Tonight’s tokens
              </Link>
            ) : null}
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-6">
          {night.currentTitle ? (
            <p className="font-display text-center text-xl text-fg/75 transition-opacity duration-700">
              {night.currentTitle}
            </p>
          ) : null}
        </div>

        <div
          className={cn(
            "transition-opacity duration-500",
            hide ? "pointer-events-none opacity-0" : "opacity-100",
          )}
        >
          <NightTray
            playing={night.playing}
            paused={night.paused}
            speech={night.voiceVol}
            atmosphere={night.weatherVol}
            duration={night.duration}
            onToggle={() => {
              if (!night.playing) void night.begin(worldId);
              else if (night.paused) void night.resume();
              else void night.pause();
            }}
            onSpeech={(v) => night.setVoiceVol(v)}
            onAtmosphere={(v) => night.setWeatherVol(v)}
            onDuration={(d) => night.setDuration(d)}
          />
        </div>
      </div>
    </main>
  );
}
