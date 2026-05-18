/* ─────────────────────────────────────────────
 * Error Boundary
 * Catches React render errors and shows a
 * friendly recovery UI instead of a white screen.
 *
 * Usage:
 *   <StoryErrorBoundary onReset={() => goHome()}>
 *     <StoryEngine ... />
 *   </StoryErrorBoundary>
 * ───────────────────────────────────────────── */

import { Component, type ReactNode } from "react";
import dariaSolo from "@/assets/daria-solo.png";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Called when the user taps "Go back" — navigate them somewhere safe */
  onReset: () => void;
  /** Optional label for context (e.g. "story", "dashboard") */
  context?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class StoryErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production: send to error tracking (Sentry, etc.)
    console.error(`[StoryErrorBoundary] Caught error in ${this.props.context ?? "component"}:`, error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset();
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center bg-cream px-6 text-center">
          {/* Daria looking concerned */}
          <img
            src={dariaSolo}
            alt=""
            className="h-28 w-auto object-contain mb-4 drop-shadow-lg"
          />

          <h2 className="font-display text-[26px] font-extrabold text-primary leading-tight mb-2">
            Oops! Something went wrong
          </h2>

          <p className="text-sm text-ink-soft leading-relaxed mb-6 max-w-[280px]">
            Don't worry — your progress is saved! Let's try that again.
          </p>

          {/* Action buttons */}
          <div className="w-full max-w-[280px] space-y-3">
            <button
              onClick={this.handleRetry}
              className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-[0_4px_0_0_var(--primary-deep)] hover:shadow-[0_2px_0_0_var(--primary-deep)] hover:translate-y-[2px] transition-all active:scale-[0.98]"
            >
              Try Again
            </button>

            <button
              onClick={this.handleReset}
              className="w-full h-12 rounded-2xl bg-card border-2 border-primary/20 text-primary font-bold text-base shadow-card transition-all active:scale-[0.98]"
            >
              Go Back to Map
            </button>
          </div>

          {/* Error detail (collapsed, for debugging) */}
          {this.state.error && (
            <details className="mt-6 w-full max-w-[280px] text-left">
              <summary className="text-[10px] font-bold uppercase tracking-wider text-ink-soft/50 cursor-pointer">
                Error details
              </summary>
              <pre className="mt-2 rounded-xl bg-card p-3 text-[10px] text-ink-soft overflow-x-auto whitespace-pre-wrap break-words">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
