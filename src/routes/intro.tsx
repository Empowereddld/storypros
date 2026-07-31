import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/empowered/PhoneFrame";
import { IntroCarousel } from "@/components/empowered/IntroCarousel";
import { useAuth } from "@/contexts/AuthContext";
import { markIntroSeen } from "@/lib/introSeen";

export const Route = createFileRoute("/intro")({
  component: IntroPage,
});

function IntroPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // Signed-in users (incl. demo onboarding walkthroughs) continue into
  // onboarding; brand-new visitors continue to signup.
  const next = () => {
    markIntroSeen();
    if (user && profile && !profile.onboarded) {
      navigate({ to: "/onboarding/profile" });
    } else if (user) {
      navigate({ to: "/home" });
    } else {
      navigate({ to: "/signup" });
    }
  };

  return (
    <PhoneFrame>
      <div className="h-full animate-slide-up">
        <IntroCarousel onComplete={next} />
      </div>
    </PhoneFrame>
  );
}
