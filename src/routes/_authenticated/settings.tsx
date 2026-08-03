import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SettingsScreen } from "@/components/empowered/SettingsScreen";
import { ParentGate } from "@/components/empowered/ParentGate";
import { useAuth } from "@/contexts/AuthContext";
import { FEATURES } from "@/config/features";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isClinician = profile?.role === "slp" || profile?.role === "teacher";
  const home = isClinician ? "/slp" : "/home";
  const handleSettingsNavigate = (destination: string) => {
    if (destination === "paywall") navigate({ to: "/paywall" });
    if (destination === "home") navigate({ to: "/home" });
    if (destination === "slp") navigate({ to: "/slp" });
    if (destination === "retell-library") navigate({ to: "/retell-library" });
    if (destination === "terms") navigate({ to: "/terms" });
    if (destination === "privacy-policy" || destination === "privacy") navigate({ to: "/privacy" });
  };

  const screen = (
    <SettingsScreen onClose={() => navigate({ to: home })} onNavigate={handleSettingsNavigate} />
  );

  // Grown-Up Check is off for the web launch (FEATURES.parentGate);
  // it returns for app-store Kids Category builds.
  if (!FEATURES.parentGate || isClinician) {
    return screen;
  }

  return (
    <ParentGate
      message="Settings is for parents and caregivers."
      onCancel={() => navigate({ to: home })}
    >
      {screen}
    </ParentGate>
  );
}
