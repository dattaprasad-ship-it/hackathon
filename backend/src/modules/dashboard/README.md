# Dashboard Module

## Overview

The Dashboard module provides backend APIs and services to support the dashboard frontend. It aggregates data from various modules (Time, Leave, PIM, Recruitment, Performance, Buzz) and provides endpoints for dashboard widgets.

## Performance Optimization

### Database Indexes

The following indexes should be created when dependent modules are implemented:

#### Time Module
- Index on `time_records.user_id` and `punch_in_time` for efficient time tracking queries
- Index on `time_records.user_id` and `date` for weekly hours aggregation

#### Leave Module
- Index on `leave_requests.user_id` and `start_date` for filtering employees on leave
- Index on `leave_requests.status` and `start_date` for approved leave queries
- Composite index on `(status, start_date, end_date)` for date range queries

#### PIM Module
- Index on `employees.sub_unit` for employee distribution queries
- Index on `employees.department` for department-level filtering
- Index on `employees.user_id` for user-specific queries

#### Performance Module
- Index on `reviews.user_id` and `status` for pending reviews
- Index on `reviews.reviewer_id` and `status` for reviewer queries

#### Recruitment Module
- Index on `interviews.interviewer_id` and `scheduled_date` for interview queries
- Index on `interviews.status` for filtering scheduled interviews

#### Buzz Module
- Index on `posts.created_at` for latest posts queries (descending order)
- Index on `posts.author_id` for author-specific queries

### Query Optimization Guidelines

1. **Avoid N+1 Queries**: Use batch operations and eager loading where possible
2. **Use Joins**: Prefer joins over multiple queries when aggregating data
3. **Limit Result Sets**: Always apply limits to queries that could return large datasets
4. **Connection Pooling**: Ensure database connection pooling is configured (min: 2, max: 10)

### Caching Strategy

- Cache widget data for 5 minutes (300 seconds)
- Cache key format: `dashboard:{userId}:{role}:{widgetType}[:{params}]`
- Invalidate cache on data updates (when dependent modules are implemented)

## Module Dependencies

This module depends on the following modules (to be implemented):
- Time Module (for time tracking data)
- Leave Module (for leave information)
- PIM Module (for employee and organization data)
- Performance Module (for review data)
- Recruitment Module (for candidate information)
- Buzz Module (for social posts)

Until these modules are implemented, the services use mock/stub repositories that return empty data.

## API Endpoints

- `GET /api/dashboard/time-at-work` - Get time tracking information
- `GET /api/dashboard/my-actions` - Get pending actions
- `GET /api/dashboard/employees-on-leave?date=YYYY-MM-DD` - Get employees on leave
- `GET /api/dashboard/employee-distribution` - Get employee distribution by sub-unit
- `GET /api/dashboard/buzz/latest?limit=N` - Get latest social posts
- `GET /api/dashboard/summary` - Get aggregated dashboard data

All endpoints require JWT authentication.

