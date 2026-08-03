interface ProgressHeaderProps {
  progress: number;
  label?: string;
  onClose: () => void;
}

export function ProgressHeader({ progress, label, onClose }: ProgressHeaderProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <header className="px-5 pt-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          aria-label="Quit story"
          className="press-pop flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card text-primary shadow-card"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            aria-hidden
          >
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="min-w-0 flex-1">
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-card shadow-card">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500"
              style={{ width: `${clamped}%` }}
            />
          </div>
        </div>

        {label ? (
          <span className="shrink-0 text-sm font-extrabold tabular-nums text-primary">{label}</span>
        ) : null}
      </div>
    </header>
  );
}
