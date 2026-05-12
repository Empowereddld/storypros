/* Shared progress bar + close/quit header used across all phases */
import { cn } from "@/lib/utils";

interface ProgressHeaderProps {
  progress: number; // 0–100
  label?: string;
  onClose: () => void;
}

export function ProgressHeader({ progress, label, onClose }: ProgressHeaderProps) {
  return (
    <div className="px-5 pt-3">
      <div className="relative h-6 w-full rounded-full bg-cream-deep overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <button
          onClick={onClose}
          className="text-sm font-semibold text-ink-soft hover:text-primary transition-colors"
        >
          Quit
        </button>
        {label && (
          <span className="text-sm font-bold text-primary">{label}</span>
        )}
      </div>
    </div>
  );
}
