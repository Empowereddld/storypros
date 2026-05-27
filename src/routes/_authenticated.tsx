import { createFileRoute, Outlet, Navigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { PhoneFrame } from "@/components/empowered/PhoneFrame";
import { useAuth } from "@/contexts/AuthContext";
import { processExpiredSubscriptions } from "@/services/subscription";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    processExpiredSubscriptions();
  }, []);

  if (loading) {
    return (
      <PhoneFrame>
        <div className="flex h-full items-center justify-center bg-cream">
          <span className="text-4xl animate-float">✈️</span>
        </div>
      </PhoneFrame>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const path = location.pathname;
  const role = profile?.role;
  const isSlpRole = role === "slp" || role === "teacher";

  // SLPs/teachers go to /slp; redirect them off parent-only paths
  if (
    isSlpRole &&
    !path.startsWith("/slp") &&
    !path.startsWith("/settings") &&
    !path.startsWith("/dashboard")
  ) {
    return <Navigate to="/slp" />;
  }

  // Parents who haven't onboarded must finish onboarding first
  if (
    !isSlpRole &&
    profile &&
    !profile.onboarded &&
    !path.startsWith("/onboarding")
  ) {
    return <Navigate to="/onboarding/profile" />;
  }

  return (
    <PhoneFrame>
      <div key={path} className="h-full animate-slide-up">
        <Outlet />
      </div>
    </PhoneFrame>
  );
}
