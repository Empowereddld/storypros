const SKILL_BY_ID: Record<string, string> = {
  "story-01-dan-and-the-paper-cut": "Flexible Thinking",
  "story-02-darias-carnival-ticket": "Planning",
  "story-03-dan-joins-the-game": "Self-Control",
  "story-05-dan-and-darias-treasure-hunt": "Planning",
  "story-06-the-kite-in-the-tree": "Problem Solving",
  "story-07-the-sandcastle-and-the-wave": "Emotional Control",
};

export function skillLabel(story: { id: string }) {
  return SKILL_BY_ID[story.id] ?? "Working Memory";
}

const SETTING_BY_ID: Record<string, string> = {
  "story-01-dan-and-the-paper-cut": "At Home",
  "story-02-darias-carnival-ticket": "Social",
  "story-03-dan-joins-the-game": "Social",
  "story-04-daria-and-the-puzzle-piece": "At Home",
  "story-05-dan-and-darias-treasure-hunt": "Social",
  "story-06-the-kite-in-the-tree": "Social",
  "story-07-the-sandcastle-and-the-wave": "Social",
  "story-08-dan-talks-about-recess": "At School",
  "story-09-daria-asks-for-the-next-step": "At School",
  "story-10-dans-lunchroom-moment": "At School",
  "story-11-daria-asks-again": "At School",
};

export function settingLabel(story: { id: string; theme?: string }) {
  if (SETTING_BY_ID[story.id]) return SETTING_BY_ID[story.id];
  if (story.theme === "at-school") return "At School";
  if (story.theme === "at-home") return "At Home";
  return "Social";
}

export function BrainIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V15a3 3 0 0 0 3 3h1V4H9Z" />
      <path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V15a3 3 0 0 1-3 3h-1V4h0Z" />
    </svg>
  );
}

/** Level + setting + executive-functioning skill pill row. */
export function StoryMetaPills({
  story,
  className = "",
}: {
  story: { id: string; level: number; theme?: string };
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-primary">
        Level {story.level}
      </span>
      <span className="rounded-full bg-secondary/25 px-3 py-1 text-xs font-extrabold text-secondary-foreground">
        {settingLabel(story)}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-xs font-extrabold text-white">
        {skillLabel(story)}
      </span>
    </div>
  );
}
