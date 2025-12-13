# SuiteCRM 8.9.1 - Backend Requirements (Legacy Source Analysis)

This document extracts backend specifications from the legacy SuiteCRM source code.

---

## DB Schema

### Core Tables

#### Accounts Table (`accounts`)
- **Primary Key**: `id` (char(36), GUID)
- **Key Fields**:
  - `name` (varchar) - Account name
  - `parent_id` (char(36)) - Self-referential FK to accounts.id
  - `sic_code` (varchar(10)) - SIC code
  - `assigned_user_id` (char(36)) - FK to users.id
  - `created_by` (char(36)) - FK to users.id
  - `modified_user_id` (char(36)) - FK to users.id
  - `date_entered` (datetime)
  - `date_modified` (datetime)
  - `deleted` (tinyint(1)) - Soft delete flag (0=active, 1=deleted)
- **Indices**:
  - `idx_accnt_id_del` on (id, deleted)
  - `idx_accnt_name_del` on (name, deleted)
  - `idx_accnt_assigned_del` on (deleted, assigned_user_id)
  - `idx_accnt_parent_id` on (parent_id)
- **Relationships**:
  - One-to-many with Accounts (parent-child via parent_id)
  - One-to-many with Cases (via account_id)
  - One-to-many with Opportunities (via accounts_opportunities)
  - One-to-many with Contacts (via accounts_contacts)
  - Many-to-many with EmailAddresses (via email_addr_bean_rel)

#### Opportunities Table (`opportunities`)
- **Primary Key**: `id` (char(36), GUID)
- **Key Fields**:
  - `name` (varchar(50)) - Required, searchable
  - `account_id` (char(36)) - FK to accounts.id
  - `amount` (double) - Currency amount, required
  - `amount_usdollar` (double) - USD converted amount
  - `currency_id` (char(36)) - FK to currencies.id
  - `sales_stage` (varchar(255), enum) - Required, audited
  - `probability` (double) - Range 0-100, audited
  - `date_closed` (date) - Required, audited
  - `opportunity_type` (varchar(255), enum) - Audited
  - `lead_source` (varchar(50), enum)
  - `next_step` (varchar(100))
  - `campaign_id` (char(36)) - FK to campaigns.id
  - `assigned_user_id` (char(36)) - FK to users.id
  - `deleted` (tinyint(1))
- **Indices**:
  - `idx_opp_name` on (name)
  - `idx_opp_assigned` on (assigned_user_id)
  - `idx_opp_id_deleted` on (id, deleted)
- **Constraints**:
  - `probability` validation: range 0-100
  - `amount` required
  - `name` required
  - `sales_stage` required
  - `date_closed` required
- **Relationships**:
  - Many-to-one with Accounts (via account_id)
  - Many-to-many with Contacts (via opportunities_contacts)
  - One-to-many with Tasks/Meetings/Calls/Notes/Emails (via parent_id, parent_type='Opportunities')
  - Many-to-one with Campaigns (via campaign_id)
  - Many-to-one with Currencies (via currency_id)

#### Users Table (`users`)
- **Primary Key**: `id` (char(36), GUID)
- **Key Fields**:
  - `user_name` (varchar(60)) - Required, unique, not editable after creation
  - `user_hash` (varchar(255)) - Password hash, sensitive, not API-visible
  - `first_name` (varchar(255))
  - `last_name` (varchar(255)) - Required
  - `full_name` (varchar(510)) - Computed from first_name + last_name
  - `email1` (varchar) - Primary email, required
  - `is_admin` (bool) - Default 0
  - `status` (varchar(100), enum) - Required, values: Active/Inactive
  - `sugar_login` (bool) - Force SuiteCRM authentication, default 1
  - `external_auth_only` (bool) - Default 0
  - `authenticate_id` (varchar(100)) - For auth plugins
  - `pwd_last_changed` (datetime) - Password last changed timestamp
  - `system_generated_password` (bool) - Required
  - `reports_to_id` (char(36)) - FK to users.id (self-referential)
  - `receive_notifications` (bool) - Default 1
  - `is_group` (bool) - Group user flag
  - `portal_only` (bool) - Default 0
  - `factor_auth` (bool) - Two-factor auth enabled
  - `totp_secret` (varchar) - TOTP secret
  - `is_totp_enabled` (bool)
  - `backup_codes` (text) - Backup codes for 2FA
  - `deleted` (tinyint(1))
- **Indices**:
  - Primary key on `id`
  - Composite index on (user_name, is_group, status, last_name(30), first_name(30), id)
- **Relationships**:
  - One-to-many with Users (reports_to_id -> id)
  - Many-to-many with EmailAddresses (via email_addr_bean_rel)
  - Many-to-many with ACLRoles (via acl_roles_users)
  - Many-to-many with SecurityGroups (via securitygroups_users)

#### EmailAddresses Table (`email_addresses`)
- **Primary Key**: `id` (char(36), GUID)
- **Relationships**: Many-to-many with all modules via `email_addr_bean_rel` join table
- **Join Table**: `email_addr_bean_rel`
  - `id` (char(36)) - Primary key
  - `email_address_id` (char(36)) - FK to email_addresses.id
  - `bean_id` (char(36)) - FK to related bean
  - `bean_module` (varchar(100)) - Module name
  - `primary_address` (bool) - Primary email flag
  - `deleted` (tinyint(1))

#### Relationship Tables
- **Many-to-Many Join Tables**:
  - `accounts_opportunities` - Links accounts to opportunities
  - `opportunities_contacts` - Links opportunities to contacts (with `contact_role` enum field)
  - `accounts_contacts` - Links accounts to contacts
  - `email_addr_bean_rel` - Universal email linking table
- **Structure Pattern**: All relationship tables include:
  - `id` (char(36)) - Primary key
  - `[lhs]_id` and `[rhs]_id` - Foreign keys
  - `deleted` (tinyint(1)) - Soft delete
  - Optional: `relationship_role_column` for role-based relationships

### Common Fields Across All Modules
- `id` (char(36)) - GUID primary key
- `date_entered` (datetime) - Creation timestamp
- `date_modified` (datetime) - Last modification timestamp
- `modified_user_id` (char(36)) - FK to users.id
- `created_by` (char(36)) - FK to users.id
- `assigned_user_id` (char(36)) - FK to users.id
- `deleted` (tinyint(1)) - Soft delete flag (0=active, 1=deleted)
- `description` (text) - Optional description field

### Audit Trail Tables
- Pattern: `[module]_audit` (e.g., `accounts_audit`, `opportunities_audit`)
- Fields: `id`, `parent_id`, `field_name`, `data_type`, `before_value_string`, `after_value_string`, `before_value_text`, `after_value_text`, `created_by`, `date_created`
- Only created for modules with `'audited' => true` in vardefs

---

## API Endpoints

### Base URL
- API Root: `/Api/V8/`
- OAuth Token: `/access_token` (POST)

### Authentication
- **OAuth 2.0** using League OAuth2 Server
- **Resource Server Middleware** required for all `/V8/*` endpoints
- **Authorization Server Middleware** for token endpoint

### Module Endpoints

#### Get Module Records (List)
- **Path**: `GET /V8/module/{moduleName}`
- **Params**:
  - `moduleName` (path) - Module name (e.g., "Accounts", "Opportunities")
  - `page[offset]` (query) - Pagination offset
  - `page[limit]` (query) - Pagination limit
  - `filter` (query) - Filter criteria
  - `sort` (query) - Sort field and direction
- **Response**: 200 OK
  - JSON-API format with `data` array
  - Includes pagination links and meta
- **Validations**:
  - Module must exist
  - User must have access to module

#### Get Single Module Record
- **Path**: `GET /V8/module/{moduleName}/{id}`
- **Params**:
  - `moduleName` (path) - Module name
  - `id` (path) - Record GUID
- **Response**: 200 OK
  - JSON-API format with single record in `data`
- **Errors**: 400 Bad Request if record not found or access denied

#### Create Module Record
- **Path**: `POST /V8/module`
- **Request Body**: JSON-API format
  ```json
  {
    "data": {
      "type": "Accounts",
      "attributes": {
        "name": "Account Name",
        ...
      }
    }
  }
  ```
- **Response**: 201 Created
  - Returns created record with generated `id`
- **Validations**:
  - Required fields must be present
  - Field types must match vardefs
  - User must have create access
- **Business Logic**:
  - Auto-generates GUID if `id` not provided
  - Sets `date_entered` and `date_modified`
  - Sets `created_by` from current user
  - Calls `before_save` and `after_save` hooks

#### Update Module Record
- **Path**: `PATCH /V8/module`
- **Request Body**: JSON-API format with `id` and attributes to update
- **Response**: 201 Created (legacy behavior, should be 200 OK)
- **Validations**:
  - Record must exist
  - User must have edit access
  - Optimistic locking check if enabled
- **Business Logic**:
  - Updates `date_modified`
  - Sets `modified_user_id` from current user
  - Calls `before_save` and `after_save` hooks
  - Tracks changes for audit trail

#### Delete Module Record
- **Path**: `DELETE /V8/module/{moduleName}/{id}`
- **Params**:
  - `moduleName` (path) - Module name
  - `id` (path) - Record GUID
- **Response**: 200 OK
- **Business Logic**:
  - Soft delete: Sets `deleted = 1`
  - Does not physically remove record
  - Calls `before_delete` and `after_delete` hooks
  - Cascades to related records based on relationship type

### Relationship Endpoints

#### Get Relationships
- **Path**: `GET /V8/module/{moduleName}/{id}/relationships/{linkFieldName}`
- **Params**:
  - `moduleName` (path) - Source module
  - `id` (path) - Source record ID
  - `linkFieldName` (path) - Relationship link field name
  - `page[offset]`, `page[limit]` (query) - Pagination
  - `filter`, `sort` (query) - Filtering and sorting
- **Response**: 200 OK
  - JSON-API format with related records in `data` array

#### Create Relationship
- **Path**: `POST /V8/module/{moduleName}/{id}/relationships`
- **Request Body**: JSON-API format with related record data
- **Response**: 201 Created
- **Business Logic**:
  - Creates related record and links it
  - Handles one-to-many and many-to-many relationships

#### Create Relationship by Link
- **Path**: `POST /V8/module/{moduleName}/{id}/relationships/{linkFieldName}`
- **Request Body**: JSON-API format with existing related record ID
- **Response**: 201 Created
- **Business Logic**:
  - Links existing record via relationship table
  - For many-to-many: Creates entry in join table
  - For one-to-many: Updates foreign key in related table

#### Delete Relationship
- **Path**: `DELETE /V8/module/{moduleName}/{id}/relationships/{linkFieldName}/{relatedBeanId}`
- **Response**: 200 OK
- **Business Logic**:
  - For many-to-many: Soft deletes join table entry
  - For one-to-many: Sets foreign key to NULL or soft deletes related record

### Metadata Endpoints

#### Get Module List
- **Path**: `GET /V8/meta/modules`
- **Response**: 200 OK
  - List of available modules with metadata

#### Get Field List
- **Path**: `GET /V8/meta/fields/{moduleName}`
- **Response**: 200 OK
  - Field definitions including types, labels, relationships

#### Get Search Definitions
- **Path**: `GET /V8/search-defs/module/{moduleName}`
- **Response**: 200 OK
  - Search field definitions for module

#### Get ListView Columns
- **Path**: `GET /V8/listview/columns/{moduleName}`
- **Response**: 200 OK
  - Column definitions for list view

#### Get Swagger Schema
- **Path**: `GET /V8/meta/swagger.json`
- **Response**: 200 OK
  - OpenAPI/Swagger schema for API

### User Endpoints

#### Get Current User
- **Path**: `GET /V8/current-user`
- **Response**: 200 OK
  - Current authenticated user data

#### Get User Preferences
- **Path**: `GET /V8/user-preferences/{id}`
- **Response**: 200 OK
  - User preferences for specified user

#### Logout
- **Path**: `POST /V8/logout`
- **Response**: 200 OK
  - Invalidates current session/token

### Status Codes
- **200 OK** - Successful GET, DELETE, PATCH operations
- **201 Created** - Successful POST (create) operations
- **400 Bad Request** - Validation errors, missing required fields, invalid data
- **401 Unauthorized** - Missing or invalid authentication token
- **403 Forbidden** - User lacks required permissions
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server-side errors

---

## CRUD Actions per Module

### Base CRUD Operations (SugarBean)

#### Create (Save)
- **Method**: `SugarBean::save($check_notify = false)`
- **Process**:
  1. Clean bean (XSS protection)
  2. Fix formatting
  3. Generate GUID if new record (`create_guid()`)
  4. Set timestamps: `date_entered`, `date_modified`
  5. Set user fields: `created_by`, `modified_user_id`
  6. Set `deleted = 0` if not already deleted
  7. Save relationships via `save_relationship_changes()`
  8. Call `before_save` custom logic hooks
  9. Save custom fields if present
  10. Execute BeanSaveHandlers (before)
  11. Insert/Update database record
  12. Execute BeanSaveHandlers (after)
  13. Call `after_save` custom logic hooks
  14. Send notifications if `$check_notify = true`
  15. Update audit trail if module is audited
- **Optimistic Locking**: Checks `date_modified` if enabled
- **Validation**: Field-level validation based on vardefs

#### Read (Retrieve)
- **Method**: `SugarBean::retrieve($id = -1, $encode = true, $deleted = true)`
- **Process**:
  1. Call `before_retrieve` custom logic hooks
  2. Build SQL query with custom field joins
  3. Execute query with `deleted=0` filter (unless `$deleted=false`)
  4. Fetch row and convert data types
  5. Populate bean properties from row
  6. Populate currency fields
  7. Load custom fields relationships
  8. Fill additional detail fields
  9. Fill relationship fields
  10. Store fetched row for audit comparison
  11. Call `after_retrieve` custom logic hooks
- **Returns**: Bean object or null if not found

#### Update (Save)
- **Method**: Same as Create (`SugarBean::save()`)
- **Distinction**: Determined by presence of `id` field
- **Additional Process**:
  - Optimistic locking check
  - Compare with `fetched_row` for audit trail
  - Update `date_modified` and `modified_user_id`

#### Delete (Soft Delete)
- **Method**: `SugarBean::mark_deleted($id)`
- **Process**:
  1. Call `before_delete` custom logic hooks
  2. Set `deleted = 1` in database
  3. Soft delete related records (cascade based on relationship type)
  4. Soft delete relationship table entries
  5. Call `after_delete` custom logic hooks
- **Note**: Physical deletion not performed, only soft delete flag set

### Module-Specific CRUD Operations

#### Accounts Module
- **Create**: Requires `name` field
- **Read**: Includes parent account relationship, email addresses
- **Update**: Supports parent account changes, email address updates
- **Delete**: Cascades to child accounts, cases, opportunities (soft delete)
- **Special Actions**:
  - Duplicate merge support
  - Unified search enabled
  - Full-text search enabled

#### Opportunities Module
- **Create**: Requires `name`, `amount`, `sales_stage`, `date_closed`, `account_id`
- **Read**: Includes account relationship, currency conversion
- **Update**: 
  - Currency conversion on amount change
  - Sales stage transition tracking
  - Probability validation (0-100)
- **Delete**: Soft deletes related activities
- **Special Actions**:
  - Amount conversion to USD (`amount_usdollar`)
  - Sales stage progression tracking
  - Campaign tracking

#### Users Module
- **Create**: Requires `user_name` (unique), `last_name`, `email1`, `status`
- **Read**: Excludes sensitive fields (`user_hash`, `totp_secret`, `backup_codes`)
- **Update**: 
  - Password change updates `user_hash` and `pwd_last_changed`
  - 2FA setup/disable
- **Delete**: Soft delete, prevents deletion of current user
- **Special Actions**:
  - Password reset
  - 2FA enable/disable
  - Role assignment
  - Security group assignment

#### Emails Module
- **Create**: Supports attachments via `UploadFile`
- **Read**: Includes email addresses, attachments, parent relationships
- **Update**: Status changes, reply tracking
- **Delete**: Soft delete with attachment cleanup
- **Special Actions**:
  - Send email (via PHPMailer)
  - Attachment upload/download
  - Email threading
  - Inbound email processing

---

## Business Logic

### Opportunity Business Logic

#### Sales Stage Management
- **Sales Stages**: Enum values from `sales_stage_dom`
  - Prospecting, Qualification, Needs Analysis, Value Proposition, Id. Decision Makers, Perception Analysis, Proposal/Price Quote, Negotiation/Review, Closed Won, Closed Lost
- **State Transitions**: Tracked via audit trail
- **Probability Rules**: 
  - Must be 0-100
  - Typically tied to sales stage
  - Used in forecasting calculations

#### Currency Conversion
- **Amount Storage**: Stored in opportunity currency (`amount`)
- **USD Conversion**: Calculated and stored in `amount_usdollar`
- **Conversion Logic**: Uses `currency_id` to fetch conversion rate
- **Update Trigger**: Recalculates on currency or amount change

#### Account Relationship
- **Required**: `account_id` required (unless config allows null)
- **Validation**: Account must exist and not be deleted
- **Cascade**: Account deletion soft-deletes related opportunities

### Account Business Logic

#### Parent-Child Hierarchy
- **Self-Referential**: `parent_id` references `accounts.id`
- **Validation**: Prevents circular references
- **Cascade**: Parent deletion affects child accounts (business rule)

#### Email Address Management
- **Multiple Emails**: Many-to-many relationship via `email_addr_bean_rel`
- **Primary Email**: Flagged via `primary_address = 1`
- **Opt-Out**: `email_opt_out` flag for marketing
- **Invalid Email**: `invalid_email` flag for bounce tracking

### User Business Logic

#### Authentication
- **Password Hashing**: Uses `User::checkPassword()` for verification
- **Hash Storage**: `user_hash` field stores bcrypt/argon2 hash
- **Password Policy**: Enforced on password change
- **Last Changed**: `pwd_last_changed` tracks password age

#### Two-Factor Authentication (2FA)
- **TOTP Support**: `totp_secret` stores secret key
- **Backup Codes**: `backup_codes` stores JSON array of codes
- **Enable/Disable**: Controlled via `is_totp_enabled` flag
- **Interface**: `factor_auth_interface` enum (Google Authenticator, etc.)

#### User Status
- **Active/Inactive**: Controlled via `status` enum
- **Portal Only**: `portal_only` flag restricts access
- **External Auth**: `external_auth_only` forces external authentication

### Email Business Logic

#### Email Sending
- **PHPMailer Integration**: Uses `SugarPHPMailer` class
- **Outbound Accounts**: Supports multiple SMTP configurations
- **Attachments**: Handled via `UploadFile` class
- **Status Tracking**: `status` field tracks sent/received/draft

#### Email Threading
- **Message ID**: Uses `message_id` for threading
- **Parent Tracking**: Links replies via `parent_id`
- **In-Reply-To**: Header tracking for threading

#### Email Address Parsing
- **Multiple Recipients**: Parses comma/semicolon-separated addresses
- **CC/BCC**: Separate arrays for carbon copy and blind carbon copy
- **Validation**: Email format validation before sending

### File Upload Business Logic

#### Upload Process
- **Class**: `UploadFile`
- **Storage**: Files stored in `upload/` directory with GUID filename
- **Naming**: File renamed to bean ID (e.g., `upload://{bean_id}`)
- **Validation**: 
  - File size limits
  - MIME type validation
  - Malware scanning (AntiMalwareTrait)
- **Error Handling**: Maps PHP upload errors to user-friendly messages

#### File Retrieval
- **URL Generation**: `get_upload_url()` creates download URL
- **Security**: Access controlled via ACL
- **Stream Wrapper**: Uses `upload://` stream wrapper

### Workflow and State Management

#### Custom Logic Hooks
- **Before Save**: `before_save` - Executed before database write
- **After Save**: `after_save` - Executed after database write
- **Before Delete**: `before_delete` - Executed before soft delete
- **After Delete**: `after_delete` - Executed after soft delete
- **Before Retrieve**: `before_retrieve` - Executed before data fetch
- **After Retrieve**: `after_retrieve` - Executed after data fetch

#### Audit Trail
- **Automatic Tracking**: For modules with `'audited' => true`
- **Fields Tracked**: All fields marked as `'audited' => true` in vardefs
- **Storage**: `[module]_audit` table
- **Comparison**: Compares `fetched_row` with current values
- **User Tracking**: Records `created_by` for audit entries

#### Optimistic Locking
- **Enabled**: For modules with `'optimistic_locking' => true`
- **Check**: Compares `date_modified` on update
- **Session Storage**: Stores lock info in `$_SESSION['o_lock_id']`, `$_SESSION['o_lock_dm']`
- **Error**: Throws exception if record modified since load

---

## Auth & Roles

### Authentication Flow

#### OAuth 2.0 Authentication
- **Token Endpoint**: `POST /access_token`
- **Grant Types**: Password grant (username/password)
- **Repository**: `Api\V8\OAuth2\Repository\UserRepository`
- **Process**:
  1. Client sends username/password
  2. UserRepository retrieves user by `user_name`
  3. Password verified via `User::checkPassword($password, $user->user_hash)`
  4. Returns access token and refresh token
- **Token Storage**: 
  - Access tokens: `oauth2tokens` table
  - Refresh tokens: `oauth2tokens` table with `refresh_token` field
  - Clients: `oauth2clients` table

#### Session-Based Authentication (Legacy)
- **Session Storage**: PHP `$_SESSION`
- **User Object**: Stored in `$current_user` global
- **Login Process**: 
  1. Validate username/password
  2. Create session
  3. Load user bean into `$current_user`
  4. Set session variables

#### Two-Factor Authentication (2FA)
- **TOTP Support**: Time-based One-Time Password
- **Secret Storage**: `totp_secret` in users table
- **Backup Codes**: Stored in `backup_codes` (JSON array)
- **Enable Flow**:
  1. Generate secret
  2. Store in `totp_secret`
  3. Set `is_totp_enabled = true`
  4. Generate backup codes
- **Verification**: Validates TOTP code on login if enabled

### Access Control Lists (ACL)

#### ACL System
- **Controller**: `ACLController`
- **Method**: `ACLController::checkAccess($category, $action, $is_owner, $type, $in_group)`
- **Actions**: 
  - `list` - View list
  - `detail` - View detail
  - `edit` - Edit record
  - `delete` - Delete record
  - `export` - Export data
  - `import` - Import data

#### ACL Checks
- **Admin Override**: Admins (`is_admin = true`) bypass all checks
- **Module-Level**: Checks module access via `ACLAction::userHasAccess()`
- **Record-Level**: Checks ownership via `$is_owner` parameter
- **Special Cases**:
  - Calendar: Checks Calls, Meetings, or Tasks access
  - Activities: Checks Calls, Meetings, Tasks, or Emails access
  - Line Items: Checks parent module (Quotes/Invoices/Contracts) access

#### ACL Roles
- **Table**: `acl_roles` - Role definitions
- **User Assignment**: `acl_roles_users` - Many-to-many join table
- **Role Actions**: `acl_roles_actions` - Action permissions per role
- **Inheritance**: Roles can inherit from other roles

#### Security Groups
- **Table**: `securitygroups` - Group definitions
- **User Assignment**: `securitygroups_users` - Many-to-many join table
- **Non-Inheritable**: `securitygroup_noninheritable` flag prevents inheritance
- **Primary Group**: `securitygroup_primary_group` flag marks primary group
- **Field-Level**: Security groups can restrict field access

### Role-Based Access Rules

#### User Roles
- **Assignment**: Via `acl_roles_users` relationship
- **Multiple Roles**: Users can have multiple roles
- **Permission Calculation**: Union of all role permissions
- **Default Role**: Assigned on user creation

#### Ownership Rules
- **Owner Field**: `assigned_user_id` typically indicates ownership
- **Owner Access**: Owners get full access regardless of role
- **Check**: `$is_owner` parameter in ACL checks
- **Calculation**: Compares `assigned_user_id` with current user ID

#### Team-Based Access
- **Teams**: Users can belong to teams
- **Team Assignment**: Records can be assigned to teams
- **Team Access**: Team members get access to team-assigned records

---

## File Upload/Email/Notifications

### File Upload

#### UploadFile Class
- **Location**: `include/UploadFile.php`
- **Properties**:
  - `field_name` - Form field name
  - `stored_file_name` - Final stored filename
  - `uploaded_file_name` - Original uploaded filename
  - `temp_file_location` - Temporary file path
  - `file_ext` - File extension
  - `mime_type` - MIME type
- **Methods**:
  - `save()` - Saves uploaded file
  - `get_upload_url()` - Generates download URL
  - `get_file_path()` - Gets file system path
  - `duplicate_file()` - Duplicates file for new record

#### Upload Process
1. **Validation**:
   - File size check (PHP `upload_max_filesize`, `post_max_size`)
   - MIME type validation
   - Extension whitelist/blacklist
   - Malware scanning (AntiMalwareTrait)
2. **Storage**:
   - Files stored in `upload/` directory
   - Filename: `{bean_id}` (GUID)
   - Original filename stored in database field
3. **Security**:
   - Access controlled via ACL
   - Download URL requires authentication
   - File type restrictions enforced

#### File Download
- **Entry Point**: `index.php?entryPoint=download&type={module}&id={id}`
- **Process**:
  1. Authenticate user
  2. Check ACL access
  3. Retrieve file path
  4. Stream file to browser
  5. Set appropriate headers (Content-Type, Content-Disposition)

### Email System

#### Email Bean
- **Class**: `Email` extends `Basic`
- **Key Fields**:
  - `from_addr`, `from_name` - Sender information
  - `to_addrs`, `cc_addrs`, `bcc_addrs` - Recipients
  - `subject` - Email subject
  - `description_html` - HTML body
  - `description` - Plain text body
  - `status` - Email status (sent, draft, received)
  - `type` - Email type (archived, inbound, outbound)
  - `parent_id`, `parent_type` - Related record

#### Email Sending
- **PHPMailer Integration**: Uses `SugarPHPMailer` wrapper
- **Outbound Accounts**: Supports multiple SMTP configurations
- **Process**:
  1. Validate email addresses
  2. Load SMTP configuration
  3. Create PHPMailer instance
  4. Set recipients, subject, body
  5. Attach files if present
  6. Send email
  7. Update status to "sent"
  8. Store in emails table

#### Email Receiving
- **Inbound Email**: `InboundEmail` module handles IMAP/POP3
- **Process**:
  1. Connect to mail server
  2. Fetch emails
  3. Parse email headers and body
  4. Create Email bean
  5. Link to related records (if detected)
  6. Store attachments

#### Email Attachments
- **Storage**: Uses `UploadFile` for attachment handling
- **Relationship**: Many-to-many via `emails_notes` (Notes contain attachments)
- **Process**:
  1. Upload file via `UploadFile`
  2. Create Note bean with file
  3. Link Note to Email
  4. Store in `notes` table with `parent_id` pointing to email

### Notifications

#### Notification System
- **Trigger**: `$check_notify` parameter in `save()` method
- **Conditions**:
  - New record creation
  - Assigned user change
  - Status change (module-specific)
- **Process**:
  1. Check if notifications enabled (`receive_notifications = true`)
  2. Determine notification recipients
  3. Load email template
  4. Generate notification email
  5. Send via email system

#### Notification Types
- **Assignment Notifications**: Sent when record assigned to user
- **Status Change**: Sent on workflow state transitions
- **Comment Notifications**: Sent on related record creation
- **Reminder Notifications**: Sent for calendar events

#### Email Templates
- **Module**: `EmailTemplates`
- **Variables**: Supports variable substitution (e.g., `$account_name`)
- **Types**: HTML and plain text templates
- **Usage**: Loaded and populated with bean data before sending

---

## Additional Specifications

### Data Types
- **GUID**: `char(36)` - Universally unique identifier
- **Varchar**: Variable length string with specified max length
- **Text**: Unlimited length text
- **Datetime**: Date and time storage
- **Date**: Date only storage
- **Int/Double**: Numeric types
- **Bool/Tinyint(1)**: Boolean (0/1)
- **Enum**: Predefined value list

### Field Types (Vardefs)
- **id**: Foreign key reference
- **varchar**: Variable string
- **name**: Name field (special handling)
- **relate**: Related field (non-db, computed)
- **link**: Relationship link
- **email**: Email address
- **phone**: Phone number
- **currency**: Currency amount
- **date**: Date field
- **datetime**: DateTime field
- **enum**: Enumeration
- **bool**: Boolean
- **text**: Text area
- **int**: Integer
- **float**: Floating point

### Relationship Types
- **one-to-many**: Foreign key in related table
- **many-to-one**: Reverse of one-to-many
- **many-to-many**: Join table required
- **one-to-one**: Single related record

### Soft Delete Pattern
- **Flag**: `deleted` field (0 = active, 1 = deleted)
- **Queries**: All queries filter `WHERE deleted = 0` by default
- **Cascade**: Related records soft-deleted based on relationship configuration
- **Recovery**: Records can be undeleted by setting `deleted = 0`

---

*This document is extracted from legacy SuiteCRM 8.9.1 source code analysis. All specifications are based on actual code implementation.*

