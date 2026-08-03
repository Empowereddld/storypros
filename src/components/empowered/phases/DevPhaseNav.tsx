import { ChevronLeft, ChevronRight, Wrench } from "lucide-react";
import { useState } from "react";

/**
 * Dev-only phase stepper. Lets a developer jump between story phases
 * without replaying the whole story. Never rendered in production builds.
 */
interface DevPhaseNavProps {
  phases: string[];
  index: number;
  onChange: (index: number) => void;
}

export function DevPhaseNav({ phases, index, onChange }: DevPhaseNavProps) {
  const [open, setOpen] = useState(true);

  if (!import.meta.env.DEV) return null;

  return (
    <div className="pointer-events-auto fixed bottom-4 left-1/2 z-[100] -translate-x-1/2">
      {open ? (
        <div className="flex items-center gap-2 rounded-full border border-border bg-card/95 px-2 py-1.5 shadow-lg backdrop-blur">
          <button
            type="button"
            aria-label="Previous phase (dev)"
            disabled={index <= 0}
            onClick={() => onChange(index - 1)}
            className="grid h-8 w-8 place-items-center rounded-full bg-muted text-foreground disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <select
            value={index}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label="Jump to phase (dev)"
            className="max-w-[190px] rounded-full bg-transparent px-2 text-xs font-medium text-foreground outline-none"
          >
            {phases.map((p, i) => (
              <option key={p} value={i}>
                {i + 1}. {p}
              </option>
            ))}
          </select>

          <button
            type="button"
            aria-label="Next phase (dev)"
            disabled={index >= phases.length - 1}
            onClick={() => onChange(index + 1)}
            className="grid h-8 w-8 place-items-center rounded-full bg-muted text-foreground disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Hide dev phase nav"
            onClick={() => setOpen(false)}
            className="ml-1 px-1 text-xs text-muted-foreground"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          aria-label="Show dev phase nav"
          onClick={() => setOpen(true)}
          className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card/90 text-muted-foreground shadow-md"
        >
          <Wrench className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
