/* ─────────────────────────────────────────────
 * DEPRECATED — Build #1 ComprehensionScreen
 *
 * This component has been replaced by:
 *   src/components/empowered/phases/ComprehensionPhase.tsx
 *
 * The new version implements the must-complete model
 * with brain checks, attempt tracking, and proper
 * scoring integration.
 *
 * This file is kept as a stub to avoid breaking
 * any stale imports. It should be deleted once
 * confirmed safe.
 * ───────────────────────────────────────────── */

export function ComprehensionScreen(_props: {
  onClose: () => void;
  onComplete: () => void;
}) {
  return (
    <div className="flex h-full items-center justify-center p-5 text-center">
      <p className="text-sm text-muted-foreground">
        This screen has been replaced. Use ComprehensionPhase via the StoryEngine.
      </p>
    </div>
  );
}
