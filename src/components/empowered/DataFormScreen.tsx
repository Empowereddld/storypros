/* ─────────────────────────────────────────────
 * Data Form Screen (Onboarding) — Child Profile
 * Rebuilt from the "Child Profile Creation" mockup.
 * Collects child name + age. Parent info captured
 * at sign-up.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { TactileButton } from "./TactileButton";
import { cn } from "@/lib/utils";
import { AuthBackdrop, StoryProsLogo, IconInput, UserIcon } from "./StoryProsBrand";

export interface OnboardingFormValues {
  childName: string;
  childAge: number | null;
}

interface DataFormScreenProps {
  onSubmit: (values: OnboardingFormValues) => void;
}

const AGES = [4, 5, 6, 7, 8, 9, 10];

export function DataFormScreen({ onSubmit }: DataFormScreenProps) {
  const [values, setValues] = useState<OnboardingFormValues>({
    childName: "",
    childAge: null,
  });

  const isValid = values.childName.trim().length > 0 && values.childAge !== null;

  return (
    <div className="relative flex h-full flex-col bg-cream">
      <AuthBackdrop />

      <div className="relative z-10 flex h-full flex-col px-6 pb-6 pt-6">
        <StoryProsLogo layout="row" size="sm" className="mx-auto" />

        {/* Progress dots */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className={cn("h-2.5 rounded-full transition-all", i === 0 ? "w-7 bg-primary" : "w-2.5 bg-accent")} />
          ))}
        </div>

        <h1 className="mt-5 text-center font-display text-[26px] font-extrabold leading-tight text-primary">
          Create Child Profile
        </h1>
        <p className="mt-1 text-center text-sm font-medium text-ink-soft">
          Tell us a little about your child to personalize their stories.
        </p>

        <div className="mt-6 flex-1 space-y-4 overflow-y-auto no-scrollbar pb-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-soft">
              Child's first name
            </label>
            <IconInput
              icon={<UserIcon />}
              value={values.childName}
              onChange={(v) => setValues((p) => ({ ...p, childName: v }))}
              placeholder="Enter child's name"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-soft">
              How old is your child?
            </label>
            <div className="flex flex-wrap gap-2">
              {AGES.map((age) => {
                const selected = values.childAge === age;
                return (
                  <button
                    key={age}
                    type="button"
                    onClick={() => setValues((v) => ({ ...v, childAge: age }))}
                    className={cn(
                      "h-12 w-12 rounded-2xl text-base font-extrabold transition-all",
                      selected
                        ? "bg-primary text-primary-foreground shadow-[0_3px_0_0_var(--primary-deep)] -translate-y-0.5"
                        : "border-2 border-accent bg-card text-ink hover:border-primary/40",
                    )}
                  >
                    {age}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="mt-2 text-center text-xs text-ink-soft">
          We only collect a first name and age — never shared.
        </p>

        <TactileButton className="mt-3" disabled={!isValid} onClick={() => isValid && onSubmit(values)}>
          Continue
        </TactileButton>
      </div>
    </div>
  );
}
