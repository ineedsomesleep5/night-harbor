import { useEffect, useRef } from "react";
import type { WorldId } from "@/content/types";

export function WorldMotion({ worldId }: { worldId: WorldId }) {
  if (worldId === "lookout") {
    return (
      <>
        <div className="ember-glow" aria-hidden />
        <div className="steam-rise" aria-hidden />
        <RainCanvas />
      </>
    );
  }
  if (worldId === "archipelago") {
    return (
      <>
        <div className="fog-sheet fog-a" aria-hidden />
        <div className="fog-sheet fog-b" aria-hidden />
        <div className="lantern-glow" aria-hidden />
      </>
    );
  }
  return (
    <>
      <div className="kitchen-pulse" aria-hidden />
      <DustCanvas />
    </>
  );
}

function RainCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const drops = Array.from({ length: 64 }, () => ({
      x: Math.random(),
      y: Math.random(),
      len: 0.018 + Math.random() * 0.04,
      speed: 0.0016 + Math.random() * 0.0032,
    }));
    const fit = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.floor(r.width * dpr));
      canvas.height = Math.max(1, Math.floor(r.height * dpr));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(214, 224, 232, 0.22)";
      ctx.lineWidth = Math.max(1, canvas.width / 900);
      ctx.lineCap = "round";
      for (const d of drops) {
        d.y += d.speed;
        if (d.y > 1.05) {
          d.y = -0.06;
          d.x = Math.random();
        }
        ctx.beginPath();
        ctx.moveTo(d.x * w, d.y * h);
        ctx.lineTo(d.x * w + w * 0.004, (d.y + d.len) * h);
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen" />;
}

function DustCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const motes = Array.from({ length: 28 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.00022,
      vy: -0.00012 - Math.random() * 0.00018,
      a: 0.12 + Math.random() * 0.22,
    }));
    const fit = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.floor(r.width * dpr));
      canvas.height = Math.max(1, Math.floor(r.height * dpr));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        if (m.y < -0.02) {
          m.y = 1.02;
          m.x = Math.random();
        }
        if (m.x < -0.02) m.x = 1.02;
        if (m.x > 1.02) m.x = -0.02;
        ctx.fillStyle = `rgba(232, 214, 176, ${m.a})`;
        ctx.beginPath();
        ctx.arc(m.x * w, m.y * h, m.r * (w / 720), 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen" />;
}
