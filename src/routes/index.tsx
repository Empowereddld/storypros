import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PhoneFrame } from "@/components/empowered/PhoneFrame";
import { SplashScreen } from "@/components/empowered/SplashScreen";
import { IntroCarousel } from "@/components/empowered/IntroCarousel";
import { SignUpScreen } from "@/components/empowered/SignUpScreen";
import { LoginScreen } from "@/components/empowered/LoginScreen";
import { ForgotPasswordScreen } from "@/components/empowered/ForgotPasswordScreen";
import {
  DataFormScreen,
  type OnboardingFormValues,
} from "@/components/empowered/DataFormScreen";
import { SuccessScreen } from "@/components/empowered/SuccessScreen";
import { AdventureMapScreen } from "@/components/empowered/AdventureMapScreen";
import { AchievementGalleryScreen } from "@/components/empowered/AchievementGalleryScreen";
import { SettingsScreen } from "@/components/empowered/SettingsScreen";
import { CollectibleShopScreen } from "@/components/empowered/CollectibleShopScreen";
import { ParentDashboardScreen } from "@/components/empowered/ParentDashboardScreen";
import { SlpDashboardScreen } from "@/components/empowered/SlpDashboardScreen";
import { PaywallScreen } from "@/components/empowered/PaywallScreen";
import { LibraryScreen } from "@/components/empowered/LibraryScreen";
import { StoryErrorBoundary } from "@/components/empowered/ErrorBoundary";
import { OnboardingAssessment } from "@/components/empowered/OnboardingAssessment";
import { StoryEngine } from "@/components/empowered/phases";
import { getStory } from "@/services/stories";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessStory, processExpiredSubscriptions } from "@/services/subscription";
import type { StoryData } from "@/types/story";

export const Route = createFileRoute("/")({
  component: Index,
});

type Step =
  | "splash"
  | "intro"
  | "signup"
  | "login"
  | "forgot-password"
  | "form"
  | "success"
  | "assessment"
  | "home"
  | "playing-story"
  | "achievements"
  | "settings"
  | "shop"
  | "dashboard"
  | "slp-home"
  | "paywall"
  | "library";

function Index() {
  const { user, profile, children, activeChild, loading, addChild, markOnboarded } = useAuth();

  // Determine initial step based on auth state and role
  function getInitialStep(): Step {
    if (!user) return "splash";
    if (profile?.role === "slp" || profile?.role === "teacher") {
      return profile.onboarded ? "slp-home" : "slp-home"; // SLPs skip child onboarding
    }
    if (!profile?.onboarded) return "form"; // signed up but not onboarded
    return "home";
  }

  const [step, setStep] = useState<Step>("splash");
  const [activeStory, setActiveStory] = useState<StoryData | null>(null);
  const [blockedStoryTitle, setBlockedStoryTitle] = useState<string | undefined>();

  // Clean up expired subscriptions on load
  useEffect(() => { processExpiredSubscriptions(); }, []);

  // Once auth loads, set correct starting step
  useEffect(() => {
    if (!loading) {
      setStep(getInitialStep());
    }
  }, [loading]);

  function handlePlayStory(storyId?: string) {
    const id = storyId ?? "dan-and-the-paper-cut";
    const childId = activeChild?.id ?? children[0]?.id ?? "";

    // Check subscription gating
    if (!canAccessStory(childId, id)) {
      const story = getStory(id);
      setBlockedStoryTitle(story?.title);
      setStep("paywall");
      return;
    }

    const story = getStory(id);
    if (story) {
      setActiveStory(story);
      setStep("playing-story");
    }
  }

  function handleStoryFinish() {
    setActiveStory(null);
    setStep("home");
  }

  function handleSignUpSuccess(role?: "parent" | "slp" | "teacher") {
    // SLPs/teachers skip child onboarding, go straight to their dashboard
    if (role === "slp" || role === "teacher") {
      setStep("slp-home");
    } else {
      setStep("form");
    }
  }

  function handleLoginSuccess(role?: "parent" | "slp" | "teacher") {
    // Route to the right dashboard based on role
    if (role === "slp" || role === "teacher") {
      setStep("slp-home");
    } else {
      setStep("home");
    }
  }

  function handleFormSubmit(values: OnboardingFormValues) {
    // Add child to the auth context
    addChild(values.childName, values.childAge);
    setStep("success");
  }

  function handleAssessmentComplete() {
    markOnboarded();
    setStep("home");
  }

  // Show nothing while auth is loading
  if (loading) {
    return (
      <PhoneFrame>
        <div className="flex h-full items-center justify-center bg-cream">
          <span className="text-4xl animate-float">✈️</span>
        </div>
      </PhoneFrame>
    );
  }

  // Derive child name from auth context or fallback
  const childName = activeChild?.name ?? children[0]?.name ?? "";

  return (
    <PhoneFrame>
      <div key={step} className="h-full animate-slide-up">
        {step === "splash" && (
          <SplashScreen onContinue={() => setStep("intro")} />
        )}
        {step === "intro" && (
          <IntroCarousel onComplete={() => setStep("signup")} />
        )}
        {step === "signup" && (
          <SignUpScreen
            onContinue={handleSignUpSuccess}
            onSignIn={() => setStep("login")}
          />
        )}
        {step === "login" && (
          <LoginScreen
            onSignUp={() => setStep("signup")}
            onForgotPassword={() => setStep("forgot-password")}
            onSuccess={handleLoginSuccess}
          />
        )}
        {step === "forgot-password" && (
          <ForgotPasswordScreen onBack={() => setStep("login")} />
        )}
        {step === "form" && (
          <DataFormScreen onSubmit={handleFormSubmit} />
        )}
        {step === "success" && (
          <SuccessScreen
            childName={childName}
            onContinue={() => setStep("assessment")}
          />
        )}
        {step === "assessment" && (
          <OnboardingAssessment
            childName={childName}
            onComplete={handleAssessmentComplete}
          />
        )}
        {step === "home" && (
          <AdventureMapScreen
            childName={childName}
            onReset={() => setStep("splash")}
            onNavigate={(dest, storyId) => {
              if (dest === "story") {
                handlePlayStory(storyId);
              } else {
                setStep(dest as Step);
              }
            }}
          />
        )}
        {step === "playing-story" && activeStory && (
          <StoryErrorBoundary
            onReset={handleStoryFinish}
            context="story-engine"
          >
            <StoryEngine
              storyData={activeStory}
              onFinish={handleStoryFinish}
            />
          </StoryErrorBoundary>
        )}
        {step === "achievements" && (
          <AchievementGalleryScreen
            childName={childName}
            onClose={() => setStep("home")}
          />
        )}
        {step === "settings" && (
          <SettingsScreen onClose={() => setStep("home")} />
        )}
        {step === "shop" && (
          <CollectibleShopScreen onClose={() => setStep("home")} />
        )}
        {step === "dashboard" && (
          <StoryErrorBoundary onReset={() => setStep("home")} context="parent-dashboard">
            <ParentDashboardScreen onClose={() => setStep("home")} />
          </StoryErrorBoundary>
        )}
        {step === "slp-home" && (
          <StoryErrorBoundary onReset={() => setStep("splash")} context="slp-dashboard">
            <SlpDashboardScreen onClose={() => setStep("splash")} />
          </StoryErrorBoundary>
        )}
        {step === "library" && (
          <LibraryScreen
            onClose={() => setStep("home")}
            onPlayStory={(storyId) => handlePlayStory(storyId)}
          />
        )}
        {step === "paywall" && (
          <PaywallScreen
            childId={activeChild?.id ?? children[0]?.id ?? ""}
            childName={childName}
            storyTitle={blockedStoryTitle}
            onClose={() => setStep("home")}
            onSubscribed={() => setStep("home")}
          />
        )}
      </div>
    </PhoneFrame>
  );
}
