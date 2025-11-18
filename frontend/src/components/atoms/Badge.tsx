/**
 * Badge Component
 * Atomic Design - Atom
 * 재사용 가능한 뱃지/태그 컴포넌트
 */

import { HTMLAttributes } from 'react';
import { badgeVariants } from '../../theme/variants';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** 뱃지 크기 */
  size?: keyof typeof badgeVariants.size;
  /** 뱃지 스타일 변형 */
  variant?: keyof typeof badgeVariants.variant;
  /** 아이콘 */
  icon?: React.ReactNode;
}

/**
 * Badge 컴포넌트
 *
 * @example
 * ```tsx
 * <Badge variant="primary">프리미엄</Badge>
 * <Badge variant="success" icon={<CheckIcon />}>완료</Badge>
 * <Badge size="sm" variant="danger">에러</Badge>
 * ```
 */
export function Badge({
  children,
  size = 'md',
  variant = 'primary',
  icon,
  className = '',
  ...props
}: BadgeProps) {
  const baseClass = badgeVariants.base;
  const sizeClass = badgeVariants.size[size];
  const variantClass = badgeVariants.variant[variant];

  const classes = `${baseClass} ${sizeClass} ${variantClass} ${className}`.trim();

  return (
    <span className={classes} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
}
