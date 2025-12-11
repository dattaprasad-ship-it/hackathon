# API Contracts: OrangeHRM PIM Module

**Date**: December 09, 2025  
**Base URL**: `/api`  
**Content-Type**: `application/json`

## Employee Endpoints

### GET /api/employees

List all employees with optional filtering and pagination.

**Query Parameters**:
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Records per page (default: 50, max: 500)
- `employee_name` (string, optional): Search by employee name
- `employee_id` (string, optional): Search by employee ID
- `employment_status` (integer, optional): Filter by employment status ID
- `job_title` (integer, optional): Filter by job title ID
- `sub_unit` (integer, optional): Filter by sub-unit ID
- `supervisor` (string, optional): Search by supervisor name
- `include` (string, optional): "current" (default) or "all"
- `sort_by` (string, optional): Column to sort by
- `sort_order` (string, optional): "asc" or "desc" (default: "asc")

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "employee_id": "0445",
      "first_name": "John",
      "middle_name": "Michael",
      "last_name": "Doe",
      "job_title": "Software Engineer",
      "employment_status": "Active",
      "sub_unit": "Engineering",
      "supervisor": "Jane Smith",
      "actions": ["edit", "delete"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 158,
    "total_pages": 4
  },
  "record_count": "(158) Records Found"
}
```

### POST /api/employees

Create a new employee record.

**Request Body**:
```json
{
  "employee_id": "0445",
  "first_name": "John",
  "middle_name": "Michael",
  "last_name": "Doe",
  "job_title_id": 1,
  "employment_status_id": 1,
  "sub_unit_id": 2,
  "supervisor_id": 5,
  "reporting_method_id": 1,
  "profile_photo": "<base64_encoded_image>",
  "create_login_details": true,
  "username": "jdoe",
  "password": "SecurePass123!",
  "confirm_password": "SecurePass123!",
  "login_status": "Enabled"
}
```

**Response**: `201 Created`
```json
{
  "id": 1,
  "employee_id": "0445",
  "first_name": "John",
  "last_name": "Doe",
  "created_at": "2025-12-09T10:00:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Validation errors
- `409 Conflict`: Duplicate employee ID or username

### GET /api/employees/[id]

Get a single employee by ID.

**Response**: `200 OK`
```json
{
  "id": 1,
  "employee_id": "0445",
  "first_name": "John",
  "middle_name": "Michael",
  "last_name": "Doe",
  "job_title": "Software Engineer",
  "employment_status": "Active",
  "sub_unit": "Engineering",
  "supervisor": "Jane Smith",
  "profile_photo_url": "/api/employees/1/photo",
  "custom_fields": [
    {
      "field_name": "Blood Type",
      "value": "O+"
    }
  ],
  "created_at": "2025-12-09T10:00:00Z",
  "updated_at": "2025-12-09T10:00:00Z"
}
```

**Error Responses**:
- `404 Not Found`: Employee not found

### PUT /api/employees/[id]

Update an existing employee record.

**Request Body**: Same as POST /api/employees (all fields optional except those being updated)

**Response**: `200 OK`
```json
{
  "id": 1,
  "employee_id": "0445",
  "first_name": "John",
  "last_name": "Doe",
  "updated_at": "2025-12-09T11:00:00Z",
  "conflict_warning": false
}
```

**Error Responses**:
- `400 Bad Request`: Validation errors
- `404 Not Found`: Employee not found
- `409 Conflict`: Concurrent edit detected (returns `conflict_warning: true`)

### DELETE /api/employees/[id]

Soft delete an employee record.

**Response**: `200 OK`
```json
{
  "id": 1,
  "message": "Employee deleted successfully"
}
```

**Error Responses**:
- `404 Not Found`: Employee not found
- `400 Bad Request`: Cannot delete (e.g., has subordinates)

### POST /api/employees/search

Advanced search with multiple criteria.

**Request Body**:
```json
{
  "employee_name": "John",
  "employee_id": null,
  "employment_status_id": 1,
  "job_title_id": 2,
  "sub_unit_id": 3,
  "supervisor_name": "Jane",
  "include": "current"
}
```

**Response**: `200 OK` (same format as GET /api/employees)

## Report Endpoints

### GET /api/reports

List all reports (predefined and custom).

**Query Parameters**:
- `search` (string, optional): Search by report name

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "report_name": "All Employee Sub Unit Hierarchy Report",
      "is_predefined": true,
      "actions": ["view", "edit", "delete"]
    }
  ],
  "total": 5
}
```

### POST /api/reports

Create a new custom report.

**Request Body**:
```json
{
  "report_name": "Engineering Team Report",
  "selection_criteria": [
    {
      "criteria_type": "Sub Unit",
      "criteria_value": "Engineering",
      "include_option": "Current Employees Only"
    }
  ],
  "display_fields": [
    {
      "field_group": "Personal",
      "field_name": "Employee First Name",
      "include_header": true,
      "display_order": 1
    },
    {
      "field_group": "Personal",
      "field_name": "Employee Last Name",
      "include_header": false,
      "display_order": 2
    },
    {
      "field_group": "Job",
      "field_name": "Job Title",
      "include_header": true,
      "display_order": 3
    }
  ]
}
```

**Response**: `201 Created`
```json
{
  "id": 6,
  "report_name": "Engineering Team Report",
  "created_at": "2025-12-09T10:00:00Z"
}
```

### GET /api/reports/[id]

Get report definition.

**Response**: `200 OK`
```json
{
  "id": 6,
  "report_name": "Engineering Team Report",
  "selection_criteria": [...],
  "display_fields": [...]
}
```

### PUT /api/reports/[id]

Update report definition.

**Request Body**: Same as POST /api/reports

**Response**: `200 OK` (same format as GET)

### DELETE /api/reports/[id]

Delete a custom report.

**Response**: `200 OK`
```json
{
  "message": "Report deleted successfully"
}
```

### POST /api/reports/[id]/execute

Execute a report and generate output.

**Response**: `200 OK`
```json
{
  "report_name": "Engineering Team Report",
  "generated_at": "2025-12-09T10:00:00Z",
  "data": [
    {
      "Employee First Name": "John",
      "Employee Last Name": "Doe",
      "Job Title": "Software Engineer"
    }
  ],
  "record_count": 25
}
```

## Configuration Endpoints

### GET /api/config

Get PIM configuration settings.

**Response**: `200 OK`
```json
{
  "show_deprecated_fields": false,
  "show_ssn_field": true,
  "show_sin_field": false,
  "show_us_tax_exemptions": true
}
```

### PUT /api/config

Update PIM configuration settings.

**Request Body**:
```json
{
  "show_deprecated_fields": true,
  "show_ssn_field": true,
  "show_sin_field": false,
  "show_us_tax_exemptions": true
}
```

**Response**: `200 OK`
```json
{
  "message": "Configuration updated successfully",
  "updated_at": "2025-12-09T10:00:00Z"
}
```

## Custom Fields Endpoints

### GET /api/custom-fields

List all custom fields.

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "field_name": "Blood Type",
      "screen": "Personal Details",
      "field_type": "Drop Down",
      "select_options": "A+,A-,B+,B-,O+,O-,AB+,AB-",
      "actions": ["edit", "delete"]
    }
  ],
  "total": 2,
  "remaining": 8
}
```

### POST /api/custom-fields

Create a new custom field.

**Request Body**:
```json
{
  "field_name": "Emergency Contact",
  "screen": "Personal Details",
  "field_type": "Text or Number",
  "select_options": null
}
```

**Response**: `201 Created`
```json
{
  "id": 3,
  "field_name": "Emergency Contact",
  "remaining": 7
}
```

**Error Responses**:
- `400 Bad Request`: Validation errors, limit reached
- `409 Conflict`: Field name already exists

### GET /api/custom-fields/[id]

Get custom field definition.

**Response**: `200 OK` (same format as list item)

### PUT /api/custom-fields/[id]

Update custom field definition.

**Request Body**: Same as POST

**Response**: `200 OK`

### DELETE /api/custom-fields/[id]

Delete a custom field.

**Response**: `200 OK` or `400 Bad Request` with error "Custom field(s) in use"

## Import Endpoints

### GET /api/import/sample

Download sample CSV template.

**Response**: `200 OK` (CSV file download)

### POST /api/import

Import employee data from CSV file.

**Request**: `multipart/form-data`
- `file` (file, required): CSV file (max 1MB, max 100 records)

**Response**: `200 OK`
```json
{
  "success": true,
  "records_imported": 95,
  "records_failed": 5,
  "errors": [
    {
      "row": 3,
      "error": "Invalid date format. Expected YYYY-MM-DD"
    },
    {
      "row": 7,
      "error": "Missing required field: Last Name"
    }
  ]
}
```

**Error Responses**:
- `400 Bad Request`: File too large, invalid format, too many records

## Attachment Endpoints

### POST /api/attachments

Upload an attachment for an employee.

**Request**: `multipart/form-data`
- `employee_id` (integer, required)
- `file` (file, required): Max 5MB, allowed types: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG
- `description` (string, optional)

**Response**: `201 Created`
```json
{
  "id": 1,
  "file_name": "resume.pdf",
  "file_size": 245678,
  "file_type": "application/pdf",
  "date_added": "2025-12-09T10:00:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: File too large, invalid file type, validation errors

### GET /api/attachments/[id]

Download an attachment file.

**Response**: `200 OK` (file download)

### DELETE /api/attachments/[id]

Delete an attachment.

**Response**: `200 OK`
```json
{
  "message": "Attachment deleted successfully"
}
```

## Lookup Data Endpoints

### GET /api/lookup/job-titles

Get all job titles.

**Response**: `200 OK`
```json
{
  "data": [
    {"id": 1, "title": "Software Engineer"},
    {"id": 2, "title": "Product Manager"}
  ]
}
```

### GET /api/lookup/employment-statuses

Get all employment statuses.

**Response**: `200 OK`
```json
{
  "data": [
    {"id": 1, "status": "Active"},
    {"id": 2, "status": "Inactive"},
    {"id": 3, "status": "Terminated"}
  ]
}
```

### GET /api/lookup/sub-units

Get all sub-units.

**Response**: `200 OK`
```json
{
  "data": [
    {"id": 1, "name": "Engineering", "parent_id": null},
    {"id": 2, "name": "Product", "parent_id": null}
  ]
}
```

### GET /api/lookup/termination-reasons

Get all termination reasons.

**Response**: `200 OK`
```json
{
  "data": [
    {"id": 1, "name": "Resigned"},
    {"id": 2, "name": "Dismissed"}
  ]
}
```

### GET /api/lookup/reporting-methods

Get all reporting methods.

**Response**: `200 OK`
```json
{
  "data": [
    {"id": 1, "name": "Direct"},
    {"id": 2, "name": "Indirect"}
  ]
}
```

## Error Response Format

All error responses follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Employee ID already exists",
    "details": {
      "field": "employee_id",
      "value": "0445"
    }
  }
}
```

**Common Error Codes**:
- `VALIDATION_ERROR`: Input validation failed
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Duplicate or conflicting data
- `UNAUTHORIZED`: Permission denied
- `FORBIDDEN`: Access forbidden
- `INTERNAL_ERROR`: Server error

## Authentication

**Note**: For MVP, authentication can be simulated via dummy API. Real authentication can be added later.

**Dummy Auth Endpoint**: `POST /api/dummy/auth/login`
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response**:
```json
{
  "token": "dummy_token_12345",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "HR Admin"
  }
}
```

## Rate Limiting

**Note**: For local development, rate limiting not required. Can be added for production.

## Pagination

All list endpoints support pagination:
- Default page size: 50
- Maximum page size: 500
- Page numbers start at 1

