import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/empowered/PhoneFrame";
import { ForgotPasswordScreen } from "@/components/empowered/ForgotPasswordScreen";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  return (
    <PhoneFrame>
      <div className="h-full animate-slide-up">
        <ForgotPasswordScreen onBack={() => navigate({ to: "/login" })} />
      </div>
    </PhoneFrame>
  );
}
