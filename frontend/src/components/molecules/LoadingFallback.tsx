/**
 * LoadingFallback Component
 * React.lazy Suspense를 위한 로딩 폴백 컴포넌트
 */

import { Spinner } from '../atoms/Spinner';

export interface LoadingFallbackProps {
  /** 로딩 메시지 */
  message?: string;
  /** 전체 화면 표시 */
  fullScreen?: boolean;
}

/**
 * LoadingFallback 컴포넌트
 *
 * @example
 * ```tsx
 * <Suspense fallback={<LoadingFallback />}>
 *   <LazyComponent />
 * </Suspense>
 * ```
 */
export function LoadingFallback({
  message = '로딩 중...',
  fullScreen = true,
}: LoadingFallbackProps) {
  if (fullScreen) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        <Spinner size="xl" />
        {message && (
          <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Spinner size="lg" />
      {message && (
        <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
      )}
    </div>
  );
}
