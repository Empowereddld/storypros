import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";

/**
 * Navigates exactly once after mount. Replaces <Navigate>, whose layout-effect
 * re-fires on every render (new props object) and can loop forever.
 */
export function RedirectOnce({ to, search }: { to: string; search?: Record<string, unknown> }) {
  const navigate = useNavigate();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate({ to, search, replace: true } as any);
  }, [navigate, to, search]);
  return null;
}
