import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SuccessScreen } from "@/components/empowered/SuccessScreen";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/onboarding/success")({
  component: OnboardingSuccessPage,
});

function OnboardingSuccessPage() {
  const navigate = useNavigate();
  const { activeChild, children } = useAuth();
  const childName = activeChild?.name ?? children[0]?.name ?? "";
  return (
    <SuccessScreen
      childName={childName}
      onContinue={() => navigate({ to: "/onboarding/assessment" })}
    />
  );
}
