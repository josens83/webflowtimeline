/**
 * Input Component
 * Atomic Design - Atom
 * 재사용 가능한 입력 필드 컴포넌트
 */

import { forwardRef, InputHTMLAttributes } from 'react';
import { inputVariants } from '../../theme/variants';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** 입력 필드 크기 */
  size?: keyof typeof inputVariants.size;
  /** 입력 필드 스타일 변형 */
  variant?: keyof typeof inputVariants.variant;
  /** 에러 상태 */
  error?: boolean;
  /** 왼쪽 아이콘 */
  leftIcon?: React.ReactNode;
  /** 오른쪽 아이콘 */
  rightIcon?: React.ReactNode;
}

/**
 * Input 컴포넌트
 *
 * @example
 * ```tsx
 * <Input type="email" placeholder="이메일" />
 * <Input type="password" variant="error" error />
 * <Input leftIcon={<SearchIcon />} />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      variant = 'default',
      error = false,
      leftIcon,
      rightIcon,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClass = inputVariants.base;
    const sizeClass = inputVariants.size[size];
    const variantClass = error
      ? inputVariants.variant.error
      : inputVariants.variant[variant];

    const classes = `${baseClass} ${sizeClass} ${variantClass} ${className}`.trim();

    if (leftIcon || rightIcon) {
      return (
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`${classes} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
      );
    }

    return <input ref={ref} className={classes} {...props} />;
  }
);

Input.displayName = 'Input';
