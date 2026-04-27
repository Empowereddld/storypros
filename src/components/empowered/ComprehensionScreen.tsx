import { useState } from "react";
import { TactileButton } from "./TactileButton";
import dariaSolo from "@/assets/daria-solo.png";
import { cn } from "@/lib/utils";

interface ComprehensionScreenProps {
  onClose: () => void;
  onComplete: (correctCount: number) => void;
}

interface Question {
  prompt: string;
  options: { id: string; label: string; emoji: string; correct?: boolean }[];
}

const QUESTIONS: Question[] = [
  {
    prompt: "What was Dan making?",
    options: [
      { id: "a", label: "Paper airplane", emoji: "✈️", correct: true },
      { id: "b", label: "Cookie", emoji: "🍪" },
      { id: "c", label: "Painting", emoji: "🎨" },
      { id: "d", label: "Book", emoji: "📖" },
    ],
  },
  {
    prompt: "How did Dan hurt his finger?",
    options: [
      { id: "a", label: "He fell down", emoji: "🤕" },
      { id: "b", label: "A paper cut", emoji: "📄", correct: true },
      { id: "c", label: "A bee sting", emoji: "🐝" },
      { id: "d", label: "He bumped his hand", emoji: "✋" },
    ],
  },
  {
    prompt: "Who helped Dan feel better?",
    options: [
      { id: "a", label: "His teacher", emoji: "👩‍🏫" },
      { id: "b", label: "His dog", emoji: "🐶" },
      { id: "c", label: "His mom", emoji: "👩", correct: true },
      { id: "d", label: "Nobody", emoji: "😢" },
    ],
  },
];

type Phase = "intro" | "quiz";

export function ComprehensionScreen({ onClose, onComplete }: ComprehensionScreenProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const q = QUESTIONS[questionIndex];
  const progress = ((questionIndex + (revealed ? 1 : 0)) / QUESTIONS.length) * 100;

  function handleNext() {
    if (!selected) return;
    if (!revealed) {
      const isCorrect = q.options.find((o) => o.id === selected)?.correct ?? false;
      if (isCorrect) setCorrectCount((c) => c + 1);
      setRevealed(true);
      return;
    }
    if (questionIndex + 1 >= QUESTIONS.length) {
      onComplete(correctCount);
      return;
    }
    setQuestionIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  }

  if (phase === "intro") {
    return <IntroPhase onClose={onClose} onStart={() => setPhase("quiz")} />;
  }

  return (
    <div className="flex h-full flex-col px-5 pb-6 pt-3">
      {/* Progress */}
      <div className="relative h-6 w-full rounded-full bg-cream-deep">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <button onClick={onClose} className="text-sm font-semibold text-ink-soft hover:text-primary">
          Quit
        </button>
        <span className="text-sm font-bold text-primary">
          Question {questionIndex + 1} of {QUESTIONS.length}
        </span>
      </div>

      <h2 key={`q-${questionIndex}`} className="mt-5 font-display text-[26px] leading-tight font-extrabold text-primary animate-slide-up">
        {q.prompt}
      </h2>

      <div className="mt-5 space-y-3 flex-1 overflow-y-auto no-scrollbar pb-2">
        {q.options.map((opt) => {
          const isSelected = selected === opt.id;
          const showCorrect = revealed && opt.correct;
          const showWrong = revealed && isSelected && !opt.correct;
          return (
            <button
              key={opt.id}
              onClick={() => !revealed && setSelected(opt.id)}
              disabled={revealed}
              className={cn(
                "flex w-full items-center gap-4 rounded-3xl border-2 bg-card p-3 text-left shadow-card transition-all",
                !revealed && isSelected && "border-primary bg-primary/5 -translate-y-0.5",
                !revealed && !isSelected && "border-transparent hover:border-primary/40",
                showCorrect && "border-success bg-success/10",
                showWrong && "border-destructive bg-destructive/10",
                revealed && !isSelected && !opt.correct && "opacity-60",
              )}
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky text-3xl">
                {opt.emoji}
              </span>
              <span className="flex-1 text-lg font-bold text-primary">{opt.label}</span>
              {showCorrect && <CheckBadge />}
              {showWrong && <CrossBadge />}
            </button>
          );
        })}
      </div>

      <div className="mt-3">
        <TactileButton onClick={handleNext} disabled={!selected}>
          {!revealed ? "Check" : questionIndex + 1 >= QUESTIONS.length ? "See results" : "Next question"}
        </TactileButton>
      </div>
    </div>
  );
}

function IntroPhase({ onClose, onStart }: { onClose: () => void; onStart: () => void }) {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-secondary/30 via-secondary/10 to-cream">
      <div className="px-5 pt-3">
        <div className="relative h-6 w-full rounded-full bg-cream-deep">
          <div className="absolute inset-y-0 left-0 w-[20%] rounded-full bg-primary" />
        </div>
        <div className="mt-2 flex justify-end">
          <button onClick={onClose} className="text-sm font-semibold text-ink-soft">Quit</button>
        </div>
      </div>

      <div className="relative mt-2 flex-1 px-5">
        {/* Stars */}
        <span className="absolute left-6 top-2 text-secondary-deep">★</span>
        <span className="absolute right-12 top-4 text-secondary-deep text-sm">★</span>
        <span className="absolute right-6 top-24 text-secondary-deep text-xs">★</span>

        <div className="relative flex items-start gap-2 animate-pop-in">
          <img src={dariaSolo} alt="Daria waving" className="h-56 w-auto -ml-4 object-contain" />
          <div className="relative mt-6 flex-1">
            <div className="rounded-3xl rounded-bl-sm bg-card p-4 shadow-card">
              <p className="text-base font-semibold text-primary leading-snug">
                Now let&rsquo;s check what you remember about Dan&rsquo;s story!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-cream rounded-t-[40px] px-6 pt-8 pb-6 -mt-8 relative animate-slide-up">
        <h1 className="text-center font-display text-[36px] leading-tight font-extrabold text-primary">
          Comprehension<br />Questions
        </h1>
        <p className="mt-2 text-center text-base text-ink-soft">
          3 questions — you&rsquo;ve got this.
        </p>
        <div className="mt-6">
          <TactileButton variant="primary" onClick={onStart}>
            Let&rsquo;s go!
          </TactileButton>
        </div>
      </div>
    </div>
  );
}

function CheckBadge() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-success-foreground">
      <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth="3" fill="none">
        <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
function CrossBadge() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
      <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth="3" fill="none">
        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
      </svg>
    </span>
  );
}
