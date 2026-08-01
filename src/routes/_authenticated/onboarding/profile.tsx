import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DataFormScreen } from "@/components/empowered/DataFormScreen";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/onboarding/profile")({
  component: OnboardingProfilePage,
});

function OnboardingProfilePage() {
  const navigate = useNavigate();
  const { addChild, markOnboarded } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <DataFormScreen
      step={1}
      totalSteps={3}
      submitting={submitting}
      error={error}
      onBack={() => navigate({ to: "/intro" })}
      onSubmit={async (values) => {
        if (submitting) return;
        setSubmitting(true);
        setError(null);
        try {
          await addChild(values.childName, values.childAge);
          await markOnboarded();
          navigate({ to: "/map" });
        } catch (e) {
          setError(
            e instanceof Error && e.message
              ? e.message
              : "We couldn't save this profile. Please check your connection and try again.",
          );
          setSubmitting(false);
        }
      }}
    />
  );
}
