# Authentication Module

## Database Indexes

The following indexes have been created to optimize query performance:

### Users Table
- `idx_users_username`: Index on `username` column for fast case-insensitive lookups

### Login Attempts Table
- `idx_login_attempts_ip_timestamp`: Composite index on `ip_address` and `attempt_timestamp` for rate limiting queries by IP
- `idx_login_attempts_username_timestamp`: Composite index on `username` and `attempt_timestamp` for rate limiting queries by username

## Query Performance

All queries are optimized to use these indexes:
- User lookup by username uses the `idx_users_username` index
- Rate limiting queries use the composite indexes for efficient time-window filtering
- Database connection pooling is configured in `src/config/database.ts`

## Performance Targets

- Login endpoint responds within 500ms (95th percentile)
- Database queries complete within 100ms
- System handles 100 concurrent login requests

