# Backend Requirements - Opportunity Module

**Module**: Opportunity  
**Created**: 2025-12-13  
**Status**: Draft  
**Derived From**: `product-info/product-overview.md`

## Overview

The Opportunity module provides backend services for managing sales opportunities in the CRM system. This module handles CRUD operations for opportunities, bulk import/export functionality, duplicate detection, relationship management with related entities (Contacts, Activities, Documents, Quotes, etc.), and data aggregation for reporting and analytics.

**System Roles Used:**
- **Admin**: Can manage all opportunities across the organization, perform bulk operations, and access all opportunity data
- **Employee**: Can manage opportunities assigned to them, view opportunities based on permissions, and perform operations on accessible opportunities
- **All Users**: Must be authenticated to access opportunity APIs

**Common Functionalities Used:**
- **Authentication & Authorization**: All opportunity endpoints require JWT authentication (from product-overview.md)
- **Login**: Users must be authenticated before accessing opportunity features
- **Session Management**: Opportunity APIs use user session to determine access permissions and data visibility

**Dependencies:**
- Authentication module (for user validation and role information)
- Account module (for account relationships)
- Contact module (for contact relationships)
- User/Employee module (for assigned user information)
- Activity module (for related activities)
- Document module (for related documents)
- Campaign module (for campaign associations)

**Integration Points:**
- Provides RESTful API endpoints for opportunity CRUD operations
- Provides bulk import/export APIs
- Integrates with Account module for account relationships
- Integrates with Contact module for contact relationships
- Integrates with Activity module for activity tracking
- Integrates with authentication system for user validation
- Integrates with authorization system for role-based access control

---

## Functional Requirements

### Authentication & Authorization

- **FR-BE-001**: System MUST authenticate all opportunity API requests
  - **Method**: JWT token validation via Authorization header
  - **Validation**: Verify token signature, expiration, and user existence
  - **Response**: Return 401 Unauthorized if authentication fails

- **FR-BE-002**: System MUST authorize opportunity API requests based on user role
  - **Admin**: Can access all opportunity endpoints and perform all operations on all opportunities
  - **Employee**: Can access opportunity endpoints but view/modify only opportunities assigned to them or within their permission scope
  - **Access Control**: Verify user permissions before allowing create, update, delete operations

### API Endpoints

#### Opportunity CRUD Operations

- **FR-BE-010**: System MUST provide endpoint to create a new opportunity
  - **Method**: POST
  - **Path**: `/api/opportunities`
  - **Request**: 
    ```json
    {
      "name": "string (required)",
      "amount": "number (required)",
      "currency": "string",
      "salesStage": "string (required)",
      "probability": "number",
      "nextStep": "string",
      "description": "string",
      "accountId": "string (required)",
      "expectedCloseDate": "date (required, format: yyyy-mm-dd)",
      "type": "string",
      "leadSource": "string",
      "campaignId": "string",
      "assignedToId": "string"
    }
    ```
  - **Response**: Created opportunity object with auto-generated fields (id, dateCreated, dateModified)
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee
  - **Validation**: All required fields must be provided and valid

- **FR-BE-011**: System MUST provide endpoint to retrieve list of opportunities
  - **Method**: GET
  - **Path**: `/api/opportunities`
  - **Query Parameters**:
    - `page` (number): Page number for pagination (default: 1)
    - `limit` (number): Number of records per page (default: 20, max: 100)
    - `sortBy` (string): Column to sort by (e.g., "name", "amount", "salesStage", "closeDate", "assignedTo")
    - `sortOrder` (string): Sort direction - "asc", "desc", or "none" (default: "none")
    - `filters` (object): Filter criteria (opportunity name, account name, sales stage, amount, assigned to, lead source, close date, next step)
    - `search` (string): Quick search term for name field
  - **Response**: Paginated list of opportunities with metadata (total count, current page, total pages)
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee (with data filtering based on permissions)

- **FR-BE-012**: System MUST provide endpoint to retrieve a single opportunity by ID
  - **Method**: GET
  - **Path**: `/api/opportunities/:id`
  - **Response**: Complete opportunity object with all fields and relationships
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee (with permission check)

- **FR-BE-013**: System MUST provide endpoint to update an opportunity
  - **Method**: PUT or PATCH
  - **Path**: `/api/opportunities/:id`
  - **Request**: Opportunity update object (same structure as create, all fields optional)
  - **Response**: Updated opportunity object
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee (with permission check)
  - **Validation**: Required fields must remain valid if provided

- **FR-BE-014**: System MUST provide endpoint to delete an opportunity
  - **Method**: DELETE
  - **Path**: `/api/opportunities/:id`
  - **Response**: Success confirmation
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee (with permission check)
  - **Validation**: Check for related records before allowing deletion

#### Bulk Operations

- **FR-BE-015**: System MUST provide endpoint for bulk delete operations
  - **Method**: DELETE
  - **Path**: `/api/opportunities/bulk`
  - **Request**: Array of opportunity IDs
  - **Response**: Success confirmation with count of deleted records
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee (with permission check on each record)

- **FR-BE-016**: System MUST provide endpoint for bulk export operations
  - **Method**: POST
  - **Path**: `/api/opportunities/export`
  - **Request**: 
    ```json
    {
      "opportunityIds": "array of strings (optional - if empty, exports all accessible)",
      "format": "string (csv, excel, pdf)",
      "columns": "array of strings (optional - specifies which columns to export)"
    }
    ```
  - **Response**: Export file download (format depends on requested format)
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee

- **FR-BE-017**: System MUST provide endpoint for bulk merge operations
  - **Method**: POST
  - **Path**: `/api/opportunities/merge`
  - **Request**: 
    ```json
    {
      "sourceOpportunityIds": "array of strings",
      "targetOpportunityId": "string",
      "mergeStrategy": "object (specifies which fields to keep from which opportunity)"
    }
    ```
  - **Response**: Merged opportunity object
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee (with permission check)
  - **Validation**: All source and target opportunities must exist and be accessible

- **FR-BE-018**: System MUST provide endpoint for mass update operations
  - **Method**: PATCH
  - **Path**: `/api/opportunities/mass-update`
  - **Request**: 
    ```json
    {
      "opportunityIds": "array of strings",
      "updates": "object (fields to update with new values)"
    }
    ```
  - **Response**: Success confirmation with count of updated records
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee (with permission check on each record)

#### Import Operations

- **FR-BE-019**: System MUST provide endpoint to upload import file
  - **Method**: POST
  - **Path**: `/api/opportunities/import/upload`
  - **Request**: Multipart form data with file
  - **Response**: File upload confirmation with file metadata
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee
  - **Validation**: File format validation, filename validation (alphanumeric plus ',', '`', '_')

- **FR-BE-020**: System MUST provide endpoint to analyze import file properties
  - **Method**: POST
  - **Path**: `/api/opportunities/import/analyze`
  - **Request**: File ID or file data
  - **Response**: Detected file properties (delimiter, encoding, header row, column structure, data preview)
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee

- **FR-BE-021**: System MUST provide endpoint to confirm/modify import file properties
  - **Method**: POST
  - **Path**: `/api/opportunities/import/properties`
  - **Request**: 
    ```json
    {
      "fileId": "string",
      "properties": {
        "delimiter": "string",
        "encoding": "string",
        "hasHeaderRow": "boolean",
        "textQualifier": "string",
        "dateFormat": "string",
        "source": "string (none, salesforce, outlook)"
      }
    }
    ```
  - **Response**: Updated file properties and refreshed data preview
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee

- **FR-BE-022**: System MUST provide endpoint to map import file columns to opportunity fields
  - **Method**: POST
  - **Path**: `/api/opportunities/import/map-fields`
  - **Request**: 
    ```json
    {
      "fileId": "string",
      "mappings": [
        {
          "fileColumn": "string",
          "moduleField": "string",
          "defaultValue": "any (optional)"
        }
      ]
    }
    ```
  - **Response**: Field mappings confirmation
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee
  - **Validation**: All required fields must be mapped

- **FR-BE-023**: System MUST provide endpoint to configure duplicate check fields
  - **Method**: POST
  - **Path**: `/api/opportunities/import/duplicate-check`
  - **Request**: 
    ```json
    {
      "fileId": "string",
      "fieldsToCheck": "array of strings (field names to use for duplicate checking)"
    }
    ```
  - **Response**: Duplicate check configuration confirmation
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee

- **FR-BE-024**: System MUST provide endpoint to execute import
  - **Method**: POST
  - **Path**: `/api/opportunities/import/execute`
  - **Request**: 
    ```json
    {
      "fileId": "string",
      "importBehavior": "string (create-only, create-and-update)",
      "saveSettings": "boolean",
      "settingsName": "string (optional)"
    }
    ```
  - **Response**: Import results with counts (created, updated, errors, duplicates)
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee
  - **Processing**: 
    - Validates all rows
    - Performs duplicate checks on specified fields
    - Creates new records or updates existing based on import behavior
    - Returns detailed results

- **FR-BE-025**: System MUST provide endpoint to retrieve import results
  - **Method**: GET
  - **Path**: `/api/opportunities/import/results/:importId`
  - **Response**: Import results including created records, errors, duplicates with details
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee

- **FR-BE-026**: System MUST provide endpoint to undo import operation
  - **Method**: POST
  - **Path**: `/api/opportunities/import/undo/:importId`
  - **Response**: Success confirmation
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee
  - **Behavior**: Deletes all records created during the specified import operation

- **FR-BE-027**: System MUST provide endpoint to download import template
  - **Method**: GET
  - **Path**: `/api/opportunities/import/template`
  - **Query Parameters**: `format` (csv, excel)
  - **Response**: Template file download with column headers
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee

#### Lookup Endpoints

- **FR-BE-027**: System MUST provide endpoint for user lookup
  - **Method**: GET
  - **Path**: `/api/users/lookup` or `/api/users`
  - **Query Parameters**:
    - `page` (number): Page number for pagination (default: 1)
    - `limit` (number): Number of records per page (default: 20)
    - `sortBy` (string): Column to sort by (e.g., "name", "username", "jobTitle")
    - `sortOrder` (string): Sort direction - "asc" or "desc" (default: "asc")
    - `search` (string): Search query for filtering users by name, username, email
  - **Response**: Paginated list of users with fields: id, name, username, jobTitle, department, email, phone
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee
  - **Usage**: Used for "Assigned To" lookup modal

- **FR-BE-028**: System MUST provide endpoint for account lookup
  - **Method**: GET
  - **Path**: `/api/accounts/lookup` or `/api/accounts`
  - **Query Parameters**:
    - `page` (number): Page number for pagination (default: 1)
    - `limit` (number): Number of records per page (default: 20)
    - `sortBy` (string): Column to sort by (e.g., "name")
    - `sortOrder` (string): Sort direction - "asc" or "desc" (default: "asc")
    - `search` (string): Search query for filtering accounts by name
  - **Response**: Paginated list of accounts with relevant fields
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee
  - **Usage**: Used for "Account Name" lookup modal

- **FR-BE-029**: System MUST provide endpoint for campaign lookup
  - **Method**: GET
  - **Path**: `/api/campaigns/lookup` or `/api/campaigns`
  - **Query Parameters**:
    - `page` (number): Page number for pagination (default: 1)
    - `limit` (number): Number of records per page (default: 20)
    - `sortBy` (string): Column to sort by (e.g., "name")
    - `sortOrder` (string): Sort direction - "asc" or "desc" (default: "asc")
    - `search` (string): Search query for filtering campaigns by name
  - **Response**: Paginated list of campaigns with relevant fields
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee
  - **Usage**: Used for "Campaign" lookup modal

#### Relationship Management

- **FR-BE-030**: System MUST provide endpoint to retrieve related records for an opportunity
  - **Method**: GET
  - **Path**: `/api/opportunities/:id/relationships/:relationshipType`
  - **Path Parameters**: 
    - `id`: Opportunity ID
    - `relationshipType`: Type of relationship (activities, contacts, documents, quotes, projects, contracts, leads, history, security-groups)
  - **Query Parameters**: Pagination parameters (page, limit)
  - **Response**: Paginated list of related records
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee (with permission check)

- **FR-BE-031**: System MUST provide endpoint to link a related record to an opportunity
  - **Method**: POST
  - **Path**: `/api/opportunities/:id/relationships/:relationshipType`
  - **Request**: Related record ID and relationship metadata (e.g., role for contacts)
  - **Response**: Link confirmation
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee

- **FR-BE-032**: System MUST provide endpoint to unlink a related record from an opportunity
  - **Method**: DELETE
  - **Path**: `/api/opportunities/:id/relationships/:relationshipType/:relatedRecordId`
  - **Response**: Unlink confirmation
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee

#### Analytics and Reporting

- **FR-BE-033**: System MUST provide endpoint to retrieve pipeline data by sales stage
  - **Method**: GET
  - **Path**: `/api/opportunities/analytics/pipeline-by-sales-stage`
  - **Query Parameters**: Filters (date range, assigned to, etc.)
  - **Response**: Aggregated amounts by sales stage with metadata
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee (with data filtering based on permissions)

- **FR-BE-034**: System MUST provide endpoint to retrieve opportunity insights
  - **Method**: GET
  - **Path**: `/api/opportunities/:id/insights`
  - **Response**: Insights including days at current sales stage and other metrics
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee

- **FR-BE-035**: System MUST provide endpoint to retrieve recently viewed opportunities for a user
  - **Method**: GET
  - **Path**: `/api/opportunities/recently-viewed`
  - **Query Parameters**: `limit` (number, default: 10)
  - **Response**: List of recently viewed opportunities with view timestamps
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee
  - **Behavior**: Returns opportunities viewed by the current user, ordered by most recent

#### Column Customization

- **FR-BE-036**: System MUST provide endpoint to save user's column preferences
  - **Method**: POST
  - **Path**: `/api/opportunities/columns/preferences`
  - **Request**: 
    ```json
    {
      "displayedColumns": "array of strings",
      "columnOrder": "array of strings"
    }
    ```
  - **Response**: Saved preferences confirmation
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee
  - **Storage**: Preferences saved per user

- **FR-BE-037**: System MUST provide endpoint to retrieve user's column preferences
  - **Method**: GET
  - **Path**: `/api/opportunities/columns/preferences`
  - **Response**: User's saved column preferences
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee

#### Filter Management

- **FR-BE-038**: System MUST provide endpoint to save filter configuration
  - **Method**: POST
  - **Path**: `/api/opportunities/filters/save`
  - **Request**: 
    ```json
    {
      "filterName": "string",
      "filterCriteria": "object",
      "quickFilters": "object (myItems, openItems, myFavorites)"
    }
    ```
  - **Response**: Saved filter confirmation
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee

- **FR-BE-039**: System MUST provide endpoint to retrieve saved filters
  - **Method**: GET
  - **Path**: `/api/opportunities/filters/saved`
  - **Response**: List of saved filter configurations for the user
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee

- **FR-BE-040**: System MUST provide endpoint to apply a saved filter
  - **Method**: POST
  - **Path**: `/api/opportunities/filters/apply/:filterId`
  - **Response**: Filtered opportunity list
  - **Auth Required**: Yes
  - **Roles**: Admin, Employee

### Data Management

- **FR-BE-041**: System MUST store opportunity records with all required fields
  - **Required Fields**: name, amount, salesStage, accountId, expectedCloseDate
  - **Optional Fields**: probability, nextStep, description, type, leadSource, campaignId, assignedToId
  - **Auto-Generated Fields**: id, dateCreated, dateModified, createdBy, modifiedBy

- **FR-BE-042**: System MUST validate opportunity data before persistence
  - **Name**: Required, string, max length validation
  - **Amount**: Required, number, must be >= 0, currency format validation
  - **Sales Stage**: Required, must be valid sales stage value from predefined list
  - **Account ID**: Required, must reference existing account
  - **Expected Close Date**: Required, valid date format (yyyy-mm-dd), must be valid date
  - **Probability**: Optional, number between 0 and 100 if provided
  - **Currency**: Optional, valid currency code if provided
  - **Type**: Optional, must be valid type value if provided
  - **Lead Source**: Optional, must be valid lead source value if provided
  - **Assigned To ID**: Optional, must reference existing user if provided

- **FR-BE-043**: System MUST retrieve opportunities with pagination support
  - Default page size: 20 records
  - Maximum page size: 100 records
  - Pagination metadata included in response (total count, current page, total pages)

- **FR-BE-044**: System MUST support sorting opportunities by multiple columns
  - Sortable columns: name, accountName, salesStage, amount, expectedCloseDate, assignedTo, dateCreated
  - Sort directions: ascending, descending, none (default/unsorted)
  - Three-state cycle: descending → ascending → none

- **FR-BE-045**: System MUST support filtering opportunities by multiple criteria
  - Filterable fields: name, accountName, amount (with operators), salesStage, assignedTo, leadSource, expectedCloseDate (with operators), nextStep
  - Quick filters: My Items (assigned to current user), Open Items (exclude closed), My Favorites
  - Filter logic: Multiple filters combined with AND logic
  - Filter state persists until explicitly cleared

- **FR-BE-046**: System MUST update dateModified and modifiedBy fields on every update
  - DateModified: Current timestamp
  - ModifiedBy: ID of user performing the update
  - Automatic update, not user-editable

- **FR-BE-047**: System MUST auto-populate dateCreated, createdBy, dateModified, modifiedBy on creation
  - DateCreated: Current timestamp
  - CreatedBy: ID of user creating the record
  - DateModified: Same as DateCreated on creation
  - ModifiedBy: Same as CreatedBy on creation

### Business Logic

- **FR-BE-050**: System MUST enforce required field validation
  - Required fields: Opportunity Name, Opportunity Amount, Sales Stage, Account Name, Expected Close Date
  - Validation occurs before record creation or update
  - Returns validation errors if required fields are missing

- **FR-BE-051**: System MUST validate dropdown field values against predefined lists
  - Sales Stage: Must be one of: Prospecting, Qualification, Needs Analysis, Value Proposition, Identifying Decision Makers, Perception Analysis, Proposal/Price Quote, Negotiation/Review, Closed Won, Closed Lost
  - Type: Must be valid type from predefined list (if provided)
  - Lead Source: Must be valid lead source from predefined list (if provided)
  - Returns validation error if invalid value provided

- **FR-BE-052**: System MUST validate lookup field references
  - Account ID: Must reference existing account record
  - Assigned To ID: Must reference existing user record
  - Campaign ID: Must reference existing campaign record (if provided)
  - Returns validation error if referenced record does not exist

- **FR-BE-053**: System MUST perform duplicate checking during import based on configured fields
  - Compares values in specified fields against existing opportunity records
  - Identifies matching records and flags them as duplicates
  - Returns duplicate information in import results

- **FR-BE-054**: System MUST support import behavior modes
  - **Create Only**: Creates new records, skips rows matching existing records
  - **Create and Update**: Creates new records for non-matching rows, updates existing records for matching rows
  - Matching logic based on duplicate check configuration

- **FR-BE-055**: System MUST calculate and update days at current sales stage
  - Calculates duration opportunity has been in current sales stage
  - Updates automatically when sales stage changes
  - Stored or calculated on-the-fly for insights display

- **FR-BE-056**: System MUST track recently viewed opportunities per user
  - Records timestamp when user views an opportunity detail page
  - Stores user-opportunity view associations
  - Limits to most recent N views (configurable, default: 10)
  - Used for "Recently Viewed" feature

- **FR-BE-057**: System MUST handle opportunity deletion with relationship checks
  - Check for related records (contacts, activities, documents, quotes, etc.)
  - Warn or prevent deletion if critical relationships exist (business rule dependent)
  - Handle cascade deletion or relationship cleanup if configured

- **FR-BE-058**: System MUST support opportunity merge operations
  - Combine multiple opportunities into a single target opportunity
  - Merge strategy specifies which fields to keep from which source
  - Transfer all relationships from source opportunities to target
  - Delete source opportunities after successful merge

### Integration Requirements

- **FR-BE-060**: System MUST integrate with Account module for account relationships
  - Validate account references
  - Retrieve account information for opportunities
  - Maintain referential integrity

- **FR-BE-061**: System MUST integrate with Contact module for contact relationships
  - Support linking/unlinking contacts to opportunities
  - Store contact role information (e.g., Technical Decision Maker, Business Evaluator, Primary Decision Maker)
  - Retrieve related contacts for an opportunity

- **FR-BE-062**: System MUST integrate with Activity module for activity tracking
  - Support linking activities (calls, meetings, tasks, emails) to opportunities
  - Retrieve related activities for timeline display
  - Track activity history

- **FR-BE-063**: System MUST integrate with Document module for document relationships
  - Support linking documents to opportunities
  - Retrieve related documents

- **FR-BE-064**: System MUST integrate with Quote module for quote relationships
  - Support linking quotes to opportunities
  - Retrieve related quotes

### Security Requirements

- **FR-BE-070**: System MUST validate all input data to prevent injection attacks
  - Sanitize text inputs
  - Validate data types and formats
  - Prevent SQL injection through parameterized queries

- **FR-BE-071**: System MUST implement authorization checks for all operations
  - Verify user has permission to view/modify specific opportunities
  - Filter data based on user role and assignments
  - Prevent unauthorized access to opportunities

- **FR-BE-072**: System MUST validate file uploads for import operations
  - Validate file type and format
  - Validate filename format (alphanumeric plus ',', '`', '_')
  - Enforce file size limits
  - Scan for malicious content

- **FR-BE-073**: System MUST track audit trail for opportunity changes
  - Log all create, update, delete operations
  - Store user ID and timestamp for each change
  - Maintain history for compliance and troubleshooting

### Performance Requirements

- **FR-BE-080**: System MUST respond to opportunity list API requests within 500ms for typical queries
  - Optimize database queries with proper indexes
  - Implement pagination to limit result sets
  - Cache frequently accessed data where appropriate

- **FR-BE-081**: System MUST handle import operations efficiently
  - Support batch processing for large files
  - Process imports asynchronously if file size exceeds threshold
  - Provide progress updates for long-running imports

- **FR-BE-082**: System MUST optimize duplicate checking performance
  - Use database indexes on fields used for duplicate checking
  - Implement efficient matching algorithms
  - Cache duplicate check results where possible

---

## Non-Functional Requirements

### Scalability

- **NFR-BE-001**: System MUST handle increasing number of opportunity records without performance degradation
  - Support database indexing strategies
  - Implement efficient pagination
  - Optimize query performance

- **NFR-BE-002**: System MUST support concurrent import operations from multiple users
  - Isolate import operations per user
  - Prevent resource conflicts
  - Queue large imports if necessary

### Reliability

- **NFR-BE-003**: System MUST maintain data integrity during bulk operations
  - Use database transactions for multi-record operations
  - Implement rollback mechanisms for failed bulk operations
  - Validate data before batch processing

- **NFR-BE-004**: System MUST handle import file processing errors gracefully
  - Continue processing remaining rows if one row fails
  - Return detailed error information for failed rows
  - Provide ability to retry failed imports

### Maintainability

- **NFR-BE-005**: System MUST follow project structure conventions
  - Organize code according to established patterns
  - Use consistent naming conventions
  - Follow repository and service layer patterns

### Observability

- **NFR-BE-006**: System MUST log all opportunity operations
  - Log create, update, delete operations with user and timestamp
  - Log import/export operations with details
  - Log errors with sufficient context for debugging

- **NFR-BE-007**: System MUST track import operation metrics
  - Record import execution time
  - Track success/failure rates
  - Monitor import file sizes and processing times

---

## Data Models

### Opportunity

**Description**: Represents a sales opportunity in the CRM system.

**Attributes**:
- `id` (string/UUID): Unique identifier for the opportunity (primary key)
- `name` (string): Opportunity name/identifier
  - **Constraints**: Required, max 255 characters
- `amount` (decimal): Monetary value of the opportunity
  - **Constraints**: Required, must be >= 0, precision for currency
- `currency` (string): Currency code (e.g., "USD", "EUR")
  - **Constraints**: Optional, valid currency code if provided
- `salesStage` (enum): Current stage in sales pipeline
  - **Constraints**: Required, must be valid sales stage value
  - **Values**: Prospecting, Qualification, Needs Analysis, Value Proposition, Identifying Decision Makers, Perception Analysis, Proposal/Price Quote, Negotiation/Review, Closed Won, Closed Lost
- `probability` (integer): Win probability percentage
  - **Constraints**: Optional, 0-100 if provided
- `nextStep` (string): Next action/step in sales process
  - **Constraints**: Optional, max 500 characters
- `description` (text): Detailed description of the opportunity
  - **Constraints**: Optional, unlimited length
- `accountId` (string/UUID): Reference to associated account
  - **Constraints**: Required, foreign key to Account entity
- `expectedCloseDate` (date): Projected date for closing the opportunity
  - **Constraints**: Required, valid date format
- `type` (string): Opportunity type classification
  - **Constraints**: Optional, must be valid type value if provided
- `leadSource` (string): Source of the lead that became the opportunity
  - **Constraints**: Optional, must be valid lead source value if provided
- `campaignId` (string/UUID): Reference to associated marketing campaign
  - **Constraints**: Optional, foreign key to Campaign entity
- `assignedToId` (string/UUID): Reference to assigned user
  - **Constraints**: Optional, foreign key to User entity
- `dateCreated` (datetime): Creation timestamp
  - **Constraints**: Auto-generated, not user-editable
- `dateModified` (datetime): Last modification timestamp
  - **Constraints**: Auto-updated on every change, not user-editable
- `createdBy` (string/UUID): ID of user who created the record
  - **Constraints**: Auto-populated, foreign key to User entity
- `modifiedBy` (string/UUID): ID of user who last modified the record
  - **Constraints**: Auto-updated, foreign key to User entity
- `isDeleted` (boolean): Soft delete flag
  - **Constraints**: Default false, used for soft deletion

**Relationships**:
- One opportunity belongs to one account (accountId)
- One opportunity can be assigned to one user (assignedToId)
- One opportunity can have one campaign (campaignId, optional)
- One opportunity can have many contacts (many-to-many with role)
- One opportunity can have many activities (one-to-many)
- One opportunity can have many documents (many-to-many)
- One opportunity can have many quotes (one-to-many)
- One opportunity can have many projects (one-to-many)
- One opportunity can have many contracts (one-to-many)
- One opportunity can have many leads (many-to-many)

**Validation Rules**:
- Name is required and must be unique per account (or globally, based on business rules)
- Amount must be positive number
- Sales Stage must be valid enum value
- Expected Close Date must be valid future or past date
- Account ID must reference existing account
- Assigned To ID must reference existing user if provided
- Campaign ID must reference existing campaign if provided

**Indexes**:
- Primary key on `id`
- Index on `accountId` for account relationship queries
- Index on `assignedToId` for user assignment queries
- Index on `salesStage` for filtering and analytics
- Index on `expectedCloseDate` for date-based queries
- Index on `dateCreated` for sorting and filtering
- Composite index on `accountId` and `salesStage` for common queries
- Composite index on `assignedToId` and `salesStage` for user-specific queries

### OpportunityContact

**Description**: Represents the relationship between opportunities and contacts with role information.

**Attributes**:
- `id` (string/UUID): Unique identifier (primary key)
- `opportunityId` (string/UUID): Reference to opportunity (foreign key)
- `contactId` (string/UUID): Reference to contact (foreign key)
- `role` (string): Contact's role in relation to opportunity (e.g., "Technical Decision Maker", "Business Evaluator", "Primary Decision Maker")
  - **Constraints**: Optional, max 100 characters
- `dateCreated` (datetime): Relationship creation timestamp

**Relationships**:
- Many-to-many relationship between Opportunity and Contact
- One opportunity can have many contacts
- One contact can be related to many opportunities

**Validation Rules**:
- Opportunity ID must reference existing opportunity
- Contact ID must reference existing contact
- Unique constraint on opportunityId + contactId combination

### RecentlyViewedOpportunity

**Description**: Tracks which opportunities a user has recently viewed for quick access.

**Attributes**:
- `id` (string/UUID): Unique identifier (primary key)
- `userId` (string/UUID): Reference to user (foreign key)
- `opportunityId` (string/UUID): Reference to opportunity (foreign key)
- `viewedAt` (datetime): Timestamp when opportunity was viewed
- `viewCount` (integer): Number of times viewed (optional, for analytics)

**Relationships**:
- Many-to-one relationship with User
- Many-to-one relationship with Opportunity

**Validation Rules**:
- User ID must reference existing user
- Opportunity ID must reference existing opportunity
- Viewed At is required and auto-populated

**Indexes**:
- Composite index on `userId` and `viewedAt` for efficient retrieval of recent views
- Index on `opportunityId` for opportunity-based queries

### ImportJob

**Description**: Tracks import operations and their status.

**Attributes**:
- `id` (string/UUID): Unique identifier (primary key)
- `userId` (string/UUID): Reference to user who performed import (foreign key)
- `fileName` (string): Name of imported file
- `fileSize` (integer): Size of file in bytes
- `fileFormat` (string): File format (csv, excel, etc.)
- `status` (enum): Import status (pending, processing, completed, failed, cancelled)
- `importBehavior` (enum): Import mode (create-only, create-and-update)
- `totalRows` (integer): Total number of rows in file
- `processedRows` (integer): Number of rows processed
- `createdCount` (integer): Number of records created
- `updatedCount` (integer): Number of records updated
- `errorCount` (integer): Number of rows with errors
- `duplicateCount` (integer): Number of duplicate rows found
- `settings` (json): Saved import settings (file properties, field mappings, duplicate check config)
- `startedAt` (datetime): Import start timestamp
- `completedAt` (datetime): Import completion timestamp
- `errorMessage` (text): Error details if import failed

**Relationships**:
- One import job belongs to one user
- One import job can have many import results (one-to-many)

**Validation Rules**:
- User ID must reference existing user
- Status must be valid enum value
- Import behavior must be valid enum value

### ImportResult

**Description**: Stores detailed results for each row in an import operation.

**Attributes**:
- `id` (string/UUID): Unique identifier (primary key)
- `importJobId` (string/UUID): Reference to import job (foreign key)
- `rowNumber` (integer): Row number in import file
- `status` (enum): Row status (success, error, duplicate, skipped)
- `opportunityId` (string/UUID): ID of created/updated opportunity (if successful)
- `data` (json): Original row data from import file
- `errors` (json): Error details if row failed
- `duplicateInfo` (json): Duplicate match information if duplicate found

**Relationships**:
- Many-to-one relationship with ImportJob
- One-to-one relationship with Opportunity (if successfully imported)

**Validation Rules**:
- Import Job ID must reference existing import job
- Row Number must be positive integer
- Status must be valid enum value

---

## Error Handling

### Error Scenarios

- **ERR-BE-001**: When opportunity creation fails due to missing required fields, system MUST return validation error with field-specific messages
  - **HTTP Status**: 400 Bad Request
  - **Error Response**: 
    ```json
    {
      "error": {
        "code": "VALIDATION_ERROR",
        "message": "Required fields are missing",
        "details": {
          "name": "Opportunity name is required",
          "amount": "Opportunity amount is required"
        }
      }
    }
    ```

- **ERR-BE-002**: When opportunity not found, system MUST return 404 Not Found
  - **HTTP Status**: 404 Not Found
  - **Error Response**: 
    ```json
    {
      "error": {
        "code": "OPPORTUNITY_NOT_FOUND",
        "message": "Opportunity with ID {id} not found"
      }
    }
    ```

- **ERR-BE-003**: When user lacks permission to access/modify opportunity, system MUST return 403 Forbidden
  - **HTTP Status**: 403 Forbidden
  - **Error Response**: 
    ```json
    {
      "error": {
        "code": "PERMISSION_DENIED",
        "message": "You do not have permission to access this opportunity"
      }
    }
    ```

- **ERR-BE-004**: When account reference is invalid, system MUST return validation error
  - **HTTP Status**: 400 Bad Request
  - **Error Response**: 
    ```json
    {
      "error": {
        "code": "INVALID_ACCOUNT",
        "message": "Account with ID {accountId} does not exist"
      }
    }
    ```

- **ERR-BE-005**: When import file is invalid or unsupported format, system MUST return error
  - **HTTP Status**: 400 Bad Request
  - **Error Response**: 
    ```json
    {
      "error": {
        "code": "INVALID_IMPORT_FILE",
        "message": "File format is not supported or file is corrupted"
      }
    }
    ```

- **ERR-BE-006**: When import operation fails, system MUST return error with details of failed rows
  - **HTTP Status**: 500 Internal Server Error (for complete failure) or 207 Multi-Status (for partial success)
  - **Error Response**: Includes error count and details for each failed row

- **ERR-BE-007**: When duplicate check finds matches during import, system MUST include duplicate information in results (not an error, informational)
  - **Response**: Import results include duplicate records with matching opportunity IDs

- **ERR-BE-008**: When bulk operation fails on some records, system MUST return partial success with details
  - **HTTP Status**: 207 Multi-Status
  - **Response**: Includes success count and error details for failed records

### Error Response Format

All error responses follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

---

## Success Criteria

- **SC-BE-001**: All opportunity CRUD API endpoints respond within 500ms for typical requests
- **SC-BE-002**: System handles import files up to 10MB with processing time under 30 seconds
- **SC-BE-003**: All functional requirements are implemented and tested
- **SC-BE-004**: Duplicate checking completes within 2 seconds for imports with 1000 rows
- **SC-BE-005**: Bulk operations (delete, update, export) complete successfully for up to 1000 records
- **SC-BE-006**: All validation rules are enforced and return appropriate error messages
- **SC-BE-007**: Data integrity is maintained across all operations (no orphaned records, referential integrity preserved)

---

## Notes

- Reference `product-info/product-overview.md` for system roles and common functionalities
- Reference `specs/opportunity/backend-specs.md` for technical implementation details
- Mark unclear requirements with `[NEEDS CLARIFICATION: description]`
- All timestamps should be stored in UTC format
- Currency amounts should be stored with appropriate precision for financial calculations
- Consider implementing soft delete for opportunities to maintain audit trail


