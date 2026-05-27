import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AchievementGalleryScreen } from "@/components/empowered/AchievementGalleryScreen";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/achievements")({
  component: AchievementsPage,
});

function AchievementsPage() {
  const navigate = useNavigate();
  const { activeChild, children } = useAuth();
  const childName = activeChild?.name ?? children[0]?.name ?? "";
  return (
    <AchievementGalleryScreen
      childName={childName}
      onClose={() => navigate({ to: "/home" })}
    />
  );
}
