import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { PhoneFrame } from "@/components/empowered/PhoneFrame";
import { LandingPage } from "@/components/empowered/LandingPage";
import { LoadingScreen } from "@/components/empowered/StateScreens";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user, profile, children, loading } = useAuth();
  const navigate = useNavigate();

  // Auto-forward signed-in users
  useEffect(() => {
    if (loading || !user) return;
    if (profile?.role === "slp" || profile?.role === "teacher") {
      navigate({ to: "/slp" });
    } else if (profile && !profile.onboarded) {
      navigate({ to: "/onboarding/profile" });
    } else if (profile?.onboarded) {
      navigate({ to: children.length > 1 ? "/select-child" : "/home" });
    }
  }, [loading, user, profile, children, navigate]);

  if (loading || user) {
    // Signed in (or still checking) — the effect routes to the right place
    return (
      <PhoneFrame>
        <LoadingScreen />
      </PhoneFrame>
    );
  }

  // Signed out — the public front door
  return (
    <LandingPage
      onGetStarted={() => navigate({ to: "/signup" })}
      onLogin={() => navigate({ to: "/login" })}
      onDemo={() => navigate({ to: "/demo" })}
    />
  );
}
