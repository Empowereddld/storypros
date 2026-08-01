import { useState } from "react";
import { cn } from "@/lib/utils";
import { AuthBackdrop, IconInput, MiniPlane, Star, StoryProsLogo, UserIcon } from "./StoryProsBrand";
import { TactileButton } from "./TactileButton";

export interface OnboardingFormValues {
  childName: string;
  childAge: number | null;
}

interface DataFormScreenProps {
  onSubmit: (values: OnboardingFormValues) => void;
  onBack?: () => void;
  step?: number;
  totalSteps?: number;
}

const AGES = [4, 5, 6, 7, 8, 9, 10];

export function DataFormScreen({
  onSubmit,
  onBack,
  step = 1,
  totalSteps = 3,
}: DataFormScreenProps) {
  const [values, setValues] = useState<OnboardingFormValues>({
    childName: "",
    childAge: null,
  });

  const isValid = values.childName.trim().length > 0 && values.childAge !== null;

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden">
      <AuthBackdrop />
      <MiniPlane
        className="absolute right-6 top-24 z-0 hidden h-10 w-10 rotate-[18deg] text-secondary/80 sm:block"
        aria-hidden
      />
      <Star className="absolute left-8 top-32 z-0 hidden h-4 w-4 text-secondary sm:block" />

      {/* Simplified onboarding header: logo · back · step */}
      <header className="relative z-20 border-b border-border/60 bg-card/85 backdrop-blur">
        <div className="mx-auto grid w-full max-w-[560px] grid-cols-[44px_1fr_auto] items-center gap-2 px-4 py-3">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => (onBack ? onBack() : window.history.back())}
            className="press-pop flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ChevronLeftIcon />
          </button>
          <StoryProsLogo layout="row" size="sm" className="mx-auto" />
          <span className="rounded-full bg-accent px-3 py-1.5 text-xs font-extrabold text-primary">
            Step {step} of {totalSteps}
          </span>
        </div>
        <div className="mx-auto flex w-full max-w-[420px] gap-1.5 px-4 pb-3" aria-hidden>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-0.5 flex-1 rounded-full",
                i < step ? "bg-primary" : "bg-primary/20",
              )}
            />
          ))}
        </div>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-[540px] flex-1 flex-col px-5 pb-6 pt-6">
        <div className="text-center animate-slide-up">
          <h1 className="font-display text-[26px] font-extrabold leading-tight text-primary sm:text-[30px]">
            Create your child's profile
          </h1>
          <p className="mx-auto mt-2.5 max-w-[340px] text-[15px] font-medium leading-snug text-ink-soft">
            Add a few details to personalize their Story Pros experience.
          </p>
        </div>

        <div className="mt-7 rounded-[24px] border border-border/70 bg-card/95 p-5 shadow-soft backdrop-blur animate-slide-up">
          <label htmlFor="child-name" className="text-sm font-extrabold text-primary">
            Child's name
          </label>
          <IconInput
            id="child-name"
            className="mt-2"
            icon={<UserIcon />}
            value={values.childName}
            onChange={(v) => setValues((p) => ({ ...p, childName: v.slice(0, 40) }))}
            placeholder="Enter your child's name"
            autoComplete="off"
          />

          <label htmlFor="child-age" className="mt-5 block text-sm font-extrabold text-primary">
            Age
          </label>
          <div className="relative mt-2">
            <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-primary">
              <CalendarIcon />
            </span>
            <select
              id="child-age"
              value={values.childAge ?? ""}
              onChange={(event) => {
                const next = Number(event.target.value);
                setValues((p) => ({ ...p, childAge: Number.isNaN(next) ? null : next }));
              }}
              className={cn(
                "h-[56px] w-full appearance-none rounded-2xl border-2 border-primary/30 bg-card pl-12 pr-12 text-base font-semibold text-ink outline-none transition-colors focus:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                values.childAge === null && "text-ink-soft",
              )}
            >
              <option value="" disabled>
                Choose age
              </option>
              {AGES.map((age) => (
                <option key={age} value={age}>
                  {age} years old
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-primary">
              <ChevronDownIcon />
            </span>
          </div>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-ink-soft">
            <LockMiniIcon />
            Your child's information is kept private and secure.
          </p>
        </div>

        <div className="mt-6 space-y-2.5">
          <TactileButton
            disabled={!isValid}
            onClick={() => isValid && onSubmit(values)}
            className="disabled:opacity-100 disabled:bg-primary/60 disabled:text-primary-foreground/90"
          >
            <span className="inline-flex items-center gap-2">
              Continue <ArrowRightIcon />
            </span>
          </TactileButton>
        </div>
      </div>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      aria-hidden
    >
      <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <rect x="4" y="5" width="16" height="15" rx="3" />
      <path d="M8 3v4M16 3v4M4 10h16M9 15h4" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="currentColor" aria-hidden>
      <path d="M7 10V8a5 5 0 0110 0v2h1a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a2 2 0 012-2h1zm2 0h6V8a3 3 0 00-6 0v2z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 text-secondary"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      aria-hidden
    >
      <path d="M4 12h15M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
