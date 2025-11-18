/**
 * Alert Component
 * Atomic Design - Molecule
 * 알림/경고 메시지 컴포넌트
 */

import { HTMLAttributes } from 'react';
import { alertVariants } from '../../theme/variants';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  /** 알림 타입 */
  variant?: keyof typeof alertVariants.variant;
  /** 제목 */
  title?: string;
  /** 닫기 버튼 표시 */
  closable?: boolean;
  /** 닫기 핸들러 */
  onClose?: () => void;
  /** 아이콘 숨김 */
  hideIcon?: boolean;
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

/**
 * Alert 컴포넌트
 *
 * @example
 * ```tsx
 * <Alert variant="success" title="성공">
 *   작업이 완료되었습니다.
 * </Alert>
 * <Alert variant="error" closable onClose={handleClose}>
 *   오류가 발생했습니다.
 * </Alert>
 * ```
 */
export function Alert({
  children,
  variant = 'info',
  title,
  closable = false,
  onClose,
  hideIcon = false,
  className = '',
  ...props
}: AlertProps) {
  const baseClass = alertVariants.base;
  const variantClass = alertVariants.variant[variant];
  const classes = `${baseClass} ${variantClass} ${className}`.trim();

  const Icon = icons[variant];

  return (
    <div className={classes} role="alert" {...props}>
      <div className="flex items-start">
        {!hideIcon && (
          <Icon className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
        )}

        <div className="flex-1">
          {title && (
            <h3 className="font-semibold mb-1">{title}</h3>
          )}
          <div className="text-sm">{children}</div>
        </div>

        {closable && onClose && (
          <button
            onClick={onClose}
            className="ml-3 flex-shrink-0 hover:opacity-70 transition"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
