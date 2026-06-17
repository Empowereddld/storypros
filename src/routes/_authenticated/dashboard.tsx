import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ParentDashboardScreen } from "@/components/empowered/ParentDashboardScreen";
import { StoryErrorBoundary } from "@/components/empowered/ErrorBoundary";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  return (
    <StoryErrorBoundary onReset={() => navigate({ to: "/home" })} context="parent-dashboard">
      <ParentDashboardScreen onClose={() => navigate({ to: "/home" })} />
    </StoryErrorBoundary>
  );
}
