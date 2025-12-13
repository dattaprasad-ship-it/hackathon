# Frontend Specifications - Contacts Module

**Feature Branch**: `003-contacts-frontend`  
**Created**: 2025-12-12  
**Updated**: 2025-12-12 (clarifications applied)  
**Status**: Draft  
**Input**: User description: "Frontend specifications for Contacts module derived from frontend requirements"

**Note**: This specification has been updated with clarifications for email/phone click behavior, filter/sort persistence, bulk actions, column preferences (max 7 columns, user-specific), recently viewed (max 20), and other user interactions based on user feedback.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Views Contacts List (Priority: P1)

As an authenticated user (Admin or Employee), I want to view a list of contacts with sorting, filtering, and pagination, so that I can efficiently find and manage contact information.

**Why this priority**: The contacts list is the primary interface for accessing contact data. It's the entry point to all contact management operations and must provide efficient search, filtering, and navigation capabilities. Without this, users cannot effectively manage contacts.

**Independent Test**: Can be fully tested by navigating to the contacts list page, verifying contacts are displayed with default columns, testing sorting and filtering functionality, and confirming pagination works correctly. This delivers immediate value by providing access to all contact data.

**Acceptance Scenarios**:

1. **Given** a user is authenticated and navigates to Contacts module, **When** they view the contacts list page, **Then** they see a table displaying contacts with default columns (Name, Job Title, Account Name, Email, Office Phone, User, Date Created)
2. **Given** a user is on the contacts list page, **When** they click on a column header, **Then** the table sorts by that column (ascending on first click, descending on second click) and sort indicator updates
3. **Given** a user applies filters to the contacts list, **When** they click Search, **Then** the table updates to display only contacts matching the filter criteria
4. **Given** a user has more than 20 contacts, **When** they view the contacts list, **Then** pagination controls appear in both header and footer showing page information (e.g., "1 - 20 of 200")
5. **Given** a user is an Employee, **When** they view the contacts list, **Then** they only see contacts assigned to them or contacts they have access to

---

### User Story 2 - User Creates New Contact (Priority: P1)

As an authenticated user (Admin or Employee), I want to create a new contact with all relevant information, so that I can add new contacts to the CRM system.

**Why this priority**: Creating contacts is a fundamental CRUD operation. Users need the ability to add new contacts to build their contact database. This is essential for maintaining up-to-date contact information.

**Independent Test**: Can be fully tested by navigating to create contact page, filling in required fields (Last Name minimum), entering contact information across all tabs (Overview, More Information, Other), and verifying the contact is created successfully. This delivers value by enabling users to add new contacts to the system.

**Acceptance Scenarios**:

1. **Given** a user navigates to Create Contact page, **When** they fill in required fields (Last Name) and click Save, **Then** a new contact is created and they are redirected to the contact detail page
2. **Given** a user is creating a contact, **When** they do not provide Last Name, **Then** validation error is displayed inline next to Last Name field and contact is not created
3. **Given** a user is creating a contact, **When** they add multiple email addresses using plus icon, **Then** they can mark one email as primary using checkbox
4. **Given** a user creates a contact, **When** the contact is saved successfully, **Then** success message is displayed and user is redirected to contact detail page
5. **Given** a user creates a contact without specifying assigned user, **When** the contact is saved, **Then** assignedUserId defaults to the current user (pre-filled in form)

---

### User Story 3 - User Views and Edits Contact Details (Priority: P1)

As an authenticated user (Admin or Employee), I want to view detailed contact information and edit contact details, so that I can maintain accurate and up-to-date contact records.

**Why this priority**: Viewing and editing contacts is a core functionality. Users need to access full contact details and update information as it changes. This is essential for data maintenance and accuracy.

**Independent Test**: Can be fully tested by clicking on a contact name from the list, verifying all contact details are displayed correctly, editing fields, and confirming changes are saved successfully. This delivers value by allowing users to maintain accurate contact information.

**Acceptance Scenarios**:

1. **Given** a user clicks on a contact name from the contacts list, **When** the contact detail page loads, **Then** all contact information is displayed in an editable form with all tabs (Overview, More Information, Other)
2. **Given** a user is viewing a contact detail page, **When** they modify contact fields and click Save, **Then** changes are saved, success message is displayed, and dateModified is updated
3. **Given** a user views a contact detail page, **When** the page loads, **Then** the contact is tracked in recently viewed contacts
4. **Given** a user edits a contact, **When** they save changes, **Then** modifiedUserId is set to current user and audit trail is updated (backend handles this)
5. **Given** a user is an Employee viewing a contact, **When** the contact is not assigned to them, **Then** they can only view/edit if they have access permissions

---

### User Story 4 - User Imports Contact from vCard (Priority: P2)

As an authenticated user (Admin or Employee), I want to import a contact from a vCard file, so that I can quickly add contacts from external sources like email clients.

**Why this priority**: vCard import provides a convenient way to bulk import contacts from external sources. While not critical for core functionality, it significantly improves efficiency when migrating contacts or importing from other systems.

**Independent Test**: Can be fully tested by navigating to Import VCard page, selecting a valid .vcf or .vcard file, clicking Import, and verifying the contact is created with correct information extracted from the vCard. This delivers value by enabling quick contact import from external sources.

**Acceptance Scenarios**:

1. **Given** a user navigates to Import VCard page, **When** they select a valid .vcf or .vcard file and click Import VCard, **Then** a contact is created with information extracted from the vCard file and success message is displayed
2. **Given** a user selects an invalid file format (not .vcf or .vcard), **When** they click Import VCard, **Then** an error message is displayed indicating only .vcf and .vcard files are supported
3. **Given** a user imports a vCard with multiple email addresses, **When** the contact is created, **Then** all email addresses are imported and one is marked as primary
4. **Given** a vCard file cannot be parsed, **When** the user attempts to import, **Then** a detailed error message is displayed explaining the parsing failure

---

### User Story 5 - User Performs Bulk Actions on Contacts (Priority: P2)

As an authenticated user (Admin or Employee), I want to select multiple contacts and perform bulk actions, so that I can efficiently manage multiple contacts at once.

**Why this priority**: Bulk actions significantly improve efficiency when managing large numbers of contacts. While not critical for core functionality, it's essential for power users who need to manage many contacts simultaneously.

**Independent Test**: Can be fully tested by selecting multiple contacts using checkboxes, clicking Bulk Action button, selecting an action (e.g., delete), and verifying the action is performed on all selected contacts. This delivers value by enabling efficient management of multiple contacts.

**Acceptance Scenarios**:

1. **Given** a user selects one or more contacts using checkboxes, **When** contacts are selected, **Then** the Bulk Action button becomes enabled and selection indicator shows "Selected: X"
2. **Given** a user has selected contacts, **When** they click Bulk Action and select Delete, **Then** confirmation dialog appears, and upon confirmation, all selected contacts are soft-deleted
3. **Given** a user performs a bulk action, **When** the action completes, **Then** success/failure counts are displayed in a message
4. **Given** a user selects contacts they don't have permission to modify, **When** bulk action is performed, **Then** only authorized contacts are processed and permission errors are reported for others

---

### User Story 6 - User Customizes Column Visibility (Priority: P3)

As an authenticated user (Admin or Employee), I want to customize which columns are visible in the contacts table, so that I can tailor the view to show only the information most relevant to my work.

**Why this priority**: Column customization improves personal productivity but is not essential for core functionality. It's a quality-of-life feature that allows users to optimize their workspace.

**Independent Test**: Can be fully tested by clicking Choose Columns button, dragging columns between DISPLAYED and HIDDEN sections, reordering columns, clicking Save, and verifying the table reflects the changes. This delivers value by allowing users to customize their view.

**Acceptance Scenarios**:

1. **Given** a user clicks the Choose Columns button (burger icon), **When** the modal opens, **Then** two sections are displayed: DISPLAYED (left, purple background) and HIDDEN (right, red/salmon background)
2. **Given** a user drags a column from HIDDEN to DISPLAYED section, **When** they save preferences, **Then** that column appears in the contacts table
3. **Given** a user reorders columns within DISPLAYED section, **When** they save preferences, **Then** columns appear in the new order in the contacts table
4. **Given** a user customizes columns, **When** they return to contacts list later, **Then** their column preferences are applied automatically

---

### Edge Cases

- What happens when the user's internet connection is lost during form submission?
  - System should display a network error message and allow retry when connection is restored

- What happens when the API returns a 500 server error?
  - System should display a generic error message ("An error occurred. Please try again later.") and allow retry

- What happens when the authentication token expires during a request?
  - System should redirect to login page and display appropriate message

- What happens when filtering returns zero results?
  - System should display an empty state message indicating no contacts match the filter criteria

- What happens when a user tries to mark multiple emails as primary for the same contact?
  - System should enforce that only one email can be primary, and automatically unmark other primary emails when a new one is marked

- What happens when pagination reaches the last page and a contact is deleted?
  - System should handle empty page gracefully - either redirect to previous page or show empty state

- What happens when two users simultaneously edit the same contact?
  - System should handle concurrent edits appropriately - last write wins or show conflict message

- What happens when a user tries to assign a contact to a user that has been deleted?
  - System should validate and prevent assignment, showing error message

- What happens when column preferences cannot be saved?
  - System should display error message but allow user to continue with current preferences

- What happens when vCard file upload fails due to size limit?
  - System should display error message indicating file size limit exceeded

## Requirements *(mandatory)*

### Functional Requirements

#### Pages and Routes

- **FR-001**: System MUST provide Contacts List View page at route `/contacts` and `/contacts/index`
- **FR-002**: System MUST provide Create Contact page at route `/contacts/create`
- **FR-003**: System MUST provide Contact Detail/Edit page at route `/contacts/:id`
- **FR-004**: System MUST provide Import VCard page at route `/contacts/importvcard`
- **FR-005**: System MUST provide Import Contacts page at route `/contacts/import`
- **FR-006**: System MUST protect all Contacts routes with authentication guard
- **FR-007**: System MUST redirect unauthenticated users to login page

#### UI Components

- **FR-008**: System MUST display contacts in a table format with sortable columns
- **FR-009**: System MUST display default columns: Name, Job Title, Account Name, Email, Office Phone, User, Date Created
- **FR-010**: System MUST display action icons for each contact row: call icon, calendar icon, tasks icon, email icon
- **FR-011**: System MUST display clickable links (in red text) for contact names, emails, phone numbers, account names, and user names
- **FR-012**: System MUST display checkbox in front of every contact entry for individual selection
- **FR-013**: System MUST display header checkbox for selecting all visible entries at once
- **FR-014**: System MUST display "Bulk Action" button that is disabled by default and enabled when one or more records are selected
- **FR-015**: System MUST display selection indicator showing "Selected: X" when contacts are selected
- **FR-016**: System MUST display "Choose Columns" button (burger icon) that opens column customization popup
- **FR-017**: System MUST display pagination controls in both header and footer sections
- **FR-018**: System MUST display pagination information in format "(X - Y of Z)" between Previous and Next buttons
- **FR-019**: System MUST display sort indicators on all sortable column headers (up/down arrow for default, up arrow for ascending, down arrow for descending)

#### Forms

- **FR-020**: System MUST provide Create Contact form with tabbed interface (Overview, More Information, Other)
- **FR-021**: System MUST require Last Name field (marked with asterisk)
- **FR-022**: System MUST support multiple email addresses with Primary designation
- **FR-023**: System MUST support adding/removing email addresses using plus/minus icons
- **FR-024**: System MUST support title dropdown (Mr., Ms., Mrs., Miss, Dr., Prof.)
- **FR-025**: System MUST support Lead Source dropdown with predefined options
- **FR-026**: System MUST support Reports To searchable dropdown to select a contact
- **FR-027**: System MUST support Campaign dropdown
- **FR-028**: System MUST display Date Created and Date Modified in Other tab (empty for new contacts, populated for existing)
- **FR-029**: System MUST pre-fill Assigned To field with current user
- **FR-030**: System MUST validate form fields before submission

#### Filtering

- **FR-031**: System MUST provide Filter button that opens Basic Filter panel
- **FR-032**: System MUST support filtering by: First Name, Last Name, Account Name, Assigned To, Email, Phone, Address, State, Country, Postal Code, City, Lead Source
- **FR-033**: System MUST provide Search button to apply filters
- **FR-034**: System MUST provide Clear button to clear all filters
- **FR-035**: System MUST preserve filter state during session

#### Sorting

- **FR-036**: System MUST support sorting by clicking on column headers
- **FR-037**: System MUST support ascending and descending sort directions (toggle on click)
- **FR-038**: System MUST update sort indicator on column header when sorted
- **FR-039**: System MUST preserve sort state during session

#### Pagination

- **FR-040**: System MUST support pagination with configurable page size (default: 20, max: 100)
- **FR-041**: System MUST display pagination controls in both header and footer
- **FR-042**: System MUST provide First (<<), Previous (<), Next (>), Last (>>) pagination buttons
- **FR-043**: System MUST disable pagination buttons when at first/last page
- **FR-044**: System MUST maintain pagination state with filters and sorting

#### Bulk Actions

- **FR-045**: System MUST support selecting multiple contacts via checkboxes
- **FR-046**: System MUST support bulk actions: Delete (Admin only), Export, Merge, Mass Update, Add To Target List, Print PDF
- **FR-047**: System MUST validate user permissions for each selected contact before bulk action (Employee role cannot delete contacts)
- **FR-048**: System MUST display success/failure counts after bulk action completion
- **FR-048A**: System MUST support "Add To Target List" bulk action - prompts user to select which target list to add contacts to
- **FR-048B**: System MUST support "Merge" bulk action - compares contacts by name to identify duplicates, prompts user whether to keep or skip duplicate data, stores all related records (calls, meetings, tasks, etc.) from merged contacts
- **FR-048C**: System MUST support "Mass Update" bulk action - all fields except username/assignedUserId can be mass updated, shows form/modal to select fields and values

#### Column Customization

- **FR-049**: System MUST allow users to customize visible columns in contacts table
- **FR-050**: System MUST support adding columns (move from HIDDEN to DISPLAYED)
- **FR-051**: System MUST support removing columns (move from DISPLAYED to HIDDEN)
- **FR-052**: System MUST support reordering columns within DISPLAYED section
- **FR-053**: System MUST persist column preferences per user (user-specific preferences, maximum 7 columns displayed at once)
- **FR-054**: System MUST apply saved column preferences when loading contacts list (preferences persist across browser sessions)
- **FR-055**: System MUST provide additional columns for customization: Mobile, Department, Lead Source, and other contact fields beyond default columns

#### Recently Viewed

- **FR-055**: System MUST display recently viewed contacts in dropdown menu (limit: 20 contacts maximum)
- **FR-056**: System MUST order recently viewed contacts by most recent first
- **FR-057**: System MUST allow navigation to contact detail from recently viewed list

#### API Integration

- **FR-058**: System MUST consume backend API using JSON-API format
- **FR-059**: System MUST parse JSON-API response structure (`data`, `meta`, `links`)
- **FR-060**: System MUST handle JSON-API error format (`errors` array)
- **FR-061**: System MUST map JSON-API `data.attributes` to form field values
- **FR-062**: System MUST map JSON-API `data.relationships` to related record references
- **FR-063**: System MUST transform form values to JSON-API request format
- **FR-064**: System MUST handle date/time transformations between ISO 8601 (API) and display formats (UI)
- **FR-065**: System MUST display loading indicators during API calls
- **FR-066**: System MUST handle API errors gracefully with user-friendly messages

#### Field Type Mappings

- **FR-067**: System MUST map backend field types to frontend components:
  - `varchar` → Text input component
  - `text` → Textarea component (multi-line)
  - `phone` → Phone input component with formatting
  - `email` → Email input component with validation
  - `date` → Date picker component
  - `datetime` → DateTime picker component
  - `enum` → Dropdown select component
  - `relate` → Related record selector (autocomplete/search) component
  - `bool` → Checkbox component

#### Validation

- **FR-068**: System MUST validate required fields before form submission
- **FR-069**: System MUST display validation errors inline with form fields
- **FR-070**: System MUST validate email address format
- **FR-071**: System MUST parse JSON-API validation errors and map to form fields using `source.pointer`
- **FR-072**: System MUST clear validation errors when user starts typing

#### Error Handling

- **FR-073**: System MUST display errors in toast notifications or inline error messages
- **FR-074**: System MUST provide retry button for failed API operations
- **FR-075**: System MUST display user-friendly error messages (avoid technical jargon)
- **FR-076**: System MUST handle network errors gracefully
- **FR-077**: System MUST handle authentication errors (401) by redirecting to login
- **FR-078**: System MUST handle authorization errors (403) with appropriate message
- **FR-079**: System MUST handle not found errors (404) with appropriate message
- **FR-080**: System MUST handle server errors (500) with generic error message

### Key Components *(include if feature involves UI components)*

- **ContactsTable**: Displays contacts in sortable, paginated table format
  - Props: contacts (array), onSort (function), onSelect (function), onContactClick (function), sortColumn (string), sortDirection (string), selectedContacts (array)
  - Features: Sortable columns, row selection, action icons, clickable links
  - Styling: Table layout with red text for clickable links, action icons aligned in rightmost column

- **ContactForm**: Form for creating/editing contacts with tabbed interface
  - Props: onSave (function), onCancel (function), initialValues (object), isLoading (boolean)
  - Features: Tabbed interface (Overview, More Information, Other), field validation, multiple email addresses
  - Styling: Two-column layout, active tab highlighted in dark grey

- **FilterPanel**: Filter panel for contacts list
  - Props: isOpen (boolean), onClose (function), onSearch (function), onClear (function), filterValues (object)
  - Features: Basic Filter form, Quick Filter section, filter state management
  - Styling: Three-column layout, Search button (red background), Clear button (red text on light red background)

- **BulkActionButton**: Dropdown button for bulk actions
  - Props: selectedCount (number), onAction (function), actions (array), isEnabled (boolean)
  - Features: Disabled by default, enabled when contacts selected, dropdown menu with actions
  - Styling: Dropdown button with arrow indicator, disabled state (greyed out)

- **ChooseColumnsModal**: Modal for customizing column visibility
  - Props: isOpen (boolean), onClose (function), displayedColumns (array), hiddenColumns (array), onColumnMove (function), onSave (function)
  - Features: Drag and drop columns between DISPLAYED and HIDDEN sections, column reordering
  - Styling: Modal overlay, DISPLAYED section (purple background), HIDDEN section (red/salmon background)

- **PaginationControls**: Controls for navigating through paginated data
  - Props: currentPage (number), pageSize (number), totalCount (number), onPageChange (function), position ('header' | 'footer')
  - Features: First, Previous, Next, Last buttons, page information display
  - Styling: Navigation buttons with white outline on dark grey background, page info in bold white font

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Contacts list page loads within 2 seconds on initial load - measured for 95% of page loads
- **SC-002**: Contact creation form submission completes within 1 second for typical contact data - measured from form submission to success response
- **SC-003**: All functional requirements are implemented and tested - 100% requirement coverage in test suite
- **SC-004**: Sorting and filtering operations complete within 1 second - measured for typical dataset sizes (100-1000 contacts)
- **SC-005**: All clickable elements provide visual feedback within 100ms - hover states, click feedback
- **SC-006**: JSON-API response parsing works correctly - 100% of API responses are correctly parsed and displayed
- **SC-007**: Error handling works correctly - all error scenarios display appropriate user-friendly messages
- **SC-008**: Column preferences are saved and applied correctly - 100% of saved preferences persist across sessions
- **SC-009**: Form validation works correctly - all validation errors are displayed inline with appropriate fields
- **SC-010**: Pagination works correctly for all dataset sizes - handles empty pages, edge cases, maintains filter/sort state
- **SC-011**: Bulk actions process all selected contacts correctly - proper permission checking and error reporting
- **SC-012**: Recently viewed contacts list displays correctly - most recent 20 contacts shown, ordered by most recent first
- **SC-013**: All field type mappings work correctly - each backend field type renders appropriate frontend component
- **SC-014**: Date/time transformations work correctly - ISO 8601 format from API correctly converted to display format
- **SC-015**: Responsive design works across mobile, tablet, and desktop viewports - all features accessible on all devices

---

## Technical Implementation Notes

This specification is derived from the detailed frontend requirements document. The implementation should:

- Use React with TypeScript following project structure conventions
- Use Shadcn UI components from `src/components/ui` when possible
- Follow frontend structure guidelines in `.cursor/rules/frontend-structure.mdc`
- Implement proper error handling using JSON-API error format
- Handle JSON-API request/response format correctly
- Transform data between API format (JSON-API) and form format
- Implement proper loading states and error states
- Use proper state management for filters, sorting, pagination, and selection
- Persist user preferences (column preferences) per user
- Track recently viewed contacts per user session
- Implement proper form validation with inline error display
- Handle concurrent edits appropriately
- Implement responsive design for mobile, tablet, and desktop
- Use proper accessibility features (ARIA labels, keyboard navigation)

**API Integration**:
- All API requests and responses use JSON-API format (JSON-API 1.0 specification)
- Datetime values are in ISO 8601 format (e.g., "2024-01-01T00:00:00Z")
- Error responses follow JSON-API error format with `errors` array
- Pagination uses `page[offset]` and `page[limit]` query parameters
- Field selection uses `fields[Contacts]` query parameter

**Data Mapping**:
- Transform JSON-API response `data.attributes` to form field values
- Transform JSON-API response `data.relationships` to related record references
- Transform form values to JSON-API request `data.attributes` format
- Handle date/time transformations between ISO 8601 (API) and display formats (UI)

**Component Patterns**:
- Use reusable field components based on field type (text, email, phone, date, enum, relate, etc.)
- Form components should handle validation errors from JSON-API error responses
- Table components should handle JSON-API pagination metadata from `meta` and `links` objects

For detailed technical requirements, refer to `requirements/contacts/frontend-requirements.md`.

