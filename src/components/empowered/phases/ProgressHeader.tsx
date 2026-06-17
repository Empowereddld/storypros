/* Shared progress bar + quit header used across all phases */
import { StoryProsLogo } from "../StoryProsBrand";

interface ProgressHeaderProps {
  progress: number; // 0–100
  label?: string;
  onClose: () => void;
}

export function ProgressHeader({ progress, label, onClose }: ProgressHeaderProps) {
  return (
    <div className="px-5 pt-3">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onClose}
          aria-label="Quit"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-soft transition-colors hover:bg-accent/60 active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <StoryProsLogo layout="row" size="sm" />
        {label ? (
          <span className="min-w-[3.5rem] text-right text-sm font-bold text-primary">{label}</span>
        ) : (
          <span className="w-9" />
        )}
      </div>
      <div className="relative mt-2 h-4 w-full overflow-hidden rounded-full bg-cream-deep">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500"
          style={{ width: Math.min(100, Math.max(0, progress)) + "%" }}
        />
      </div>
    </div>
  );
}
