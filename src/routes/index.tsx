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
import { AchievementGalleryScreen } from "@/components/empowered/AchievementGalleryScreen";
import { OnboardingAssessment } from "@/components/empowered/OnboardingAssessment";
import { StoryEngine } from "@/components/empowered/phases";
import { getStory } from "@/services/stories";
import type { StoryData } from "@/types/story";

export const Route = createFileRoute("/")({
  component: Index,
});

type Step =
  | "splash"
  | "intro"
  | "signup"
  | "form"
  | "success"
  | "assessment"
  | "home"
  | "playing-story"
  | "achievements";

function Index() {
  const [step, setStep] = useState<Step>("splash");
  const [profile, setProfile] = useState<OnboardingFormValues>({
    childName: "",
    childAge: null,
    parentName: "",
    parentEmail: "",
  });
  const [activeStory, setActiveStory] = useState<StoryData | null>(null);

  function handlePlayStory(storyId?: string) {
    const story = getStory(storyId ?? "dans-papercut");
    if (story) {
      setActiveStory(story);
      setStep("playing-story");
    }
  }

  function handleStoryFinish() {
    setActiveStory(null);
    setStep("home");
  }

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
            onContinue={() => setStep("assessment")}
          />
        )}
        {step === "assessment" && (
          <OnboardingAssessment
            childName={profile.childName}
            onComplete={() => setStep("home")}
          />
        )}
        {step === "home" && (
          <AdventureMapScreen
            childName={profile.childName}
            onReset={() => setStep("splash")}
            onNavigate={(dest) => {
              if (dest === "story") {
                handlePlayStory();
              } else {
                setStep(dest as Step);
              }
            }}
          />
        )}
        {step === "playing-story" && activeStory && (
          <StoryEngine
            storyData={activeStory}
            onFinish={handleStoryFinish}
          />
        )}
        {step === "achievements" && (
          <AchievementGalleryScreen
            childName={profile.childName}
            onClose={() => setStep("home")}
          />
        )}
      </div>
    </PhoneFrame>
  );
}
