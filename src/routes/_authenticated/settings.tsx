import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SettingsScreen } from "@/components/empowered/SettingsScreen";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const home = profile?.role === "slp" || profile?.role === "teacher" ? "/slp" : "/home";
  return <SettingsScreen onClose={() => navigate({ to: home })} />;
}
