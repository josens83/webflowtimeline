/**
 * SearchInput Component
 * Atomic Design - Molecule
 * 검색 아이콘이 포함된 검색 입력 필드
 */

import { Search } from 'lucide-react';
import { Input, InputProps } from '../atoms/Input';

export interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  /** 검색 placeholder */
  placeholder?: string;
}

/**
 * SearchInput 컴포넌트
 *
 * @example
 * ```tsx
 * <SearchInput
 *   value={searchQuery}
 *   onChange={(e) => setSearchQuery(e.target.value)}
 *   placeholder="검색..."
 * />
 * ```
 */
export function SearchInput({
  placeholder = '검색...',
  ...props
}: SearchInputProps) {
  return (
    <Input
      leftIcon={<Search className="w-5 h-5" />}
      placeholder={placeholder}
      {...props}
    />
  );
}
