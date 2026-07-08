import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SettingsScreen } from "@/components/empowered/SettingsScreen";
import { ParentGate } from "@/components/empowered/ParentGate";
import { useAuth } from "@/contexts/AuthContext";

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
  };

  // SLP/teacher accounts are adult-only — no gate needed
  if (isClinician) {
    return (
      <SettingsScreen onClose={() => navigate({ to: home })} onNavigate={handleSettingsNavigate} />
    );
  }

  return (
    <ParentGate
      message="Settings is for parents and caregivers."
      onCancel={() => navigate({ to: home })}
    >
      <SettingsScreen onClose={() => navigate({ to: home })} onNavigate={handleSettingsNavigate} />
    </ParentGate>
  );
}
