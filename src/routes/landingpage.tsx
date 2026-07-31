import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LandingPage } from "@/components/empowered/LandingPage";
import { useAuth } from "@/contexts/AuthContext";
import { DEMO_PERSONA_ID } from "@/services/demoAccounts";

export const Route = createFileRoute("/landingpage")({
  head: () => ({
    meta: [
      { title: "Story Pros — Language Learning Through Stories" },
      {
        name: "description",
        content:
          "Story Pros helps children ages 5–12 understand, retell, and connect through interactive stories with Dan and Daria.",
      },
      { property: "og:title", content: "Story Pros — Language Learning Through Stories" },
      {
        property: "og:description",
        content:
          "Interactive stories that build comprehension, retelling, and expression for children ages 5–12.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPageRoute,
});

function LandingPageRoute() {
  const { startDemoSession } = useAuth();
  const navigate = useNavigate();

  return (
    <LandingPage
      onGetStarted={() => navigate({ to: "/signup" })}
      onLogin={() => navigate({ to: "/login" })}
      onDemo={() => {
        startDemoSession(DEMO_PERSONA_ID);
        navigate({ to: "/home" });
      }}
    />
  );
}
