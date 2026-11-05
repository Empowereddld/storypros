import { ChevronLeft, ChevronRight, Wrench } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Dev-only screen stepper. Lets a developer move between every screen of a
 * story — both across phases and within a phase (story pages, individual
 * questions, vocabulary words, sentence frames). Never rendered in production.
 */

interface SubSteps {
  count: number;
  index: number;
  setIndex: (i: number) => void;
  label?: string;
}

interface DevNavCtx {
  sub: SubSteps | null;
  setSub: (s: SubSteps | null) => void;
}

const DevNavContext = createContext<DevNavCtx | null>(null);

export function DevNavProvider({ children }: { children: ReactNode }) {
  const [sub, setSub] = useState<SubSteps | null>(null);
  const value = useMemo(() => ({ sub, setSub }), [sub]);
  return <DevNavContext.Provider value={value}>{children}</DevNavContext.Provider>;
}

/**
 * Phases call this to expose their internal screens to the dev stepper.
 * No-op in production.
 */
export function useDevSubSteps(
  count: number,
  index: number,
  setIndex: (i: number) => void,
  label?: string,
) {
  const ctx = useContext(DevNavContext);
  const setSub = ctx?.setSub;
  const setIndexRef = useRef(setIndex);
  setIndexRef.current = setIndex;

  useEffect(() => {
    if (!import.meta.env.DEV || !setSub) return;
    setSub({ count, index, setIndex: (i: number) => setIndexRef.current(i), label });
    return () => setSub(null);
  }, [count, index, label, setSub]);
}

interface DevPhaseNavProps {
  phases: string[];
  index: number;
  onChange: (index: number) => void;
}

export function DevPhaseNav({ phases, index, onChange }: DevPhaseNavProps) {
  const [open, setOpen] = useState(true);
  const sub = useContext(DevNavContext)?.sub ?? null;

  const goPrev = useCallback(() => {
    if (sub && sub.index > 0) {
      sub.setIndex(sub.index - 1);
      return;
    }
    if (index > 0) onChange(index - 1);
  }, [sub, index, onChange]);

  const goNext = useCallback(() => {
    if (sub && sub.index < sub.count - 1) {
      sub.setIndex(sub.index + 1);
      return;
    }
    if (index < phases.length - 1) onChange(index + 1);
  }, [sub, index, onChange, phases.length]);

  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const showDevNav =
    import.meta.env.DEV ||
    host.endsWith(".lovableproject.com") ||
    host.startsWith("id-preview--") ||
    host.endsWith("-dev.lovable.app") ||
    host === "localhost";
  if (!showDevNav) return null;

  const atStart = index <= 0 && (!sub || sub.index <= 0);
  const atEnd =
    index >= phases.length - 1 && (!sub || sub.index >= sub.count - 1);

  return (
    <div className="pointer-events-auto fixed top-4 left-1/2 z-[100] -translate-x-1/2">
      {open ? (
        <div className="flex items-center gap-2 rounded-full border border-border bg-card/95 px-2 py-1.5 shadow-lg backdrop-blur">
          <button
            type="button"
            aria-label="Previous screen (dev)"
            disabled={atStart}
            onClick={goPrev}
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
              <option key={`${p}-${i}`} value={i}>
                {i + 1}. {p}
              </option>
            ))}
          </select>

          {sub && sub.count > 1 && (
            <select
              value={sub.index}
              onChange={(e) => sub.setIndex(Number(e.target.value))}
              aria-label="Jump to screen within phase (dev)"
              className="max-w-[150px] rounded-full bg-muted/60 px-2 py-1 text-xs font-medium text-foreground outline-none"
            >
              {Array.from({ length: sub.count }).map((_, i) => (
                <option key={i} value={i}>
                  {sub.label ?? "screen"} {i + 1}/{sub.count}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            aria-label="Next screen (dev)"
            disabled={atEnd}
            onClick={goNext}
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
