# Backend Specifications - Leads Module

**Feature Branch**: `003-leads-backend`  
**Created**: 2025-01-XX  
**Status**: Draft  
**Input**: User description: "Backend requirements for Leads module"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - System Provides Paginated List of Leads (Priority: P1)

As a Sales User, I want the system to provide a paginated list of leads with filtering and sorting capabilities, so that I can efficiently browse and find specific leads in the system.

**Why this priority**: The list view is the primary entry point for accessing leads. Users need to view, filter, and sort leads to find the information they need. This is foundational functionality that all other features depend on.

**Independent Test**: Can be fully tested by sending a GET request to `/api/v8/module/Leads` with pagination, filter, and sort parameters and verifying the response contains correct lead data with proper pagination metadata. This delivers immediate value by enabling users to access and navigate lead records.

**Acceptance Scenarios**:

1. **Given** an authenticated user requests leads list, **When** the system receives the request, **Then** it returns paginated lead records with default page size of 20
2. **Given** a user requests leads list with pagination parameters, **When** offset and limit are provided, **Then** the system returns leads for the specified page range
3. **Given** a user requests leads list with filter criteria, **When** filters are applied, **Then** the system returns only leads matching the filter criteria
4. **Given** a user requests leads list with sort parameter, **When** sort field and direction are provided, **Then** the system returns leads sorted by the specified field
5. **Given** a Sales User requests leads list, **When** the system responds, **Then** it returns only leads assigned to the current user or created by the user
6. **Given** a Sales Manager/Admin requests leads list, **When** the system responds, **Then** it returns all leads regardless of assignment

---

### User Story 2 - System Creates New Lead Record (Priority: P1)

As a Sales User, I want the system to create new lead records with validation, so that I can capture and store lead information from marketing events and other sources.

**Why this priority**: Creating leads is a core function of the module. Without the ability to create leads, the system cannot capture new potential customers. This is essential for the lead generation workflow.

**Independent Test**: Can be fully tested by sending a POST request to `/api/v8/module/Leads` with valid lead data and verifying the response contains the created lead with generated ID and timestamps. This delivers value by enabling lead capture and storage.

**Acceptance Scenarios**:

1. **Given** an authenticated user provides valid lead data with required fields, **When** the system receives the create request, **Then** it creates a new lead record and returns it with generated ID
2. **Given** a user creates a lead without providing assignedUserId, **When** the system processes the request, **Then** it assigns the lead to the current user by default
3. **Given** a user creates a lead with email addresses, **When** the system processes the request, **Then** it creates email address relationships via the join table
4. **Given** a user creates a lead with missing required field (lastName), **When** the system receives the request, **Then** it returns 400 Bad Request with validation error
5. **Given** a user creates a lead with invalid email format, **When** the system receives the request, **Then** it returns 400 Bad Request with email validation error
6. **Given** a user creates a lead, **When** the system processes the request, **Then** it sets dateEntered, dateModified, and createdBy fields automatically

---

### User Story 3 - System Updates Lead Record (Priority: P1)

As a Sales User, I want the system to update existing lead records with validation and ownership checks, so that I can modify lead information as the relationship progresses.

**Why this priority**: Updating leads is essential for maintaining accurate lead information. Users need to update status, add notes, change contact information, and track progress. This is critical for lead management workflow.

**Independent Test**: Can be fully tested by sending a PATCH request to `/api/v8/module/Leads` with lead ID and updated attributes and verifying the response contains the updated lead with modified timestamp. This delivers value by enabling lead information updates.

**Acceptance Scenarios**:

1. **Given** an authenticated user owns a lead record, **When** the user updates the lead, **Then** the system updates the record and returns the updated lead
2. **Given** a Sales Manager/Admin updates any lead, **When** the system processes the request, **Then** it allows the update regardless of ownership
3. **Given** a Sales User attempts to update a lead not assigned to them, **When** the system processes the request, **Then** it returns 403 Forbidden
4. **Given** a user updates a lead with invalid status value, **When** the system receives the request, **Then** it returns 400 Bad Request with validation error
5. **Given** a user updates a lead, **When** the system processes the request, **Then** it updates dateModified and modifiedUserId fields automatically
6. **Given** a user updates a lead that was modified by another user, **When** optimistic locking is enabled, **Then** the system returns 409 Conflict if dateModified doesn't match

---

### User Story 4 - System Filters Leads by Multiple Criteria (Priority: P1)

As a Sales User, I want the system to filter leads by multiple criteria (status, assigned user, date range, etc.), so that I can quickly find specific leads based on various attributes.

**Why this priority**: Filtering is essential for managing large numbers of leads. Users need to find leads by status, assignment, source, and other criteria to focus on relevant records. This significantly improves productivity.

**Independent Test**: Can be fully tested by sending a GET request to `/api/v8/module/Leads` with various filter parameters and verifying the response contains only leads matching all filter criteria. This delivers value by enabling efficient lead discovery.

**Acceptance Scenarios**:

1. **Given** a user requests leads filtered by status, **When** status filter is provided, **Then** the system returns only leads with the specified status
2. **Given** a user requests leads with myItems filter, **When** myItems is true, **Then** the system returns only leads assigned to the current user
3. **Given** a user requests leads with openItems filter, **When** openItems is true, **Then** the system returns only non-converted and non-dead leads
4. **Given** a user requests leads filtered by multiple criteria, **When** multiple filters are provided, **Then** the system applies all filters using AND logic
5. **Given** a user requests leads filtered by partial text match, **When** text filters (firstName, lastName, accountName) are provided, **Then** the system performs case-insensitive partial matching

---

### User Story 5 - System Imports Leads from CSV/Excel File (Priority: P1)

As a Sales User, I want the system to import multiple leads from a CSV or Excel file with duplicate checking and error reporting, so that I can bulk load leads from marketing events or external sources.

**Why this priority**: Import functionality is essential for bulk data entry. Users often receive leads in bulk from marketing campaigns, trade shows, or external systems. Manual entry would be impractical for large volumes.

**Independent Test**: Can be fully tested by sending a POST request to `/api/v8/module/Leads/import` with a CSV/Excel file and import configuration, and verifying the response contains import summary with success/error counts and error log URL. This delivers value by enabling efficient bulk lead entry.

**Acceptance Scenarios**:

1. **Given** a user uploads a valid CSV file with lead data, **When** the system processes the import, **Then** it creates new lead records and returns import summary with success count
2. **Given** a user imports leads with duplicate checking enabled, **When** duplicate criteria match existing leads, **Then** the system skips duplicates (create_only mode) or updates existing records (create_and_update mode)
3. **Given** a user imports leads with invalid data in some rows, **When** the system processes the import, **Then** it creates valid records and returns error details for invalid rows
4. **Given** a user imports leads, **When** the import completes, **Then** the system provides an error log URL for downloading detailed error information
5. **Given** a user uploads an invalid file format, **When** the system receives the request, **Then** it returns 400 Bad Request with format error message

---

### User Story 6 - System Converts Lead to Contact/Account/Opportunity (Priority: P1)

As a Sales User, I want the system to convert a qualified lead to a Contact and optionally create Account and Opportunity records, so that I can move leads through the sales pipeline when they become qualified.

**Why this priority**: Lead conversion is a critical business process. When a lead becomes qualified, it needs to be converted to a Contact (and potentially Account/Opportunity) to continue the sales process. This is essential for CRM workflow.

**Independent Test**: Can be fully tested by sending a POST request to `/api/v8/module/Leads/{id}/convert` with conversion options and verifying the response contains created Contact/Account/Opportunity IDs and updated lead status. This delivers value by enabling lead-to-opportunity conversion.

**Acceptance Scenarios**:

1. **Given** a user converts a lead with createContact enabled, **When** the system processes the conversion, **Then** it creates a Contact record from lead data and updates lead status to "Converted"
2. **Given** a user converts a lead with createAccount enabled, **When** the system processes the conversion, **Then** it creates an Account record and links the Contact to the Account
3. **Given** a user converts a lead with createOpportunity enabled, **When** the system processes the conversion, **Then** it creates an Opportunity record linked to the Account
4. **Given** a user converts a lead, **When** the system processes the conversion, **Then** it transfers email addresses and activities from lead to Contact
5. **Given** a user converts a lead that is already converted, **When** the system receives the request, **Then** it returns 400 Bad Request with appropriate error message

---

### User Story 7 - System Provides Lead Analytics and Insights (Priority: P2)

As a Sales Manager, I want the system to provide analytics and insights about lead status distribution and quick stats, so that I can monitor lead pipeline health and make data-driven decisions.

**Why this priority**: Analytics provide visibility into lead pipeline performance. While not critical for individual lead management, insights help managers understand lead distribution, conversion rates, and pipeline health. This supports strategic decision-making.

**Independent Test**: Can be fully tested by sending a GET request to `/api/v8/module/Leads/insights` and verifying the response contains status distribution with counts and percentages, plus quick stats (total, new, converted, dead). This delivers value by providing lead pipeline visibility.

**Acceptance Scenarios**:

1. **Given** a user requests lead insights, **When** the system receives the request, **Then** it returns status distribution with counts and percentages for each status
2. **Given** a user requests lead insights with filter criteria, **When** filters are provided, **Then** the system calculates insights based on filtered leads only
3. **Given** lead insights are calculated, **When** the system responds, **Then** percentages sum to 100% for all status categories
4. **Given** lead insights are calculated, **When** the system responds, **Then** it includes quick stats (total, new, converted, dead counts)

---

### User Story 8 - System Manages Lead Relationships (Priority: P1)

As a Sales User, I want the system to manage relationships between leads and activities (Calls, Meetings, Tasks, Emails, Notes), so that I can track all interactions and communications with leads.

**Why this priority**: Relationship management is essential for tracking lead interactions. Users need to associate activities with leads to maintain a complete history of communications and follow-ups. This is critical for lead nurturing.

**Independent Test**: Can be fully tested by sending GET/POST/DELETE requests to relationship endpoints and verifying the system correctly retrieves, creates, and deletes relationships between leads and related records. This delivers value by enabling comprehensive lead activity tracking.

**Acceptance Scenarios**:

1. **Given** a user requests lead relationships, **When** linkFieldName is provided (e.g., "activities", "emails"), **Then** the system returns related records with pagination support
2. **Given** a user creates a relationship between lead and activity, **When** the system processes the request, **Then** it creates the relationship link (via join table or foreign key)
3. **Given** a user deletes a relationship, **When** the system processes the request, **Then** it soft deletes the relationship link
4. **Given** a user requests relationships for a non-existent lead, **When** the system receives the request, **Then** it returns 404 Not Found

---

### User Story 9 - System Enforces Role-Based Access Control (Priority: P1)

As a system, I want to enforce role-based access control for lead operations, so that users only access leads they have permission to view or modify, and data security is maintained.

**Why this priority**: Access control is critical for data security and privacy. Sales Users should only access their assigned leads, while Sales Managers/Admins need broader access. Incorrect access control could lead to data breaches.

**Independent Test**: Can be fully tested by sending requests to lead endpoints with different user roles and verifying that access is correctly restricted based on role and ownership. This delivers value by maintaining data security and privacy.

**Acceptance Scenarios**:

1. **Given** a Sales User requests leads list, **When** the system processes the request, **Then** it returns only leads assigned to the current user or created by the user
2. **Given** a Sales Manager/Admin requests leads list, **When** the system processes the request, **Then** it returns all leads regardless of assignment
3. **Given** a Sales User attempts to delete a lead, **When** the system processes the request, **Then** it returns 403 Forbidden (only Sales Manager/Admin can delete)
4. **Given** a user attempts to access leads without authentication, **When** the system receives the request, **Then** it returns 401 Unauthorized

---

### User Story 10 - System Handles Bulk Operations Efficiently (Priority: P2)

As a Sales Manager, I want the system to perform bulk operations (delete, export) on multiple leads efficiently, so that I can manage large numbers of leads without performance issues.

**Why this priority**: Bulk operations are important for administrative tasks. While not critical for daily operations, they enable efficient management of large lead volumes. This improves productivity for managers.

**Independent Test**: Can be fully tested by sending bulk delete/export requests with multiple lead IDs and verifying the system processes them efficiently and returns appropriate success/error counts. This delivers value by enabling efficient bulk lead management.

**Acceptance Scenarios**:

1. **Given** a Sales Manager requests bulk delete for multiple leads, **When** the system processes the request, **Then** it soft deletes all specified leads and returns success/failure counts
2. **Given** a Sales Manager requests bulk export, **When** the system processes the request, **Then** it generates CSV/Excel file with selected leads and returns file download
3. **Given** a bulk operation partially fails, **When** some records cannot be processed, **Then** the system continues processing remaining records and returns error details for failed ones
4. **Given** a bulk operation is requested, **When** the operation completes, **Then** it processes up to 1000 records within performance targets (5 seconds for delete, 10 seconds for export)

---

### Edge Cases

- What happens when the database connection fails during lead creation?
  - System should return 500 Internal Server Error with generic error message and log full error details for debugging

- What happens when a user attempts to create a lead with a duplicate email that already exists?
  - System should allow duplicate emails (multiple leads can have the same email) unless duplicate checking is explicitly configured during import

- What happens when a lead conversion fails partway through (e.g., Contact created but Account creation fails)?
  - System should use database transactions to ensure atomicity - either all records are created or none are created, with rollback on failure

- What happens when an import file contains more than 10,000 rows?
  - System should validate file size and either process in batches or return 400 Bad Request if file exceeds maximum size limit

- What happens when multiple users attempt to update the same lead simultaneously?
  - System should use optimistic locking (compare dateModified) and return 409 Conflict if record was modified by another user

- What happens when a user requests leads list with invalid pagination parameters (negative offset, limit > 100)?
  - System should validate pagination parameters and return 400 Bad Request with validation errors for invalid values

- What happens when a filter criteria references a non-existent value (e.g., invalid status)?
  - System should return empty results (no matching leads) rather than an error, as the filter is valid but matches no records

- What happens when a lead is deleted but has active relationships (activities, emails)?
  - System should soft delete the lead and optionally cascade soft delete to related records based on relationship configuration

- What happens when a user attempts to convert a lead that is already converted?
  - System should return 400 Bad Request with error message indicating the lead is already converted

- What happens when import duplicate checking finds matches but importMode is "create_only"?
  - System should skip duplicate records, increment duplicateCount, and continue processing remaining rows

- What happens when a user requests insights for a very large dataset (millions of leads)?
  - System should optimize the query using aggregation functions and indexes, potentially implementing caching for frequently requested insights

- What happens when a relationship endpoint is called with an invalid linkFieldName?
  - System should return 400 Bad Request with error message indicating invalid relationship type

- What happens when bulk delete is requested for a mix of existing and non-existent lead IDs?
  - System should process existing leads, skip non-existent ones, and return counts indicating how many were deleted vs not found

- What happens when export is requested for more than 10,000 leads?
  - System should either process in batches, implement streaming export, or return 400 Bad Request if export size exceeds limits

- What happens when a user saves a filter with invalid filter structure?
  - System should validate filter structure and return 400 Bad Request with validation errors for invalid filter criteria

- What happens when column configuration includes non-existent field names?
  - System should validate field names against field definitions and return 400 Bad Request with list of invalid fields

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate all Leads API requests using OAuth 2.0 Bearer token validation
- **FR-002**: System MUST verify token signature, expiration, and user existence for all Leads requests
- **FR-003**: System MUST return 401 Unauthorized if authentication fails on Leads endpoints
- **FR-004**: System MUST enforce role-based access control (RBAC) for Leads operations
- **FR-005**: System MUST return 403 Forbidden if user lacks required permissions for Leads endpoints
- **FR-006**: System MUST filter leads based on user role (Sales User sees assigned/own leads, Sales Manager/Admin sees all)
- **FR-007**: System MUST check record-level ownership for edit/delete operations (compare assignedUserId with current user)
- **FR-008**: System MUST allow Sales Manager/Admin to bypass ownership checks
- **FR-009**: System MUST provide endpoint to retrieve paginated list of leads at `GET /api/v8/module/Leads`
- **FR-010**: System MUST support pagination with offset and limit parameters (default: offset=0, limit=20, max limit=100)
- **FR-011**: System MUST support filtering by firstName, lastName, accountName, anyEmail, anyAddress, country, anyPhone, city, state, status, leadSource, assignedUserId
- **FR-012**: System MUST support filtering by myItems (assigned to current user), openItems (non-converted/non-dead), myFavorites
- **FR-013**: System MUST support sorting by any field with direction (ascending/descending)
- **FR-014**: System MUST return JSON-API format response with data array, meta (total, offset, limit), and pagination links
- **FR-015**: System MUST provide endpoint to retrieve single lead by ID at `GET /api/v8/module/Leads/{id}`
- **FR-016**: System MUST support field selection via `fields` query parameter (comma-separated list)
- **FR-017**: System MUST support relationship inclusion via `include` query parameter (comma-separated list)
- **FR-018**: System MUST return 404 Not Found if lead does not exist or access denied
- **FR-019**: System MUST provide endpoint to create new lead at `POST /api/v8/module/Leads`
- **FR-020**: System MUST validate that lastName field is required
- **FR-021**: System MUST validate email format if email addresses are provided
- **FR-022**: System MUST validate status is one of: New, Assigned, In Process, Converted, Recycled, Dead
- **FR-023**: System MUST validate assignedUserId references valid user
- **FR-024**: System MUST validate currencyId references valid currency if opportunityAmount is provided
- **FR-025**: System MUST validate campaignId references valid campaign if provided
- **FR-026**: System MUST auto-generate GUID for id if not provided
- **FR-027**: System MUST set dateEntered and dateModified to current timestamp on create
- **FR-028**: System MUST set createdBy from current authenticated user on create
- **FR-029**: System MUST set assignedUserId to current user if not provided on create
- **FR-030**: System MUST create email address relationships via email_addr_bean_rel join table
- **FR-031**: System MUST provide endpoint to update existing lead at `PATCH /api/v8/module/Leads`
- **FR-032**: System MUST validate record exists and is not deleted before update
- **FR-033**: System MUST validate user has edit access (owner or admin) before update
- **FR-034**: System MUST implement optimistic locking check (compare dateModified) if enabled
- **FR-035**: System MUST update dateModified to current timestamp on update
- **FR-036**: System MUST set modifiedUserId from current authenticated user on update
- **FR-037**: System MUST track changes for audit trail if module is audited
- **FR-038**: System MUST provide endpoint to delete lead (soft delete) at `DELETE /api/v8/module/Leads/{id}`
- **FR-039**: System MUST set deleted = 1 (soft delete, not physical deletion)
- **FR-040**: System MUST soft delete related email address relationships
- **FR-041**: System MUST soft delete related activities if cascade delete is configured
- **FR-042**: System MUST restrict delete operation to Sales Manager/Admin only
- **FR-043**: System MUST provide endpoint to bulk delete multiple leads at `DELETE /api/v8/module/Leads/bulk`
- **FR-044**: System MUST process each ID in the array and apply soft delete logic
- **FR-045**: System MUST return count of successfully deleted and failed records
- **FR-046**: System MUST continue processing even if some records fail (collect errors)
- **FR-047**: System MUST provide endpoint to export leads to CSV/Excel at `POST /api/v8/module/Leads/export`
- **FR-048**: System MUST support export formats: CSV and Excel (xlsx)
- **FR-049**: System MUST apply filters if provided in export request
- **FR-050**: System MUST export only fields user has access to (ACL check)
- **FR-051**: System MUST include header row with field labels in export file
- **FR-052**: System MUST handle special characters and encoding in export file
- **FR-053**: System MUST restrict export operation to Sales Manager/Admin only
- **FR-054**: System MUST provide endpoint to import leads from CSV/Excel at `POST /api/v8/module/Leads/import`
- **FR-055**: System MUST validate file format (CSV/Excel) before processing
- **FR-056**: System MUST parse file and map columns to system fields
- **FR-057**: System MUST validate each row against business rules
- **FR-058**: System MUST check for duplicates based on duplicateCheck criteria
- **FR-059**: System MUST support import modes: "create_only" (skip duplicates) and "create_and_update" (update existing)
- **FR-060**: System MUST generate error log for failed rows
- **FR-061**: System MUST return import summary with success/error/duplicate counts
- **FR-062**: System MUST provide endpoint to download import error log at `GET /api/v8/module/Leads/import/{importId}/errors`
- **FR-063**: System MUST provide endpoint to retrieve lead analytics at `GET /api/v8/module/Leads/insights`
- **FR-064**: System MUST aggregate lead counts by status
- **FR-065**: System MUST calculate percentages for each status category
- **FR-066**: System MUST apply filters if provided in insights request
- **FR-067**: System MUST return quick stats (total, new, converted, dead counts)
- **FR-068**: System MUST provide endpoint to retrieve lead relationships at `GET /api/v8/module/Leads/{id}/relationships/{linkFieldName}`
- **FR-069**: System MUST support relationships: emails, activities, calls, meetings, tasks, notes, documents, contacts
- **FR-070**: System MUST support pagination, filtering, and sorting for relationship endpoints
- **FR-071**: System MUST provide endpoint to create relationship at `POST /api/v8/module/Leads/{id}/relationships/{linkFieldName}`
- **FR-072**: System MUST create join table entry for many-to-many relationships
- **FR-073**: System MUST update foreign key for one-to-many relationships
- **FR-074**: System MUST validate relationship type and related record exists
- **FR-075**: System MUST provide endpoint to delete relationship at `DELETE /api/v8/module/Leads/{id}/relationships/{linkFieldName}/{relatedId}`
- **FR-076**: System MUST soft delete join table entry for many-to-many relationships
- **FR-077**: System MUST set foreign key to NULL or soft delete for one-to-many relationships
- **FR-078**: System MUST provide endpoint to convert lead at `POST /api/v8/module/Leads/{id}/convert`
- **FR-079**: System MUST create Contact record from lead data on conversion
- **FR-080**: System MUST optionally create Account record if createAccount is true
- **FR-081**: System MUST optionally create Opportunity record if createOpportunity is true
- **FR-082**: System MUST update lead status to "Converted" on conversion
- **FR-083**: System MUST link created records (Contact to Account, Opportunity to Account)
- **FR-084**: System MUST transfer email addresses from lead to Contact on conversion
- **FR-085**: System MUST transfer activities from lead to Contact on conversion
- **FR-086**: System MUST use database transactions to ensure atomicity of conversion process
- **FR-087**: System MUST provide endpoint to retrieve saved filters at `GET /api/v8/module/Leads/filters/saved`
- **FR-088**: System MUST return only filters saved by current user (user-specific, not shared)
- **FR-089**: System MUST provide endpoint to save filter at `POST /api/v8/module/Leads/filters/saved`
- **FR-090**: System MUST store filter configuration in saved_filters table or user preferences
- **FR-091**: System MUST associate filter with current user
- **FR-092**: System MUST validate filter structure before saving
- **FR-093**: System MUST provide endpoint to update saved filter at `PATCH /api/v8/module/Leads/filters/saved/{filterId}`
- **FR-094**: System MUST validate user owns the filter before update
- **FR-095**: System MUST provide endpoint to delete saved filter at `DELETE /api/v8/module/Leads/filters/saved/{filterId}`
- **FR-096**: System MUST validate user owns the filter before delete
- **FR-097**: System MUST provide endpoint to retrieve listview columns at `GET /api/v8/listview/columns/Leads`
- **FR-098**: System MUST return user's saved column configuration if exists
- **FR-099**: System MUST return default columns if no saved configuration
- **FR-100**: System MUST provide endpoint to save column configuration at `POST /api/v8/listview/columns/Leads`
- **FR-101**: System MUST validate column names exist in field definitions
- **FR-102**: System MUST store column configuration in user preferences
- **FR-103**: System MUST filter all queries with `WHERE deleted = 0` by default
- **FR-104**: System MUST support soft delete recovery (set deleted = 0)
- **FR-105**: System MUST support multiple email addresses per lead via email_addr_bean_rel join table
- **FR-106**: System MUST mark one email address as primary (primary_address = 1)
- **FR-107**: System MUST support email flags: invalid_email and opt_out
- **FR-108**: System MUST support primary and alternate address fields stored in leads table
- **FR-109**: System MUST track audit trail in leads_audit table if module is audited
- **FR-110**: System MUST record before_value and after_value for each field change in audit trail
- **FR-111**: System MUST support status transitions (any status can transition to any other status)
- **FR-112**: System MUST calculate and store opportunity amount in USD (opportunity_amount_usdollar) if currencyId is provided
- **FR-113**: System MUST use current conversion rate from currencies table for currency conversion
- **FR-114**: System MUST recalculate USD amount on currency or amount change
- **FR-115**: System MUST generate lead name from salutation, firstName, and lastName
- **FR-116**: System MUST store computed name field for search/sort purposes
- **FR-117**: System MUST validate and sanitize all input data to prevent XSS attacks
- **FR-118**: System MUST use parameterized queries to prevent SQL injection
- **FR-119**: System MUST enforce field-level access control (check ACL for each field)
- **FR-120**: System MUST implement rate limiting (100 requests per minute per user for standard endpoints)
- **FR-121**: System MUST implement stricter rate limiting for import endpoint (10 requests per hour)
- **FR-122**: System MUST return 429 Too Many Requests if rate limit exceeded
- **FR-123**: System MUST respond to list endpoint within 500ms for up to 1000 records
- **FR-124**: System MUST process bulk delete for up to 1000 records within 5 seconds
- **FR-125**: System MUST generate CSV/Excel export for up to 10,000 records within 10 seconds
- **FR-126**: System MUST handle at least 100 concurrent API requests
- **FR-127**: System MUST use database connection pooling
- **FR-128**: System MUST implement optimistic locking to prevent concurrent update conflicts
- **FR-129**: System MUST ensure proper database indexes on frequently queried fields (status, assignedUserId, dateEntered)
- **FR-130**: System MUST log all API requests (endpoint, method, user ID, timestamp, response time)
- **FR-131**: System MUST log errors with stack traces and context
- **FR-132**: System MUST track error rates and performance metrics

### Key Entities *(include if feature involves data)*

- **Lead**: Represents a lead (unqualified contact) in the system
  - Attributes: id (uuid), salutation, firstName, lastName, name (computed), accountName, title, department, officePhone, mobilePhone, fax, status (enum), statusDescription, opportunityAmount, opportunityAmountUsdollar, currencyId, campaignId, leadSource, referredBy, doNotCall, assignedUserId, createdBy, modifiedUserId, dateEntered, dateModified, deleted, description, primary address fields, alternate address fields
  - Relationships: Many-to-one with Users (assignedUserId, createdBy, modifiedUserId), Many-to-one with Currencies (currencyId), Many-to-one with Campaigns (campaignId), Many-to-many with EmailAddresses (via email_addr_bean_rel), One-to-many with Activities (Calls, Meetings, Tasks, Notes, Emails via parent_id, parent_type)
  - Purpose: Stores lead information for unqualified contacts from marketing events

- **SavedFilter**: Represents a user's saved filter configuration for leads list view
  - Attributes: id (uuid), userId, name, module ("Leads"), filter (json object), createdAt, updatedAt, deleted
  - Relationships: Many-to-one with Users (userId)
  - Purpose: Stores user-specific filter configurations for quick access to filtered lead lists

- **LeadAudit**: Represents audit trail entries for lead field changes (if module is audited)
  - Attributes: id (uuid), parentId (lead id), fieldName, dataType, beforeValueString, afterValueString, beforeValueText, afterValueText, createdBy, dateCreated
  - Relationships: Many-to-one with Leads (parentId), Many-to-one with Users (createdBy)
  - Purpose: Tracks field change history for lead records for compliance and auditing

- **EmailAddress**: Represents an email address (shared entity across modules)
  - Attributes: id (uuid), emailAddress, invalidEmail, optOut
  - Relationships: Many-to-many with Leads (via email_addr_bean_rel join table)
  - Purpose: Stores email addresses and links them to leads and other modules

- **EmailAddressBeanRel**: Join table linking email addresses to leads and other modules
  - Attributes: id (uuid), emailAddressId, beanId (lead id), beanModule ("Leads"), primaryAddress, deleted
  - Relationships: Many-to-one with EmailAddresses (emailAddressId), Many-to-one with Leads (beanId)
  - Purpose: Establishes many-to-many relationship between leads and email addresses

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All Leads API endpoints respond within specified time limits - list: 500ms (95th percentile), detail: 200ms, create: 300ms, update: 300ms
- **SC-002**: System handles 100 concurrent API requests without performance degradation
- **SC-003**: All functional requirements are implemented and tested - 100% requirement coverage in test suite
- **SC-004**: Bulk delete processes 1000 records within 5 seconds - measured end-to-end
- **SC-005**: Import processes 1000 leads within 30 seconds - includes file parsing, validation, duplicate checking, and record creation
- **SC-006**: System maintains 99.9% uptime for Leads API endpoints - measured over 30-day period
- **SC-007**: All security requirements are implemented and validated - zero successful SQL injection or XSS attacks in security testing
- **SC-008**: All error scenarios return appropriate HTTP status codes and error messages - 100% of error cases return correct status codes
- **SC-009**: Role-based access control works correctly - Sales Users see only assigned/own leads, Sales Managers/Admins see all leads 100% of the time
- **SC-010**: Lead conversion process is atomic - 100% of conversions either complete fully or roll back completely (no partial conversions)
- **SC-011**: Import duplicate checking works correctly - duplicate detection accuracy of 100% based on configured criteria
- **SC-012**: Filtering and sorting work correctly - all filter combinations and sort options return accurate results
- **SC-013**: Pagination works correctly - all page ranges return correct records with accurate total counts
- **SC-014**: Email address relationships are maintained correctly - all email addresses linked to leads via join table
- **SC-015**: Audit trail captures all required changes - 100% of audited field changes are recorded in leads_audit table
- **SC-016**: Currency conversion is accurate - USD amounts calculated correctly using current conversion rates
- **SC-017**: Optimistic locking prevents concurrent update conflicts - 100% of concurrent update attempts are handled correctly
- **SC-018**: Rate limiting is effective - 100% of rate limit violations are properly rejected with 429 status code
- **SC-019**: Database queries are optimized - all queries use indexes and complete within 100ms for standard operations
- **SC-020**: Export files are generated correctly - CSV/Excel files contain accurate data with proper encoding and formatting

---

## Technical Implementation Notes

This specification is derived from the detailed backend requirements document. The implementation should:

- Follow the API endpoint specifications defined in the requirements (JSON-API format)
- Implement proper error handling for all error scenarios (authentication, authorization, validation, not found, concurrent updates)
- Ensure security best practices (OAuth 2.0 authentication, RBAC, input validation, SQL injection prevention, XSS protection, rate limiting)
- Maintain performance requirements (response times, bulk operations, concurrency handling)
- Implement comprehensive logging for monitoring and debugging (request/response logging, error logging, performance metrics)
- Use soft delete pattern (set deleted = 1, filter WHERE deleted = 0)
- Support optimistic locking for concurrent update prevention
- Implement efficient pagination, filtering, and sorting with proper database indexes
- Handle bulk operations efficiently (batch processing, transaction management)
- Support lead conversion with atomic transactions (all-or-nothing)
- Implement import/export with proper file format validation and error reporting
- Support relationship management (many-to-many via join tables, one-to-many via foreign keys)
- Track audit trail for field changes if module is audited
- Calculate currency conversions accurately using current rates
- Generate computed fields (name) for search and sort optimization
- Enforce role-based data filtering consistently across all endpoints
- Optimize database queries with proper indexes and query patterns
- Implement database connection pooling for efficient resource management
- Support saved filters and column configurations per user

For detailed technical requirements, refer to `requirements/Leads/backend-requirements.md`.
