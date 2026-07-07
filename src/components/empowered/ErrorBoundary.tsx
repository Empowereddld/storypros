import { Component, type ReactNode } from "react";
import { ErrorState } from "./StateScreens";

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
        <ErrorState
          detail={this.state.error?.message}
          onRetry={this.handleRetry}
          onBack={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}
