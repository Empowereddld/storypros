import { Component, type ReactNode } from "react";
import dariaAndFriend from "@/assets/dan-daria-thinking.webp";
import { AuthBackdrop, MiniPlane, StoryProsLogo, Star } from "./StoryProsBrand";
import { TactileButton } from "./TactileButton";

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
    console.error(
      `[StoryErrorBoundary] Caught error in ${this.props.context ?? "component"}:`,
      error,
      info.componentStack,
    );
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
        <div className="relative flex h-full flex-col overflow-hidden bg-cream px-5 text-center">
          <AuthBackdrop />
          <Star className="absolute left-9 top-28 z-10 h-5 w-5 text-secondary animate-sparkle" />
          <Star className="absolute right-10 top-36 z-10 h-4 w-4 text-primary/35 animate-sparkle" />
          <MiniPlane className="absolute right-12 top-20 z-10 h-8 w-8 rotate-[18deg] text-secondary animate-float" />

          <div className="relative z-10 flex h-full flex-col items-center pb-6 pt-5">
            <StoryProsLogo layout="row" size="md" className="scale-90" />

            <div className="mt-7 flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-card bg-secondary text-secondary-foreground shadow-card animate-bounce-in">
              <Star className="h-11 w-11" />
            </div>

            <h2 className="mt-5 font-display text-[42px] font-extrabold leading-none text-ink">
              Almost there!
            </h2>
            <p className="font-display text-[30px] font-extrabold leading-tight text-primary">
              Let's try again.
            </p>
            <p className="mt-1 text-[16px] font-bold text-ink-soft">
              That did not load quite right.
            </p>

            <div className="mt-5 w-full overflow-hidden rounded-[28px] border-[6px] border-card bg-card shadow-soft">
              <img
                src={dariaAndFriend}
                alt=""
                className="h-[230px] w-full object-cover object-center"
              />
            </div>

            <div className="mt-4 flex w-full items-center gap-3 rounded-[24px] bg-card/90 p-4 text-left shadow-card">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card">
                {hintIcon}
              </span>
              <p className="text-sm font-bold leading-snug text-ink-soft">
                Your progress is saved. Try again, or go back to a safe screen.
              </p>
            </div>

            <div className="mt-6 w-full space-y-3">
              <TactileButton variant="secondary" onClick={this.handleRetry}>
                {retryIcon} Try Again
              </TactileButton>
              <TactileButton variant="ghost" onClick={this.handleReset}>
                Go Back
              </TactileButton>
            </div>

            {this.state.error && (
              <details className="mt-4 w-full text-left">
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

const hintIcon = (
  <svg
    viewBox="0 0 24 24"
    className="h-7 w-7"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    aria-hidden
  >
    <path d="M9 18h6" strokeLinecap="round" />
    <path d="M10 21h4" strokeLinecap="round" />
    <path d="M8 14a6 6 0 118 0c-.8.7-1.2 1.5-1.2 2.4H9.2C9.2 15.5 8.8 14.7 8 14z" />
  </svg>
);

const retryIcon = (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden
  >
    <path d="M20 12a8 8 0 11-2.3-5.6" strokeLinecap="round" />
    <path d="M20 4v5h-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
