/* ─────────────────────────────────────────────
 * Parent Settings Screen
 * Child profiles, TTS prefs, level override,
 * account settings, sign out.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { TactileButton } from "./TactileButton";
import { useAuth, type Child } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  getChildSubscription,
  isPremium,
  cancelSubscription,
  reactivateSubscription,
  PREMIUM_PRICE_DISPLAY,
  type ChildSubscription,
} from "@/services/subscription";

interface SettingsScreenProps {
  onClose: () => void;
}

type Section = "main" | "add-child" | "edit-child";

export function SettingsScreen({ onClose }: SettingsScreenProps) {
  const {
    profile,
    children,
    activeChild,
    setActiveChild,
    updateChild,
    addChild,
    signOut,
  } = useAuth();

  const [section, setSection] = useState<Section>("main");
  const [editingChild, setEditingChild] = useState<Child | null>(null);

  // Add child form state
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

  // ── Add child form ──
  if (section === "add-child") {
    return (
      <div className="flex h-full flex-col bg-cream">
        <Header title="Add a child" onBack={() => setSection("main")} />

        <div className="flex-1 px-5 pt-4 space-y-4">
          <FieldCard label="Child's name">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter name"
              className="w-full bg-transparent text-base text-ink placeholder:text-ink-soft/60 focus:outline-none"
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
                      : "bg-cream-deep text-ink hover:bg-sky/60",
                  )}
                >
                  {age}
                </button>
              ))}
            </div>
          </FieldCard>
        </div>

        <div className="px-5 pb-5">
          <TactileButton onClick={handleAddChild} disabled={!newName.trim()}>
            Add child
          </TactileButton>
        </div>
      </div>
    );
  }

  // ── Edit child form ──
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

  // ── Main settings ──
  return (
    <div className="flex h-full flex-col bg-cream">
      <Header title="Settings" onBack={onClose} />

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-5 space-y-5 no-scrollbar">
        {/* Account */}
        <SettingsGroup title="Account">
          <SettingsRow label="Name" value={profile?.displayName ?? "—"} />
          <SettingsRow label="Email" value={profile?.email ?? "—"} />
        </SettingsGroup>

        {/* Children */}
        <SettingsGroup title="Children">
          {children.map((child) => {
            const isActive = activeChild?.id === child.id;
            return (
              <button
                key={child.id}
                onClick={() => handleEditChild(child)}
                className="flex w-full items-center justify-between rounded-2xl p-3 hover:bg-cream-deep/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-cream-deep text-ink-soft",
                    )}
                  >
                    {child.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-bold text-primary">
                      {child.name}
                      {isActive && (
                        <span className="ml-2 text-xs font-semibold text-success">Active</span>
                      )}
                    </p>
                    <p className="text-xs text-ink-soft">
                      Age {child.age ?? "—"} · Level {child.currentLevel}
                    </p>
                  </div>
                </div>
                <span className="text-ink-soft text-sm">›</span>
              </button>
            );
          })}
          <button
            onClick={() => setSection("add-child")}
            className="flex w-full items-center gap-3 rounded-2xl p-3 hover:bg-cream-deep/60 transition-colors"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/30 text-lg">
              +
            </span>
            <span className="text-sm font-bold text-primary">Add another child</span>
          </button>
        </SettingsGroup>

        {/* Subscriptions per child */}
        <SettingsGroup title="Subscriptions">
          {children.map((child) => {
            const sub = getChildSubscription(child.id);
            const hasPremium = isPremium(child.id);
            return (
              <SubscriptionRow
                key={child.id}
                child={child}
                subscription={sub}
                hasPremium={hasPremium}
                onNavigatePaywall={() => {
                  // Let parent component handle paywall navigation
                  onClose();
                }}
              />
            );
          })}
        </SettingsGroup>

        {/* Sign out */}
        <div className="pt-2">
          <TactileButton variant="ghost" onClick={handleSignOut}>
            Sign out
          </TactileButton>
        </div>
      </div>
    </div>
  );
}

// ── Edit child sub-screen ──

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
    <div className="flex h-full flex-col bg-cream">
      <Header title={child.name} onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-5 space-y-5 no-scrollbar">
        {/* Switch active child */}
        {!isActive && (
          <button
            onClick={() => setActiveChild(child)}
            className="w-full rounded-2xl bg-primary/10 p-3 text-center text-sm font-bold text-primary"
          >
            Switch to {child.name}
          </button>
        )}

        {/* Info */}
        <SettingsGroup title="Profile">
          <SettingsRow label="Name" value={child.name} />
          <SettingsRow label="Age" value={child.age ? String(child.age) : "—"} />
          <SettingsRow label="Current level" value={String(child.currentLevel)} />
        </SettingsGroup>

        {/* TTS Speed */}
        <SettingsGroup title="Read-to-me speed">
          <div className="flex gap-2 p-2">
            {(["slow", "normal", "fast"] as const).map((speed) => (
              <button
                key={speed}
                onClick={() => setTtsSpeed(speed)}
                className={cn(
                  "flex-1 rounded-2xl py-3 text-sm font-bold capitalize transition-all",
                  ttsSpeed === speed
                    ? "bg-primary text-primary-foreground shadow-[0_3px_0_0_var(--primary-deep)] -translate-y-0.5"
                    : "bg-cream-deep text-ink hover:bg-sky/60",
                )}
              >
                {speed}
              </button>
            ))}
          </div>
        </SettingsGroup>

        {/* Level override */}
        <SettingsGroup title="Level placement">
          <div className="p-3 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={levelOverride}
                onChange={(e) => setLevelOverride(e.target.checked)}
                className="h-5 w-5 rounded accent-primary"
              />
              <span className="text-sm font-semibold text-ink">
                Override auto-placement
              </span>
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
                        : "bg-cream-deep text-ink hover:bg-sky/60",
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

      <div className="px-5 pb-5">
        <TactileButton onClick={handleSave}>Save changes</TactileButton>
      </div>
    </div>
  );
}

// ── Subscription row ──

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
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-ink">{child.name}</p>
          <p className="text-xs text-ink-soft">
            {hasPremium ? (
              <>
                <span className="text-success font-semibold">Premium</span>
                {" · "}
                {PREMIUM_PRICE_DISPLAY}
                {subscription.cancelAtPeriodEnd && periodEnd && (
                  <span className="text-destructive"> · Cancels {periodEnd}</span>
                )}
                {!subscription.cancelAtPeriodEnd && periodEnd && (
                  <span> · Renews {periodEnd}</span>
                )}
              </>
            ) : (
              <span className="text-ink-soft">Free tier</span>
            )}
          </p>
        </div>
        <div>
          {hasPremium ? (
            subscription.cancelAtPeriodEnd ? (
              <button
                onClick={handleReactivate}
                disabled={actionLoading}
                className="rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/20"
              >
                {actionLoading ? "..." : "Reactivate"}
              </button>
            ) : (
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="rounded-xl bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive transition-colors hover:bg-destructive/20"
              >
                {actionLoading ? "..." : "Cancel"}
              </button>
            )
          ) : (
            <button
              onClick={onNavigatePaywall}
              className="rounded-xl bg-secondary/20 px-3 py-1.5 text-xs font-bold text-secondary-foreground transition-colors hover:bg-secondary/30"
            >
              Upgrade
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Shared UI pieces ──

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 px-5 pt-4 pb-2">
      <button
        onClick={onBack}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-card text-primary"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h2 className="font-display text-xl font-extrabold text-primary">{title}</h2>
    </div>
  );
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-soft">{title}</h3>
      <div className="rounded-3xl bg-card shadow-card divide-y divide-cream-deep">
        {children}
      </div>
    </div>
  );
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <span className="text-sm text-ink-soft">{value}</span>
    </div>
  );
}

function FieldCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-card p-4 shadow-card">
      <div className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-2">
        {label}
      </div>
      {children}
    </div>
  );
