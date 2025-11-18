/**
 * Modal Component
 * Atomic Design - Molecule
 * 모달 다이얼로그 컴포넌트 (Focus Trap 포함)
 */

import { HTMLAttributes, useEffect } from 'react';
import { X } from 'lucide-react';
import FocusTrap from 'focus-trap-react';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /** 제목 */
  title?: string;
  /** 크기 */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** 외부 클릭 시 닫기 비활성화 */
  closeOnOverlayClick?: boolean;
  /** Footer 영역 */
  footer?: React.ReactNode;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
};

/**
 * Modal 컴포넌트
 *
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="제목"
 *   footer={<Button onClick={handleSubmit}>확인</Button>}
 * >
 *   모달 내용
 * </Modal>
 * ```
 */
export function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  footer,
  children,
  className = '',
  ...props
}: ModalProps) {
  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClass = sizeClasses[size];

  return (
    <FocusTrap
      focusTrapOptions={{
        initialFocus: false,
        allowOutsideClick: true,
        escapeDeactivates: false, // We handle ESC ourselves
      }}
    >
      <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={closeOnOverlayClick ? onClose : undefined}
          aria-hidden="true"
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full ${sizeClass} ${className}`.trim()}
            onClick={(e) => e.stopPropagation()}
            {...props}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              {title && (
                <h2 id="modal-title" className="text-xl font-semibold">
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-1"
                aria-label="닫기"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </FocusTrap>
  );
}
