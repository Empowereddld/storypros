import fs from "node:fs";
import path from "node:path";

// Kept outside the repo on purpose — never copied into a tracked file.
export const EXTERNAL_ENV_PATH =
  "C:\\Users\\Rovonn\\OneDrive\\Desktop\\Empowered Work\\Children Development App\\Voice Generations\\.env";

export function loadApiKey(root) {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;

  // repo-root .env.local is gitignored (see .gitignore's `*.local` rule) and takes
  // precedence over the external file if someone chooses to keep a local copy there.
  for (const candidate of [path.join(root, ".env.local"), EXTERNAL_ENV_PATH]) {
    if (!fs.existsSync(candidate)) continue;
    const raw = fs.readFileSync(candidate, "utf8");
    for (const rawLine of raw.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#") || !/api/i.test(line)) continue;
      const idx = line.indexOf("=");
      if (idx === -1) continue;
      const value = line
        .slice(idx + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      if (value) return value;
    }
  }
  return null;
}
