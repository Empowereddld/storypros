import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/empowered/PhoneFrame";
import { SignUpScreen } from "@/components/empowered/SignUpScreen";

export const Route = createFileRoute("/signup")({
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  return (
    <PhoneFrame>
      <div className="h-full animate-slide-up">
        <SignUpScreen
          onContinue={(role) => {
            if (role === "slp" || role === "teacher") {
              navigate({ to: "/slp" });
            } else {
              navigate({ to: "/onboarding/profile" });
            }
          }}
          onSignIn={() => navigate({ to: "/login" })}
          onDemo={() => navigate({ to: "/demo" })}
        />
      </div>
    </PhoneFrame>
  );
}
