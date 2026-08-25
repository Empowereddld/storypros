/* ---------------------------------------------
 * Coin reward feedback
 *
 *  - CoinPill: persistent balance in the activity
 *    header. Counts up with a bounce when coins land.
 *  - CoinRewardLayer: a short "prize payoff" moment —
 *    a burst of spinning coins pops up, then arcs into
 *    the pill, followed by a "+N coins" chip.
 *
 * Never blocks Next. Reduced-motion users get the same
 * information with a simple fade, no movement.
 * --------------------------------------------- */

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { CoinIcon } from "./StoryProsUi";
import { getPaperPlanes } from "@/services/progress";
import { playCoinReward } from "@/lib/coinSound";
import type { CoinEarnedDetail } from "@/services/coins";

const POP_MS = 620;
const HOLD_MS = 420;
const FLY_MS = 1050;
const CHIP_MS = 1300;
const MAX_COINS = 11;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Find the coin counter that is actually visible in the current activity view. */
function getVisibleCoinPill(): DOMRect | undefined {
  const pills = Array.from(document.querySelectorAll<HTMLElement>("[data-coin-pill]"));
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  for (const pill of pills) {
    const rect = pill.getBoundingClientRect();
    const style = window.getComputedStyle(pill);
    const visible =
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      rect.width > 0 &&
      rect.height > 0 &&
      rect.right > 0 &&
      rect.bottom > 0 &&
      rect.left < viewportWidth &&
      rect.top < viewportHeight;

    if (visible) return rect;
  }

  return undefined;
}

/** Persistent coin balance. Anchor for the reward burst. */
export function CoinPill({ className }: { className?: string }) {
  const [total, setTotal] = useState(() => getPaperPlanes());
  const [bump, setBump] = useState(false);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    function clearTick() {
      if (tickRef.current !== null) {
        window.clearInterval(tickRef.current);
        tickRef.current = null;
      }
    }

    function onEarned(event: Event) {
      const detail = (event as CustomEvent<CoinEarnedDetail>).detail;
      const target = detail?.total ?? getPaperPlanes();
      const amount = detail?.amount ?? 0;
      const reduced = prefersReducedMotion();

      // Let the coins fly first, then tick the counter up as they land.
      const delay = reduced ? 0 : POP_MS + HOLD_MS + FLY_MS - 220;
      window.setTimeout(() => {
        setBump(true);
        window.setTimeout(() => setBump(false), 620);

        if (reduced || amount <= 1) {
          setTotal(target);
          return;
        }
        clearTick();
        const steps = Math.min(amount, 12);
        const start = target - amount;
        let step = 0;
        setTotal(Math.max(start, 0));
        tickRef.current = window.setInterval(() => {
          step += 1;
          if (step >= steps) {
            setTotal(target);
            clearTick();
            return;
          }
          setTotal(Math.round(start + (amount * step) / steps));
        }, 45);
      }, delay);
    }
    function onSync() {
      if (tickRef.current !== null) return;
      setTotal(getPaperPlanes());
    }
    window.addEventListener("storypros:coin-earned", onEarned);
    window.addEventListener("storypros:progress-updated", onSync);
    return () => {
      clearTick();
      window.removeEventListener("storypros:coin-earned", onEarned);
      window.removeEventListener("storypros:progress-updated", onSync);
    };
  }, []);

  return (
    <span
      data-coin-pill
      className={cn(
        "relative flex shrink-0 items-center gap-1.5 rounded-full bg-card px-2.5 py-1.5 shadow-card transition-transform duration-300 ease-out",
        bump && "scale-[1.16]",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-transform duration-300",
          bump && "rotate-[18deg] scale-110",
        )}
      >
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

interface FlyingCoin {
  id: number;
  /** pop-up offset from the origin */
  popX: number;
  popY: number;
  spin: number;
  size: number;
  delay: number;
}

interface Burst {
  id: number;
  amount: number;
  label?: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  coins: FlyingCoin[];
  /** vertical offset of the "+N coins" chip from the origin */
  chipOffset: number;

  phase: 0 | 1 | 2;
  reduced: boolean;
}

/**
 * Renders the coin payoff. Mount once per activity screen tree.
 * Purely presentational — it never gates navigation.
 */
export function CoinRewardLayer() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const nextId = useRef(0);

  const remove = useCallback((id: number) => {
    setBursts((prev) => prev.filter((burst) => burst.id !== id));
  }, []);

  useEffect(() => {
    function onEarned(event: Event) {
      const detail = (event as CustomEvent<CoinEarnedDetail>).detail;
      if (!detail?.amount) return;

      const reduced = prefersReducedMotion();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const pillRect = getVisibleCoinPill();

      const fallbackX = pillRect ? pillRect.left + pillRect.width / 2 : vw - 60;
      const fallbackY = pillRect ? pillRect.bottom + 96 : 140;
      const rawX = detail.from?.x ?? fallbackX;
      const rawY = detail.from?.y ?? fallbackY;

      // The effect needs room for the fan of coins plus the "+N coins" chip.
      // Scale the fan down on tight viewports, then pull the origin inward so
      // nothing pops off screen or collides with the header.
      const CHIP_HALF_W = 150;
      const CHIP_H = 78;
      const COIN_HALF = 34; // half of the largest coin, incl. ring
      const topSafe = pillRect ? Math.max(pillRect.bottom + 12, 64) : 64;

      const spreadX = Math.max(48, Math.min(128, (vw - 2 * 56) / 2.6));

      const marginX = Math.max(spreadX + 36, CHIP_HALF_W + 12);
      const x = Math.min(Math.max(rawX, marginX), Math.max(marginX, vw - marginX));

      // Keep the origin inside a band that leaves room for the upward pop AND
      // for the "+N coins" chip that always sits above the fan.
      const minY = topSafe + COIN_HALF + CHIP_H + 40;
      const maxY = vh - CHIP_H - 24;
      const y = Math.min(Math.max(rawY, minY), Math.max(minY, maxY));

      // Derive the pop height from the space actually above the origin, so the
      // fan of coins (and the chip above it) never travels past the top.
      const headroom = y - topSafe - COIN_HALF - CHIP_H;
      const popTop = Math.max(40, Math.min(182, (vh - topSafe) * 0.34, Math.max(40, headroom)));

      // Large coins include a ring and shadow, so keep their entire landing
      // footprint inside the viewport even when the counter hugs an edge.
      const LANDING_MARGIN = 40;
      const rawTargetX = pillRect ? pillRect.left + pillRect.width / 2 : x;
      const rawTargetY = pillRect ? pillRect.top + pillRect.height / 2 : y - 80;
      const targetX = Math.min(Math.max(rawTargetX, LANDING_MARGIN), vw - LANDING_MARGIN);
      const targetY = Math.min(Math.max(rawTargetY, LANDING_MARGIN), vh - LANDING_MARGIN);

      const count = reduced ? 0 : Math.max(5, Math.min(MAX_COINS, Math.round(detail.amount / 3) + 3));
      const coins: FlyingCoin[] = Array.from({ length: count }, (_, i) => {
        const spread = count > 1 ? (i / (count - 1) - 0.5) * 2 : 0;
        return {
          id: i,
          popX: spread * spreadX,
          popY: -(popTop * 0.58) - Math.abs(Math.cos(spread * 1.4)) * (popTop * 0.42),
          spin: (i % 2 === 0 ? 1 : -1) * (540 + i * 120),
          size: 40 + ((i * 7) % 20),
          delay: i * 70,
        };
      });

      const id = nextId.current++;
      setBursts((prev) => [
        ...prev,
        {
          id,
          amount: detail.amount,
          label: detail.label,
          x,
          y,
          dx: targetX - x,
          dy: targetY - y,
          coins,
          chipOffset: -(popTop + 26),
          phase: 0,
          reduced,
        },
      ]);


      const setPhase = (phase: 1 | 2) =>
        setBursts((prev) => prev.map((b) => (b.id === id ? { ...b, phase } : b)));

      playCoinReward();

      // pop out, hold so the child can see it, then arc into the pill
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase(1)));
      window.setTimeout(() => setPhase(2), POP_MS + HOLD_MS);
      window.setTimeout(() => remove(id), POP_MS + HOLD_MS + FLY_MS + CHIP_MS);
    }

    window.addEventListener("storypros:coin-earned", onEarned);
    return () => window.removeEventListener("storypros:coin-earned", onEarned);
  }, [remove]);

  if (bursts.length === 0) return null;

  return createPortal(
    <div
      data-coin-reward-layer
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
      aria-hidden={false}
    >
      {bursts.map((burst) => (
        <div key={burst.id} className="absolute" style={{ left: burst.x, top: burst.y }}>
          {/* flying coins */}
          {burst.coins.map((coin) => {
            const flying = burst.phase === 2;
            const popped = burst.phase >= 1;
            const tx = flying ? burst.dx : popped ? coin.popX : 0;
            const ty = flying ? burst.dy : popped ? coin.popY : 0;
            return (
              <span
                key={coin.id}
                data-flying-coin
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `translate3d(${tx}px, ${ty}px, 0)`,
                  opacity: flying ? 0.9 : 1,
                  transition: flying
                    ? `transform ${FLY_MS}ms cubic-bezier(0.55, 0, 0.45, 1) ${coin.delay}ms, opacity ${FLY_MS}ms ease-in ${coin.delay}ms`
                    : `transform ${POP_MS}ms cubic-bezier(0.16, 1.2, 0.4, 1)`,
                }}
              >
                <span
                  className="flex items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-card ring-2 ring-card"
                  style={{
                    width: coin.size,
                    height: coin.size,
                    transform: `rotate(${flying ? coin.spin : 0}deg) scale(${flying ? 0.55 : 1})`,
                    transition: `transform ${flying ? FLY_MS : POP_MS}ms ease-out ${flying ? coin.delay : 0}ms`,
                  }}
                >
                  <CoinIcon className="h-[60%] w-[60%]" />
                </span>
              </span>
            );
          })}

          {/* sparkle flash at the origin */}
          {!burst.reduced ? (
            <span
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/50 blur-xl"
              style={{
                width: 190,
                height: 190,
                opacity: burst.phase === 0 ? 0.95 : 0,
                transform: `scale(${burst.phase === 0 ? 0.4 : 2})`,
                transition: `opacity 900ms ease-out, transform 900ms ease-out`,
              }}
            />
          ) : null}

          {/* "+N coins" chip */}
          <div
            data-coin-reward-chip
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              transform: `translate3d(0, ${
                burst.chipOffset + (burst.phase === 0 ? 14 : 0)
              }px, 0) scale(${burst.phase === 0 ? 0.85 : 1})`,
              opacity: burst.phase === 0 ? 0 : burst.phase === 2 ? 1 : 0.95,
              transition: "transform 380ms cubic-bezier(0.16, 1.2, 0.4, 1), opacity 320ms ease-out",
            }}
          >
            <div className="flex items-center gap-1.5 rounded-full border-[3px] border-secondary bg-card px-4 py-2 shadow-card">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <CoinIcon className="h-4.5 w-4.5" />
              </span>
              <span className="whitespace-nowrap text-lg font-extrabold text-primary">
                +{burst.amount} {burst.amount === 1 ? "coin" : "coins"}
              </span>
            </div>
            {burst.label ? (
              <p className="mt-1 whitespace-nowrap text-center text-xs font-bold text-primary/80">
                {burst.label}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>,
    document.body,
  );
}
