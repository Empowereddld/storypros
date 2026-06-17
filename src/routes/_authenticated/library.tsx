import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LibraryScreen } from "@/components/empowered/LibraryScreen";

export const Route = createFileRoute("/_authenticated/library")({
  component: LibraryPage,
});

function LibraryPage() {
  const navigate = useNavigate();
  return (
    <LibraryScreen
      onNavigate={(dest, storyId) => {
        switch (dest) {
          case "story":
            if (storyId) navigate({ to: "/story/$storyId", params: { storyId } });
            break;
          case "home":
            navigate({ to: "/home" });
            break;
          case "map":
            navigate({ to: "/map" });
            break;
          case "shop":
            navigate({ to: "/shop" });
            break;
          case "achievements":
            navigate({ to: "/achievements" });
            break;
          case "settings":
            navigate({ to: "/settings" });
            break;
          case "dashboard":
            navigate({ to: "/dashboard" });
            break;
          case "library":
            navigate({ to: "/library" });
            break;
        }
      }}
    />
  );
}
