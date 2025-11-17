import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import db from '../config/database';
import { User } from '../types';

const router = Router();

// Middleware to check if user is admin
const isAdmin = (req: AuthRequest, res: Response, next: Function) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Check if user is admin (you can add an is_admin column to users table)
  // For now, check if email ends with specific domain or use environment variable
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',');

  if (!adminEmails.includes(user.email)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

// Get all users (admin only)
router.get('/users', authenticateToken, isAdmin, (req: AuthRequest, res: Response) => {
  db.all(
    `SELECT id, email, name, subscription_status, stripe_customer_id, created_at
     FROM users
     ORDER BY created_at DESC`,
    [],
    (err, users: User[]) => {
      if (err) {
        console.error('Admin - Get users error:', err);
        return res.status(500).json({ error: 'Failed to fetch users' });
      }

      res.json({ users, total: users.length });
    }
  );
});

// Get user stats (admin only)
router.get('/stats', authenticateToken, isAdmin, (req: AuthRequest, res: Response) => {
  const queries = {
    totalUsers: 'SELECT COUNT(*) as count FROM users',
    freeUsers: 'SELECT COUNT(*) as count FROM users WHERE subscription_status = "free"',
    premiumUsers: 'SELECT COUNT(*) as count FROM users WHERE subscription_status = "premium"',
    recentSignups: 'SELECT COUNT(*) as count FROM users WHERE created_at >= datetime("now", "-7 days")'
  };

  const stats: any = {};
  let completed = 0;
  const total = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, query]) => {
    db.get(query, [], (err, row: any) => {
      if (!err) {
        stats[key] = row.count;
      }
      completed++;

      if (completed === total) {
        res.json(stats);
      }
    });
  });
});

// Update user subscription (admin only)
router.put('/users/:id/subscription', authenticateToken, isAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { subscription_status } = req.body;

  if (!['free', 'premium'].includes(subscription_status)) {
    return res.status(400).json({ error: 'Invalid subscription status' });
  }

  db.run(
    'UPDATE users SET subscription_status = ? WHERE id = ?',
    [subscription_status, id],
    function(err) {
      if (err) {
        console.error('Admin - Update subscription error:', err);
        return res.status(500).json({ error: 'Failed to update subscription' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'Subscription updated successfully' });
    }
  );
});

// Delete user (admin only)
router.delete('/users/:id', authenticateToken, isAdmin, (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  // Don't allow deleting yourself
  if (req.user?.id === parseInt(id)) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }

  db.run(
    'DELETE FROM users WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        console.error('Admin - Delete user error:', err);
        return res.status(500).json({ error: 'Failed to delete user' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    }
  );
});

// Get system info (admin only)
router.get('/system', authenticateToken, isAdmin, (req: AuthRequest, res: Response) => {
  const info = {
    nodeVersion: process.version,
    platform: process.platform,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  };

  res.json(info);
});

export default router;
