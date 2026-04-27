import { TactileButton } from "./TactileButton";
import childAvatar from "@/assets/child-avatar.png";
import msLopez from "@/assets/ms-lopez.png";
import { cn } from "@/lib/utils";

interface AchievementGalleryScreenProps {
  childName: string;
  onClose: () => void;
}

interface Badge {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  tone: "sky" | "secondary" | "success" | "coral";
  unlocked: boolean;
}

const BADGES: Badge[] = [
  { id: "story", title: "Story Starter", subtitle: "Completed 5 stories", icon: "📖", tone: "sky", unlocked: true },
  { id: "vocab", title: "Vocab Voyager", subtitle: "Learned 50 words", icon: "🚀", tone: "secondary", unlocked: true },
  { id: "narrator", title: "Master Narrator", subtitle: "Reach Level 10", icon: "🎓", tone: "sky", unlocked: false },
  { id: "friend", title: "Friend Finder", subtitle: "Complete 3 group plays", icon: "👥", tone: "sky", unlocked: false },
];

export function AchievementGalleryScreen({ childName, onClose }: AchievementGalleryScreenProps) {
  return (
    <div className="flex h-full flex-col bg-cream">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-3 pb-3">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full text-primary hover:bg-primary/10"
          aria-label="Back"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" stroke="currentColor" strokeWidth="2.5" fill="none">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="flex-1 text-center font-display text-xl font-extrabold text-primary">
          My Achievements
        </h1>
        <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary/30 bg-sky">
          <img src={childAvatar} alt="" className="h-full w-full object-cover object-top scale-[1.6] translate-y-1" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-32">
        {/* Level card */}
        <section className="rounded-3xl bg-card p-4 shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                Current status
              </p>
              <p className="mt-0.5 text-lg font-extrabold text-primary">Level 4 — Wordsmith</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-secondary-foreground shadow-[0_3px_0_0_var(--secondary-deep)]">
              <span className="text-base">🪙</span>
              <span className="text-sm font-extrabold">145</span>
            </div>
          </div>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-cream-deep">
            <div className="h-full w-[60%] rounded-full bg-success" />
          </div>
          <div className="mt-2 flex justify-between text-xs font-bold">
            <span className="text-success">1,200 XP</span>
            <span className="text-ink-soft">2,000 XP for Level 5</span>
          </div>
        </section>

        {/* Coach speech bubble */}
        <section className="mt-5 flex items-end gap-2">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-coral/30">
            <img src={msLopez} alt="" className="h-full w-full object-cover object-top scale-[1.4] -translate-y-1" />
          </div>
          <div className="relative flex-1 rounded-2xl rounded-bl-sm bg-sky p-3 shadow-card">
            <p className="text-sm font-semibold leading-snug text-primary">
              Wow, {childName || "friend"}! You&rsquo;ve earned 12 badges already!
              Let&rsquo;s find more treasures.
            </p>
          </div>
        </section>

        {/* Milestones */}
        <SectionHeader icon="⭐" title="Milestones" />
        <div className="rounded-3xl bg-secondary p-4 shadow-[0_4px_0_0_var(--secondary-deep)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-2xl">🔥</div>
            <div className="flex-1">
              <p className="text-base font-extrabold text-secondary-foreground leading-tight">
                5 Days in a Row!
              </p>
              <p className="text-xs font-semibold text-secondary-foreground/80">
                Keep the streak going!
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-card/80 px-3 py-1.5">
              <span className="text-sm">🔥</span>
              <span className="text-sm font-extrabold text-secondary-foreground">5</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <SectionHeader icon="✨" title="My Badges" />
        <div className="grid grid-cols-2 gap-3">
          {BADGES.map((b) => (
            <BadgeCard key={b.id} badge={b} />
          ))}
        </div>

        <div className="mt-6">
          <TactileButton onClick={onClose}>Play to Earn More!</TactileButton>
          <p className="mt-3 text-center text-sm font-semibold text-ink-soft">
            You&rsquo;re doing amazing, {childName || "Champ"}!
          </p>
        </div>
      </div>

      {/* Bottom nav (decorative — just closes) */}
      <nav className="absolute bottom-0 left-0 right-0 flex items-center justify-around border-t border-border bg-card/95 px-2 pt-2 pb-4 backdrop-blur">
        {[
          { label: "Learn", icon: "📚" },
          { label: "Play", icon: "🎮" },
          { label: "Awards", icon: "🏅", active: true },
          { label: "Profile", icon: "👤" },
        ].map((tab) => (
          <button
            key={tab.label}
            onClick={onClose}
            className={cn(
              "flex flex-col items-center gap-1 rounded-2xl px-4 py-1.5 text-[11px] font-bold",
              tab.active ? "bg-primary text-primary-foreground" : "text-ink-soft",
            )}
          >
            <span className="text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="mt-6 mb-3 flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
        {icon}
      </span>
      <h2 className="text-base font-extrabold text-primary">{title}</h2>
    </div>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  const toneBg: Record<Badge["tone"], string> = {
    sky: "bg-sky",
    secondary: "bg-secondary",
    success: "bg-success/20",
    coral: "bg-coral/20",
  };
  return (
    <div
      className={cn(
        "rounded-3xl p-4 text-center transition-all",
        badge.unlocked ? "bg-card shadow-card" : "border-2 border-dashed border-cream-deep bg-cream/40",
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl",
          badge.unlocked ? toneBg[badge.tone] : "bg-cream-deep",
        )}
      >
        <span className={cn(badge.unlocked ? "" : "opacity-30")}>{badge.icon}</span>
        {!badge.unlocked && (
          <span className="absolute -mt-6 ml-8 flex h-5 w-5 items-center justify-center rounded-full bg-card text-xs">
            🔒
          </span>
        )}
      </div>
      <p className={cn("mt-3 text-sm font-extrabold leading-tight", badge.unlocked ? "text-primary" : "text-ink-soft")}>
        {badge.title}
      </p>
      <p className={cn("mt-1 text-xs font-semibold", badge.unlocked ? "text-ink-soft" : "text-ink-soft/70")}>
        {badge.subtitle}
      </p>
    </div>
  );
}
