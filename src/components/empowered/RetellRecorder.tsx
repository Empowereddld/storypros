/* ─────────────────────────────────────────────
 * Retell Recorder
 * Optional mic control shown during the retell phases.
 * Never required — a child can always finish the retell
 * without recording. Recording only saves for signed-in
 * (non-demo) accounts; uploadRetellRecording() no-ops
 * otherwise, so this control is hidden for demo/local kids.
 * ───────────────────────────────────────────── */

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { uploadRetellRecording, type RetellPhase } from "@/services/retell";
import { isCloudId } from "@/services/cloud";

interface RetellRecorderProps {
  childId: string | undefined;
  storyId: string;
  phase: RetellPhase;
}

type Status = "idle" | "recording" | "saving" | "saved" | "error" | "denied";

export function RetellRecorder({ childId, storyId, phase }: RetellRecorderProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [seconds, setSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  if (!childId || !isCloudId(childId)) return null;
  if (typeof MediaRecorder === "undefined") return null; // e.g. older Safari

  async function handleStart() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, pickRecorderOptions());
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorderRef.current = recorder;
      startedAtRef.current = Date.now();
      recorder.start();
      setStatus("recording");
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds(Math.round((Date.now() - startedAtRef.current) / 1000));
      }, 250);
    } catch {
      setStatus("denied");
    }
  }

  async function handleStop() {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const duration = Math.round((Date.now() - startedAtRef.current) / 1000);

    setStatus("saving");
    const blob: Blob = await new Promise((resolve) => {
      recorder.onstop = () => {
        recorder.stream.getTracks().forEach((track) => track.stop());
        resolve(new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" }));
      };
      recorder.stop();
    });

    if (!childId) return;
    const result = await uploadRetellRecording(childId, storyId, phase, blob, duration);
    setStatus(result.success ? "saved" : "error");
  }

  if (status === "denied") {
    return (
      <p className="mt-3 rounded-2xl bg-accent/50 px-4 py-3 text-xs font-semibold leading-snug text-ink-soft">
        We couldn't hear the mic — you can still finish the retell out loud without saving it.
      </p>
    );
  }

  if (status === "saved") {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-2xl bg-success/15 px-4 py-3 text-sm font-bold text-success">
        <CheckCircleIcon /> Saved to your Retell Library
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-3 rounded-2xl bg-accent/50 px-4 py-3">
      {status === "recording" ? (
        <button
          onClick={handleStop}
          className="flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm font-extrabold text-destructive-foreground shadow-card press-pop"
        >
          <span className="h-2.5 w-2.5 rounded-sm bg-white" />
          Stop · {formatTime(seconds)}
        </button>
      ) : (
        <button
          onClick={handleStart}
          disabled={status === "saving"}
          className={cn(
            "flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground shadow-card press-pop disabled:opacity-60",
          )}
        >
          <MicIcon className="h-4 w-4" />
          {status === "saving" ? "Saving..." : "Record my retelling"}
        </button>
      )}
    </div>
  );
}

// Safari (incl. iOS) doesn't support audio/webm; fall back through the types
// it actually records, so the mic still works there instead of throwing.
function pickRecorderOptions(): MediaRecorderOptions {
  const candidates = ["audio/webm", "audio/mp4", "audio/aac", "audio/ogg"];
  const mimeType = candidates.find((type) => MediaRecorder.isTypeSupported?.(type));
  return mimeType ? { mimeType } : {};
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function MicIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
