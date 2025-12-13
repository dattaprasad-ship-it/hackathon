# Backend Requirements - Leads Module

**Module**: Leads  
**Created**: 2025-01-XX  
**Status**: Draft  
**Derived From**: `requirements/Leads/frontend-requirements.md` and `Template Prompts/system-backend-requirement.md`

## Overview

The Leads module manages unqualified contacts, typically generated from marketing events (e.g., website forms, trade shows). A Lead represents a person whose buying authority is not yet established. The backend provides RESTful API endpoints for CRUD operations, bulk actions, import/export, relationship management, and analytics for the Leads module.

**System Roles Used:**
- **Sales User**: Full access to Create, Edit, View, and Import Leads. Access to personal and assigned leads.
- **Sales Manager/Admin**: Full access including bulk operations (Delete, Export) and column configuration.

**Common Functionalities Used:**
- **List View**: Server-side pagination, sorting, filtering, bulk actions
- **Import Wizard**: 5-step process for bulk data entry with duplicate checking
- **Activity Stream**: History and Activities sub-panels (Calls, Meetings, Tasks, Emails, Notes)
- **Quick Actions**: Click-to-call, Email composition, add tasks, Schedule meeting
- **Insights**: Analytics and reporting for lead status distribution

**Dependencies:**
- Users module (for assigned_user_id, created_by, modified_user_id)
- Accounts module (for account_name relationship)
- Campaigns module (for campaign_id relationship)
- Activities module (Calls, Meetings, Tasks, Emails, Notes)
- EmailAddresses module (for email relationships)
- Currencies module (for opportunity_amount currency conversion)

**Integration Points:**
- **Frontend API**: REST endpoints for Leads CRUD operations (`/api/v8/module/Leads`)
- **Email Service**: For sending emails via the Compose Modal
- **VCard Service**: For vCard generation and import
- **Global Search**: Integration with unified search across all modules
- **Activity Modules**: Integration with Calls, Meetings, Tasks, Emails for relationship tracking

---

## Functional Requirements

### Authentication & Authorization

- **FR-BE-001**: System MUST require OAuth 2.0 authentication token for all Leads API endpoints
  - **Token Validation**: All requests to `/api/v8/module/Leads/*` MUST include valid Bearer token in Authorization header
  - **Token Format**: `Authorization: Bearer {access_token}`
  - **Error Response**: 401 Unauthorized if token is missing or invalid

- **FR-BE-002**: System MUST enforce role-based access control (RBAC) for Leads operations
  - **Sales User**: Can create, edit, view, and import leads. Access limited to personal and assigned leads.
  - **Sales Manager/Admin**: Full access including bulk operations (Delete, Export) and all leads regardless of assignment
  - **ACL Actions**: `list`, `detail`, `edit`, `delete`, `export`, `import`
  - **Error Response**: 403 Forbidden if user lacks required permissions

- **FR-BE-003**: System MUST check record-level ownership for edit/delete operations
  - **Ownership Check**: Compares `assigned_user_id` with current user ID
  - **Admin Override**: Admins bypass ownership checks
  - **Error Response**: 403 Forbidden if user is not owner and not admin

### API Endpoints

#### List Leads

- **FR-BE-010**: System MUST provide endpoint to retrieve paginated list of leads
  - **Method**: GET
  - **Path**: `/api/v8/module/Leads`
  - **Query Parameters**:
    - `page[offset]` (integer, optional): Pagination offset (default: 0)
    - `page[limit]` (integer, optional): Records per page (default: 20, max: 100)
    - `filter` (object, optional): Filter criteria (see FR-BE-011)
    - `sort` (string, optional): Sort field and direction (e.g., "name", "-date_entered")
    - `fields` (string, optional): Comma-separated list of fields to include
  - **Response**: 200 OK
    ```json
    {
      "data": [
        {
          "type": "Leads",
          "id": "uuid",
          "attributes": {
            "firstName": "John",
            "lastName": "Doe",
            "status": "New",
            "accountName": "Acme Corp",
            "officePhone": "(267) 605-2128",
            "email": "john.doe@example.com",
            "assignedUserId": "uuid",
            "assignedUserName": "Will Westin",
            "dateEntered": "2025-01-01T00:00:00Z",
            "dateModified": "2025-01-01T00:00:00Z"
          }
        }
      ],
      "meta": {
        "total": 206,
        "offset": 0,
        "limit": 20
      },
      "links": {
        "self": "/api/v8/module/Leads?page[offset]=0&page[limit]=20",
        "first": "/api/v8/module/Leads?page[offset]=0&page[limit]=20",
        "prev": null,
        "next": "/api/v8/module/Leads?page[offset]=20&page[limit]=20",
        "last": "/api/v8/module/Leads?page[offset]=200&page[limit]=20"
      }
    }
    ```
  - **Auth Required**: Yes
  - **Roles**: Sales User, Sales Manager, Admin

#### Filter Leads

- **FR-BE-011**: System MUST provide filtering capability for leads list
  - **Filter Parameters** (query string or request body):
    - `filter[firstName]` (string, optional): Filter by first name (partial match)
    - `filter[lastName]` (string, optional): Filter by last name (partial match)
    - `filter[accountName]` (string, optional): Filter by account name (partial match)
    - `filter[anyEmail]` (string, optional): Filter by any email address (partial match)
    - `filter[anyAddress]` (string, optional): Filter by any address field (partial match)
    - `filter[country]` (string, optional): Filter by country (exact match)
    - `filter[anyPhone]` (string, optional): Filter by any phone field (partial match)
    - `filter[city]` (string, optional): Filter by city (partial match)
    - `filter[state]` (string, optional): Filter by state/region (partial match)
    - `filter[status]` (enum, optional): Filter by status (New, Assigned, In Process, Converted, Recycled, Dead)
    - `filter[leadSource]` (string, optional): Filter by lead source
    - `filter[assignedUserId]` (uuid, optional): Filter by assigned user ID
    - `filter[myItems]` (boolean, optional): Filter to show only leads assigned to current user
    - `filter[openItems]` (boolean, optional): Filter to show only non-converted, non-dead leads
    - `filter[myFavorites]` (boolean, optional): Filter to show only favorited leads
  - **Response**: 200 OK (same structure as FR-BE-010 with filtered results)
  - **Auth Required**: Yes
  - **Roles**: Sales User, Sales Manager, Admin

#### Get Single Lead

- **FR-BE-012**: System MUST provide endpoint to retrieve single lead by ID
  - **Method**: GET
  - **Path**: `/api/v8/module/Leads/{id}`
  - **Path Parameters**:
    - `id` (uuid, required): Lead record ID
  - **Query Parameters**:
    - `fields` (string, optional): Comma-separated list of fields to include
    - `include` (string, optional): Comma-separated list of relationships to include (e.g., "emails,activities")
  - **Response**: 200 OK
    ```json
    {
      "data": {
        "type": "Leads",
        "id": "uuid",
        "attributes": {
          "salutation": "Mr.",
          "firstName": "John",
          "lastName": "Doe",
          "accountName": "Acme Corp",
          "title": "VP Sales",
          "department": "Sales",
          "officePhone": "(267) 605-2128",
          "mobilePhone": "(267) 605-2129",
          "fax": "(267) 605-2130",
          "status": "New",
          "statusDescription": "New lead from website",
          "opportunityAmount": 50000.00,
          "currencyId": "uuid",
          "campaignId": "uuid",
          "leadSource": "Website",
          "referredBy": "Jane Smith",
          "doNotCall": false,
          "assignedUserId": "uuid",
          "assignedUserName": "Will Westin",
          "dateEntered": "2025-01-01T00:00:00Z",
          "dateModified": "2025-01-01T00:00:00Z",
          "createdBy": "uuid",
          "modifiedUserId": "uuid"
        },
        "relationships": {
          "emails": {
            "data": [
              {
                "type": "EmailAddresses",
                "id": "uuid"
              }
            ]
          },
          "activities": {
            "data": [
              {
                "type": "Calls",
                "id": "uuid"
              }
            ]
          }
        }
      }
    }
    ```
  - **Error Response**: 404 Not Found if lead does not exist or access denied
  - **Auth Required**: Yes
  - **Roles**: Sales User, Sales Manager, Admin

#### Create Lead

- **FR-BE-013**: System MUST provide endpoint to create new lead
  - **Method**: POST
  - **Path**: `/api/v8/module/Leads`
  - **Request Body**: JSON-API format
    ```json
    {
      "data": {
        "type": "Leads",
        "attributes": {
          "salutation": "Mr.",
          "firstName": "John",
          "lastName": "Doe",
          "accountName": "Acme Corp",
          "title": "VP Sales",
          "department": "Sales",
          "officePhone": "(267) 605-2128",
          "mobilePhone": "(267) 605-2129",
          "fax": "(267) 605-2130",
          "status": "New",
          "statusDescription": "New lead from website",
          "opportunityAmount": 50000.00,
          "currencyId": "uuid",
          "campaignId": "uuid",
          "leadSource": "Website",
          "referredBy": "Jane Smith",
          "doNotCall": false,
          "assignedUserId": "uuid",
          "primaryAddress": {
            "street": "123 Main St",
            "city": "Philadelphia",
            "state": "PA",
            "postalCode": "19101",
            "country": "USA"
          },
          "altAddress": {
            "street": "456 Oak Ave",
            "city": "New York",
            "state": "NY",
            "postalCode": "10001",
            "country": "USA"
          },
          "emails": [
            {
              "emailAddress": "john.doe@example.com",
              "primaryAddress": true,
              "invalidEmail": false,
              "optOut": false
            }
          ]
        }
      }
    }
    ```
  - **Response**: 201 Created (returns created lead with generated ID)
  - **Validations**:
    - `lastName` is required
    - `email` format validation if provided
    - `status` must be one of: New, Assigned, In Process, Converted, Recycled, Dead
    - `assignedUserId` must reference valid user
    - `currencyId` must reference valid currency if `opportunityAmount` is provided
    - `campaignId` must reference valid campaign if provided
  - **Business Logic**:
    - Auto-generates GUID for `id` if not provided
    - Sets `dateEntered` and `dateModified` to current timestamp
    - Sets `createdBy` from current authenticated user
    - Sets `assignedUserId` to current user if not provided
    - Creates email address relationships via `email_addr_bean_rel` join table
    - Calls `before_save` and `after_save` hooks
  - **Error Response**: 400 Bad Request if validation fails
  - **Auth Required**: Yes
  - **Roles**: Sales User, Sales Manager, Admin

#### Update Lead

- **FR-BE-014**: System MUST provide endpoint to update existing lead
  - **Method**: PATCH
  - **Path**: `/api/v8/module/Leads`
  - **Request Body**: JSON-API format with `id` and attributes to update
    ```json
    {
      "data": {
        "type": "Leads",
        "id": "uuid",
        "attributes": {
          "status": "In Process",
          "statusDescription": "Following up on initial contact"
        }
      }
    }
    ```
  - **Response**: 200 OK (returns updated lead)
  - **Validations**:
    - Record must exist and not be deleted
    - User must have edit access (owner or admin)
    - Same validation rules as create for updated fields
    - Optimistic locking check if enabled (compares `dateModified`)
  - **Business Logic**:
    - Updates `dateModified` to current timestamp
    - Sets `modifiedUserId` from current authenticated user
    - Tracks changes for audit trail (if module is audited)
    - Updates email relationships if emails are modified
    - Calls `before_save` and `after_save` hooks
  - **Error Response**: 
    - 400 Bad Request if validation fails
    - 404 Not Found if record does not exist
    - 403 Forbidden if user lacks edit permission
    - 409 Conflict if optimistic locking check fails
  - **Auth Required**: Yes
  - **Roles**: Sales User (own leads), Sales Manager, Admin

#### Delete Lead

- **FR-BE-015**: System MUST provide endpoint to delete lead (soft delete)
  - **Method**: DELETE
  - **Path**: `/api/v8/module/Leads/{id}`
  - **Path Parameters**:
    - `id` (uuid, required): Lead record ID
  - **Response**: 200 OK
    ```json
    {
      "meta": {
        "message": "Lead deleted successfully"
      }
    }
    ```
  - **Business Logic**:
    - Sets `deleted = 1` (soft delete, does not physically remove record)
    - Soft deletes related email address relationships
    - Soft deletes related activities (Calls, Meetings, Tasks, Emails, Notes) if cascade delete is configured
    - Calls `before_delete` and `after_delete` hooks
  - **Error Response**:
    - 404 Not Found if record does not exist
    - 403 Forbidden if user lacks delete permission
  - **Auth Required**: Yes
  - **Roles**: Sales Manager, Admin (Sales User cannot delete)

#### Bulk Delete Leads

- **FR-BE-016**: System MUST provide endpoint to bulk delete multiple leads
  - **Method**: DELETE
  - **Path**: `/api/v8/module/Leads/bulk`
  - **Request Body**:
    ```json
    {
      "ids": ["uuid1", "uuid2", "uuid3"]
    }
    ```
  - **Response**: 200 OK
    ```json
    {
      "meta": {
        "deleted": 3,
        "failed": 0,
        "errors": []
      }
    }
    ```
  - **Business Logic**:
    - Processes each ID in the array
    - Applies same soft delete logic as single delete (FR-BE-015)
    - Returns count of successfully deleted and failed records
    - Continues processing even if some records fail (collects errors)
  - **Error Response**: 400 Bad Request if `ids` array is empty or invalid
  - **Auth Required**: Yes
  - **Roles**: Sales Manager, Admin

#### Bulk Export Leads

- **FR-BE-017**: System MUST provide endpoint to export leads to CSV/Excel
  - **Method**: POST
  - **Path**: `/api/v8/module/Leads/export`
  - **Request Body**:
    ```json
    {
      "ids": ["uuid1", "uuid2", "uuid3"],
      "format": "csv",
      "fields": ["firstName", "lastName", "status", "accountName", "officePhone", "email"]
    }
    ```
  - **Query Parameters** (alternative to request body):
    - `filter` (object, optional): Filter criteria (same as FR-BE-011)
    - `format` (string, optional): Export format - "csv" or "xlsx" (default: "csv")
    - `fields` (string, optional): Comma-separated list of fields to export
  - **Response**: 200 OK
    - **Content-Type**: `text/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
    - **Content-Disposition**: `attachment; filename="leads_export_2025-01-01.csv"`
    - **Body**: CSV/Excel file content
  - **Business Logic**:
    - Applies filters if provided
    - Exports only fields user has access to (ACL check)
    - Includes header row with field labels
    - Handles special characters and encoding
  - **Error Response**: 400 Bad Request if format is invalid
  - **Auth Required**: Yes
  - **Roles**: Sales Manager, Admin

#### Import Leads

- **FR-BE-018**: System MUST provide endpoint to import leads from CSV/Excel file
  - **Method**: POST
  - **Path**: `/api/v8/module/Leads/import`
  - **Request**: Multipart form data
    - `file` (file, required): CSV/Excel file to import
    - `importMode` (string, required): "create_only" or "create_and_update"
    - `duplicateCheck` (object, optional): Duplicate checking criteria
      ```json
      {
        "fields": ["email", "lastName"],
        "matchType": "any" // "any" or "all"
      }
      ```
    - `fieldMapping` (object, optional): CSV column to system field mapping
      ```json
      {
        "csv_column_1": "firstName",
        "csv_column_2": "lastName",
        "csv_column_3": "email"
      }
      ```
  - **Response**: 200 OK
    ```json
    {
      "data": {
        "importId": "uuid",
        "totalRows": 100,
        "processedRows": 95,
        "successCount": 90,
        "errorCount": 5,
        "duplicateCount": 0,
        "errors": [
          {
            "row": 3,
            "field": "lastName",
            "message": "Last name is required"
          }
        ],
        "errorLogUrl": "/api/v8/module/Leads/import/{importId}/errors"
      }
    }
    ```
  - **Business Logic**:
    - Validates file format (CSV/Excel)
    - Parses file and maps columns to system fields
    - Validates each row against business rules
    - Checks for duplicates based on `duplicateCheck` criteria
    - Creates new records or updates existing based on `importMode`
    - Generates error log for failed rows
    - Returns import summary with success/error counts
  - **Error Response**: 400 Bad Request if file format is invalid or required fields missing
  - **Auth Required**: Yes
    - **Roles**: Sales User, Sales Manager, Admin

#### Get Import Error Log

- **FR-BE-019**: System MUST provide endpoint to download import error log
  - **Method**: GET
  - **Path**: `/api/v8/module/Leads/import/{importId}/errors`
  - **Path Parameters**:
    - `importId` (uuid, required): Import job ID from FR-BE-018 response
  - **Response**: 200 OK
    - **Content-Type**: `text/csv`
    - **Content-Disposition**: `attachment; filename="import_errors_{importId}.csv"`
    - **Body**: CSV file with error details (row number, field, error message)
  - **Auth Required**: Yes
  - **Roles**: Sales User, Sales Manager, Admin

#### Get Lead Insights/Analytics

- **FR-BE-020**: System MUST provide endpoint to retrieve lead analytics and insights
  - **Method**: GET
  - **Path**: `/api/v8/module/Leads/insights`
  - **Query Parameters**:
    - `filter` (object, optional): Filter criteria (same as FR-BE-011) to scope analytics
  - **Response**: 200 OK
    ```json
    {
      "data": {
        "statusDistribution": [
          {
            "status": "New",
            "count": 45,
            "percentage": 22.5
          },
          {
            "status": "Assigned",
            "count": 30,
            "percentage": 15.0
          },
          {
            "status": "In Process",
            "count": 50,
            "percentage": 25.0
          },
          {
            "status": "Converted",
            "count": 40,
            "percentage": 20.0
          },
          {
            "status": "Recycled",
            "count": 20,
            "percentage": 10.0
          },
          {
            "status": "Dead",
            "count": 15,
            "percentage": 7.5
          }
        ],
        "quickStats": {
          "total": 200,
          "new": 45,
          "converted": 40,
          "dead": 15
        }
      }
    }
    ```
  - **Business Logic**:
    - Aggregates lead counts by status
    - Calculates percentages for each status
    - Applies filters if provided
    - Returns quick stats (total, new, converted, dead counts)
  - **Auth Required**: Yes
  - **Roles**: Sales User, Sales Manager, Admin

#### Get Lead Relationships

- **FR-BE-021**: System MUST provide endpoint to retrieve lead relationships
  - **Method**: GET
  - **Path**: `/api/v8/module/Leads/{id}/relationships/{linkFieldName}`
  - **Path Parameters**:
    - `id` (uuid, required): Lead record ID
    - `linkFieldName` (string, required): Relationship link field name (e.g., "emails", "activities", "calls", "meetings", "tasks", "notes")
  - **Query Parameters**:
    - `page[offset]` (integer, optional): Pagination offset
    - `page[limit]` (integer, optional): Records per page
    - `filter` (object, optional): Filter criteria for related records
    - `sort` (string, optional): Sort field and direction
  - **Response**: 200 OK (JSON-API format with related records)
  - **Supported Relationships**:
    - `emails`: Email addresses associated with lead
    - `activities`: All activities (Calls, Meetings, Tasks, Emails, Notes)
    - `calls`: Call records
    - `meetings`: Meeting records
    - `tasks`: Task records
    - `notes`: Note records
    - `documents`: Document records
    - `contacts`: Contact records (if converted)
  - **Auth Required**: Yes
  - **Roles**: Sales User, Sales Manager, Admin

#### Create Lead Relationship

- **FR-BE-022**: System MUST provide endpoint to create relationship between lead and related record
  - **Method**: POST
  - **Path**: `/api/v8/module/Leads/{id}/relationships/{linkFieldName}`
  - **Path Parameters**:
    - `id` (uuid, required): Lead record ID
    - `linkFieldName` (string, required): Relationship link field name
  - **Request Body**: JSON-API format
    ```json
    {
      "data": {
        "type": "Calls",
        "id": "uuid"
      }
    }
    ```
  - **Response**: 201 Created
  - **Business Logic**:
    - For many-to-many: Creates entry in join table (e.g., `leads_calls`)
    - For one-to-many: Updates foreign key in related table (e.g., sets `parent_id` and `parent_type` in Calls table)
    - Validates relationship type and related record exists
  - **Error Response**: 400 Bad Request if relationship type is invalid or related record not found
  - **Auth Required**: Yes
  - **Roles**: Sales User, Sales Manager, Admin

#### Delete Lead Relationship

- **FR-BE-023**: System MUST provide endpoint to delete relationship between lead and related record
  - **Method**: DELETE
  - **Path**: `/api/v8/module/Leads/{id}/relationships/{linkFieldName}/{relatedId}`
  - **Path Parameters**:
    - `id` (uuid, required): Lead record ID
    - `linkFieldName` (string, required): Relationship link field name
    - `relatedId` (uuid, required): Related record ID
  - **Response**: 200 OK
  - **Business Logic**:
    - For many-to-many: Soft deletes join table entry
    - For one-to-many: Sets foreign key to NULL or soft deletes related record based on relationship configuration
  - **Error Response**: 404 Not Found if relationship does not exist
  - **Auth Required**: Yes
  - **Roles**: Sales User, Sales Manager, Admin

#### Convert Lead

- **FR-BE-024**: System MUST provide endpoint to convert lead to Contact and optionally Account/Opportunity
  - **Method**: POST
  - **Path**: `/api/v8/module/Leads/{id}/convert`
  - **Path Parameters**:
    - `id` (uuid, required): Lead record ID
  - **Request Body**:
    ```json
    {
      "data": {
        "createContact": true,
        "createAccount": true,
        "createOpportunity": false,
        "accountName": "Acme Corp",
        "opportunityName": "Acme Corp - Initial Opportunity",
        "opportunityAmount": 50000.00,
        "assignedUserId": "uuid"
      }
    }
    ```
  - **Response**: 200 OK
    ```json
    {
      "data": {
        "leadId": "uuid",
        "contactId": "uuid",
        "accountId": "uuid",
        "opportunityId": null,
        "status": "Converted"
      }
    }
    ```
  - **Business Logic**:
    - Creates Contact record from lead data
    - Optionally creates Account record if `createAccount` is true
    - Optionally creates Opportunity record if `createOpportunity` is true
    - Updates lead status to "Converted"
    - Links created records (Contact to Account, Opportunity to Account)
    - Transfers email addresses and activities to Contact
    - Calls `before_convert` and `after_convert` hooks
  - **Error Response**: 400 Bad Request if conversion fails
  - **Auth Required**: Yes
  - **Roles**: Sales User, Sales Manager, Admin

#### Get Saved Filters

- **FR-BE-025**: System MUST provide endpoint to retrieve user's saved filters
  - **Method**: GET
  - **Path**: `/api/v8/module/Leads/filters/saved`
  - **Response**: 200 OK
    ```json
    {
      "data": [
        {
          "id": "uuid",
          "name": "My Active Leads",
          "filter": {
            "status": "In Process",
            "myItems": true
          },
          "createdAt": "2025-01-01T00:00:00Z"
        }
      ]
    }
    ```
  - **Business Logic**:
    - Returns only filters saved by current user
    - Filters are user-specific (not shared)
  - **Auth Required**: Yes
  - **Roles**: Sales User, Sales Manager, Admin

#### Save Filter

- **FR-BE-026**: System MUST provide endpoint to save filter configuration
  - **Method**: POST
  - **Path**: `/api/v8/module/Leads/filters/saved`
  - **Request Body**:
    ```json
    {
      "data": {
        "name": "My Active Leads",
        "filter": {
          "status": "In Process",
          "myItems": true
        }
      }
    }
    ```
  - **Response**: 201 Created (returns saved filter with generated ID)
  - **Business Logic**:
    - Stores filter configuration in `saved_filters` table or user preferences
    - Associates filter with current user
    - Validates filter structure
  - **Error Response**: 400 Bad Request if filter structure is invalid
  - **Auth Required**: Yes
  - **Roles**: Sales User, Sales Manager, Admin

#### Update Saved Filter

- **FR-BE-027**: System MUST provide endpoint to update saved filter (rename)
  - **Method**: PATCH
  - **Path**: `/api/v8/module/Leads/filters/saved/{filterId}`
  - **Path Parameters**:
    - `filterId` (uuid, required): Saved filter ID
  - **Request Body**:
    ```json
    {
      "data": {
        "name": "Updated Filter Name"
      }
    }
    ```
  - **Response**: 200 OK
  - **Business Logic**:
    - Updates filter name
    - Validates user owns the filter
  - **Error Response**: 403 Forbidden if user does not own the filter
  - **Auth Required**: Yes
  - **Roles**: Sales User, Sales Manager, Admin

#### Delete Saved Filter

- **FR-BE-028**: System MUST provide endpoint to delete saved filter
  - **Method**: DELETE
  - **Path**: `/api/v8/module/Leads/filters/saved/{filterId}`
  - **Path Parameters**:
    - `filterId` (uuid, required): Saved filter ID
  - **Response**: 200 OK
  - **Business Logic**:
    - Validates user owns the filter
    - Soft deletes or removes filter record
  - **Error Response**: 403 Forbidden if user does not own the filter
  - **Auth Required**: Yes
  - **Roles**: Sales User, Sales Manager, Admin

#### Get ListView Columns

- **FR-BE-029**: System MUST provide endpoint to retrieve available and displayed columns for list view
  - **Method**: GET
  - **Path**: `/api/v8/listview/columns/Leads`
  - **Response**: 200 OK
    ```json
    {
      "data": {
        "displayedColumns": [
          {
            "field": "name",
            "label": "Name",
            "sortable": true,
            "width": 200
          },
          {
            "field": "status",
            "label": "Status",
            "sortable": true,
            "width": 120
          }
        ],
        "availableColumns": [
          {
            "field": "accountName",
            "label": "Account Name",
            "sortable": true,
            "width": 150
          }
        ]
      }
    }
    ```
  - **Business Logic**:
    - Returns user's saved column configuration if exists
    - Returns default columns if no saved configuration
  - **Auth Required**: Yes
  - **Roles**: Sales User, Sales Manager, Admin

#### Save ListView Columns

- **FR-BE-030**: System MUST provide endpoint to save user's column configuration
  - **Method**: POST
  - **Path**: `/api/v8/listview/columns/Leads`
  - **Request Body**:
    ```json
    {
      "data": {
        "displayedColumns": ["name", "status", "accountName", "officePhone", "email", "assignedUserName"],
        "columnOrder": ["name", "status", "accountName", "officePhone", "email", "assignedUserName"]
      }
    }
    ```
  - **Response**: 200 OK
  - **Business Logic**:
    - Saves column configuration to user preferences
    - Validates column names exist in field definitions
  - **Error Response**: 400 Bad Request if column names are invalid
  - **Auth Required**: Yes
  - **Roles**: Sales User, Sales Manager, Admin

### Data Management

- **FR-BE-040**: System MUST store lead data in `leads` table with soft delete support
  - **Soft Delete**: Sets `deleted = 1` instead of physically removing records
  - **Query Filter**: All queries MUST filter `WHERE deleted = 0` by default
  - **Recovery**: Records can be undeleted by setting `deleted = 0`

- **FR-BE-041**: System MUST validate lead data before persistence
  - **Required Fields**: `lastName` is mandatory
  - **Email Validation**: Email addresses must match valid email format
  - **Status Validation**: Status must be one of: New, Assigned, In Process, Converted, Recycled, Dead
  - **Phone Validation**: Phone numbers should be validated for format (optional)
  - **Currency Validation**: `currencyId` must reference valid currency if `opportunityAmount` is provided

- **FR-BE-042**: System MUST support multiple email addresses per lead
  - **Storage**: Email addresses stored in `email_addresses` table
  - **Relationship**: Many-to-many relationship via `email_addr_bean_rel` join table
  - **Primary Email**: One email address marked as primary (`primary_address = 1`)
  - **Email Flags**: Supports `invalid_email` and `opt_out` flags

- **FR-BE-043**: System MUST support address fields (primary and alternate)
  - **Primary Address**: `primary_address_street`, `primary_address_city`, `primary_address_state`, `primary_address_postalcode`, `primary_address_country`
  - **Alternate Address**: `alt_address_street`, `alt_address_city`, `alt_address_state`, `alt_address_postalcode`, `alt_address_country`
  - **Storage**: Address fields stored directly in `leads` table

- **FR-BE-044**: System MUST track audit trail for lead changes (if module is audited)
  - **Audit Table**: `leads_audit` table stores field change history
  - **Tracked Fields**: All fields marked as `'audited' => true` in vardefs
  - **Change Tracking**: Records `before_value` and `after_value` for each field change
  - **User Tracking**: Records `created_by` for audit entries

### Business Logic

- **FR-BE-050**: System MUST support lead status transitions
  - **Status Values**: New, Assigned, In Process, Converted, Recycled, Dead
  - **Transition Rules**: All statuses are independent - any status can transition to any other status based on user action (no workflow restrictions)
  - **Status Update**: Updates `status` field and optionally `statusDescription` field
  - **Audit Trail**: Status changes are tracked in audit trail if module is audited

- **FR-BE-051**: System MUST handle lead conversion to Contact/Account/Opportunity
  - **Conversion Process**:
    1. Creates Contact record from lead data (firstName, lastName, email, phone, address)
    2. Optionally creates Account record if specified
    3. Optionally creates Opportunity record if specified
    4. Updates lead status to "Converted"
    5. Links created records (Contact to Account, Opportunity to Account)
    6. Transfers email addresses to Contact
    7. Transfers activities (Calls, Meetings, Tasks, Notes) to Contact
  - **Data Mapping**: Maps lead fields to contact/account/opportunity fields
  - **Relationship Preservation**: Maintains relationships during conversion

- **FR-BE-052**: System MUST calculate and store opportunity amount in base currency
  - **Currency Conversion**: If `opportunityAmount` is provided with `currencyId`, system calculates and stores USD equivalent in `opportunity_amount_usdollar`
  - **Conversion Rate**: Uses current conversion rate from `currencies` table
  - **Update Trigger**: Recalculates on currency or amount change

- **FR-BE-053**: System MUST handle lead assignment
  - **Assignment Field**: `assignedUserId` references `users.id`
  - **Default Assignment**: If not provided on create, assigns to current user
  - **Assignment Change**: Updates `assignedUserId` and triggers notification if `check_notify = true`
  - **Ownership Check**: Used for ACL checks (owners get full access)

- **FR-BE-054**: System MUST support duplicate checking during import
  - **Duplicate Criteria**: Configurable fields for duplicate checking (e.g., email, lastName, phone)
  - **Match Type**: "any" (match if any field matches) or "all" (match if all fields match)
  - **Import Mode**: "create_only" (skip duplicates) or "create_and_update" (update existing records)
  - **Duplicate Detection**: Compares incoming data against existing leads based on criteria

- **FR-BE-055**: System MUST generate lead name from salutation, firstName, and lastName
  - **Name Format**: "{salutation} {firstName} {lastName}" (e.g., "Mr. John Doe")
  - **Computed Field**: `name` field is computed and stored for search/sort purposes
  - **Display**: Used in list view and detail view

### Integration Requirements

- **FR-BE-060**: System MUST integrate with Email Service for email composition
  - **Purpose**: Send emails from lead detail view and list view quick actions
  - **Data Flow**: 
    - Receives email composition request with lead ID
    - Retrieves lead email addresses
    - Pre-fills recipient in email compose modal
    - Links sent email to lead via `parent_id` and `parent_type`
  - **Error Handling**: Returns 400 Bad Request if email service is unavailable

- **FR-BE-061**: System MUST integrate with Activities module (Calls, Meetings, Tasks, Notes, Emails)
  - **Purpose**: Track activities related to leads
  - **Data Flow**:
    - Activities reference lead via `parent_id` and `parent_type = 'Leads'`
    - Lead detail view retrieves activities via relationship endpoint
    - Quick actions (Call, Meeting, Task) create activity records with lead pre-selected
  - **Relationship**: One-to-many (one lead can have many activities)

- **FR-BE-062**: System MUST integrate with VCard Service for vCard generation and import
  - **Purpose**: Export lead as vCard or import leads from vCard files
  - **Data Flow**:
    - Export: Generates vCard format from lead data (name, email, phone, address)
    - Import: Parses vCard and creates lead records
  - **Error Handling**: Returns 400 Bad Request if vCard format is invalid

- **FR-BE-063**: System MUST integrate with Global Search
  - **Purpose**: Include leads in cross-module search results
  - **Data Flow**:
    - Search endpoint queries leads table along with other modules
    - Returns categorized results grouped by module type
    - Includes lead name, email, phone in searchable fields
  - **Search Fields**: name, email, phone, accountName, status

- **FR-BE-064**: System MUST integrate with Accounts module
  - **Purpose**: Link leads to accounts and support account name field
  - **Data Flow**:
    - `accountName` field stores account name (text field, not foreign key)
    - On conversion, creates Account record if specified
    - Links Contact to Account after conversion
  - **Relationship**: Many-to-one (many leads can reference same account name)

- **FR-BE-065**: System MUST integrate with Campaigns module
  - **Purpose**: Track lead source from marketing campaigns
  - **Data Flow**:
    - `campaignId` references `campaigns.id`
    - Campaign tracking for lead attribution
  - **Relationship**: Many-to-one (many leads can belong to one campaign)

### Security Requirements

- **FR-BE-070**: System MUST validate and sanitize all input data
  - **XSS Protection**: Sanitize string fields to prevent cross-site scripting
  - **SQL Injection Prevention**: Use parameterized queries, never concatenate user input into SQL
  - **Input Validation**: Validate data types, lengths, and formats before persistence

- **FR-BE-071**: System MUST enforce field-level access control
  - **ACL Field Access**: Check user permissions for each field before returning in API response
  - **Sensitive Fields**: Hide or mask sensitive fields based on user role
  - **Field-Level Security**: Implement field-level security groups if configured

- **FR-BE-072**: System MUST implement rate limiting for API endpoints
  - **Rate Limit**: Apply throttling to prevent abuse (e.g., 100 requests per minute per user)
  - **Import Endpoint**: Stricter rate limiting for import endpoint (e.g., 10 requests per hour)
  - **Error Response**: 429 Too Many Requests if rate limit exceeded

- **FR-BE-073**: System MUST encrypt sensitive data at rest
  - **Email Addresses**: Consider encryption for email addresses if required by compliance
  - **Phone Numbers**: Consider encryption for phone numbers if required by compliance
  - **Password Fields**: Never store passwords (not applicable to leads, but for reference)

### Performance Requirements

- **FR-BE-080**: System MUST respond to list endpoint within 500ms for up to 1000 records
  - **Pagination**: Implement efficient pagination using LIMIT/OFFSET or cursor-based pagination
  - **Indexing**: Ensure proper database indexes on frequently queried fields (status, assignedUserId, dateEntered)
  - **Query Optimization**: Use efficient queries with proper joins and filters

- **FR-BE-081**: System MUST handle bulk operations efficiently
  - **Bulk Delete**: Process up to 1000 records in bulk delete within 5 seconds
  - **Bulk Export**: Generate CSV/Excel export for up to 10,000 records within 10 seconds
  - **Batch Processing**: Use batch inserts/updates for import operations

- **FR-BE-082**: System MUST support concurrent requests
  - **Concurrency**: Handle at least 100 concurrent API requests
  - **Database Connections**: Use connection pooling for database access
  - **Locking**: Implement optimistic locking to prevent concurrent update conflicts

---

## Non-Functional Requirements

### Scalability

- **NFR-BE-001**: System MUST support at least 1 million lead records without performance degradation
  - **Database Optimization**: Proper indexing, partitioning if needed
  - **Query Performance**: All queries should use indexes and avoid full table scans

### Reliability

- **NFR-BE-002**: System MUST maintain 99.9% uptime for Leads API endpoints
  - **Error Handling**: Graceful error handling with proper error responses
  - **Transaction Management**: Use database transactions for data consistency
  - **Rollback Support**: Support rollback on errors during bulk operations

### Maintainability

- **NFR-BE-003**: System MUST follow project structure conventions
  - **Module Structure**: Follow NestJS module structure in `backend/src/modules/leads/`
  - **Code Organization**: Separate controllers, services, repositories, entities, DTOs
  - **Documentation**: JSDoc comments for all service methods

### Observability

- **NFR-BE-004**: System MUST log all API requests and responses
  - **Request Logging**: Log endpoint, method, user ID, timestamp
  - **Response Logging**: Log status code, response time
  - **Error Logging**: Log errors with stack traces and context

- **NFR-BE-005**: System MUST track error rates and performance metrics
  - **Metrics**: Track API response times, error rates, bulk operation success rates
  - **Monitoring**: Integrate with monitoring tools for alerting

---

## Data Models

### Lead Entity

**Description**: Represents a lead (unqualified contact) in the system.

**Attributes**:
- `id` (uuid): Unique identifier (primary key, GUID)
- `salutation` (string, optional): Salutation (Mr., Ms., Mrs., Dr., etc.)
- `firstName` (string, optional): First name
- `lastName` (string, required): Last name (mandatory)
- `name` (string, computed): Full name computed from salutation, firstName, lastName
- `accountName` (string, optional): Account name (text field, not foreign key)
- `title` (string, optional): Job title
- `department` (string, optional): Department
- `officePhone` (string, optional): Office phone number
- `mobilePhone` (string, optional): Mobile phone number
- `fax` (string, optional): Fax number
- `status` (enum, required): Lead status - New, Assigned, In Process, Converted, Recycled, Dead
- `statusDescription` (text, optional): Status description
- `opportunityAmount` (decimal, optional): Opportunity amount
- `opportunityAmountUsdollar` (decimal, optional): Opportunity amount in USD
- `currencyId` (uuid, optional): Foreign key to currencies.id
- `campaignId` (uuid, optional): Foreign key to campaigns.id
- `leadSource` (string, optional): Lead source (Website, Trade Show, Referral, etc.)
- `referredBy` (string, optional): Referred by person name
- `doNotCall` (boolean, default: false): Do not call flag
- `assignedUserId` (uuid, required): Foreign key to users.id (assigned user)
- `createdBy` (uuid, required): Foreign key to users.id (creator)
- `modifiedUserId` (uuid, required): Foreign key to users.id (last modifier)
- `dateEntered` (datetime, required): Creation timestamp
- `dateModified` (datetime, required): Last modification timestamp
- `deleted` (boolean, default: false): Soft delete flag
- `description` (text, optional): Description/notes

**Address Fields** (Primary):
- `primaryAddressStreet` (string, optional): Street address
- `primaryAddressCity` (string, optional): City
- `primaryAddressState` (string, optional): State/Region
- `primaryAddressPostalcode` (string, optional): Postal code
- `primaryAddressCountry` (string, optional): Country

**Address Fields** (Alternate):
- `altAddressStreet` (string, optional): Alternate street address
- `altAddressCity` (string, optional): Alternate city
- `altAddressState` (string, optional): Alternate state/region
- `altAddressPostalcode` (string, optional): Alternate postal code
- `altAddressCountry` (string, optional): Alternate country

**Relationships**:
- Many-to-one with Users (via assignedUserId, createdBy, modifiedUserId)
- Many-to-one with Currencies (via currencyId)
- Many-to-one with Campaigns (via campaignId)
- Many-to-many with EmailAddresses (via email_addr_bean_rel join table)
- One-to-many with Activities (Calls, Meetings, Tasks, Notes, Emails via parent_id, parent_type='Leads')

**Validation Rules**:
- `lastName` is required
- `status` must be one of: New, Assigned, In Process, Converted, Recycled, Dead
- `email` format validation if provided
- `assignedUserId` must reference valid user
- `currencyId` must reference valid currency if `opportunityAmount` is provided
- `campaignId` must reference valid campaign if provided

**Indexes**:
- Primary key on `id`
- Index on `deleted` for soft delete filtering
- Index on `assignedUserId` for assignment queries
- Index on `status` for status filtering
- Index on `dateEntered` for sorting
- Index on `dateModified` for sorting and optimistic locking
- Composite index on `(deleted, assignedUserId)` for filtered queries
- Composite index on `(deleted, status)` for status filtering

### SavedFilter Entity

**Description**: Stores user's saved filter configurations for leads list view.

**Attributes**:
- `id` (uuid): Unique identifier (primary key)
- `userId` (uuid, required): Foreign key to users.id
- `name` (string, required): Filter name
- `module` (string, required): Module name ("Leads")
- `filter` (json, required): Filter criteria object
- `createdAt` (datetime, required): Creation timestamp
- `updatedAt` (datetime, required): Last update timestamp
- `deleted` (boolean, default: false): Soft delete flag

**Relationships**:
- Many-to-one with Users (via userId)

**Validation Rules**:
- `name` is required, max 255 characters
- `filter` must be valid JSON object
- `userId` must reference valid user

**Indexes**:
- Primary key on `id`
- Index on `userId` for user-specific queries
- Composite index on `(userId, module, deleted)` for efficient retrieval

### LeadAudit Entity (if module is audited)

**Description**: Tracks field changes for lead records (audit trail).

**Attributes**:
- `id` (uuid): Unique identifier (primary key)
- `parentId` (uuid, required): Foreign key to leads.id
- `fieldName` (string, required): Name of changed field
- `dataType` (string, required): Data type of field
- `beforeValueString` (string, optional): Before value (for string fields)
- `afterValueString` (string, optional): After value (for string fields)
- `beforeValueText` (text, optional): Before value (for text fields)
- `afterValueText` (text, optional): After value (for text fields)
- `createdBy` (uuid, required): Foreign key to users.id
- `dateCreated` (datetime, required): Change timestamp

**Relationships**:
- Many-to-one with Leads (via parentId)
- Many-to-one with Users (via createdBy)

**Indexes**:
- Primary key on `id`
- Index on `parentId` for lead-specific audit queries
- Index on `dateCreated` for chronological queries

---

## Error Handling

### Error Scenarios

- **ERR-BE-001**: When lead record is not found, system MUST return 404 Not Found
  - **Response**: `{ "error": { "code": "LEAD_NOT_FOUND", "message": "Lead with ID {id} not found" } }`

- **ERR-BE-002**: When required field is missing, system MUST return 400 Bad Request
  - **Response**: `{ "error": { "code": "VALIDATION_ERROR", "message": "Last name is required", "details": { "field": "lastName" } } }`

- **ERR-BE-003**: When user lacks permission, system MUST return 403 Forbidden
  - **Response**: `{ "error": { "code": "FORBIDDEN", "message": "You do not have permission to perform this action" } }`

- **ERR-BE-004**: When authentication token is missing or invalid, system MUST return 401 Unauthorized
  - **Response**: `{ "error": { "code": "UNAUTHORIZED", "message": "Authentication required" } }`

- **ERR-BE-005**: When import file format is invalid, system MUST return 400 Bad Request
  - **Response**: `{ "error": { "code": "INVALID_FILE_FORMAT", "message": "File must be CSV or Excel format" } }`

- **ERR-BE-006**: When optimistic locking conflict occurs, system MUST return 409 Conflict
  - **Response**: `{ "error": { "code": "CONCURRENT_UPDATE", "message": "Record has been modified by another user" } }`

- **ERR-BE-007**: When bulk operation partially fails, system MUST return 200 OK with error details
  - **Response**: `{ "meta": { "deleted": 5, "failed": 2, "errors": [{ "id": "uuid", "message": "Record not found" }] } }`

- **ERR-BE-008**: When rate limit is exceeded, system MUST return 429 Too Many Requests
  - **Response**: `{ "error": { "code": "RATE_LIMIT_EXCEEDED", "message": "Too many requests. Please try again later." } }`

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "fieldName",
      "value": "invalidValue"
    }
  }
}
```

---

## Success Criteria

- **SC-BE-001**: All API endpoints respond within specified time limits (list: 500ms, detail: 200ms, create: 300ms, update: 300ms)
- **SC-BE-002**: System handles 100 concurrent API requests without degradation
- **SC-BE-003**: Bulk delete processes 1000 records within 5 seconds
- **SC-BE-004**: Import processes 1000 leads within 30 seconds
- **SC-BE-005**: All functional requirements are implemented and tested
- **SC-BE-006**: System maintains 99.9% uptime for Leads API endpoints
- **SC-BE-007**: All security requirements are implemented and validated
- **SC-BE-008**: All error scenarios return appropriate HTTP status codes and error messages

---

## Notes

- Reference `requirements/Leads/frontend-requirements.md` for frontend integration requirements
- Reference `Template Prompts/system-backend-requirement.md` for SuiteCRM 8.9.1 backend patterns
- Reference `specs/leads/backend-specs.md` for technical implementation details (to be created)
- Mark unclear requirements with `[NEEDS CLARIFICATION: description]`
- Follow NestJS conventions and project structure in `.cursor/rules/project-structure.mdc`
- Use BusinessException for all business logic errors (see `.cursor/rules/exception-handling.mdc`)
- Follow entity naming conventions in `.cursor/rules/entity.mdc`
- Follow controller naming conventions in `.cursor/rules/controller.mdc`