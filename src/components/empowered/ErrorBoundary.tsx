/* ─────────────────────────────────────────────
 * Error Boundary
 * Catches React render errors and shows a friendly,
 * branded recovery UI instead of a white screen.
 * ───────────────────────────────────────────── */

import { Component, type ReactNode } from "react";
import dariaAndFriend from "@/assets/dan-daria-thinking.webp";
import { AuthBackdrop, StoryProsLogo, Star } from "./StoryProsBrand";

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset: () => void;
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
        <div className="relative flex h-full flex-col items-center justify-center bg-cream px-6 text-center">
          <AuthBackdrop />
          <div className="relative z-10 flex w-full max-w-[300px] flex-col items-center">
            <StoryProsLogo layout="row" size="sm" />
            <Star className="mt-4 h-7 w-7 text-secondary" />
            <h2 className="mt-2 font-display text-[26px] font-extrabold leading-tight text-ink">
              Almost there!
            </h2>
            <p className="font-display text-xl font-extrabold text-primary">Let's try again.</p>
            <img src={dariaAndFriend} alt="" className="mt-4 h-28 w-auto object-contain" />
            <p className="mt-3 text-sm font-medium leading-relaxed text-ink-soft">
              Don't worry — your progress is saved! Let's give that another go.
            </p>

            <div className="mt-6 w-full space-y-3">
              <button
                onClick={this.handleRetry}
                className="h-12 w-full rounded-2xl bg-secondary font-bold text-secondary-foreground shadow-[0_4px_0_0_var(--secondary-deep)] transition-all active:translate-y-[2px]"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReset}
                className="h-12 w-full rounded-2xl border-2 border-primary/30 bg-card font-bold text-primary shadow-card transition-all active:scale-[0.98]"
              >
                Go Back
              </button>
            </div>

            {this.state.error && (
              <details className="mt-6 w-full text-left">
                <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-wider text-ink-soft/50">
                  Error details
                </summary>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-card p-3 text-[10px] text-ink-soft">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
