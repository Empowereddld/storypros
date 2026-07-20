/* ─────────────────────────────────────────────
 * Story image resolver
 * Maps a story's JSON image filenames (e.g. "slide-01.png",
 * "vocab-bandage.png") to real asset URLs, loaded per story
 * from src/assets/stories/<storyId>/<filename>.
 *
 * Drop a story's art into src/assets/stories/<story.id>/ and
 * it resolves automatically — no code change. Until then,
 * resolve returns null and screens show their placeholder.
 * ───────────────────────────────────────────── */

const modules = import.meta.glob("../assets/stories/**/*.{png,webp,jpg,jpeg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

// Key by "<storyId>/<filename>"
const byKey: Record<string, string> = {};
const MARKER = "/stories/";
for (const [path, url] of Object.entries(modules)) {
  const i = path.indexOf(MARKER);
  if (i === -1) continue;
  byKey[path.slice(i + MARKER.length)] = url;
}

/** Resolve a story image URL, or null if it hasn't been added yet. */
export function resolveStoryImage(storyId: string, filename?: string | null): string | null {
  if (!filename) return null;
  return byKey[`${storyId}/${filename}`] ?? null;
}
