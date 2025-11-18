/**
 * errorHandler 유틸리티 테스트
 */

import { describe, it, expect } from 'vitest';
import { AxiosError } from 'axios';
import { handleApiError, isUnauthorizedError, getStatusMessage } from '../errorHandler';

describe('errorHandler', () => {
  describe('getStatusMessage', () => {
    it('should return correct message for common status codes', () => {
      expect(getStatusMessage(400)).toBe('잘못된 요청입니다.');
      expect(getStatusMessage(401)).toBe('인증이 필요합니다. 다시 로그인해주세요.');
      expect(getStatusMessage(403)).toBe('접근 권한이 없습니다.');
      expect(getStatusMessage(404)).toBe('요청한 리소스를 찾을 수 없습니다.');
      expect(getStatusMessage(500)).toBe('서버 오류가 발생했습니다.');
    });

    it('should return default message for unknown status code', () => {
      expect(getStatusMessage(418)).toBe('오류가 발생했습니다 (418)');
    });
  });

  describe('isUnauthorizedError', () => {
    it('should return true for 401 Axios error', () => {
      const error = {
        isAxiosError: true,
        response: { status: 401 },
      } as AxiosError;

      expect(isUnauthorizedError(error)).toBe(true);
    });

    it('should return false for non-401 Axios error', () => {
      const error = {
        isAxiosError: true,
        response: { status: 404 },
      } as AxiosError;

      expect(isUnauthorizedError(error)).toBe(false);
    });

    it('should return false for non-Axios error', () => {
      const error = new Error('Regular error');
      expect(isUnauthorizedError(error)).toBe(false);
    });

    it('should return false for Axios error without response', () => {
      const error = {
        isAxiosError: true,
        response: undefined,
      } as AxiosError;

      expect(isUnauthorizedError(error)).toBe(false);
    });
  });

  describe('handleApiError', () => {
    it('should handle Axios error with custom error message', () => {
      const error = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { error: '이메일이 이미 존재합니다.' },
        },
      } as AxiosError;

      expect(handleApiError(error)).toBe('이메일이 이미 존재합니다.');
    });

    it('should handle Axios error with message field', () => {
      const error = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: '비밀번호가 일치하지 않습니다.' },
        },
      } as AxiosError;

      expect(handleApiError(error)).toBe('비밀번호가 일치하지 않습니다.');
    });

    it('should handle network error (no response)', () => {
      const error = {
        isAxiosError: true,
        response: undefined,
      } as AxiosError;

      expect(handleApiError(error)).toBe('네트워크 연결을 확인해주세요.');
    });

    it('should handle unknown error', () => {
      const error = new Error('Something went wrong');
      expect(handleApiError(error)).toBe('알 수 없는 오류가 발생했습니다.');
    });

    it('should handle Axios error without custom message', () => {
      const error = {
        isAxiosError: true,
        response: {
          status: 500,
          data: {},
        },
      } as AxiosError;

      expect(handleApiError(error)).toBe('서버 오류가 발생했습니다.');
    });
  });
});
