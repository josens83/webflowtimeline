import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import db from '../config/database';
import { sendContactConfirmationEmail } from '../services/emailService';

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  user_id: number | null;
  admin_reply: string | null;
  created_at: string;
  updated_at: string;
}

// Submit contact form
export const submitContact = (req: AuthRequest, res: Response) => {
  const { name, email, subject, message } = req.body;
  const user_id = req.user?.id || null;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  db.run(
    `INSERT INTO contacts (name, email, subject, message, user_id, status)
     VALUES (?, ?, ?, ?, ?, 'pending')`,
    [name, email, subject, message, user_id],
    async function(err) {
      if (err) {
        console.error('Contact submission error:', err);
        return res.status(500).json({ error: 'Failed to submit contact form' });
      }

      // Send confirmation email (don't wait for it, fire and forget)
      sendContactConfirmationEmail(email, name, subject).catch(emailErr => {
        console.error('Failed to send confirmation email:', emailErr);
        // Don't fail the request if email fails
      });

      res.status(201).json({
        message: 'Contact form submitted successfully',
        contact_id: this.lastID
      });
    }
  );
};

// Get all contacts (admin only)
export const getAllContacts = (req: AuthRequest, res: Response) => {
  const { status, limit = 50, offset = 0 } = req.query;

  let query = `
    SELECT c.*, u.email as user_email
    FROM contacts c
    LEFT JOIN users u ON c.user_id = u.id
  `;
  const params: any[] = [];

  if (status) {
    query += ' WHERE c.status = ?';
    params.push(status);
  }

  query += ' ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));

  db.all(query, params, (err, contacts: Contact[]) => {
    if (err) {
      console.error('Get contacts error:', err);
      return res.status(500).json({ error: 'Failed to fetch contacts' });
    }

    // Get total count
    const countQuery = status
      ? 'SELECT COUNT(*) as count FROM contacts WHERE status = ?'
      : 'SELECT COUNT(*) as count FROM contacts';
    const countParams = status ? [status] : [];

    db.get(countQuery, countParams, (err, row: any) => {
      if (err) {
        console.error('Count contacts error:', err);
        return res.status(500).json({ error: 'Failed to count contacts' });
      }

      res.json({
        contacts,
        total: row.count,
        limit: Number(limit),
        offset: Number(offset)
      });
    });
  });
};

// Get single contact (admin only)
export const getContact = (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  db.get(
    `SELECT c.*, u.email as user_email, u.name as user_name
     FROM contacts c
     LEFT JOIN users u ON c.user_id = u.id
     WHERE c.id = ?`,
    [id],
    (err, contact: Contact) => {
      if (err) {
        console.error('Get contact error:', err);
        return res.status(500).json({ error: 'Failed to fetch contact' });
      }

      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      res.json(contact);
    }
  );
};

// Update contact status (admin only)
export const updateContactStatus = (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, admin_reply } = req.body;

  if (!['pending', 'in_progress', 'resolved', 'closed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const updates: string[] = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
  const params: any[] = [status];

  if (admin_reply !== undefined) {
    updates.push('admin_reply = ?');
    params.push(admin_reply);
  }

  params.push(id);

  db.run(
    `UPDATE contacts SET ${updates.join(', ')} WHERE id = ?`,
    params,
    function(err) {
      if (err) {
        console.error('Update contact error:', err);
        return res.status(500).json({ error: 'Failed to update contact' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      res.json({ message: 'Contact updated successfully' });
    }
  );
};

// Delete contact (admin only)
export const deleteContact = (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  db.run(
    'DELETE FROM contacts WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        console.error('Delete contact error:', err);
        return res.status(500).json({ error: 'Failed to delete contact' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      res.json({ message: 'Contact deleted successfully' });
    }
  );
};

// Get contact statistics (admin only)
export const getContactStats = (req: AuthRequest, res: Response) => {
  const queries = {
    total: 'SELECT COUNT(*) as count FROM contacts',
    pending: 'SELECT COUNT(*) as count FROM contacts WHERE status = "pending"',
    in_progress: 'SELECT COUNT(*) as count FROM contacts WHERE status = "in_progress"',
    resolved: 'SELECT COUNT(*) as count FROM contacts WHERE status = "resolved"',
    recent: 'SELECT COUNT(*) as count FROM contacts WHERE created_at >= datetime("now", "-7 days")'
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
};
