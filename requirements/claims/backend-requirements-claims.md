# Backend Requirements - Claims Module

**Module**: Employee Claims Management  
**Created**: 2025-12-11  
**Status**: Draft  
**Derived From**: OrangeHRM Legacy System Analysis & Frontend Requirements

## Overview

The Claims Module backend provides RESTful APIs for managing employee expense claims within the organization. It handles claim creation, assignment, expense tracking, attachment management, and claim submission workflows. The backend enforces business rules for claim validation, manages claim status transitions, calculates expense totals across multiple currencies, and maintains audit trails for all claim-related operations.

**System Roles Used:**
- **Admin**: Full CRUD access to all claims, can assign claims to any employee, approve/reject claims, access all API endpoints
- **Manager**: Can view and manage claims for their department/team, assign claims, approve claims within authority limits
- **HR Staff**: Can view and process all employee claims, manage claim submissions, access reporting endpoints
- **Employee**: Can view own claims, submit personal claims (limited to My Claims endpoints)

**Common Functionalities Used:**
- **Authentication**: JWT/session-based authentication for all protected endpoints
- **Authorization**: Role-based access control (RBAC) for endpoint permissions
- **Audit Logging**: Track all claim modifications with user, timestamp, and action
- **File Management**: Secure file upload/download for claim attachments with size validation (max 1MB)
- **Data Validation**: Server-side validation for all inputs with detailed error responses
- **Pagination**: Support for large result sets with cursor/offset-based pagination
- **Filtering & Sorting**: Advanced query capabilities for claim searches

**Dependencies:**
- Employee Module (employee data, validation, autocomplete)
- Configuration Module (event types, currencies, expense types, status values)
- User/Authentication Module (user session, roles, permissions)
- File Storage Service (attachment upload/retrieval)
- Email Notification Service (claim status notifications) [NEEDS CLARIFICATION: Email notifications not shown in UI]
- Database (PostgreSQL/MySQL for claim data persistence)

**Integration Points:**
- **Exposes**: RESTful APIs for claim management, expense tracking, attachment handling
- **Consumes**: Employee API (employee lookup), Configuration API (dropdowns), File Storage API (uploads)
- **Notifies**: Email service for claim status changes [NEEDS CLARIFICATION]
- **Reports**: Claim reporting/export endpoints [NEEDS CLARIFICATION: Not visible in screenshots]

---

## Functional Requirements

### Authentication & Authorization

- **FR-BE-001**: System MUST authenticate all API requests using session tokens or JWT
- **FR-BE-002**: System MUST validate user roles before allowing access to protected endpoints
- **FR-BE-003**: Admin and Manager roles MUST have full access to Employee Claims endpoints
- **FR-BE-004**: HR Staff role MUST have read and update access to all claims
- **FR-BE-005**: Employee role MUST only access their own claims via My Claims endpoints
- **FR-BE-006**: System MUST return 401 Unauthorized for unauthenticated requests
- **FR-BE-007**: System MUST return 403 Forbidden when user lacks required permissions
- **FR-BE-008**: System MUST validate session expiration and require re-authentication

### API Endpoints

#### Claim Search & Retrieval

- **FR-BE-010**: System MUST provide endpoint to search and filter claims
  - **Method**: GET
  - **Path**: `/api/claim/viewAssignClaim`
  - **Query Params**: 
    - `employeeName` (string, optional): Filter by employee name (partial match)
    - `referenceId` (string, optional): Filter by reference ID (exact match)
    - `eventName` (string, optional): Filter by event type
    - `status` (string, optional): Filter by claim status
    - `fromDate` (date, optional): Filter claims from this date (yyyy-mm-dd)
    - `toDate` (date, optional): Filter claims until this date (yyyy-mm-dd)
    - `include` (string, optional): Filter scope (CurrentEmployees/PastEmployees/All)
    - `page` (integer, optional): Page number for pagination (default: 1)
    - `limit` (integer, optional): Results per page (default: 25, max: 100)
    - `sortBy` (string, optional): Sort column (referenceId/employeeName/submittedDate/status/amount)
    - `sortOrder` (string, optional): Sort direction (asc/desc, default: desc)
  - **Response**: 
    ```json
    {
      "data": [
        {
          "referenceId": "202307180000003",
          "employeeName": "John Doe",
          "eventName": "Travel Allowance",
          "description": "Business trip expenses",
          "currency": "USD",
          "submittedDate": "2023-07-18",
          "status": "Submitted",
          "amount": 7300.32,
          "claimId": 123
        }
      ],
      "meta": {
        "total": 150,
        "page": 1,
        "limit": 25,
        "totalPages": 6
      }
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: Admin, Manager, HR Staff
  - **Validation**: Date range validation (fromDate <= toDate), valid status values
  - **Performance**: Must return results within 1 second for typical queries (<1000 records)

- **FR-BE-011**: System MUST provide endpoint to get claim details by ID
  - **Method**: GET
  - **Path**: `/api/claim/assignClaim/{claimId}`
  - **Path Params**: `claimId` (integer, required)
  - **Response**: 
    ```json
    {
      "claim": {
        "claimId": 123,
        "referenceId": "202307180000003",
        "employee": {
          "employeeId": 456,
          "employeeName": "John Doe",
          "department": "Engineering"
        },
        "event": "Travel Allowance",
        "currency": "USD",
        "status": "Initiated",
        "remarks": "Conference travel expenses",
        "createdAt": "2023-07-18T10:30:00Z",
        "createdBy": "admin_user",
        "updatedAt": "2023-07-18T10:30:00Z",
        "submittedDate": null
      },
      "expenses": [
        {
          "expenseId": 789,
          "expenseType": "Flight",
          "date": "2023-07-15",
          "amount": 450.00,
          "note": "Round trip to NYC"
        }
      ],
      "attachments": [
        {
          "attachmentId": 101,
          "fileName": "receipt.pdf",
          "description": "Flight receipt",
          "fileSize": 245678,
          "fileType": "application/pdf",
          "dateAdded": "2023-07-18T11:00:00Z",
          "addedBy": "admin_user",
          "downloadUrl": "/api/claim/attachment/101/download"
        }
      ],
      "totalAmount": 450.00
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: Admin, Manager, HR Staff, Employee (own claims only)
  - **Error**: 404 if claim not found, 403 if user lacks access

#### Claim Creation & Assignment

- **FR-BE-012**: System MUST provide endpoint to create new claim assignment
  - **Method**: POST
  - **Path**: `/api/claim/assignClaim`
  - **Request**: 
    ```json
    {
      "employeeId": 456,
      "event": "Travel Allowance",
      "currency": "USD",
      "remarks": "Conference expenses"
    }
    ```
  - **Response**: 
    ```json
    {
      "success": true,
      "claimId": 123,
      "referenceId": "202512110000008",
      "status": "Initiated",
      "message": "Claim created successfully"
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: Admin, Manager, HR Staff
  - **Validation**: 
    - employeeId must exist and be active
    - event must be valid event type from configuration
    - currency must be valid currency code
    - remarks max 500 characters
  - **Business Logic**: 
    - Auto-generate unique referenceId (format: YYYYMMDDXXXXXXX - date + sequence)
    - Set initial status to "Initiated"
    - Record creator information
    - Set createdAt timestamp

- **FR-BE-013**: System MUST provide endpoint to update claim details
  - **Method**: PUT
  - **Path**: `/api/claim/assignClaim/{claimId}`
  - **Request**: 
    ```json
    {
      "event": "Medical Reimbursement",
      "currency": "EUR",
      "remarks": "Updated remarks"
    }
    ```
  - **Response**: 
    ```json
    {
      "success": true,
      "message": "Claim updated successfully"
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: Admin, Manager, HR Staff
  - **Validation**: Can only update claims in "Initiated" status
  - **Error**: 400 if claim already submitted, 404 if not found

#### Expense Management

- **FR-BE-014**: System MUST provide endpoint to add expense to claim
  - **Method**: POST
  - **Path**: `/api/claim/expense`
  - **Request**: 
    ```json
    {
      "claimId": 123,
      "expenseType": "Flight",
      "date": "2023-07-15",
      "amount": 450.00,
      "note": "Round trip flight"
    }
    ```
  - **Response**: 
    ```json
    {
      "success": true,
      "expenseId": 789,
      "totalAmount": 1250.00,
      "message": "Expense added successfully"
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: Admin, Manager, HR Staff
  - **Validation**: 
    - claimId must exist
    - expenseType must be valid from configuration
    - date must be valid date (yyyy-mm-dd format)
    - amount must be positive number with max 2 decimal places
    - note max 500 characters
    - claim must be in "Initiated" status
  - **Business Logic**: 
    - Recalculate claim total amount
    - Validate expense date against claim creation date
    - Record who added the expense

- **FR-BE-015**: System MUST provide endpoint to update expense
  - **Method**: PUT
  - **Path**: `/api/claim/expense/{expenseId}`
  - **Request**: 
    ```json
    {
      "expenseType": "Train",
      "date": "2023-07-16",
      "amount": 75.50,
      "note": "Updated expense"
    }
    ```
  - **Response**: 
    ```json
    {
      "success": true,
      "totalAmount": 875.50,
      "message": "Expense updated successfully"
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: Admin, Manager, HR Staff
  - **Validation**: Can only update expenses for claims in "Initiated" status
  - **Business Logic**: Recalculate claim total amount

- **FR-BE-016**: System MUST provide endpoint to delete expense
  - **Method**: DELETE
  - **Path**: `/api/claim/expense/{expenseId}`
  - **Response**: 
    ```json
    {
      "success": true,
      "totalAmount": 800.00,
      "message": "Expense deleted successfully"
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: Admin, Manager, HR Staff
  - **Validation**: Can only delete expenses for claims in "Initiated" status
  - **Business Logic**: Recalculate claim total amount after deletion

- **FR-BE-017**: System MUST provide endpoint to get expenses for a claim
  - **Method**: GET
  - **Path**: `/api/claim/{claimId}/expenses`
  - **Response**: 
    ```json
    {
      "expenses": [...],
      "totalAmount": 1250.00,
      "currency": "USD"
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: Admin, Manager, HR Staff, Employee (own claims)

#### Attachment Management

- **FR-BE-018**: System MUST provide endpoint to upload attachment to claim
  - **Method**: POST
  - **Path**: `/api/claim/attachment`
  - **Content-Type**: multipart/form-data
  - **Request**: 
    - `claimId` (integer): Claim ID
    - `file` (file): File to upload
    - `comment` (string, optional): Description/comment
  - **Response**: 
    ```json
    {
      "success": true,
      "attachmentId": 101,
      "fileName": "receipt.pdf",
      "fileSize": 245678,
      "fileType": "application/pdf",
      "downloadUrl": "/api/claim/attachment/101/download",
      "message": "Attachment uploaded successfully"
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: Admin, Manager, HR Staff
  - **Validation**: 
    - File size must be ≤ 1MB (1048576 bytes)
    - File name must be sanitized (prevent path traversal)
    - Supported file types: PDF, JPG, JPEG, PNG, GIF, DOC, DOCX, XLS, XLSX
    - claimId must exist
    - claim must be in "Initiated" status
  - **Business Logic**: 
    - Generate unique file name to prevent conflicts
    - Store file metadata in database
    - Store physical file in secure file storage
    - Record uploader information and timestamp
    - Scan file for viruses/malware [NEEDS CLARIFICATION: Security requirement]
  - **Error**: 413 if file too large, 415 if unsupported file type

- **FR-BE-019**: System MUST provide endpoint to download attachment
  - **Method**: GET
  - **Path**: `/api/claim/attachment/{attachmentId}/download`
  - **Response**: Binary file stream with appropriate Content-Type and Content-Disposition headers
  - **Auth Required**: Yes
  - **Roles**: Admin, Manager, HR Staff, Employee (own claims)
  - **Security**: Validate user has access to the claim before serving file
  - **Error**: 404 if attachment not found, 403 if user lacks access

- **FR-BE-020**: System MUST provide endpoint to delete attachment
  - **Method**: DELETE
  - **Path**: `/api/claim/attachment/{attachmentId}`
  - **Response**: 
    ```json
    {
      "success": true,
      "message": "Attachment deleted successfully"
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: Admin, Manager, HR Staff
  - **Validation**: Can only delete attachments for claims in "Initiated" status
  - **Business Logic**: Delete both file metadata and physical file

- **FR-BE-021**: System MUST provide endpoint to get attachments for a claim
  - **Method**: GET
  - **Path**: `/api/claim/{claimId}/attachments`
  - **Response**: 
    ```json
    {
      "attachments": [...]
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: Admin, Manager, HR Staff, Employee (own claims)

#### Claim Submission & Status Management

- **FR-BE-022**: System MUST provide endpoint to submit claim
  - **Method**: PUT
  - **Path**: `/api/claim/submit/{claimId}`
  - **Request**: 
    ```json
    {
      "submissionNote": "Ready for approval"
    }
    ```
  - **Response**: 
    ```json
    {
      "success": true,
      "status": "Submitted",
      "submittedDate": "2023-07-18T15:30:00Z",
      "message": "Claim submitted successfully"
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: Admin, Manager, HR Staff
  - **Validation**: 
    - Claim must be in "Initiated" status
    - Claim must have at least one expense
    - Total amount must be > 0
  - **Business Logic**: 
    - Update status to "Submitted"
    - Set submittedDate to current timestamp
    - Lock claim from further edits (expenses/attachments)
    - Trigger notification to approvers [NEEDS CLARIFICATION]
    - Create audit log entry
  - **Error**: 400 if validation fails (no expenses, already submitted, etc.)

- **FR-BE-023**: System MUST provide endpoint to approve claim
  - **Method**: PUT
  - **Path**: `/api/claim/approve/{claimId}`
  - **Request**: 
    ```json
    {
      "approvalNote": "Approved for payment",
      "approvedAmount": 1250.00
    }
    ```
  - **Response**: 
    ```json
    {
      "success": true,
      "status": "Approved",
      "message": "Claim approved successfully"
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: Admin, Manager (with approval authority)
  - **Validation**: Claim must be in "Submitted" or "Pending Approval" status
  - **Business Logic**: 
    - Update status to "Approved"
    - Record approver and approval timestamp
    - Trigger notification to employee [NEEDS CLARIFICATION]
    - May trigger payment processing workflow [NEEDS CLARIFICATION]

- **FR-BE-024**: System MUST provide endpoint to reject claim
  - **Method**: PUT
  - **Path**: `/api/claim/reject/{claimId}`
  - **Request**: 
    ```json
    {
      "rejectionReason": "Missing receipts"
    }
    ```
  - **Response**: 
    ```json
    {
      "success": true,
      "status": "Rejected",
      "message": "Claim rejected"
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: Admin, Manager
  - **Validation**: Claim must be in "Submitted" or "Pending Approval" status
  - **Business Logic**: 
    - Update status to "Rejected"
    - Record rejector and rejection timestamp
    - Trigger notification to employee with reason [NEEDS CLARIFICATION]
    - May allow claim to be edited and resubmitted [NEEDS CLARIFICATION]

- **FR-BE-025**: System MUST provide endpoint to cancel claim
  - **Method**: PUT
  - **Path**: `/api/claim/cancel/{claimId}`
  - **Request**: 
    ```json
    {
      "cancellationReason": "Duplicate claim"
    }
    ```
  - **Response**: 
    ```json
    {
      "success": true,
      "status": "Cancelled",
      "message": "Claim cancelled"
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: Admin, Manager
  - **Business Logic**: Soft delete or mark as cancelled, retain for audit

#### Configuration & Lookup Endpoints

- **FR-BE-026**: System MUST provide endpoint to get employee autocomplete suggestions
  - **Method**: GET
  - **Path**: `/api/employee/autocomplete`
  - **Query Params**: `query` (string, min 2 characters)
  - **Response**: 
    ```json
    {
      "suggestions": [
        {
          "employeeId": 456,
          "employeeName": "John Doe",
          "department": "Engineering"
        }
      ]
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: Admin, Manager, HR Staff
  - **Performance**: Return results within 300ms

- **FR-BE-027**: System MUST provide endpoint to get event types
  - **Method**: GET
  - **Path**: `/api/configuration/events`
  - **Response**: 
    ```json
    {
      "events": [
        "Travel Allowance",
        "Medical Reimbursement",
        "Accommodation",
        ...
      ]
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: All authenticated users
  - **Caching**: Cache for 1 hour, rarely changes

- **FR-BE-028**: System MUST provide endpoint to get currencies
  - **Method**: GET
  - **Path**: `/api/configuration/currencies`
  - **Response**: 
    ```json
    {
      "currencies": [
        {"code": "USD", "name": "US Dollar", "symbol": "$"},
        {"code": "EUR", "name": "Euro", "symbol": "€"},
        ...
      ]
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: All authenticated users
  - **Caching**: Cache for 1 hour

- **FR-BE-029**: System MUST provide endpoint to get expense types
  - **Method**: GET
  - **Path**: `/api/configuration/expenseTypes`
  - **Response**: 
    ```json
    {
      "expenseTypes": [
        "Travel Expenses",
        "Accommodation",
        "Meals & Entertainment",
        ...
      ]
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: All authenticated users
  - **Caching**: Cache for 1 hour

- **FR-BE-030**: System MUST provide endpoint to get claim status values
  - **Method**: GET
  - **Path**: `/api/configuration/claimStatuses`
  - **Response**: 
    ```json
    {
      "statuses": [
        "Initiated",
        "Submitted",
        "Pending Approval",
        "Approved",
        "Rejected",
        "Paid",
        "Cancelled",
        "On Hold"
      ]
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: All authenticated users

### Data Management

- **FR-BE-031**: System MUST store all claim data with proper data types and constraints in relational database
- **FR-BE-032**: System MUST validate all input data before persistence using schema validation
- **FR-BE-033**: System MUST sanitize all text inputs to prevent XSS and SQL injection attacks
- **FR-BE-034**: System MUST enforce foreign key constraints for data integrity (claims → employees, expenses → claims, attachments → claims)
- **FR-BE-035**: System MUST support transactions for operations affecting multiple tables (e.g., claim submission updates claim + creates audit log)
- **FR-BE-036**: System MUST maintain referential integrity when deleting records (cascade or prevent deletion if references exist)
- **FR-BE-037**: System MUST store timestamps in UTC format and convert to user timezone on response
- **FR-BE-038**: System MUST handle concurrent updates using optimistic locking (version field) to prevent data loss
- **FR-BE-039**: System MUST backup claim data regularly with point-in-time recovery capability [NEEDS CLARIFICATION: Backup strategy]

### Business Logic

- **FR-BE-040**: System MUST auto-generate unique reference IDs in format YYYYMMDDXXXXXXX (date + sequence number)
- **FR-BE-041**: System MUST calculate total claim amount by summing all expense amounts with 2 decimal precision
- **FR-BE-042**: System MUST validate that claim currency matches expense currency (all expenses must use same currency as claim)
- **FR-BE-043**: System MUST enforce claim status state machine transitions:
  - Initiated → Submitted, Cancelled
  - Submitted → Pending Approval, Approved, Rejected, Cancelled
  - Pending Approval → Approved, Rejected, On Hold
  - Approved → Paid, Cancelled
  - Rejected → Initiated (for resubmission) [NEEDS CLARIFICATION]
  - No transitions from Paid or Cancelled states
- **FR-BE-044**: System MUST prevent modification of claims not in "Initiated" status (expenses, attachments, claim details)
- **FR-BE-045**: System MUST validate expense dates are not in the future
- **FR-BE-046**: System MUST validate expense dates are within reasonable range (e.g., not more than 1 year old) [NEEDS CLARIFICATION: Policy requirement]
- **FR-BE-047**: System MUST enforce business rules for claim approval authority based on user role and claim amount [NEEDS CLARIFICATION: Approval limits]
- **FR-BE-048**: System MUST track claim modifications in audit log (who, what, when)
- **FR-BE-049**: System MUST validate employee status is "Active" when creating claims
- **FR-BE-050**: System MUST prevent duplicate reference IDs through unique constraint
- **FR-BE-051**: System MUST round all monetary amounts to 2 decimal places
- **FR-BE-052**: System MUST validate file extensions match actual file MIME types (prevent file type spoofing)

### Integration Requirements

- **FR-BE-053**: System MUST integrate with Employee module to validate employee IDs and retrieve employee data
  - **Purpose**: Ensure claims are created for valid, active employees
  - **Data Flow**: Send employeeId, receive employee details and status
  - **Error Handling**: Return 400 if employee not found or inactive

- **FR-BE-054**: System MUST integrate with Configuration module to retrieve dropdown options
  - **Purpose**: Populate events, currencies, expense types, status values
  - **Data Flow**: Request configuration data, cache responses
  - **Error Handling**: Use cached data if configuration service unavailable, return 500 if cache empty

- **FR-BE-055**: System MUST integrate with File Storage service to persist attachments
  - **Purpose**: Store claim attachment files securely
  - **Data Flow**: Upload file, receive storage path/URL, store metadata in database
  - **Error Handling**: Clean up database record if file upload fails

- **FR-BE-056**: System MUST integrate with Email Notification service for claim events [NEEDS CLARIFICATION]
  - **Purpose**: Notify users of claim status changes
  - **Data Flow**: Trigger email on submit, approve, reject events
  - **Error Handling**: Log email failures but don't block claim operations

- **FR-BE-057**: System MUST integrate with Audit Log service to record all claim operations
  - **Purpose**: Maintain compliance and audit trail
  - **Data Flow**: Send action, user, timestamp, entity details
  - **Error Handling**: Log locally if audit service unavailable

### Security Requirements

- **FR-BE-058**: System MUST encrypt sensitive data at rest (database encryption)
- **FR-BE-059**: System MUST use HTTPS for all API communications (TLS 1.2+)
- **FR-BE-060**: System MUST validate and sanitize all input to prevent SQL injection attacks
- **FR-BE-061**: System MUST validate and sanitize all input to prevent XSS attacks
- **FR-BE-062**: System MUST implement rate limiting (100 requests/minute per user) to prevent abuse
- **FR-BE-063**: System MUST implement CORS policies to restrict API access to authorized origins
- **FR-BE-064**: System MUST hash and salt passwords if storing user credentials (use bcrypt/argon2)
- **FR-BE-065**: System MUST implement request signing or CSRF tokens for state-changing operations
- **FR-BE-066**: System MUST sanitize file names to prevent path traversal attacks (../../etc/passwd)
- **FR-BE-067**: System MUST validate file content, not just extension (magic number validation)
- **FR-BE-068**: System MUST implement virus scanning for uploaded files [NEEDS CLARIFICATION: Antivirus integration]
- **FR-BE-069**: System MUST log all authentication attempts (success and failure) for security monitoring
- **FR-BE-070**: System MUST implement account lockout after N failed login attempts [NEEDS CLARIFICATION: Threshold]
- **FR-BE-071**: System MUST enforce role-based access control at API endpoint level (not just UI)
- **FR-BE-072**: System MUST validate JWT tokens on every request and check expiration
- **FR-BE-073**: System MUST prevent parameter tampering (verify claimId ownership for Employee role)

### Performance Requirements

- **FR-BE-074**: System MUST respond to claim search requests within 1 second for typical queries (<1000 results)
- **FR-BE-075**: System MUST respond to claim detail requests within 200ms
- **FR-BE-076**: System MUST respond to claim creation requests within 500ms
- **FR-BE-077**: System MUST handle file uploads within 5 seconds for 1MB files
- **FR-BE-078**: System MUST support at least 100 concurrent users without performance degradation
- **FR-BE-079**: System MUST implement database query optimization (indexes on foreign keys, search columns)
- **FR-BE-080**: System MUST implement connection pooling for database connections
- **FR-BE-081**: System MUST implement caching for configuration data (Redis/in-memory)
- **FR-BE-082**: System MUST paginate large result sets (max 100 records per page)

---

## Non-Functional Requirements

### Scalability

- **NFR-BE-001**: System MUST support horizontal scaling (stateless API design)
- **NFR-BE-002**: System MUST handle 1000+ concurrent requests during peak hours
- **NFR-BE-003**: System MUST scale to 100,000+ claims per year without performance degradation
- **NFR-BE-004**: System MUST use connection pooling to efficiently manage database connections

### Reliability

- **NFR-BE-005**: System MUST maintain 99.9% uptime during business hours
- **NFR-BE-006**: System MUST implement graceful degradation (serve cached data if external services fail)
- **NFR-BE-007**: System MUST implement retry logic with exponential backoff for transient failures
- **NFR-BE-008**: System MUST implement circuit breakers for external service calls
- **NFR-BE-009**: System MUST validate data integrity with database constraints and application-level checks
- **NFR-BE-010**: System MUST implement health check endpoint for monitoring (`/api/health`)

### Maintainability

- **NFR-BE-011**: System MUST follow consistent RESTful API design patterns
- **NFR-BE-012**: System MUST use clear HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- **NFR-BE-013**: System MUST provide comprehensive API documentation (OpenAPI/Swagger)
- **NFR-BE-014**: System MUST follow project structure conventions (controllers, services, repositories pattern)
- **NFR-BE-015**: System MUST implement dependency injection for testability
- **NFR-BE-016**: System MUST have unit tests with >80% code coverage
- **NFR-BE-017**: System MUST have integration tests for all API endpoints
- **NFR-BE-018**: System MUST use environment variables for configuration (no hardcoded values)
- **NFR-BE-019**: System MUST version APIs to support backward compatibility (`/api/v1/claim/...`)

### Observability

- **NFR-BE-020**: System MUST implement structured logging (JSON format) with correlation IDs
- **NFR-BE-021**: System MUST log all API requests with method, path, user, timestamp, response time
- **NFR-BE-022**: System MUST log all errors with stack traces and context
- **NFR-BE-023**: System MUST log all business events (claim created, submitted, approved, rejected)
- **NFR-BE-024**: System MUST implement metrics collection (request count, response time, error rate)
- **NFR-BE-025**: System MUST integrate with error tracking service (Sentry/Rollbar)
- **NFR-BE-026**: System MUST provide debug logging mode for troubleshooting
- **NFR-BE-027**: System MUST implement request tracing for distributed systems (if microservices)
- **NFR-BE-028**: System MUST expose metrics endpoint for monitoring (`/api/metrics`)

---

## Data Models

### Claim

**Description**: Core entity representing an expense claim submitted by or assigned to an employee

**Attributes**:
- `claimId` (integer, primary key): Auto-incrementing unique identifier
- `referenceId` (string, unique, not null): Human-readable unique reference (format: YYYYMMDDXXXXXXX)
- `employeeId` (integer, foreign key → Employee, not null): Employee this claim belongs to
- `eventName` (string, not null, max 100 chars): Type of expense event (Travel, Medical, etc.)
- `currency` (string, not null, 3 chars): ISO currency code (USD, EUR, etc.)
- `status` (enum, not null): Current claim status (Initiated, Submitted, Approved, Rejected, Paid, Cancelled, On Hold, Pending Approval)
- `remarks` (text, nullable, max 500 chars): Optional notes/comments about the claim
- `totalAmount` (decimal(10,2), not null, default 0.00): Sum of all expense amounts
- `submittedDate` (datetime, nullable): When claim was submitted for approval
- `approvedDate` (datetime, nullable): When claim was approved
- `approvedBy` (integer, foreign key → User, nullable): User who approved the claim
- `approvalNote` (text, nullable, max 500 chars): Approval comments
- `rejectedDate` (datetime, nullable): When claim was rejected
- `rejectedBy` (integer, foreign key → User, nullable): User who rejected the claim
- `rejectionReason` (text, nullable, max 500 chars): Reason for rejection
- `createdAt` (datetime, not null): Timestamp when claim was created
- `createdBy` (integer, foreign key → User, not null): User who created the claim
- `updatedAt` (datetime, not null): Timestamp of last update
- `updatedBy` (integer, foreign key → User, not null): User who last updated the claim
- `version` (integer, not null, default 1): Optimistic locking version

**Relationships**:
- Many-to-One with Employee (one employee can have many claims)
- One-to-Many with Expense (one claim has many expenses)
- One-to-Many with Attachment (one claim has many attachments)
- Many-to-One with User (creator, approver, rejector)

**Indexes**:
- Primary key on `claimId`
- Unique index on `referenceId`
- Index on `employeeId` (foreign key, frequent joins)
- Index on `status` (frequent filtering)
- Index on `submittedDate` (frequent sorting/filtering)
- Composite index on (`employeeId`, `status`) for common queries

**Validation Rules**:
- referenceId must match pattern `^\d{13,}$`
- eventName must be from allowed event types
- currency must be valid ISO 4217 code
- status must transition according to state machine rules
- totalAmount must be >= 0
- submittedDate must be >= createdAt
- approvedDate must be >= submittedDate
- If status = "Approved", approvedBy and approvedDate must not be null
- If status = "Rejected", rejectedBy and rejectedDate must not be null

**Constraints**:
- `CHECK (totalAmount >= 0)`
- `CHECK (submittedDate IS NULL OR submittedDate >= createdAt)`
- `CHECK (approvedDate IS NULL OR approvedDate >= submittedDate)`

### Expense

**Description**: Individual expense item within a claim

**Attributes**:
- `expenseId` (integer, primary key): Auto-incrementing unique identifier
- `claimId` (integer, foreign key → Claim, not null): Parent claim
- `expenseType` (string, not null, max 100 chars): Type of expense (Flight, Hotel, Meals, etc.)
- `expenseDate` (date, not null): Date when expense occurred
- `amount` (decimal(10,2), not null): Expense amount in claim currency
- `note` (text, nullable, max 500 chars): Optional description/notes
- `createdAt` (datetime, not null): When expense was added
- `createdBy` (integer, foreign key → User, not null): Who added the expense
- `updatedAt` (datetime, not null): Last update timestamp
- `updatedBy` (integer, foreign key → User, not null): Who last updated

**Relationships**:
- Many-to-One with Claim (many expenses belong to one claim)
- Many-to-One with User (creator, updater)

**Indexes**:
- Primary key on `expenseId`
- Index on `claimId` (foreign key, frequent joins)
- Index on `expenseDate` (sorting)

**Validation Rules**:
- expenseType must be from allowed expense types
- expenseDate must not be in the future
- expenseDate should be within reasonable range (e.g., last 365 days) [NEEDS CLARIFICATION]
- amount must be > 0
- amount must have max 2 decimal places

**Constraints**:
- `CHECK (amount > 0)`
- `CHECK (expenseDate <= CURRENT_DATE)`

**Triggers**:
- After INSERT: Update Claim.totalAmount
- After UPDATE: Update Claim.totalAmount
- After DELETE: Update Claim.totalAmount

### Attachment

**Description**: File attachment associated with a claim (receipts, invoices, supporting documents)

**Attributes**:
- `attachmentId` (integer, primary key): Auto-incrementing unique identifier
- `claimId` (integer, foreign key → Claim, not null): Parent claim
- `originalFileName` (string, not null, max 255 chars): Original name of uploaded file
- `storedFileName` (string, not null, max 255 chars): Unique name in file storage (UUID-based)
- `filePath` (string, not null, max 500 chars): Full path to file in storage
- `fileSize` (integer, not null): File size in bytes
- `fileType` (string, not null, max 100 chars): MIME type (application/pdf, image/jpeg, etc.)
- `description` (text, nullable, max 500 chars): User-provided comment/description
- `uploadedAt` (datetime, not null): When file was uploaded
- `uploadedBy` (integer, foreign key → User, not null): Who uploaded the file

**Relationships**:
- Many-to-One with Claim (many attachments belong to one claim)
- Many-to-One with User (uploader)

**Indexes**:
- Primary key on `attachmentId`
- Index on `claimId` (foreign key, frequent joins)
- Index on `storedFileName` (for file retrieval)

**Validation Rules**:
- originalFileName must not contain path separators (/, \)
- fileSize must be <= 1048576 (1MB)
- fileType must be in allowed list (PDF, images, Office docs)
- storedFileName must be unique across all attachments

**Constraints**:
- `CHECK (fileSize > 0 AND fileSize <= 1048576)`
- `UNIQUE (storedFileName)`

### AuditLog

**Description**: Audit trail for all claim-related operations

**Attributes**:
- `auditId` (integer, primary key): Auto-incrementing unique identifier
- `entityType` (string, not null): Type of entity (Claim, Expense, Attachment)
- `entityId` (integer, not null): ID of the entity
- `action` (string, not null): Action performed (CREATE, UPDATE, DELETE, SUBMIT, APPROVE, REJECT)
- `userId` (integer, foreign key → User, not null): User who performed the action
- `timestamp` (datetime, not null): When action occurred
- `oldValues` (json, nullable): Entity state before change
- `newValues` (json, nullable): Entity state after change
- `ipAddress` (string, nullable, max 45 chars): User's IP address
- `userAgent` (string, nullable, max 500 chars): User's browser/client

**Relationships**:
- Many-to-One with User

**Indexes**:
- Primary key on `auditId`
- Index on `entityType` and `entityId` (for entity history queries)
- Index on `userId` (for user activity queries)
- Index on `timestamp` (for time-based queries)

**Validation Rules**:
- entityType must be from allowed values (Claim, Expense, Attachment)
- action must be from allowed values
- timestamp must be in the past or present

### ClaimStatusHistory

**Description**: History of status changes for claims (optional, for detailed tracking)

**Attributes**:
- `historyId` (integer, primary key): Auto-incrementing unique identifier
- `claimId` (integer, foreign key → Claim, not null): Parent claim
- `fromStatus` (enum, not null): Previous status
- `toStatus` (enum, not null): New status
- `changedBy` (integer, foreign key → User, not null): User who changed status
- `changedAt` (datetime, not null): When status changed
- `note` (text, nullable, max 500 chars): Reason/comment for change

**Relationships**:
- Many-to-One with Claim
- Many-to-One with User

**Indexes**:
- Primary key on `historyId`
- Index on `claimId` (for claim history queries)
- Index on `changedAt` (for time-based queries)

---

## Error Handling

### Error Scenarios

- **ERR-BE-001**: When claim not found, system MUST return 404 with error: "Claim not found"
- **ERR-BE-002**: When user lacks permission, system MUST return 403 with error: "Access denied"
- **ERR-BE-003**: When required field missing, system MUST return 400 with error: "Missing required field: {fieldName}"
- **ERR-BE-004**: When invalid data type, system MUST return 400 with error: "Invalid data type for field: {fieldName}"
- **ERR-BE-005**: When invalid date format, system MUST return 400 with error: "Invalid date format. Expected: YYYY-MM-DD"
- **ERR-BE-006**: When date range invalid (fromDate > toDate), system MUST return 400 with error: "From date must be before or equal to To date"
- **ERR-BE-007**: When employee not found, system MUST return 400 with error: "Employee not found or inactive"
- **ERR-BE-008**: When invalid status transition, system MUST return 400 with error: "Cannot change claim status from {currentStatus} to {newStatus}"
- **ERR-BE-009**: When claim already submitted, system MUST return 400 with error: "Cannot modify submitted claim"
- **ERR-BE-010**: When expense date in future, system MUST return 400 with error: "Expense date cannot be in the future"
- **ERR-BE-011**: When file too large, system MUST return 413 with error: "File size exceeds maximum limit of 1MB"
- **ERR-BE-012**: When unsupported file type, system MUST return 415 with error: "Unsupported file type: {fileType}"
- **ERR-BE-013**: When duplicate reference ID, system MUST return 409 with error: "Reference ID already exists"
- **ERR-BE-014**: When database connection fails, system MUST return 500 with error: "Database error. Please try again later"
- **ERR-BE-015**: When external service unavailable, system MUST return 503 with error: "{ServiceName} is temporarily unavailable"
- **ERR-BE-016**: When authentication fails, system MUST return 401 with error: "Authentication required"
- **ERR-BE-017**: When session expired, system MUST return 401 with error: "Session expired. Please login again"
- **ERR-BE-018**: When rate limit exceeded, system MUST return 429 with error: "Too many requests. Please try again later"
- **ERR-BE-019**: When validation fails, system MUST return 400 with error: "Validation failed" and array of field-specific errors
- **ERR-BE-020**: When claim cannot be submitted (no expenses), system MUST return 400 with error: "Cannot submit claim with no expenses"
- **ERR-BE-021**: When concurrent update detected, system MUST return 409 with error: "Claim was modified by another user. Please refresh and try again"
- **ERR-BE-022**: When file storage fails, system MUST return 500 with error: "File upload failed. Please try again"
- **ERR-BE-023**: When virus detected in file, system MUST return 400 with error: "File failed security scan"

### Error Response Format

```json
{
  "error": {
    "code": "CLAIM_NOT_FOUND",
    "message": "Claim not found",
    "details": {
      "claimId": 123,
      "timestamp": "2023-07-18T15:30:00Z",
      "path": "/api/claim/assignClaim/123"
    },
    "validationErrors": [
      {
        "field": "employeeId",
        "message": "Employee ID is required",
        "code": "REQUIRED_FIELD"
      }
    ]
  }
}
```

**Error Code Conventions**:
- CLAIM_NOT_FOUND
- ACCESS_DENIED
- VALIDATION_ERROR
- INVALID_STATUS_TRANSITION
- CLAIM_ALREADY_SUBMITTED
- FILE_TOO_LARGE
- UNSUPPORTED_FILE_TYPE
- DUPLICATE_REFERENCE_ID
- DATABASE_ERROR
- SERVICE_UNAVAILABLE
- AUTHENTICATION_REQUIRED
- SESSION_EXPIRED
- RATE_LIMIT_EXCEEDED
- CONCURRENT_MODIFICATION

---

## Success Criteria

- **SC-BE-001**: All API endpoints respond within defined SLA (search: 1s, detail: 200ms, create: 500ms)
- **SC-BE-002**: System handles 100+ concurrent users without performance degradation
- **SC-BE-003**: System maintains 99.9% uptime during business hours
- **SC-BE-004**: All functional requirements (FR-BE-001 through FR-BE-082) are implemented and tested
- **SC-BE-005**: Unit test coverage >80% for all business logic
- **SC-BE-006**: Integration tests cover all API endpoints with success and error scenarios
- **SC-BE-007**: All security vulnerabilities identified in security scan are remediated
- **SC-BE-008**: API documentation (Swagger/OpenAPI) is complete and accurate
- **SC-BE-009**: Database queries are optimized with appropriate indexes (all queries <100ms)
- **SC-BE-010**: Error messages are clear, actionable, and do not expose sensitive information
- **SC-BE-011**: Audit logs capture 100% of claim modifications with complete context
- **SC-BE-012**: File uploads complete successfully for files up to 1MB within 5 seconds
- **SC-BE-013**: System correctly enforces role-based access control (no unauthorized access possible)
- **SC-BE-014**: Data integrity is maintained (no orphaned records, no constraint violations)
- **SC-BE-015**: System handles edge cases gracefully (empty results, null values, boundary conditions)

---

## API Response Examples

### Success Response - List Claims
```json
{
  "data": [
    {
      "claimId": 123,
      "referenceId": "202307180000003",
      "employeeName": "John Doe",
      "eventName": "Travel Allowance",
      "description": "Business trip to NYC",
      "currency": "USD",
      "submittedDate": "2023-07-18",
      "status": "Submitted",
      "amount": 1250.00
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 25,
    "totalPages": 6
  }
}
```

### Success Response - Create Claim
```json
{
  "success": true,
  "claimId": 124,
  "referenceId": "202512110000008",
  "status": "Initiated",
  "message": "Claim created successfully",
  "links": {
    "self": "/api/claim/assignClaim/124",
    "addExpense": "/api/claim/expense",
    "addAttachment": "/api/claim/attachment"
  }
}
```

### Error Response - Validation
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "timestamp": "2023-07-18T15:30:00Z",
      "path": "/api/claim/assignClaim"
    },
    "validationErrors": [
      {
        "field": "employeeId",
        "message": "Employee ID is required",
        "code": "REQUIRED_FIELD"
      },
      {
        "field": "currency",
        "message": "Invalid currency code",
        "code": "INVALID_VALUE",
        "allowedValues": ["USD", "EUR", "GBP", "..."]
      }
    ]
  }
}
```

---

## Database Schema Summary

```sql
-- Simplified schema for reference

CREATE TABLE claims (
    claim_id INT PRIMARY KEY AUTO_INCREMENT,
    reference_id VARCHAR(20) UNIQUE NOT NULL,
    employee_id INT NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    currency CHAR(3) NOT NULL,
    status ENUM('Initiated', 'Submitted', 'Pending Approval', 'Approved', 'Rejected', 'Paid', 'Cancelled', 'On Hold') NOT NULL,
    remarks TEXT,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    submitted_date DATETIME,
    approved_date DATETIME,
    approved_by INT,
    approval_note TEXT,
    rejected_date DATETIME,
    rejected_by INT,
    rejection_reason TEXT,
    created_at DATETIME NOT NULL,
    created_by INT NOT NULL,
    updated_at DATETIME NOT NULL,
    updated_by INT NOT NULL,
    version INT NOT NULL DEFAULT 1,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id),
    FOREIGN KEY (rejected_by) REFERENCES users(user_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id),
    FOREIGN KEY (updated_by) REFERENCES users(user_id),
    INDEX idx_employee (employee_id),
    INDEX idx_status (status),
    INDEX idx_submitted_date (submitted_date),
    INDEX idx_employee_status (employee_id, status)
);

CREATE TABLE expenses (
    expense_id INT PRIMARY KEY AUTO_INCREMENT,
    claim_id INT NOT NULL,
    expense_type VARCHAR(100) NOT NULL,
    expense_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    note TEXT,
    created_at DATETIME NOT NULL,
    created_by INT NOT NULL,
    updated_at DATETIME NOT NULL,
    updated_by INT NOT NULL,
    FOREIGN KEY (claim_id) REFERENCES claims(claim_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(user_id),
    FOREIGN KEY (updated_by) REFERENCES users(user_id),
    INDEX idx_claim (claim_id),
    INDEX idx_date (expense_date)
);

CREATE TABLE attachments (
    attachment_id INT PRIMARY KEY AUTO_INCREMENT,
    claim_id INT NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    stored_file_name VARCHAR(255) UNIQUE NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL CHECK (file_size > 0 AND file_size <= 1048576),
    file_type VARCHAR(100) NOT NULL,
    description TEXT,
    uploaded_at DATETIME NOT NULL,
    uploaded_by INT NOT NULL,
    FOREIGN KEY (claim_id) REFERENCES claims(claim_id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id),
    INDEX idx_claim (claim_id),
    INDEX idx_stored_file (stored_file_name)
);

CREATE TABLE audit_logs (
    audit_id INT PRIMARY KEY AUTO_INCREMENT,
    entity_type ENUM('Claim', 'Expense', 'Attachment') NOT NULL,
    entity_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    timestamp DATETIME NOT NULL,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_user (user_id),
    INDEX idx_timestamp (timestamp)
);
```

---

## Notes

- Reference `product-info/product-overview.md` for system roles and common functionalities
- Reference `specs/claims/backend-specs.md` for technical implementation details (Node.js/Express, database choice, etc.)
- Reference `specs/claims/frontend-requirements.md` for corresponding frontend requirements
- Legacy system uses PHP - modernization target is Node.js/Express or similar
- Consider using Prisma or TypeORM for database ORM
- Consider using Joi or Zod for input validation schemas
- Consider using Winston or Pino for structured logging
- Consider using Bull or Bee-Queue for background job processing (email notifications, file processing)
- Consider using Redis for caching configuration data and session management
- All timestamps should be stored in UTC and converted to user timezone on response
- All monetary amounts use DECIMAL(10,2) for precision (supports up to 99,999,999.99)
- File storage should use cloud storage (AWS S3, Azure Blob, GCS) or local filesystem with appropriate security
- API versioning strategy: Use URL path versioning (`/api/v1/claim/...`) for major versions
- Rate limiting should be implemented at API gateway or middleware level
- CORS configuration should allow only authorized frontend domains
- Consider implementing GraphQL as alternative to REST for complex queries [NEEDS CLARIFICATION]
- Consider implementing WebSocket for real-time claim status updates [NEEDS CLARIFICATION]
- Pagination strategy: Use cursor-based pagination for better performance on large datasets
- Search optimization: Consider implementing Elasticsearch for full-text search if needed
- Approval workflow: May require approval routing based on claim amount and organizational hierarchy [NEEDS CLARIFICATION]
- Payment integration: May require integration with payroll or payment processing system [NEEDS CLARIFICATION]
- Reporting: May require additional endpoints for analytics and reporting [NEEDS CLARIFICATION]
- Multi-currency support: Currency conversion rates may be needed for reporting [NEEDS CLARIFICATION]
- Localization: Error messages may need to support multiple languages [NEEDS CLARIFICATION]
