import { useState, type ReactNode } from "react";
import childAvatar from "@/assets/child-avatar.png";
import { useAuth, type Child } from "@/contexts/AuthContext";
import type { DemoRole } from "@/services/demoAccounts";
import { cn } from "@/lib/utils";
import { isPremium } from "@/services/subscription";
import { createInviteCode } from "@/services/slp";
import { TactileButton } from "./TactileButton";
import { MiniPlane, Star } from "./StoryProsBrand";
import { ChevronRightIcon } from "./StoryProsUi";
import { FEATURES } from "@/config/features";

interface SettingsScreenProps {
  onClose: () => void;
  onNavigate?: (destination: string) => void;
}

type Section = "main" | "add-child" | "edit-child";

const DEMO_ROLE_OPTIONS: { role: DemoRole; label: string }[] = [
  { role: "parent", label: "Parent/Child" },
  { role: "slp", label: "SLP" },
  { role: "teacher", label: "Teacher" },
];

export function SettingsScreen({ onClose, onNavigate }: SettingsScreenProps) {
  const {
    profile,
    children,
    activeChild,
    setActiveChild,
    updateChild,
    addChild,
    signOut,
    setDemoRole,
  } = useAuth();

  const [section, setSection] = useState<Section>("main");
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState<number | null>(null);

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

  function handleDemoRoleSwitch(role: DemoRole) {
    setDemoRole(role);
    onNavigate?.(role === "parent" ? "home" : "slp");
  }

  if (section === "add-child") {
    return (
      <div className="relative flex h-full flex-col overflow-hidden bg-cream">
        <SettingsBackdrop />
        <Header title="Child Profile" onBack={() => setSection("main")} />

        <div className="relative z-10 flex-1 overflow-y-auto px-5 pb-5 pt-4 no-scrollbar">
          <section className="rounded-[30px] border border-accent/60 bg-card/92 p-5 text-center shadow-soft">
            <span className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-accent shadow-card">
              <img src={childAvatar} alt="" className="h-full w-full object-cover object-top" />
            </span>
            <h1 className="mt-4 font-display text-[30px] font-extrabold leading-none text-primary">
              Add a Story Pro
            </h1>
            <p className="mx-auto mt-2 max-w-[17rem] text-sm font-semibold leading-relaxed text-ink-soft">
              Create another child profile while keeping their progress separate and secure.
            </p>
          </section>

          <div className="mt-5 space-y-4">
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
              <div className="grid grid-cols-7 gap-1.5 pt-1">
                {[4, 5, 6, 7, 8, 9, 10].map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => setNewAge(age)}
                    className={cn(
                      "h-10 rounded-2xl text-sm font-extrabold transition-all",
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

            <div className="flex items-center gap-3 rounded-[24px] border border-accent/70 bg-accent/35 p-4 shadow-card">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card text-primary shadow-card">
                <ShieldIcon />
              </span>
              <div>
                <p className="text-sm font-extrabold text-primary">Safe and separate</p>
                <p className="mt-1 text-xs font-semibold leading-snug text-ink-soft">
                  Each child keeps their own level, settings, Coins, and progress.
                </p>
              </div>
            </div>
          </div>
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

  const parentName = profile?.displayName || "Camesha Russell";
  const parentEmail = profile?.email || "camesha.russell03@gmail.com";
  const membershipChild = activeChild ?? children[0] ?? null;
  const hasMembership = membershipChild ? isPremium(membershipChild.id) : false;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <header className="flex items-center justify-between gap-2 border-b border-border/70 bg-card px-5 py-3">
        <button
          onClick={onClose}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-accent/40"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            aria-hidden
          >
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="mx-auto w-full max-w-[840px] px-5 pb-16 pt-8 lg:px-8">
          <h1 className="font-display text-[30px] font-bold leading-tight text-primary lg:text-[34px]">
            Parent Settings
          </h1>
          <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">
            Manage your account, child profiles, and membership.
          </p>

          <SettingsSection title="Account">
            <RowButton
              onClick={() => onNavigate?.("account")}
              title={parentName}
              subtitle={parentEmail}
            />
          </SettingsSection>

          <SettingsSection title="Child profiles">
            {children.length === 0 ? (
              <RowButton
                onClick={() => setSection("add-child")}
                title="Ava"
                subtitle="Age 5 · Level 1"
                meta="Active"
              />
            ) : (
              children.map((child) => (
                <RowButton
                  key={child.id}
                  onClick={() => handleEditChild(child)}
                  title={child.name}
                  subtitle={`Age ${child.age ?? "-"} · Level ${child.currentLevel}`}
                  meta={activeChild?.id === child.id ? "Active" : undefined}
                />
              ))
            )}
            <RowButton
              onClick={() => setSection("add-child")}
              title="Add another child"
              accent
            />
          </SettingsSection>

          <SettingsSection title="Membership">
            <div className="flex items-center justify-between gap-4 px-4 py-4">
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-ink">
                  {hasMembership ? "Story Pros Membership" : "Free Plan"}
                </p>
                <p className="mt-0.5 text-[13px] text-ink-soft">
                  {hasMembership ? "Full story library" : "1 complete Story Pros story"}
                </p>
              </div>
              <button
                onClick={() => (onNavigate ? onNavigate("paywall") : onClose())}
                className="shrink-0 text-[14px] font-semibold text-primary underline-offset-4 hover:underline"
              >
                {hasMembership ? "Manage membership" : "Upgrade"}
              </button>
            </div>
          </SettingsSection>

          {FEATURES.slp && profile?.isDemo && (
            <SettingsSection title="Demo mode">
              <div className="px-4 py-4">
                <div className="flex gap-2">
                  {DEMO_ROLE_OPTIONS.map((option) => (
                    <button
                      key={option.role}
                      onClick={() => handleDemoRoleSwitch(option.role)}
                      className={cn(
                        "flex-1 rounded-lg border px-3 py-2 text-[13px] font-semibold transition-colors",
                        profile.role === option.role
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-ink-soft hover:bg-accent/30",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </SettingsSection>
          )}

          {FEATURES.slp && children.length > 0 && (
            <SettingsSection title="School or therapist access">
              {children.map((child) => (
                <SlpShareRow key={child.id} child={child} />
              ))}
            </SettingsSection>
          )}

          <SettingsSection title="Account & support">
            <RowButton onClick={() => onNavigate?.("security")} title="Password & security" />
            <RowButton onClick={() => onNavigate?.("privacy")} title="Privacy & data" />
            <RowButton onClick={() => onNavigate?.("support")} title="Help & support" />
            <RowButton onClick={() => onNavigate?.("terms")} title="Terms of Use" />
            <RowButton onClick={() => onNavigate?.("privacy-policy")} title="Privacy Policy" />
          </SettingsSection>

          <div className="mt-8 border-t border-border/70 pt-5">
            <button
              onClick={handleSignOut}
              className="text-[15px] font-semibold text-ink-soft transition-colors hover:text-primary"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-9">
      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
        {title}
      </h2>
      <div className="divide-y divide-border/70 overflow-hidden rounded-xl border border-border bg-card">
        {children}
      </div>
    </section>
  );
}

function RowButton({
  onClick,
  title,
  subtitle,
  meta,
  accent,
}: {
  onClick: () => void;
  title: string;
  subtitle?: string;
  meta?: string;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-accent/20"
    >
      <span className="min-w-0">
        <span
          className={cn(
            "block truncate text-[15px] font-semibold",
            accent ? "text-primary" : "text-ink",
          )}
        >
          {accent ? `+ ${title}` : title}
        </span>
        {subtitle && <span className="mt-0.5 block truncate text-[13px] text-ink-soft">{subtitle}</span>}
      </span>
      <span className="flex shrink-0 items-center gap-3">
        {meta && <span className="text-[12px] font-medium text-ink-soft">{meta}</span>}
        <ChevronRightIcon className="h-4 w-4 text-ink-soft" />
      </span>
    </button>
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
        <section className="flex items-center gap-4 rounded-[30px] border border-accent/60 bg-card/95 p-4 shadow-soft">
          <span className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-accent shadow-card">
            <img src={childAvatar} alt="" className="h-full w-full object-cover object-top" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
              Child profile
            </p>
            <h1 className="mt-1 truncate font-display text-[28px] font-extrabold leading-none text-primary">
              {child.name}
            </h1>
            <p className="mt-2 text-sm font-semibold text-ink-soft">
              Age {child.age ?? "-"} • Level {child.currentLevel}
            </p>
          </div>
        </section>

        {!isActive && (
          <button
            onClick={() => setActiveChild(child)}
            className="press-pop w-full rounded-3xl border border-primary/20 bg-primary/10 p-4 text-center text-sm font-extrabold text-primary shadow-card"
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

function PlusIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden
    >
      <path d="M12 3l7 3v5c0 4.5-2.8 8.2-7 10-4.2-1.8-7-5.5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SchoolIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      aria-hidden
    >
      <path d="M3 9l9-5 9 5-9 5-9-5z" strokeLinejoin="round" />
      <path d="M7 11.5v4.2c1.5 1.3 3.1 1.9 5 1.9s3.5-.6 5-1.9v-4.2" />
      <path d="M21 9v6" strokeLinecap="round" />
    </svg>
  );
}


function SettingsBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/10 to-accent/35" />
      <MiniPlane className="absolute right-8 top-32 h-9 w-9 rotate-12 text-secondary/75" />
      <Star className="absolute left-9 top-28 h-4 w-4 text-secondary/70 animate-sparkle" />
      <Star className="absolute right-16 bottom-36 h-4 w-4 text-primary/30 animate-sparkle" />
      <span className="absolute -right-8 top-44 h-16 w-28 rounded-t-[48px] rounded-bl-[48px] bg-accent/45" />
      <span className="absolute -left-10 bottom-16 h-14 w-32 rounded-t-[48px] rounded-br-[48px] bg-card/70" />
      <svg
        viewBox="0 0 180 80"
        className="absolute right-10 top-44 h-16 w-36 text-primary/20"
        fill="none"
      >
        <path
          d="M8 58c28-16 34-45 62-34 19 8 8 29-10 21-18-7-2-36 38-31 20 3 38 12 58 2"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="8 10"
        />
      </svg>
    </div>
  );
}

