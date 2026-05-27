import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PaywallScreen } from "@/components/empowered/PaywallScreen";
import { useAuth } from "@/contexts/AuthContext";
import { getStory } from "@/services/stories";

interface PaywallSearch {
  storyId?: string;
}

export const Route = createFileRoute("/_authenticated/paywall")({
  validateSearch: (search: Record<string, unknown>): PaywallSearch => ({
    storyId: typeof search.storyId === "string" ? search.storyId : undefined,
  }),
  component: PaywallPage,
});

function PaywallPage() {
  const navigate = useNavigate();
  const { storyId } = Route.useSearch();
  const { activeChild, children } = useAuth();
  const childId = activeChild?.id ?? children[0]?.id ?? "";
  const childName = activeChild?.name ?? children[0]?.name ?? "";
  const storyTitle = storyId ? getStory(storyId)?.title : undefined;

  return (
    <PaywallScreen
      childId={childId}
      childName={childName}
      storyTitle={storyTitle}
      onClose={() => navigate({ to: "/home" })}
      onSubscribed={() => navigate({ to: "/home" })}
    />
  );
}
