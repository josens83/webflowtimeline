/**
 * tokenManager 유틸리티 테스트
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tokenManager } from '../tokenManager';

describe('tokenManager', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('setAccessToken / getAccessToken', () => {
    it('should store and retrieve access token', () => {
      const token = 'test-access-token';
      tokenManager.setAccessToken(token);
      expect(tokenManager.getAccessToken()).toBe(token);
    });

    it('should return null when no access token is stored', () => {
      expect(tokenManager.getAccessToken()).toBeNull();
    });
  });

  describe('setRefreshToken / getRefreshToken', () => {
    it('should store and retrieve refresh token', () => {
      const token = 'test-refresh-token';
      tokenManager.setRefreshToken(token);
      expect(tokenManager.getRefreshToken()).toBe(token);
    });

    it('should return null when no refresh token is stored', () => {
      expect(tokenManager.getRefreshToken()).toBeNull();
    });
  });

  describe('setTokens', () => {
    it('should store both access and refresh tokens', () => {
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      tokenManager.setTokens(accessToken, refreshToken);

      expect(tokenManager.getAccessToken()).toBe(accessToken);
      expect(tokenManager.getRefreshToken()).toBe(refreshToken);
    });
  });

  describe('clearTokens', () => {
    it('should remove both tokens from localStorage', () => {
      tokenManager.setTokens('access', 'refresh');
      tokenManager.clearTokens();

      expect(tokenManager.getAccessToken()).toBeNull();
      expect(tokenManager.getRefreshToken()).toBeNull();
    });
  });

  describe('hasTokens', () => {
    it('should return true when both tokens exist', () => {
      tokenManager.setTokens('access', 'refresh');
      expect(tokenManager.hasTokens()).toBe(true);
    });

    it('should return false when access token is missing', () => {
      tokenManager.setRefreshToken('refresh');
      expect(tokenManager.hasTokens()).toBe(false);
    });

    it('should return false when refresh token is missing', () => {
      tokenManager.setAccessToken('access');
      expect(tokenManager.hasTokens()).toBe(false);
    });

    it('should return false when both tokens are missing', () => {
      expect(tokenManager.hasTokens()).toBe(false);
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid non-expired token', () => {
      // Create a token that expires in 1 hour
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const token = `header.${btoa(JSON.stringify({ exp: futureTime }))}.signature`;

      expect(tokenManager.isTokenExpired(token)).toBe(false);
    });

    it('should return true for expired token', () => {
      // Create a token that expired 1 hour ago
      const pastTime = Math.floor(Date.now() / 1000) - 3600;
      const token = `header.${btoa(JSON.stringify({ exp: pastTime }))}.signature`;

      expect(tokenManager.isTokenExpired(token)).toBe(true);
    });

    it('should return true for invalid token', () => {
      expect(tokenManager.isTokenExpired('invalid-token')).toBe(true);
    });

    it('should return true for token without exp claim', () => {
      const token = `header.${btoa(JSON.stringify({ sub: '123' }))}.signature`;
      expect(tokenManager.isTokenExpired(token)).toBe(true);
    });
  });

  describe('decodeToken', () => {
    it('should decode valid JWT token', () => {
      const payload = { sub: '123', name: 'Test User', exp: 1234567890 };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;

      const decoded = tokenManager.decodeToken(token);
      expect(decoded).toEqual(payload);
    });

    it('should return null for invalid token', () => {
      expect(tokenManager.decodeToken('invalid-token')).toBeNull();
    });

    it('should return null for malformed JWT', () => {
      expect(tokenManager.decodeToken('only.two')).toBeNull();
    });
  });
});
