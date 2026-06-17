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

  // SLP/teacher accounts are adult-only — no gate needed
  if (isClinician) {
    return <SettingsScreen onClose={() => navigate({ to: home })} />;
  }

  return (
    <ParentGate
      message="Settings is for parents and caregivers."
      onCancel={() => navigate({ to: home })}
    >
      <SettingsScreen onClose={() => navigate({ to: home })} />
    </ParentGate>
  );
}
