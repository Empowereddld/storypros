import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/empowered/PhoneFrame";
import { SplashScreen } from "@/components/empowered/SplashScreen";
import { IntroCarousel } from "@/components/empowered/IntroCarousel";
import { SignUpScreen } from "@/components/empowered/SignUpScreen";
import {
  DataFormScreen,
  type OnboardingFormValues,
} from "@/components/empowered/DataFormScreen";
import { SuccessScreen } from "@/components/empowered/SuccessScreen";
import { AdventureMapScreen } from "@/components/empowered/AdventureMapScreen";

export const Route = createFileRoute("/")({
  component: Index,
});

type Step = "splash" | "intro" | "signup" | "form" | "success" | "home";

function Index() {
  const [step, setStep] = useState<Step>("splash");
  const [profile, setProfile] = useState<OnboardingFormValues>({
    childName: "",
    childAge: null,
    parentName: "",
    parentEmail: "",
  });

  return (
    <PhoneFrame>
      <div key={step} className="h-full animate-slide-up">
        {step === "splash" && <SplashScreen onContinue={() => setStep("intro")} />}
        {step === "intro" && <IntroCarousel onComplete={() => setStep("signup")} />}
        {step === "signup" && <SignUpScreen onContinue={() => setStep("form")} />}
        {step === "form" && (
          <DataFormScreen
            onSubmit={(values) => {
              setProfile(values);
              setStep("success");
            }}
          />
        )}
        {step === "success" && (
          <SuccessScreen
            childName={profile.childName}
            onContinue={() => setStep("home")}
          />
        )}
        {step === "home" && (
          <AdventureMapScreen
            childName={profile.childName}
            onReset={() => setStep("splash")}
          />
        )}
      </div>
    </PhoneFrame>
  );
}
