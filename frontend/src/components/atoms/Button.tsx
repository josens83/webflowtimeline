/**
 * Button Component
 * Atomic Design - Atom
 * 재사용 가능한 버튼 컴포넌트
 */

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { buttonVariants } from '../../theme/variants';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 크기 */
  size?: keyof typeof buttonVariants.size;
  /** 버튼 스타일 변형 */
  variant?: keyof typeof buttonVariants.variant;
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 로딩 텍스트 */
  loadingText?: string;
  /** 아이콘 (왼쪽) */
  leftIcon?: React.ReactNode;
  /** 아이콘 (오른쪽) */
  rightIcon?: React.ReactNode;
}

/**
 * Button 컴포넌트
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">클릭</Button>
 * <Button variant="outline" leftIcon={<Icon />}>아이콘 버튼</Button>
 * <Button isLoading loadingText="로딩 중...">제출</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      size = 'md',
      variant = 'primary',
      fullWidth = false,
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClass = buttonVariants.base;
    const sizeClass = buttonVariants.size[size];
    const variantClass = buttonVariants.variant[variant];
    const widthClass = fullWidth ? 'w-full' : '';

    const classes = `${baseClass} ${sizeClass} ${variantClass} ${widthClass} ${className}`.trim();

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {isLoading ? loadingText || children : children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
