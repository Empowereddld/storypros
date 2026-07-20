/* ─────────────────────────────────────────────
 * Story Audio Lookup
 * Maps normalized narration text to a pre-generated ElevenLabs
 * narrator clip URL, keyed by content hash. Files that don't have
 * a generated clip yet simply resolve to null (caller falls back
 * to Web Speech TTS).
 * ───────────────────────────────────────────── */

const clipModules = import.meta.glob<string>("../assets/audio/*.mp3", {
  eager: true,
  query: "?url",
  import: "default",
});

const clipsById = new Map<string, string>();
for (const [filePath, url] of Object.entries(clipModules)) {
  const id = filePath
    .split("/")
    .pop()
    ?.replace(/\.mp3$/, "");
  if (id) clipsById.set(id, url);
}

function normalizeSpokenText(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

async function hashText(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-1", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

/** Look up the generated narrator clip URL for a line of story text, if one exists. */
export async function getClipUrl(text: string): Promise<string | null> {
  const normalized = normalizeSpokenText(text);
  if (!normalized) return null;
  const id = await hashText(normalized);
  return clipsById.get(id) ?? null;
}
