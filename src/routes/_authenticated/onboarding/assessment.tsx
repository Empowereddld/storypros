import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { OnboardingAssessment } from "@/components/empowered/OnboardingAssessment";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/onboarding/assessment")({
  component: OnboardingAssessmentPage,
});

function OnboardingAssessmentPage() {
  const navigate = useNavigate();
  const { activeChild, children, markOnboarded } = useAuth();
  const childName = activeChild?.name ?? children[0]?.name ?? "";
  return (
    <OnboardingAssessment
      childName={childName}
      onComplete={async () => {
        await markOnboarded();
        navigate({ to: "/home" });
      }}
    />
  );
}
