import { useState } from "react";
import { cn } from "@/lib/utils";
import { AuthBackdrop, IconInput, MiniPlane, Star, StoryProsLogo, UserIcon } from "./StoryProsBrand";
import { TactileButton } from "./TactileButton";

export interface OnboardingFormValues {
  childName: string;
  childAge: number | null;
  country: string;
  diagnoses: string[];
  otherDiagnosis: string;
}

interface DataFormScreenProps {
  onSubmit: (values: OnboardingFormValues) => void;
  onBack?: () => void;
  step?: number;
  totalSteps?: number;
  submitting?: boolean;
  error?: string | null;
}

const AGES = [4, 5, 6, 7, 8, 9, 10];

const DIAGNOSES = [
  "DLD",
  "ADHD",
  "Dyslexia",
  "DCD",
  "Autism",
  "Neurotypical",
  "Unsure",
];

function RequiredStar() {
  return (
    <>
      <span className="font-bold text-coral" aria-hidden>
        ★
      </span>
      <span className="sr-only">(required)</span>
    </>
  );
}


export function DataFormScreen({
  onSubmit,
  onBack,
  step = 1,
  totalSteps = 3,
  submitting = false,
  error = null,
}: DataFormScreenProps) {
  const [values, setValues] = useState<OnboardingFormValues>({
    childName: "",
    childAge: null,
    country: "",
    diagnoses: [],
    otherDiagnosis: "",
  });

  const toggleDiagnosis = (item: string) =>
    setValues((p) => ({
      ...p,
      diagnoses: p.diagnoses.includes(item)
        ? p.diagnoses.filter((d) => d !== item)
        : [...p.diagnoses, item],
    }));

  const isValid =
    values.childName.trim().length > 0 &&
    values.childAge !== null &&
    values.country.trim().length > 0 &&
    (values.diagnoses.length > 0 || values.otherDiagnosis.trim().length > 0);


  return (
    <div className="relative flex min-h-full flex-col overflow-hidden">
      <AuthBackdrop />
      <MiniPlane
        className="absolute right-6 top-24 z-0 hidden h-10 w-10 rotate-[18deg] text-secondary/80 sm:block"
        aria-hidden
      />
      <Star className="absolute left-8 top-32 z-0 hidden h-4 w-4 text-secondary sm:block" />

      {/* Slim onboarding bar: back · logo · step, with one continuous progress rail */}
      <header className="relative z-20 border-b border-border/60 bg-card/85 backdrop-blur">
        <div className="mx-auto grid h-14 w-full max-w-[560px] grid-cols-[40px_1fr_auto] items-center gap-2 px-4">
          <button
            type="button"
            aria-label="Go back"
            disabled={submitting}
            onClick={() => (onBack ? onBack() : window.history.back())}
            className="press-pop flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 text-primary transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
          >
            <ChevronLeftIcon />
          </button>
          <StoryProsLogo layout="row" size="sm" className="mx-auto" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink-soft">
            Step {step} / {totalSteps}
          </span>
        </div>
        <div className="h-0.5 w-full bg-primary/15" aria-hidden>
          <div
            className="h-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-[540px] flex-1 flex-col px-5 pb-6 pt-6">
        <div className="text-center animate-slide-up">
          <h1 className="font-display text-[26px] font-extrabold leading-tight text-primary sm:text-[32px]">
            Create your child's profile
          </h1>
          <p className="mt-2 text-xs font-semibold text-ink-soft">
            <span className="text-coral" aria-hidden>
              ★
            </span>{" "}
            = required
          </p>
        </div>




        <div className="mt-8 space-y-8">
          <div className="rounded-[24px] border border-border/70 bg-card/95 p-6 sm:p-7 shadow-soft backdrop-blur animate-slide-up">
            <div className="space-y-6">
              <div>
                <label htmlFor="child-name" className="block text-sm font-extrabold text-primary">
                  Child's name <RequiredStar />
                </label>

                <IconInput
                  id="child-name"
                  className="mt-2"
                  icon={<UserIcon />}
                  value={values.childName}
                  disabled={submitting}
                  onChange={(v) => setValues((p) => ({ ...p, childName: v.slice(0, 40) }))}
                  placeholder="Enter your child's name"
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="child-age" className="block text-sm font-extrabold text-primary">
                  Age <RequiredStar />
                </label>

                <div className="relative mt-2">
                  <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-primary">
                    <CalendarIcon />
                  </span>
                  <select
                    id="child-age"
                    disabled={submitting}
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
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-extrabold text-primary">
                  Country <span className="font-bold text-coral">Required</span>
                </label>

                <IconInput
                  id="country"
                  className="mt-2"
                  icon={<GlobeIcon />}
                  value={values.country}
                  disabled={submitting}
                  onChange={(v) => setValues((p) => ({ ...p, country: v.slice(0, 56) }))}
                  placeholder="Enter your country"
                  autoComplete="country-name"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-border/70 bg-card/95 p-6 sm:p-7 shadow-soft backdrop-blur animate-slide-up">
            <h2 className="font-display text-lg font-extrabold text-primary">
              Diagnosis
            </h2>
            <fieldset className="mt-5">
              <legend className="text-sm font-extrabold text-primary">
                Does your child have a diagnosis?{" "}
                <span className="font-bold text-coral">Required</span>
              </legend>
              <p className="mt-1.5 text-xs font-semibold text-ink-soft">
                Select all that apply.
              </p>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {DIAGNOSES.map((item) => {
                  const checked = values.diagnoses.includes(item);
                  return (
                    <label
                      key={item}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 text-[15px] font-semibold transition-colors",
                        checked
                          ? "border-primary bg-accent text-primary"
                          : "border-primary/25 bg-card text-ink hover:border-primary/50",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={submitting}
                        onChange={() => toggleDiagnosis(item)}
                        className="h-5 w-5 shrink-0 accent-primary"
                      />
                      {item}
                    </label>
                  );
                })}
              </div>

              <div className="mt-6">
                <label
                  htmlFor="other-diagnosis"
                  className="block text-sm font-extrabold text-primary"
                >
                  Another diagnosis <span className="font-bold text-ink-soft">(optional)</span>
                </label>
                <input
                  id="other-diagnosis"
                  type="text"
                  value={values.otherDiagnosis}
                  disabled={submitting}
                  onChange={(event) =>
                    setValues((p) => ({ ...p, otherDiagnosis: event.target.value.slice(0, 80) }))
                  }
                  placeholder="Type a diagnosis not listed above"
                  className="mt-2 h-[56px] w-full rounded-2xl border-2 border-primary/30 bg-card px-4 text-base font-semibold text-ink outline-none transition-colors placeholder:font-medium placeholder:text-ink-soft focus:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                />
              </div>

            </fieldset>
          </div>

        </div>

        <div className="mt-8 space-y-2.5">
          {error ? (
            <p
              role="alert"
              className="rounded-2xl border-2 border-coral/40 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral"
            >
              {error}
            </p>
          ) : null}
          <TactileButton
            disabled={!isValid || submitting}
            onClick={() => isValid && !submitting && onSubmit(values)}
            className="h-14 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              {submitting ? (
                <>
                  <Spinner /> Setting things up…
                </>
              ) : (
                <>
                  Continue <ArrowRightIcon />
                </>
              )}
            </span>
          </TactileButton>
          {!isValid && !submitting ? (
            <p className="text-center text-xs font-semibold text-ink-soft">
              Add your child's name, age, country, and one diagnosis option to continue.
            </p>
          ) : null}
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

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" strokeLinecap="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 animate-spin" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.3" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
