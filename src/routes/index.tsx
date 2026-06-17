import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { PhoneFrame } from "@/components/empowered/PhoneFrame";
import { SplashScreen } from "@/components/empowered/SplashScreen";
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

  if (loading) {
    return (
      <PhoneFrame>
        <LoadingScreen />
      </PhoneFrame>
    );
  }

  if (user) {
    // Signed in — the effect routes to the right place; show loading meanwhile
    return (
      <PhoneFrame>
        <LoadingScreen />
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="h-full animate-slide-up">
        <SplashScreen onContinue={() => navigate({ to: "/intro" })} />
      </div>
    </PhoneFrame>
  );
}
