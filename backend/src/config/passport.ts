import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import db from './database';
import { User } from '../types';
import { log } from './logger';

/**
 * Passport OAuth 설정
 * - Google OAuth 2.0
 * - Kakao OAuth 2.0
 */

/**
 * Passport 초기화
 */
export function initPassport() {
  // Serialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser((id: number, done) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, user: User) => {
      done(err, user);
    });
  });

  // ==========================================
  // Google OAuth Strategy
  // ==========================================
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            const name = profile.displayName;
            const googleId = profile.id;
            const avatar = profile.photos?.[0]?.value;

            if (!email) {
              return done(new Error('No email found in Google profile'));
            }

            // Check if user exists
            db.get(
              'SELECT * FROM users WHERE email = ? OR google_id = ?',
              [email, googleId],
              (err, existingUser: User) => {
                if (err) {
                  log.error('Database error in Google OAuth', { error: err.message });
                  return done(err);
                }

                if (existingUser) {
                  // Update Google ID if not set
                  if (!existingUser.google_id) {
                    db.run(
                      'UPDATE users SET google_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                      [googleId, existingUser.id],
                      (updateErr) => {
                        if (updateErr) {
                          log.error('Failed to update Google ID', { error: updateErr.message });
                        }
                      }
                    );
                  }

                  log.info('User logged in via Google', {
                    userId: existingUser.id,
                    email: existingUser.email,
                  });

                  return done(null, existingUser);
                }

                // Create new user
                db.run(
                  `INSERT INTO users (email, name, google_id, email_verified, subscription_status, password)
                   VALUES (?, ?, ?, 1, 'free', '')`,
                  [email, name, googleId],
                  function (insertErr) {
                    if (insertErr) {
                      log.error('Failed to create user via Google OAuth', { error: insertErr.message });
                      return done(insertErr);
                    }

                    const newUser: User = {
                      id: this.lastID,
                      email,
                      name,
                      google_id: googleId,
                      subscription_status: 'free',
                      password: '',
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    };

                    log.info('New user created via Google', {
                      userId: newUser.id,
                      email: newUser.email,
                    });

                    done(null, newUser);
                  }
                );
              }
            );
          } catch (error) {
            log.error('Google OAuth error', { error });
            done(error as Error);
          }
        }
      )
    );

    log.info('Google OAuth strategy initialized');
  } else {
    log.warn('Google OAuth not configured (missing credentials)');
  }

  // ==========================================
  // Kakao OAuth Strategy
  // ==========================================
  if (process.env.KAKAO_CLIENT_ID) {
    passport.use(
      new KakaoStrategy(
        {
          clientID: process.env.KAKAO_CLIENT_ID,
          clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
          callbackURL: process.env.KAKAO_CALLBACK_URL || 'http://localhost:3001/api/auth/kakao/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const kakaoAccount = profile._json?.kakao_account;
            const email = kakaoAccount?.email;
            const name = kakaoAccount?.profile?.nickname || profile.displayName;
            const kakaoId = profile.id;

            if (!email) {
              return done(new Error('No email found in Kakao profile. Please allow email access.'));
            }

            // Check if user exists
            db.get(
              'SELECT * FROM users WHERE email = ? OR kakao_id = ?',
              [email, kakaoId],
              (err, existingUser: User) => {
                if (err) {
                  log.error('Database error in Kakao OAuth', { error: err.message });
                  return done(err);
                }

                if (existingUser) {
                  // Update Kakao ID if not set
                  if (!existingUser.kakao_id) {
                    db.run(
                      'UPDATE users SET kakao_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                      [kakaoId, existingUser.id],
                      (updateErr) => {
                        if (updateErr) {
                          log.error('Failed to update Kakao ID', { error: updateErr.message });
                        }
                      }
                    );
                  }

                  log.info('User logged in via Kakao', {
                    userId: existingUser.id,
                    email: existingUser.email,
                  });

                  return done(null, existingUser);
                }

                // Create new user
                db.run(
                  `INSERT INTO users (email, name, kakao_id, email_verified, subscription_status, password)
                   VALUES (?, ?, ?, 1, 'free', '')`,
                  [email, name, kakaoId],
                  function (insertErr) {
                    if (insertErr) {
                      log.error('Failed to create user via Kakao OAuth', { error: insertErr.message });
                      return done(insertErr);
                    }

                    const newUser: User = {
                      id: this.lastID,
                      email,
                      name,
                      kakao_id: kakaoId,
                      subscription_status: 'free',
                      password: '',
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    };

                    log.info('New user created via Kakao', {
                      userId: newUser.id,
                      email: newUser.email,
                    });

                    done(null, newUser);
                  }
                );
              }
            );
          } catch (error) {
            log.error('Kakao OAuth error', { error });
            done(error as Error);
          }
        }
      )
    );

    log.info('Kakao OAuth strategy initialized');
  } else {
    log.warn('Kakao OAuth not configured (missing credentials)');
  }
}

export default passport;
