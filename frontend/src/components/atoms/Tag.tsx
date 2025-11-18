/**
 * Tag Component
 * Atomic Design - Atom
 * 작은 태그/라벨 컴포넌트 (Badge보다 작음)
 */

import { HTMLAttributes } from 'react';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** 태그 색상 */
  color?: 'primary' | 'purple' | 'orange' | 'green' | 'blue' | 'red' | 'gray';
  /** 아이콘 */
  icon?: React.ReactNode;
}

const colorClasses = {
  primary: 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300',
  purple: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
  orange: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
  green: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
  blue: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
  red: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
  gray: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
};

/**
 * Tag 컴포넌트
 *
 * @example
 * ```tsx
 * <Tag color="purple">디자인 트렌드</Tag>
 * <Tag color="orange" icon={<IconComponent />}>기술</Tag>
 * ```
 */
export function Tag({
  children,
  color = 'gray',
  icon,
  className = '',
  ...props
}: TagProps) {
  const colorClass = colorClasses[color];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass} ${className}`.trim()}
      {...props}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
}
