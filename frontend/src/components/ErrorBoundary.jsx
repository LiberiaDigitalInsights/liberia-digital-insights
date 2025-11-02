import React from 'react';
import { H1, Muted } from './ui/Typography';
import Button from './ui/Button';
import { FaExclamationTriangle, FaRedoAlt, FaHome } from 'react-icons/fa';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-500/10 p-6">
              <FaExclamationTriangle className="h-16 w-16 text-red-500" />
            </div>
          </div>
          <H1 className="mb-4 text-2xl font-semibold">Something went wrong</H1>
          <Muted className="mb-8 text-lg">
            We encountered an unexpected error. Please try refreshing the page or return to the home
            page.
          </Muted>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mb-8 w-full rounded-[var(--radius-md)] border border-red-500/20 bg-red-500/5 p-4 text-left">
              <summary className="cursor-pointer font-semibold text-red-500">
                Error Details (Development Only)
              </summary>
              <pre className="mt-4 overflow-auto text-xs text-[var(--color-muted)]">
                {this.state.error.toString()}
                {this.state.error.stack}
              </pre>
            </details>
          )}
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={this.handleReset} leftIcon={<FaHome />}>
              Go Home
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              leftIcon={<FaRedoAlt />}
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
