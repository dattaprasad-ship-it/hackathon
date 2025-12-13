# Backend Requirements - Contacts Module

**Module**: Contacts  
**Created**: 2025-12-12  
**Status**: Draft  
**Derived From**: `product-info/product-overview.md`

## Overview

The Contacts module backend provides comprehensive APIs for managing contact information in the CRM system. It supports CRUD operations, bulk actions, filtering, sorting, pagination, vCard import, and contact relationship management. The module integrates with Accounts, Users, and communication modules (Calls, Meetings, Tasks, Emails) to support quick actions and relationship tracking.

**System Roles Used:**
- **Admin**: Full access to all contacts, can create, edit, delete, and import contacts
- **Employee**: Can view and manage assigned contacts, create new contacts, and access recently viewed contacts
- **All Users**: Must be authenticated to access Contacts API endpoints

**Common Functionalities Used:**
- **Authentication & Authorization**: All Contacts endpoints require JWT authentication and role-based authorization
- **Audit Trail**: Contact creation, modification, and deletion are tracked for audit purposes
- **Soft Delete**: Contacts are soft-deleted (marked as deleted) rather than physically removed from database
- **Email Address Management**: Contacts support multiple email addresses with primary email designation
- **Relationship Management**: Contacts can be linked to Accounts, other Contacts (reports to), Campaigns, and Users

**Dependencies:**
- Authentication module (for user validation and role information)
- Accounts module (for account relationships)
- Users module (for assigned user relationships)
- Campaigns module (for campaign relationships)
- Email module (for email address management)
- File upload service (for vCard import)

**Integration Points:**
- Exposes REST API endpoints for frontend consumption
- Integrates with Accounts module for account relationships
- Integrates with Users module for assigned user tracking
- Integrates with Campaigns module for campaign tracking
- Supports relationship endpoints for Calls, Meetings, Tasks, and Emails modules
- Provides recently viewed contacts tracking for user session management

---

## Functional Requirements

### Authentication & Authorization

- **FR-BE-001**: System MUST require valid JWT authentication token for all Contacts API endpoints
- **FR-BE-002**: System MUST validate user permissions based on role (Admin, Employee) before processing requests
- **FR-BE-003**: System MUST use JSON-API format for all request and response bodies (following JSON-API 1.0 specification)
- **FR-BE-004**: System MUST use ISO 8601 format for all datetime fields in API responses (e.g., "2024-01-01T00:00:00Z")
- **FR-BE-003**: Admin role MUST have full access to all contacts (create, read, update, delete, bulk import)
- **FR-BE-004**: Employee role MUST be able to create, read, and update contacts assigned to them
- **FR-BE-005**: Employee role MUST be able to read contacts assigned to other users based on access rules
- **FR-BE-006**: Employee role MUST NOT be able to delete contacts (delete operation restricted to Admin only)
- **FR-BE-007**: Employee role MUST NOT be able to perform bulk import (bulk import restricted to Admin only)
- **FR-BE-008**: System MUST prevent unauthorized access to contact data based on ownership and role permissions

### API Endpoints

#### List Contacts

- **FR-BE-010**: System MUST provide endpoint to retrieve paginated list of contacts
  - **Method**: GET
  - **Path**: `/api/contacts`
  - **Request Query Parameters**:
    - `page[offset]` (integer, optional): Pagination offset (default: 0)
    - `page[limit]` (integer, optional): Number of records per page (default: 20, max: 100)
    - `filter` (object, optional): Filter criteria for contacts (supports multiple fields)
    - `sort` (string, optional): Sort field and direction (e.g., "name", "-date_created" for descending)
    - `fields` (string, optional): Comma-separated list of fields to include in response
  - **Response**: 200 OK
    - JSON-API format with `data` array containing contact objects
    - Includes pagination metadata: `links` (first, last, prev, next), `meta` (total count, page info)
    - **Response Format**:
      ```json
      {
        "data": [
          {
            "type": "Contacts",
            "id": "guid",
            "attributes": {
              "firstName": "John",
              "lastName": "Doe",
              ...
            },
            "relationships": {
              "account": {
                "data": { "type": "Accounts", "id": "account-guid" }
              },
              "assigned_user": {
                "data": { "type": "Users", "id": "user-guid" }
              }
            },
            "links": {
              "self": "/api/contacts/guid"
            }
          }
        ],
        "meta": {
          "total": 100,
          "page": {
            "offset": 0,
            "limit": 20
          }
        },
        "links": {
          "self": "/api/contacts?page[offset]=0&page[limit]=20",
          "first": "/api/contacts?page[offset]=0&page[limit]=20",
          "last": "/api/contacts?page[offset]=80&page[limit]=20",
          "prev": null,
          "next": "/api/contacts?page[offset]=20&page[limit]=20"
        }
      }
      ```
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee
  - **Business Logic**:
    - Filters out soft-deleted contacts (`deleted = 0`)
    - Applies user-specific access rules (Employee can only see assigned contacts or contacts they have access to)
    - Supports filtering by: first_name, last_name, account_name, assigned_to, email, phone, address, state, country, postal_code, city, lead_source
    - Supports sorting by: name, job_title, account_name, office_phone, user, date_created
    - Returns default columns: id, name, job_title, account_name, email, office_phone, user, date_created

#### Get Single Contact

- **FR-BE-011**: System MUST provide endpoint to retrieve a single contact by ID
  - **Method**: GET
  - **Path**: `/api/contacts/:id`
  - **Request Path Parameters**:
    - `id` (string, required): Contact GUID
  - **Request Query Parameters**:
    - `fields` (string, optional): Comma-separated list of fields to include in response
  - **Response**: 200 OK
    - JSON-API format with single contact object in `data`
    - Includes related entities: account, assigned_user, reports_to_contact, campaign, email_addresses
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee
  - **Business Logic**:
    - Returns 404 if contact not found or soft-deleted
    - Validates user has access to the contact
    - Tracks contact view for "recently viewed" functionality

#### Create Contact

- **FR-BE-012**: System MUST provide endpoint to create a new contact
  - **Method**: POST
  - **Path**: `/api/contacts`
  - **Request Body**: JSON-API format
    ```json
    {
      "data": {
        "type": "Contacts",
        "attributes": {
          "title": "Mr.",
          "firstName": "John",
          "lastName": "Doe",
          "officePhone": "+1234567890",
          "mobile": "+1234567891",
          "jobTitle": "Manager",
          "department": "Sales",
          "accountId": "guid",
          "assignedUserId": "guid",
          "leadSource": "Cold Call",
          "reportsToId": "guid",
          "campaignId": "guid",
          "primaryAddressStreet": "123 Main St",
          "primaryAddressCity": "New York",
          "primaryAddressState": "NY",
          "primaryAddressPostalCode": "10001",
          "primaryAddressCountry": "USA",
          "alternateAddressStreet": "456 Oak Ave",
          "alternateAddressCity": "Boston",
          "alternateAddressState": "MA",
          "alternateAddressPostalCode": "02101",
          "alternateAddressCountry": "USA",
          "description": "Contact description",
          "emailAddresses": [
            {
              "emailAddress": "john.doe@example.com",
              "primary": true,
              "optOut": false,
              "invalid": false
            }
          ]
        }
      }
    }
    ```
  - **Response**: 201 Created
    - Returns created contact object with generated `id`, `dateCreated`, `dateModified`
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee
  - **Validation Rules**:
    - `lastName` is required
    - `emailAddresses[].emailAddress` must be valid email format if provided
    - `assignedUserId` must be valid user ID (defaults to current user if not provided)
    - `accountId` must be valid account ID if provided
    - `reportsToId` must be valid contact ID if provided
    - `campaignId` must be valid campaign ID if provided
  - **Business Logic**:
    - Auto-generates GUID for `id` if not provided
    - Sets `dateCreated` and `dateModified` to current timestamp
    - Sets `createdBy` to current user ID
    - Sets `assignedUserId` to current user if not provided
    - Sets `deleted = 0`
    - Creates email address records via email_addr_bean_rel table
    - Marks one email as primary if multiple emails provided
    - Updates audit trail
    - Triggers "recently viewed" tracking

#### Update Contact

- **FR-BE-013**: System MUST provide endpoint to update an existing contact
  - **Method**: PATCH
  - **Path**: `/api/contacts/:id`
  - **Request Path Parameters**:
    - `id` (string, required): Contact GUID
  - **Request Body**: JSON-API format with attributes to update (same structure as create, but only include fields to update)
  - **Response**: 200 OK
    - Returns updated contact object
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee (must have edit access)
  - **Validation Rules**:
    - Contact must exist and not be soft-deleted
    - User must have edit access to the contact
    - Same validation rules as create for provided fields
  - **Business Logic**:
    - Updates `dateModified` to current timestamp
    - Sets `modifiedUserId` to current user ID
    - Updates only provided fields
    - Handles email address updates (add, update, delete)
    - Updates audit trail for changed fields
    - Triggers "recently viewed" tracking

#### Delete Contact

- **FR-BE-014**: System MUST provide endpoint to delete a contact (soft delete)
  - **Method**: DELETE
  - **Path**: `/api/contacts/:id`
  - **Request Path Parameters**:
    - `id` (string, required): Contact GUID
  - **Response**: 200 OK
    - Returns success confirmation
  - **Response**: 200 OK or 403 Forbidden
    - Returns success confirmation on successful delete
    - Returns 403 Forbidden if user lacks permission (Employee role cannot delete)
  - **Auth Required**: Yes
  - **Roles**: Admin only (Employee role returns 403 Forbidden)
  - **Business Logic**:
    - Performs soft delete by setting `deleted = 1`
    - Does not physically remove record from database
    - Soft deletes related email address relationships
    - Updates audit trail
    - Does not cascade delete related records (Calls, Meetings, Tasks maintain reference)

#### Bulk Actions

- **FR-BE-015**: System MUST provide endpoint to perform bulk actions on multiple contacts
  - **Method**: POST
  - **Path**: `/api/contacts/bulk-action`
  - **Request Body**:
    ```json
    {
      "contactIds": ["guid1", "guid2", "guid3"],
      "action": "delete|export|merge|mass-update|add-to-target-list|print-pdf"
    }
    ```
  - **Action Types**:
    - `delete`: Soft delete multiple contacts (Admin only)
    - `export`: Export selected contacts to file (CSV/Excel)
    - `merge`: Merge multiple contacts into one - compares contacts by name to identify duplicates, prompts user whether to keep or skip duplicate data (via actionParams), stores all related records (calls, meetings, tasks, etc.) from merged contacts
    - `mass-update`: Update multiple contacts with same field values - all fields except username/assignedUserId can be mass updated (assignedUserId field is excluded from mass update operations)
    - `add-to-target-list`: Add contacts to a target list (target list ID provided in actionParams, prompts user to select target list)
    - `print-pdf`: Generate PDF report for selected contacts
  - **Request Body (Extended)**:
    ```json
    {
      "contactIds": ["guid1", "guid2", "guid3"],
      "action": "delete|export|merge|mass-update|add-to-target-list|print-pdf",
      "actionParams": {} // Action-specific parameters (e.g., target list ID, merge preferences, update fields)
    }
    ```
  - **Response**: 200 OK or 202 Accepted (for async operations) or 403 Forbidden
    - Returns action result with success/failure counts
    - Returns 403 Forbidden if user lacks permission for action (e.g., Employee trying to delete)
  - **Auth Required**: Yes
  - **Roles**: 
    - `delete`: Admin only (Employee role returns 403)
    - `export`, `merge`, `mass-update`, `add-to-target-list`, `print-pdf`: Admin and Employee (based on access to selected contacts)
  - **Business Logic**:
    - Validates all contact IDs exist and are accessible
    - Validates user has permission for each contact and action
    - Processes action for all valid contacts
    - Returns detailed results including failures

#### Import vCard

- **FR-BE-016**: System MUST provide endpoint to import contact from vCard file
  - **Method**: POST
  - **Path**: `/api/contacts/import-vcard`
  - **Request**: multipart/form-data
    - `file` (file, required): vCard file (.vcf or .vcard format)
  - **Response**: 201 Created
    - Returns created contact object
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee
  - **Validation Rules**:
    - File must be .vcf or .vcard format
    - File size must be within limits (e.g., 5MB max)
    - vCard must be valid and parseable
    - Required fields (lastName) must be present in vCard or provided defaults
  - **Business Logic**:
    - Parses vCard file format
    - Extracts contact information (name, email, phone, address, etc.)
    - Creates contact record with extracted data
    - Handles multiple email addresses from vCard
    - Maps vCard fields to contact fields
    - Returns created contact or detailed error if parsing fails

#### Import Contacts (Bulk)

- **FR-BE-017**: System MUST provide endpoint to bulk import contacts from file
  - **Method**: POST
  - **Path**: `/api/contacts/import`
  - **Request**: multipart/form-data
    - `file` (file, required): Import file (CSV or Excel format)
    - `mapping` (object, optional): Field mapping configuration
    - `mode` (string, optional): "preview" or "import" (default: "preview")
  - **Response**: 200 OK (preview mode) or 202 Accepted (import mode) or 403 Forbidden
    - **Preview Mode**: Returns 200 OK with preview data (parsed contacts with validation status, no contacts created)
    - **Import Mode**: Returns 202 Accepted with job ID for tracking import progress
    - Returns 403 Forbidden if user lacks permission (Employee role cannot bulk import)
  - **Auth Required**: Yes
  - **Roles**: Admin only (Employee role returns 403 Forbidden)
  - **Validation Rules**:
    - File format must be CSV or Excel (.xlsx, .xls)
    - File size must be within limits
    - File must contain required columns (lastName minimum)
    - Row data must pass validation rules
  - **Business Logic**:
    - **Preview Workflow**: When mode="preview", system parses file and returns preview data without creating contacts, allowing user to review before confirming import
    - **Import Workflow**: When mode="import" (after user confirms preview), system processes import asynchronously for large files
    - Validates each row before import
    - Creates contacts for valid rows
    - Skips invalid rows and logs errors
    - Tracks import progress and results
    - Returns summary: total rows, successful imports, failed imports with error details
    - Supports field mapping for flexible column matching

#### Get Recently Viewed Contacts

- **FR-BE-018**: System MUST provide endpoint to retrieve recently viewed contacts for current user
  - **Method**: GET
  - **Path**: `/api/contacts/recently-viewed`
  - **Request Query Parameters**:
    - `limit` (integer, optional): Number of contacts to return (default: 10, max: 50)
  - **Response**: 200 OK
    - Returns array of recently viewed contact objects with name and id
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee
  - **Business Logic**:
    - Retrieves contacts viewed by current user in recent session
    - Orders by most recently viewed first
    - Returns contact name and ID for navigation
    - Limits to most recent N contacts (configurable)

#### Save Column Preferences

- **FR-BE-019**: System MUST provide endpoint to save user's column visibility preferences
  - **Method**: POST/PUT
  - **Path**: `/api/contacts/column-preferences`
  - **Request Body**:
    ```json
    {
      "columns": [
        {
          "fieldName": "name",
          "visible": true,
          "order": 1
        },
        {
          "fieldName": "jobTitle",
          "visible": true,
          "order": 2
        }
      ]
    }
    ```
  - **Response**: 200 OK
    - Returns saved preferences
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee
  - **Business Logic**:
    - Stores column preferences per user
    - Associates preferences with user ID
    - Persists preferences in user_preferences table or similar
    - Applies preferences when fetching contact list

#### Get Column Preferences

- **FR-BE-020**: System MUST provide endpoint to retrieve user's column preferences
  - **Method**: GET
  - **Path**: `/api/contacts/column-preferences`
  - **Response**: 200 OK
    - Returns user's saved column preferences or default columns if none saved
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee

### Data Management

- **FR-BE-020**: System MUST store contact data in `contacts` table with proper indexing
- **FR-BE-021**: System MUST validate contact data before persistence (required fields, data types, formats)
- **FR-BE-022**: System MUST support soft delete pattern (set `deleted = 1` instead of physical deletion)
- **FR-BE-023**: System MUST track contact creation, modification, and deletion in audit trail
- **FR-BE-024**: System MUST maintain referential integrity with related entities (Accounts, Users, Campaigns)
- **FR-BE-025**: System MUST support multiple email addresses per contact via email_addr_bean_rel relationship table
- **FR-BE-026**: System MUST ensure only one primary email address per contact
- **FR-BE-027**: System MUST track recently viewed contacts per user session (maximum 20 contacts tracked)
- **FR-BE-028**: System MUST store user column preferences per user for Contacts module (user-specific preferences, maximum 7 columns displayed)

### Business Logic

#### Contact Creation and Updates

- **FR-BE-030**: System MUST auto-generate GUID for contact ID if not provided
- **FR-BE-031**: System MUST set `dateCreated` and `dateModified` timestamps automatically
- **FR-BE-032**: System MUST set `createdBy` to current user ID on creation
- **FR-BE-033**: System MUST set `modifiedUserId` to current user ID on update
- **FR-BE-034**: System MUST default `assignedUserId` to current user if not provided
- **FR-BE-035**: System MUST validate `lastName` is required before saving
- **FR-BE-036**: System MUST validate email addresses are in correct format (if email addresses are provided)
- **FR-BE-037**: System MUST ensure at least one email is marked as primary if multiple emails exist
- **FR-BE-038**: System MUST validate foreign key relationships (accountId, assignedUserId, reportsToId, campaignId) exist and are accessible

#### Email Address Management

- **FR-BE-040**: System MUST support multiple email addresses per contact
- **FR-BE-041**: System MUST maintain email addresses in `email_addr_bean_rel` join table
- **FR-BE-042**: System MUST enforce only one primary email address per contact
- **FR-BE-043**: System MUST support email address flags: primary, optOut, invalid
- **FR-BE-044**: System MUST update email relationships when contact email addresses are modified

#### Recently Viewed Tracking

- **FR-BE-050**: System MUST track when a user views a contact detail page
- **FR-BE-051**: System MUST store recently viewed contacts per user (session-based or persistent)
- **FR-BE-052**: System MUST limit recently viewed list to most recent N contacts (default: 10)
- **FR-BE-053**: System MUST order recently viewed contacts by most recent first

#### Filtering and Sorting

- **FR-BE-060**: System MUST support filtering by: first_name, last_name, account_name, assigned_to, email, phone, address fields, lead_source
- **FR-BE-061**: System MUST support sorting by any column: name, job_title, account_name, office_phone, user, date_created
- **FR-BE-062**: System MUST support ascending and descending sort directions
- **FR-BE-063**: System MUST combine filtering and sorting in single query
- **FR-BE-064**: System MUST apply user access rules to filtered results (Employee sees only accessible contacts)

#### Pagination

- **FR-BE-070**: System MUST support pagination with configurable page size (default: 20, max: 100)
- **FR-BE-071**: System MUST return pagination metadata: total count, current page, page size, total pages
- **FR-BE-072**: System MUST provide pagination links: first, last, prev, next
- **FR-BE-073**: System MUST handle pagination with filters and sorting applied

#### vCard Import

- **FR-BE-080**: System MUST parse vCard (.vcf/.vcard) file format
- **FR-BE-081**: System MUST extract contact fields from vCard: name, email, phone, address, organization
- **FR-BE-082**: System MUST map vCard fields to contact entity fields
- **FR-BE-083**: System MUST handle multiple email addresses from vCard
- **FR-BE-084**: System MUST validate vCard format before processing
- **FR-BE-085**: System MUST return detailed error if vCard parsing fails

#### Bulk Import

- **FR-BE-090**: System MUST support CSV and Excel file formats for bulk import
- **FR-BE-091**: System MUST process bulk import asynchronously for large files
- **FR-BE-092**: System MUST validate each row before import
- **FR-BE-093**: System MUST support field mapping for flexible column matching
- **FR-BE-094**: System MUST track import progress and provide status updates
- **FR-BE-095**: System MUST return detailed import results: success count, failure count, error details per row

### Integration Requirements

- **FR-BE-040**: System MUST integrate with Accounts module for account relationships
  - **Purpose**: Link contacts to accounts for organizational context
  - **Data Flow**: Contact `accountId` references Account `id`, account name displayed in contact list
  - **Error Handling**: Returns validation error if accountId references non-existent or inaccessible account

- **FR-BE-041**: System MUST integrate with Users module for assigned user relationships
  - **Purpose**: Track which user is assigned to each contact
  - **Data Flow**: Contact `assignedUserId` references User `id`, user name displayed in contact list
  - **Error Handling**: Returns validation error if assignedUserId references non-existent user

- **FR-BE-042**: System MUST integrate with Campaigns module for campaign tracking
  - **Purpose**: Track which campaign a contact is associated with
  - **Data Flow**: Contact `campaignId` references Campaign `id`
  - **Error Handling**: Returns validation error if campaignId references non-existent campaign

- **FR-BE-043**: System MUST integrate with Email module for email address management
  - **Purpose**: Manage multiple email addresses per contact
  - **Data Flow**: Email addresses stored in `email_addr_bean_rel` join table linking to `email_addresses` table
  - **Error Handling**: Handles email validation and primary email enforcement

- **FR-BE-044**: System MUST support relationships with Calls, Meetings, Tasks modules
  - **Purpose**: Enable quick actions (create call, meeting, task from contact)
  - **Data Flow**: These modules reference contact via `parent_id` and `parent_type='Contacts'`
  - **Error Handling**: Maintains referential integrity

### Security Requirements

- **FR-BE-050**: System MUST validate and sanitize all input data to prevent injection attacks
- **FR-BE-051**: System MUST enforce role-based access control for all contact operations
- **FR-BE-052**: System MUST filter contact data based on user permissions (Employee sees only assigned contacts)
- **FR-BE-053**: System MUST validate file uploads for vCard and bulk import (file type, size, content validation)
- **FR-BE-054**: System MUST prevent unauthorized access to contact data via ID enumeration
- **FR-BE-055**: System MUST encrypt sensitive contact data if required by business rules

### Performance Requirements

- **FR-BE-060**: System MUST respond to GET /api/contacts list requests within 500ms for typical queries
- **FR-BE-061**: System MUST respond to GET /api/contacts/:id requests within 200ms
- **FR-BE-062**: System MUST handle pagination efficiently with proper database indexing
- **FR-BE-063**: System MUST optimize queries with filters and sorting using database indexes
- **FR-BE-064**: System MUST support concurrent requests from multiple users
- **FR-BE-065**: System MUST implement database query optimization for contact list views

---

## Non-Functional Requirements

### Scalability

- **NFR-BE-001**: System MUST handle at least 10,000 contacts per account/organization
- **NFR-BE-002**: System MUST support pagination to handle large contact datasets efficiently
- **NFR-BE-003**: System MUST implement database indexing for frequently queried fields (name, account_name, assigned_user_id, date_created)

### Reliability

- **NFR-BE-002**: System MUST maintain 99.9% uptime for Contacts API endpoints
- **NFR-BE-004**: System MUST handle database connection failures gracefully
- **NFR-BE-005**: System MUST implement proper transaction handling for contact creation and updates

### Maintainability

- **NFR-BE-003**: System MUST follow project structure conventions (controller, service, repository pattern)
- **NFR-BE-006**: System MUST use TypeORM entities for database operations
- **NFR-BE-007**: System MUST implement proper error handling and logging

### Observability

- **NFR-BE-004**: System MUST log all contact creation, update, and deletion operations
- **NFR-BE-005**: System MUST log API request/response times for performance monitoring
- **NFR-BE-008**: System MUST log errors with sufficient context for debugging
- **NFR-BE-009**: System MUST track audit trail for contact changes

---

## Database Schema

### Contacts Table

**Table Name**: `contacts`

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | char(36) | NO | - | Primary key (GUID) |
| `title` | varchar(255) | YES | NULL | Contact title (Mr., Ms., Mrs., Miss, Dr., Prof.) |
| `first_name` | varchar(255) | YES | NULL | First name |
| `last_name` | varchar(255) | NO | NULL | Last name (required) |
| `office_phone` | varchar(255) | YES | NULL | Office phone number |
| `mobile` | varchar(255) | YES | NULL | Mobile phone number |
| `job_title` | varchar(255) | YES | NULL | Job title/position |
| `department` | varchar(255) | YES | NULL | Department name |
| `account_id` | char(36) | YES | NULL | FK to accounts.id |
| `assigned_user_id` | char(36) | NO | NULL | FK to users.id (defaults to current user) |
| `lead_source` | varchar(255) | YES | NULL | Lead source enum (Cold Call, Existing Customer, Self Generated, Employee, Partner, Public Relations, Direct Mail, Conference, Trade Show, Web Site, Word of mouth, Email, Campaign, Other) |
| `reports_to_id` | char(36) | YES | NULL | FK to contacts.id (self-referential) |
| `campaign_id` | char(36) | YES | NULL | FK to campaigns.id |
| `primary_address_street` | text | YES | NULL | Primary address street |
| `primary_address_city` | varchar(255) | YES | NULL | Primary address city |
| `primary_address_state` | varchar(255) | YES | NULL | Primary address state |
| `primary_address_postal_code` | varchar(255) | YES | NULL | Primary address postal code |
| `primary_address_country` | varchar(255) | YES | NULL | Primary address country |
| `alternate_address_street` | text | YES | NULL | Alternate address street |
| `alternate_address_city` | varchar(255) | YES | NULL | Alternate address city |
| `alternate_address_state` | varchar(255) | YES | NULL | Alternate address state |
| `alternate_address_postal_code` | varchar(255) | YES | NULL | Alternate address postal code |
| `alternate_address_country` | varchar(255) | YES | NULL | Alternate address country |
| `description` | text | YES | NULL | Contact description/notes |
| `date_created` | datetime | NO | CURRENT_TIMESTAMP | Creation timestamp |
| `date_modified` | datetime | NO | CURRENT_TIMESTAMP | Last modification timestamp |
| `created_by` | char(36) | NO | NULL | FK to users.id (creator) |
| `modified_user_id` | char(36) | NO | NULL | FK to users.id (last modifier) |
| `deleted` | tinyint(1) | NO | 0 | Soft delete flag (0=active, 1=deleted) |

**Primary Key**: `id` (char(36))

**Indexes**:
- Primary key on `id`
- Index on `last_name` for search operations
- Index on `account_id` for account relationship queries
- Index on `assigned_user_id` for user filtering
- Index on `deleted` for soft delete filtering
- Composite index on `(deleted, assigned_user_id)` for efficient filtered queries
- Index on `date_created` for sorting operations

**Foreign Key Constraints**:
- `account_id` → `accounts.id`
- `assigned_user_id` → `users.id`
- `reports_to_id` → `contacts.id` (self-referential)
- `campaign_id` → `campaigns.id`
- `created_by` → `users.id`
- `modified_user_id` → `users.id`

**Unique Constraints**: None (GUID ensures uniqueness)

---

### Email Addresses Table

**Table Name**: `email_addresses`

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | char(36) | NO | - | Primary key (GUID) |
| `email_address` | varchar(255) | NO | NULL | Email address (unique per system) |
| `email_address_caps` | varchar(255) | NO | NULL | Email address in uppercase (for case-insensitive searches) |
| `invalid_email` | tinyint(1) | NO | 0 | Invalid email flag (for bounce tracking) |
| `opt_out` | tinyint(1) | NO | 0 | Opt-out flag (for marketing emails) |
| `date_created` | datetime | NO | CURRENT_TIMESTAMP | Creation timestamp |
| `date_modified` | datetime | NO | CURRENT_TIMESTAMP | Last modification timestamp |
| `deleted` | tinyint(1) | NO | 0 | Soft delete flag (0=active, 1=deleted) |

**Primary Key**: `id` (char(36))

**Indexes**:
- Primary key on `id`
- Index on `email_address` for lookups
- Index on `email_address_caps` for case-insensitive searches
- Index on `deleted` for soft delete filtering

**Unique Constraints**: Email addresses are unique at the system level (enforced at application level)

---

### Email Address Bean Relationship Table

**Table Name**: `email_addr_bean_rel`

**Purpose**: Join table linking email addresses to contacts (and other modules) with relationship-specific flags.

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | char(36) | NO | - | Primary key (GUID) |
| `email_address_id` | char(36) | NO | NULL | FK to email_addresses.id |
| `bean_id` | char(36) | NO | NULL | FK to contacts.id |
| `bean_module` | varchar(100) | NO | 'Contacts' | Module name (always 'Contacts' for contacts) |
| `primary_address` | tinyint(1) | NO | 0 | Primary email flag (only one per contact can be 1) |
| `email_opt_out` | tinyint(1) | NO | 0 | Opt-out flag for marketing emails |
| `invalid_email` | tinyint(1) | NO | 0 | Invalid email flag for bounce tracking |
| `date_created` | datetime | NO | CURRENT_TIMESTAMP | Creation timestamp |
| `date_modified` | datetime | NO | CURRENT_TIMESTAMP | Last modification timestamp |
| `deleted` | tinyint(1) | NO | 0 | Soft delete flag (0=active, 1=deleted) |

**Primary Key**: `id` (char(36))

**Indexes**:
- Primary key on `id`
- Index on `email_address_id` for email lookups
- Index on `bean_id` for contact lookups
- Composite index on `(bean_id, bean_module, deleted)` for efficient relationship queries
- Composite index on `(bean_id, bean_module, primary_address, deleted)` for primary email lookups

**Foreign Key Constraints**:
- `email_address_id` → `email_addresses.id`
- `bean_id` → `contacts.id`

**Unique Constraints**:
- Business rule: Only one `primary_address = 1` per `bean_id` where `bean_module = 'Contacts'` and `deleted = 0` (enforced at application level)

---

### Contacts Audit Trail Table

**Table Name**: `contacts_audit`

**Purpose**: Tracks all field-level changes to contact records for audit and compliance purposes.

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | char(36) | NO | - | Primary key (GUID) |
| `parent_id` | char(36) | NO | NULL | FK to contacts.id |
| `field_name` | varchar(255) | NO | NULL | Name of the field that changed |
| `data_type` | varchar(255) | NO | NULL | Data type of the field (string, text, int, double, date, datetime, bool, enum) |
| `before_value_string` | varchar(255) | YES | NULL | Before value for string/text/enum fields |
| `after_value_string` | varchar(255) | YES | NULL | After value for string/text/enum fields |
| `before_value_text` | text | YES | NULL | Before value for large text fields |
| `after_value_text` | text | YES | NULL | After value for large text fields |
| `created_by` | char(36) | NO | NULL | FK to users.id (user who made the change) |
| `date_created` | datetime | NO | CURRENT_TIMESTAMP | Timestamp when change was made |

**Primary Key**: `id` (char(36))

**Indexes**:
- Primary key on `id`
- Index on `parent_id` for contact audit lookups
- Index on `date_created` for chronological sorting
- Composite index on `(parent_id, date_created)` for contact history queries

**Foreign Key Constraints**:
- `parent_id` → `contacts.id`
- `created_by` → `users.id`

**Notes**:
- Only fields that actually changed are recorded (no audit entry if value unchanged)
- Fields are stored based on data type (string fields in `before_value_string`/`after_value_string`, text fields in `before_value_text`/`after_value_text`)
- Audit entries are created for create, update, and delete operations

---

### Contact Column Preferences Table

**Table Name**: `contact_column_preferences` (or stored in generic `user_preferences` table)

**Purpose**: Stores user-specific column visibility and order preferences for Contacts list view.

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | char(36) | NO | - | Primary key (GUID) |
| `user_id` | char(36) | NO | NULL | FK to users.id |
| `module` | varchar(100) | NO | 'Contacts' | Module name |
| `column_preferences` | json | NO | NULL | JSON array of column configuration: `[{fieldName, visible, order}, ...]` |
| `date_created` | datetime | NO | CURRENT_TIMESTAMP | Creation timestamp |
| `date_modified` | datetime | NO | CURRENT_TIMESTAMP | Last modification timestamp |

**Primary Key**: `id` (char(36))

**Indexes**:
- Primary key on `id`
- Composite unique index on `(user_id, module)` to ensure one preference record per user per module

**Foreign Key Constraints**:
- `user_id` → `users.id`

**JSON Structure Example**:
```json
[
  {"fieldName": "name", "visible": true, "order": 1},
  {"fieldName": "jobTitle", "visible": true, "order": 2},
  {"fieldName": "accountName", "visible": true, "order": 3},
  {"fieldName": "email", "visible": true, "order": 4},
  {"fieldName": "officePhone", "visible": true, "order": 5},
  {"fieldName": "user", "visible": true, "order": 6},
  {"fieldName": "dateCreated", "visible": true, "order": 7}
]
```

---

### Recently Viewed Contacts Table (if persistent storage)

**Table Name**: `recently_viewed_contacts` (optional - only if persistent storage is chosen)

**Purpose**: Stores recently viewed contacts per user for quick access.

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | char(36) | NO | - | Primary key (GUID) |
| `user_id` | char(36) | NO | NULL | FK to users.id |
| `contact_id` | char(36) | NO | NULL | FK to contacts.id |
| `date_viewed` | datetime | NO | CURRENT_TIMESTAMP | Timestamp when contact was viewed |
| `view_count` | int | NO | 1 | Number of times viewed (can be incremented) |

**Primary Key**: `id` (char(36))

**Indexes**:
- Primary key on `id`
- Composite index on `(user_id, date_viewed)` for efficient retrieval of user's recent views
- Index on `contact_id` for contact lookups

**Foreign Key Constraints**:
- `user_id` → `users.id`
- `contact_id` → `contacts.id`

**Notes**: This table is optional and only needed if recently viewed contacts are stored persistently. If session-based, this table is not required.

---

## Data Models

### Contact

**Description**: Represents a contact/person in the CRM system with personal and professional information.

**Attributes**:
- `id` (string/UUID, char(36)): Unique identifier for the contact (primary key, GUID format, database type: char(36))
- `title` (string, optional): Contact title (Mr., Ms., Mrs., Miss, Dr., Prof.)
- `firstName` (string, optional): Contact's first name
- `lastName` (string, required): Contact's last name (required field)
- `officePhone` (string, optional): Office phone number
- `mobile` (string, optional): Mobile phone number
- `jobTitle` (string, optional): Job title/position
- `department` (string, optional): Department name
- `accountId` (string/UUID, char(36), optional): Foreign key to accounts.id (many-to-one relationship, database type: char(36))
- `assignedUserId` (string/UUID, char(36), required): Foreign key to users.id (many-to-one relationship, defaults to current user, database type: char(36))
- `leadSource` (enum, optional): Lead source (Cold Call, Existing Customer, Self Generated, Employee, Partner, Public Relations, Direct Mail, Conference, Trade Show, Web Site, Word of mouth, Email, Campaign, Other)
- `reportsToId` (string/UUID, char(36), optional): Foreign key to contacts.id (self-referential, many-to-one relationship, database type: char(36))
- `campaignId` (string/UUID, char(36), optional): Foreign key to campaigns.id (many-to-one relationship, database type: char(36))
- `primaryAddressStreet` (string, optional): Primary address street (single-line or multi-line)
- `primaryAddressCity` (string, optional): Primary address city
- `primaryAddressState` (string, optional): Primary address state/region
- `primaryAddressPostalCode` (string, optional): Primary address postal/zip code
- `primaryAddressCountry` (string, optional): Primary address country
- `alternateAddressStreet` (string, optional): Alternate/other address street (single-line or multi-line)
- `alternateAddressCity` (string, optional): Alternate address city
- `alternateAddressState` (string, optional): Alternate address state/region
- `alternateAddressPostalCode` (string, optional): Alternate address postal/zip code
- `alternateAddressCountry` (string, optional): Alternate address country
- `description` (text, optional): Contact description/notes
- `dateCreated` (datetime): Creation timestamp (auto-set, database type: datetime, ISO 8601 format in API)
- `dateModified` (datetime): Last modification timestamp (auto-updated, database type: datetime, ISO 8601 format in API)
- `createdBy` (string/UUID, char(36)): Foreign key to users.id (user who created the contact, database type: char(36))
- `modifiedUserId` (string/UUID, char(36)): Foreign key to users.id (user who last modified the contact, database type: char(36))
- `deleted` (boolean, tinyint(1)): Soft delete flag (0=active, 1=deleted, default: 0, database type: tinyint(1))

**Relationships**:
- Many-to-one with Account (via `accountId`)
- Many-to-one with User (via `assignedUserId` - assigned user)
- Many-to-one with User (via `createdBy` - creator)
- Many-to-one with User (via `modifiedUserId` - last modifier)
- Many-to-one with Contact (via `reportsToId` - self-referential)
- Many-to-one with Campaign (via `campaignId`)
- Many-to-many with EmailAddresses (via `email_addr_bean_rel` join table)
- One-to-many with Calls, Meetings, Tasks, Emails (via `parent_id` and `parent_type='Contacts'`)

**Validation Rules**:
- `lastName` is required and cannot be empty
- `assignedUserId` must reference valid user (defaults to current user)
- `accountId` must reference valid account if provided
- `reportsToId` must reference valid contact if provided (cannot be self-referential circular)
- `campaignId` must reference valid campaign if provided
- Email addresses must be valid format if provided
- At least one email address must be marked as primary if multiple emails exist

**Indexes**:
- Primary key on `id`
- Index on `lastName` for search
- Index on `accountId` for account relationships
- Index on `assignedUserId` for user filtering
- Index on `deleted` for soft delete filtering
- Composite index on `(deleted, assignedUserId)` for efficient filtering
- Index on `dateCreated` for sorting

**Audit Trail**:
- All fields are audited (tracked in `contacts_audit` table)
- Audit table structure:
  - `id` (char(36)): Primary key
  - `parent_id` (char(36)): Foreign key to contacts.id
  - `field_name` (varchar): Name of the field that changed
  - `data_type` (varchar): Data type of the field (string, text, int, double, date, datetime, bool)
  - `before_value_string` (varchar): Before value for string/text fields
  - `after_value_string` (varchar): After value for string/text fields
  - `before_value_text` (text): Before value for large text fields
  - `after_value_text` (text): After value for large text fields
  - `created_by` (char(36)): Foreign key to users.id (user who made the change)
  - `date_created` (datetime): Timestamp when change was made
- Changes tracked: field name, before value, after value, user who made change, timestamp
- Only fields that actually changed are recorded in audit trail

### EmailAddress (via email_addr_bean_rel)

**Description**: Represents email addresses associated with contacts through a many-to-many relationship.

**Join Table**: `email_addr_bean_rel`
- `id` (string/UUID, char(36)): Primary key (database type: char(36))
- `emailAddressId` (string/UUID, char(36)): Foreign key to email_addresses.id (database type: char(36))
- `beanId` (string/UUID, char(36)): Foreign key to contacts.id (database type: char(36))
- `beanModule` (string, varchar(100)): Module name ("Contacts", database type: varchar(100))
- `primaryAddress` (boolean, tinyint(1)): Primary email flag (only one per contact, database type: tinyint(1))
- `emailOptOut` (boolean, tinyint(1)): Opt-out flag for marketing emails (database type: tinyint(1))
- `invalidEmail` (boolean, tinyint(1)): Invalid email flag for bounce tracking (database type: tinyint(1))
- `deleted` (boolean, tinyint(1)): Soft delete flag (database type: tinyint(1))

**Validation Rules**:
- Email address must be valid format
- Only one email per contact can have `primaryAddress = true`
- Email address cannot be duplicate for same contact

### ContactColumnPreference

**Description**: Stores user preferences for column visibility and order in Contacts list view.

**Attributes**:
- `id` (string/UUID): Primary key
- `userId` (string/UUID): Foreign key to users.id
- `module` (string): Module name ("Contacts")
- `columnPreferences` (JSON): Column configuration (array of {fieldName, visible, order})
- `createdAt` (datetime): Creation timestamp
- `updatedAt` (datetime): Last update timestamp

**Relationships**:
- Many-to-one with User (via `userId`)

---

## Error Handling

### Error Scenarios

- **ERR-BE-001**: When contact not found (404), system MUST return error response: `{"error": {"code": "CONTACT_NOT_FOUND", "message": "Contact not found", "details": {}}}`
- **ERR-BE-002**: When required field validation fails (400), system MUST return field-specific error messages
- **ERR-BE-003**: When user lacks permission to access contact (403), system MUST return: `{"error": {"code": "ACCESS_DENIED", "message": "You do not have permission to access this contact", "details": {}}}`
- **ERR-BE-004**: When invalid foreign key reference (400), system MUST return: `{"error": {"code": "INVALID_REFERENCE", "message": "Invalid account/user/campaign reference", "details": {"field": "accountId"}}}`
- **ERR-BE-005**: When vCard file format is invalid (400), system MUST return: `{"error": {"code": "INVALID_VCARD_FORMAT", "message": "Invalid vCard file format. Only .vcf and .vcard files are supported", "details": {}}}`
- **ERR-BE-006**: When vCard parsing fails (400), system MUST return: `{"error": {"code": "VCARD_PARSE_ERROR", "message": "Failed to parse vCard file", "details": {"reason": "..."}}}`
- **ERR-BE-007**: When bulk import file format is invalid (400), system MUST return file format error
- **ERR-BE-008**: When bulk import validation fails for rows (400), system MUST return detailed row-level errors
- **ERR-BE-009**: When database operation fails (500), system MUST return generic error without exposing internal details
- **ERR-BE-010**: When multiple primary emails are provided (400), system MUST return: `{"error": {"code": "MULTIPLE_PRIMARY_EMAILS", "message": "Only one email address can be marked as primary", "details": {}}}`

### Error Response Format

System MUST use JSON-API error format:

```json
{
  "errors": [
    {
      "status": "400",
      "code": "VALIDATION_ERROR",
      "title": "Validation Error",
      "detail": "Field 'lastName' is required",
      "source": {
        "pointer": "/data/attributes/lastName"
      }
    }
  ]
}
```

**Error Response Fields**:
- `status` (string): HTTP status code as string
- `code` (string): Machine-readable error code (e.g., "VALIDATION_ERROR", "CONTACT_NOT_FOUND", "ACCESS_DENIED")
- `title` (string): Short, human-readable summary of the error
- `detail` (string): Detailed, human-readable explanation
- `source` (object, optional): Object containing references to the source of the error
  - `pointer` (string): JSON Pointer to the problematic field (RFC 6901)

---

## Success Criteria

- **SC-BE-001**: All API endpoints respond within specified performance requirements (list: 500ms, detail: 200ms)
- **SC-BE-002**: System handles 1000 concurrent contact list requests without degradation
- **SC-BE-003**: All functional requirements are implemented and tested
- **SC-BE-004**: Contact CRUD operations maintain 99.9% success rate
- **SC-BE-005**: vCard import successfully processes valid vCard files with 100% accuracy
- **SC-BE-006**: Bulk import processes 1000+ contacts within 60 seconds
- **SC-BE-007**: All security requirements are implemented and validated
- **SC-BE-008**: Audit trail captures 100% of contact modifications

---

## Notes

- Reference `product-info/product-overview.md` for system roles and common functionalities
- Reference `specs/contacts/backend-specs.md` for technical implementation details
- Reference `requirements/contacts/frontend-requirements.md` for frontend integration requirements
- Mark unclear requirements with `[NEEDS CLARIFICATION: description]`
- Contact entity follows SuiteCRM 8.9.1 schema patterns but adapted for modern NestJS/TypeORM implementation
- Email address management uses join table pattern from legacy system
- Soft delete pattern ensures data preservation and audit trail integrity
- **Database Conventions**: 
  - GUIDs stored as `char(36)` in database
  - Boolean fields stored as `tinyint(1)` (0 = false, 1 = true)
  - Timestamps stored as `datetime` type
  - All foreign keys are `char(36)` referencing GUID primary keys
- **API Conventions**:
  - All API responses use JSON-API format
  - Datetime values use ISO 8601 format in API responses
  - Error responses follow JSON-API error format with proper status codes
  - Pagination uses `page[offset]` and `page[limit]` query parameters

