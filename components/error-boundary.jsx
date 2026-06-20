"use client";

import React from "react";
import { getLogger } from "@/lib/logger";

const logger = getLogger("error-boundary");

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error("Error caught by boundary", error, {
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900/20 to-red-800/20 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-red-950/50 border border-red-800 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center">
                  <span className="text-red-400 text-lg">⚠️</span>
                </div>
                <h1 className="text-xl font-bold text-red-300">Something went wrong</h1>
              </div>

              <p className="text-gray-300 text-sm mb-4">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="mb-4 p-3 bg-black/30 rounded border border-red-800/50">
                  <p className="text-red-400 text-xs font-mono break-words">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-xs text-red-300 cursor-pointer hover:text-red-200">
                        Stack trace
                      </summary>
                      <pre className="mt-2 text-xs text-gray-400 overflow-auto max-h-40 bg-black/50 p-2 rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={this.handleRetry}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium text-sm transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium text-sm transition-colors"
                >
                  Go Home
                </button>
              </div>

              {this.state.retryCount > 0 && (
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Retry attempts: {this.state.retryCount}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
