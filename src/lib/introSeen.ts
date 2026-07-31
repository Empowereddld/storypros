/**
 * Tracks whether the signed-in user has already moved past the four
 * child-friendly intro screens in this browser session. Kept in
 * sessionStorage so an un-onboarded user isn't trapped in the intro loop
 * (and so a fresh sign-up always sees it once).
 */
const KEY = "storypros:intro-seen";

export function hasSeenIntro(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, "1");
  } catch {
    /* storage unavailable — intro simply shows again */
  }
}
