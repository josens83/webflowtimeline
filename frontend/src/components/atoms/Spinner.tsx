/**
 * Spinner Component
 * Atomic Design - Atom
 * 로딩 스피너 컴포넌트
 */

import { HTMLAttributes } from 'react';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /** 스피너 크기 */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** 색상 */
  color?: 'primary' | 'white' | 'gray';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const colorClasses = {
  primary: 'text-primary-600',
  white: 'text-white',
  gray: 'text-gray-600',
};

/**
 * Spinner 컴포넌트
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner size="lg" color="primary" />
 * ```
 */
export function Spinner({
  size = 'md',
  color = 'primary',
  className = '',
  ...props
}: SpinnerProps) {
  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color];

  return (
    <div className={`inline-block ${className}`.trim()} {...props}>
      <svg
        className={`animate-spin ${sizeClass} ${colorClass}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}
