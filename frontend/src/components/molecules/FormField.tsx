/**
 * FormField Component
 * Atomic Design - Molecule
 * 레이블 + Input + 에러 메시지를 조합한 폼 필드
 */

import { forwardRef } from 'react';
import { Input, InputProps } from '../atoms/Input';

export interface FormFieldProps extends InputProps {
  /** 레이블 텍스트 */
  label?: string;
  /** 에러 메시지 */
  errorMessage?: string;
  /** 도움말 텍스트 */
  helperText?: string;
  /** 레이블 숨김 (접근성 유지) */
  hideLabel?: boolean;
}

/**
 * FormField 컴포넌트
 *
 * @example
 * ```tsx
 * <FormField
 *   label="이메일"
 *   type="email"
 *   error={!!errors.email}
 *   errorMessage={errors.email}
 * />
 * ```
 */
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      errorMessage,
      helperText,
      hideLabel = false,
      id,
      error,
      className = '',
      ...inputProps
    },
    ref
  ) => {
    const inputId = id || `field-${label?.toLowerCase().replace(/\s+/g, '-')}`;
    const hasError = error || !!errorMessage;

    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-sm font-medium mb-2 ${
              hideLabel ? 'sr-only' : ''
            }`}
          >
            {label}
            {inputProps.required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
        )}

        <Input
          ref={ref}
          id={inputId}
          error={hasError}
          {...inputProps}
        />

        {helperText && !errorMessage && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}

        {errorMessage && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
