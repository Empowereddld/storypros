import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LibraryScreen } from "@/components/empowered/LibraryScreen";

export const Route = createFileRoute("/_authenticated/library")({
  component: LibraryPage,
});

function LibraryPage() {
  const navigate = useNavigate();
  return (
    <LibraryScreen
      onClose={() => navigate({ to: "/home" })}
      onPlayStory={(storyId) => navigate({ to: "/story/$storyId", params: { storyId } })}
    />
  );
}
