/* ─────────────────────────────────────────────
 * Auth Context — backed by Supabase
 * ───────────────────────────────────────────── */

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { setActiveProgressChild } from "@/services/progress";
import { hydrateOwnedFromCloud } from "@/services/shop";
import { hydrateSubscriptionsFromCloud } from "@/services/subscription";
import { getDemoPersona, seedDemoPersonaData, type DemoRole } from "@/services/demoAccounts";

// ── Types ──

export interface Profile {
  id: string;
  email: string;
  displayName: string;
  role: "parent" | "slp" | "teacher" | "admin";
  onboarded: boolean;
  /** True for canned demo personas — grants full navigation regardless of `role` (see _authenticated.tsx). */
  isDemo?: boolean;
}

export interface Child {
  id: string;
  profileId: string;
  name: string;
  age: number | null;
  currentLevel: number;
  levelOverride: boolean;
  ttsSpeed: "slow" | "normal" | "fast";
  ttsAutoplay: boolean;
}

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  children: Child[];
  activeChild: Child | null;
  setActiveChild: (child: Child) => void;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string, role?: Profile["role"]) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string; role?: Profile["role"] }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signInWithApple: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  updateChild: (childId: string, updates: Partial<Child>) => Promise<void>;
  addChild: (name: string, age: number | null) => Promise<Child>;
  markOnboarded: () => Promise<void>;
  /** Start a canned demo persona's session (no Supabase auth involved). */
  startDemoSession: (personaId: string, options?: { onboarding?: boolean }) => void;
  /** Switch which role a demo session previews (parent/child, SLP, teacher). No-op outside demo mode. */
  setDemoRole: (role: DemoRole) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// ── Row mappers ──

interface ProfileRow {
  id: string;
  email: string | null;
  display_name: string;
  role: string;
  onboarded: boolean;
}

interface ChildRow {
  id: string;
  profile_id: string;
  name: string;
  age: number | null;
  current_level: number;
  level_override: boolean;
  tts_speed: string;
  tts_autoplay: boolean;
}

function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email ?? "",
    displayName: row.display_name ?? "",
    role: (row.role as Profile["role"]) ?? "parent",
    onboarded: !!row.onboarded,
  };
}

function mapChild(row: ChildRow): Child {
  return {
    id: row.id,
    profileId: row.profile_id,
    name: row.name,
    age: row.age,
    currentLevel: row.current_level,
    levelOverride: row.level_override,
    ttsSpeed: (row.tts_speed as Child["ttsSpeed"]) ?? "normal",
    ttsAutoplay: !!row.tts_autoplay,
  };
}

const ACTIVE_CHILD_KEY = "storypros_active_child";
const DEMO_SESSION_KEY = "storypros_demo_session";

interface DemoSession {
  personaId: string;
  role: DemoRole;
  /** True = walk through onboarding from scratch (no child yet, onboarded=false) */
  onboarding?: boolean;
}

function loadDemoSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY);
    return raw ? (JSON.parse(raw) as DemoSession) : null;
  } catch {
    return null;
  }
}

function buildDemoAuthState(session: DemoSession) {
  const persona = getDemoPersona(session.personaId);
  if (!persona) return null;
  const user = { id: persona.id, email: persona.email };
  const profile: Profile = {
    id: persona.id,
    email: persona.email,
    displayName: persona.displayName,
    role: session.role,
    // Onboarding walkthrough starts un-onboarded with no children,
    // so admins experience the flow exactly as a new family does
    onboarded: !session.onboarding,
    isDemo: true,
  };
  if (session.onboarding) {
    return { user, profile, child: null as Child | null };
  }
  const child: Child = {
    id: persona.childId,
    profileId: persona.id,
    name: persona.childName,
    age: 6,
    currentLevel: 1,
    levelOverride: false,
    ttsSpeed: "normal",
    ttsAutoplay: false,
  };
  return { user, profile, child: child as Child | null };
}

// ── Provider ──

export function AuthProvider({ children: childrenNodes }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [childProfiles, setChildProfiles] = useState<Child[]>([]);
  const [activeChild, setActiveChildState] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);
  const pendingSignUpMetaRef = useRef<{ displayName: string; role: Profile["role"] } | null>(null);

  const loadProfileAndChildren = useCallback(async (userId: string, email: string) => {
    const [{ data: profileRow }, { data: childRows }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("children").select("*").eq("profile_id", userId).order("created_at", { ascending: true }),
    ]);

    let p: Profile | null = profileRow ? mapProfile(profileRow as ProfileRow) : null;

    // If signup just happened with extra metadata, patch the profile row
    if (p && pendingSignUpMetaRef.current) {
      const meta = pendingSignUpMetaRef.current;
      pendingSignUpMetaRef.current = null;
      if (meta.displayName && (!p.displayName || p.displayName !== meta.displayName)) {
        const { data: updated } = await supabase
          .from("profiles")
          .update({ display_name: meta.displayName, role: meta.role })
          .eq("id", userId)
          .select()
          .maybeSingle();
        if (updated) p = mapProfile(updated as ProfileRow);
      }
    }

    // Fallback: trigger may not have run yet (race), create profile row
    if (!p) {
      const { data: inserted } = await supabase
        .from("profiles")
        .insert({ id: userId, email, display_name: "", role: "parent" })
        .select()
        .maybeSingle();
      if (inserted) p = mapProfile(inserted as ProfileRow);
    }

    const kids = (childRows ?? []).map((r) => mapChild(r as ChildRow));
    setProfile(p);
    setChildProfiles(kids);

    // restore active child
    const storedId = typeof window !== "undefined" ? localStorage.getItem(ACTIVE_CHILD_KEY) : null;
    const found = storedId ? kids.find((c) => c.id === storedId) : null;
    setActiveChildState(found ?? kids[0] ?? null);
  }, []);

  // Keep the progress store scoped to the active child
  // (setActiveProgressChild also hydrates progress from the cloud)
  useEffect(() => {
    setActiveProgressChild(activeChild?.id);
    if (activeChild?.id) {
      void hydrateOwnedFromCloud(activeChild.id);
    }
  }, [activeChild?.id]);

  // Refresh subscription cache once the account's children are known
  useEffect(() => {
    if (childProfiles.length > 0) {
      void hydrateSubscriptionsFromCloud();
    }
  }, [childProfiles.length]);

  // Initial session + listener
  useEffect(() => {
    let mounted = true;

    // Restore a persisted demo session before touching Supabase at all.
    const demoSession = loadDemoSession();
    if (demoSession) {
      const restored = buildDemoAuthState(demoSession);
      if (restored) {
        setUser(restored.user);
        setProfile(restored.profile);
        setChildProfiles(restored.child ? [restored.child] : []);
        setActiveChildState(restored.child);
        setLoading(false);
        return () => { mounted = false; };
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const u = { id: session.user.id, email: session.user.email ?? "" };
        setUser(u);
        // defer DB calls to avoid deadlock inside the listener
        setTimeout(() => {
          void loadProfileAndChildren(u.id, u.email);
        }, 0);
      } else {
        setUser(null);
        setProfile(null);
        setChildProfiles([]);
        setActiveChildState(null);
      }
    });

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (data.session?.user) {
        const u = { id: data.session.user.id, email: data.session.user.email ?? "" };
        setUser(u);
        await loadProfileAndChildren(u.id, u.email);
      }
      setLoading(false);
    })();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfileAndChildren]);

  const signUp = useCallback<AuthContextType["signUp"]>(async (email, password, displayName, role = "parent") => {
    pendingSignUpMetaRef.current = { displayName, role };
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: displayName, role },
      },
    });
    if (error) {
      pendingSignUpMetaRef.current = null;
      return { error: error.message };
    }
    return {};
  }, []);

  const signIn = useCallback<AuthContextType["signIn"]>(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    // Profile load will be triggered by onAuthStateChange. Try to read role quickly:
    if (data.user) {
      const { data: row } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
      return { role: (row?.role as Profile["role"]) ?? "parent" };
    }
    return {};
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const { lovable } = await import("@/integrations/lovable");
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) return { error: result.error instanceof Error ? result.error.message : String(result.error) };
      return {};
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }, []);

  const signInWithApple = useCallback(async () => {
    try {
      const { lovable } = await import("@/integrations/lovable");
      const result = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: window.location.origin,
      });
      if (result.error) return { error: result.error instanceof Error ? result.error.message : String(result.error) };
      return {};
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      localStorage.removeItem(ACTIVE_CHILD_KEY);
      localStorage.removeItem(DEMO_SESSION_KEY);
    }
    setUser(null);
    setProfile(null);
    setChildProfiles([]);
    setActiveChildState(null);
  }, []);

  const startDemoSession = useCallback(
    (personaId: string, options?: { onboarding?: boolean }) => {
      const persona = getDemoPersona(personaId);
      if (!persona) return;
      const onboarding = options?.onboarding === true;
      if (!onboarding) {
        seedDemoPersonaData(persona);
      }
      const session: DemoSession = { personaId, role: "parent", onboarding };
      const built = buildDemoAuthState(session);
      if (!built) return;
      if (typeof window !== "undefined") {
        localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
      }
      setUser(built.user);
      setProfile(built.profile);
      setChildProfiles(built.child ? [built.child] : []);
      setActiveChildState(built.child);
    },
    [],
  );

  const setDemoRole = useCallback((role: DemoRole) => {
    setProfile((prev) => {
      if (!prev?.isDemo) return prev;
      const session = loadDemoSession();
      if (session && typeof window !== "undefined") {
        localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ ...session, role }));
      }
      return { ...prev, role };
    });
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { error: error.message };
    return {};
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return;
    // Demo sessions live entirely in memory/localStorage — no Supabase writes
    if (profile?.isDemo) {
      setProfile((prev) => (prev ? { ...prev, ...updates } : prev));
      return;
    }
    const payload: {
      display_name?: string;
      role?: string;
      onboarded?: boolean;
    } = {};
    if (updates.displayName !== undefined) payload.display_name = updates.displayName;
    if (updates.role !== undefined) payload.role = updates.role;
    if (updates.onboarded !== undefined) payload.onboarded = updates.onboarded;
    if (Object.keys(payload).length === 0) return;
    const { data } = await supabase.from("profiles").update(payload).eq("id", user.id).select().maybeSingle();
    if (data) setProfile(mapProfile(data as ProfileRow));
  }, [user, profile?.isDemo]);

  const updateChild = useCallback(async (childId: string, updates: Partial<Child>) => {
    // Demo sessions live entirely in memory/localStorage — no Supabase writes
    if (profile?.isDemo) {
      setChildProfiles((prev) => prev.map((c) => (c.id === childId ? { ...c, ...updates } : c)));
      setActiveChildState((prev) => (prev && prev.id === childId ? { ...prev, ...updates } : prev));
      return;
    }
    const payload: {
      name?: string;
      age?: number | null;
      current_level?: number;
      level_override?: boolean;
      tts_speed?: string;
      tts_autoplay?: boolean;
    } = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.age !== undefined) payload.age = updates.age;
    if (updates.currentLevel !== undefined) payload.current_level = updates.currentLevel;
    if (updates.levelOverride !== undefined) payload.level_override = updates.levelOverride;
    if (updates.ttsSpeed !== undefined) payload.tts_speed = updates.ttsSpeed;
    if (updates.ttsAutoplay !== undefined) payload.tts_autoplay = updates.ttsAutoplay;
    if (Object.keys(payload).length === 0) return;
    const { data } = await supabase.from("children").update(payload).eq("id", childId).select().maybeSingle();
    if (data) {
      const mapped = mapChild(data as ChildRow);
      setChildProfiles((prev) => prev.map((c) => (c.id === childId ? mapped : c)));
      setActiveChildState((prev) => (prev && prev.id === childId ? mapped : prev));
    }
  }, [profile?.isDemo]);

  const addChild = useCallback(async (name: string, age: number | null): Promise<Child> => {
    if (!user) throw new Error("Not signed in");
    // Demo sessions create children locally — no Supabase writes
    if (profile?.isDemo) {
      const child: Child = {
        id: `demo-child-${Date.now().toString(36)}`,
        profileId: user.id,
        name,
        age,
        currentLevel: 1,
        levelOverride: false,
        ttsSpeed: "normal",
        ttsAutoplay: false,
      };
      setChildProfiles((prev) => [...prev, child]);
      setActiveChildState(child);
      if (typeof window !== "undefined") localStorage.setItem(ACTIVE_CHILD_KEY, child.id);
      return child;
    }
    const { data, error } = await supabase
      .from("children")
      .insert({ profile_id: user.id, name, age })
      .select()
      .single();
    if (error || !data) throw new Error(error?.message ?? "Failed to add child");
    const mapped = mapChild(data as ChildRow);
    setChildProfiles((prev) => [...prev, mapped]);
    setActiveChildState(mapped);
    if (typeof window !== "undefined") localStorage.setItem(ACTIVE_CHILD_KEY, mapped.id);
    return mapped;
  }, [user, profile?.isDemo]);

  const setActiveChild = useCallback((child: Child) => {
    setActiveChildState(child);
    if (typeof window !== "undefined") localStorage.setItem(ACTIVE_CHILD_KEY, child.id);
  }, []);

  const markOnboarded = useCallback(async () => {
    if (!user) return;
    // Demo sessions flip the flag locally and persist it on the session
    if (profile?.isDemo) {
      setProfile((prev) => (prev ? { ...prev, onboarded: true } : prev));
      const session = loadDemoSession();
      if (session && typeof window !== "undefined") {
        localStorage.setItem(
          DEMO_SESSION_KEY,
          JSON.stringify({ ...session, onboarding: false }),
        );
      }
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .update({ onboarded: true })
      .eq("id", user.id)
      .select()
      .maybeSingle();
    if (data) setProfile(mapProfile(data as ProfileRow));
  }, [user, profile?.isDemo]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        children: childProfiles,
        activeChild,
        setActiveChild,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithApple,
        signOut,
        resetPassword,
        updateProfile,
        updateChild,
        addChild,
        markOnboarded,
        startDemoSession,
        setDemoRole,
      }}
    >
      {childrenNodes}
    </AuthContext.Provider>
  );
}
