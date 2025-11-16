import { Request, Response } from 'express';
import db from '../config/database';
import { TrendData } from '../types';
import { AuthRequest } from '../middleware/auth';

export const getAllTrends = (req: AuthRequest, res: Response) => {
  const user = req.user;
  const isPremium = user?.subscription_status === 'premium';

  // Free users can only see non-premium content
  const query = isPremium
    ? 'SELECT * FROM trends ORDER BY decade, country'
    : 'SELECT * FROM trends WHERE is_premium = 0 ORDER BY decade, country';

  db.all(query, [], (err, rows: any[]) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch trends' });
    }

    const trends = rows.map(row => ({
      ...row,
      websites: JSON.parse(row.websites),
      design_trends: JSON.parse(row.design_trends),
      tech_stack: JSON.parse(row.tech_stack),
      user_behavior: JSON.parse(row.user_behavior),
      is_premium: Boolean(row.is_premium)
    }));

    res.json({
      trends,
      user_tier: isPremium ? 'premium' : 'free'
    });
  });
};

export const getTrendsByDecade = (req: AuthRequest, res: Response) => {
  const { decade } = req.params;
  const user = req.user;
  const isPremium = user?.subscription_status === 'premium';

  const query = isPremium
    ? 'SELECT * FROM trends WHERE decade = ? ORDER BY country'
    : 'SELECT * FROM trends WHERE decade = ? AND is_premium = 0 ORDER BY country';

  db.all(query, [decade], (err, rows: any[]) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch trends' });
    }

    const trends = rows.map(row => ({
      ...row,
      websites: JSON.parse(row.websites),
      design_trends: JSON.parse(row.design_trends),
      tech_stack: JSON.parse(row.tech_stack),
      user_behavior: JSON.parse(row.user_behavior),
      is_premium: Boolean(row.is_premium)
    }));

    res.json({
      decade,
      trends,
      user_tier: isPremium ? 'premium' : 'free'
    });
  });
};

export const getTrendsByCountry = (req: AuthRequest, res: Response) => {
  const { country } = req.params;
  const user = req.user;
  const isPremium = user?.subscription_status === 'premium';

  const query = isPremium
    ? 'SELECT * FROM trends WHERE country = ? ORDER BY decade'
    : 'SELECT * FROM trends WHERE country = ? AND is_premium = 0 ORDER BY decade';

  db.all(query, [country], (err, rows: any[]) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch trends' });
    }

    const trends = rows.map(row => ({
      ...row,
      websites: JSON.parse(row.websites),
      design_trends: JSON.parse(row.design_trends),
      tech_stack: JSON.parse(row.tech_stack),
      user_behavior: JSON.parse(row.user_behavior),
      is_premium: Boolean(row.is_premium)
    }));

    res.json({
      country,
      trends,
      user_tier: isPremium ? 'premium' : 'free'
    });
  });
};

export const compareTrends = (req: AuthRequest, res: Response) => {
  const { countries, decade } = req.query;

  if (!countries || !decade) {
    return res.status(400).json({
      error: 'Countries and decade parameters are required'
    });
  }

  const countryList = (countries as string).split(',');
  const placeholders = countryList.map(() => '?').join(',');

  const query = `
    SELECT * FROM trends
    WHERE decade = ? AND country IN (${placeholders})
    ORDER BY country
  `;

  db.all(query, [decade, ...countryList], (err, rows: any[]) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to compare trends' });
    }

    const trends = rows.map(row => ({
      ...row,
      websites: JSON.parse(row.websites),
      design_trends: JSON.parse(row.design_trends),
      tech_stack: JSON.parse(row.tech_stack),
      user_behavior: JSON.parse(row.user_behavior),
      is_premium: Boolean(row.is_premium)
    }));

    res.json({
      decade,
      countries: countryList,
      comparison: trends
    });
  });
};
