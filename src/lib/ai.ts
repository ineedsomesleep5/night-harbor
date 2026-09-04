import { createServerFn } from "@tanstack/react-start";
import { HOUSE_SYSTEM_PROMPT } from "@/engine/house";
import { videoRecipes } from "@/content/recipes";
import type { HouseTokens, WorldId } from "@/content/types";

export const generateHouseSceneFn = createServerFn({ method: "POST" })
  .validator((input: { tokens: HouseTokens; fragments: string[] }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "unavailable" };
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 500,
        messages: [
          { role: "system", content: HOUSE_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Indoor weather fragments (use at most two):\n- ${data.fragments.slice(0, 4).join("\n- ")}`,
          },
        ],
      }),
    });
    if (!res.ok) return { ok: false as const, error: `xAI ${res.status}` };
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (text.length < 80) return { ok: false as const, error: "short" };
    return { ok: true as const, text };
  });

export const speakSceneFn = createServerFn({ method: "POST" })
  .validator((input: { text: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "unavailable" };
    const clip = data.text.slice(0, 1800);
    const res = await fetch("https://api.x.ai/v1/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ text: clip, voice_id: "eve" }),
    });
    if (!res.ok) return { ok: false as const, error: `tts ${res.status}` };
    const buf = Buffer.from(await res.arrayBuffer());
    return { ok: true as const, audio: `data:audio/mpeg;base64,${buf.toString("base64")}` };
  });

export const remakeFilmFn = createServerFn({ method: "POST" })
  .validator((input: { worldId: WorldId }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "unavailable" };
    const recipe = videoRecipes[data.worldId];
    const res = await fetch("https://api.x.ai/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-imagine-image",
        prompt: recipe.stillPrompt,
        n: 1,
      }),
    });
    if (!res.ok) return { ok: false as const, error: `imagine ${res.status}` };
    const body = (await res.json()) as { data?: { url?: string; b64_json?: string }[] };
    const url = body.data?.[0]?.url;
    const b64 = body.data?.[0]?.b64_json;
    if (url) return { ok: true as const, kind: "url" as const, url };
    if (b64) return { ok: true as const, kind: "b64" as const, url: `data:image/png;base64,${b64}` };
    return { ok: false as const, error: "empty" };
  });
