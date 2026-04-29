import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('Caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen grid place-items-center px-6 text-center">
          <div className="max-w-sm">
            <h1 className="display text-3xl text-ink">Something gave way.</h1>
            <p className="mt-2 text-sepia italic">Refresh and try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-md bg-burgundy px-4 py-2 text-sm font-semibold text-paper-light"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
