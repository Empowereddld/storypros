/* ─────────────────────────────────────────────
 * Grown-ups button
 *
 * Adult-only controls live behind a press-and-hold.
 * No reading and no maths for the adult, but a child
 * tapping around won't land in Settings by accident.
 * ───────────────────────────────────────────── */

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { LockIcon } from "./StoryProsBrand";

const HOLD_MS = 2000;

export function GrownUpsButton({
  onEnter,
  className,
}: {
  onEnter: () => void;
  className?: string;
}) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef(0);
  const done = useRef(false);

  function stop() {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null;
    setHolding(false);
    setProgress(0);
  }

  useEffect(() => stop, []);

  function tick() {
    const elapsed = Date.now() - start.current;
    const pct = Math.min(1, elapsed / HOLD_MS);
    setProgress(pct);
    if (pct >= 1) {
      if (!done.current) {
        done.current = true;
        stop();
        onEnter();
      }
      return;
    }
    raf.current = requestAnimationFrame(tick);
  }

  function begin() {
    done.current = false;
    start.current = Date.now();
    setHolding(true);
    raf.current = requestAnimationFrame(tick);
  }

  return (
    <button
      type="button"
      onPointerDown={begin}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onContextMenu={(e) => e.preventDefault()}
      aria-label="Grown-ups — press and hold to open settings"
      className={cn(
        "relative inline-flex min-h-11 items-center gap-2 overflow-hidden rounded-full border border-accent/70 bg-card/80 px-4 py-2.5 text-xs font-extrabold text-ink-soft shadow-card transition-colors",
        holding && "text-primary",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 bg-accent/70 transition-[width] duration-75"
        style={{ width: `${progress * 100}%` }}
      />
      <LockIcon className="relative h-4 w-4" />
      <span className="relative">{holding ? "Keep holding…" : "Grown-ups"}</span>
    </button>
  );
}
