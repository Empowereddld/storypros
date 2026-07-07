import { StoryProsLogo } from "../StoryProsBrand";

interface ProgressHeaderProps {
  progress: number;
  label?: string;
  onClose: () => void;
}

export function ProgressHeader({ progress, label, onClose }: ProgressHeaderProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <header className="px-5 pt-3">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onClose}
          aria-label="Quit"
          className="press-pop flex h-12 w-12 items-center justify-center rounded-full bg-card text-primary shadow-card"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            aria-hidden
          >
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <StoryProsLogo layout="row" size="md" className="scale-90" />

        {label ? (
          <span className="flex min-w-[4.25rem] items-center justify-center rounded-full bg-card px-3 py-2 text-sm font-extrabold text-primary shadow-card">
            {label}
          </span>
        ) : (
          <span className="h-12 w-12" />
        )}
      </div>

      <div className="mt-4 rounded-full bg-card p-2 shadow-card">
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-accent">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500"
            style={{ width: `${clamped}%` }}
          />
        </div>
      </div>
    </header>
  );
}
