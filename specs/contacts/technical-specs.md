# Technical Specifications - Contacts Module (Common)

**Feature Branch**: `003-contacts-technical`  
**Created**: 2025-12-12  
**Updated**: 2025-12-12 (clarifications applied)  
**Status**: Draft  
**Input**: User description: "Common technical specifications for Contacts module - API formats, data structures, and integration patterns"

**Note**: This specification has been updated with clarifications for bulk action workflows (merge compares by name, mass update excludes assignedUserId), bulk import preview workflow, permissions (Admin only for delete and bulk import), and other technical details based on user feedback.

## Overview

This document defines common technical specifications that apply to both frontend and backend implementations of the Contacts module. It covers API formats, data structures, validation rules, error handling patterns, and integration conventions.

---

## API Format Specifications

### JSON-API Format

All Contacts API endpoints MUST use JSON-API 1.0 specification format for request and response bodies.

#### Request Format

```json
{
  "data": {
    "type": "Contacts",
    "id": "optional-guid-for-updates",
    "attributes": {
      "firstName": "John",
      "lastName": "Doe",
      "jobTitle": "Manager",
      ...
    },
    "relationships": {
      "account": {
        "data": {
          "type": "Accounts",
          "id": "account-guid"
        }
      },
      "assigned_user": {
        "data": {
          "type": "Users",
          "id": "user-guid"
        }
      }
    }
  }
}
```

#### Response Format (Single Resource)

```json
{
  "data": {
    "type": "Contacts",
    "id": "contact-guid",
    "attributes": {
      "firstName": "John",
      "lastName": "Doe",
      "jobTitle": "Manager",
      "dateCreated": "2024-01-01T00:00:00Z",
      "dateModified": "2024-01-01T00:00:00Z",
      ...
    },
    "relationships": {
      "account": {
        "data": {
          "type": "Accounts",
          "id": "account-guid"
        }
      },
      "assigned_user": {
        "data": {
          "type": "Users",
          "id": "user-guid"
        }
      },
      "email_addresses": {
        "data": [
          {
            "type": "EmailAddresses",
            "id": "email-guid"
          }
        ]
      }
    },
    "links": {
      "self": "/api/contacts/contact-guid"
    }
  }
}
```

#### Response Format (Collection)

```json
{
  "data": [
    {
      "type": "Contacts",
      "id": "contact-guid-1",
      "attributes": { ... },
      "relationships": { ... },
      "links": { ... }
    },
    {
      "type": "Contacts",
      "id": "contact-guid-2",
      "attributes": { ... },
      "relationships": { ... },
      "links": { ... }
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

#### Error Response Format

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
- `status` (string): HTTP status code as string (e.g., "400", "404", "403", "500")
- `code` (string): Machine-readable error code (e.g., "VALIDATION_ERROR", "CONTACT_NOT_FOUND", "ACCESS_DENIED", "INVALID_VCARD_FORMAT")
- `title` (string): Short, human-readable summary of the error
- `detail` (string): Detailed, human-readable explanation
- `source` (object, optional): Object containing references to the source of the error
  - `pointer` (string): JSON Pointer to the problematic field (RFC 6901 format, e.g., "/data/attributes/lastName")

---

## Data Type Specifications

### Database Field Types

- **GUID/ID**: `char(36)` - Stores UUID/GUID values
- **Varchar**: `varchar(n)` - Variable length string with max length n
- **Text**: `text` - Unlimited length text
- **Datetime**: `datetime` - Date and time storage
- **Date**: `date` - Date only storage
- **Boolean**: `tinyint(1)` - Boolean (0 = false, 1 = true)
- **Integer**: `int` - Integer numeric type
- **Double**: `double` - Floating point numeric type
- **Enum**: `varchar(255)` or `enum` - Predefined value list

### API Data Formats

- **GUID/ID**: String format UUID (e.g., "550e8400-e29b-41d4-a716-446655440000")
- **Datetime**: ISO 8601 format (e.g., "2024-01-01T00:00:00Z" or "2024-01-01T12:30:45+00:00")
- **Date**: ISO 8601 date format (e.g., "2024-01-01")
- **Boolean**: JSON boolean (true/false)
- **Integer**: JSON number (integer)
- **Double**: JSON number (floating point)
- **Enum**: String value from predefined list

### Field Type Mappings

| Backend Field Type | Database Type | API Format | Frontend Component |
|-------------------|---------------|------------|-------------------|
| `id` | char(36) | string (UUID) | Hidden/Display |
| `varchar` | varchar(n) | string | Text input |
| `text` | text | string | Textarea |
| `phone` | varchar | string | Phone input |
| `email` | varchar | string | Email input |
| `date` | date | string (ISO 8601) | Date picker |
| `datetime` | datetime | string (ISO 8601) | DateTime picker |
| `enum` | varchar/enum | string | Dropdown select |
| `bool` | tinyint(1) | boolean | Checkbox |
| `int` | int | number | Integer input |
| `float` | double | number | Decimal input |
| `relate` | char(36) | relationship object | Related record selector |

---

## Contact Entity Structure

### Database Schema

**Table**: `contacts`

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | char(36) | NO | - | Primary key (GUID) |
| `title` | varchar(255) | YES | NULL | Contact title (Mr., Ms., etc.) |
| `first_name` | varchar(255) | YES | NULL | First name |
| `last_name` | varchar(255) | NO | NULL | Last name (required) |
| `office_phone` | varchar(255) | YES | NULL | Office phone number |
| `mobile` | varchar(255) | YES | NULL | Mobile phone number |
| `job_title` | varchar(255) | YES | NULL | Job title/position |
| `department` | varchar(255) | YES | NULL | Department name |
| `account_id` | char(36) | YES | NULL | FK to accounts.id |
| `assigned_user_id` | char(36) | NO | NULL | FK to users.id (defaults to current user) |
| `lead_source` | varchar(255) | YES | NULL | Lead source enum |
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

**Indexes**:
- Primary key on `id`
- Index on `last_name` for search
- Index on `account_id` for account relationships
- Index on `assigned_user_id` for user filtering
- Index on `deleted` for soft delete filtering
- Composite index on `(deleted, assigned_user_id)` for efficient filtering
- Index on `date_created` for sorting

### Email Address Relationship

**Join Table**: `email_addr_bean_rel`

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | char(36) | NO | - | Primary key (GUID) |
| `email_address_id` | char(36) | NO | NULL | FK to email_addresses.id |
| `bean_id` | char(36) | NO | NULL | FK to contacts.id |
| `bean_module` | varchar(100) | NO | 'Contacts' | Module name |
| `primary_address` | tinyint(1) | NO | 0 | Primary email flag |
| `email_opt_out` | tinyint(1) | NO | 0 | Opt-out flag |
| `invalid_email` | tinyint(1) | NO | 0 | Invalid email flag |
| `deleted` | tinyint(1) | NO | 0 | Soft delete flag |

**Constraints**:
- Only one `primary_address = 1` per `bean_id` where `bean_module = 'Contacts'` and `deleted = 0`

### Audit Trail Table

**Table**: `contacts_audit`

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | char(36) | NO | - | Primary key (GUID) |
| `parent_id` | char(36) | NO | NULL | FK to contacts.id |
| `field_name` | varchar(255) | NO | NULL | Name of changed field |
| `data_type` | varchar(255) | NO | NULL | Data type (string, text, int, double, date, datetime, bool) |
| `before_value_string` | varchar(255) | YES | NULL | Before value for string/text fields |
| `after_value_string` | varchar(255) | YES | NULL | After value for string/text fields |
| `before_value_text` | text | YES | NULL | Before value for large text fields |
| `after_value_text` | text | YES | NULL | After value for large text fields |
| `created_by` | char(36) | NO | NULL | FK to users.id (user who made change) |
| `date_created` | datetime | NO | CURRENT_TIMESTAMP | Timestamp when change was made |

---

## API Endpoint Specifications

### Base URL

All Contacts API endpoints are under: `/api/contacts`

### Authentication

All endpoints require JWT authentication token in Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### List Contacts
- **Method**: GET
- **Path**: `/api/contacts`
- **Query Parameters**:
  - `page[offset]` (integer, optional): Pagination offset (default: 0)
  - `page[limit]` (integer, optional): Records per page (default: 20, max: 100)
  - `filter[fieldName]` (string/object, optional): Filter criteria
  - `sort` (string, optional): Sort field and direction (e.g., "name", "-date_created")
  - `fields[Contacts]` (string, optional): Comma-separated field list
- **Response**: 200 OK with JSON-API collection format

#### Get Single Contact
- **Method**: GET
- **Path**: `/api/contacts/:id`
- **Path Parameters**:
  - `id` (string, required): Contact GUID
- **Query Parameters**:
  - `fields[Contacts]` (string, optional): Comma-separated field list
- **Response**: 200 OK with JSON-API single resource format

#### Create Contact
- **Method**: POST
- **Path**: `/api/contacts`
- **Request Body**: JSON-API format with contact data
- **Response**: 201 Created with created contact

#### Update Contact
- **Method**: PATCH
- **Path**: `/api/contacts/:id`
- **Path Parameters**:
  - `id` (string, required): Contact GUID
- **Request Body**: JSON-API format with fields to update
- **Response**: 200 OK with updated contact

#### Delete Contact
- **Method**: DELETE
- **Path**: `/api/contacts/:id`
- **Path Parameters**:
  - `id` (string, required): Contact GUID
- **Response**: 200 OK with success confirmation

#### Bulk Actions
- **Method**: POST
- **Path**: `/api/contacts/bulk-action`
- **Request Body**:
  ```json
  {
    "contactIds": ["guid1", "guid2"],
    "action": "delete|export|merge|mass-update|add-to-target-list|print-pdf"
  }
  ```
- **Response**: 200 OK or 202 Accepted (async) with action results

#### Import vCard
- **Method**: POST
- **Path**: `/api/contacts/import-vcard`
- **Request**: multipart/form-data
  - `file` (file, required): vCard file (.vcf or .vcard)
- **Response**: 201 Created with created contact

#### Bulk Import
- **Method**: POST
- **Path**: `/api/contacts/import`
- **Request**: multipart/form-data
  - `file` (file, required): CSV or Excel file
  - `mapping` (object, optional): Field mapping configuration
- **Response**: 202 Accepted with job ID for async processing

#### Get Recently Viewed
- **Method**: GET
- **Path**: `/api/contacts/recently-viewed`
- **Query Parameters**:
  - `limit` (integer, optional): Number of contacts (default: 10, max: 50)
- **Response**: 200 OK with array of recently viewed contacts

#### Column Preferences
- **Method**: GET/POST/PUT
- **Path**: `/api/contacts/column-preferences`
- **Request Body** (POST/PUT):
  ```json
  {
    "columns": [
      {
        "fieldName": "name",
        "visible": true,
        "order": 1
      }
    ]
  }
  ```
- **Response**: 200 OK with saved preferences

---

## Validation Rules

### Required Fields

- `lastName` - MUST be provided and not empty

### Field Validations

- **Email Address**: Must be valid email format (RFC 5322)
- **Phone Number**: Should be valid phone format (flexible, accepts various formats)
- **Foreign Keys**: Must reference existing, non-deleted records:
  - `accountId` → must exist in `accounts` table and `deleted = 0`
  - `assignedUserId` → must exist in `users` table and `status = 'Active'`
  - `reportsToId` → must exist in `contacts` table, `deleted = 0`, and not create circular reference
  - `campaignId` → must exist in `campaigns` table and `deleted = 0`

### Business Rules

- Only one email address per contact can be marked as primary
- `reportsToId` cannot create circular references (Contact A → Contact B → Contact A)
- `assignedUserId` defaults to current user if not provided
- Soft-deleted contacts (`deleted = 1`) are excluded from all queries by default

---

## Error Codes

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Field validation failed |
| `CONTACT_NOT_FOUND` | 404 | Contact with specified ID not found |
| `ACCESS_DENIED` | 403 | User lacks permission to access contact |
| `INVALID_REFERENCE` | 400 | Foreign key reference is invalid |
| `INVALID_VCARD_FORMAT` | 400 | vCard file format is invalid |
| `VCARD_PARSE_ERROR` | 400 | vCard file cannot be parsed |
| `MULTIPLE_PRIMARY_EMAILS` | 400 | Multiple emails marked as primary |
| `CIRCULAR_REFERENCE` | 400 | Circular reference in Reports To relationship |
| `UNAUTHORIZED` | 401 | Authentication token missing or invalid |
| `FORBIDDEN` | 403 | User lacks required permissions |
| `INTERNAL_SERVER_ERROR` | 500 | Server-side error occurred |

---

## Data Transformation Patterns

### Date/Time Transformations

**API → Frontend**:
- ISO 8601 format: `"2024-01-01T12:30:45Z"` → Display format: `"2024-01-01 12:30"` or `"Jan 1, 2024 12:30 PM"`

**Frontend → API**:
- Display format: `"2024-01-01 12:30"` → ISO 8601 format: `"2024-01-01T12:30:00Z"`

### Boolean Transformations

**API → Frontend**:
- API boolean: `true` → Form checkbox: checked
- API boolean: `false` → Form checkbox: unchecked

**Frontend → API**:
- Form checkbox: checked → API boolean: `true`
- Form checkbox: unchecked → API boolean: `false`

### Relationship Transformations

**API → Frontend**:
- JSON-API relationship: `{ "data": { "type": "Accounts", "id": "guid" } }` → Form field value: `"guid"` or `{ id: "guid", name: "Account Name" }`

**Frontend → API**:
- Form field value: `"guid"` → JSON-API relationship: `{ "data": { "type": "Accounts", "id": "guid" } }`

### Email Address Transformations

**API → Frontend**:
- Email addresses from `email_addr_bean_rel` → Array of email objects with `emailAddress`, `primary`, `optOut`, `invalid` flags

**Frontend → API**:
- Array of email objects → Create/update entries in `email_addr_bean_rel` join table

---

## Performance Specifications

### Response Time Targets

- **List Contacts**: ≤ 500ms (95th percentile)
- **Get Single Contact**: ≤ 200ms (95th percentile)
- **Create Contact**: ≤ 1 second (95th percentile)
- **Update Contact**: ≤ 500ms (95th percentile)
- **Delete Contact**: ≤ 300ms (95th percentile)

### Concurrency Targets

- Support 1000 concurrent contact list requests without degradation
- Support 100 concurrent contact create/update requests

### Database Optimization

- Use database indexes for frequently queried fields
- Use composite indexes for common filter combinations
- Implement query optimization for pagination
- Use connection pooling for database connections

---

## Security Specifications

### Authentication

- All endpoints require valid JWT authentication token
- Token must be included in `Authorization: Bearer <token>` header
- Token validation must check expiration and signature

### Authorization

- Role-based access control (Admin vs Employee)
- Record-level access control based on ownership
- Permission checks before all operations

### Input Validation

- Validate and sanitize all input data
- Use parameterized queries or ORM to prevent SQL injection
- Validate file uploads (type, size, content)
- Validate email format, phone format, etc.

### Data Protection

- Never expose sensitive data in error messages
- Use soft delete instead of physical deletion
- Maintain audit trail for all modifications
- Encrypt sensitive data if required by business rules

---

## Integration Patterns

### Frontend-Backend Communication

1. **Request Flow**:
   - Frontend constructs JSON-API request format
   - Frontend sends HTTP request with JWT token
   - Backend validates token and permissions
   - Backend processes request and returns JSON-API response

2. **Response Handling**:
   - Frontend parses JSON-API response format
   - Frontend extracts `data.attributes` for form fields
   - Frontend extracts `data.relationships` for related records
   - Frontend handles errors from `errors` array

3. **Error Handling**:
   - Frontend parses JSON-API error format
   - Frontend maps `source.pointer` to form fields
   - Frontend displays error messages from `detail` field

### Module Integration

- **Accounts Module**: Contact `accountId` references Account `id`
- **Users Module**: Contact `assignedUserId` references User `id`
- **Campaigns Module**: Contact `campaignId` references Campaign `id`
- **Calls/Meetings/Tasks/Emails**: Reference contact via `parent_id` and `parent_type='Contacts'`

---

## Notes

- All specifications follow JSON-API 1.0 standard
- Database schema follows SuiteCRM 8.9.1 patterns adapted for modern implementation
- All datetime values use ISO 8601 format in API
- All GUIDs use UUID v4 format
- Soft delete pattern ensures data preservation
- Audit trail captures all field-level changes

For detailed requirements, refer to:
- `requirements/contacts/backend-requirements.md`
- `requirements/contacts/frontend-requirements.md`

