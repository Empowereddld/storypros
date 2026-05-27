import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlpDashboardScreen } from "@/components/empowered/SlpDashboardScreen";
import { StoryErrorBoundary } from "@/components/empowered/ErrorBoundary";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/slp")({
  component: SlpPage,
});

function SlpPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  return (
    <StoryErrorBoundary
      onReset={async () => {
        await signOut();
        navigate({ to: "/" });
      }}
      context="slp-dashboard"
    >
      <SlpDashboardScreen
        onClose={async () => {
          await signOut();
          navigate({ to: "/" });
        }}
      />
    </StoryErrorBoundary>
  );
}
