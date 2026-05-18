/* ─────────────────────────────────────────────
 * Auth Context
 * Manages authentication state, parent profile,
 * and child profiles. Wraps the whole app.
 *
 * For now: mock auth (localStorage-based).
 * When Supabase is connected on Lovable, swap
 * the mock functions for real Supabase calls.
 * ───────────────────────────────────────────── */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

// ── Types ──

export interface Profile {
  id: string;
  email: string;
  displayName: string;
  role: "parent" | "slp" | "teacher";
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
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updateProfile: (updates: Partial<Profile>) => void;
  updateChild: (childId: string, updates: Partial<Child>) => void;
  addChild: (name: string, age: number | null) => Child;
  markOnboarded: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// ── Storage keys ──

const STORAGE_KEY = "storypros_auth";

interface StoredAuth {
  user: { id: string; email: string };
  profile: Profile;
  children: Child[];
  activeChildId: string | null;
}

function loadStored(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveStored(data: StoredAuth) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clearStored() {
  localStorage.removeItem(STORAGE_KEY);
}

// ── Mock auth store (all accounts in one browser) ──

const ACCOUNTS_KEY = "storypros_accounts";

interface StoredAccount {
  email: string;
  password: string; // In production this is handled by Supabase, never stored client-side
  userId: string;
  profile: Profile;
  children: Child[];
}

function loadAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveAccount(account: StoredAccount) {
  const accounts = loadAccounts();
  const idx = accounts.findIndex((a) => a.email === account.email);
  if (idx >= 0) accounts[idx] = account;
  else accounts.push(account);
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

// ── Provider ──

export function AuthProvider({ children: childrenNodes }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [childProfiles, setChildProfiles] = useState<Child[]>([]);
  const [activeChild, setActiveChildState] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from storage on mount
  useEffect(() => {
    const stored = loadStored();
    if (stored) {
      setUser(stored.user);
      setProfile(stored.profile);
      setChildProfiles(stored.children);
      if (stored.activeChildId) {
        const child = stored.children.find((c) => c.id === stored.activeChildId);
        if (child) setActiveChildState(child);
      }
    }
    setLoading(false);
  }, []);

  // Persist on change
  const persist = useCallback(() => {
    if (user && profile) {
      saveStored({
        user,
        profile,
        children: childProfiles,
        activeChildId: activeChild?.id ?? null,
      });
      // Also update the accounts store
      saveAccount({
        email: user.email,
        password: "", // password already stored from signup
        userId: user.id,
        profile,
        children: childProfiles,
      });
    }
  }, [user, profile, childProfiles, activeChild]);

  useEffect(() => {
    if (user) persist();
  }, [user, profile, childProfiles, activeChild, persist]);

  const signUp = useCallback(async (email: string, password: string, displayName: string, role: Profile["role"] = "parent") => {
    // Check if account already exists
    const accounts = loadAccounts();
    if (accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())) {
      return { error: "An account with this email already exists" };
    }

    const userId = crypto.randomUUID();
    const newProfile: Profile = {
      id: userId,
      email,
      displayName,
      role,
      onboarded: false,
    };

    const account: StoredAccount = {
      email,
      password,
      userId,
      profile: newProfile,
      children: [],
    };
    saveAccount(account);

    setUser({ id: userId, email });
    setProfile(newProfile);
    setChildProfiles([]);
    setActiveChildState(null);

    return {};
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const accounts = loadAccounts();
    const account = accounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password,
    );

    if (!account) {
      return { error: "Invalid email or password" };
    }

    setUser({ id: account.userId, email: account.email });
    setProfile(account.profile);
    setChildProfiles(account.children);
    if (account.children.length > 0) {
      setActiveChildState(account.children[0]);
    }

    return { role: account.profile.role };
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    setProfile(null);
    setChildProfiles([]);
    setActiveChildState(null);
    clearStored();
  }, []);

  const resetPassword = useCallback(async (_email: string) => {
    // In mock auth, just return success
    // Real implementation: supabase.auth.resetPasswordForEmail(email)
    return {};
  }, []);

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setProfile((prev) => prev ? { ...prev, ...updates } : prev);
  }, []);

  const updateChild = useCallback((childId: string, updates: Partial<Child>) => {
    setChildProfiles((prev) =>
      prev.map((c) => (c.id === childId ? { ...c, ...updates } : c)),
    );
    setActiveChildState((prev) =>
      prev && prev.id === childId ? { ...prev, ...updates } : prev,
    );
  }, []);

  const addChild = useCallback((name: string, age: number | null): Child => {
    const child: Child = {
      id: crypto.randomUUID(),
      profileId: user?.id ?? "",
      name,
      age,
      currentLevel: 1,
      levelOverride: false,
      ttsSpeed: "normal",
      ttsAutoplay: false,
    };
    setChildProfiles((prev) => [...prev, child]);
    setActiveChildState(child);
    return child;
  }, [user]);

  const setActiveChild = useCallback((child: Child) => {
    setActiveChildState(child);
  }, []);

  const markOnboarded = useCallback(() => {
    setProfile((prev) => prev ? { ...prev, onboarded: true } : prev);
  }, []);

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
