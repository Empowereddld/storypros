/* ─────────────────────────────────────────────
 * DEPRECATED — Build #1 StoryReaderScreen
 *
 * This component has been replaced by:
 *   src/components/empowered/phases/StorySlidesPhase.tsx
 *
 * The new version loads story data from the
 * stories service and integrates with the
 * StoryEngine phase machine.
 *
 * This file is kept as a stub to avoid breaking
 * any stale imports. It should be deleted once
 * confirmed safe.
 * ───────────────────────────────────────────── */

export function StoryReaderScreen(_props: {
  onClose: () => void;
  onComplete: () => void;
}) {
  return (
    <div className="flex h-full items-center justify-center p-5 text-center">
      <p className="text-sm text-muted-foreground">
        This screen has been replaced. Use StorySlidesPhase via the StoryEngine.
      </p>
    </div>
  );
}
