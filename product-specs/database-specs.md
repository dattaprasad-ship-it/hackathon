# Database Specification - SuiteCRM 8.9.1

**Created**: 2025-01-XX  
**Status**: Draft  
**Source**: Extracted from SuiteCRM 8.9.1 legacy source code analysis

---

## 1. Tables

### Core Business Tables

#### `accounts`
**Purpose**: Stores account/customer information with parent-child hierarchy support.

#### `opportunities`
**Purpose**: Stores sales opportunities linked to accounts with currency and probability tracking.

#### `users`
**Purpose**: Stores user accounts with authentication credentials, 2FA support, and role assignments.

#### `email_addresses`
**Purpose**: Central repository for email addresses used across all modules.

#### `currencies`
**Purpose**: Stores currency definitions and conversion rates.

#### `campaigns`
**Purpose**: Stores marketing campaign information.

### Relationship Tables

#### `accounts_opportunities`
**Purpose**: Many-to-many join table linking accounts to opportunities.

#### `opportunities_contacts`
**Purpose**: Many-to-many join table linking opportunities to contacts with role information.

#### `accounts_contacts`
**Purpose**: Many-to-many join table linking accounts to contacts.

#### `email_addr_bean_rel`
**Purpose**: Universal many-to-many join table linking email addresses to any module record.

### Authentication & Authorization Tables

#### `oauth2tokens`
**Purpose**: Stores OAuth 2.0 access tokens and refresh tokens for API authentication.

#### `oauth2clients`
**Purpose**: Stores OAuth 2.0 client applications and credentials.

#### `acl_roles`
**Purpose**: Defines access control roles with permissions.

#### `acl_roles_users`
**Purpose**: Many-to-many join table linking users to ACL roles.

#### `acl_roles_actions`
**Purpose**: Defines action permissions (list, detail, edit, delete, export, import) per role.

#### `securitygroups`
**Purpose**: Defines security groups for record-level access control.

#### `securitygroups_users`
**Purpose**: Many-to-many join table linking users to security groups.

### Audit Trail Tables

#### `[module]_audit` (Pattern)
**Purpose**: Stores audit trail entries for modules with `'audited' => true` configuration (e.g., `accounts_audit`, `opportunities_audit`).

---

## 2. Columns per Table

### `accounts`

| Column Name | Data Type | Nullable | Default | Constraints |
|------------|-----------|----------|---------|-------------|
| `id` | char(36) | NO | - | PRIMARY KEY, GUID |
| `name` | varchar | YES | NULL | - |
| `parent_id` | char(36) | YES | NULL | FK to accounts.id |
| `sic_code` | varchar(10) | YES | NULL | - |
| `assigned_user_id` | char(36) | YES | NULL | FK to users.id |
| `created_by` | char(36) | YES | NULL | FK to users.id |
| `modified_user_id` | char(36) | YES | NULL | FK to users.id |
| `date_entered` | datetime | YES | NULL | - |
| `date_modified` | datetime | YES | NULL | - |
| `deleted` | tinyint(1) | NO | 0 | CHECK (deleted IN (0, 1)) |
| `description` | text | YES | NULL | - |

**Indices**:
- `idx_accnt_id_del` on (id, deleted)
- `idx_accnt_name_del` on (name, deleted)
- `idx_accnt_assigned_del` on (deleted, assigned_user_id)
- `idx_accnt_parent_id` on (parent_id)

### `opportunities`

| Column Name | Data Type | Nullable | Default | Constraints |
|------------|-----------|----------|---------|-------------|
| `id` | char(36) | NO | - | PRIMARY KEY, GUID |
| `name` | varchar(50) | NO | - | REQUIRED, searchable |
| `account_id` | char(36) | YES | NULL | FK to accounts.id |
| `amount` | double | NO | - | REQUIRED |
| `amount_usdollar` | double | YES | NULL | - |
| `currency_id` | char(36) | YES | NULL | FK to currencies.id |
| `sales_stage` | varchar(255) | NO | - | REQUIRED, ENUM, audited |
| `probability` | double | YES | NULL | CHECK (probability >= 0 AND probability <= 100), audited |
| `date_closed` | date | NO | - | REQUIRED, audited |
| `opportunity_type` | varchar(255) | YES | NULL | ENUM, audited |
| `lead_source` | varchar(50) | YES | NULL | ENUM |
| `next_step` | varchar(100) | YES | NULL | - |
| `campaign_id` | char(36) | YES | NULL | FK to campaigns.id |
| `assigned_user_id` | char(36) | YES | NULL | FK to users.id |
| `created_by` | char(36) | YES | NULL | FK to users.id |
| `modified_user_id` | char(36) | YES | NULL | FK to users.id |
| `date_entered` | datetime | YES | NULL | - |
| `date_modified` | datetime | YES | NULL | - |
| `deleted` | tinyint(1) | NO | 0 | CHECK (deleted IN (0, 1)) |
| `description` | text | YES | NULL | - |

**Indices**:
- `idx_opp_name` on (name)
- `idx_opp_assigned` on (assigned_user_id)
- `idx_opp_id_deleted` on (id, deleted)

### `users`

| Column Name | Data Type | Nullable | Default | Constraints |
|------------|-----------|----------|---------|-------------|
| `id` | char(36) | NO | - | PRIMARY KEY, GUID |
| `user_name` | varchar(60) | NO | - | REQUIRED, UNIQUE, not editable after creation |
| `user_hash` | varchar(255) | YES | NULL | Sensitive, not API-visible |
| `first_name` | varchar(255) | YES | NULL | - |
| `last_name` | varchar(255) | NO | - | REQUIRED |
| `full_name` | varchar(510) | YES | NULL | Computed from first_name + last_name |
| `email1` | varchar | NO | - | REQUIRED, primary email |
| `is_admin` | bool | NO | 0 | - |
| `status` | varchar(100) | NO | - | REQUIRED, ENUM (Active/Inactive) |
| `sugar_login` | bool | NO | 1 | Force SuiteCRM authentication |
| `external_auth_only` | bool | NO | 0 | - |
| `authenticate_id` | varchar(100) | YES | NULL | For auth plugins |
| `pwd_last_changed` | datetime | YES | NULL | Password last changed timestamp |
| `system_generated_password` | bool | NO | - | REQUIRED |
| `reports_to_id` | char(36) | YES | NULL | FK to users.id (self-referential) |
| `receive_notifications` | bool | NO | 1 | - |
| `is_group` | bool | NO | 0 | Group user flag |
| `portal_only` | bool | NO | 0 | - |
| `factor_auth` | bool | NO | 0 | Two-factor auth enabled |
| `totp_secret` | varchar | YES | NULL | TOTP secret, sensitive |
| `is_totp_enabled` | bool | NO | 0 | - |
| `backup_codes` | text | YES | NULL | Backup codes for 2FA, JSON array |
| `deleted` | tinyint(1) | NO | 0 | CHECK (deleted IN (0, 1)) |

**Indices**:
- PRIMARY KEY on `id`
- Composite index on (user_name, is_group, status, last_name(30), first_name(30), id)

### `email_addresses`

| Column Name | Data Type | Nullable | Default | Constraints |
|------------|-----------|----------|---------|-------------|
| `id` | char(36) | NO | - | PRIMARY KEY, GUID |
| `email_address` | varchar(255) | YES | NULL | - |
| `email_address_caps` | varchar(255) | YES | NULL | Uppercase version for searching |
| `invalid_email` | tinyint(1) | NO | 0 | CHECK (invalid_email IN (0, 1)) |
| `opt_out` | tinyint(1) | NO | 0 | CHECK (opt_out IN (0, 1)) |
| `date_created` | datetime | YES | NULL | - |
| `date_modified` | datetime | YES | NULL | - |
| `deleted` | tinyint(1) | NO | 0 | CHECK (deleted IN (0, 1)) |

### `email_addr_bean_rel`

| Column Name | Data Type | Nullable | Default | Constraints |
|------------|-----------|----------|---------|-------------|
| `id` | char(36) | NO | - | PRIMARY KEY, GUID |
| `email_address_id` | char(36) | NO | - | FK to email_addresses.id |
| `bean_id` | char(36) | NO | - | FK to related bean (polymorphic) |
| `bean_module` | varchar(100) | NO | - | Module name (Accounts, Contacts, etc.) |
| `primary_address` | bool | NO | 0 | CHECK (primary_address IN (0, 1)) |
| `reply_to_address` | bool | NO | 0 | CHECK (reply_to_address IN (0, 1)) |
| `date_created` | datetime | YES | NULL | - |
| `date_modified` | datetime | YES | NULL | - |
| `deleted` | tinyint(1) | NO | 0 | CHECK (deleted IN (0, 1)) |

### `accounts_opportunities`

| Column Name | Data Type | Nullable | Default | Constraints |
|------------|-----------|----------|---------|-------------|
| `id` | char(36) | NO | - | PRIMARY KEY, GUID |
| `account_id` | char(36) | NO | - | FK to accounts.id |
| `opportunity_id` | char(36) | NO | - | FK to opportunities.id |
| `date_modified` | datetime | YES | NULL | - |
| `deleted` | tinyint(1) | NO | 0 | CHECK (deleted IN (0, 1)) |

### `opportunities_contacts`

| Column Name | Data Type | Nullable | Default | Constraints |
|------------|-----------|----------|---------|-------------|
| `id` | char(36) | NO | - | PRIMARY KEY, GUID |
| `opportunity_id` | char(36) | NO | - | FK to opportunities.id |
| `contact_id` | char(36) | NO | - | FK to contacts.id |
| `contact_role` | varchar(50) | YES | NULL | ENUM (Decision Maker, Evaluator, Influencer, etc.) |
| `date_modified` | datetime | YES | NULL | - |
| `deleted` | tinyint(1) | NO | 0 | CHECK (deleted IN (0, 1)) |

### `accounts_contacts`

| Column Name | Data Type | Nullable | Default | Constraints |
|------------|-----------|----------|---------|-------------|
| `id` | char(36) | NO | - | PRIMARY KEY, GUID |
| `account_id` | char(36) | NO | - | FK to accounts.id |
| `contact_id` | char(36) | NO | - | FK to contacts.id |
| `date_modified` | datetime | YES | NULL | - |
| `deleted` | tinyint(1) | NO | 0 | CHECK (deleted IN (0, 1)) |

### `oauth2tokens`

| Column Name | Data Type | Nullable | Default | Constraints |
|------------|-----------|----------|---------|-------------|
| `id` | char(36) | NO | - | PRIMARY KEY, GUID |
| `access_token` | varchar(255) | NO | - | UNIQUE |
| `refresh_token` | varchar(255) | YES | NULL | UNIQUE |
| `client_id` | varchar(255) | NO | - | FK to oauth2clients.id |
| `user_id` | char(36) | YES | NULL | FK to users.id |
| `expires` | datetime | YES | NULL | - |
| `scope` | text | YES | NULL | - |
| `revoked` | tinyint(1) | NO | 0 | CHECK (revoked IN (0, 1)) |
| `created_at` | datetime | YES | NULL | - |
| `updated_at` | datetime | YES | NULL | - |

### `oauth2clients`

| Column Name | Data Type | Nullable | Default | Constraints |
|------------|-----------|----------|---------|-------------|
| `id` | varchar(255) | NO | - | PRIMARY KEY |
| `name` | varchar(255) | YES | NULL | - |
| `secret` | varchar(255) | NO | - | Client secret (hashed) |
| `redirect` | text | YES | NULL | Redirect URI(s) |
| `personal_access_client` | tinyint(1) | NO | 0 | CHECK (personal_access_client IN (0, 1)) |
| `password_client` | tinyint(1) | NO | 0 | CHECK (password_client IN (0, 1)) |
| `revoked` | tinyint(1) | NO | 0 | CHECK (revoked IN (0, 1)) |
| `created_at` | datetime | YES | NULL | - |
| `updated_at` | datetime | YES | NULL | - |

### `acl_roles`

| Column Name | Data Type | Nullable | Default | Constraints |
|------------|-----------|----------|---------|-------------|
| `id` | char(36) | NO | - | PRIMARY KEY, GUID |
| `name` | varchar(150) | NO | - | REQUIRED |
| `description` | text | YES | NULL | - |
| `date_entered` | datetime | YES | NULL | - |
| `date_modified` | datetime | YES | NULL | - |
| `modified_user_id` | char(36) | YES | NULL | FK to users.id |
| `created_by` | char(36) | YES | NULL | FK to users.id |
| `deleted` | tinyint(1) | NO | 0 | CHECK (deleted IN (0, 1)) |

### `acl_roles_users`

| Column Name | Data Type | Nullable | Default | Constraints |
|------------|-----------|----------|---------|-------------|
| `id` | char(36) | NO | - | PRIMARY KEY, GUID |
| `role_id` | char(36) | NO | - | FK to acl_roles.id |
| `user_id` | char(36) | NO | - | FK to users.id |
| `date_modified` | datetime | YES | NULL | - |
| `deleted` | tinyint(1) | NO | 0 | CHECK (deleted IN (0, 1)) |

### `acl_roles_actions`

| Column Name | Data Type | Nullable | Default | Constraints |
|------------|-----------|----------|---------|-------------|
| `id` | char(36) | NO | - | PRIMARY KEY, GUID |
| `role_id` | char(36) | NO | - | FK to acl_roles.id |
| `action_id` | char(36) | NO | - | FK to acl_actions.id |
| `access_override` | int | NO | - | Access level override |
| `date_modified` | datetime | YES | NULL | - |
| `deleted` | tinyint(1) | NO | 0 | CHECK (deleted IN (0, 1)) |

### `securitygroups`

| Column Name | Data Type | Nullable | Default | Constraints |
|------------|-----------|----------|---------|-------------|
| `id` | char(36) | NO | - | PRIMARY KEY, GUID |
| `name` | varchar(150) | NO | - | REQUIRED |
| `description` | text | YES | NULL | - |
| `noninheritable` | tinyint(1) | NO | 0 | CHECK (noninheritable IN (0, 1)) |
| `date_entered` | datetime | YES | NULL | - |
| `date_modified` | datetime | YES | NULL | - |
| `modified_user_id` | char(36) | YES | NULL | FK to users.id |
| `created_by` | char(36) | YES | NULL | FK to users.id |
| `deleted` | tinyint(1) | NO | 0 | CHECK (deleted IN (0, 1)) |

### `securitygroups_users`

| Column Name | Data Type | Nullable | Default | Constraints |
|------------|-----------|----------|---------|-------------|
| `id` | char(36) | NO | - | PRIMARY KEY, GUID |
| `securitygroup_id` | char(36) | NO | - | FK to securitygroups.id |
| `user_id` | char(36) | NO | - | FK to users.id |
| `noninheritable` | tinyint(1) | NO | 0 | CHECK (noninheritable IN (0, 1)) |
| `primary_group` | tinyint(1) | NO | 0 | CHECK (primary_group IN (0, 1)) |
| `date_modified` | datetime | YES | NULL | - |
| `deleted` | tinyint(1) | NO | 0 | CHECK (deleted IN (0, 1)) |

### `[module]_audit` (Pattern)

| Column Name | Data Type | Nullable | Default | Constraints |
|------------|-----------|----------|---------|-------------|
| `id` | char(36) | NO | - | PRIMARY KEY, GUID |
| `parent_id` | char(36) | NO | - | FK to parent record |
| `field_name` | varchar(100) | NO | - | Name of changed field |
| `data_type` | varchar(100) | YES | NULL | Data type of field |
| `before_value_string` | varchar(255) | YES | NULL | Before value (string) |
| `after_value_string` | varchar(255) | YES | NULL | After value (string) |
| `before_value_text` | text | YES | NULL | Before value (text) |
| `after_value_text` | text | YES | NULL | After value (text) |
| `created_by` | char(36) | YES | NULL | FK to users.id |
| `date_created` | datetime | YES | NULL | - |

**Note**: Only created for modules with `'audited' => true` in vardefs.

### Common Fields (All Module Tables)

All module tables include these standard fields:

| Column Name | Data Type | Nullable | Default | Constraints |
|------------|-----------|----------|---------|-------------|
| `id` | char(36) | NO | - | PRIMARY KEY, GUID |
| `date_entered` | datetime | YES | NULL | Creation timestamp |
| `date_modified` | datetime | YES | NULL | Last modification timestamp |
| `modified_user_id` | char(36) | YES | NULL | FK to users.id |
| `created_by` | char(36) | YES | NULL | FK to users.id |
| `assigned_user_id` | char(36) | YES | NULL | FK to users.id |
| `deleted` | tinyint(1) | NO | 0 | CHECK (deleted IN (0, 1)), soft delete flag |
| `description` | text | YES | NULL | Optional description field |

---

## 3. Relationships

### Primary Key References

- **All Tables**: `id` (char(36)) - GUID primary key
- **Pattern**: All primary keys are GUIDs (char(36)) generated via `create_guid()`

### Foreign Key References

#### `accounts`
- `parent_id` → `accounts.id` (Self-referential, One-to-Many)
- `assigned_user_id` → `users.id` (Many-to-One)
- `created_by` → `users.id` (Many-to-One)
- `modified_user_id` → `users.id` (Many-to-One)

#### `opportunities`
- `account_id` → `accounts.id` (Many-to-One)
- `currency_id` → `currencies.id` (Many-to-One)
- `campaign_id` → `campaigns.id` (Many-to-One)
- `assigned_user_id` → `users.id` (Many-to-One)
- `created_by` → `users.id` (Many-to-One)
- `modified_user_id` → `users.id` (Many-to-One)

#### `users`
- `reports_to_id` → `users.id` (Self-referential, One-to-Many)

#### `email_addr_bean_rel`
- `email_address_id` → `email_addresses.id` (Many-to-One)
- `bean_id` → `[module].id` (Polymorphic, Many-to-One)

#### `accounts_opportunities`
- `account_id` → `accounts.id` (Many-to-One)
- `opportunity_id` → `opportunities.id` (Many-to-One)

#### `opportunities_contacts`
- `opportunity_id` → `opportunities.id` (Many-to-One)
- `contact_id` → `contacts.id` (Many-to-One)

#### `accounts_contacts`
- `account_id` → `accounts.id` (Many-to-One)
- `contact_id` → `contacts.id` (Many-to-One)

#### `oauth2tokens`
- `client_id` → `oauth2clients.id` (Many-to-One)
- `user_id` → `users.id` (Many-to-One)

#### `acl_roles_users`
- `role_id` → `acl_roles.id` (Many-to-One)
- `user_id` → `users.id` (Many-to-One)

#### `acl_roles_actions`
- `role_id` → `acl_roles.id` (Many-to-One)
- `action_id` → `acl_actions.id` (Many-to-One)

#### `securitygroups_users`
- `securitygroup_id` → `securitygroups.id` (Many-to-One)
- `user_id` → `users.id` (Many-to-One)

#### `[module]_audit`
- `parent_id` → `[module].id` (Many-to-One)
- `created_by` → `users.id` (Many-to-One)

### Relationship Types

#### One-to-Many
- `accounts.parent_id` → `accounts.id` (Parent-Child hierarchy)
- `users.reports_to_id` → `users.id` (Manager-Employee hierarchy)
- `opportunities.account_id` → `accounts.id` (Account-Opportunities)
- `[module].assigned_user_id` → `users.id` (User-Assigned Records)

#### Many-to-Many (via Join Tables)
- `accounts` ↔ `opportunities` (via `accounts_opportunities`)
- `opportunities` ↔ `contacts` (via `opportunities_contacts`)
- `accounts` ↔ `contacts` (via `accounts_contacts`)
- `email_addresses` ↔ `[all modules]` (via `email_addr_bean_rel`)
- `users` ↔ `acl_roles` (via `acl_roles_users`)
- `users` ↔ `securitygroups` (via `securitygroups_users`)

#### Polymorphic Relationships
- `email_addr_bean_rel.bean_id` + `bean_module` → Any module record (Polymorphic)

---

## 4. Business/Data Rules

### Validation Rules

#### `accounts`
- **Name**: Required for create operations
- **Parent ID**: Must not create circular references (parent cannot be descendant)
- **Soft Delete**: Cascades to child accounts (business rule, not DB constraint)

#### `opportunities`
- **Name**: REQUIRED, varchar(50), searchable
- **Amount**: REQUIRED, must be numeric, >= 0
- **Sales Stage**: REQUIRED, must be valid enum value, audited
- **Probability**: Range 0-100, audited
- **Date Closed**: REQUIRED, must be valid date, audited
- **Account ID**: Required (unless config allows null), must reference existing non-deleted account
- **Currency Conversion**: `amount_usdollar` calculated automatically on amount/currency change

#### `users`
- **User Name**: REQUIRED, UNIQUE, varchar(60), not editable after creation
- **Last Name**: REQUIRED
- **Email1**: REQUIRED, must be valid email format
- **Status**: REQUIRED, must be 'Active' or 'Inactive'
- **Password**: `user_hash` stores bcrypt/argon2 hash, not API-visible
- **2FA**: `totp_secret` and `backup_codes` are sensitive, not API-visible
- **Self-Deletion**: Cannot delete current logged-in user
- **Full Name**: Computed from `first_name + last_name` (varchar(510))

#### `email_addresses`
- **Email Address**: Must be valid email format
- **Email Address Caps**: Uppercase version for case-insensitive searching

#### `email_addr_bean_rel`
- **Primary Address**: Only one `primary_address = 1` per `bean_id` + `bean_module` combination
- **Polymorphic**: `bean_module` must be valid module name

#### `oauth2tokens`
- **Access Token**: UNIQUE, required
- **Refresh Token**: UNIQUE (if present)
- **Expires**: Token invalid after expiration
- **Revoked**: Revoked tokens cannot be used

#### `oauth2clients`
- **ID**: UNIQUE, required
- **Secret**: Required, stored as hash

#### `acl_roles`
- **Name**: REQUIRED, unique per non-deleted records

#### `securitygroups`
- **Name**: REQUIRED, unique per non-deleted records

### Required Fields

#### `accounts`
- `id` (auto-generated)
- `deleted` (default: 0)

#### `opportunities`
- `id` (auto-generated)
- `name`
- `amount`
- `sales_stage`
- `date_closed`
- `deleted` (default: 0)

#### `users`
- `id` (auto-generated)
- `user_name` (UNIQUE)
- `last_name`
- `email1`
- `status`
- `system_generated_password`
- `deleted` (default: 0)

#### `email_addr_bean_rel`
- `id` (auto-generated)
- `email_address_id`
- `bean_id`
- `bean_module`
- `deleted` (default: 0)

### Unique Constraints

#### `users`
- `user_name` - UNIQUE (case-sensitive)

#### `oauth2tokens`
- `access_token` - UNIQUE
- `refresh_token` - UNIQUE (if not NULL)

#### `acl_roles`
- `name` - UNIQUE (for non-deleted records)

#### `securitygroups`
- `name` - UNIQUE (for non-deleted records)

### Soft Delete Pattern

**Universal Rule**: All module tables use soft delete via `deleted` field
- `deleted = 0` - Active record
- `deleted = 1` - Deleted record
- **Default**: All queries filter `WHERE deleted = 0` by default
- **Cascade**: Related records soft-deleted based on relationship configuration
- **Recovery**: Records can be undeleted by setting `deleted = 0`

### Audit Trail Rules

**Conditional Creation**: Audit tables only created for modules with `'audited' => true` in vardefs

**Tracked Fields**: Only fields marked as `'audited' => true` in vardefs are tracked

**Comparison**: System compares `fetched_row` with current values to detect changes

**User Tracking**: All audit entries record `created_by` (user who made the change)

### Optimistic Locking

**Conditional**: Only enabled for modules with `'optimistic_locking' => true`

**Check**: Compares `date_modified` on update to detect concurrent modifications

**Error**: Throws exception if record modified since load

### Data Type Constraints

- **GUID**: All `id` fields are `char(36)` - Universally unique identifier
- **Boolean**: All boolean fields use `tinyint(1)` with CHECK constraint `IN (0, 1)`
- **Enum**: Enum fields use `varchar` with application-level validation
- **Timestamps**: `date_entered`, `date_modified` use `datetime` type
- **Text Fields**: `description` and similar use `text` type (unlimited length)

### Relationship Constraints

#### Cascade Rules
- **Account Deletion**: Soft-deletes related opportunities, cases, contacts (business rule)
- **Opportunity Deletion**: Soft-deletes related activities (calls, meetings, tasks, notes, emails)
- **User Deletion**: Prevents deletion of current logged-in user
- **Parent Account Deletion**: Affects child accounts (business rule, not DB constraint)

#### Referential Integrity
- **Foreign Keys**: All FK references must point to existing records
- **Soft Delete Impact**: Related records checked for `deleted = 0` status
- **Polymorphic Relationships**: `email_addr_bean_rel` validates `bean_module` exists

---

## Additional Notes

### GUID Generation
- All primary keys use GUID format (char(36))
- Generated via `create_guid()` function
- Format: UUID v4 standard

### Timestamp Management
- `date_entered`: Set automatically on record creation
- `date_modified`: Updated automatically on record modification
- Both timestamps managed by application layer, not database triggers

### Index Strategy
- Primary keys automatically indexed
- Composite indices on frequently queried columns (name, deleted, assigned_user_id)
- Indices include `deleted` column for efficient soft-delete filtering

### Security Considerations
- Sensitive fields (`user_hash`, `totp_secret`, `backup_codes`) not exposed via API
- OAuth tokens stored with expiration and revocation support
- ACL and Security Groups provide record-level access control

---

*This specification is extracted from SuiteCRM 8.9.1 legacy source code analysis. All specifications are based on actual code implementation.*

