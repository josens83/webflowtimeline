import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database';
import { User } from '../types';

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
