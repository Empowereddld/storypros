import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { StoryEngine } from "@/components/empowered/phases";
import { StoryErrorBoundary } from "@/components/empowered/ErrorBoundary";
import { getStory } from "@/services/stories";
import { canAccessStory } from "@/services/subscription";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/story/$storyId")({
  component: StoryPage,
});

function StoryPage() {
  const { storyId } = Route.useParams();
  const navigate = useNavigate();
  const { activeChild, children } = useAuth();
  const childId = activeChild?.id ?? children[0]?.id ?? "";
  const story = getStory(storyId);

  if (!story) {
    return <Navigate to="/home" />;
  }
  if (!canAccessStory(childId, storyId)) {
    return <Navigate to="/paywall" search={{ storyId }} />;
  }

  const finish = () => navigate({ to: "/home" });

  return (
    <StoryErrorBoundary onReset={finish} context="story-engine">
      <StoryEngine storyData={story} onFinish={finish} />
    </StoryErrorBoundary>
  );
}
