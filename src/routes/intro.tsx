import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/empowered/PhoneFrame";
import { IntroCarousel } from "@/components/empowered/IntroCarousel";

export const Route = createFileRoute("/intro")({
  component: IntroPage,
});

function IntroPage() {
  const navigate = useNavigate();
  return (
    <PhoneFrame>
      <div className="h-full animate-slide-up">
        <IntroCarousel onComplete={() => navigate({ to: "/signup" })} />
      </div>
    </PhoneFrame>
  );
}
