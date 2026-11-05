/* ─────────────────────────────────────────────
 * Brain Check-In
 *
 * Dan & Daria pop in and sing a short check-in
 * ("What do you need?"), then the child chooses:
 *   • keep going (brain is focused)
 *   • a quick break, from a set that depends on
 *     where in the story the check-in happens:
 *       "breaks" (after sequencing): tic-tac-toe
 *         with Dan, jumping jacks with Ming, dance
 *         party with Daria
 *       "games" (after the word quiz): memory cards
 *         with Dan, frog hops with Ming, painting
 *         with Daria
 * After a break, the child returns to the lesson.
 *
 * Makes metacognition explicit: notice what your
 * brain needs, then ask for it.
 * ───────────────────────────────────────────── */

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TactileButton } from "../TactileButton";
import type { StoryPhaseProps } from "@/types/story";
import danDariaImg from "@/assets/dan-daria-celebrate.webp";
import dariaImg from "@/assets/daria-solo.png";

export type BrainBreakVariant = "breaks" | "games";

/**
 * The check-in song ("What is DLD?", app version). Set this to the uploaded
 * recording's URL once it's available; until then the song step shows the
 * buddies popping in and moves on to the choices.
 */
const CHECK_IN_SONG_URL: string | null = null;
/** Placeholder song length when no recording exists yet (ms). */
const NO_SONG_POP_IN_MS = 2600;

type Stage =
  | "song"
  | "choose"
  | "tictactoe"
  | "jumping"
  | "dance"
  | "memory"
  | "frog"
  | "paint"
  | "ready";

type BreakId = Exclude<Stage, "song" | "choose" | "ready">;

const BREAK_SECONDS = 60;

const CHOICE_SETS: Record<BrainBreakVariant, { id: BreakId; emoji: string; label: string }[]> = {
  breaks: [
    { id: "tictactoe", emoji: "⭕", label: "Tic-tac-toe with Dan" },
    { id: "jumping", emoji: "🤸", label: "Jumping jacks for 60 seconds with Ming" },
    { id: "dance", emoji: "💃", label: "Dance party with Daria" },
  ],
  games: [
    { id: "memory", emoji: "🃏", label: "Memory Cards Game with Dan" },
    { id: "frog", emoji: "🐸", label: "Frog Hop for 60 seconds with Ming" },
    { id: "paint", emoji: "🎨", label: "Painting with Daria" },
  ],
};

export function BrainBreakPhase({
  onComplete,
  variant = "breaks",
}: StoryPhaseProps & { variant?: BrainBreakVariant }) {
  const [stage, setStage] = useState<Stage>("song");

  const finish = useCallback(() => {
    onComplete({
      phase: variant === "games" ? "brain-break-2" : "brain-break",
      attempts: [],
      first_attempt_accuracy: 1,
      completed: true,
    });
  }, [onComplete, variant]);

  return (
    <div className="h-full w-full overflow-y-auto bg-cream px-4 pb-8 pt-6 sm:px-6">
      <div className="mx-auto flex min-h-full w-full max-w-[760px] flex-col justify-center">
        {stage === "song" && <SongStage onDone={() => setStage("choose")} />}
        {stage === "choose" && (
          <ChooseStage
            choices={CHOICE_SETS[variant]}
            onKeepGoing={finish}
            onPick={(s) => setStage(s)}
          />
        )}
        {stage === "tictactoe" && <TicTacToe onDone={() => setStage("ready")} />}
        {stage === "jumping" && <JumpingJacks onDone={() => setStage("ready")} />}
        {stage === "dance" && <DanceParty onDone={() => setStage("ready")} />}
        {stage === "memory" && <MemoryGame onDone={() => setStage("ready")} />}
        {stage === "frog" && <FrogHops onDone={() => setStage("ready")} />}
        {stage === "paint" && <Painting onDone={() => setStage("ready")} />}
        {stage === "ready" && <ReadyStage onGo={finish} />}
      </div>
    </div>
  );
}

/* ── 1. Dan & Daria pop in and sing ── */
function SongStage({ onDone }: { onDone: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!CHECK_IN_SONG_URL) {
      const t = window.setTimeout(onDone, NO_SONG_POP_IN_MS);
      return () => window.clearTimeout(t);
    }
    const audio = new Audio(CHECK_IN_SONG_URL);
    audioRef.current = audio;
    audio.onended = onDone;
    audio.play().catch(() => onDone());
    return () => {
      audio.pause();
      audio.onended = null;
    };
  }, [onDone]);

  return (
    <div className="flex flex-col items-center text-center">
      <img
        src={danDariaImg}
        alt="Dan and Daria popping in to sing"
        className="h-[220px] w-auto animate-bounce-in object-contain sm:h-[300px]"
        draggable={false}
      />
      <div className="mt-4 flex items-center gap-2 text-3xl animate-pop-in" aria-hidden>
        <span className="animate-bob">🎵</span>
        <span className="animate-bob [animation-delay:200ms]">🎶</span>
        <span className="animate-bob [animation-delay:400ms]">🎵</span>
      </div>
      <h1 className="mt-3 font-display text-[28px] font-extrabold leading-tight text-primary sm:text-[34px]">
        What do you need?
      </h1>
      <p className="mt-1 text-lg font-bold text-ink-soft">What makes you ready to learn?</p>
      <button
        type="button"
        onClick={onDone}
        className="mt-6 text-sm font-bold text-muted-foreground underline underline-offset-4"
      >
        Skip song
      </button>
    </div>
  );
}

/* ── 2. Pick what your brain needs ── */
function ChooseStage({
  choices,
  onKeepGoing,
  onPick,
}: {
  choices: { id: BreakId; emoji: string; label: string }[];
  onKeepGoing: () => void;
  onPick: (s: Stage) => void;
}) {
  return (
    <div className="animate-slide-up text-center">
      <h1 className="font-display text-[26px] font-extrabold leading-tight text-primary sm:text-[32px]">
        What does your brain need?
      </h1>

      <button
        type="button"
        onClick={onKeepGoing}
        className="mx-auto mt-6 flex w-full max-w-[520px] items-center gap-4 rounded-[28px] border-2 border-success bg-success/10 p-5 text-left shadow-card transition-transform active:scale-[0.98]"
      >
        <span className="text-5xl" aria-hidden>🧠</span>
        <span>
          <span className="block text-xl font-extrabold text-ink">I want to keep going!</span>
          <span className="block text-sm font-semibold text-ink-soft">My brain is focused.</span>
        </span>
      </button>

      <p className="mt-6 text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
        Or take a quick break
      </p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {choices.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onPick(c.id)}
            className="flex flex-col items-center gap-2 rounded-[26px] border-2 border-accent bg-card p-5 shadow-card transition-transform animate-pop-in active:scale-95"
            style={{ animationDelay: `${120 * (i + 1)}ms` }}
          >
            <span className="text-5xl" aria-hidden>{c.emoji}</span>
            <span className="text-base font-extrabold leading-snug text-ink">{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Shared 60-second countdown ── */
function useCountdown(seconds: number, running: boolean) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (!running || left <= 0) return;
    const t = window.setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => window.clearTimeout(t);
  }, [left, running]);
  return left;
}

function TimerBadge({ left }: { left: number }) {
  return (
    <div className="mx-auto mt-2 w-fit rounded-full bg-secondary px-5 py-2 font-display text-3xl font-extrabold text-primary shadow-card">
      {left}s
    </div>
  );
}

/* ── Break: jumping jacks ── */
function JumpingJacks({ onDone }: { onDone: () => void }) {
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);
  const left = useCountdown(BREAK_SECONDS, started);
  const finished = started && left <= 0;

  return (
    <div className="text-center animate-slide-up">
      <h1 className="font-display text-[26px] font-extrabold text-primary sm:text-[32px]">
        How many jumping jacks can you do?
      </h1>
      <TimerBadge left={left} />
      <p className="mt-4 text-sm font-bold text-ink-soft">Tap the big button each time you jump!</p>
      <button
        type="button"
        disabled={!started || finished}
        onClick={() => setCount((c) => c + 1)}
        className="mx-auto mt-4 flex h-44 w-44 flex-col items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft transition-transform active:scale-90 disabled:opacity-60"
      >
        <span key={count} className="text-5xl animate-pop-in" aria-hidden>🤸</span>
        <span className="font-display text-5xl font-extrabold">{count}</span>
      </button>
      <div className="mt-6 flex justify-center">
        {!started ? (
          <TactileButton fullWidth={false} onClick={() => setStarted(true)}>Start</TactileButton>
        ) : finished ? (
          <TactileButton fullWidth={false} onClick={onDone}>You did {count}! Done</TactileButton>
        ) : (
          <button type="button" onClick={onDone} className="text-sm font-bold text-muted-foreground underline underline-offset-4">
            I'm done
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Break: frog hops with Ming ── */
function FrogHops({ onDone }: { onDone: () => void }) {
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);
  const left = useCountdown(BREAK_SECONDS, started);
  const finished = started && left <= 0;

  return (
    <div className="text-center animate-slide-up">
      <h1 className="font-display text-[26px] font-extrabold text-primary sm:text-[32px]">
        How many frog hops can you do?
      </h1>
      <TimerBadge left={left} />
      <p className="mt-4 text-sm font-bold text-ink-soft">Hop like a frog, then tap the big button!</p>
      <button
        type="button"
        disabled={!started || finished}
        onClick={() => setCount((c) => c + 1)}
        className="mx-auto mt-4 flex h-44 w-44 flex-col items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft transition-transform active:scale-90 disabled:opacity-60"
      >
        <span key={count} className="text-5xl animate-pop-in" aria-hidden>🐸</span>
        <span className="font-display text-5xl font-extrabold">{count}</span>
      </button>
      <div className="mt-6 flex justify-center">
        {!started ? (
          <TactileButton fullWidth={false} onClick={() => setStarted(true)}>Start</TactileButton>
        ) : finished ? (
          <TactileButton fullWidth={false} onClick={onDone}>You did {count}! Done</TactileButton>
        ) : (
          <button type="button" onClick={onDone} className="text-sm font-bold text-muted-foreground underline underline-offset-4">
            I'm done
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Break: dance party with Daria ── */
function DanceParty({ onDone }: { onDone: () => void }) {
  const [started, setStarted] = useState(false);
  const left = useCountdown(BREAK_SECONDS, started);
  const finished = started && left <= 0;

  return (
    <div className="text-center animate-slide-up">
      <h1 className="font-display text-[26px] font-extrabold text-primary sm:text-[32px]">
        Dance party with Daria!
      </h1>
      <TimerBadge left={left} />
      <div className="relative mx-auto mt-4 w-fit">
        <img
          src={dariaImg}
          alt="Daria dancing"
          className={cn("h-[220px] w-auto object-contain sm:h-[260px]", started && !finished && "animate-wiggle")}
          draggable={false}
        />
        {started && !finished && (
          <>
            <span className="absolute -left-8 top-6 text-4xl animate-bob" aria-hidden>🎵</span>
            <span className="absolute -right-8 top-16 text-4xl animate-bob [animation-delay:300ms]" aria-hidden>🎶</span>
          </>
        )}
      </div>
      <div className="mt-6 flex justify-center">
        {!started ? (
          <TactileButton fullWidth={false} onClick={() => setStarted(true)}>Let's dance!</TactileButton>
        ) : finished ? (
          <TactileButton fullWidth={false} onClick={onDone}>Done</TactileButton>
        ) : (
          <button type="button" onClick={onDone} className="text-sm font-bold text-muted-foreground underline underline-offset-4">
            I'm done
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Break: memory cards with Dan ── */
const PAIR_EMOJIS = ["🍎", "🩹", "📚", "🐸", "🎨", "⚽"];

type MemCard = { emoji: string; matchedBy: "you" | "dan" | null };
type MemTurn = "you" | "dan";

function shuffledPairs(): MemCard[] {
  const cards = PAIR_EMOJIS.flatMap((e) => [
    { emoji: e, matchedBy: null },
    { emoji: e, matchedBy: null },
  ]);
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function MemoryGame({ onDone }: { onDone: () => void }) {
  const [cards, setCards] = useState<MemCard[]>(shuffledPairs);
  const [open, setOpen] = useState<number[]>([]);
  const [turn, setTurn] = useState<MemTurn>("you");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("Tap two cards to find a match!");
  const [score, setScore] = useState({ you: 0, dan: 0 });

  const done = cards.every((c) => c.matchedBy);

  // Close the peek after a beat, and score it if it matched.
  useEffect(() => {
    if (open.length !== 2) return;
    setBusy(true);
    const t = window.setTimeout(() => {
      const [a, b] = open;
      const isMatch = cards[a].emoji === cards[b].emoji;
      if (isMatch) {
        setCards((cs) => cs.map((c, i) => (i === a || i === b ? { ...c, matchedBy: turn } : c)));
        setScore((s) => (turn === "you" ? { ...s, you: s.you + 1 } : { ...s, dan: s.dan + 1 }));
        setMsg(turn === "you" ? "You found a pair! 🎉" : "Dan found a pair!");
      } else {
        setMsg(turn === "you" ? "Not a match — Dan's turn." : "Not a match — your turn!");
      }
      setOpen([]);
      setTurn((t2) => (t2 === "you" ? "dan" : "you"));
      setBusy(false);
    }, 900);
    return () => window.clearTimeout(t);
  }, [open, cards, turn]);

  // Dan's turn: he tries to remember, but he's forgetful on purpose.
  useEffect(() => {
    if (turn !== "dan" || busy || done) return;
    const t = window.setTimeout(() => {
      const free = cards.map((c, i) => (c.matchedBy ? -1 : i)).filter((i) => i >= 0);
      if (free.length < 2) return;
      let pick: number[] = [];
      if (Math.random() < 0.45) {
        const byEmoji = new Map<string, number[]>();
        for (const i of free) {
          const e = cards[i].emoji;
          byEmoji.set(e, [...(byEmoji.get(e) ?? []), i]);
        }
        const pair = [...byEmoji.values()].find((a) => a.length === 2);
        if (pair) pick = pair;
      }
      if (pick.length !== 2) {
        const a = free[Math.floor(Math.random() * free.length)];
        const rest = free.filter((i) => i !== a);
        const b = rest[Math.floor(Math.random() * rest.length)];
        pick = [a, b];
      }
      setOpen(pick);
    }, 900);
    return () => window.clearTimeout(t);
  }, [turn, busy, done, cards]);

  const tap = (i: number) => {
    if (busy || turn !== "you" || done) return;
    if (cards[i].matchedBy || open.includes(i) || open.length === 2) return;
    setOpen((o) => [...o, i]);
  };

  const replay = () => {
    setCards(shuffledPairs());
    setOpen([]);
    setTurn("you");
    setBusy(false);
    setScore({ you: 0, dan: 0 });
    setMsg("Tap two cards to find a match!");
  };

  const result =
    score.you > score.dan ? "You won! 🎉" : score.dan > score.you ? "Dan won!" : "It's a tie!";

  return (
    <div className="text-center animate-slide-up">
      <h1 className="font-display text-[26px] font-extrabold text-primary sm:text-[32px]">
        Memory Cards Game
      </h1>
      <p className="mt-1 text-lg font-bold text-ink-soft">{done ? result : msg}</p>
      <p className="mt-1 text-sm font-extrabold text-muted-foreground">
        You: {score.you} &nbsp;•&nbsp; Dan: {score.dan}
      </p>

      <div className="mx-auto mt-4 grid w-[336px] grid-cols-4 gap-2 sm:w-[384px]">
        {cards.map((c, i) => {
          const faceUp = Boolean(c.matchedBy) || open.includes(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => tap(i)}
              aria-label={faceUp ? `Card ${i + 1}: ${c.emoji}` : `Card ${i + 1}, face down`}
              className={cn(
                "flex aspect-square items-center justify-center rounded-[18px] shadow-card transition-colors",
                faceUp
                  ? c.matchedBy === "you"
                    ? "bg-primary/10 ring-2 ring-primary"
                    : c.matchedBy === "dan"
                      ? "bg-secondary/40 ring-2 ring-secondary-deep"
                      : "bg-card ring-2 ring-accent"
                  : "bg-primary active:scale-95",
              )}
            >
              <span className={cn("text-4xl", faceUp && "animate-pop-in")} aria-hidden>
                {faceUp ? c.emoji : ""}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center gap-3">
        {done && (
          <TactileButton fullWidth={false} variant="secondary" onClick={replay}>
            Play again
          </TactileButton>
        )}
        <TactileButton fullWidth={false} onClick={onDone}>I'm done</TactileButton>
      </div>
    </div>
  );
}

/* ── Break: painting with Daria ── */
const PAINT_W = 440;
const PAINT_H = 260;
const PAINT_BRUSH = 16;
const PAINT_COLORS = ["#521d99", "#fdc003", "#e5484d", "#3b82f6", "#22a55b", "#111111"];

function Painting({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState(PAINT_COLORS[0]);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  // White paper, sized for the screen (crisper on retina/iPad).
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = PAINT_W * dpr;
    c.height = PAINT_H * dpr;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, PAINT_W, PAINT_H);
  }, []);

  const ctx2d = () => canvasRef.current?.getContext("2d") ?? null;

  const at = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = ctx2d();
    if (!ctx) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drawing.current = true;
    const p = at(e);
    last.current = p;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, PAINT_BRUSH / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = ctx2d();
    if (!ctx) return;
    const p = at(e);
    const from = last.current ?? p;
    ctx.strokeStyle = color;
    ctx.lineWidth = PAINT_BRUSH;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };

  const end = () => {
    drawing.current = false;
    last.current = null;
  };

  const clear = () => {
    const ctx = ctx2d();
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, PAINT_W, PAINT_H);
  };

  return (
    <div className="text-center animate-slide-up">
      <h1 className="font-display text-[26px] font-extrabold text-primary sm:text-[32px]">
        Painting with Daria!
      </h1>
      <p className="mt-1 text-sm font-bold text-ink-soft">Pick a color, then paint with your finger.</p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
        <img
          src={dariaImg}
          alt="Daria painting"
          className="h-[130px] w-auto object-contain animate-wiggle sm:h-[160px]"
          draggable={false}
        />
        <canvas
          ref={canvasRef}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          aria-label="Painting paper"
          className="rounded-[20px] border-2 border-accent bg-card shadow-card"
          style={{ width: PAINT_W, height: PAINT_H, touchAction: "none" }}
        />
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {PAINT_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            aria-label={`Use color ${c}`}
            aria-pressed={color === c}
            className={cn(
              "h-11 w-11 rounded-full border-2 transition-transform active:scale-90",
              color === c ? "border-primary ring-2 ring-primary/30" : "border-ink/10",
            )}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <div className="mt-5 flex justify-center gap-3">
        <TactileButton fullWidth={false} variant="secondary" onClick={clear}>
          Clear paper
        </TactileButton>
        <TactileButton fullWidth={false} onClick={onDone}>I'm done</TactileButton>
      </div>
    </div>
  );
}

/* ── Break: tic-tac-toe vs Dan ── */
const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];
type Cell = "X" | "O" | null;

function winner(b: Cell[]): Cell | "draw" | null {
  for (const [a, c, d] of LINES) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  return b.every(Boolean) ? "draw" : null;
}

/** Friendly opponent: win if it can, block if it must, otherwise random. */
function buddyMove(b: Cell[]): number {
  const free = b.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
  for (const mark of ["O", "X"] as const) {
    for (const i of free) {
      const t = [...b];
      t[i] = mark;
      if (winner(t) === mark) return i;
    }
  }
  return free[Math.floor(Math.random() * free.length)];
}

function TicTacToe({ onDone }: { onDone: () => void }) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const result = winner(board);

  const play = (i: number) => {
    if (board[i] || result) return;
    const next = [...board];
    next[i] = "X";
    if (!winner(next)) next[buddyMove(next)] = "O";
    setBoard(next);
  };

  const message =
    result === "X" ? "You won! 🎉" : result === "O" ? "Dan won!" : result === "draw" ? "It's a tie!" : "You are X. Tap a square!";

  return (
    <div className="text-center animate-slide-up">
      <h1 className="font-display text-[26px] font-extrabold text-primary sm:text-[32px]">Tic-tac-toe</h1>
      <p className="mt-1 text-lg font-bold text-ink-soft">{message}</p>
      <div className="mx-auto mt-4 grid w-[264px] grid-cols-3 gap-2 sm:w-[300px]">
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            onClick={() => play(i)}
            aria-label={`Square ${i + 1}${cell ? `, ${cell}` : ""}`}
            className="flex aspect-square items-center justify-center rounded-[20px] bg-card font-display text-5xl font-extrabold shadow-card"
          >
            <span className={cn(cell === "X" ? "text-primary" : "text-secondary-deep", cell && "animate-pop-in")}>
              {cell}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-3">
        {result && (
          <TactileButton fullWidth={false} variant="secondary" onClick={() => setBoard(Array(9).fill(null))}>
            Play again
          </TactileButton>
        )}
        <TactileButton fullWidth={false} onClick={onDone}>I'm done</TactileButton>
      </div>
    </div>
  );
}

/* ── After a break ── */
function ReadyStage({ onGo }: { onGo: () => void }) {
  return (
    <div className="flex flex-col items-center text-center animate-slide-up">
      <img src={danDariaImg} alt="Dan and Daria cheering" className="h-[200px] w-auto object-contain" draggable={false} />
      <h1 className="mt-4 font-display text-[28px] font-extrabold text-primary">Great break!</h1>
      <p className="mt-1 text-lg font-bold text-ink-soft">Is your brain ready to learn?</p>
      <div className="mt-6">
        <TactileButton fullWidth={false} onClick={onGo}>I'm ready!</TactileButton>
      </div>
    </div>
  );
}
