import { useEffect, useMemo } from "react";

interface SuccessScreenProps {
  childName: string;
  onContinue: () => void;
}

export function SuccessScreen({ childName, onContinue }: SuccessScreenProps) {
  useEffect(() => {
    const id = window.setTimeout(onContinue, 2400);
    return () => window.clearTimeout(id);
  }, [onContinue]);

  // Pre-compute confetti pieces once
  const pieces = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => {
        const angle = (i / 22) * Math.PI * 2;
        const dist = 140 + Math.random() * 80;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist - 60;
        const rot = 360 + Math.random() * 540;
        const colors = ["bg-secondary", "bg-primary", "bg-coral", "bg-success", "bg-sky"];
        return {
          color: colors[i % colors.length],
          tx,
          ty,
          rot,
          delay: Math.random() * 0.2,
        };
      }),
    [],
  );

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-cream px-6 text-center">
      {/* Golden burst */}
      <div className="absolute inset-x-0 top-1/3 -translate-y-1/2 mx-auto h-72 w-72 rounded-full bg-secondary/40 blur-3xl" />

      {/* Confetti */}
      <div className="pointer-events-none absolute inset-0">
        <div className="relative h-full w-full">
          {pieces.map((p, i) => (
            <span
              key={i}
              className={`absolute left-1/2 top-1/2 h-2.5 w-3 rounded-sm ${p.color}`}
              style={{
                ["--tx" as string]: `${p.tx}px`,
                ["--ty" as string]: `${p.ty}px`,
                ["--rot" as string]: `${p.rot}deg`,
                animation: "confetti-burst 1.4s ease-out forwards",
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 animate-pop-in">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary text-5xl shadow-[0_8px_0_0_var(--secondary-deep)]">
          ✨
        </div>
        <h1 className="font-display text-[32px] font-extrabold leading-tight text-primary">
          All set, {childName || "friend"}!
        </h1>
        <p className="mt-3 text-base text-ink-soft">
          Your adventure is ready.<br />Let&rsquo;s go meet the map.
        </p>
      </div>
    </div>
  );
}
