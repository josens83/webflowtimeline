# 🗄️ Database Schema Documentation

## Overview

Web Trends Timeline uses a relational database with the following structure:

- **Development**: SQLite (file-based, simple setup)
- **Production**: PostgreSQL (scalable, production-ready)

## 📊 Database Tables

### 1. **users** - User Accounts

Stores user authentication and subscription information.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER/SERIAL | Primary key |
| email | TEXT/VARCHAR(255) | Unique email address (indexed) |
| password | TEXT/VARCHAR(255) | Bcrypt hashed password |
| name | TEXT/VARCHAR(255) | User's full name |
| subscription_status | TEXT/VARCHAR(50) | 'free' or 'premium' (indexed) |
| stripe_customer_id | TEXT/VARCHAR(255) | Stripe customer ID (indexed) |
| stripe_subscription_id | TEXT/VARCHAR(255) | Stripe subscription ID |
| created_at | DATETIME/TIMESTAMP | Account creation timestamp (indexed) |
| updated_at | DATETIME/TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_users_email` - Fast email lookup for authentication
- `idx_users_subscription` - Filter users by subscription status
- `idx_users_stripe_customer` - Stripe integration queries
- `idx_users_created_at` - Sort by registration date

### 2. **trends** - Web Trend Data

Stores historical web trend information by decade and country.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER/SERIAL | Primary key |
| decade | TEXT/VARCHAR(10) | Time period (1990s, 2000s, etc.) (indexed) |
| country | TEXT/VARCHAR(50) | Country code (Korea, USA, etc.) (indexed) |
| title | TEXT/VARCHAR(255) | Trend title |
| description | TEXT | Detailed description |
| websites | TEXT | JSON array of popular websites |
| design_trends | TEXT | Design patterns and styles |
| tech_stack | TEXT | Technologies used |
| user_behavior | TEXT | User interaction patterns |
| market_share | REAL/DECIMAL(5,2) | Market percentage |
| is_premium | INTEGER/BOOLEAN | Premium content flag (indexed) |
| created_at | DATETIME/TIMESTAMP | Creation timestamp |

**Indexes:**
- `idx_trends_decade` - Filter by time period
- `idx_trends_country` - Filter by country
- `idx_trends_is_premium` - Separate free/premium content
- `idx_trends_decade_country` - Combined filter (composite index)

### 3. **contacts** - Customer Inquiries

Stores user support requests and inquiries.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER/SERIAL | Primary key |
| name | TEXT/VARCHAR(255) | Contact person name |
| email | TEXT/VARCHAR(255) | Contact email (indexed) |
| subject | TEXT/VARCHAR(255) | Inquiry category |
| message | TEXT | Detailed message |
| status | TEXT/VARCHAR(50) | 'pending', 'in_progress', 'resolved', 'closed' (indexed) |
| user_id | INTEGER | Foreign key to users (nullable, indexed) |
| admin_reply | TEXT | Admin response |
| created_at | DATETIME/TIMESTAMP | Submission timestamp (indexed) |
| updated_at | DATETIME/TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_contacts_status` - Filter by resolution status
- `idx_contacts_user_id` - Find user's inquiries
- `idx_contacts_created_at` - Sort by submission date
- `idx_contacts_email` - Lookup by email

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE SET NULL

### 4. **sessions** - Authentication Sessions

Tracks active user sessions for better security management.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER/SERIAL | Primary key |
| user_id | INTEGER | Foreign key to users (indexed) |
| token_hash | TEXT/VARCHAR(255) | Hashed JWT token (indexed) |
| ip_address | TEXT/VARCHAR(45) | User's IP address |
| user_agent | TEXT | Browser/client information |
| expires_at | DATETIME/TIMESTAMP | Session expiration (indexed) |
| created_at | DATETIME/TIMESTAMP | Session start time |

**Indexes:**
- `idx_sessions_user_id` - Find user's active sessions
- `idx_sessions_token_hash` - Validate tokens
- `idx_sessions_expires_at` - Clean up expired sessions

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE CASCADE

### 5. **activity_logs** - Audit Trail

Records user actions for security and analytics.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER/SERIAL | Primary key |
| user_id | INTEGER | Foreign key to users (nullable, indexed) |
| action | TEXT/VARCHAR(100) | Action type (indexed) |
| resource | TEXT/VARCHAR(100) | Affected resource |
| details | TEXT/JSONB | Additional context (GIN indexed in PostgreSQL) |
| ip_address | TEXT/VARCHAR(45) | Request IP |
| created_at | DATETIME/TIMESTAMP | Action timestamp (indexed) |

**Indexes:**
- `idx_activity_user_id` - User activity history
- `idx_activity_action` - Filter by action type
- `idx_activity_created_at` - Chronological sorting
- `idx_activity_details` - JSON search (PostgreSQL GIN index)

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE SET NULL

## 🔧 Database Operations

### Backup

```bash
# SQLite backup
DB_TYPE=sqlite ./scripts/db-backup.sh

# PostgreSQL backup
DB_TYPE=postgres ./scripts/db-backup.sh
```

Backups are stored in `./backups/` directory and automatically compressed with gzip.

### Migration (SQLite → PostgreSQL)

```bash
# Run migration script
./scripts/migrate-to-postgres.sh
```

This script:
1. Backs up SQLite database
2. Exports data to SQL format
3. Converts SQLite SQL to PostgreSQL format
4. Imports data to PostgreSQL
5. Verifies record counts

### Performance Optimization

**Query Optimization Tips:**
1. Always use indexed columns in WHERE clauses
2. Use composite indexes for combined filters (e.g., `decade + country`)
3. Avoid SELECT *; specify needed columns
4. Use LIMIT for large result sets
5. Monitor slow queries (logged automatically if > 1000ms)

**Connection Pooling (PostgreSQL):**
- Min connections: 5
- Max connections: 20
- Idle timeout: 30 seconds
- Connection timeout: 5 seconds

## 📈 Database Monitoring

### Slow Query Logging

The PostgreSQL configuration automatically logs queries taking longer than 1 second:

```typescript
// Automatic logging in database.postgres.ts
if (duration > 1000) {
  console.warn(`⚠️  Slow query (${duration}ms):`, text);
}
```

### Statistics

View table statistics:
```sql
-- PostgreSQL
SELECT
  schemaname,
  tablename,
  n_live_tup as row_count,
  n_dead_tup as dead_rows
FROM pg_stat_user_tables;

-- SQLite
SELECT
  name,
  (SELECT COUNT(*) FROM [name]) as row_count
FROM sqlite_master
WHERE type='table';
```

## 🔒 Security Considerations

1. **Password Hashing**: All passwords use bcrypt with cost factor 10
2. **SQL Injection Prevention**: All queries use parameterized statements
3. **Foreign Key Constraints**: Maintain referential integrity
4. **Session Management**: Automatic cleanup of expired sessions
5. **Audit Logging**: Track all critical operations

## 🚀 Production Checklist

Before deploying to production:

- [ ] Migrate to PostgreSQL
- [ ] Configure connection pooling
- [ ] Set up automated daily backups
- [ ] Enable SSL for database connections
- [ ] Configure database firewall rules
- [ ] Set up monitoring and alerting
- [ ] Test backup restoration procedure
- [ ] Optimize indexes based on query patterns
- [ ] Set up read replicas (if needed)
- [ ] Configure point-in-time recovery

## 📚 Additional Resources

- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don%27t_Do_This)
- [SQLite Optimization](https://www.sqlite.org/optoverview.html)
- [Database Indexing Guide](https://use-the-index-luke.com/)
