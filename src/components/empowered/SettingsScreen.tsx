import { useState, type ReactNode } from "react";
import { useAuth, type Child } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { getPaperPlanes } from "@/services/progress";
import {
  cancelSubscription,
  getChildSubscription,
  isPremium,
  PREMIUM_PRICE_DISPLAY,
  reactivateSubscription,
  type ChildSubscription,
} from "@/services/subscription";
import { createInviteCode } from "@/services/slp";
import { TactileButton } from "./TactileButton";
import { LockIcon, MiniPlane, StoryProsLogo } from "./StoryProsBrand";
import { ChevronRightIcon, PaperPlaneIcon } from "./StoryProsUi";

interface SettingsScreenProps {
  onClose: () => void;
}

type Section = "main" | "add-child" | "edit-child";

export function SettingsScreen({ onClose }: SettingsScreenProps) {
  const { profile, children, activeChild, setActiveChild, updateChild, addChild, signOut } =
    useAuth();

  const [section, setSection] = useState<Section>("main");
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState<number | null>(null);
  const paperPlanes = getPaperPlanes();

  function handleAddChild() {
    if (!newName.trim()) return;
    addChild(newName.trim(), newAge);
    setNewName("");
    setNewAge(null);
    setSection("main");
  }

  function handleEditChild(child: Child) {
    setEditingChild(child);
    setSection("edit-child");
  }

  async function handleSignOut() {
    await signOut();
    onClose();
  }

  if (section === "add-child") {
    return (
      <div className="relative flex h-full flex-col overflow-hidden bg-cream">
        <SettingsBackdrop />
        <Header title="Add a child" onBack={() => setSection("main")} />

        <div className="relative z-10 flex-1 px-5 pt-4 space-y-4">
          <FieldCard label="Child's name">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter name"
              className="w-full bg-transparent text-base font-semibold text-ink placeholder:text-ink-soft/60 focus:outline-none"
            />
          </FieldCard>

          <FieldCard label="Age">
            <div className="flex flex-wrap gap-2 pt-1">
              {[4, 5, 6, 7, 8, 9, 10].map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setNewAge(age)}
                  className={cn(
                    "h-11 w-11 rounded-2xl text-base font-bold transition-all",
                    newAge === age
                      ? "bg-primary text-primary-foreground shadow-[0_3px_0_0_var(--primary-deep)] -translate-y-0.5"
                      : "bg-card text-ink shadow-card hover:bg-sky/30",
                  )}
                >
                  {age}
                </button>
              ))}
            </div>
          </FieldCard>
        </div>

        <div className="relative z-10 px-5 pb-5">
          <TactileButton onClick={handleAddChild} disabled={!newName.trim()}>
            Add Child
          </TactileButton>
        </div>
      </div>
    );
  }

  if (section === "edit-child" && editingChild) {
    return (
      <EditChildSection
        child={editingChild}
        onBack={() => setSection("main")}
        onSave={(updates) => {
          updateChild(editingChild.id, updates);
          setSection("main");
        }}
      />
    );
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-cream">
      <SettingsBackdrop />

      <header className="relative z-30 flex items-center justify-between gap-2 px-5 pt-5">
        <button
          onClick={onClose}
          aria-label="Back"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-primary shadow-card transition-transform active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.7"
            aria-hidden
          >
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <StoryProsLogo layout="row" size="md" className="scale-90" />
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-primary shadow-card">
          <LockIcon className="h-5 w-5" />
        </span>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto px-5 pb-8 pt-6 no-scrollbar">
        <h1 className="font-display text-[38px] font-extrabold leading-none text-primary">
          Account Settings
        </h1>
        <p className="mt-3 max-w-[19rem] text-base font-semibold leading-relaxed text-ink-soft">
          Manage your account, preferences, and your child's experience.
        </p>

        <div className="mt-6 flex items-center gap-4 rounded-[1.75rem] border border-accent/60 bg-card/95 p-4 shadow-card">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-accent/70 text-3xl font-extrabold text-primary">
            {(profile?.displayName ?? "?").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xl font-extrabold text-primary">
              {profile?.displayName ?? "-"}
            </p>
            <p className="truncate text-sm font-semibold text-ink-soft">{profile?.email ?? "-"}</p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
              <LockIcon className="h-3.5 w-3.5" />
              {accountLabel(profile?.role)}
            </span>
          </div>
          <ChevronRightIcon className="h-6 w-6 shrink-0 text-primary" />
        </div>

        <div className="mt-5 space-y-5">
          <SettingsGroup title="Child Profiles">
            {children.map((child) => {
              const isActive = activeChild?.id === child.id;
              return (
                <button
                  key={child.id}
                  onClick={() => handleEditChild(child)}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-accent/30"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold",
                        isActive ? "bg-primary text-primary-foreground" : "bg-accent text-primary",
                      )}
                    >
                      {child.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 text-left">
                      <p className="truncate text-base font-extrabold text-primary">
                        {child.name}
                        {isActive && (
                          <span className="ml-2 text-xs font-semibold text-success">Active</span>
                        )}
                      </p>
                      <p className="text-xs font-semibold text-ink-soft">
                        Age {child.age ?? "-"} · Level {child.currentLevel}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {isActive && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary/20 px-2.5 py-1 text-sm font-extrabold text-secondary-foreground">
                        <PaperPlaneIcon className="h-4 w-4" />
                        {paperPlanes}
                      </span>
                    )}
                    <ChevronRightIcon className="h-5 w-5 text-ink-soft" />
                  </div>
                </button>
              );
            })}
            <button
              onClick={() => setSection("add-child")}
              className="flex w-full items-center gap-3 p-4 transition-colors hover:bg-accent/30"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/25 text-2xl font-extrabold text-secondary-foreground">
                +
              </span>
              <span className="text-sm font-extrabold text-primary">Add another child</span>
            </button>
          </SettingsGroup>

          <SettingsGroup title="Subscription">
            {children.map((child) => (
              <SubscriptionRow
                key={child.id}
                child={child}
                subscription={getChildSubscription(child.id)}
                hasPremium={isPremium(child.id)}
                onNavigatePaywall={onClose}
              />
            ))}
          </SettingsGroup>

          <SettingsGroup title="School Or Therapist Access">
            <p className="px-4 pt-4 text-xs font-semibold leading-relaxed text-ink-soft">
              Generate a code so a speech-language pathologist or teacher can follow progress. Codes
              expire after 7 days.
            </p>
            {children.map((child) => (
              <SlpShareRow key={child.id} child={child} />
            ))}
          </SettingsGroup>

          <div className="pt-1">
            <TactileButton variant="ghost" onClick={handleSignOut}>
              Log Out
            </TactileButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditChildSection({
  child,
  onBack,
  onSave,
}: {
  child: Child;
  onBack: () => void;
  onSave: (updates: Partial<Child>) => void;
}) {
  const { setActiveChild, activeChild } = useAuth();
  const [ttsSpeed, setTtsSpeed] = useState(child.ttsSpeed);
  const [levelOverride, setLevelOverride] = useState(child.levelOverride);
  const [overrideLevel, setOverrideLevel] = useState(child.currentLevel);

  function handleSave() {
    const updates: Partial<Child> = { ttsSpeed };
    if (levelOverride) {
      updates.levelOverride = true;
      updates.currentLevel = overrideLevel;
    } else {
      updates.levelOverride = false;
    }
    onSave(updates);
  }

  const isActive = activeChild?.id === child.id;

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-cream">
      <SettingsBackdrop />
      <Header title={child.name} onBack={onBack} />

      <div className="relative z-10 flex-1 overflow-y-auto px-5 pt-4 pb-5 space-y-5 no-scrollbar">
        {!isActive && (
          <button
            onClick={() => setActiveChild(child)}
            className="w-full rounded-3xl bg-primary/10 p-4 text-center text-sm font-extrabold text-primary shadow-card"
          >
            Switch to {child.name}
          </button>
        )}

        <SettingsGroup title="Profile">
          <SettingsRow label="Name" value={child.name} />
          <SettingsRow label="Age" value={child.age ? String(child.age) : "-"} />
          <SettingsRow label="Current level" value={String(child.currentLevel)} />
        </SettingsGroup>

        <SettingsGroup title="Read-To-Me Speed">
          <div className="flex gap-2 p-3">
            {(["slow", "normal", "fast"] as const).map((speed) => (
              <button
                key={speed}
                onClick={() => setTtsSpeed(speed)}
                className={cn(
                  "flex-1 rounded-2xl py-3 text-sm font-bold capitalize transition-all",
                  ttsSpeed === speed
                    ? "bg-primary text-primary-foreground shadow-[0_3px_0_0_var(--primary-deep)] -translate-y-0.5"
                    : "bg-accent/45 text-ink hover:bg-sky/40",
                )}
              >
                {speed}
              </button>
            ))}
          </div>
        </SettingsGroup>

        <SettingsGroup title="Level Placement">
          <div className="p-4 space-y-3">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={levelOverride}
                onChange={(e) => setLevelOverride(e.target.checked)}
                className="h-5 w-5 rounded accent-primary"
              />
              <span className="text-sm font-semibold text-ink">Override auto-placement</span>
            </label>
            {levelOverride && (
              <div className="flex gap-2 animate-slide-up">
                {[1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setOverrideLevel(lvl)}
                    className={cn(
                      "flex-1 rounded-2xl py-3 text-sm font-bold transition-all",
                      overrideLevel === lvl
                        ? "bg-secondary text-secondary-foreground shadow-[0_3px_0_0_var(--secondary-deep)] -translate-y-0.5"
                        : "bg-accent/45 text-ink hover:bg-sky/40",
                    )}
                  >
                    Level {lvl}
                  </button>
                ))}
              </div>
            )}
          </div>
        </SettingsGroup>
      </div>

      <div className="relative z-10 px-5 pb-5">
        <TactileButton onClick={handleSave}>Save Changes</TactileButton>
      </div>
    </div>
  );
}

function SubscriptionRow({
  child,
  subscription,
  hasPremium,
  onNavigatePaywall,
}: {
  child: Child;
  subscription: ChildSubscription;
  hasPremium: boolean;
  onNavigatePaywall: () => void;
}) {
  const [actionLoading, setActionLoading] = useState(false);
  const [, forceUpdate] = useState(0);

  async function handleCancel() {
    setActionLoading(true);
    await cancelSubscription(child.id);
    setActionLoading(false);
    forceUpdate((n) => n + 1);
  }

  async function handleReactivate() {
    setActionLoading(true);
    await reactivateSubscription(child.id);
    setActionLoading(false);
    forceUpdate((n) => n + 1);
  }

  const periodEnd = subscription.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-ink">{child.name}</p>
          <p className="mt-0.5 text-xs font-semibold leading-relaxed text-ink-soft">
            {hasPremium ? (
              <>
                <span className="font-bold text-success">Premium</span>
                {" · "}
                {PREMIUM_PRICE_DISPLAY}
                {subscription.cancelAtPeriodEnd && periodEnd && (
                  <span className="text-destructive"> · Cancels {periodEnd}</span>
                )}
                {!subscription.cancelAtPeriodEnd && periodEnd && <span> · Renews {periodEnd}</span>}
              </>
            ) : (
              <span>Free forever · 1 full story</span>
            )}
          </p>
        </div>
        {hasPremium ? (
          subscription.cancelAtPeriodEnd ? (
            <SmallActionButton onClick={handleReactivate} disabled={actionLoading}>
              {actionLoading ? "..." : "Reactivate"}
            </SmallActionButton>
          ) : (
            <SmallActionButton tone="danger" onClick={handleCancel} disabled={actionLoading}>
              {actionLoading ? "..." : "Cancel"}
            </SmallActionButton>
          )
        ) : (
          <SmallActionButton onClick={onNavigatePaywall}>Upgrade</SmallActionButton>
        )}
      </div>
    </div>
  );
}

function SlpShareRow({ child }: { child: Child }) {
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setBusy(true);
    setError("");
    const result = await createInviteCode(child.id);
    setBusy(false);
    if (result.code) setCode(result.code);
    else setError(result.error ?? "Something went wrong.");
  }

  async function handleCopy() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable in embedded previews.
    }
  }

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-extrabold text-ink">{child.name}</p>
        {code ? (
          <button
            onClick={handleCopy}
            className="rounded-2xl bg-primary/10 px-3 py-2 font-mono text-sm font-extrabold tracking-[0.2em] text-primary transition-colors hover:bg-primary/20"
            title="Tap to copy"
          >
            {copied ? "Copied" : code}
          </button>
        ) : (
          <SmallActionButton onClick={handleGenerate} disabled={busy}>
            {busy ? "..." : "Get Code"}
          </SmallActionButton>
        )}
      </div>
      {error && <p className="mt-1 text-xs font-semibold text-destructive">{error}</p>}
    </div>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="relative z-10 flex items-center gap-3 px-5 pt-5 pb-2">
      <button
        onClick={onBack}
        aria-label="Back"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-primary shadow-card"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.7"
          aria-hidden
        >
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h2 className="font-display text-2xl font-extrabold text-primary">{title}</h2>
    </div>
  );
}

function SettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 pl-1 text-xs font-extrabold uppercase tracking-wider text-ink-soft">
        {title}
      </h3>
      <div className="overflow-hidden rounded-[1.75rem] border border-accent/60 bg-card/95 shadow-card divide-y divide-accent/45">
        {children}
      </div>
    </section>
  );
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <span className="text-sm font-semibold text-ink-soft">{value}</span>
    </div>
  );
}

function FieldCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-[1.75rem] border border-accent/60 bg-card/95 p-4 shadow-card">
      <div className="mb-2 text-xs font-extrabold uppercase tracking-wider text-ink-soft">
        {label}
      </div>
      {children}
    </div>
  );
}

function SmallActionButton({
  children,
  disabled,
  onClick,
  tone = "primary",
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
  tone?: "primary" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "shrink-0 rounded-2xl px-3 py-2 text-xs font-extrabold transition-colors disabled:opacity-50",
        tone === "danger"
          ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
          : "bg-secondary/25 text-secondary-foreground hover:bg-secondary/35",
      )}
    >
      {children}
    </button>
  );
}

function SettingsBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/10 to-accent/35" />
      <MiniPlane className="absolute right-8 top-32 h-9 w-9 rotate-12 text-secondary/75" />
      <span className="absolute -right-16 top-44 h-40 w-40 rounded-full bg-accent/60 blur-2xl" />
      <span className="absolute -left-20 bottom-12 h-44 w-44 rounded-full bg-accent/45 blur-3xl" />
    </div>
  );
}

function accountLabel(role: string | undefined) {
  if (role === "slp") return "SLP Account";
  if (role === "teacher") return "Teacher Account";
  return "Parent Account";
}
