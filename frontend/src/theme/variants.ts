/**
 * Component Variants
 * 컴포넌트 스타일 변형 정의
 */

// ==========================================
// Button Variants
// ==========================================
export const buttonVariants = {
  // Base styles
  base: 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',

  // Size variants
  size: {
    xs: 'px-2.5 py-1.5 text-xs rounded-md',
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-lg',
    xl: 'px-8 py-4 text-xl rounded-xl',
  },

  // Color variants
  variant: {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 focus:ring-primary-500',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500',
    link: 'text-primary-600 hover:underline focus:ring-0',
  },
} as const;

// ==========================================
// Input Variants
// ==========================================
export const inputVariants = {
  base: 'w-full border transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed',

  size: {
    sm: 'px-3 py-2 text-sm rounded-md',
    md: 'px-4 py-3 text-base rounded-lg',
    lg: 'px-5 py-4 text-lg rounded-lg',
  },

  variant: {
    default: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-primary-500 focus:border-transparent',
    error: 'border-red-500 bg-white dark:bg-gray-700 focus:ring-red-500 focus:border-transparent',
    success: 'border-green-500 bg-white dark:bg-gray-700 focus:ring-green-500 focus:border-transparent',
  },
} as const;

// ==========================================
// Card Variants
// ==========================================
export const cardVariants = {
  base: 'bg-white dark:bg-gray-800 rounded-xl transition-all duration-200',

  variant: {
    default: 'border border-gray-200 dark:border-gray-700',
    elevated: 'shadow-lg hover:shadow-xl',
    flat: 'border-0',
    outline: 'border-2 border-primary-200 dark:border-primary-800',
  },

  padding: {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  },
} as const;

// ==========================================
// Badge Variants
// ==========================================
export const badgeVariants = {
  base: 'inline-flex items-center font-medium rounded-full',

  size: {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  },

  variant: {
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  },
} as const;

// ==========================================
// Alert Variants
// ==========================================
export const alertVariants = {
  base: 'p-4 rounded-lg border',

  variant: {
    info: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200',
    success: 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200',
    error: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200',
  },
} as const;
