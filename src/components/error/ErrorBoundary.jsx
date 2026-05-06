import React from 'react';

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // eslint-disable-next-line no-unused-vars
  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We encountered an unexpected error. Don't worry, your design is saved locally.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="mt-6 p-4 bg-red-50 rounded-lg border-2 border-red-200 text-left">
                <p className="text-xs font-bold text-red-600 mb-2">Error Details:</p>
                <pre className="text-[10px] text-red-700 overflow-auto max-h-40 font-mono">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-black text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="flex-1 bg-gray-100 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Try Again
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
