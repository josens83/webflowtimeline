import { Pool, PoolConfig } from 'pg';

// PostgreSQL connection configuration
const poolConfig: PoolConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'webtrends',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD,

  // Connection pool settings
  max: parseInt(process.env.DB_POOL_MAX || '20'),
  min: parseInt(process.env.DB_POOL_MIN || '5'),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000'),

  // SSL configuration (for production)
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
};

// Create connection pool
export const pool = new Pool(poolConfig);

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected PostgreSQL error:', err);
  process.exit(-1);
});

// Initialize database schema
export async function initPostgresDatabase() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        subscription_status VARCHAR(50) DEFAULT 'free',
        stripe_customer_id VARCHAR(255),
        stripe_subscription_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for users
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC)');

    // Trends table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trends (
        id SERIAL PRIMARY KEY,
        decade VARCHAR(10) NOT NULL,
        country VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        websites TEXT NOT NULL,
        design_trends TEXT NOT NULL,
        tech_stack TEXT NOT NULL,
        user_behavior TEXT NOT NULL,
        market_share DECIMAL(5,2),
        is_premium BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for trends
    await client.query('CREATE INDEX IF NOT EXISTS idx_trends_decade ON trends(decade)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_trends_country ON trends(country)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_trends_is_premium ON trends(is_premium)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_trends_decade_country ON trends(decade, country)');

    // Contacts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        admin_reply TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for contacts
    await client.query('CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)');

    // Sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for sessions
    await client.query('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)');

    // Activity logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(100) NOT NULL,
        resource VARCHAR(100),
        details JSONB,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for activity logs
    await client.query('CREATE INDEX IF NOT EXISTS idx_activity_user_id ON activity_logs(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_activity_action ON activity_logs(action)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_activity_created_at ON activity_logs(created_at DESC)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_activity_details ON activity_logs USING GIN(details)');

    await client.query('COMMIT');
    console.log('✅ PostgreSQL database tables initialized with indexes');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error initializing PostgreSQL database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Query helper function
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    // Log slow queries (> 1000ms)
    if (duration > 1000) {
      console.warn(`⚠️  Slow query (${duration}ms):`, text.substring(0, 100));
    }

    return result;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await pool.end();
  console.log('PostgreSQL pool closed');
  process.exit(0);
});

export default pool;
