/**
 * Card Component
 * Atomic Design - Molecule
 * 재사용 가능한 카드 컴포넌트
 */

import { HTMLAttributes } from 'react';
import { cardVariants } from '../../theme/variants';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** 카드 스타일 변형 */
  variant?: keyof typeof cardVariants.variant;
  /** 카드 내부 패딩 */
  padding?: keyof typeof cardVariants.padding;
  /** 호버 효과 */
  hoverable?: boolean;
}

/**
 * Card 컴포넌트
 *
 * @example
 * ```tsx
 * <Card variant="elevated" padding="lg">
 *   <h3>제목</h3>
 *   <p>내용</p>
 * </Card>
 * ```
 */
export function Card({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  ...props
}: CardProps) {
  const baseClass = cardVariants.base;
  const variantClass = cardVariants.variant[variant];
  const paddingClass = cardVariants.padding[padding];
  const hoverClass = hoverable ? 'cursor-pointer hover:scale-[1.02]' : '';

  const classes = `${baseClass} ${variantClass} ${paddingClass} ${hoverClass} ${className}`.trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

/**
 * CardHeader 컴포넌트
 */
export function CardHeader({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

/**
 * CardBody 컴포넌트
 */
export function CardBody({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

/**
 * CardFooter 컴포넌트
 */
export function CardFooter({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
