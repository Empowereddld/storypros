import { createFileRoute, Outlet, Navigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { PhoneFrame } from "@/components/empowered/PhoneFrame";
import { DesktopNav, DemoBanner } from "@/components/empowered/AppChrome";
import { LoadingScreen } from "@/components/empowered/StateScreens";
import { useAuth } from "@/contexts/AuthContext";
import { processExpiredSubscriptions } from "@/services/subscription";
import { hasSeenIntro } from "@/lib/introSeen";

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
        <LoadingScreen />
      </PhoneFrame>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const path = location.pathname;
  const role = profile?.role;
  const isSlpRole = role === "slp" || role === "teacher";
  // Demo accounts bypass gating the same way admins do, regardless of which
  // role they're currently previewing (see AuthContext's setDemoRole).
  const isAdmin = role === "admin" || profile?.isDemo === true;

  // Admins (and demo accounts) bypass all role / onboarding gating — free to browse any page
  if (!isAdmin) {
    // SLPs/teachers go to /slp; redirect them off parent-only paths
    if (
      isSlpRole &&
      !path.startsWith("/slp") &&
      !path.startsWith("/settings") &&
      !path.startsWith("/dashboard")
    ) {
      return <Navigate to="/slp" />;
    }

    // Parents who haven't onboarded must finish onboarding first —
    // starting with the four child-friendly intro screens at /intro.
    if (!isSlpRole && profile && !profile.onboarded && !path.startsWith("/onboarding")) {
      return <Navigate to={hasSeenIntro() ? "/onboarding/profile" : "/intro"} />;
    }
  }

  // Onboarding is a focused flow — hide the full app navigation there.
  const isOnboarding = path.startsWith("/onboarding");

  // Website layout: full-bleed canvas. Laptop (lg+) gets a top nav;
  // tablets/phones keep the screens' own bottom tabs + top-left menu.
  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-gradient-to-b from-white via-accent/20 to-accent/45">
      <DemoBanner />
      {!isOnboarding && <DesktopNav />}

      <div className="relative flex-1 overflow-y-auto no-scrollbar">
        <div className="relative mx-auto h-full w-full lg:max-w-5xl">
          <div key={path} className="h-full animate-slide-up">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
