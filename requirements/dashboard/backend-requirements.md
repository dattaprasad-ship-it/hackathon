# Backend Requirements - Dashboard Module

**Module**: Dashboard  
**Created**: 2025-01-XX  
**Status**: Draft  
**Derived From**: `product-info/product-overview.md`

## Overview

The Dashboard module provides backend APIs and services to support the dashboard frontend. It aggregates data from various modules (Time, Leave, PIM, Recruitment, Performance, Buzz) and provides endpoints for dashboard widgets. The backend handles data aggregation, filtering, role-based access control, and performance optimization for dashboard data delivery.

**System Roles Used:**
- **Admin**: Can view all dashboard data including organization-wide statistics and employee information
- **Employee**: Can view personalized dashboard data including own time tracking, leave status, and pending actions
- **All Users**: Must be authenticated to access dashboard APIs

**Common Functionalities Used:**
- **Authentication & Authorization**: All dashboard endpoints require JWT authentication (from product-overview.md)
- **Session Management**: Dashboard APIs use user session to provide personalized data
- **Role-Based Access Control**: Data filtering based on user role (Admin vs Employee)

**Dependencies:**
- Authentication module (for user validation and role information)
- Time tracking module (for time at work data)
- Leave module (for leave information)
- PIM module (for employee and organization data)
- Recruitment module (for candidate information)
- Performance module (for review data)
- Buzz/Social module (for social posts)

**Integration Points:**
- Provides RESTful API endpoints for dashboard widgets
- Consumes data from various modules (Time, Leave, PIM, etc.)
- Integrates with authentication system for user validation
- Integrates with authorization system for role-based data filtering

---

## Functional Requirements

### Authentication & Authorization

- **FR-BE-001**: System MUST authenticate all dashboard API requests
  - **Method**: JWT token validation via Authorization header
  - **Validation**: Verify token signature, expiration, and user existence
  - **Response**: Return 401 Unauthorized if authentication fails

- **FR-BE-002**: System MUST authorize dashboard API requests based on user role
  - **Admin**: Can access all dashboard endpoints and view all data
  - **Employee**: Can access dashboard endpoints but view only own/role-appropriate data
  - **Response**: Return 403 Forbidden if user lacks required permissions

- **FR-BE-003**: System MUST filter dashboard data based on user role
  - **Admin**: See organization-wide data (all employees, all departments)
  - **Employee**: See only own data and department-level data (where applicable)
  - **Implementation**: Apply role-based filters in all data queries

### API Endpoints

#### Time at Work Endpoint

- **FR-BE-010**: System MUST provide endpoint to get current user's time tracking information
  - **Endpoint**: `GET /api/dashboard/time-at-work`
  - **Method**: GET
  - **Authentication**: Required (JWT)
  - **Authorization**: All authenticated users
  - **Request**: No request body, user ID from JWT token
  - **Response**: 
    ```json
    {
      "punchedIn": true,
      "punchInTime": "2025-01-12T11:50:00Z",
      "timezone": "GMT+1",
      "todayHours": {
        "hours": 0,
        "minutes": 27,
        "totalMinutes": 27
      },
      "weekData": [
        {
          "date": "2025-01-08",
          "day": "Mon",
          "hours": 8,
          "minutes": 0
        },
        {
          "date": "2025-01-09",
          "day": "Tue",
          "hours": 8,
          "minutes": 0
        }
        // ... other days
      ],
      "weekRange": {
        "start": "2025-01-08",
        "end": "2025-01-14"
      }
    }
    ```
  - **Error Responses**: 
    - 401: Unauthorized (invalid/missing token)
    - 403: Forbidden (insufficient permissions)
    - 500: Internal Server Error

#### My Actions Endpoint

- **FR-BE-011**: System MUST provide endpoint to get user's pending actions
  - **Endpoint**: `GET /api/dashboard/my-actions`
  - **Method**: GET
  - **Authentication**: Required (JWT)
  - **Authorization**: All authenticated users
  - **Request**: No request body, user ID and role from JWT token
  - **Response**:
    ```json
    {
      "actions": [
        {
          "type": "timesheet_approval",
          "title": "Timesheet to Approve",
          "count": 1,
          "icon": "calendar",
          "url": "/time/timesheets/approve"
        },
        {
          "type": "self_review",
          "title": "Pending Self Review",
          "count": 1,
          "icon": "person-heart",
          "url": "/performance/reviews/self"
        },
        {
          "type": "candidate_interview",
          "title": "Candidate to Interview",
          "count": 1,
          "icon": "person-chat",
          "url": "/recruitment/candidates/interview"
        }
      ]
    }
    ```
  - **Role-Based Data**:
    - **Admin**: May see additional actions (employee approvals, system maintenance, etc.)
    - **Employee**: Sees only own actions (self reviews, own timesheets, etc.)
  - **Error Responses**: 
    - 401: Unauthorized
    - 403: Forbidden
    - 500: Internal Server Error

#### Employees on Leave Today Endpoint

- **FR-BE-012**: System MUST provide endpoint to get employees on leave today
  - **Endpoint**: `GET /api/dashboard/employees-on-leave`
  - **Method**: GET
  - **Authentication**: Required (JWT)
  - **Authorization**: All authenticated users (filtered by role)
  - **Query Parameters**:
    - `date` (optional): Date to check (default: today), format: YYYY-MM-DD
  - **Request**: No request body
  - **Response**:
    ```json
    {
      "date": "2025-01-12",
      "employees": [
        {
          "id": "uuid",
          "name": "John Doe",
          "displayName": "John Doe",
          "department": "Engineering",
          "leaveType": "Annual Leave",
          "startDate": "2025-01-12",
          "endDate": "2025-01-12",
          "profilePicture": "url-or-null"
        }
      ],
      "totalCount": 1
    }
    ```
  - **Role-Based Data**:
    - **Admin**: Sees all employees on leave across organization
    - **Employee**: Sees only employees in same department (or own leave if applicable)
  - **Error Responses**: 
    - 401: Unauthorized
    - 403: Forbidden
    - 500: Internal Server Error

#### Employee Distribution by Sub Unit Endpoint

- **FR-BE-013**: System MUST provide endpoint to get employee distribution by sub-unit
  - **Endpoint**: `GET /api/dashboard/employee-distribution`
  - **Method**: GET
  - **Authentication**: Required (JWT)
  - **Authorization**: All authenticated users (filtered by role)
  - **Request**: No request body
  - **Response**:
    ```json
    {
      "distribution": [
        {
          "subUnit": "Engineering",
          "count": 45,
          "percentage": 75.0,
          "color": "#FF5733"
        },
        {
          "subUnit": "Sales",
          "count": 10,
          "percentage": 16.7,
          "color": "#FFC300"
        },
        {
          "subUnit": "HR",
          "count": 5,
          "percentage": 8.3,
          "color": "#FF8C00"
        }
      ],
      "totalEmployees": 60
    }
    ```
  - **Role-Based Data**:
    - **Admin**: Sees distribution across all sub-units in organization
    - **Employee**: Sees distribution for own department/sub-unit only
  - **Error Responses**: 
    - 401: Unauthorized
    - 403: Forbidden
    - 500: Internal Server Error

#### Buzz Latest Posts Endpoint

- **FR-BE-014**: System MUST provide endpoint to get latest social posts
  - **Endpoint**: `GET /api/dashboard/buzz/latest`
  - **Method**: GET
  - **Authentication**: Required (JWT)
  - **Authorization**: All authenticated users
  - **Query Parameters**:
    - `limit` (optional): Number of posts to return (default: 5, max: 20)
  - **Request**: No request body
  - **Response**:
    ```json
    {
      "posts": [
        {
          "id": "uuid",
          "author": {
            "id": "uuid",
            "name": "Test Automation User",
            "displayName": "Test Automation User",
            "profilePicture": "url-or-null"
          },
          "content": "Post text content",
          "images": [
            {
              "url": "image-url",
              "thumbnail": "thumbnail-url"
            }
          ],
          "timestamp": "2025-10-12T16:42:00Z",
          "likes": 5,
          "comments": 2
        }
      ],
      "totalCount": 1
    }
    ```
  - **Error Responses**: 
    - 401: Unauthorized
    - 403: Forbidden
    - 500: Internal Server Error

#### Dashboard Summary Endpoint (Optional - Aggregated)

- **FR-BE-015**: System MAY provide a single endpoint to get all dashboard data
  - **Endpoint**: `GET /api/dashboard/summary`
  - **Method**: GET
  - **Authentication**: Required (JWT)
  - **Authorization**: All authenticated users
  - **Request**: No request body
  - **Response**: Aggregated response containing all widget data
  - **Purpose**: Reduce API calls by fetching all data in one request
  - **Performance**: Should complete within 500ms (95th percentile)

### Data Management

- **FR-BE-020**: System MUST aggregate data from multiple modules for dashboard widgets
  - **Time at Work**: Aggregate from Time tracking module
  - **My Actions**: Aggregate from Time, Performance, Recruitment modules
  - **Employees on Leave**: Aggregate from Leave module
  - **Employee Distribution**: Aggregate from PIM/Organization module
  - **Buzz Posts**: Aggregate from Buzz/Social module

- **FR-BE-021**: System MUST cache dashboard data appropriately
  - **Cache Strategy**: Cache widget data for 1-5 minutes (configurable)
  - **Cache Key**: Include user ID and role for role-based caching
  - **Invalidation**: Invalidate cache on data updates
  - **Purpose**: Reduce database load and improve response times

- **FR-BE-022**: System MUST optimize database queries for dashboard endpoints
  - **Indexing**: Use proper database indexes for efficient queries
  - **Query Optimization**: Minimize N+1 queries, use joins where appropriate
  - **Pagination**: Implement pagination for large datasets
  - **Performance Target**: Each endpoint responds within 200ms (95th percentile)

- **FR-BE-023**: System MUST handle missing or unavailable module data gracefully
  - **Behavior**: Return partial data if some modules are unavailable
  - **Error Handling**: Log errors but don't fail entire dashboard request
  - **Fallback**: Return empty arrays or default values for unavailable data

### Business Logic

- **FR-BE-030**: System MUST calculate time at work data accurately
  - **Today's Hours**: Calculate from punch-in time to current time (or punch-out time)
  - **Weekly Hours**: Aggregate daily hours for current week
  - **Timezone**: Handle user timezone correctly
  - **Week Range**: Calculate week start (Monday) and end (Sunday) dates

- **FR-BE-031**: System MUST aggregate pending actions from multiple sources
  - **Timesheet Approvals**: Count pending timesheets requiring approval (role-based)
  - **Self Reviews**: Count pending self-review tasks for user
  - **Candidate Interviews**: Count scheduled interviews for user (if recruiter/manager)
  - **Role-Based**: Different actions for Admin vs Employee

- **FR-BE-032**: System MUST filter employees on leave by date
  - **Date Filtering**: Filter leave records for specified date (default: today)
  - **Leave Status**: Include only approved/active leave records
  - **Role-Based Filtering**: Admin sees all, Employee sees department-level

- **FR-BE-033**: System MUST calculate employee distribution by sub-unit
  - **Grouping**: Group employees by sub-unit/department
  - **Counting**: Count employees per sub-unit
  - **Percentage**: Calculate percentage of total employees
  - **Color Assignment**: Assign colors for chart visualization

- **FR-BE-034**: System MUST retrieve latest social posts in chronological order
  - **Sorting**: Sort by timestamp (newest first)
  - **Limit**: Respect limit parameter (default: 5, max: 20)
  - **Content**: Include post content, author info, images, engagement metrics

### Integration

- **FR-BE-040**: System MUST integrate with Time tracking module
  - **Data Source**: Employee time records, punch-in/out data
  - **API**: Consume Time module APIs or database directly
  - **Purpose**: Provide time at work widget data

- **FR-BE-041**: System MUST integrate with Leave module
  - **Data Source**: Leave requests, leave records
  - **API**: Consume Leave module APIs or database directly
  - **Purpose**: Provide employees on leave widget data

- **FR-BE-042**: System MUST integrate with PIM module
  - **Data Source**: Employee records, organization structure, sub-units
  - **API**: Consume PIM module APIs or database directly
  - **Purpose**: Provide employee distribution widget data

- **FR-BE-043**: System MUST integrate with Performance module
  - **Data Source**: Review records, pending reviews
  - **API**: Consume Performance module APIs or database directly
  - **Purpose**: Provide pending self-review action data

- **FR-BE-044**: System MUST integrate with Recruitment module
  - **Data Source**: Candidate records, interview schedules
  - **API**: Consume Recruitment module APIs or database directly
  - **Purpose**: Provide candidate interview action data

- **FR-BE-045**: System MUST integrate with Buzz/Social module
  - **Data Source**: Social posts, user interactions
  - **API**: Consume Buzz module APIs or database directly
  - **Purpose**: Provide latest posts widget data

### Security

- **FR-BE-050**: System MUST validate JWT tokens on all dashboard endpoints
  - **Validation**: Verify token signature, expiration, and user existence
  - **Response**: Return 401 if token is invalid or expired
  - **Implementation**: Use JWT authentication middleware

- **FR-BE-051**: System MUST enforce role-based data access
  - **Admin**: Full access to all data
  - **Employee**: Limited access to own/department data
  - **Implementation**: Apply filters in data queries based on user role
  - **Response**: Return 403 if user lacks required permissions

- **FR-BE-052**: System MUST prevent data leakage between users
  - **Isolation**: Ensure users cannot access other users' data
  - **Validation**: Verify user ID matches requested data owner
  - **Filtering**: Apply user-based filters in all queries

- **FR-BE-053**: System MUST sanitize all output data
  - **XSS Prevention**: Sanitize text content to prevent XSS attacks
  - **SQL Injection**: Use parameterized queries (already enforced by TypeORM)
  - **Data Validation**: Validate and sanitize all response data

### Performance

- **FR-BE-060**: System MUST respond to dashboard API requests within 200ms (95th percentile)
  - **Target**: 200ms response time per endpoint
  - **Optimization**: Database indexing, query optimization, caching
  - **Measurement**: Monitor response times and optimize slow endpoints

- **FR-BE-061**: System MUST handle 100 concurrent dashboard requests
  - **Concurrency**: Support 100 simultaneous requests without degradation
  - **Scalability**: Use connection pooling, efficient queries, caching
  - **Load Testing**: Verify performance under load

- **FR-BE-062**: System MUST implement database connection pooling
  - **Configuration**: Configure appropriate pool size (min: 2, max: 10)
  - **Purpose**: Efficient database connection management
  - **Implementation**: Use TypeORM connection pooling

- **FR-BE-063**: System MUST optimize database queries
  - **Indexing**: Ensure proper indexes on frequently queried columns
  - **Query Optimization**: Avoid N+1 queries, use joins, limit result sets
  - **Performance**: Each query should complete within 100ms

### Logging

- **FR-BE-070**: System MUST log all dashboard API requests
  - **Information**: User ID, endpoint, timestamp, response time
  - **Level**: Info for successful requests, Warn for errors
  - **Purpose**: Monitoring and debugging

- **FR-BE-071**: System MUST log dashboard data aggregation errors
  - **Information**: Module name, error details, user ID
  - **Level**: Error
  - **Purpose**: Track integration issues with other modules

- **FR-BE-072**: System MUST log authorization failures
  - **Information**: User ID, endpoint, attempted action, reason
  - **Level**: Warn
  - **Purpose**: Security monitoring

---

## Non-Functional Requirements

### Scalability

- **NFR-BE-001**: System MUST scale horizontally to handle increased load
  - **Strategy**: Stateless API design, shared caching, load balancing
  - **Target**: Support 10x current load without architectural changes

- **NFR-BE-002**: System MUST handle database growth efficiently
  - **Strategy**: Proper indexing, query optimization, data archiving
  - **Performance**: Maintain response times as data grows

### Reliability

- **NFR-BE-010**: System MUST maintain 99.9% uptime for dashboard APIs
  - **Measurement**: Over 30-day period
  - **Monitoring**: Track uptime and availability

- **NFR-BE-011**: System MUST handle module unavailability gracefully
  - **Behavior**: Return partial data if some modules are down
  - **Error Handling**: Don't fail entire dashboard if one module fails
  - **Fallback**: Return empty data or cached data for unavailable modules

### Maintainability

- **NFR-BE-020**: System MUST follow consistent code structure
  - **Pattern**: Service layer for business logic, repository layer for data access
  - **Documentation**: JSDoc comments for all service methods
  - **Standards**: Follow cursor rules and project structure guidelines

- **NFR-BE-021**: System MUST be testable
  - **Unit Tests**: All services and repositories must have unit tests
  - **Integration Tests**: End-to-end tests for API endpoints
  - **Coverage**: Minimum 80% code coverage

### Observability

- **NFR-BE-030**: System MUST provide monitoring and metrics
  - **Metrics**: Response times, error rates, request counts
  - **Logging**: Structured logging for all operations
  - **Alerting**: Alert on high error rates or slow responses

---

## Data Models

### Dashboard Summary Response

```typescript
interface DashboardSummaryResponse {
  timeAtWork: TimeAtWorkData;
  myActions: Action[];
  employeesOnLeave: EmployeeOnLeave[];
  employeeDistribution: DistributionData[];
  buzzPosts: BuzzPost[];
}

interface TimeAtWorkData {
  punchedIn: boolean;
  punchInTime: string; // ISO 8601
  timezone: string;
  todayHours: {
    hours: number;
    minutes: number;
    totalMinutes: number;
  };
  weekData: WeekDayData[];
  weekRange: {
    start: string; // YYYY-MM-DD
    end: string; // YYYY-MM-DD
  };
}

interface WeekDayData {
  date: string; // YYYY-MM-DD
  day: string; // Mon, Tue, Wed, etc.
  hours: number;
  minutes: number;
}

interface Action {
  type: string;
  title: string;
  count: number;
  icon: string;
  url: string;
}

interface EmployeeOnLeave {
  id: string;
  name: string;
  displayName: string;
  department: string;
  leaveType: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  profilePicture: string | null;
}

interface DistributionData {
  subUnit: string;
  count: number;
  percentage: number;
  color: string;
}

interface BuzzPost {
  id: string;
  author: {
    id: string;
    name: string;
    displayName: string;
    profilePicture: string | null;
  };
  content: string;
  images: Image[];
  timestamp: string; // ISO 8601
  likes: number;
  comments: number;
}

interface Image {
  url: string;
  thumbnail: string;
}
```

---

## Error Handling

- **ERR-BE-001**: If authentication fails, return 401 Unauthorized
  - **Response**: 
    ```json
    {
      "error": {
        "code": "UNAUTHORIZED",
        "message": "Authentication token required or invalid"
      }
    }
    ```

- **ERR-BE-002**: If authorization fails, return 403 Forbidden
  - **Response**: 
    ```json
    {
      "error": {
        "code": "FORBIDDEN",
        "message": "You don't have permission to access this resource"
      }
    }
    ```

- **ERR-BE-003**: If module data is unavailable, return partial data with warnings
  - **Response**: Include available data, log errors for unavailable modules
  - **Behavior**: Don't fail entire request if one module fails

- **ERR-BE-004**: If database query fails, return 500 Internal Server Error
  - **Response**: 
    ```json
    {
      "error": {
        "code": "INTERNAL_ERROR",
        "message": "An error occurred while processing your request"
      }
    }
    ```
  - **Logging**: Log full error details for debugging

- **ERR-BE-005**: If invalid query parameters provided, return 400 Bad Request
  - **Response**: 
    ```json
    {
      "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid query parameters",
        "details": {
          "limit": "Must be between 1 and 20"
        }
      }
    }
    ```

---

## Success Criteria

- **SC-BE-001**: All dashboard API endpoints respond within 200ms (95th percentile)
  - **Measurement**: Response time monitoring
  - **Target**: 200ms or less per endpoint

- **SC-BE-002**: System handles 100 concurrent dashboard requests without degradation
  - **Measurement**: Load testing
  - **Target**: All requests complete successfully within acceptable time

- **SC-BE-003**: All functional requirements are implemented and tested
  - **Measurement**: Requirement coverage in test suite
  - **Target**: 100% requirement coverage

- **SC-BE-004**: Role-based data filtering works correctly
  - **Measurement**: Admin sees all data, Employee sees filtered data
  - **Target**: 100% correct role-based filtering

- **SC-BE-005**: Dashboard APIs maintain 99.9% uptime
  - **Measurement**: Over 30-day period
  - **Target**: 99.9% or higher availability

- **SC-BE-006**: All integration points with other modules work correctly
  - **Measurement**: Integration tests with all modules
  - **Target**: All integrations functional

- **SC-BE-007**: Database queries are optimized with proper indexes
  - **Measurement**: Query performance analysis
  - **Target**: All queries complete within 100ms

- **SC-BE-008**: Caching reduces database load by at least 50%
  - **Measurement**: Cache hit rate monitoring
  - **Target**: 50% or higher cache hit rate

---

## Notes

- Dashboard module aggregates data from other modules - those modules must be implemented first
- Some endpoints may return empty data if dependent modules are not yet implemented
- Caching strategy should be configurable per environment (development vs production)
- Role-based filtering is critical for security - must be thoroughly tested
- Dashboard APIs should be designed to minimize database load through caching and optimization
- Integration with other modules will be defined as those modules are developed
- Consider implementing a dashboard summary endpoint that aggregates all widget data in one request for better performance

---

## Related Documentation

- **Frontend Requirements**: `requirements/dashboard/frontend-requirements.md`
- **Frontend Specifications**: `specs/dashboard/frontend-specs.md` (to be created after requirements approval)
- **Backend Specifications**: `specs/dashboard/backend-specs.md` (to be created after requirements approval)
- **Product Overview**: `product-info/product-overview.md`
- **Authentication Module**: `requirements/authentication/backend-requirements.md` (dependency)

