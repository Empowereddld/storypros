import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/empowered/PhoneFrame";
import { LoginScreen } from "@/components/empowered/LoginScreen";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  return (
    <PhoneFrame>
      <div className="h-full animate-slide-up">
        <LoginScreen
          onSignUp={() => navigate({ to: "/signup" })}
          onForgotPassword={() => navigate({ to: "/forgot-password" })}
          onSuccess={(role) => {
            if (role === "slp" || role === "teacher") {
              navigate({ to: "/slp" });
            } else {
              navigate({ to: "/home" });
            }
          }}
          onDemo={() => navigate({ to: "/demo" })}
        />
      </div>
    </PhoneFrame>
  );
}
