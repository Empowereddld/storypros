import { useState } from "react";
import childAvatar from "@/assets/child-avatar.png";
import { cn } from "@/lib/utils";

interface AdventureMapScreenProps {
  childName: string;
  onReset: () => void;
}

type NodeKind = "lesson" | "story" | "treasure" | "boss";

interface MapNode {
  id: string;
  label: string;
  kind: NodeKind;
  status: "done" | "current" | "locked";
  x: number; // percentage of map width
  y: number; // percentage of map height
}

const NODES: MapNode[] = [
  { id: "n1", label: "Stick", kind: "lesson", status: "done", x: 18, y: 78 },
  { id: "n2", label: "Paper", kind: "story", status: "done", x: 36, y: 64 },
  { id: "n3", label: "Cut",   kind: "lesson", status: "current", x: 54, y: 52 },
  { id: "n4", label: "Treasure", kind: "treasure", status: "locked", x: 72, y: 38 },
  { id: "n5", label: "Airplane", kind: "story", status: "locked", x: 86, y: 22 },
  { id: "n6", label: "Castle", kind: "boss", status: "locked", x: 70, y: 12 },
];

export function AdventureMapScreen({ childName, onReset }: AdventureMapScreenProps) {
  const [openNode, setOpenNode] = useState<MapNode | null>(null);

  return (
    <div className="relative flex h-full flex-col bg-gradient-to-b from-sky/60 via-cream to-cream-deep">
      {/* Top bar */}
      <header className="relative z-20 flex items-center justify-between gap-3 px-5 pt-3 pb-2">
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-full bg-white/80 px-2.5 py-1.5 backdrop-blur shadow-card"
          aria-label="Profile"
        >
          <div className="h-8 w-8 overflow-hidden rounded-full bg-sky">
            <img src={childAvatar} alt="" className="h-full w-full object-cover object-top scale-[1.6] translate-y-1" />
          </div>
          <span className="pr-1 text-sm font-bold text-primary">
            Hi, {childName || "Friend"}!
          </span>
        </button>

        <div className="flex items-center gap-2">
          <Stat icon={<CoinIcon />} value="24" tone="secondary" />
          <Stat icon={<FlameIcon />} value="3" tone="coral" />
        </div>
      </header>

      {/* Map */}
      <div className="relative flex-1 overflow-hidden">
        <MapBackground />

        {/* Path between nodes */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <path
            d={pathD(NODES)}
            stroke="oklch(0.78 0.05 80)"
            strokeWidth="1.4"
            fill="none"
            strokeDasharray="0.6 1.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Nodes */}
        {NODES.map((n) => (
          <NodeButton key={n.id} node={n} onClick={() => setOpenNode(n)} />
        ))}

        {/* Avatar standing on current node */}
        {(() => {
          const current = NODES.find((n) => n.status === "current");
          if (!current) return null;
          return (
            <div
              className="absolute -translate-x-1/2 pointer-events-none"
              style={{ left: `${current.x}%`, top: `${current.y}%`, transform: `translate(-50%, -100%)` }}
            >
              <div className="flex flex-col items-center">
                <img
                  src={childAvatar}
                  alt=""
                  className="h-28 w-auto object-contain drop-shadow-[0_8px_12px_rgba(28,28,21,0.25)] animate-float"
                />
              </div>
            </div>
          );
        })()}
      </div>

      {/* Bottom prompt */}
      <div className="relative z-10 px-5 pb-6 pt-3">
        <div className="rounded-3xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl">
              📖
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary-deep">
                Today&rsquo;s adventure
              </p>
              <p className="text-base font-bold text-ink leading-tight">
                Dan and the Paper Cut
              </p>
            </div>
            <button
              onClick={() => setOpenNode(NODES.find((n) => n.status === "current") ?? null)}
              className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground btn-tactile"
            >
              Play
            </button>
          </div>
        </div>
      </div>

      {/* Coming-soon modal */}
      {openNode && (
        <ComingSoonModal node={openNode} onClose={() => setOpenNode(null)} />
      )}
    </div>
  );
}

function NodeButton({ node, onClick }: { node: MapNode; onClick: () => void }) {
  const isLocked = node.status === "locked";
  const isCurrent = node.status === "current";

  const palette =
    node.kind === "treasure"
      ? "bg-secondary text-secondary-foreground"
      : node.kind === "boss"
      ? "bg-coral text-coral-foreground"
      : "bg-card text-primary";

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group",
        isLocked && "opacity-60",
      )}
      aria-label={node.label}
    >
      <span
        className={cn(
          "relative flex h-12 w-12 items-center justify-center rounded-2xl shadow-card border-2",
          isCurrent ? "border-secondary-deep animate-pulse-glow" : "border-white/60",
          palette,
        )}
      >
        {isLocked ? <LockIcon /> : nodeIcon(node.kind)}
      </span>
      <span
        className={cn(
          "rounded-full bg-white/85 backdrop-blur px-2 py-0.5 text-[11px] font-bold leading-none",
          isCurrent ? "text-secondary-deep" : "text-ink",
        )}
      >
        {node.label}
      </span>
    </button>
  );
}

function nodeIcon(kind: NodeKind) {
  if (kind === "story") return <BookIcon />;
  if (kind === "treasure") return <span className="text-xl">★</span>;
  if (kind === "boss") return <span className="text-xl">👑</span>;
  return <span className="text-xl">✏️</span>;
}

function Stat({ icon, value, tone }: { icon: React.ReactNode; value: string; tone: "secondary" | "coral" }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-card",
        tone === "secondary" ? "bg-secondary text-secondary-foreground" : "bg-coral text-coral-foreground",
      )}
    >
      {icon}
      <span className="text-sm font-extrabold leading-none">{value}</span>
    </div>
  );
}

function CoinIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
      <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.25" />
      <circle cx="8" cy="8" r="5" fill="currentColor" />
      <text x="8" y="11" textAnchor="middle" fontSize="7" fontWeight="800" fill="oklch(0.4 0.1 80)">¢</text>
    </svg>
  );
}
function FlameIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M8 1c1 2.5 4 4 4 7a4 4 0 11-8 0c0-1 .5-2 1-2.5C5.5 6 6 5 8 1z" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 4h6a3 3 0 013 3v9a2 2 0 00-2-2H3V4z" strokeLinejoin="round" />
      <path d="M17 4h-6a3 3 0 00-3 3v9a2 2 0 012-2h7V4z" strokeLinejoin="round" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="4" y="9" width="12" height="9" rx="2" />
      <path d="M7 9V7a3 3 0 016 0v2" strokeLinecap="round" />
    </svg>
  );
}

function MapBackground() {
  return (
    <>
      {/* Water */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky/80 via-sky/40 to-cream-deep/40" />
      {/* Decorative islands */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <path d="M5 80 Q15 65 35 70 Q55 78 50 92 Q25 95 5 90 Z" fill="oklch(0.82 0.08 130)" opacity="0.85" />
        <path d="M55 88 Q75 82 92 90 Q88 98 60 96 Z" fill="oklch(0.82 0.08 130)" opacity="0.7" />
        <path d="M65 8 Q85 4 95 18 Q92 30 75 26 Q60 18 65 8 Z" fill="oklch(0.82 0.08 130)" opacity="0.85" />
        {/* Castle */}
        <g transform="translate(75 5)">
          <rect x="0" y="6" width="10" height="11" fill="oklch(0.85 0.05 30)" />
          <polygon points="0,6 5,1 10,6" fill="oklch(0.6 0.18 25)" />
          <rect x="3" y="10" width="2" height="4" fill="oklch(0.4 0.06 254)" />
        </g>
        {/* Trees */}
        <circle cx="14" cy="74" r="3.2" fill="oklch(0.55 0.13 145)" />
        <circle cx="20" cy="78" r="2.5" fill="oklch(0.6 0.13 145)" />
        <circle cx="78" cy="92" r="2" fill="oklch(0.6 0.13 145)" />
        {/* Mountain */}
        <polygon points="22,72 30,58 38,72" fill="oklch(0.65 0.05 250)" opacity="0.6" />
        <polygon points="30,58 33,62 35,58" fill="white" opacity="0.6" />
      </svg>
      {/* Clouds */}
      <Cloud className="absolute top-6 left-8 w-16 opacity-90" />
      <Cloud className="absolute top-2 right-16 w-12 opacity-80" />
      <Cloud className="absolute bottom-32 right-6 w-14 opacity-80" />
    </>
  );
}

function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 36" className={className} aria-hidden>
      <path
        d="M16 28c-7 0-12-5-12-11s5-10 11-10c1-5 6-7 10-7 5 0 9 3 10 7 1 0 2-1 4-1 5 0 9 4 9 8 5 0 9 4 9 9s-4 9-9 9H16z"
        fill="white"
      />
    </svg>
  );
}

function pathD(nodes: MapNode[]) {
  if (nodes.length === 0) return "";
  let d = `M ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < nodes.length; i++) {
    const prev = nodes[i - 1];
    const cur = nodes[i];
    const cx = (prev.x + cur.x) / 2;
    const cy = (prev.y + cur.y) / 2 - 6;
    d += ` Q ${cx} ${cy} ${cur.x} ${cur.y}`;
  }
  return d;
}

function ComingSoonModal({ node, onClose }: { node: MapNode; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center bg-ink/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full rounded-t-[32px] bg-card p-6 pb-8 shadow-soft animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-cream-deep" />
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky text-xl">
            {node.status === "locked" ? "🔒" : "✨"}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-deep">
              {node.kind === "story" ? "Story chapter" : node.kind === "treasure" ? "Treasure" : node.kind === "boss" ? "Boss level" : "Lesson"}
            </p>
            <p className="text-lg font-extrabold text-ink leading-tight">{node.label}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          {node.status === "locked"
            ? "Finish today's adventure to unlock this stop on the map."
            : "Lessons and stories will open here in the next build. For now, enjoy exploring the map!"}
        </p>
        <button
          onClick={onClose}
          className="mt-5 h-12 w-full rounded-2xl bg-primary text-primary-foreground font-bold btn-tactile"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
