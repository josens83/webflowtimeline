import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../types';
import db from '../config/database';
import { log } from '../config/logger';

/**
 * OAuth 콜백 후 JWT 토큰 생성 및 리다이렉트
 */
export const handleOAuthCallback = (req: Request, res: Response) => {
  const user = req.user as User;

  if (!user) {
    log.error('OAuth callback: No user found in request');
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }

  try {
    const jwtSecret: jwt.Secret = process.env.JWT_SECRET || 'secret';
    const jwtRefreshSecret: jwt.Secret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

    // Access Token (15분)
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        subscription_status: user.subscription_status,
      },
      jwtSecret,
      { expiresIn: '15m' }
    );

    // Refresh Token (7일)
    const refreshToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        type: 'refresh',
      },
      jwtRefreshSecret,
      { expiresIn: '7d' }
    );

    // Save refresh token to database
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';

    db.run(
      `INSERT INTO sessions (user_id, token_hash, ip_address, user_agent, expires_at)
       VALUES (?, ?, ?, ?, ?)`,
      [user.id, tokenHash, ipAddress, userAgent, expiresAt.toISOString()],
      (err) => {
        if (err) {
          log.error('Failed to save refresh token after OAuth', { error: err.message });
        }
      }
    );

    log.info('OAuth login successful', {
      userId: user.id,
      email: user.email,
    });

    // Redirect to frontend with tokens
    const redirectUrl = `${process.env.FRONTEND_URL}/oauth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`;
    res.redirect(redirectUrl);
  } catch (error) {
    log.error('OAuth callback error', { error });
    res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
  }
};

/**
 * OAuth 실패 핸들러
 */
export const handleOAuthFailure = (req: Request, res: Response) => {
  log.warn('OAuth authentication failed', {
    query: req.query,
  });

  res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
};
