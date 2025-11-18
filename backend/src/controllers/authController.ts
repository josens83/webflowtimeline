import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../config/database';
import { User } from '../types';
import { sendWelcomeEmail } from '../services/emailService';

/**
 * JWT Token 생성 함수
 */
const generateTokens = (user: User) => {
  const jwtSecret: jwt.Secret = process.env.JWT_SECRET || 'secret';
  const jwtRefreshSecret: jwt.Secret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

  // Access Token (15분)
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      subscription_status: user.subscription_status
    },
    jwtSecret,
    { expiresIn: '15m' }
  );

  // Refresh Token (7일)
  const refreshToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      type: 'refresh'
    },
    jwtRefreshSecret,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

/**
 * Refresh Token 저장
 */
const saveRefreshToken = (userId: number, refreshToken: string, req: Request): Promise<void> => {
  return new Promise((resolve, reject) => {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';

    db.run(
      `INSERT INTO sessions (user_id, token_hash, ip_address, user_agent, expires_at)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, tokenHash, ipAddress, userAgent, expiresAt.toISOString()],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name],
      async function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Registration failed' });
        }

        const userId = this.lastID;
        const user: User = {
          id: userId,
          email,
          name,
          subscription_status: 'free',
          password: hashedPassword,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);

        // Save refresh token
        try {
          await saveRefreshToken(userId, refreshToken, req);

          // Send welcome email (fire and forget)
          sendWelcomeEmail(email, name).catch(emailErr => {
            console.error('Failed to send welcome email:', emailErr);
          });

          res.status(201).json({
            message: 'User registered successfully',
            accessToken,
            refreshToken,
            user: {
              id: userId,
              email,
              name,
              subscription_status: 'free'
            }
          });
        } catch (tokenErr) {
          console.error('Failed to save refresh token:', tokenErr);
          return res.status(500).json({ error: 'Registration failed' });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, user: User) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user);

      // Save refresh token
      try {
        await saveRefreshToken(user.id, refreshToken, req);

        res.json({
          message: 'Login successful',
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            subscription_status: user.subscription_status
          }
        });
      } catch (tokenErr) {
        console.error('Failed to save refresh token:', tokenErr);
        return res.status(500).json({ error: 'Login failed' });
      }
    }
  );
};

export const getProfile = (req: Request, res: Response) => {
  const user = (req as any).user;

  db.get(
    'SELECT id, email, name, subscription_status, created_at FROM users WHERE id = ?',
    [user.id],
    (err, userData: User) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      if (!userData) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(userData);
    }
  );
};

export const updateProfile = (req: Request, res: Response) => {
  const user = (req as any).user;
  const { name, email } = req.body;

  if (!name && !email) {
    return res.status(400).json({ error: 'At least one field (name or email) is required' });
  }

  const updates: string[] = [];
  const params: any[] = [];

  if (name) {
    updates.push('name = ?');
    params.push(name);
  }

  if (email) {
    updates.push('email = ?');
    params.push(email);
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(user.id);

  db.run(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
    params,
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        console.error('Update profile error:', err);
        return res.status(500).json({ error: 'Failed to update profile' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Fetch updated user data
      db.get(
        'SELECT id, email, name, subscription_status, created_at FROM users WHERE id = ?',
        [user.id],
        (err, userData: User) => {
          if (err) {
            return res.status(500).json({ error: 'Server error' });
          }

          res.json({
            message: 'Profile updated successfully',
            user: userData
          });
        }
      );
    }
  );
};

export const changePassword = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  // Verify current password
  db.get(
    'SELECT password FROM users WHERE id = ?',
    [user.id],
    async (err, userData: User) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      if (!userData) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isValidPassword = await bcrypt.compare(currentPassword, userData.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      db.run(
        'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [hashedPassword, user.id],
        function(err) {
          if (err) {
            console.error('Change password error:', err);
            return res.status(500).json({ error: 'Failed to change password' });
          }

          res.json({ message: 'Password changed successfully' });
        }
      );
    }
  );
};

/**
 * Refresh Token으로 새로운 Access Token 발급
 */
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  try {
    const jwtRefreshSecret: jwt.Secret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, jwtRefreshSecret) as any;

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token type' });
    }

    // Check if refresh token exists in database
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    db.get(
      `SELECT s.*, u.* FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.token_hash = ? AND s.expires_at > datetime('now')`,
      [tokenHash],
      (err, row: any) => {
        if (err) {
          console.error('Refresh token lookup error:', err);
          return res.status(500).json({ error: 'Server error' });
        }

        if (!row) {
          return res.status(401).json({ error: 'Invalid or expired refresh token' });
        }

        const user: User = {
          id: row.id,
          email: row.email,
          name: row.name,
          subscription_status: row.subscription_status,
          password: row.password,
          created_at: row.created_at,
          updated_at: row.updated_at
        };

        // Generate new access token
        const { accessToken } = generateTokens(user);

        res.json({
          message: 'Token refreshed successfully',
          accessToken
        });
      }
    );
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Refresh token expired' });
    }
    console.error('Refresh token error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Logout - Refresh Token 무효화
 */
export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  try {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    db.run(
      'DELETE FROM sessions WHERE token_hash = ?',
      [tokenHash],
      function(err) {
        if (err) {
          console.error('Logout error:', err);
          return res.status(500).json({ error: 'Logout failed' });
        }

        res.json({ message: 'Logged out successfully' });
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * 모든 세션 로그아웃 (모든 디바이스)
 */
export const logoutAll = async (req: Request, res: Response) => {
  const user = (req as any).user;

  db.run(
    'DELETE FROM sessions WHERE user_id = ?',
    [user.id],
    function(err) {
      if (err) {
        console.error('Logout all error:', err);
        return res.status(500).json({ error: 'Logout failed' });
      }

      res.json({
        message: 'Logged out from all devices successfully',
        sessionsRemoved: this.changes
      });
    }
  );
};
