import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProfileSelectionScreen } from "@/components/empowered/ProfileSelectionScreen";

export const Route = createFileRoute("/_authenticated/select-child")({
  component: SelectChildPage,
});

function SelectChildPage() {
  const navigate = useNavigate();
  return (
    <ProfileSelectionScreen
      onSelected={() => navigate({ to: "/home" })}
      onAddChild={() => navigate({ to: "/settings" })}
    />
  );
}
