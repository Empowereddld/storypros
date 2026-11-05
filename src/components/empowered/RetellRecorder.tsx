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
  size?: "compact" | "large";
}

type Status = "idle" | "recording" | "saving" | "saved" | "error" | "denied";

export function RetellRecorder(props: RetellRecorderProps) {
  if (props.size === "large") return <LocalRecorder />;
  return <CloudRecorder {...props} />;
}

/* Record → listen → re-record/delete. Audio lives only in memory on the
 * device and is discarded when the screen closes; nothing is uploaded. */
type LocalStatus = "idle" | "recording" | "ready" | "playing" | "denied";

function LocalRecorder() {
  const [status, setStatus] = useState<LocalStatus>("idle");
  const [seconds, setSeconds] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      recorderRef.current?.stream.getTracks().forEach((t) => t.stop());
      audioRef.current?.pause();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  if (typeof MediaRecorder === "undefined") return null;

  function clearRecording() {
    audioRef.current?.pause();
    audioRef.current = null;
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setUrl(null);
  }

  async function start() {
    clearRecording();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, pickRecorderOptions());
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const u = URL.createObjectURL(blob);
        urlRef.current = u;
        setUrl(u);
        setStatus("ready");
      };
      recorderRef.current = recorder;
      const startedAt = Date.now();
      recorder.start();
      setSeconds(0);
      setStatus("recording");
      timerRef.current = setInterval(() => setSeconds(Math.round((Date.now() - startedAt) / 1000)), 250);
    } catch {
      setStatus("denied");
    }
  }

  function stop() {
    if (timerRef.current) clearInterval(timerRef.current);
    recorderRef.current?.stop();
  }

  function togglePlay() {
    if (!url) return;
    if (status === "playing") {
      audioRef.current?.pause();
      setStatus("ready");
      return;
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => setStatus("ready");
    void audio.play();
    setStatus("playing");
  }

  function remove() {
    clearRecording();
    setStatus("idle");
  }

  if (status === "denied") {
    return (
      <p className="rounded-2xl bg-accent/50 px-4 py-3 text-sm font-semibold text-ink-soft">
        We couldn't hear the mic — you can still tell the story out loud.
      </p>
    );
  }

  if (status === "ready" || status === "playing") {
    const playing = status === "playing";
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          <RoundAction label="Record again" onClick={start} className="bg-accent text-primary">
            <MicIcon className="h-6 w-6" />
          </RoundAction>
          <button
            onClick={togglePlay}
            aria-label={playing ? "Pause my recording" : "Listen to my recording"}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft press-pop"
          >
            {playing ? (
              <span className="flex gap-1.5"><span className="h-7 w-2.5 rounded bg-primary-foreground" /><span className="h-7 w-2.5 rounded bg-primary-foreground" /></span>
            ) : (
              <svg viewBox="0 0 24 24" className="ml-1 h-9 w-9" fill="currentColor" aria-hidden><path d="M7 4.5v15l13-7.5z" /></svg>
            )}
          </button>
          <RoundAction label="Delete" onClick={remove} className="bg-destructive/15 text-destructive">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
            </svg>
          </RoundAction>
        </div>
        <p className="text-base font-extrabold text-primary">
          {playing ? "Listening..." : "Tap ▶ to listen"}
        </p>
      </div>
    );
  }

  const recording = status === "recording";
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={recording ? stop : start}
        aria-label={recording ? "Stop recording" : "Start recording"}
        className={cn(
          "relative flex h-20 w-20 items-center justify-center rounded-full shadow-soft press-pop transition-colors",
          recording ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground",
        )}
      >
        {recording && <span className="absolute inset-0 rounded-full bg-destructive/40 animate-ping" aria-hidden />}
        {recording ? (
          <span className="relative h-7 w-7 rounded-md bg-destructive-foreground" />
        ) : (
          <MicIcon className="h-9 w-9" />
        )}
      </button>
      <p className={cn("text-base font-extrabold", recording ? "text-destructive" : "text-primary")}>
        {recording ? `Recording... ${formatTime(seconds)} · tap to stop` : "Tap to record"}
      </p>
    </div>
  );
}

function RoundAction({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={onClick}
        aria-label={label}
        className={cn("flex h-14 w-14 items-center justify-center rounded-full shadow-card press-pop", className)}
      >
        {children}
      </button>
      <span className="text-xs font-bold text-ink-soft">{label}</span>
    </div>
  );
}

function CloudRecorder({ childId, storyId, phase, size = "compact" }: RetellRecorderProps) {
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

  if (size === "large") {
    const recording = status === "recording";
    const saved = status === "saved";
    return (
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={recording ? handleStop : saved ? undefined : handleStart}
          disabled={status === "saving" || saved}
          aria-label={recording ? "Stop recording" : "Start recording"}
          className={cn(
            "relative flex h-20 w-20 items-center justify-center rounded-full shadow-soft press-pop transition-colors disabled:cursor-default",
            recording
              ? "bg-destructive text-destructive-foreground"
              : saved
                ? "bg-success text-success-foreground"
                : "bg-primary text-primary-foreground",
          )}
        >
          {recording && (
            <span className="absolute inset-0 rounded-full bg-destructive/40 animate-ping" aria-hidden />
          )}
          {recording ? (
            <span className="relative h-7 w-7 rounded-md bg-destructive-foreground" />
          ) : saved ? (
            <CheckCircleIcon />
          ) : (
            <MicIcon className="h-9 w-9" />
          )}
        </button>
        <p
          className={cn(
            "text-base font-extrabold",
            recording ? "text-destructive" : saved ? "text-success" : "text-primary",
          )}
        >
          {recording
            ? `Recording... ${formatTime(seconds)}`
            : saved
              ? "Saved!"
              : status === "saving"
                ? "Saving..."
                : status === "error"
                  ? "Didn't save — tap to try again"
                  : "Tap to record"}
        </p>
      </div>
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
