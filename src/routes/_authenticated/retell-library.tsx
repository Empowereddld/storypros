import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { RetellLibraryScreen } from "@/components/empowered/RetellLibraryScreen";
import { ParentGate } from "@/components/empowered/ParentGate";

export const Route = createFileRoute("/_authenticated/retell-library")({
  component: RetellLibraryPage,
});

function RetellLibraryPage() {
  const navigate = useNavigate();
  const { activeChild } = useAuth();

  if (!activeChild) {
    return null;
  }

  return (
    <ParentGate
      message="The Retell Library is for parents and caregivers."
      onCancel={() => navigate({ to: "/settings" })}
    >
      <RetellLibraryScreen
        childId={activeChild.id}
        childName={activeChild.name}
        onClose={() => navigate({ to: "/settings" })}
      />
    </ParentGate>
  );
}
