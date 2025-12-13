# Backend Specifications - Opportunity Module

**Feature Branch**: `opportunity-backend`  
**Created**: 2025-12-13  
**Status**: Draft  
**Input**: Backend requirements for Opportunity module - Generate backend specification covering all CRUD operations, bulk import/export, relationships, analytics, and business logic

## User Scenarios & Testing *(mandatory)*

### User Story 1 - System Creates New Opportunity Record (Priority: P1)

As an authenticated sales representative, I want the system to create a new opportunity record with all required and optional fields, so that I can track potential sales deals through the sales pipeline.

**Why this priority**: Creating opportunities is the foundation of the CRM opportunity management system. This is the primary way new sales deals enter the system and enables the entire opportunity workflow. Without this capability, the CRM cannot fulfill its core purpose.

**Independent Test**: Can be fully tested by sending a POST request to `/api/opportunities` with valid required fields (name, amount, salesStage, accountId, expectedCloseDate) and verifying successful creation with auto-generated fields (id, dateCreated, dateModified). This delivers immediate value by allowing users to capture new sales opportunities.

**Acceptance Scenarios**:

1. **Given** an authenticated user provides valid opportunity data with all required fields, **When** the system receives the POST request to `/api/opportunities`, **Then** it validates data, creates the opportunity record, and returns 201 Created with the created opportunity object
2. **Given** an opportunity is created, **When** the system creates the record, **Then** it auto-generates id, sets dateCreated and dateModified to current timestamp, and sets createdBy and modifiedBy to current user ID
3. **Given** an authenticated user provides optional fields (probability, nextStep, description, type, leadSource, campaignId, assignedToId), **When** the system creates the opportunity, **Then** it stores all provided optional fields correctly
4. **Given** an authenticated user provides invalid required fields (missing name, invalid amount, invalid salesStage), **When** the system receives the request, **Then** it returns 400 Bad Request with field-specific validation error messages

---

### User Story 2 - System Retrieves List of Opportunities with Filtering and Sorting (Priority: P1)

As an authenticated user, I want the system to retrieve a list of opportunities with pagination, filtering, and sorting capabilities, so that I can efficiently browse and search through the sales pipeline.

**Why this priority**: Listing opportunities is the primary way users access and manage their sales pipeline. Without efficient list retrieval with filtering and sorting, users cannot effectively manage large numbers of opportunities. This is critical for daily operations.

**Independent Test**: Can be fully tested by sending a GET request to `/api/opportunities` with query parameters for pagination, sorting, and filtering, and verifying the response contains paginated results with correct metadata. This delivers immediate value by enabling users to access and navigate their opportunity list.

**Acceptance Scenarios**:

1. **Given** an authenticated user requests opportunities list without query parameters, **When** the system receives the GET request to `/api/opportunities`, **Then** it returns first page (20 records default) with pagination metadata (total count, current page, total pages)
2. **Given** an authenticated user requests opportunities with sortBy="amount" and sortOrder="desc", **When** the system responds, **Then** it returns opportunities sorted by amount in descending order
3. **Given** an authenticated user requests opportunities with filter criteria (salesStage="Closed Won", assignedTo=currentUserId), **When** the system responds, **Then** it returns only opportunities matching all filter criteria combined with AND logic
4. **Given** an Employee user requests opportunities list, **When** the system responds, **Then** it filters results to show only opportunities assigned to that user or within their permission scope
5. **Given** an Admin user requests opportunities list, **When** the system responds, **Then** it returns all opportunities across the organization

---

### User Story 3 - System Updates Existing Opportunity (Priority: P1)

As an authenticated sales representative, I want the system to update an existing opportunity record, so that I can modify opportunity details as deals progress through the sales pipeline.

**Why this priority**: Updating opportunities is essential for maintaining accurate and current sales data. Deals evolve over time, and users must be able to update information such as sales stage, amount, close date, and other details. This is critical for accurate pipeline management.

**Independent Test**: Can be fully tested by sending a PATCH request to `/api/opportunities/:id` with updated fields and verifying successful update with updated dateModified and modifiedBy fields. This delivers immediate value by allowing users to keep opportunity data current.

**Acceptance Scenarios**:

1. **Given** an authenticated user provides updated opportunity data, **When** the system receives a PATCH request to `/api/opportunities/:id`, **Then** it validates data, updates the record, and returns 200 OK with updated opportunity object
2. **Given** an opportunity is updated, **When** the system updates the record, **Then** it automatically updates dateModified to current timestamp and modifiedBy to current user ID
3. **Given** an authenticated user updates sales stage, **When** the system updates the record, **Then** it recalculates days at current sales stage for insights display
4. **Given** an authenticated user attempts to update an opportunity they don't have permission to modify, **When** the system receives the request, **Then** it returns 403 Forbidden with appropriate error message

---

### User Story 4 - System Performs Bulk Import of Opportunities (Priority: P2)

As an authenticated sales administrator, I want the system to import multiple opportunities from a file through a multi-step process with duplicate detection and error handling, so that I can bulk load opportunity data from external sources efficiently.

**Why this priority**: Import functionality is essential for data migration, bulk data entry, and integrating with external systems. While not used daily by all users, it's critical for administrators who need to load large volumes of opportunity data. This significantly improves data entry efficiency.

**Independent Test**: Can be fully tested by uploading an import file, completing all import steps (file analysis, field mapping, duplicate check configuration), executing import, and verifying opportunities are created correctly with proper error reporting. This delivers value by enabling efficient bulk data entry.

**Acceptance Scenarios**:

1. **Given** an authenticated user uploads a valid import file, **When** the system receives the file via POST to `/api/opportunities/import/upload`, **Then** it validates file format and filename, stores the file, and returns file metadata
2. **Given** an uploaded file is analyzed, **When** the system receives POST to `/api/opportunities/import/analyze`, **Then** it detects file properties (delimiter, encoding, header row) and returns data preview
3. **Given** field mappings are configured, **When** the system receives POST to `/api/opportunities/import/map-fields`, **Then** it validates all required fields are mapped and stores the mapping configuration
4. **Given** duplicate check fields are configured, **When** the system receives POST to `/api/opportunities/import/duplicate-check`, **Then** it stores fields to use for duplicate detection during import
5. **Given** import is executed, **When** the system receives POST to `/api/opportunities/import/execute`, **Then** it processes all rows, performs duplicate checks, creates/updates records based on import behavior, and returns results with counts (created, updated, errors, duplicates)

---

### User Story 5 - System Performs Bulk Operations on Opportunities (Priority: P2)

As an authenticated sales manager, I want the system to perform bulk operations (delete, export, merge, mass update) on multiple selected opportunities, so that I can efficiently manage multiple records at once.

**Why this priority**: Bulk operations significantly improve efficiency when managing many opportunities. While not critical for core functionality, this feature enables managers to perform administrative tasks efficiently, such as updating sales stages for multiple opportunities or exporting data for reporting.

**Independent Test**: Can be fully tested by selecting multiple opportunity IDs, sending bulk operation requests (delete, export, merge, mass-update), and verifying operations complete successfully with appropriate results. This delivers value by enabling efficient multi-record management.

**Acceptance Scenarios**:

1. **Given** an authenticated user provides an array of opportunity IDs for bulk delete, **When** the system receives DELETE request to `/api/opportunities/bulk`, **Then** it validates permissions for each record, deletes accessible records, and returns success confirmation with count of deleted records
2. **Given** an authenticated user requests bulk export with opportunity IDs and format, **When** the system receives POST to `/api/opportunities/export`, **Then** it generates export file in requested format and returns file download
3. **Given** an authenticated user provides source and target opportunity IDs for merge, **When** the system receives POST to `/api/opportunities/merge`, **Then** it combines source opportunities into target, transfers relationships, and deletes source records
4. **Given** an authenticated user provides opportunity IDs and update fields for mass update, **When** the system receives PATCH to `/api/opportunities/mass-update`, **Then** it updates common fields for all accessible opportunities and returns success confirmation with count

---

### User Story 6 - System Retrieves Opportunity Relationships (Priority: P2)

As an authenticated user, I want the system to retrieve related records (contacts, activities, documents, quotes) for an opportunity, so that I can view all associated information and relationships.

**Why this priority**: Opportunities don't exist in isolation - they're connected to contacts, activities, documents, and other entities. Retrieving these relationships provides context and helps users understand the full picture of each opportunity. This is important for effective opportunity management.

**Independent Test**: Can be fully tested by sending a GET request to `/api/opportunities/:id/relationships/:relationshipType` and verifying the response contains paginated list of related records with correct relationship metadata. This delivers value by providing comprehensive opportunity context.

**Acceptance Scenarios**:

1. **Given** an authenticated user requests contacts relationship for an opportunity, **When** the system receives GET to `/api/opportunities/:id/relationships/contacts`, **Then** it returns paginated list of related contacts with role information
2. **Given** an authenticated user requests activities relationship, **When** the system receives GET to `/api/opportunities/:id/relationships/activities`, **Then** it returns paginated list of related activities (calls, meetings, tasks, emails)
3. **Given** an authenticated user requests relationships with pagination parameters, **When** the system responds, **Then** it returns paginated results with metadata (total count, current page, total pages)
4. **Given** an authenticated user lacks permission to view the opportunity, **When** the system receives relationship request, **Then** it returns 403 Forbidden with appropriate error message

---

### User Story 7 - System Provides Lookup Endpoints for Related Entities (Priority: P2)

As a frontend application, I want the system to provide lookup endpoints for users, accounts, and campaigns, so that I can populate lookup modals with searchable, paginated, and sortable data.

**Why this priority**: Lookup endpoints enable the frontend to provide user-friendly record selection interfaces. While not directly used by end users, they're essential for creating and editing opportunities efficiently. This improves user experience significantly.

**Independent Test**: Can be fully tested by sending GET requests to lookup endpoints (`/api/users/lookup`, `/api/accounts/lookup`, `/api/campaigns/lookup`) with query parameters for pagination, sorting, and search, and verifying responses contain appropriate data. This delivers value by enabling efficient record selection.

**Acceptance Scenarios**:

1. **Given** an authenticated user requests user lookup with search query, **When** the system receives GET to `/api/users/lookup?search=john`, **Then** it returns paginated list of users matching the search query (name, username, email)
2. **Given** an authenticated user requests account lookup with sorting, **When** the system receives GET to `/api/accounts/lookup?sortBy=name&sortOrder=asc`, **Then** it returns accounts sorted by name in ascending order
3. **Given** lookup endpoints are called, **When** the system responds, **Then** it returns data with fields appropriate for lookup modals (users: name, username, jobTitle, department, email, phone)

---

### User Story 8 - System Provides Pipeline Analytics Data (Priority: P2)

As an authenticated sales manager, I want the system to aggregate pipeline data by sales stage, so that I can visualize the sales pipeline and analyze pipeline health.

**Why this priority**: Pipeline analytics provide valuable insights for sales management. While not critical for individual opportunity management, it helps managers understand pipeline composition, identify bottlenecks, and make data-driven decisions. This is important for strategic sales management.

**Independent Test**: Can be fully tested by sending a GET request to `/api/opportunities/analytics/pipeline-by-sales-stage` with optional filters and verifying the response contains aggregated amounts by sales stage. This delivers value by providing pipeline insights.

**Acceptance Scenarios**:

1. **Given** an authenticated user requests pipeline analytics, **When** the system receives GET to `/api/opportunities/analytics/pipeline-by-sales-stage`, **Then** it aggregates opportunity amounts by sales stage and returns data suitable for chart visualization
2. **Given** an authenticated user requests analytics with date range filter, **When** the system responds, **Then** it filters opportunities by the specified date range before aggregation
3. **Given** an Employee user requests pipeline analytics, **When** the system responds, **Then** it filters data to include only opportunities assigned to that user or within their permission scope
4. **Given** an Admin user requests pipeline analytics, **When** the system responds, **Then** it includes all opportunities across the organization

---

### User Story 9 - System Tracks Recently Viewed Opportunities (Priority: P3)

As a system, I want to track which opportunities a user has recently viewed, so that the frontend can provide quick access to recently accessed opportunities.

**Why this priority**: Recently viewed tracking is a convenience feature that improves user experience. While not critical for core functionality, it helps users quickly return to recently accessed records, reducing navigation time and improving productivity.

**Independent Test**: Can be fully tested by viewing an opportunity detail page (which triggers tracking), then requesting recently viewed list and verifying the opportunity appears in the list. This delivers value by enabling quick access to recently worked-on records.

**Acceptance Scenarios**:

1. **Given** an authenticated user views an opportunity detail page, **When** the system receives GET to `/api/opportunities/:id`, **Then** it records the view timestamp in RecentlyViewedOpportunity table
2. **Given** an authenticated user requests recently viewed opportunities, **When** the system receives GET to `/api/opportunities/recently-viewed`, **Then** it returns list of opportunities ordered by most recent view, up to the specified limit (default: 10)
3. **Given** a user has viewed multiple opportunities, **When** recently viewed list is requested, **Then** opportunities are listed in order of most recently viewed first

---

### User Story 10 - System Validates Opportunity Data and References (Priority: P1)

As a system, I want to validate all opportunity data and reference integrity before persisting records, so that data quality is maintained and referential integrity is preserved.

**Why this priority**: Data validation is essential for data quality and system integrity. Invalid data can cause system errors, reporting inaccuracies, and user confusion. This is critical for maintaining reliable CRM data.

**Independent Test**: Can be fully tested by sending create/update requests with invalid data (invalid sales stage, non-existent account ID, negative amount) and verifying appropriate validation error responses. This delivers value by preventing data quality issues.

**Acceptance Scenarios**:

1. **Given** an opportunity create request has invalid sales stage value, **When** the system validates the data, **Then** it returns 400 Bad Request with validation error indicating sales stage must be from predefined list
2. **Given** an opportunity create request references non-existent account ID, **When** the system validates references, **Then** it returns 400 Bad Request with error indicating account does not exist
3. **Given** an opportunity create request has negative amount, **When** the system validates the data, **Then** it returns 400 Bad Request with validation error indicating amount must be >= 0
4. **Given** an opportunity create request has probability value > 100, **When** the system validates the data, **Then** it returns 400 Bad Request with validation error indicating probability must be 0-100

---

### Edge Cases

- What happens when the database connection fails during opportunity creation?
  - System should return 500 Internal Server Error with generic error message and log full error details for debugging

- What happens when multiple users attempt to update the same opportunity simultaneously?
  - System uses optimistic locking with conflict detection: allows concurrent edits, detects conflicts on save operation via version/timestamp checking, returns conflict error response (409 Conflict) with conflict details, frontend shows conflict resolution dialog allowing user to choose which version to keep or merge changes

- What happens when an account is deleted while opportunities reference it?
  - System should either prevent account deletion if opportunities exist, or handle cascade deletion/update based on business rules and referential integrity constraints

- What happens when import file contains rows that exceed maximum field lengths?
  - System should validate field lengths during import processing, reject rows with field length violations, and include them in error results with specific error messages

- What happens when duplicate check during import finds matches but user wants to proceed?
  - System should continue with import, flag duplicates in results, and allow user to review duplicates separately without preventing successful imports

- What happens when bulk delete operation fails on some records due to permission issues?
  - System should process all accessible records, return partial success response (207 Multi-Status) with details of which records were deleted and which failed

- What happens when import file has encoding issues that prevent proper parsing?
  - System should detect encoding issues during file analysis, attempt encoding conversion, or return error with guidance on file format requirements

- What happens when opportunity merge operation encounters conflicting field values?
  - System should use merge strategy to resolve conflicts, keeping specified fields from source or target based on configuration, and log conflict resolutions

- What happens when pipeline analytics calculation encounters opportunities with null or invalid amounts?
  - System should exclude null/invalid amounts from aggregation, log data quality issues, and return accurate aggregation for valid records

- What happens when relationship retrieval encounters circular or invalid relationship references?
  - System should validate relationship references, prevent circular references, and return appropriate errors for invalid relationships

- What happens when bulk export operation is requested for a very large number of opportunities (1000+)?
  - System should process export asynchronously if needed, return job ID for status checking, or implement pagination/chunking to prevent timeout

- What happens when recently viewed tracking attempts to record a view for a deleted opportunity?
  - System should handle gracefully, either skip recording or record the view and handle deleted record in retrieval (filter deleted or show "deleted" indicator)

- What happens when import duplicate check uses fields that don't exist in the import file?
  - System should validate duplicate check field configuration before import execution, return validation error if configured fields are missing from file

- What happens when currency conversion fails during opportunity amount update?
  - System should handle currency conversion errors gracefully, either use fallback conversion rate, store amount in original currency, or return error with guidance

- What happens when sales stage update triggers recalculation of days at current stage but calculation fails?
  - System should handle calculation errors gracefully, log the error, and either use cached value or default to 0, ensuring opportunity update still succeeds

- What happens when relationship link operation attempts to link to a deleted related record?
  - System should validate related record exists and is not deleted before linking, return 400 Bad Request if related record is deleted

- What happens when lookup endpoint receives search query with SQL injection attempts?
  - System should sanitize and validate all input, use parameterized queries, and prevent SQL injection attacks

---

## Requirements *(mandatory)*

### Functional Requirements

#### Authentication & Authorization

- **FR-001**: System MUST authenticate all opportunity API requests using JWT token validation via Authorization header
- **FR-002**: System MUST verify token signature, expiration, and user existence before processing requests
- **FR-003**: System MUST return 401 Unauthorized if authentication fails
- **FR-004**: System MUST authorize opportunity API requests based on user role (Admin or Employee)
- **FR-005**: System MUST allow Admin users to access all opportunity endpoints and perform all operations on all opportunities
- **FR-006**: System MUST allow Employee users to access opportunity endpoints but view/modify only opportunities assigned to them or within their permission scope
- **FR-007**: System MUST verify user permissions before allowing create, update, delete operations

#### Opportunity CRUD Operations

- **FR-010**: System MUST provide POST endpoint at `/api/opportunities` to create new opportunity records
- **FR-011**: System MUST require and validate required fields on create: name, amount, salesStage, accountId, expectedCloseDate
- **FR-012**: System MUST accept and store optional fields on create: probability, nextStep, description, type, leadSource, campaignId, assignedToId, currency
- **FR-013**: System MUST auto-generate id, dateCreated, dateModified, createdBy, modifiedBy fields on opportunity creation
- **FR-014**: System MUST provide GET endpoint at `/api/opportunities` to retrieve list of opportunities with pagination, sorting, and filtering support
- **FR-015**: System MUST support pagination with default page size of 20 records and maximum of 100 records per page
- **FR-016**: System MUST support sorting by columns: name, accountName, salesStage, amount, expectedCloseDate, assignedTo, dateCreated with sort directions: ascending, descending, none
- **FR-017**: System MUST support filtering by fields: name, accountName, amount (with operators), salesStage, assignedTo, leadSource, expectedCloseDate (with operators), nextStep
- **FR-018**: System MUST support quick filters: My Items (assigned to current user), Open Items (exclude closed stages), My Favorites
- **FR-019**: System MUST combine multiple filter criteria with AND logic
- **FR-020**: System MUST provide GET endpoint at `/api/opportunities/:id` to retrieve a single opportunity by ID with all fields and relationships
- **FR-021**: System MUST provide PATCH endpoint at `/api/opportunities/:id` to update existing opportunity records
- **FR-022**: System MUST accept partial updates (all fields optional) on update requests
- **FR-023**: System MUST automatically update dateModified and modifiedBy fields on every update
- **FR-024**: System MUST provide DELETE endpoint at `/api/opportunities/:id` to delete opportunity records
- **FR-025**: System MUST check for related records before allowing deletion and handle based on business rules

#### Bulk Operations

- **FR-030**: System MUST provide DELETE endpoint at `/api/opportunities/bulk` for bulk delete operations with array of opportunity IDs
- **FR-031**: System MUST validate permissions for each record in bulk delete operation and return partial success if some records cannot be deleted
- **FR-032**: System MUST provide POST endpoint at `/api/opportunities/export` for bulk export with optional opportunity IDs, format (csv, excel, pdf), and column selection
- **FR-033**: System MUST provide POST endpoint at `/api/opportunities/merge` for bulk merge operations with source opportunity IDs, target opportunity ID, and merge strategy
- **FR-034**: System MUST transfer all relationships from source opportunities to target during merge operation
- **FR-035**: System MUST delete source opportunities after successful merge
- **FR-036**: System MUST provide PATCH endpoint at `/api/opportunities/mass-update` for mass update operations with array of opportunity IDs and update fields
- **FR-037**: System MUST validate permissions for each record in mass update operation and apply updates only to accessible records

#### Import Operations

- **FR-040**: System MUST provide POST endpoint at `/api/opportunities/import/upload` to upload import files with multipart form data
- **FR-041**: System MUST validate file format, filename format (alphanumeric plus ',', '`', '_'), and enforce file size limits on upload
- **FR-042**: System MUST provide POST endpoint at `/api/opportunities/import/analyze` to analyze uploaded file and detect properties (delimiter, encoding, header row, column structure, data preview)
- **FR-043**: System MUST provide POST endpoint at `/api/opportunities/import/properties` to confirm or modify detected import file properties (delimiter, encoding, hasHeaderRow, textQualifier, dateFormat, source)
- **FR-044**: System MUST provide POST endpoint at `/api/opportunities/import/map-fields` to map import file columns to opportunity module fields
- **FR-045**: System MUST validate that all required fields are mapped before allowing import execution
- **FR-046**: System MUST provide POST endpoint at `/api/opportunities/import/duplicate-check` to configure fields for duplicate checking
- **FR-047**: System MUST provide POST endpoint at `/api/opportunities/import/execute` to execute import with import behavior (create-only or create-and-update)
- **FR-048**: System MUST perform duplicate checking using configured fields during import execution
- **FR-049**: System MUST validate all rows, create new records or update existing based on import behavior, and return detailed results with counts (created, updated, errors, duplicates)
- **FR-050**: System MUST provide GET endpoint at `/api/opportunities/import/results/:importId` to retrieve import results including created records, errors, duplicates with details
- **FR-051**: System MUST provide POST endpoint at `/api/opportunities/import/undo/:importId` to undo import operation by deleting all records created during that import
- **FR-052**: System MUST provide GET endpoint at `/api/opportunities/import/template` to download import template file with column headers in requested format (csv, excel)

#### Lookup Endpoints

- **FR-060**: System MUST provide GET endpoint at `/api/users/lookup` or `/api/users` for user lookup with pagination, sorting, and search query parameters
- **FR-061**: System MUST return user lookup data with fields: id, name, username, jobTitle, department, email, phone
- **FR-062**: System MUST provide GET endpoint at `/api/accounts/lookup` or `/api/accounts` for account lookup with pagination, sorting, and search query parameters
- **FR-063**: System MUST provide GET endpoint at `/api/campaigns/lookup` or `/api/campaigns` for campaign lookup with pagination, sorting, and search query parameters

#### Relationship Management

- **FR-070**: System MUST provide GET endpoint at `/api/opportunities/:id/relationships/:relationshipType` to retrieve related records for relationship types: activities, contacts, documents, quotes, projects, contracts, leads, history, security-groups
- **FR-071**: System MUST support pagination parameters (page, limit) for relationship retrieval endpoints
- **FR-072**: System MUST provide POST endpoint at `/api/opportunities/:id/relationships/:relationshipType` to link a related record to an opportunity with relationship metadata (e.g., role for contacts)
- **FR-073**: System MUST provide DELETE endpoint at `/api/opportunities/:id/relationships/:relationshipType/:relatedRecordId` to unlink a related record from an opportunity

#### Analytics and Reporting

- **FR-080**: System MUST provide GET endpoint at `/api/opportunities/analytics/pipeline-by-sales-stage` to retrieve pipeline data aggregated by sales stage with optional filter parameters
- **FR-081**: System MUST aggregate opportunity amounts by sales stage and return data suitable for chart visualization
- **FR-082**: System MUST apply role-based data filtering to analytics endpoints (Admin sees all, Employee sees filtered)
- **FR-083**: System MUST provide GET endpoint at `/api/opportunities/:id/insights` to retrieve opportunity insights including days at current sales stage and other metrics
- **FR-084**: System MUST calculate days at current sales stage based on sales stage change history
- **FR-085**: System MUST provide GET endpoint at `/api/opportunities/recently-viewed` to retrieve recently viewed opportunities for current user with optional limit parameter (default: 10)

#### Column Customization and Filter Management

- **FR-090**: System MUST provide POST endpoint at `/api/opportunities/columns/preferences` to save user's column visibility preferences (displayedColumns, columnOrder)
- **FR-091**: System MUST store column preferences per user
- **FR-092**: System MUST provide GET endpoint at `/api/opportunities/columns/preferences` to retrieve user's saved column preferences
- **FR-093**: System MUST provide POST endpoint at `/api/opportunities/filters/save` to save filter configuration with filter name, filter criteria, and quick filters
- **FR-094**: System MUST provide GET endpoint at `/api/opportunities/filters/saved` to retrieve list of saved filter configurations for the user
- **FR-095**: System MUST provide POST endpoint at `/api/opportunities/filters/apply/:filterId` to apply a saved filter and return filtered opportunity list

#### Data Validation

- **FR-100**: System MUST validate opportunity name is required, string type, and within maximum length (255 characters)
- **FR-101**: System MUST validate opportunity amount is required, numeric type, and >= 0
- **FR-102**: System MUST validate sales stage is required and must be one of: Prospecting, Qualification, Needs Analysis, Value Proposition, Identifying Decision Makers, Perception Analysis, Proposal/Price Quote, Negotiation/Review, Closed Won, Closed Lost
- **FR-103**: System MUST validate account ID is required and references an existing, non-deleted account record
- **FR-104**: System MUST validate expected close date is required and in valid date format (yyyy-mm-dd)
- **FR-105**: System MUST validate probability is optional, numeric type, and within range 0-100 if provided
- **FR-106**: System MUST validate currency code is optional and valid if provided
- **FR-107**: System MUST validate type is optional and must be valid type value from predefined list if provided
- **FR-108**: System MUST validate lead source is optional and must be valid lead source value from predefined list if provided
- **FR-109**: System MUST validate assigned to ID is optional and references an existing user if provided
- **FR-110**: System MUST validate campaign ID is optional and references an existing campaign if provided

#### Business Logic

- **FR-120**: System MUST enforce required field validation before record creation or update and return validation errors if required fields are missing
- **FR-121**: System MUST validate dropdown field values against predefined lists (sales stage, type, lead source) and return validation error if invalid value provided
- **FR-122**: System MUST validate lookup field references (account ID, assigned to ID, campaign ID) and return validation error if referenced record does not exist
- **FR-123**: System MUST perform duplicate checking during import based on configured fields, comparing values against existing opportunity records
- **FR-124**: System MUST support import behavior modes: Create Only (creates new records, skips matching existing) and Create and Update (creates new, updates matching)
- **FR-125**: System MUST calculate and update days at current sales stage, updating automatically when sales stage changes
- **FR-126**: System MUST track recently viewed opportunities per user by recording timestamp when user views opportunity detail page
- **FR-127**: System MUST limit recently viewed list to most recent N views (configurable, default: 10)
- **FR-128**: System MUST handle opportunity deletion with relationship checks, warning or preventing deletion if critical relationships exist based on business rules
- **FR-129**: System MUST support opportunity merge operations, combining multiple opportunities into target with merge strategy specifying which fields to keep

#### Integration Requirements

- **FR-130**: System MUST integrate with Account module to validate account references and retrieve account information
- **FR-131**: System MUST integrate with Contact module to support linking/unlinking contacts with role information storage
- **FR-132**: System MUST integrate with Activity module to support linking activities and retrieving activity history
- **FR-133**: System MUST integrate with Document module to support linking documents
- **FR-134**: System MUST integrate with Quote module to support linking quotes
- **FR-135**: System MUST integrate with Campaign module to validate campaign references

#### Security Requirements

- **FR-140**: System MUST validate all input data to prevent injection attacks through sanitization and parameterized queries
- **FR-141**: System MUST implement authorization checks for all operations, verifying user has permission to view/modify specific opportunities
- **FR-142**: System MUST filter data based on user role and assignments to prevent unauthorized access
- **FR-143**: System MUST validate file uploads for import operations, including file type, format, filename validation, size limits, and malicious content scanning
- **FR-144**: System MUST track audit trail for opportunity changes, logging all create, update, delete operations with user ID and timestamp

#### Performance Requirements

- **FR-150**: System MUST respond to opportunity list API requests within 500ms for typical queries through query optimization and indexing
- **FR-151**: System MUST handle import operations efficiently with batch processing for large files and asynchronous processing if file size exceeds threshold
- **FR-152**: System MUST optimize duplicate checking performance using database indexes on fields used for duplicate checking and efficient matching algorithms

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All opportunity CRUD API endpoints respond within 500ms for typical requests (95th percentile)
- **SC-002**: System handles import files up to 10MB with processing time under 30 seconds for typical files
- **SC-003**: All functional requirements are implemented and tested - 100% requirement coverage in test suite
- **SC-004**: Duplicate checking completes within 2 seconds for imports with 1000 rows
- **SC-005**: Bulk operations (delete, update, export) complete successfully for up to 1000 records
- **SC-006**: All validation rules are enforced and return appropriate error messages with field-specific details
- **SC-007**: Data integrity is maintained across all operations (no orphaned records, referential integrity preserved)
- **SC-008**: Authentication and authorization checks prevent unauthorized access 100% of the time
- **SC-009**: Import operations handle files with up to 10,000 rows without performance degradation
- **SC-010**: Lookup endpoints respond within 200ms for typical queries with pagination
- **SC-011**: Pipeline analytics aggregation completes within 1 second for typical datasets
- **SC-012**: Relationship retrieval endpoints respond within 300ms for typical relationship queries
- **SC-013**: Recently viewed tracking records views within 100ms and retrieval completes within 200ms
- **SC-014**: All error responses follow consistent error response format with appropriate HTTP status codes
- **SC-015**: Role-based data filtering works correctly - Admin sees all data, Employee sees filtered data 100% of the time

---

## Database Schema

### Opportunities Table (`opportunities`)

**Primary Key**: `id` (char(36), GUID)

**Key Fields**:
- `id` (char(36)) - GUID primary key, auto-generated
- `name` (varchar(255)) - Required, searchable, max 255 characters
- `account_id` (char(36)) - FK to accounts.id, required
- `amount` (decimal(15,2)) - Currency amount, required, >= 0
- `amount_usdollar` (decimal(15,2)) - USD converted amount, optional
- `currency_id` (char(36)) - FK to currencies.id, optional
- `sales_stage` (varchar(255)) - Required, enum, audited
  - Values: Prospecting, Qualification, Needs Analysis, Value Proposition, Identifying Decision Makers, Perception Analysis, Proposal/Price Quote, Negotiation/Review, Closed Won, Closed Lost
- `probability` (decimal(5,2)) - Range 0-100, optional, audited
- `date_closed` (date) - Expected close date, required, audited, format: YYYY-MM-DD
- `opportunity_type` (varchar(255)) - Opportunity type classification, optional, audited
- `lead_source` (varchar(255)) - Source of the lead, optional, enum
- `next_step` (varchar(500)) - Next action in sales process, optional, max 500 characters
- `description` (text) - Detailed description, optional, unlimited length
- `campaign_id` (char(36)) - FK to campaigns.id, optional
- `assigned_user_id` (char(36)) - FK to users.id, optional
- `date_entered` (datetime) - Creation timestamp, auto-generated, not user-editable
- `date_modified` (datetime) - Last modification timestamp, auto-updated on every change
- `modified_user_id` (char(36)) - FK to users.id, auto-updated
- `created_by` (char(36)) - FK to users.id, auto-populated
- `deleted` (tinyint(1)) - Soft delete flag, default 0 (0=active, 1=deleted)

**Constraints**:
- `name` - Required, NOT NULL
- `amount` - Required, NOT NULL, CHECK (amount >= 0)
- `sales_stage` - Required, NOT NULL
- `date_closed` - Required, NOT NULL
- `account_id` - Required, NOT NULL, FOREIGN KEY to accounts(id)
- `probability` - CHECK (probability >= 0 AND probability <= 100) if provided
- `assigned_user_id` - FOREIGN KEY to users(id) if provided
- `campaign_id` - FOREIGN KEY to campaigns(id) if provided
- `currency_id` - FOREIGN KEY to currencies(id) if provided
- `created_by` - FOREIGN KEY to users(id), NOT NULL
- `modified_user_id` - FOREIGN KEY to users(id), NOT NULL

**Indexes**:
- Primary key on `id`
- `idx_opp_name` on (name) for name-based searches
- `idx_opp_assigned` on (assigned_user_id) for user assignment queries
- `idx_opp_id_deleted` on (id, deleted) for soft delete filtering
- `idx_opp_account_id` on (account_id) WHERE deleted = 0 for account relationship queries
- `idx_opp_sales_stage` on (sales_stage) WHERE deleted = 0 for filtering and analytics
- `idx_opp_date_closed` on (date_closed) WHERE deleted = 0 for date-based queries
- `idx_opp_date_entered` on (date_entered) WHERE deleted = 0 for sorting and filtering
- Composite index on (assigned_user_id, sales_stage) WHERE deleted = 0 for user-specific pipeline queries
- Composite index on (account_id, sales_stage) WHERE deleted = 0 for account-based pipeline queries

**Relationships**:
- Many-to-one with Accounts (via account_id)
- Many-to-one with Users (via assigned_user_id for assignment, created_by, modified_user_id)
- Many-to-one with Campaigns (via campaign_id)
- Many-to-one with Currencies (via currency_id)
- Many-to-many with Contacts (via opportunities_contacts join table)
- One-to-many with Activities (via parent_id, parent_type='Opportunities' for tasks, meetings, calls, notes, emails)
- One-to-many with Documents (via parent_id, parent_type='Opportunities')
- One-to-many with Quotes (via opportunity_id)
- One-to-many with Projects (via parent_id, parent_type='Opportunities')
- One-to-many with Contracts (via opportunity_id)

### Opportunities Contacts Table (`opportunities_contacts`)

**Description**: Join table for many-to-many relationship between opportunities and contacts with role information.

**Primary Key**: `id` (char(36), GUID)

**Key Fields**:
- `id` (char(36)) - GUID primary key, auto-generated
- `opportunity_id` (char(36)) - FK to opportunities.id, required
- `contact_id` (char(36)) - FK to contacts.id, required
- `contact_role` (varchar(255)) - Contact's role in relation to opportunity, optional
  - Examples: Technical Decision Maker, Business Evaluator, Primary Decision Maker, Economic Buyer, Champion, Influencer, Gatekeeper, End User
- `date_modified` (datetime) - Last modification timestamp
- `deleted` (tinyint(1)) - Soft delete flag, default 0

**Constraints**:
- UNIQUE constraint on (opportunity_id, contact_id) to prevent duplicate relationships
- `opportunity_id` - FOREIGN KEY to opportunities(id) ON DELETE CASCADE
- `contact_id` - FOREIGN KEY to contacts(id) ON DELETE CASCADE
- `opportunity_id` - Required, NOT NULL
- `contact_id` - Required, NOT NULL

**Indexes**:
- Primary key on `id`
- Index on (opportunity_id) WHERE deleted = 0 for opportunity-to-contacts queries
- Index on (contact_id) WHERE deleted = 0 for contact-to-opportunities queries
- Composite index on (opportunity_id, contact_id, deleted) for relationship lookups

### Recently Viewed Opportunities Table (`recently_viewed_opportunities`)

**Description**: Tracks which opportunities a user has recently viewed for quick access.

**Primary Key**: `id` (char(36), GUID)

**Key Fields**:
- `id` (char(36)) - GUID primary key, auto-generated
- `user_id` (char(36)) - FK to users.id, required
- `opportunity_id` (char(36)) - FK to opportunities.id, required
- `viewed_at` (datetime) - Timestamp when opportunity was viewed, auto-populated
- `view_count` (int) - Number of times viewed, optional, default 1

**Constraints**:
- `user_id` - FOREIGN KEY to users(id) ON DELETE CASCADE, required, NOT NULL
- `opportunity_id` - FOREIGN KEY to opportunities(id) ON DELETE CASCADE, required, NOT NULL
- `viewed_at` - Required, NOT NULL, auto-populated with CURRENT_TIMESTAMP
- UNIQUE constraint on (user_id, opportunity_id) to track one record per user-opportunity pair

**Indexes**:
- Primary key on `id`
- Composite index on (user_id, viewed_at DESC) WHERE opportunity_id IS NOT NULL for efficient retrieval of recent views ordered by most recent
- Index on (opportunity_id) WHERE deleted = 0 for opportunity-based queries

**Note**: When a user views an opportunity again, the `viewed_at` timestamp should be updated and `view_count` incremented, or the record should be deleted and recreated with new timestamp.

### Import Jobs Table (`import_jobs`)

**Description**: Tracks import operations and their status for opportunity imports.

**Primary Key**: `id` (char(36), GUID)

**Key Fields**:
- `id` (char(36)) - GUID primary key, auto-generated
- `user_id` (char(36)) - FK to users.id, required
- `file_name` (varchar(255)) - Name of imported file, required
- `file_size` (bigint) - Size of file in bytes, required
- `file_format` (varchar(50)) - File format (csv, excel, xlsx), required
- `status` (varchar(50)) - Import status, required, default 'pending'
  - Values: pending, processing, completed, failed, cancelled
- `import_behavior` (varchar(50)) - Import mode, required
  - Values: create-only, create-and-update
- `total_rows` (int) - Total number of rows in file, required
- `processed_rows` (int) - Number of rows processed, default 0
- `created_count` (int) - Number of records created, default 0
- `updated_count` (int) - Number of records updated, default 0
- `error_count` (int) - Number of rows with errors, default 0
- `duplicate_count` (int) - Number of duplicate rows found, default 0
- `settings` (text/json) - Saved import settings (file properties, field mappings, duplicate check config), optional, JSON format
- `started_at` (datetime) - Import start timestamp, optional
- `completed_at` (datetime) - Import completion timestamp, optional
- `error_message` (text) - Error details if import failed, optional
- `date_entered` (datetime) - Creation timestamp, auto-generated
- `date_modified` (datetime) - Last modification timestamp, auto-updated
- `deleted` (tinyint(1)) - Soft delete flag, default 0

**Constraints**:
- `user_id` - FOREIGN KEY to users(id), required, NOT NULL
- `file_name` - Required, NOT NULL
- `file_size` - Required, NOT NULL, CHECK (file_size >= 0)
- `file_format` - Required, NOT NULL
- `status` - Required, NOT NULL, default 'pending'
- `import_behavior` - Required, NOT NULL
- `total_rows` - Required, NOT NULL, CHECK (total_rows >= 0)

**Indexes**:
- Primary key on `id`
- Index on (user_id) WHERE deleted = 0 for user-specific import queries
- Index on (status) WHERE deleted = 0 for status-based queries
- Index on (date_entered) WHERE deleted = 0 for sorting by creation time

### Opportunities Audit Table (`opportunities_audit`)

**Description**: Audit trail table for tracking field-level changes to opportunities. Only created if audit tracking is enabled for the opportunities module.

**Primary Key**: `id` (char(36), GUID)

**Key Fields**:
- `id` (char(36)) - GUID primary key, auto-generated
- `parent_id` (char(36)) - FK to opportunities.id, required
- `field_name` (varchar(100)) - Name of the field that changed, required
- `data_type` (varchar(100)) - Data type of the field (varchar, int, decimal, date, datetime, enum), required
- `before_value_string` (varchar(255)) - Value before change (for string/numeric fields), optional
- `after_value_string` (varchar(255)) - Value after change (for string/numeric fields), optional
- `before_value_text` (text) - Value before change (for text fields), optional
- `after_value_text` (text) - Value after change (for text fields), optional
- `created_by` (char(36)) - FK to users.id, required
- `date_created` (datetime) - Timestamp when audit entry was created, auto-generated

**Constraints**:
- `parent_id` - FOREIGN KEY to opportunities(id), required, NOT NULL
- `field_name` - Required, NOT NULL
- `data_type` - Required, NOT NULL
- `created_by` - FOREIGN KEY to users(id), required, NOT NULL
- `date_created` - Required, NOT NULL, auto-populated

**Indexes**:
- Primary key on `id`
- Index on (parent_id, date_created DESC) for opportunity audit history queries
- Index on (field_name) for field-specific audit queries
- Index on (created_by, date_created DESC) for user activity audit queries

**Audited Fields**: Based on backend requirements, the following fields are audited:
- `sales_stage` (enum)
- `probability` (decimal)
- `date_closed` (date)
- `opportunity_type` (varchar, enum)

### Common Fields Pattern

All opportunity-related tables follow these common patterns where applicable:
- `id` (char(36)) - GUID primary key, auto-generated
- `date_entered` (datetime) - Creation timestamp, auto-generated
- `date_modified` (datetime) - Last modification timestamp, auto-updated
- `created_by` (char(36)) - FK to users.id, auto-populated
- `modified_user_id` (char(36)) - FK to users.id, auto-updated
- `deleted` (tinyint(1)) - Soft delete flag (0=active, 1=deleted), default 0

### Database Implementation Notes

- **GUID Format**: All primary keys and foreign keys use char(36) to store GUIDs in standard format (e.g., "550e8400-e29b-41d4-a716-446655440000")
- **Soft Delete**: All tables use `deleted` flag (tinyint(1)) for soft deletion. Queries should filter WHERE deleted = 0 by default.
- **Timestamps**: All datetime fields should store timestamps in UTC format.
- **Currency Precision**: Amount fields use decimal(15,2) for proper financial precision (supports up to 999,999,999,999,999.99)
- **Audit Trail**: Audit table is only created if audit tracking is enabled for the module. Changes to audited fields are automatically logged.
- **Indexes with WHERE clauses**: Partial indexes using WHERE deleted = 0 improve query performance by excluding soft-deleted records from index scans.
- **Foreign Key Cascades**: Relationship tables use ON DELETE CASCADE to automatically clean up related records when parent records are deleted.

---

## Clarifications

### Session 2025-12-13

- Q: What database schema should be used for the opportunity module? → A: SuiteCRM-style schema using char(36) GUIDs, tinyint(1) for booleans, and standard field naming conventions (snake_case) as documented in product-info/backend-requirement.md. Schema includes opportunities table, opportunities_contacts join table, recently_viewed_opportunities table, import_jobs table, and opportunities_audit table with all required indexes and constraints.

- Q: When multiple users edit the same opportunity simultaneously, which strategy should the system use? → A: Optimistic locking with conflict detection - Allow edits, detect conflicts on save via version/timestamp checking, return 409 Conflict error response with conflict details, frontend shows conflict resolution dialog allowing user to choose which version to keep or merge changes

---

## Notes

- Reference `product-info/product-overview.md` for system roles and common functionalities
- Reference `product-info/backend-requirement.md` for SuiteCRM database schema conventions and field definitions
- Reference `requirements/opportunity/backend-requirements.md` for detailed requirements
- All timestamps should be stored in UTC format
- Currency amounts should be stored with appropriate precision for financial calculations (decimal(15,2))
- Soft delete pattern is implemented using `deleted` tinyint(1) flag (0=active, 1=deleted)
- All GUIDs use char(36) format for compatibility with legacy SuiteCRM systems
- Audit trail table (opportunities_audit) is optional and only created if audit tracking is enabled
- All API responses should follow JSON-API format standards
- Error responses should be user-friendly while maintaining security (not revealing sensitive system details)

