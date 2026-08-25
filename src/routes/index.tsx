import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { PhoneFrame } from "@/components/empowered/PhoneFrame";
import { LandingPage } from "@/components/empowered/LandingPage";
import { useAuth } from "@/contexts/AuthContext";
import { DEMO_PERSONA_ID } from "@/services/demoAccounts";
import { hasSeenIntro } from "@/lib/introSeen";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user, profile, children, loading, startDemoSession } = useAuth();
  const navigate = useNavigate();
  // Redirect exactly once: object identities from the auth context can change
  // on every render, and re-firing navigate() loops the router.
  const redirected = useRef(false);

  // Auto-forward signed-in users
  useEffect(() => {
    if (loading || !user || redirected.current) return;
    if (profile?.role === "slp" || profile?.role === "teacher") {
      redirected.current = true;
      navigate({ to: "/slp" });
    } else if (profile && !profile.onboarded) {
      redirected.current = true;
      navigate({ to: hasSeenIntro() ? "/onboarding/profile" : "/intro" });
    } else if (profile?.onboarded) {
      redirected.current = true;
      navigate({ to: children.length > 1 ? "/select-child" : "/home" });
    }
  }, [loading, user, profile, children, navigate]);


  if (loading || user) {
    // Signed in (or still checking) — the effect routes to the right place
    return (
      <PhoneFrame>
        <div className="flex h-full items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-primary" aria-label="Loading" />
        </div>
      </PhoneFrame>
    );
  }

  // One click, straight into the live demo (the in-app demo bar
  // offers "Replay onboarding" and "Exit demo" from anywhere)
  function startDemo() {
    startDemoSession(DEMO_PERSONA_ID);
    navigate({ to: "/home" });
  }

  // Signed out — the public front door
  return (
    <LandingPage
      onLogin={() => navigate({ to: "/login" })}
      onDemo={startDemo}
    />
  );
}
