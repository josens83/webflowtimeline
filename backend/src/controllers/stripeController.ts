import { Request, Response } from 'express';
import Stripe from 'stripe';
import db from '../config/database';
import { AuthRequest } from '../middleware/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia'
});

export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Get or create Stripe customer
    let customerId: string;

    const dbUser: any = await new Promise((resolve, reject) => {
      db.get(
        'SELECT stripe_customer_id FROM users WHERE id = ?',
        [user.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (dbUser.stripe_customer_id) {
      customerId = dbUser.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id.toString()
        }
      });
      customerId = customer.id;

      await new Promise((resolve, reject) => {
        db.run(
          'UPDATE users SET stripe_customer_id = ? WHERE id = ?',
          [customerId, user.id],
          (err) => {
            if (err) reject(err);
            else resolve(true);
          }
        );
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: {
        userId: user.id.toString()
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

export const createPortalSession = async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const dbUser: any = await new Promise((resolve, reject) => {
      db.get(
        'SELECT stripe_customer_id FROM users WHERE id = ?',
        [user.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!dbUser.stripe_customer_id) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/account`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
};

export const webhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).send('No signature');
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId && session.subscription) {
          await new Promise((resolve, reject) => {
            db.run(
              `UPDATE users
               SET subscription_status = 'premium',
                   stripe_subscription_id = ?,
                   updated_at = CURRENT_TIMESTAMP
               WHERE id = ?`,
              [session.subscription, userId],
              (err) => {
                if (err) reject(err);
                else resolve(true);
              }
            );
          });
        }
        break;
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const status = subscription.status === 'active' ? 'premium' : 'free';

        await new Promise((resolve, reject) => {
          db.run(
            `UPDATE users
             SET subscription_status = ?,
                 updated_at = CURRENT_TIMESTAMP
             WHERE stripe_customer_id = ?`,
            [status, customerId],
            (err) => {
              if (err) reject(err);
              else resolve(true);
            }
          );
        });
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send('Webhook Error');
  }
};
