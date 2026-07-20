import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DataFormScreen } from "@/components/empowered/DataFormScreen";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/onboarding/profile")({
  component: OnboardingProfilePage,
});

function OnboardingProfilePage() {
  const navigate = useNavigate();
  const { addChild } = useAuth();
  return (
    <DataFormScreen
      onSubmit={async (values) => {
        await addChild(values.childName, values.childAge);
        navigate({ to: "/onboarding/success" });
      }}
    />
  );
}
