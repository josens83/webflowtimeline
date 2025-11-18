/**
 * FilterButton Component
 * Atomic Design - Molecule
 * 필터링용 토글 버튼
 */

import { Button, ButtonProps } from '../atoms/Button';

export interface FilterButtonProps extends Omit<ButtonProps, 'variant'> {
  /** 활성화 여부 */
  isActive: boolean;
  /** 활성화 시 gradient */
  activeGradient?: string;
  /** 아이콘/이모지 */
  icon?: React.ReactNode;
}

/**
 * FilterButton 컴포넌트
 *
 * @example
 * ```tsx
 * <FilterButton
 *   isActive={selectedDecade === '2020s'}
 *   activeGradient="from-green-500 to-teal-500"
 *   onClick={() => setSelectedDecade('2020s')}
 * >
 *   2020년대
 * </FilterButton>
 * ```
 */
export function FilterButton({
  children,
  isActive,
  activeGradient,
  icon,
  className = '',
  ...props
}: FilterButtonProps) {
  const baseClass = 'transition-all transform hover:scale-105';

  const activeClass = activeGradient
    ? `bg-gradient-to-r ${activeGradient} text-white shadow-lg`
    : 'bg-primary-600 text-white shadow-lg';

  const inactiveClass = 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md';

  return (
    <Button
      variant="ghost"
      className={`${baseClass} ${isActive ? activeClass : inactiveClass} ${className}`.trim()}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Button>
  );
}
