import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/empowered/PhoneFrame";
import { DemoScreen } from "@/components/empowered/DemoScreen";

export const Route = createFileRoute("/demo")({
  component: DemoPage,
});

function DemoPage() {
  const navigate = useNavigate();
  return (
    <PhoneFrame>
      <div className="h-full animate-slide-up">
        <DemoScreen
          onSelect={() => navigate({ to: "/home" })}
          onSelectOnboarding={() => navigate({ to: "/intro" })}
          onBack={() => navigate({ to: "/" })}
        />
      </div>
    </PhoneFrame>
  );
}
