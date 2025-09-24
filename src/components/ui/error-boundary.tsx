import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center bg-gradient-card border-destructive/20">
            <div className="mb-6">
              <div className="bg-destructive/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Something went wrong
              </h1>
              <p className="text-muted-foreground">
                We encountered an unexpected error. Please try refreshing the page or return to the home screen.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-muted rounded text-xs font-mono text-muted-foreground overflow-auto max-h-32">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  <div>
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                  </div>
                </div>
              </details>
            )}

            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
              
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="w-full border-primary/20 hover:bg-primary/5"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Button>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                If this problem persists, please report it to our support team.
              </p>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;