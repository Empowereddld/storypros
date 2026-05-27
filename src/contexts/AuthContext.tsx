/* ─────────────────────────────────────────────
 * Auth Context — backed by Supabase
 * ───────────────────────────────────────────── */

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

// ── Types ──

export interface Profile {
  id: string;
  email: string;
  displayName: string;
  role: "parent" | "slp" | "teacher" | "admin";
  onboarded: boolean;
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

  // Initial session + listener
  useEffect(() => {
    let mounted = true;

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
    if (typeof window !== "undefined") localStorage.removeItem(ACTIVE_CHILD_KEY);
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
  }, [user]);

  const updateChild = useCallback(async (childId: string, updates: Partial<Child>) => {
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
  }, []);

  const addChild = useCallback(async (name: string, age: number | null): Promise<Child> => {
    if (!user) throw new Error("Not signed in");
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
  }, [user]);

  const setActiveChild = useCallback((child: Child) => {
    setActiveChildState(child);
    if (typeof window !== "undefined") localStorage.setItem(ACTIVE_CHILD_KEY, child.id);
  }, []);

  const markOnboarded = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .update({ onboarded: true })
      .eq("id", user.id)
      .select()
      .maybeSingle();
    if (data) setProfile(mapProfile(data as ProfileRow));
  }, [user]);

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
      }}
    >
      {childrenNodes}
    </AuthContext.Provider>
  );
}
