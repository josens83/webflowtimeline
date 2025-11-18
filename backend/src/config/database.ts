import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../database.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

function initDatabase() {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      subscription_status TEXT DEFAULT 'free',
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      google_id TEXT UNIQUE,
      kakao_id TEXT UNIQUE,
      email_verified INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Users table creation error:', err);
    else {
      // Create indexes for users table
      db.run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
      db.run('CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_status)');
      db.run('CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id)');
      db.run('CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at)');
      db.run('CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)');
      db.run('CREATE INDEX IF NOT EXISTS idx_users_kakao_id ON users(kakao_id)');

      // Add columns if they don't exist (for existing databases)
      db.run('ALTER TABLE users ADD COLUMN google_id TEXT', () => {});
      db.run('ALTER TABLE users ADD COLUMN kakao_id TEXT', () => {});
      db.run('ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0', () => {});
    }
  });

  // Trends data table
  db.run(`
    CREATE TABLE IF NOT EXISTS trends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      decade TEXT NOT NULL,
      country TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      websites TEXT NOT NULL,
      design_trends TEXT NOT NULL,
      tech_stack TEXT NOT NULL,
      user_behavior TEXT NOT NULL,
      market_share REAL,
      is_premium INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Trends table creation error:', err);
    else {
      // Create indexes for trends table
      db.run('CREATE INDEX IF NOT EXISTS idx_trends_decade ON trends(decade)');
      db.run('CREATE INDEX IF NOT EXISTS idx_trends_country ON trends(country)');
      db.run('CREATE INDEX IF NOT EXISTS idx_trends_is_premium ON trends(is_premium)');
      db.run('CREATE INDEX IF NOT EXISTS idx_trends_decade_country ON trends(decade, country)');
    }
  });

  // Contacts table for customer inquiries
  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      user_id INTEGER,
      admin_reply TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `, (err) => {
    if (err) console.error('Contacts table creation error:', err);
    else {
      // Create indexes for contacts table
      db.run('CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status)');
      db.run('CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id)');
      db.run('CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at)');
      db.run('CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)');
    }
  });

  // Sessions table for better auth management
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token_hash TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) console.error('Sessions table creation error:', err);
    else {
      db.run('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)');
      db.run('CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash)');
      db.run('CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)');
    }
  });

  // Activity logs for monitoring
  db.run(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      resource TEXT,
      details TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `, (err) => {
    if (err) console.error('Activity logs table creation error:', err);
    else {
      db.run('CREATE INDEX IF NOT EXISTS idx_activity_user_id ON activity_logs(user_id)');
      db.run('CREATE INDEX IF NOT EXISTS idx_activity_action ON activity_logs(action)');
      db.run('CREATE INDEX IF NOT EXISTS idx_activity_created_at ON activity_logs(created_at)');
    }
  });

  console.log('✅ Database tables initialized with indexes');
}

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});

export default db;
