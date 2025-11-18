import { AxiosError } from 'axios';
import { ApiError } from '../types/api.types';
import { toast } from 'react-toastify';

/**
 * API 에러 핸들러
 * Axios 에러를 사용자 친화적인 메시지로 변환
 */
export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    // 네트워크 에러
    if (!error.response) {
      return '네트워크 연결을 확인해주세요.';
    }

    const apiError = error.response.data as ApiError;

    // API 에러 메시지 우선순위: error > message > 기본 메시지
    return (
      apiError.error ||
      apiError.message ||
      getStatusMessage(error.response.status)
    );
  }

  // 알 수 없는 에러
  return '알 수 없는 오류가 발생했습니다.';
}

/**
 * HTTP 상태 코드별 기본 메시지
 */
function getStatusMessage(status: number): string {
  const messages: Record<number, string> = {
    400: '잘못된 요청입니다.',
    401: '인증이 필요합니다. 다시 로그인해주세요.',
    403: '접근 권한이 없습니다.',
    404: '요청한 리소스를 찾을 수 없습니다.',
    409: '이미 존재하는 데이터입니다.',
    429: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
    500: '서버 오류가 발생했습니다.',
    502: '서버에 연결할 수 없습니다.',
    503: '서비스를 일시적으로 사용할 수 없습니다.',
  };

  return messages[status] || `오류가 발생했습니다 (${status})`;
}

/**
 * 에러를 토스트로 표시
 */
export function showErrorToast(error: unknown): void {
  const message = handleApiError(error);
  toast.error(message);
}

/**
 * 성공 메시지를 토스트로 표시
 */
export function showSuccessToast(message: string): void {
  toast.success(message);
}

/**
 * 정보 메시지를 토스트로 표시
 */
export function showInfoToast(message: string): void {
  toast.info(message);
}

/**
 * 에러가 401 (Unauthorized)인지 확인
 */
export function isUnauthorizedError(error: unknown): boolean {
  return (
    error instanceof AxiosError && error.response?.status === 401
  );
}

/**
 * 에러가 403 (Forbidden)인지 확인
 */
export function isForbiddenError(error: unknown): boolean {
  return (
    error instanceof AxiosError && error.response?.status === 403
  );
}

/**
 * 에러가 네트워크 에러인지 확인
 */
export function isNetworkError(error: unknown): boolean {
  return (
    error instanceof AxiosError && !error.response
  );
}
