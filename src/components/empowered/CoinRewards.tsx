/* ---------------------------------------------
 * Coin reward feedback
 *
 *  - CoinPill: small persistent balance in the
 *    activity header (upper-right).
 *  - CoinRewardLayer: brief "+4 coins" chip that
 *    drifts toward the pill after a learning action.
 *
 * Calm by design: ~700ms, no full-screen celebration,
 * never blocks Next, and reduced-motion users get the
 * same text without any movement.
 * --------------------------------------------- */

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CoinIcon } from "./StoryProsUi";
import { getPaperPlanes } from "@/services/progress";
import type { CoinEarnedDetail } from "@/services/coins";

const CHIP_MS = 800;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Persistent coin balance. Anchor for the reward chips. */
export function CoinPill({ className }: { className?: string }) {
  const [total, setTotal] = useState(() => getPaperPlanes());
  const [bump, setBump] = useState(false);

  useEffect(() => {
    function onEarned(event: Event) {
      const detail = (event as CustomEvent<CoinEarnedDetail>).detail;
      setTotal(detail?.total ?? getPaperPlanes());
      setBump(true);
      const timer = window.setTimeout(() => setBump(false), 450);
      return () => window.clearTimeout(timer);
    }
    function onSync() {
      setTotal(getPaperPlanes());
    }
    window.addEventListener("storypros:coin-earned", onEarned);
    window.addEventListener("storypros:progress-updated", onSync);
    return () => {
      window.removeEventListener("storypros:coin-earned", onEarned);
      window.removeEventListener("storypros:progress-updated", onSync);
    };
  }, []);

  return (
    <span
      data-coin-pill
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full bg-card px-2.5 py-1.5 shadow-card transition-transform duration-300",
        bump && "scale-[1.08]",
        className,
      )}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <CoinIcon className="h-4 w-4" />
      </span>
      <span
        className="text-sm font-extrabold tabular-nums text-primary"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="sr-only">Coins: </span>
        {total}
      </span>
    </span>
  );
}

interface Chip {
  id: number;
  amount: number;
  label?: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  moving: boolean;
  reduced: boolean;
}

/**
 * Renders the short "+N coins" feedback. Mount once per activity screen tree.
 * Purely presentational — it never gates navigation.
 */
export function CoinRewardLayer() {
  const [chips, setChips] = useState<Chip[]>([]);
  const nextId = useRef(0);

  const remove = useCallback((id: number) => {
    setChips((prev) => prev.filter((chip) => chip.id !== id));
  }, []);

  useEffect(() => {
    function onEarned(event: Event) {
      const detail = (event as CustomEvent<CoinEarnedDetail>).detail;
      if (!detail?.amount) return;

      const reduced = prefersReducedMotion();
      const pill = document.querySelector("[data-coin-pill]");
      const pillRect = pill?.getBoundingClientRect();

      const fallbackX = pillRect ? pillRect.left + pillRect.width / 2 : window.innerWidth - 60;
      const fallbackY = pillRect ? pillRect.bottom + 56 : 96;
      const x = detail.from?.x ?? fallbackX;
      const y = detail.from?.y ?? fallbackY;

      const targetX = pillRect ? pillRect.left + pillRect.width / 2 : x;
      const targetY = pillRect ? pillRect.top + pillRect.height / 2 : y - 60;

      const id = nextId.current++;
      setChips((prev) => [
        ...prev,
        {
          id,
          amount: detail.amount,
          label: detail.label,
          x,
          y,
          dx: reduced ? 0 : targetX - x,
          dy: reduced ? 0 : targetY - y,
          moving: false,
          reduced,
        },
      ]);

      // Kick off the drift on the next frame so the transition applies.
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          setChips((prev) =>
            prev.map((chip) => (chip.id === id ? { ...chip, moving: true } : chip)),
          ),
        ),
      );

      window.setTimeout(() => remove(id), CHIP_MS + 120);
    }

    window.addEventListener("storypros:coin-earned", onEarned);
    return () => window.removeEventListener("storypros:coin-earned", onEarned);
  }, [remove]);

  if (chips.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden={false}>
      {chips.map((chip) => (
        <div
          key={chip.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: chip.x, top: chip.y }}
        >
          <div
            className="flex items-center gap-1.5 rounded-full border-2 border-secondary bg-card px-3 py-1.5 shadow-card"
            style={{
              transform: chip.moving
                ? `translate3d(${chip.dx}px, ${chip.dy}px, 0) scale(${chip.reduced ? 1 : 0.75})`
                : "translate3d(0,0,0) scale(1)",
              opacity: chip.moving ? (chip.reduced ? 0 : 0.15) : 1,
              transition: chip.reduced
                ? `opacity ${CHIP_MS}ms ease-out`
                : `transform ${CHIP_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity ${CHIP_MS}ms ease-in`,
            }}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <CoinIcon className="h-3.5 w-3.5" />
            </span>
            <span className="whitespace-nowrap text-sm font-extrabold text-primary">
              +{chip.amount} {chip.amount === 1 ? "coin" : "coins"}
            </span>
          </div>
          {chip.label ? (
            <p className="mt-1 whitespace-nowrap text-center text-xs font-bold text-primary/80">
              {chip.label}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
