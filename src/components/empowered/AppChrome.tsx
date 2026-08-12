/* ─────────────────────────────────────────────
 * App chrome for the website layout
 *
 * DesktopNav — top navigation shown on laptop-size
 * screens (lg+) when signed in. On tablets/phones the
 * screens keep their app-style bottom tabs + top-left
 * menu instead.
 *
 * DemoBanner — slim bar shown whenever a demo session
 * is active: restart the onboarding walkthrough or
 * exit the demo from anywhere.
 * ───────────────────────────────────────────── */

import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { StoryProsLogo } from "./StoryProsBrand";
import { HomeIcon, BookIcon, MapIcon, MedalIcon, CoinIcon } from "./StoryProsUi";
import { useLongPressSpeak } from "./SpeakButton";
import { getPaperPlanes } from "@/services/progress";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/home", label: "Home", icon: <HomeIcon className="h-7 w-7" /> },
  { to: "/library", label: "Stories", icon: <BookIcon className="h-7 w-7" /> },
  { to: "/map", label: "Map", icon: <MapIcon className="h-7 w-7" /> },
  { to: "/achievements", label: "Rewards", icon: <MedalIcon className="h-7 w-7" /> },
  // Review-period tab — remove before public launch
  { to: "/review", label: "Feedback", icon: <FeedbackIcon className="h-7 w-7" /> },
] as const;

function FeedbackIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path
        d="M21 11.5a8.5 8.5 0 01-8.5 8.5c-1.3 0-2.6-.3-3.7-.8L3 21l1.8-5.8A8.5 8.5 0 1121 11.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 10h8M8 13.5h5" strokeLinecap="round" />
    </svg>
  );
}

/** Icon-first nav link: large icon above a short word, long-press to hear it */
function NavLink({
  to,
  label,
  icon,
  active,
}: {
  to: string;
  label: string;
  icon: ReactNode;
  active: boolean;
}) {
  const press = useLongPressSpeak(label);
  return (
    <Link
      to={to}
      {...press.handlers}
      onClick={(event) => {
        if (press.didSpeak()) event.preventDefault();
      }}
      className={cn(
        "inline-flex min-h-[64px] min-w-[76px] flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-[13px] font-extrabold transition-all",
        active
          ? "bg-secondary text-secondary-foreground shadow-[0_3px_0_0_var(--secondary-deep)]"
          : "text-ink-soft hover:bg-accent/40 hover:text-primary",
      )}
    >
      {icon}
      {label}
    </Link>
  );
}

/** Top navigation for laptop-size screens (hidden below lg) */
export function DesktopNav() {
  const location = useLocation();
  // Coins live in a module-level store; re-read whenever it changes (child
  // switch, cloud hydration, in-activity rewards) so the chrome never shows
  // a stale total that disagrees with the home screen.
  const [planes, setPlanes] = useState(getPaperPlanes);
  useEffect(() => {
    const sync = () => setPlanes(getPaperPlanes());
    sync();
    window.addEventListener("storypros:progress-updated", sync);
    window.addEventListener("storypros:coin-earned", sync);
    return () => {
      window.removeEventListener("storypros:progress-updated", sync);
      window.removeEventListener("storypros:coin-earned", sync);
    };
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 hidden border-b border-accent/50 bg-card/90 backdrop-blur lg:block">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-6 px-6">
        <Link to="/home" aria-label="Story Pros home">
          <StoryProsLogo layout="row" size="sm" />
        </Link>

        <nav className="flex items-center gap-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              active={location.pathname.startsWith(item.to)}
            />
          ))}
        </nav>

        {/* Coins is the only number in the chrome; adult controls
            live behind the Grown-ups hold on the home screen. */}
        <Link
          to="/shop"
          aria-label={`${planes} coins — open shop`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-secondary/60 bg-secondary/25 px-4 py-2 text-sm font-extrabold text-secondary-foreground transition-transform active:scale-95"
        >
          <CoinIcon className="h-5 w-5" />
          {planes}
        </Link>
      </div>
    </header>
  );
}


/** Slim always-visible bar while a demo session is active */
export function DemoBanner() {
  const { profile, startDemoSession, signOut } = useAuth();
  const navigate = useNavigate();

  if (!profile?.isDemo) return null;

  async function exitDemo() {
    await signOut();
    navigate({ to: "/" });
  }

  function restartOnboarding() {
    startDemoSession(profile!.id, { onboarding: true });
    navigate({ to: "/intro" });
  }

  return (
    <div className="relative z-40 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-secondary px-3 py-1.5 text-secondary-foreground">
      <span className="text-xs font-extrabold uppercase tracking-wide">Demo mode</span>
      <button
        onClick={restartOnboarding}
        className="rounded-full bg-secondary-foreground/10 px-3 py-1 text-xs font-bold transition-colors hover:bg-secondary-foreground/20"
      >
        Replay onboarding
      </button>
      <button
        onClick={() => navigate({ to: "/review" })}
        className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-card transition-colors hover:bg-primary/90"
      >
        Give feedback
      </button>
      <button
        onClick={exitDemo}
        className="rounded-full bg-secondary-foreground/10 px-3 py-1 text-xs font-bold transition-colors hover:bg-secondary-foreground/20"
      >
        Exit demo
      </button>
    </div>
  );
}
