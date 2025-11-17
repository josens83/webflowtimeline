import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // Send to error tracking service (e.g., Sentry)
    // Sentry.captureException(error, { extra: errorInfo });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-2xl w-full">
            <div className="card text-center">
              {/* Icon */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20">
                  <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold mb-4">
                앗! 문제가 발생했습니다
              </h1>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                예상치 못한 오류가 발생했습니다. 불편을 드려 죄송합니다.
                아래 버튼을 눌러 페이지를 새로고침하거나 홈으로 돌아가세요.
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-8 text-left">
                  <summary className="cursor-pointer font-semibold mb-2 text-red-600 dark:text-red-400">
                    개발자 정보 (프로덕션에서는 표시되지 않음)
                  </summary>
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 overflow-auto">
                    <p className="font-mono text-sm text-red-800 dark:text-red-300 mb-2">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="font-mono text-xs text-red-700 dark:text-red-400 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleReset}
                  className="btn-secondary flex items-center justify-center"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  다시 시도
                </button>

                <button
                  onClick={this.handleReload}
                  className="btn-secondary flex items-center justify-center"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  페이지 새로고침
                </button>

                <button
                  onClick={this.handleGoHome}
                  className="btn-primary flex items-center justify-center"
                >
                  <Home className="w-5 h-5 mr-2" />
                  홈으로 가기
                </button>
              </div>

              {/* Support Link */}
              <div className="mt-8 pt-8 border-t dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  문제가 계속되시나요?{' '}
                  <a
                    href="/contact"
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    고객 지원팀에 문의하세요
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
