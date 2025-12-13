# Feature Specifications - Contacts Module

**Feature Branch**: `003-contacts-module`  
**Created**: 2025-12-12  
**Updated**: 2025-12-12 (clarifications applied)  
**Status**: Draft  
**Input**: User description: "Contacts module - complete feature specification derived from requirements documents"

**Note**: This specification has been updated with clarifications for permissions (delete and bulk import Admin only), bulk action workflows, filter/sort persistence, column preferences, and other feature behaviors based on user feedback.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Views Contacts List (Priority: P1)

As an authenticated user (Admin or Employee), I want to view a list of contacts with sorting, filtering, and pagination capabilities, so that I can efficiently find and manage contact information.

**Why this priority**: The contacts list is the primary interface for accessing contact data. It's the entry point to all contact management operations and must provide efficient search, filtering, and navigation capabilities. Without this, users cannot effectively manage contacts.

**Independent Test**: Can be fully tested by navigating to the contacts list page, verifying contacts are displayed with default columns, testing sorting and filtering functionality, and confirming pagination works correctly. This delivers immediate value by providing access to all contact data.

**Acceptance Scenarios**:

1. **Given** a user is authenticated and navigates to Contacts module, **When** they view the contacts list page, **Then** they see a table displaying contacts with default columns (Name, Job Title, Account Name, Email, Office Phone, User, Date Created)
2. **Given** a user is on the contacts list page, **When** they click on a column header, **Then** the table sorts by that column (ascending on first click, descending on second click)
3. **Given** a user applies filters to the contacts list, **When** they click Search, **Then** the table displays only contacts matching the filter criteria
4. **Given** a user has more than 20 contacts, **When** they view the contacts list, **Then** pagination controls appear showing page information (e.g., "1 - 20 of 200")
5. **Given** a user is an Employee, **When** they view the contacts list, **Then** they only see contacts assigned to them or contacts they have access to

---

### User Story 2 - User Creates New Contact (Priority: P1)

As an authenticated user (Admin or Employee), I want to create a new contact with all relevant information including name, contact details, address, and relationships, so that I can add new contacts to the CRM system.

**Why this priority**: Creating contacts is a fundamental CRUD operation. Users need the ability to add new contacts to build their contact database. This is essential for maintaining up-to-date contact information.

**Independent Test**: Can be fully tested by navigating to create contact page, filling in required fields (Last Name minimum), entering contact information across all tabs (Overview, More Information, Other), and verifying the contact is created successfully. This delivers value by enabling users to add new contacts to the system.

**Acceptance Scenarios**:

1. **Given** a user navigates to Create Contact page, **When** they fill in required fields (Last Name) and click Save, **Then** a new contact is created and they are redirected to the contact detail page
2. **Given** a user is creating a contact, **When** they do not provide Last Name, **Then** validation error is displayed and contact is not created
3. **Given** a user is creating a contact, **When** they add multiple email addresses, **Then** they can mark one email as primary
4. **Given** a user creates a contact, **When** the contact is saved, **Then** dateCreated and dateModified are automatically set, and createdBy is set to current user
5. **Given** a user creates a contact without specifying assigned user, **When** the contact is saved, **Then** assignedUserId defaults to the current user

---

### User Story 3 - User Views and Edits Contact Details (Priority: P1)

As an authenticated user (Admin or Employee), I want to view detailed contact information and edit contact details, so that I can maintain accurate and up-to-date contact records.

**Why this priority**: Viewing and editing contacts is a core functionality. Users need to access full contact details and update information as it changes. This is essential for data maintenance and accuracy.

**Independent Test**: Can be fully tested by clicking on a contact name from the list, verifying all contact details are displayed correctly, editing fields, and confirming changes are saved successfully. This delivers value by allowing users to maintain accurate contact information.

**Acceptance Scenarios**:

1. **Given** a user clicks on a contact name from the contacts list, **When** the contact detail page loads, **Then** all contact information is displayed in an editable form with all tabs (Overview, More Information, Other)
2. **Given** a user is viewing a contact detail page, **When** they modify contact fields and click Save, **Then** changes are saved and dateModified is updated
3. **Given** a user views a contact detail page, **When** the page loads, **Then** the contact is tracked in recently viewed contacts
4. **Given** a user edits a contact, **When** they save changes, **Then** modifiedUserId is set to current user and audit trail is updated
5. **Given** a user is an Employee viewing a contact, **When** the contact is not assigned to them, **Then** they can only view/edit if they have access permissions

---

### User Story 4 - User Imports Contact from vCard (Priority: P2)

As an authenticated user (Admin or Employee), I want to import a contact from a vCard file (.vcf or .vcard format), so that I can quickly add contacts from external sources like email clients or contact management applications.

**Why this priority**: vCard import provides a convenient way to bulk import contacts from external sources. While not critical for core functionality, it significantly improves efficiency when migrating contacts or importing from other systems.

**Independent Test**: Can be fully tested by navigating to Import VCard page, selecting a valid .vcf or .vcard file, clicking Import, and verifying the contact is created with correct information extracted from the vCard. This delivers value by enabling quick contact import from external sources.

**Acceptance Scenarios**:

1. **Given** a user navigates to Import VCard page, **When** they select a valid .vcf or .vcard file and click Import VCard, **Then** a contact is created with information extracted from the vCard file
2. **Given** a user selects an invalid file format (not .vcf or .vcard), **When** they click Import VCard, **Then** an error message is displayed indicating only .vcf and .vcard files are supported
3. **Given** a user imports a vCard with multiple email addresses, **When** the contact is created, **Then** all email addresses are imported and one is marked as primary
4. **Given** a vCard file cannot be parsed, **When** the user attempts to import, **Then** a detailed error message is displayed explaining the parsing failure

---

### User Story 5 - User Performs Bulk Actions on Contacts (Priority: P2)

As an authenticated user (Admin or Employee), I want to select multiple contacts and perform bulk actions (delete, export, merge, mass update), so that I can efficiently manage multiple contacts at once.

**Why this priority**: Bulk actions significantly improve efficiency when managing large numbers of contacts. While not critical for core functionality, it's essential for power users who need to manage many contacts simultaneously.

**Independent Test**: Can be fully tested by selecting multiple contacts using checkboxes, clicking Bulk Action button, selecting an action (e.g., delete), and verifying the action is performed on all selected contacts. This delivers value by enabling efficient management of multiple contacts.

**Acceptance Scenarios**:

1. **Given** a user selects one or more contacts using checkboxes, **When** contacts are selected, **Then** the Bulk Action button becomes enabled and selection indicator shows "Selected: X"
2. **Given** a user has selected contacts, **When** they click Bulk Action and select Delete, **Then** all selected contacts are soft-deleted
3. **Given** a user performs a bulk action, **When** the action completes, **Then** success/failure counts are displayed for each contact
4. **Given** a user selects contacts they don't have permission to modify, **When** bulk action is performed, **Then** only authorized contacts are processed and permission errors are reported for others

---

### User Story 6 - User Filters and Searches Contacts (Priority: P2)

As an authenticated user (Admin or Employee), I want to filter contacts by various criteria (name, account, assigned user, lead source, etc.), so that I can quickly find specific contacts from a large list.

**Why this priority**: Filtering is essential for usability when dealing with large contact databases. While the list view can work without advanced filtering, it's critical for efficiency in real-world usage scenarios.

**Independent Test**: Can be fully tested by clicking Filter button, entering filter criteria in the Basic Filter panel, clicking Search, and verifying only matching contacts are displayed. This delivers value by enabling efficient contact discovery.

**Acceptance Scenarios**:

1. **Given** a user clicks the Filter button, **When** the Basic Filter panel opens, **Then** filter fields are displayed (First Name, Last Name, Account Name, Assigned To, Email, Phone, Address, State, Country, Lead Source)
2. **Given** a user enters filter criteria and clicks Search, **When** filters are applied, **Then** the contacts table displays only contacts matching the filter criteria
3. **Given** a user has applied filters, **When** they click Clear, **Then** all filter fields are cleared and full contact list is displayed
4. **Given** a user applies filters, **When** they navigate to a different page and return, **Then** filter state is preserved (session-based)

---

### User Story 7 - User Customizes Column Visibility (Priority: P3)

As an authenticated user (Admin or Employee), I want to customize which columns are visible in the contacts table and their order, so that I can tailor the view to show only the information most relevant to my work.

**Why this priority**: Column customization improves personal productivity but is not essential for core functionality. It's a quality-of-life feature that allows users to optimize their workspace.

**Independent Test**: Can be fully tested by clicking Choose Columns button, dragging columns between DISPLAYED and HIDDEN sections, reordering columns, clicking Save, and verifying the table reflects the changes. This delivers value by allowing users to customize their view.

**Acceptance Scenarios**:

1. **Given** a user clicks the Choose Columns button (burger icon), **When** the modal opens, **Then** two sections are displayed: DISPLAYED (left, purple) and HIDDEN (right, red/salmon)
2. **Given** a user drags a column from HIDDEN to DISPLAYED section, **When** they save preferences, **Then** that column appears in the contacts table
3. **Given** a user reorders columns within DISPLAYED section, **When** they save preferences, **Then** columns appear in the new order in the contacts table
4. **Given** a user customizes columns, **When** they return to contacts list later, **Then** their column preferences are applied

---

### Edge Cases

- What happens when a user tries to create a contact with a circular "Reports To" relationship (Contact A reports to Contact B, Contact B reports to Contact A)?
  - System should validate and prevent circular references in Reports To relationships

- What happens when a user imports a vCard file that is corrupted or contains invalid data?
  - System should return a detailed error message explaining what data is invalid and which fields could not be parsed

- What happens when a user performs bulk delete on 1000+ contacts?
  - System should process bulk actions in batches to prevent timeout and provide progress feedback

- What happens when two users simultaneously edit the same contact?
  - System should handle concurrent edits appropriately (last write wins or optimistic locking based on implementation)

- What happens when a user tries to assign a contact to a user that has been deleted?
  - System should validate that assignedUserId references a valid, active user

- What happens when a contact's assigned user is deleted?
  - System should handle this gracefully - either prevent deletion of users with assigned contacts, or reassign contacts to a default user

- What happens when filtering returns zero results?
  - System should display an empty state message indicating no contacts match the filter criteria

- What happens when a user tries to mark multiple emails as primary for the same contact?
  - System should enforce that only one email can be primary, and automatically unmark other primary emails

- What happens when a user imports a vCard with duplicate email addresses?
  - System should either prevent duplicates or merge duplicate email entries

- What happens when pagination reaches the last page and a contact is deleted?
  - System should handle empty page gracefully - either redirect to previous page or show empty state

## Requirements *(mandatory)*

### Functional Requirements

#### Contact Management
- **FR-001**: System MUST allow authenticated users (Admin, Employee) to create new contacts
- **FR-002**: System MUST require Last Name field when creating a contact
- **FR-003**: System MUST allow users to edit existing contacts if they have permission
- **FR-004**: System MUST allow users to view contact details
- **FR-005**: System MUST allow users to delete contacts (soft delete) if they have permission
- **FR-006**: System MUST track contact creation timestamp (dateCreated)
- **FR-007**: System MUST track contact modification timestamp (dateModified)
- **FR-008**: System MUST track user who created contact (createdBy)
- **FR-009**: System MUST track user who last modified contact (modifiedUserId)
- **FR-010**: System MUST default assignedUserId to current user if not specified

#### Contact List View
- **FR-011**: System MUST display contacts in a table format with sortable columns
- **FR-012**: System MUST support sorting by: name, job_title, account_name, office_phone, user, date_created
- **FR-013**: System MUST support ascending and descending sort directions
- **FR-014**: System MUST support pagination with configurable page size (default: 20, max: 100)
- **FR-015**: System MUST display pagination information: "X - Y of Z" format
- **FR-016**: System MUST filter out soft-deleted contacts from list view
- **FR-017**: System MUST apply user access rules to contact list (Employee sees only accessible contacts)

#### Filtering and Search
- **FR-018**: System MUST support filtering by: first_name, last_name, account_name, assigned_to, email, phone, address fields, lead_source
- **FR-019**: System MUST combine multiple filter criteria with AND logic
- **FR-020**: System MUST support clearing all filters
- **FR-021**: System MUST preserve filter state during session

#### Contact Form Fields
- **FR-022**: System MUST support contact title (Mr., Ms., Mrs., Miss, Dr., Prof.)
- **FR-023**: System MUST support first name and last name fields
- **FR-024**: System MUST support office phone and mobile phone fields
- **FR-025**: System MUST support job title and department fields
- **FR-026**: System MUST support multiple email addresses per contact
- **FR-027**: System MUST enforce only one primary email address per contact
- **FR-028**: System MUST support email address flags: primary, optOut, invalid
- **FR-029**: System MUST support account relationship (accountId)
- **FR-030**: System MUST support assigned user relationship (assignedUserId)
- **FR-031**: System MUST support Reports To relationship (reportsToId - self-referential)
- **FR-032**: System MUST support campaign relationship (campaignId)
- **FR-033**: System MUST support lead source selection (enum values)
- **FR-034**: System MUST support primary and alternate address fields (street, city, state, postal code, country)
- **FR-035**: System MUST support description field (text area)

#### vCard Import
- **FR-036**: System MUST support importing contacts from vCard files (.vcf, .vcard formats)
- **FR-037**: System MUST validate vCard file format before processing
- **FR-038**: System MUST extract contact information from vCard (name, email, phone, address, organization)
- **FR-039**: System MUST map vCard fields to contact entity fields
- **FR-040**: System MUST handle multiple email addresses from vCard
- **FR-041**: System MUST return detailed error if vCard parsing fails

#### Bulk Import
- **FR-042**: System MUST support bulk import from CSV and Excel files
- **FR-043**: System MUST validate file format before processing
- **FR-044**: System MUST validate each row before import
- **FR-045**: System MUST process bulk import asynchronously for large files
- **FR-046**: System MUST provide import progress and results summary

#### Bulk Actions
- **FR-047**: System MUST support selecting multiple contacts via checkboxes
- **FR-048**: System MUST support bulk delete (soft delete)
- **FR-049**: System MUST support bulk export (CSV/Excel)
- **FR-050**: System MUST support bulk merge operation
- **FR-051**: System MUST support mass update operation
- **FR-052**: System MUST support add to target list operation
- **FR-053**: System MUST support bulk print PDF operation
- **FR-054**: System MUST validate user permissions for each selected contact before bulk action
- **FR-055**: System MUST return detailed results (success/failure counts) for bulk actions

#### Column Customization
- **FR-056**: System MUST allow users to customize visible columns in contacts table
- **FR-057**: System MUST support adding columns (move from HIDDEN to DISPLAYED)
- **FR-058**: System MUST support removing columns (move from DISPLAYED to HIDDEN)
- **FR-059**: System MUST support reordering columns within DISPLAYED section
- **FR-060**: System MUST persist column preferences per user
- **FR-061**: System MUST apply saved column preferences when loading contacts list

#### Recently Viewed
- **FR-062**: System MUST track contacts viewed by user
- **FR-063**: System MUST display recently viewed contacts in dropdown menu (limit: 10)
- **FR-064**: System MUST order recently viewed contacts by most recent first
- **FR-065**: System MUST allow navigation to contact detail from recently viewed list

#### Access Control
- **FR-066**: System MUST require authentication for all contact operations
- **FR-067**: System MUST enforce role-based access control (Admin has full access, Employee has limited access)
- **FR-068**: System MUST validate user permissions before allowing contact operations
- **FR-069**: System MUST prevent unauthorized access to contact data

#### Validation
- **FR-070**: System MUST validate email address format
- **FR-071**: System MUST validate foreign key references (accountId, assignedUserId, reportsToId, campaignId)
- **FR-072**: System MUST prevent circular references in Reports To relationships
- **FR-073**: System MUST validate that assignedUserId references an active user

### Key Entities *(include if feature involves data)*

- **Contact**: Represents a contact/person in the CRM system
  - Attributes: id (UUID), title, firstName, lastName (required), officePhone, mobile, jobTitle, department, accountId, assignedUserId, leadSource, reportsToId, campaignId, primaryAddress fields, alternateAddress fields, description, dateCreated, dateModified, createdBy, modifiedUserId, deleted (soft delete flag)
  - Relationships: Many-to-one with Account, User (assigned, creator, modifier), Contact (reports to), Campaign; Many-to-many with EmailAddresses; One-to-many with Calls, Meetings, Tasks, Emails
  - Purpose: Stores contact information for CRM operations

- **EmailAddress**: Represents email addresses associated with contacts
  - Attributes: id (UUID), emailAddress (valid email format), primaryAddress (boolean, only one per contact), emailOptOut (boolean), invalidEmail (boolean)
  - Relationships: Many-to-many with Contact via email_addr_bean_rel join table
  - Purpose: Manages multiple email addresses per contact with primary designation

- **ContactColumnPreference**: Stores user preferences for column visibility and order
  - Attributes: id (UUID), userId, module ("Contacts"), columnPreferences (JSON array with fieldName, visible, order)
  - Relationships: Many-to-one with User
  - Purpose: Persists user's custom column configuration for contacts list view

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Contacts list page loads within 2 seconds on initial load - measured for 95% of page loads
- **SC-002**: Contact creation completes within 1 second for typical contact data - measured from form submission to success response
- **SC-003**: All functional requirements are implemented and tested - 100% requirement coverage in test suite
- **SC-004**: vCard import successfully processes valid vCard files with 100% accuracy - all valid vCard data is correctly extracted and mapped
- **SC-005**: Bulk import processes 1000+ contacts within 60 seconds - measured for standard CSV files
- **SC-006**: Filtering and sorting operations complete within 1 second - measured for typical dataset sizes (100-1000 contacts)
- **SC-007**: User access rules are correctly enforced - 100% of unauthorized access attempts are blocked
- **SC-008**: Column preferences are saved and applied correctly - 100% of saved preferences persist across sessions
- **SC-009**: Recently viewed contacts list displays correctly - most recent 10 contacts are shown, ordered by most recent first
- **SC-010**: Bulk actions process all selected contacts correctly - 100% success rate for authorized contacts, proper error reporting for unauthorized contacts
- **SC-011**: Soft delete functionality works correctly - deleted contacts are excluded from list views but remain in database
- **SC-012**: Email address primary flag enforcement works - only one email can be primary per contact, enforced in all operations
- **SC-013**: All validation rules are enforced - 100% of invalid data is rejected with appropriate error messages
- **SC-014**: Audit trail captures all contact modifications - 100% of create, update, and delete operations are logged
- **SC-015**: Pagination works correctly for all dataset sizes - handles empty pages, edge cases, and maintains filter/sort state

---

## Technical Implementation Notes

This feature specification is derived from the detailed frontend and backend requirements documents. The implementation should:

- Follow REST API patterns for all backend operations
- Implement proper authentication and authorization for all endpoints
- Support soft delete pattern (set deleted flag, don't physically remove records)
- Maintain audit trail for all contact modifications
- Enforce email address primary flag constraint
- Handle vCard parsing and bulk import with proper error handling
- Implement efficient filtering, sorting, and pagination with database optimization
- Support column preferences persistence per user
- Track recently viewed contacts per user session
- Validate all foreign key relationships before saving
- Prevent circular references in Reports To relationships
- Handle concurrent edits appropriately

For detailed technical requirements, refer to:
- `requirements/contacts/backend-requirements.md`
- `requirements/contacts/frontend-requirements.md`
- `specs/contacts/backend-specs.md` - Backend technical specifications
- `specs/contacts/frontend-specs.md` - Frontend technical specifications
- `specs/contacts/technical-specs.md` - Common technical specifications (API formats, data structures)

