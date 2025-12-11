# Data Model: OrangeHRM PIM Module

**Date**: December 09, 2025  
**Feature**: OrangeHRM Personnel Information Management (PIM) Module

## Database Schema

### Core Tables

#### employees

Primary entity representing employees in the organization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique employee record identifier |
| employee_id | TEXT | UNIQUE, NOT NULL | User-facing employee ID (e.g., "0445") |
| first_name | TEXT | NOT NULL | Employee first name |
| middle_name | TEXT | NULL | Employee middle name (optional) |
| last_name | TEXT | NOT NULL | Employee last name |
| job_title_id | INTEGER | FOREIGN KEY → job_titles(id) | Reference to job title |
| employment_status_id | INTEGER | FOREIGN KEY → employment_statuses(id) | Reference to employment status |
| sub_unit_id | INTEGER | FOREIGN KEY → sub_units(id) | Reference to organizational sub-unit |
| supervisor_id | INTEGER | FOREIGN KEY → employees(id) | Self-referential: reporting manager |
| reporting_method_id | INTEGER | FOREIGN KEY → reporting_methods(id) | Type of reporting relationship |
| profile_photo_path | TEXT | NULL | File path to profile photo (max 1MB, jpg/png/gif) |
| username | TEXT | NULL, UNIQUE | Login username (if login details created) |
| password_hash | TEXT | NULL | Hashed password (if login details created) |
| login_status | TEXT | NULL | "Enabled" or "Disabled" (if login details created) |
| is_deleted | INTEGER | NOT NULL, DEFAULT 0 | Soft delete flag (0=active, 1=deleted) |
| created_at | TEXT | NOT NULL | ISO 8601 timestamp |
| updated_at | TEXT | NOT NULL | ISO 8601 timestamp (for conflict detection) |
| created_by | TEXT | NULL | User who created the record |
| updated_by | TEXT | NULL | User who last updated the record |

**Indexes**:
- `idx_employees_employee_id` on `employee_id`
- `idx_employees_employment_status` on `employment_status_id`
- `idx_employees_job_title` on `job_title_id`
- `idx_employees_sub_unit` on `sub_unit_id`
- `idx_employees_supervisor` on `supervisor_id`
- `idx_employees_is_deleted` on `is_deleted`
- `idx_employees_name` on `first_name`, `last_name` (for search)

**Validation Rules**:
- `employee_id` must be unique across all non-deleted employees (FR-033)
- `first_name` and `last_name` are required (FR-006)
- `username` must be unique if provided (FR-034)
- `supervisor_id` must reference a valid, non-deleted employee (FR-035)

**State Transitions**:
- Created → Active (default state)
- Active → Deleted (soft delete, sets `is_deleted=1`)
- Deleted records retained for audit/compliance (FR-070, FR-071)

#### custom_fields

User-defined fields that extend the standard employee data model.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique custom field identifier |
| field_name | TEXT | NOT NULL, UNIQUE | Name of the custom field |
| screen | TEXT | NOT NULL | Screen where field appears (e.g., "Personal Details") |
| field_type | TEXT | NOT NULL | Type: "Drop Down", "Text or Number" |
| select_options | TEXT | NULL | Comma-separated values for dropdown type |
| is_deleted | INTEGER | NOT NULL, DEFAULT 0 | Soft delete flag |
| created_at | TEXT | NOT NULL | ISO 8601 timestamp |
| updated_at | TEXT | NOT NULL | ISO 8601 timestamp |

**Constraints**:
- Maximum 10 custom fields total (FR-047)
- `field_name` must be unique
- `select_options` required if `field_type` is "Drop Down"
- Cannot delete if in use by employee records (FR-052)

**Validation Rules**:
- `field_name` uniqueness (FR-251 edge case)
- `screen` must be valid screen name
- `field_type` must be one of: "Drop Down", "Text or Number"

#### employee_custom_values

Stores values for custom fields per employee.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique value identifier |
| employee_id | INTEGER | NOT NULL, FOREIGN KEY → employees(id) | Reference to employee |
| custom_field_id | INTEGER | NOT NULL, FOREIGN KEY → custom_fields(id) | Reference to custom field |
| value | TEXT | NULL | Stored value (text, number, or selected option) |
| created_at | TEXT | NOT NULL | ISO 8601 timestamp |
| updated_at | TEXT | NOT NULL | ISO 8601 timestamp |

**Indexes**:
- `idx_employee_custom_values_employee` on `employee_id`
- `idx_employee_custom_values_field` on `custom_field_id`
- UNIQUE constraint on (`employee_id`, `custom_field_id`)

#### reports

Report definitions (predefined and custom).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique report identifier |
| report_name | TEXT | NOT NULL, UNIQUE | Name of the report |
| is_predefined | INTEGER | NOT NULL, DEFAULT 0 | 1 for predefined, 0 for custom |
| created_at | TEXT | NOT NULL | ISO 8601 timestamp |
| updated_at | TEXT | NOT NULL | ISO 8601 timestamp |

**Predefined Reports** (inserted via migration):
- "All Employee Sub Unit Hierarchy Report"
- "Employee Contact info report"
- "Employee Job Details"
- "PIM Sample Report"
- "PT"

#### report_selection_criteria

Selection criteria (filters) for reports.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique criteria identifier |
| report_id | INTEGER | NOT NULL, FOREIGN KEY → reports(id) | Reference to report |
| criteria_type | TEXT | NOT NULL | Type of criteria (e.g., "Employment Status", "Job Title") |
| criteria_value | TEXT | NOT NULL | Value for the criteria |
| include_option | TEXT | NULL | "Current Employees Only" or NULL |

**Indexes**:
- `idx_report_criteria_report` on `report_id`

#### report_display_fields

Display fields (columns) for reports, organized by groups.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique display field identifier |
| report_id | INTEGER | NOT NULL, FOREIGN KEY → reports(id) | Reference to report |
| field_group | TEXT | NOT NULL | Display field group (e.g., "Personal", "Job") |
| field_name | TEXT | NOT NULL | Specific field within the group |
| include_header | INTEGER | NOT NULL, DEFAULT 0 | 1 to include header row for group |
| display_order | INTEGER | NOT NULL | Order of field in report output |

**Indexes**:
- `idx_report_display_fields_report` on `report_id`
- `idx_report_display_fields_order` on `report_id`, `display_order`

#### attachments

Employee attachment metadata.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique attachment identifier |
| employee_id | INTEGER | NOT NULL, FOREIGN KEY → employees(id) | Reference to employee |
| file_name | TEXT | NOT NULL | Original file name |
| file_path | TEXT | NOT NULL | Storage path on filesystem |
| description | TEXT | NULL | Optional description |
| file_size | INTEGER | NOT NULL | File size in bytes (max 5MB) |
| file_type | TEXT | NOT NULL | MIME type or file extension |
| date_added | TEXT | NOT NULL | ISO 8601 timestamp |
| added_by | TEXT | NOT NULL | Username of user who uploaded |
| created_at | TEXT | NOT NULL | ISO 8601 timestamp |

**Indexes**:
- `idx_attachments_employee` on `employee_id`

**Validation Rules**:
- `file_size` must be <= 5MB (FR-072)
- `file_type` must be in allowed list: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG (FR-073)

#### termination_reasons

Standardized termination reason lookup.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique reason identifier |
| name | TEXT | NOT NULL, UNIQUE | Termination reason name |
| is_deleted | INTEGER | NOT NULL, DEFAULT 0 | Soft delete flag |
| created_at | TEXT | NOT NULL | ISO 8601 timestamp |
| updated_at | TEXT | NOT NULL | ISO 8601 timestamp |

**Predefined Reasons** (inserted via migration):
- "Contract Not Renewed"
- "Deceased"
- "Dismissed"
- "Laid-off"
- "Other"
- "Physically Disabled/Compensated"
- "Resigned"
- "Resigned - Company Requested"

**Constraints**:
- `name` must be unique (FR-085)
- Cannot delete if assigned to terminated employees

#### reporting_methods

Reporting method lookup for organizational relationships.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique method identifier |
| name | TEXT | NOT NULL, UNIQUE | Reporting method name (e.g., "Direct", "Indirect") |
| is_deleted | INTEGER | NOT NULL, DEFAULT 0 | Soft delete flag |
| created_at | TEXT | NOT NULL | ISO 8601 timestamp |
| updated_at | TEXT | NOT NULL | ISO 8601 timestamp |

**Predefined Methods** (inserted via migration):
- "Direct"
- "Indirect"

**Constraints**:
- `name` must be unique (FR-086)
- Cannot delete if in use by employee reporting relationships (FR-082)

#### pim_config

System-wide PIM configuration settings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique config identifier |
| config_key | TEXT | NOT NULL, UNIQUE | Configuration key |
| config_value | TEXT | NOT NULL | Configuration value (JSON or text) |
| updated_at | TEXT | NOT NULL | ISO 8601 timestamp |
| updated_by | TEXT | NULL | User who last updated |

**Configuration Keys**:
- `show_deprecated_fields` - Boolean (show Nick Name, Smoker, Military Service)
- `show_ssn_field` - Boolean (show SSN field in Personal Details)
- `show_sin_field` - Boolean (show SIN field in Personal Details)
- `show_us_tax_exemptions` - Boolean (show US Tax Exemptions menu)

### Lookup Tables

#### job_titles

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique job title identifier |
| title | TEXT | NOT NULL, UNIQUE | Job title name |

#### employment_statuses

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique status identifier |
| status | TEXT | NOT NULL, UNIQUE | Employment status (e.g., "Active", "Inactive", "Terminated") |

**Predefined Statuses**:
- "Active"
- "Inactive"
- "Terminated"

#### sub_units

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique sub-unit identifier |
| name | TEXT | NOT NULL, UNIQUE | Sub-unit name |
| parent_id | INTEGER | NULL, FOREIGN KEY → sub_units(id) | Parent sub-unit for hierarchy |

### Audit & Migration Tables

#### schema_migrations

Tracks applied database migrations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| version | TEXT | PRIMARY KEY | Migration version number |
| applied_at | TEXT | NOT NULL | ISO 8601 timestamp when migration was applied |

## Entity Relationships

### Employee Relationships

```
employees
├── job_title_id → job_titles(id)
├── employment_status_id → employment_statuses(id)
├── sub_unit_id → sub_units(id)
├── supervisor_id → employees(id) [self-referential]
├── reporting_method_id → reporting_methods(id)
└── employee_custom_values → employee_custom_values(employee_id)
    └── custom_field_id → custom_fields(id)
```

### Report Relationships

```
reports
├── report_selection_criteria → report_selection_criteria(report_id)
└── report_display_fields → report_display_fields(report_id)
```

### Attachment Relationships

```
employees
└── attachments → attachments(employee_id)
```

## Data Validation Rules

### Employee Validation

1. **Employee ID Uniqueness** (FR-033):
   - Must be unique across all non-deleted employees
   - Checked on create and update
   - Error message: "Employee ID already exists"

2. **Required Fields** (FR-006):
   - `first_name` and `last_name` are mandatory
   - Validation on client and server

3. **Username Uniqueness** (FR-034):
   - If login details are created, username must be unique
   - Checked only when `username` is provided

4. **Supervisor Referential Integrity** (FR-035):
   - `supervisor_id` must reference a valid, non-deleted employee
   - Cannot create circular supervisor relationships
   - Cannot delete employee who has subordinates

### Custom Field Validation

1. **Field Limit** (FR-047):
   - Maximum 10 custom fields total
   - Check count before allowing creation
   - Display "Remaining number of custom fields: X"

2. **Field Name Uniqueness**:
   - `field_name` must be unique across all custom fields

3. **Deletion Prevention** (FR-052):
   - Cannot delete custom field if referenced in `employee_custom_values`
   - Error message: "Custom field(s) in use"

### Report Validation

1. **Report Name Uniqueness**:
   - `report_name` must be unique

2. **Display Fields Requirement**:
   - Custom reports must have at least one display field
   - Validation on save

### Attachment Validation

1. **File Size** (FR-072):
   - Maximum 5MB per file
   - Validation on upload

2. **File Type** (FR-073, FR-076):
   - Allowed types: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG
   - Block executables and scripts
   - Validation on upload

### CSV Import Validation

1. **File Size** (FR-058):
   - Maximum 1MB per CSV file

2. **Record Count** (FR-059):
   - Maximum 100 records per file

3. **Required Fields** (FR-059):
   - First Name and Last Name are compulsory

4. **Date Format** (FR-060):
   - All dates must be YYYY-MM-DD format

5. **Gender Values** (FR-061):
   - Must be "Male" or "Female" only

6. **Column Order** (FR-059):
   - Column order must match sample CSV template

## Data Lifecycle

### Employee Lifecycle

1. **Creation**:
   - Employee record created with `is_deleted=0`
   - `employee_id` auto-generated or user-provided
   - `created_at` and `updated_at` set to current timestamp

2. **Update**:
   - `updated_at` timestamp updated
   - Concurrent edit detection via `updated_at` comparison
   - Last-write-wins strategy (FR-066)

3. **Soft Delete** (FR-070, FR-071):
   - `is_deleted` set to 1
   - Record retained in database
   - Not shown in default employee list (filtered by `is_deleted=0`)
   - Can be restored if needed

### Custom Field Lifecycle

1. **Creation**:
   - Check total count (max 10)
   - Validate field name uniqueness
   - Create record

2. **Update**:
   - Allow modification of field definition
   - For dropdown fields, update `select_options`

3. **Deletion**:
   - Check if field is in use
   - If in use, prevent deletion (FR-052)
   - If not in use, soft delete

### Report Lifecycle

1. **Creation**:
   - Validate report name uniqueness
   - Require at least one display field
   - Save selection criteria and display fields

2. **Execution**:
   - Apply selection criteria to filter employees
   - Generate output with specified display fields
   - Return results or download as file

3. **Deletion**:
   - Hard delete (reports are definitions, not data)

## Data Volume Assumptions

- **Employees**: Up to 1000 records
- **Custom Fields**: Maximum 10 per organization
- **Reports**: Unlimited (but typically < 50)
- **Attachments**: Average 2-3 per employee (2000-3000 total)
- **CSV Imports**: Typically 1-5 files during initial setup

## Indexing Strategy

### Primary Indexes
- All primary keys (automatic in SQLite)

### Foreign Key Indexes
- All foreign key columns indexed for join performance

### Search Indexes
- Employee name search: Composite index on `first_name`, `last_name`
- Filter indexes: `employment_status_id`, `job_title_id`, `sub_unit_id`
- Soft delete filter: `is_deleted` index

### Unique Constraints
- `employee_id` (with `is_deleted=0` filter in application logic)
- `username` (when provided)
- `custom_fields.field_name`
- `reports.report_name`
- `termination_reasons.name`
- `reporting_methods.name`

## Data Migration Strategy

1. **Initial Schema**: Create all tables with proper constraints
2. **Seed Data**: Insert predefined lookup values (employment statuses, job titles, predefined reports, termination reasons, reporting methods)
3. **Version Tracking**: Use `schema_migrations` table to track applied migrations
4. **Rollback**: SQLite3 doesn't support transactions for DDL, so migrations are forward-only

## Backup & Recovery

- **Backup**: Copy SQLite database file (`database.db`) and `uploads/` directory
- **Recovery**: Restore database file and uploads directory
- **Soft Delete Recovery**: Update `is_deleted=0` to restore deleted records

