import { useState } from "react";
import { TactileButton } from "./TactileButton";
import { cn } from "@/lib/utils";

export interface OnboardingFormValues {
  childName: string;
  childAge: number | null;
  parentName: string;
  parentEmail: string;
}

interface DataFormScreenProps {
  onSubmit: (values: OnboardingFormValues) => void;
}

const AGES = [4, 5, 6, 7, 8, 9, 10];

export function DataFormScreen({ onSubmit }: DataFormScreenProps) {
  const [values, setValues] = useState<OnboardingFormValues>({
    childName: "",
    childAge: null,
    parentName: "",
    parentEmail: "",
  });

  const isValid =
    values.childName.trim().length > 0 &&
    values.childAge !== null &&
    values.parentName.trim().length > 0 &&
    /^\S+@\S+\.\S+$/.test(values.parentEmail);

  return (
    <div className="flex h-full flex-col px-6 pb-6 pt-4">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "h-2.5 rounded-full transition-all",
              i === 0 ? "w-8 bg-secondary-deep" : "w-2.5 bg-cream-deep",
            )}
          />
        ))}
      </div>

      <h1 className="mt-5 text-center font-display text-2xl font-bold leading-tight text-ink-soft">
        Tell us a little<br />about your family
      </h1>

      <div className="mt-5 flex-1 space-y-3 overflow-y-auto no-scrollbar pb-2">
        <FieldCard label="What's your child's first name?">
          <input
            type="text"
            value={values.childName}
            onChange={(e) => setValues((v) => ({ ...v, childName: e.target.value }))}
            placeholder="Enter child's name"
            className="w-full bg-transparent text-base text-ink placeholder:text-ink-soft/60 focus:outline-none"
          />
        </FieldCard>

        <FieldCard label="How old is your child?">
          <div className="flex flex-wrap gap-2 pt-1">
            {AGES.map((age) => {
              const selected = values.childAge === age;
              return (
                <button
                  key={age}
                  type="button"
                  onClick={() => setValues((v) => ({ ...v, childAge: age }))}
                  className={cn(
                    "h-11 w-11 rounded-2xl text-base font-bold transition-all",
                    selected
                      ? "bg-primary text-primary-foreground shadow-[0_3px_0_0_var(--primary-deep)] -translate-y-0.5"
                      : "bg-cream-deep text-ink hover:bg-sky/60",
                  )}
                >
                  {age}
                </button>
              );
            })}
          </div>
        </FieldCard>

        <FieldCard label="What should we call you?">
          <input
            type="text"
            value={values.parentName}
            onChange={(e) => setValues((v) => ({ ...v, parentName: e.target.value }))}
            placeholder="Enter parent's name"
            className="w-full bg-transparent text-base text-ink placeholder:text-ink-soft/60 focus:outline-none"
          />
        </FieldCard>

        <FieldCard label="Parent email">
          <input
            type="email"
            value={values.parentEmail}
            onChange={(e) => setValues((v) => ({ ...v, parentEmail: e.target.value }))}
            placeholder="Enter email address"
            inputMode="email"
            className="w-full bg-transparent text-base text-ink placeholder:text-ink-soft/60 focus:outline-none"
          />
        </FieldCard>
      </div>

      <p className="mt-2 text-center text-xs text-ink-soft">
        We never share your child&rsquo;s information.
      </p>

      <div className="mt-3">
        <TactileButton
          disabled={!isValid}
          onClick={() => isValid && onSubmit(values)}
        >
          Continue
        </TactileButton>
      </div>
    </div>
  );
}

function FieldCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block rounded-3xl bg-card p-4 shadow-card">
      <span className="block text-base font-semibold text-ink">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
