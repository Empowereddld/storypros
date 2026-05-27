import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { PhoneFrame } from "@/components/empowered/PhoneFrame";
import { SplashScreen } from "@/components/empowered/SplashScreen";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  // Auto-forward signed-in users
  useEffect(() => {
    if (loading || !user) return;
    if (profile?.role === "slp" || profile?.role === "teacher") {
      navigate({ to: "/slp" });
    } else if (profile && !profile.onboarded) {
      navigate({ to: "/onboarding/profile" });
    } else if (profile?.onboarded) {
      navigate({ to: "/home" });
    }
  }, [loading, user, profile, navigate]);

  if (loading) {
    return (
      <PhoneFrame>
        <div className="flex h-full items-center justify-center bg-cream">
          <span className="text-4xl animate-float">✈️</span>
        </div>
      </PhoneFrame>
    );
  }

  if (user) return <Navigate to="/home" />;

  return (
    <PhoneFrame>
      <div className="h-full animate-slide-up">
        <SplashScreen onContinue={() => navigate({ to: "/intro" })} />
      </div>
    </PhoneFrame>
  );
}
