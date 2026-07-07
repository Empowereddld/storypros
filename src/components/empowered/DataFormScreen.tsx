import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  AuthBackdrop,
  IconInput,
  MiniPlane,
  Star,
  StoryProsLogo,
  UserIcon,
} from "./StoryProsBrand";
import { TactileButton } from "./TactileButton";

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
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <AuthBackdrop />
      <FlightPath />
      <MiniPlane className="absolute left-16 top-24 z-10 h-14 w-14 rotate-[22deg] text-secondary drop-shadow-lg animate-float" />
      <Star className="absolute right-14 top-40 z-10 h-5 w-5 text-secondary animate-sparkle" />

      <div className="relative z-20 flex h-full flex-col px-5 pb-4 pt-3">
        <div className="grid grid-cols-[44px_1fr_44px] items-center">
          <button
            type="button"
            aria-label="Back"
            onClick={() => window.history.back()}
            className="press-pop flex h-11 w-11 items-center justify-center rounded-full bg-accent/70 text-primary shadow-card"
          >
            <ChevronLeftIcon />
          </button>
          <StoryProsLogo layout="row" size="md" className="mx-auto scale-90" />
          <span />
        </div>

        <div className="mt-28 text-center animate-slide-up">
          <h1 className="font-display text-[30px] font-extrabold leading-tight text-primary">
            Create Child Profile
          </h1>
          <p className="mx-auto mt-2 max-w-[300px] text-[15px] font-medium leading-snug text-ink-soft">
            Let us create a profile for your child to make their story experience personal and
            inspiring.
          </p>
        </div>

        <div className="mt-8 rounded-[28px] border border-border/70 bg-card/95 p-4 shadow-soft backdrop-blur animate-slide-up">
          <label className="text-sm font-extrabold text-primary">Child's Name</label>
          <IconInput
            className="mt-3"
            icon={<UserIcon />}
            value={values.childName}
            onChange={(v) => setValues((p) => ({ ...p, childName: v }))}
            placeholder="Enter child's name"
            autoComplete="off"
          />

          <label className="mt-5 block text-sm font-extrabold text-primary">Age</label>
          <div className="relative mt-3">
            <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-secondary">
              <CalendarIcon />
            </span>
            <select
              value={values.childAge ?? ""}
              onChange={(event) => {
                const next = Number(event.target.value);
                setValues((p) => ({ ...p, childAge: Number.isNaN(next) ? null : next }));
              }}
              className={cn(
                "h-[58px] w-full appearance-none rounded-2xl border-2 border-accent/70 bg-card pl-12 pr-12 text-base font-semibold text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none transition-colors focus:border-primary",
                values.childAge === null && "text-ink-soft/60",
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
        </div>

        <div className="mt-auto space-y-4 pt-5">
          <div className="flex items-center gap-4 rounded-[24px] bg-accent/65 p-4 shadow-card">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-secondary shadow-card">
              <ShieldCheckIcon />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-primary">Safe & Secure</p>
              <p className="mt-0.5 text-xs font-medium leading-snug text-ink-soft">
                We respect your privacy. Your child's information is kept safe and secure.
              </p>
            </div>
            <span className="text-primary">
              <LockMiniIcon />
            </span>
          </div>

          <TactileButton disabled={!isValid} onClick={() => isValid && onSubmit(values)}>
            Continue <ArrowRightIcon />
          </TactileButton>

          <p className="text-center text-xs font-medium text-ink-soft">
            You can always change this later in{" "}
            <span className="font-extrabold text-primary">Settings</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

function FlightPath() {
  return (
    <svg
      className="pointer-events-none absolute left-0 top-28 z-0 h-28 w-full text-primary/65"
      viewBox="0 0 390 112"
      fill="none"
      aria-hidden
    >
      <path
        d="M0 62c34 30 62-24 104-5 41 19 61 17 91-11 43-40 90 40 135-10 18-20 38-27 60-22"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="7 9"
        strokeLinecap="round"
      />
    </svg>
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

function ShieldCheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      aria-hidden
    >
      <path
        d="M12 3l7 3v5c0 4.6-2.8 8.2-7 10-4.2-1.8-7-5.4-7-10V6l7-3z"
        fill="currentColor"
        className="text-primary"
      />
      <path
        d="M8.5 12.2l2.1 2.1 4.9-5"
        stroke="var(--secondary)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
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
