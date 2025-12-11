# Backend Requirements - Authentication Module (Login)

**Module**: Authentication  
**Created**: 2025-01-XX  
**Status**: Draft  
**Derived From**: `product-info/product-overview.md`

## Overview

The Authentication module provides the backend services for user authentication and session management. This module handles credential validation, password verification, JWT token generation, session management, and security measures. It serves as the foundation for all authenticated operations in the HR management system.

**System Roles Used:**
- **Admin**: Can authenticate with admin credentials and receive admin role in session
- **Employee**: Can authenticate with employee credentials and receive employee role in session
- **All Users**: Must authenticate before accessing any protected backend endpoints

**Common Functionalities Used:**
- **Login**: Core authentication functionality that validates user credentials and establishes user session (from product-overview.md)
- **Session Management**: Maintains user session state after successful authentication

**Dependencies:**
- User/Employee data storage (database)
- JWT token library for token generation and validation
- Password hashing library (bcrypt or similar)
- Rate limiting middleware
- Logging service

**Integration Points:**
- Exposes authentication API endpoint (`/api/auth/login`)
- Integrates with user management module to retrieve user data
- Integrates with session management to store and validate tokens
- Integrates with authorization middleware for protected routes

---

## Functional Requirements

### Authentication & Authorization

- **FR-BE-001**: System MUST authenticate users via username and password credentials
  - **Input**: Username (string) and password (string)
  - **Validation**: Verify username exists and password matches stored hash
  - **Output**: Authentication token and user information on success

- **FR-BE-002**: System MUST validate user credentials against stored user data
  - **Username Validation**: Check if username exists in user database
  - **Password Validation**: Compare provided password with stored hashed password
  - **Case Sensitivity**: Username comparison should be case-insensitive, password should be case-sensitive

- **FR-BE-003**: System MUST generate and return JWT token upon successful authentication
  - **Token Content**: User ID, username, role, expiration timestamp
  - **Token Expiration**: Token must expire after configured time period (e.g., 24 hours)
  - **Token Format**: Standard JWT format (header.payload.signature)

- **FR-BE-004**: System MUST return user information along with authentication token
  - **User Data**: User ID, username, role, display name (if available)
  - **Format**: JSON object in response body

- **FR-BE-005**: System MUST reject authentication requests with invalid credentials
  - **Invalid Username**: Return 401 Unauthorized if username doesn't exist
  - **Invalid Password**: Return 401 Unauthorized if password doesn't match
  - **Error Message**: Return generic "Invalid credentials" message (don't reveal which field is wrong)

- **FR-BE-006**: System MUST support role-based authentication
  - **Roles**: Admin, Employee (and potentially others)
  - **Role Assignment**: Role must be included in JWT token and user response
  - **Role Validation**: Verify user has valid role from database

### API Endpoints

- **FR-BE-010**: System MUST provide login endpoint
  - **Method**: POST
  - **Path**: `/api/auth/login`
  - **Request**: 
    ```json
    {
      "username": "string (required)",
      "password": "string (required)"
    }
    ```
  - **Request Headers**: 
    - `Content-Type: application/json`
  - **Response (Success - 200 OK)**: 
    ```json
    {
      "token": "string (JWT token)",
      "user": {
        "id": "string",
        "username": "string",
        "role": "string (Admin|Employee)",
        "displayName": "string (optional)"
      }
    }
    ```
  - **Response (Error - 401 Unauthorized)**: 
    ```json
    {
      "error": {
        "code": "INVALID_CREDENTIALS",
        "message": "Invalid credentials"
      }
    }
    ```
  - **Response (Error - 400 Bad Request)**: 
    ```json
    {
      "error": {
        "code": "VALIDATION_ERROR",
        "message": "Username and password are required",
        "details": {
          "username": "Username is required",
          "password": "Password is required"
        }
      }
    }
    ```
  - **Auth Required**: No (public endpoint)
  - **Roles**: All users (unauthenticated)

- **FR-BE-011**: System MUST provide logout endpoint
  - **Method**: POST
  - **Path**: `/api/auth/logout`
  - **Request**: None (token in header)
  - **Request Headers**: 
    - `Authorization: Bearer <token>`
  - **Response (Success - 200 OK)**: 
    ```json
    {
      "message": "Logged out successfully"
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: All authenticated users
  - **Behavior**: Invalidate token (add to blacklist or remove from active sessions)

- **FR-BE-012**: System MUST provide token validation endpoint
  - **Method**: GET
  - **Path**: `/api/auth/validate`
  - **Request**: None (token in header)
  - **Request Headers**: 
    - `Authorization: Bearer <token>`
  - **Response (Success - 200 OK)**: 
    ```json
    {
      "valid": true,
      "user": {
        "id": "string",
        "username": "string",
        "role": "string"
      }
    }
    ```
  - **Response (Error - 401 Unauthorized)**: 
    ```json
    {
      "valid": false,
      "error": {
        "code": "INVALID_TOKEN",
        "message": "Token is invalid or expired"
      }
    }
    ```
  - **Auth Required**: Yes (token in header)
  - **Roles**: All authenticated users
  - **Purpose**: Allow frontend to verify token validity

- **FR-BE-013**: System MUST provide current user information endpoint
  - **Method**: GET
  - **Path**: `/api/auth/me`
  - **Request**: None (token in header)
  - **Request Headers**: 
    - `Authorization: Bearer <token>`
  - **Response (Success - 200 OK)**: 
    ```json
    {
      "id": "string",
      "username": "string",
      "role": "string",
      "displayName": "string (optional)",
      "email": "string (optional)"
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: All authenticated users
  - **Purpose**: Return current authenticated user's information

### Data Management

- **FR-BE-020**: System MUST store user credentials securely in database
  - **Storage**: User table with username and hashed password
  - **Password Storage**: Passwords MUST be hashed using bcrypt (or similar secure hashing algorithm)
  - **Salt Rounds**: Minimum 10 salt rounds for password hashing
  - **Never Store**: Plain text passwords must never be stored

- **FR-BE-021**: System MUST validate input data before processing
  - **Username Validation**: 
    - Required field
    - Minimum length: 1 character
    - Maximum length: 255 characters
    - Trim whitespace
  - **Password Validation**: 
    - Required field
    - Minimum length: [NEEDS CLARIFICATION: minimum password length policy]
    - Maximum length: 255 characters
    - Trim whitespace

- **FR-BE-022**: System MUST retrieve user data by username for authentication
  - **Query**: Lookup user by username (case-insensitive)
  - **Data Retrieved**: User ID, username, hashed password, role, status
  - **Performance**: Query should be optimized with database index on username

- **FR-BE-023**: System MUST track user login attempts for security
  - **Storage**: Log successful and failed login attempts
  - **Data**: Username, timestamp, IP address, success/failure status
  - **Purpose**: Security auditing and rate limiting

- **FR-BE-024**: System MUST manage active user sessions
  - **Storage**: Track active tokens (optional, depends on implementation)
  - **Token Blacklist**: Maintain blacklist of invalidated tokens (if using token revocation)
  - **Session Expiration**: Enforce token expiration times

### Business Logic

- **FR-BE-030**: System MUST hash passwords using secure one-way hashing algorithm
  - **Algorithm**: bcrypt (or Argon2, scrypt)
  - **Salt**: Unique salt per password
  - **Rounds**: Minimum 10 rounds (configurable)
  - **Verification**: Compare provided password with stored hash using secure comparison

- **FR-BE-031**: System MUST perform case-insensitive username lookup
  - **Comparison**: Username lookup should ignore case differences
  - **Storage**: Username can be stored in any case, but lookup should be case-insensitive
  - **Example**: "Admin", "admin", "ADMIN" should all match the same user

- **FR-BE-032**: System MUST enforce account status checks during authentication
  - **Active Status**: Only active users can authenticate
  - **Blocked Status**: Blocked users must be rejected with appropriate error
  - **Suspended Status**: Suspended users must be rejected with appropriate error
  - **Error Message**: Generic message for security (don't reveal account status details)

- **FR-BE-033**: System MUST generate unique JWT tokens for each login
  - **Uniqueness**: Each token must be unique (include timestamp or random component)
  - **Token ID**: Include unique token identifier (jti claim) in JWT
  - **Replay Prevention**: Tokens should not be reusable after expiration

- **FR-BE-034**: System MUST include user role in authentication response
  - **Role Source**: Role from user database record
  - **Role Validation**: Verify role is valid before including in token
  - **Role Usage**: Role used for authorization in protected endpoints

### Integration Requirements

- **FR-BE-040**: System MUST integrate with user management module
  - **Purpose**: Retrieve user data for authentication
  - **Data Flow**: 
    - Receive username → Query user database → Retrieve user record → Validate password
  - **Error Handling**: Handle database connection errors gracefully

- **FR-BE-041**: System MUST integrate with logging service
  - **Purpose**: Log authentication events for security and debugging
  - **Events Logged**: 
    - Successful logins (username, timestamp, IP)
    - Failed login attempts (username, timestamp, IP, reason)
    - Token generation
    - Token validation failures
  - **Log Level**: Info for success, Warning for failures, Error for system errors

- **FR-BE-042**: System MUST integrate with rate limiting service
  - **Purpose**: Prevent brute force attacks
  - **Rate Limits**: 
    - Maximum 5 login attempts per IP address per 15 minutes
    - Maximum 10 login attempts per username per hour
  - **Response**: Return 429 Too Many Requests when limit exceeded

### Security Requirements

- **FR-BE-050**: System MUST encrypt/hash passwords using secure algorithm
  - **Algorithm**: bcrypt with minimum 10 salt rounds
  - **Never Store**: Plain text passwords must never be stored or logged
  - **Comparison**: Use constant-time comparison to prevent timing attacks

- **FR-BE-051**: System MUST validate and sanitize all input data
  - **Input Validation**: Validate username and password format and length
  - **SQL Injection Prevention**: Use parameterized queries or ORM
  - **XSS Prevention**: Sanitize any user input before processing
  - **Trim Whitespace**: Remove leading/trailing whitespace from inputs

- **FR-BE-052**: System MUST implement rate limiting on login endpoint
  - **IP-based Limiting**: Limit requests per IP address
  - **Username-based Limiting**: Limit attempts per username
  - **Window**: 15 minutes for IP, 1 hour for username
  - **Threshold**: 5 attempts per IP per window, 10 attempts per username per hour
  - **Response**: 429 Too Many Requests with retry-after header

- **FR-BE-053**: System MUST use secure token generation
  - **Algorithm**: HS256 or RS256 for JWT signing
  - **Secret Key**: Strong secret key (minimum 256 bits)
  - **Token Expiration**: Tokens must expire (default 24 hours)
  - **Refresh Tokens**: [NEEDS CLARIFICATION: whether refresh tokens are required]

- **FR-BE-054**: System MUST prevent credential enumeration attacks
  - **Response Uniformity**: Same response time and format for invalid username vs invalid password
  - **Error Messages**: Generic error messages ("Invalid credentials" instead of "Username not found")
  - **Timing**: Constant-time operations to prevent timing attacks

- **FR-BE-055**: System MUST implement HTTPS for all authentication endpoints
  - **Requirement**: All authentication API calls must use HTTPS
  - **Enforcement**: Reject HTTP requests to authentication endpoints in production
  - **Purpose**: Protect credentials in transit

- **FR-BE-056**: System MUST validate JWT token signature
  - **Validation**: Verify token signature on every authenticated request
  - **Expiration Check**: Verify token has not expired
  - **Revocation Check**: Verify token is not in blacklist (if implemented)

### Performance Requirements

- **FR-BE-060**: System MUST respond to login requests within 500ms
  - **Target**: 95th percentile response time under 500ms
  - **Includes**: Database lookup, password verification, token generation
  - **Measurement**: End-to-end request processing time

- **FR-BE-061**: System MUST handle 100 concurrent login requests
  - **Concurrency**: Support minimum 100 simultaneous authentication requests
  - **Scalability**: Design for horizontal scaling if needed

- **FR-BE-062**: System MUST optimize database queries for authentication
  - **Indexing**: Username field must be indexed for fast lookup
  - **Query Optimization**: Single query to retrieve user data
  - **Connection Pooling**: Use database connection pooling

---

## Non-Functional Requirements

### Scalability

- **NFR-BE-001**: System MUST scale horizontally for authentication load
  - **Stateless Design**: Authentication should be stateless (JWT tokens)
  - **Load Distribution**: Support multiple server instances
  - **Database Scaling**: Support read replicas for user data queries

### Reliability

- **NFR-BE-002**: System MUST maintain 99.9% uptime for authentication service
  - **Availability**: Authentication endpoint must be highly available
  - **Failover**: Automatic failover for database connections
  - **Error Recovery**: Graceful error handling and recovery

### Maintainability

- **NFR-BE-003**: System MUST follow project structure conventions
  - **Code Organization**: Follow backend project structure from `.cursor/rules/project-structure.mdc`
  - **Naming Conventions**: Follow naming conventions from `.cursor/rules/core-naming.mdc`
  - **Exception Handling**: Use BusinessException from Snap framework

### Observability

- **NFR-BE-004**: System MUST log all authentication events
  - **Success Logs**: Log successful authentications (username, timestamp, IP)
  - **Failure Logs**: Log failed authentication attempts (username, timestamp, IP, reason)
  - **Error Logs**: Log system errors during authentication
  - **Log Format**: Structured logging (JSON format)
  - **Log Level**: Appropriate log levels (INFO, WARN, ERROR)

- **NFR-BE-005**: System MUST track authentication metrics
  - **Metrics**: 
    - Login success rate
    - Login failure rate
    - Average response time
    - Token generation count
    - Rate limit hits
  - **Monitoring**: Integrate with monitoring service
  - **Alerts**: Alert on high failure rates or system errors

- **NFR-BE-006**: System MUST provide health check endpoint
  - **Endpoint**: `/api/health` or `/api/auth/health`
  - **Response**: Service status, database connectivity
  - **Purpose**: Monitor service availability

---

## Data Models

### User

**Description**: Represents a user in the system who can authenticate and access the application.

**Attributes**:
- `id` (string/UUID): Unique identifier for the user (primary key)
- `username` (string): Unique username for login (indexed, case-insensitive lookup)
  - **Constraints**: Required, unique, 1-255 characters
- `passwordHash` (string): Hashed password using bcrypt
  - **Constraints**: Required, never store plain text
- `role` (enum: Admin | Employee): User role for authorization
  - **Constraints**: Required, must be valid role
- `displayName` (string, optional): User's display name
  - **Constraints**: Optional, max 255 characters
- `email` (string, optional): User's email address
  - **Constraints**: Optional, valid email format if provided
- `status` (enum: Active | Blocked | Suspended): Account status
  - **Constraints**: Required, default: Active
- `createdAt` (datetime): Account creation timestamp
- `updatedAt` (datetime): Last update timestamp
- `lastLoginAt` (datetime, optional): Last successful login timestamp

**Relationships**:
- One user can have multiple login sessions (if session tracking is implemented)
- One user belongs to one role (Admin or Employee)

**Validation Rules**:
- Username must be unique (case-insensitive)
- Password hash must be valid bcrypt hash
- Role must be one of the defined roles
- Status must be one of: Active, Blocked, Suspended
- Only users with Active status can authenticate

**Indexes**:
- Primary key on `id`
- Unique index on `username` (case-insensitive)
- Index on `status` for filtering active users

### LoginAttempt

**Description**: Tracks login attempts for security and rate limiting purposes.

**Attributes**:
- `id` (string/UUID): Unique identifier (primary key)
- `username` (string): Username used in login attempt
- `ipAddress` (string): IP address of the login attempt
- `success` (boolean): Whether login was successful
- `failureReason` (string, optional): Reason for failure if unsuccessful
- `attemptedAt` (datetime): Timestamp of the login attempt

**Relationships**:
- Multiple login attempts can be associated with one user (by username)

**Validation Rules**:
- Username is required
- IP address is required
- Success flag is required
- Timestamp is required

**Indexes**:
- Index on `username` and `attemptedAt` for rate limiting queries
- Index on `ipAddress` and `attemptedAt` for IP-based rate limiting
- Index on `attemptedAt` for cleanup of old records

---

## Error Handling

### Error Scenarios

- **ERR-BE-001**: When username is missing in request, system MUST return 400 Bad Request
  - **Error Code**: `VALIDATION_ERROR`
  - **Error Message**: "Username is required"
  - **Response Format**: Standard error response with details

- **ERR-BE-002**: When password is missing in request, system MUST return 400 Bad Request
  - **Error Code**: `VALIDATION_ERROR`
  - **Error Message**: "Password is required"
  - **Response Format**: Standard error response with details

- **ERR-BE-003**: When username doesn't exist, system MUST return 401 Unauthorized
  - **Error Code**: `INVALID_CREDENTIALS`
  - **Error Message**: "Invalid credentials" (generic message)
  - **Response Format**: Standard error response
  - **Security**: Same response as invalid password to prevent enumeration

- **ERR-BE-004**: When password doesn't match, system MUST return 401 Unauthorized
  - **Error Code**: `INVALID_CREDENTIALS`
  - **Error Message**: "Invalid credentials" (generic message)
  - **Response Format**: Standard error response
  - **Security**: Same response as invalid username to prevent enumeration

- **ERR-BE-005**: When user account is blocked or suspended, system MUST return 403 Forbidden
  - **Error Code**: `ACCOUNT_DISABLED`
  - **Error Message**: "Account is disabled. Please contact administrator."
  - **Response Format**: Standard error response

- **ERR-BE-006**: When rate limit is exceeded, system MUST return 429 Too Many Requests
  - **Error Code**: `RATE_LIMIT_EXCEEDED`
  - **Error Message**: "Too many login attempts. Please try again later."
  - **Response Headers**: `Retry-After: <seconds>`
  - **Response Format**: Standard error response

- **ERR-BE-007**: When database connection fails, system MUST return 500 Internal Server Error
  - **Error Code**: `INTERNAL_SERVER_ERROR`
  - **Error Message**: "An error occurred. Please try again later."
  - **Response Format**: Standard error response
  - **Logging**: Log full error details for debugging

- **ERR-BE-008**: When JWT token generation fails, system MUST return 500 Internal Server Error
  - **Error Code**: `TOKEN_GENERATION_ERROR`
  - **Error Message**: "An error occurred during authentication. Please try again."
  - **Response Format**: Standard error response
  - **Logging**: Log error for investigation

- **ERR-BE-009**: When request body is malformed JSON, system MUST return 400 Bad Request
  - **Error Code**: `INVALID_REQUEST`
  - **Error Message**: "Invalid request format"
  - **Response Format**: Standard error response

### Error Response Format

All error responses MUST follow this standard format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Specific field error (for validation errors)"
    }
  }
}
```

**Error Codes**:
- `VALIDATION_ERROR`: Input validation failed
- `INVALID_CREDENTIALS`: Username or password is incorrect
- `ACCOUNT_DISABLED`: User account is blocked or suspended
- `RATE_LIMIT_EXCEEDED`: Too many login attempts
- `TOKEN_GENERATION_ERROR`: Failed to generate authentication token
- `INTERNAL_SERVER_ERROR`: Server error occurred
- `INVALID_REQUEST`: Request format is invalid
- `INVALID_TOKEN`: JWT token is invalid or expired

**HTTP Status Codes**:
- `400 Bad Request`: Validation errors, malformed requests
- `401 Unauthorized`: Invalid credentials, invalid token
- `403 Forbidden`: Account disabled, insufficient permissions
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server errors

---

## Success Criteria

- **SC-BE-001**: Login API endpoint responds within 500ms for 95% of requests
- **SC-BE-002**: System handles 100 concurrent login requests without degradation
- **SC-BE-003**: All functional requirements are implemented and tested
- **SC-BE-004**: Password hashing uses bcrypt with minimum 10 salt rounds
- **SC-BE-005**: Rate limiting prevents brute force attacks (5 attempts per IP per 15 minutes)
- **SC-BE-006**: All authentication events are logged (success and failure)
- **SC-BE-007**: JWT tokens are generated with proper expiration (24 hours default)
- **SC-BE-008**: System maintains 99.9% uptime for authentication service
- **SC-BE-009**: Database queries for user lookup are optimized with indexes
- **SC-BE-010**: Error responses follow standard format and include appropriate HTTP status codes
- **SC-BE-011**: System prevents credential enumeration attacks (uniform error responses)
- **SC-BE-012**: All passwords are stored as hashed values (never plain text)

---

## Notes

- Reference `product-info/product-overview.md` for system roles and common functionalities (Login functionality)
- Reference `specs/authentication/backend-specs.md` for technical implementation details
- Follow backend project structure from `.cursor/rules/project-structure.mdc`
- Use BusinessException from Snap framework for business logic errors (see `.cursor/rules/exception-handling.mdc`)
- Follow naming conventions from `.cursor/rules/core-naming.mdc`
- JWT secret key must be stored in environment variables, never in code
- Consider implementing refresh tokens for enhanced security in future iterations
- Password policy (minimum length, complexity) should be defined and documented
- Token expiration time should be configurable via environment variables
- Rate limiting thresholds should be configurable
- Consider implementing account lockout after multiple failed attempts (future enhancement)

