import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error capturado por ErrorBoundary:", error, errorInfo.componentStack);
    this.setState({ error, errorInfo });
    // You can send the bug to an external service here.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-800 p-4">
          <h1 className="text-2xl font-bold mb-4">Something went wrong!!</h1>
          <p className="mb-2">Please reload the page or contact technical support.</p>
          <details className="bg-white p-4 rounded shadow-md w-full max-w-md">
            <summary className="cursor-pointer font-semibold">Error details</summary>
            <pre className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
              {this.state.error && this.state.error.toString()}
              {"\n"}
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}