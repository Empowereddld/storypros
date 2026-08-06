/**
 * Story Pros badge visual system.
 *
 * One rounded shield silhouette, three states:
 *  - "earned": purple shield with gold trim, full colour
 *  - "next":   purple shield, no gold trim, soft glow ring — the goal to work toward
 *  - "locked": muted lavender/grey shield with a small padlock
 */
import { cn } from "@/lib/utils";

export type BadgeState = "earned" | "next" | "locked";

const STROKE = {
  stroke: "white",
  strokeWidth: 3.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

/** Centre glyph per badge, matching its name/story. */
function BadgeGlyph({ badgeId }: { badgeId: string }) {
  switch (badgeId) {
    case "badge-first-story": // First Flight — paper plane
      return <path d="M74 30 30 52l18 6 6 18 20-46Z" {...STROKE} />;
    case "badge-3-stories": // Frequent Flyer — three chevrons
      return <path d="M36 38 52 50 68 38M36 50 52 62 68 50M36 62 52 74 68 62" {...STROKE} />;
    case "badge-perfect": // Strong Finish — check inside a ring
      return (
        <>
          <circle cx="52" cy="54" r="19" {...STROKE} />
          <path d="M43 54l7 7 13-14" {...STROKE} />
        </>
      );
    case "badge-5-streak": // Five days — flame
      return (
        <path
          d="M52 32c-4 9-15 13-15 26a15 15 0 0 0 30 0c0-6-3-10-5-13 1 5-2 9-5 9-4 0-6-4-5-9-3 3-5 7-5 11"
          {...STROKE}
        />
      );
    case "badge-all-elements": // Story Master — crown
      return <path d="M34 66 30 42l13 11 9-17 9 17 13-11-4 24Z" {...STROKE} />;
    case "badge-level-2": // Level Up — upward steps
      return <path d="M34 68h11V56h11V44h12M64 44l-5-5M64 44l-5 5" {...STROKE} />;
    case "badge-all-stories": // Story Explorer — compass
      return (
        <>
          <circle cx="52" cy="54" r="20" {...STROKE} />
          <path d="M61 45l-6 15-14 4 6-15Z" {...STROKE} />
        </>
      );
    default:
      return <path d="m52 36 6 13 14 2-10 10 3 14-13-7-13 7 3-14-10-10 14-2Z" {...STROKE} />;
  }
}

export function RewardBadgeArt({
  badgeId,
  state,
  className,
}: {
  badgeId: string;
  state: BadgeState;
  className?: string;
}) {
  const gid = (label: string) => `rb-${label}-${badgeId}-${state}`;
  const muted = state === "locked";

  return (
    <div className={cn("relative", className)}>
      <svg viewBox="0 0 104 116" className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={gid("body")} x1="20" y1="6" x2="84" y2="108">
            {muted ? (
              <>
                <stop offset="0" stopColor="#dcd6ea" />
                <stop offset="1" stopColor="#b3aac6" />
              </>
            ) : (
              <>
                <stop offset="0" stopColor="#8c5ce0" />
                <stop offset="1" stopColor="#4a1a8c" />
              </>
            )}
          </linearGradient>
          <linearGradient id={gid("trim")} x1="16" y1="8" x2="88" y2="110">
            <stop offset="0" stopColor="#ffe38f" />
            <stop offset="1" stopColor="#e0a52a" />
          </linearGradient>
        </defs>

        {/* Gold trim only for earned badges */}
        {state === "earned" && (
          <path
            d="M52 4 96 18v42c0 26-18 43-44 52C26 103 8 86 8 60V18L52 4Z"
            fill={`url(#${gid("trim")})`}
          />
        )}

        <path
          d="M52 10 90 22v38c0 23-16 38-38 46C30 98 14 83 14 60V22L52 10Z"
          fill={`url(#${gid("body")})`}
          stroke={state === "next" ? "#e0a52a" : "white"}
          strokeWidth={state === "next" ? 3 : 2}
          strokeOpacity={muted ? 0.5 : 0.85}
        />
        <path
          d="M52 16 84 26v34c0 20-13 33-32 40-19-7-32-20-32-40V26L52 16Z"
          fill="white"
          opacity={muted ? 0.1 : 0.14}
        />
        <g opacity={muted ? 0.55 : 1}>
          <BadgeGlyph badgeId={badgeId} />
        </g>
      </svg>

      {state === "locked" && (
        <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-card text-primary/70 shadow-card">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            aria-hidden
          >
            <rect x="5" y="10" width="14" height="10" rx="2.5" />
            <path d="M8 10V8a4 4 0 018 0v2" strokeLinecap="round" />
          </svg>
        </span>
      )}
    </div>
  );
}
