import { useState } from "react";
import { TactileButton } from "./TactileButton";
import { cn } from "@/lib/utils";

interface StoryReaderScreenProps {
  onClose: () => void;
  onComplete: () => void;
}

interface Page {
  text: string;
  art: "scissors" | "pinch" | "bandage" | "smile" | "airplane";
}

const PAGES: Page[] = [
  { text: "Dan was making a paper airplane. Suddenly, he felt a sharp pinch on his finger.", art: "scissors" },
  { text: "“Ouch!” Dan said. The paper had given him a tiny cut.", art: "pinch" },
  { text: "Mom helped him wash it and put on a bandage with stars.", art: "bandage" },
  { text: "Dan smiled. The cut didn't hurt much anymore.", art: "smile" },
  { text: "He picked up the paper and finished his airplane. Whoosh — it took flight!", art: "airplane" },
];

export function StoryReaderScreen({ onClose, onComplete }: StoryReaderScreenProps) {
  const [page, setPage] = useState(0);
  const [readAloud, setReadAloud] = useState(true);
  const isLast = page === PAGES.length - 1;
  const progress = ((page + 1) / PAGES.length) * 100;
  const current = PAGES[page];

  return (
    <div className="flex h-full flex-col px-5 pb-6 pt-3">
      {/* Progress pill */}
      <div className="relative h-7 w-full rounded-full bg-cream-deep">
        <div
          className="absolute inset-y-0 left-0 flex items-center justify-end rounded-full bg-secondary px-3 text-[11px] font-extrabold text-secondary-foreground transition-all"
          style={{ width: `${progress}%` }}
        >
          {Math.round(progress)}%
        </div>
      </div>

      {/* Top controls */}
      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full text-primary hover:bg-primary/10"
          aria-label="Close story"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" stroke="currentColor" strokeWidth="2.5" fill="none">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
        <span className="text-sm font-bold text-primary">
          {page + 1} of {PAGES.length}
        </span>
      </div>

      {/* Illustration card */}
      <div key={page} className="mt-3 overflow-hidden rounded-3xl bg-card shadow-card animate-pop-in">
        <div className="aspect-[5/4] w-full">
          <StoryArt kind={current.art} />
        </div>
      </div>

      {/* Story text */}
      <div key={`t-${page}`} className="mt-5 animate-slide-up">
        <p className="font-display text-[22px] leading-[1.45] font-semibold text-primary">
          {current.text}
        </p>
      </div>

      <div className="flex-1" />

      {/* Read-to-me row */}
      <div className="mb-4 flex items-center justify-center gap-4">
        <button
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground btn-tactile"
          aria-label="Play audio"
        >
          <svg viewBox="0 0 24 24" className="ml-0.5 h-7 w-7" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-ink">Read to me</span>
          <button
            onClick={() => setReadAloud((v) => !v)}
            aria-pressed={readAloud}
            className={cn(
              "relative h-7 w-12 rounded-full transition-colors",
              readAloud ? "bg-primary" : "bg-cream-deep",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-6 w-6 rounded-full bg-white transition-all",
                readAloud ? "left-[22px]" : "left-0.5",
              )}
            />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {page > 0 && (
          <TactileButton variant="ghost" fullWidth={false} className="px-6" onClick={() => setPage(page - 1)}>
            Back
          </TactileButton>
        )}
        <TactileButton onClick={() => (isLast ? onComplete() : setPage(page + 1))}>
          {isLast ? "Finish" : "Next"}
        </TactileButton>
      </div>
    </div>
  );
}

function StoryArt({ kind }: { kind: Page["art"] }) {
  // Inline SVG vignettes that match the Tactile-Modern style.
  if (kind === "scissors") return <DeskScene icon="scissors" />;
  if (kind === "pinch") return <DeskScene icon="pinch" />;
  if (kind === "bandage") return <DeskScene icon="bandage" />;
  if (kind === "smile") return <DeskScene icon="smile" />;
  return <DeskScene icon="airplane" />;
}

function DeskScene({ icon }: { icon: "scissors" | "pinch" | "bandage" | "smile" | "airplane" }) {
  return (
    <div className="relative h-full w-full bg-gradient-to-b from-sky/40 to-cream-deep/30">
      {/* Desk surface */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[oklch(0.78_0.06_60)]" />
      {/* Big emoji-ish character */}
      <div className="absolute inset-0 flex items-center justify-center text-8xl">
        {icon === "scissors" && "🧒🏻"}
        {icon === "pinch" && "😣"}
        {icon === "bandage" && "🩹"}
        {icon === "smile" && "😊"}
        {icon === "airplane" && "✈️"}
      </div>
      {/* Props on desk */}
      <div className="absolute bottom-3 left-4 text-3xl">📄</div>
      <div className="absolute bottom-3 right-6 text-3xl">
        {icon === "scissors" ? "✂️" : icon === "airplane" ? "🛬" : "📝"}
      </div>
    </div>
  );
}
