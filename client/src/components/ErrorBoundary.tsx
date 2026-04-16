import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('🔴 ErrorBoundary caught an error:', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl shadow-lg border border-red-100 p-10 max-w-md w-full text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-500 mb-2 text-sm font-medium">
              This page encountered an unexpected error and could not load.
            </p>
            {this.state.error && (
              <p className="text-xs text-red-400 font-mono bg-red-50 p-3 rounded-xl mb-6 text-left overflow-auto">
                {this.state.error.message}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-6 py-3 bg-green-600 text-white rounded-2xl font-black hover:bg-green-700 transition shadow-md shadow-green-200"
              >
                🔄 Try Again
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-black hover:bg-gray-200 transition"
              >
                🏠 Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
