import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database';
import { User } from '../types';
import { sendWelcomeEmail } from '../services/emailService';

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
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Registration failed' });
        }

        const jwtSecret: jwt.Secret = process.env.JWT_SECRET || 'secret';
        const jwtExpiresIn: string | number = process.env.JWT_EXPIRES_IN || '7d';

        // @ts-ignore: TypeScript has issues with jwt.sign overloads
        const token = jwt.sign(
          {
            id: this.lastID,
            email,
            subscription_status: 'free'
          },
          jwtSecret,
          { expiresIn: jwtExpiresIn }
        );

        // Send welcome email (fire and forget)
        sendWelcomeEmail(email, name).catch(emailErr => {
          console.error('Failed to send welcome email:', emailErr);
          // Don't fail the registration if email fails
        });

        res.status(201).json({
          message: 'User registered successfully',
          token,
          user: {
            id: this.lastID,
            email,
            name,
            subscription_status: 'free'
          }
        });
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

      const jwtSecret: jwt.Secret = process.env.JWT_SECRET || 'secret';
      const jwtExpiresIn: string | number = process.env.JWT_EXPIRES_IN || '7d';

      // @ts-ignore: TypeScript has issues with jwt.sign overloads
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          subscription_status: user.subscription_status
        },
        jwtSecret,
        { expiresIn: jwtExpiresIn }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          subscription_status: user.subscription_status
        }
      });
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
