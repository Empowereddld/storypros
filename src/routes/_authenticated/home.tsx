import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HomeDashboardScreen } from "@/components/empowered/HomeDashboardScreen";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/home")({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const { activeChild, children, signOut } = useAuth();
  const childName = activeChild?.name ?? children[0]?.name ?? "";

  return (
    <HomeDashboardScreen
      childName={childName}
      onReset={async () => {
        await signOut();
        navigate({ to: "/" });
      }}
      onNavigate={(dest, storyId) => {
        switch (dest) {
          case "story":
            if (storyId) navigate({ to: "/story/$storyId", params: { storyId } });
            break;
          case "map":
            navigate({ to: "/map" });
            break;
          case "achievements":
            navigate({ to: "/achievements" });
            break;
          case "settings":
            navigate({ to: "/settings" });
            break;
          case "shop":
            navigate({ to: "/shop" });
            break;
          case "dashboard":
            navigate({ to: "/dashboard" });
            break;
          case "library":
            navigate({ to: "/library" });
            break;
          case "home":
            navigate({ to: "/home" });
            break;
        }
      }}
    />
  );
}
