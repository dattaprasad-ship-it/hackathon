# Backend Specifications - Contacts Module

**Feature Branch**: `003-contacts-backend`  
**Created**: 2025-12-12  
**Updated**: 2025-12-12 (clarifications applied)  
**Status**: Draft  
**Input**: User description: "Backend specifications for Contacts module derived from backend requirements"

**Note**: This specification has been updated with clarifications for permissions (delete and bulk import restricted to Admin only), bulk action workflows (merge, mass update), preview workflow for bulk import, and other business logic clarifications.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - System Returns Paginated Contacts List (Priority: P1)

As a frontend application, I want the backend to return a paginated list of contacts with filtering and sorting capabilities, so that I can display contacts efficiently in the UI.

**Why this priority**: This is the core API endpoint that powers the contacts list view. Without this, the frontend cannot display contacts. It must support pagination, filtering, and sorting to handle large datasets efficiently.

**Independent Test**: Can be fully tested by sending a GET request to `/api/contacts` with pagination, filter, and sort parameters, and verifying the JSON-API response contains the correct data structure with pagination metadata. This delivers immediate value by enabling contact list display.

**Acceptance Scenarios**:

1. **Given** a valid authentication token is provided, **When** a GET request is sent to `/api/contacts`, **Then** the system returns 200 OK with JSON-API format containing contacts array in `data`, pagination metadata in `meta`, and navigation links in `links`
2. **Given** pagination parameters are provided (`page[offset]=0&page[limit]=20`), **When** the request is processed, **Then** the system returns exactly 20 contacts (or fewer if total is less) and `meta.total` reflects the total count
3. **Given** filter parameters are provided (e.g., `filter[lastName]=Doe`), **When** the request is processed, **Then** the system returns only contacts matching the filter criteria
4. **Given** sort parameters are provided (e.g., `sort=name` or `sort=-date_created`), **When** the request is processed, **Then** the system returns contacts sorted by the specified field and direction
5. **Given** an Employee role user requests contacts, **When** the request is processed, **Then** the system filters results to show only contacts assigned to that user or contacts they have access to

---

### User Story 2 - System Creates New Contact (Priority: P1)

As a frontend application, I want the backend to create a new contact when provided with valid contact data, so that users can add new contacts to the CRM system.

**Why this priority**: Contact creation is a fundamental CRUD operation. This endpoint enables users to add new contacts, which is essential for building the contact database.

**Independent Test**: Can be fully tested by sending a POST request to `/api/contacts` with valid contact data in JSON-API format, and verifying the contact is created with auto-generated fields (id, dateCreated, dateModified, createdBy). This delivers value by enabling contact creation.

**Acceptance Scenarios**:

1. **Given** valid contact data is provided in JSON-API format with required field `lastName`, **When** a POST request is sent to `/api/contacts`, **Then** the system creates the contact and returns 201 Created with the created contact object
2. **Given** contact data is provided without `lastName`, **When** a POST request is sent, **Then** the system returns 400 Bad Request with JSON-API error format indicating `lastName` is required
3. **Given** contact data includes multiple email addresses, **When** the contact is created, **Then** the system ensures only one email is marked as primary
4. **Given** contact data is provided without `assignedUserId`, **When** the contact is created, **Then** the system sets `assignedUserId` to the current authenticated user
5. **Given** contact data includes invalid foreign key references (e.g., non-existent accountId), **When** the request is processed, **Then** the system returns 400 Bad Request with error indicating invalid reference

---

### User Story 3 - System Updates Existing Contact (Priority: P1)

As a frontend application, I want the backend to update an existing contact when provided with modified contact data, so that users can maintain accurate contact information.

**Why this priority**: Contact updates are essential for data maintenance. Users need to modify contact information as it changes, and this endpoint enables that functionality.

**Independent Test**: Can be fully tested by sending a PATCH request to `/api/contacts/:id` with updated fields, and verifying the contact is updated with new `dateModified` and `modifiedUserId` values. This delivers value by enabling contact updates.

**Acceptance Scenarios**:

1. **Given** valid contact ID and updated data are provided, **When** a PATCH request is sent to `/api/contacts/:id`, **Then** the system updates the contact and returns 200 OK with updated contact object
2. **Given** a contact ID that doesn't exist is provided, **When** a PATCH request is sent, **Then** the system returns 404 Not Found with appropriate error message
3. **Given** a user without edit permission attempts to update a contact, **When** a PATCH request is sent, **Then** the system returns 403 Forbidden with access denied error
4. **Given** contact update includes email address changes, **When** the update is processed, **Then** the system updates email relationships in `email_addr_bean_rel` table
5. **Given** a contact is updated, **When** the update completes, **Then** the system records changes in audit trail (`contacts_audit` table)

---

### User Story 4 - System Imports Contact from vCard (Priority: P2)

As a frontend application, I want the backend to parse a vCard file and create a contact from the extracted data, so that users can quickly import contacts from external sources.

**Why this priority**: vCard import provides convenience for users migrating contacts or importing from email clients. While not critical for core functionality, it significantly improves user experience.

**Independent Test**: Can be fully tested by sending a POST request to `/api/contacts/import-vcard` with a valid .vcf file, and verifying the contact is created with data extracted from the vCard. This delivers value by enabling quick contact import.

**Acceptance Scenarios**:

1. **Given** a valid .vcf or .vcard file is uploaded, **When** a POST request is sent to `/api/contacts/import-vcard`, **Then** the system parses the vCard, extracts contact data, creates a contact, and returns 201 Created
2. **Given** an invalid file format (not .vcf or .vcard) is uploaded, **When** a POST request is sent, **Then** the system returns 400 Bad Request with error code "INVALID_VCARD_FORMAT"
3. **Given** a vCard file that cannot be parsed is uploaded, **When** a POST request is sent, **Then** the system returns 400 Bad Request with error code "VCARD_PARSE_ERROR" and detailed reason
4. **Given** a vCard contains multiple email addresses, **When** the contact is created, **Then** the system imports all emails and marks one as primary

---

### User Story 5 - System Performs Bulk Actions on Contacts (Priority: P2)

As a frontend application, I want the backend to perform actions on multiple contacts simultaneously, so that users can efficiently manage large numbers of contacts.

**Why this priority**: Bulk actions significantly improve efficiency when managing many contacts. While not critical for core functionality, it's essential for power users.

**Independent Test**: Can be fully tested by sending a POST request to `/api/contacts/bulk-action` with contact IDs and action type, and verifying the action is performed on all valid contacts. This delivers value by enabling efficient bulk operations.

**Acceptance Scenarios**:

1. **Given** multiple contact IDs and action type "delete" are provided, **When** a POST request is sent to `/api/contacts/bulk-action`, **Then** the system soft-deletes all valid contacts and returns success/failure counts
2. **Given** a user attempts bulk action on contacts they don't have permission to modify, **When** the request is processed, **Then** the system processes only authorized contacts and reports permission errors for others
3. **Given** bulk action includes invalid contact IDs, **When** the request is processed, **Then** the system skips invalid IDs and includes them in failure count with error details

---

### Edge Cases

- What happens when the database connection fails during contact creation?
  - System should return 500 Internal Server Error with generic error message and log full error details for debugging

- What happens when a user provides a circular "Reports To" relationship (Contact A reports to Contact B, Contact B reports to Contact A)?
  - System should validate and prevent circular references, returning 400 Bad Request with error indicating circular reference detected

- What happens when two users simultaneously update the same contact?
  - System should handle concurrent updates appropriately (last write wins or optimistic locking based on implementation)

- What happens when a contact's assigned user is deleted?
  - System should validate that assignedUserId references an active user, or handle gracefully by preventing user deletion if contacts are assigned

- What happens when pagination offset exceeds total count?
  - System should return empty data array with correct meta.total and appropriate pagination links

- What happens when filter criteria match zero contacts?
  - System should return empty data array with meta.total = 0 and appropriate pagination links

- What happens when vCard file is corrupted or contains invalid data?
  - System should return 400 Bad Request with detailed error message explaining what data is invalid

- What happens when bulk action is performed on 1000+ contacts?
  - System should process in batches to prevent timeout, or return 202 Accepted for async processing with job ID

- What happens when email address validation fails during contact creation?
  - System should return 400 Bad Request with field-specific error indicating invalid email format

- What happens when foreign key validation fails (e.g., accountId references non-existent account)?
  - System should return 400 Bad Request with error code "INVALID_REFERENCE" and field name in details

## Requirements *(mandatory)*

### Functional Requirements

#### API Endpoints

- **FR-001**: System MUST provide GET endpoint at `/api/contacts` for listing contacts
- **FR-002**: System MUST provide GET endpoint at `/api/contacts/:id` for retrieving single contact
- **FR-003**: System MUST provide POST endpoint at `/api/contacts` for creating contacts
- **FR-004**: System MUST provide PATCH endpoint at `/api/contacts/:id` for updating contacts
- **FR-005**: System MUST provide DELETE endpoint at `/api/contacts/:id` for soft-deleting contacts
- **FR-006**: System MUST provide POST endpoint at `/api/contacts/bulk-action` for bulk operations
- **FR-007**: System MUST provide POST endpoint at `/api/contacts/import-vcard` for vCard import
- **FR-008**: System MUST provide POST endpoint at `/api/contacts/import` for bulk import
- **FR-009**: System MUST provide GET endpoint at `/api/contacts/recently-viewed` for recently viewed contacts
- **FR-010**: System MUST provide GET/POST/PUT endpoints at `/api/contacts/column-preferences` for column preferences

#### Request/Response Format

- **FR-011**: System MUST use JSON-API format (JSON-API 1.0 specification) for all request and response bodies
- **FR-012**: System MUST use ISO 8601 format for all datetime fields in API responses (e.g., "2024-01-01T00:00:00Z")
- **FR-013**: System MUST return JSON-API error format with `errors` array for all error responses
- **FR-014**: System MUST include `meta` object with pagination information in list responses
- **FR-015**: System MUST include `links` object with pagination navigation links in list responses
- **FR-016**: System MUST include `relationships` object in contact responses for related entities

#### Authentication & Authorization

- **FR-017**: System MUST require valid JWT authentication token for all Contacts API endpoints
- **FR-018**: System MUST validate user permissions based on role (Admin, Employee) before processing requests
- **FR-019**: System MUST enforce role-based access control (Admin has full access, Employee has limited access)
- **FR-020**: System MUST validate user has access to contact before allowing read/update/delete operations
- **FR-021**: System MUST filter contact list results based on user permissions (Employee sees only accessible contacts)

#### Data Validation

- **FR-022**: System MUST validate that `lastName` field is provided and not empty when creating/updating contacts
- **FR-023**: System MUST validate email address format for all email addresses provided
- **FR-024**: System MUST validate that foreign key references (accountId, assignedUserId, reportsToId, campaignId) exist and are accessible
- **FR-025**: System MUST prevent circular references in Reports To relationships
- **FR-026**: System MUST validate that assignedUserId references an active user
- **FR-027**: System MUST enforce only one primary email address per contact
- **FR-028**: System MUST validate file format for vCard import (.vcf or .vcard only)
- **FR-029**: System MUST validate file format for bulk import (CSV or Excel only)

#### Business Logic

- **FR-030**: System MUST auto-generate GUID for contact ID if not provided
- **FR-031**: System MUST set `dateCreated` and `dateModified` timestamps automatically
- **FR-032**: System MUST set `createdBy` to current user ID on creation
- **FR-033**: System MUST set `modifiedUserId` to current user ID on update
- **FR-034**: System MUST default `assignedUserId` to current user if not provided
- **FR-035**: System MUST perform soft delete (set `deleted = 1`) instead of physical deletion
- **FR-036**: System MUST filter out soft-deleted contacts from list queries (`deleted = 0`)
- **FR-037**: System MUST create email address records via `email_addr_bean_rel` join table
- **FR-038**: System MUST track contact views for "recently viewed" functionality
- **FR-039**: System MUST update audit trail for all contact modifications

#### Pagination

- **FR-040**: System MUST support pagination with `page[offset]` and `page[limit]` query parameters
- **FR-041**: System MUST default page limit to 20 if not specified
- **FR-042**: System MUST enforce maximum page limit of 100
- **FR-043**: System MUST return total count in `meta.total` field
- **FR-044**: System MUST provide pagination links (first, last, prev, next) in `links` object

#### Filtering

- **FR-045**: System MUST support filtering by: first_name, last_name, account_name, assigned_to, email, phone, address fields, lead_source
- **FR-046**: System MUST combine multiple filter criteria with AND logic
- **FR-047**: System MUST apply user access rules to filtered results

#### Sorting

- **FR-048**: System MUST support sorting by: name, job_title, account_name, office_phone, user, date_created
- **FR-049**: System MUST support ascending and descending sort directions (via `sort` parameter: "field" for ascending, "-field" for descending)
- **FR-050**: System MUST combine filtering and sorting in single query

#### vCard Import

- **FR-051**: System MUST parse vCard (.vcf/.vcard) file format
- **FR-052**: System MUST extract contact fields from vCard: name, email, phone, address, organization
- **FR-053**: System MUST map vCard fields to contact entity fields
- **FR-054**: System MUST handle multiple email addresses from vCard
- **FR-055**: System MUST return detailed error if vCard parsing fails

#### Bulk Import

- **FR-056**: System MUST support CSV and Excel file formats for bulk import
- **FR-057**: System MUST process bulk import asynchronously for large files
- **FR-058**: System MUST validate each row before import
- **FR-059**: System MUST return detailed import results: success count, failure count, error details per row

#### Audit Trail

- **FR-060**: System MUST track all contact field changes in `contacts_audit` table
- **FR-061**: System MUST record field name, before value, after value, user who made change, and timestamp
- **FR-062**: System MUST only record fields that actually changed

### Key Entities *(include if feature involves data)*

- **Contact**: Represents a contact/person in the CRM system
  - Database table: `contacts`
  - Primary key: `id` (char(36), GUID)
  - Key attributes: title, firstName, lastName (required), officePhone, mobile, jobTitle, department, accountId (char(36)), assignedUserId (char(36), required), leadSource (enum), reportsToId (char(36)), campaignId (char(36)), primaryAddress fields, alternateAddress fields, description (text), dateCreated (datetime), dateModified (datetime), createdBy (char(36)), modifiedUserId (char(36)), deleted (tinyint(1), default: 0)
  - Relationships: Many-to-one with Account, User (assigned, creator, modifier), Contact (reports to), Campaign; Many-to-many with EmailAddresses; One-to-many with Calls, Meetings, Tasks, Emails
  - Indexes: Primary key on id, index on lastName, index on accountId, index on assignedUserId, index on deleted, composite index on (deleted, assignedUserId), index on dateCreated
  - Purpose: Stores contact information for CRM operations

- **EmailAddress (via email_addr_bean_rel)**: Represents email addresses associated with contacts
  - Join table: `email_addr_bean_rel`
  - Primary key: `id` (char(36))
  - Key attributes: emailAddressId (char(36)), beanId (char(36)), beanModule (varchar(100), "Contacts"), primaryAddress (tinyint(1)), emailOptOut (tinyint(1)), invalidEmail (tinyint(1)), deleted (tinyint(1))
  - Relationships: Many-to-many with Contact via join table
  - Purpose: Manages multiple email addresses per contact with primary designation

- **ContactAudit**: Tracks changes to contact records
  - Database table: `contacts_audit`
  - Primary key: `id` (char(36))
  - Key attributes: parent_id (char(36)), field_name (varchar), data_type (varchar), before_value_string (varchar), after_value_string (varchar), before_value_text (text), after_value_text (text), created_by (char(36)), date_created (datetime)
  - Purpose: Audit trail for contact modifications

- **ContactColumnPreference**: Stores user preferences for column visibility and order
  - Attributes: id (UUID), userId (char(36)), module (varchar, "Contacts"), columnPreferences (JSON), createdAt (datetime), updatedAt (datetime)
  - Relationships: Many-to-one with User
  - Purpose: Persists user's custom column configuration for contacts list view

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: GET /api/contacts list endpoint responds within 500ms for 95% of requests (includes database query, filtering, sorting, pagination)
- **SC-002**: GET /api/contacts/:id endpoint responds within 200ms for 95% of requests
- **SC-003**: POST /api/contacts create endpoint responds within 1 second for typical contact data
- **SC-004**: All functional requirements are implemented and tested - 100% requirement coverage in test suite
- **SC-005**: vCard import successfully processes valid vCard files with 100% accuracy - all valid vCard data is correctly extracted and mapped
- **SC-006**: Bulk import processes 1000+ contacts within 60 seconds - measured for standard CSV files
- **SC-007**: System handles 1000 concurrent contact list requests without performance degradation
- **SC-008**: All API responses use JSON-API format - 100% compliance with JSON-API 1.0 specification
- **SC-009**: All error responses use JSON-API error format - consistent error structure across all endpoints
- **SC-010**: User access rules are correctly enforced - 100% of unauthorized access attempts are blocked
- **SC-011**: Soft delete functionality works correctly - deleted contacts are excluded from list queries but remain in database
- **SC-012**: Email address primary flag enforcement works - only one email can be primary per contact, enforced in all operations
- **SC-013**: All validation rules are enforced - 100% of invalid data is rejected with appropriate error messages
- **SC-014**: Audit trail captures all contact modifications - 100% of create, update, and delete operations are logged
- **SC-015**: Pagination works correctly for all dataset sizes - handles empty pages, edge cases, and maintains filter/sort state

---

## Technical Implementation Notes

This specification is derived from the detailed backend requirements document. The implementation should:

- Follow JSON-API format for all request and response bodies
- Use TypeORM entities for database operations (following project structure conventions)
- Implement proper error handling using JSON-API error format
- Ensure security best practices (input validation, SQL injection prevention, XSS prevention)
- Maintain performance requirements (response times, concurrency)
- Implement comprehensive logging for security auditing
- Use soft delete pattern (set deleted flag, don't physically remove records)
- Maintain audit trail for all contact modifications
- Enforce email address primary flag constraint
- Handle vCard parsing and bulk import with proper error handling
- Implement efficient filtering, sorting, and pagination with database optimization
- Support column preferences persistence per user
- Track recently viewed contacts per user session
- Validate all foreign key relationships before saving
- Prevent circular references in Reports To relationships
- Handle concurrent edits appropriately

**Database Conventions**:
- GUIDs stored as `char(36)` in database
- Boolean fields stored as `tinyint(1)` (0 = false, 1 = true)
- Timestamps stored as `datetime` type
- All foreign keys are `char(36)` referencing GUID primary keys

**API Conventions**:
- All API responses use JSON-API format
- Datetime values use ISO 8601 format in API responses
- Error responses follow JSON-API error format with proper status codes
- Pagination uses `page[offset]` and `page[limit]` query parameters

For detailed technical requirements, refer to `requirements/contacts/backend-requirements.md`.

