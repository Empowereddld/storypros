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
      <ParentDashboardScreen
        onClose={() => navigate({ to: "/home" })}
        onNavigate={(dest) => {
          switch (dest) {
            case "home": navigate({ to: "/home" }); break;
            case "library": navigate({ to: "/library" }); break;
            case "achievements": navigate({ to: "/achievements" }); break;
            case "settings": navigate({ to: "/settings" }); break;
            case "shop": navigate({ to: "/shop" }); break;
          }
        }}
      />
    </StoryErrorBoundary>
  );
}
