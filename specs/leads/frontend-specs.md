# Frontend Specifications - Leads Module

**Feature Branch**: `leads-module-frontend`  
**Created**: 2025-01-XX  
**Status**: Draft  
**Input**: Frontend requirements for Leads module - CRM module for managing unqualified contacts

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Views Leads List (Priority: P1)

As a Sales User or Sales Manager, I want to view a list of all leads in a sortable, filterable table, so that I can quickly find and manage lead records.

**Why this priority**: The Leads List View is the primary entry point for the Leads module. Users need immediate access to lead records with the ability to sort, filter, and perform actions. This is critical for daily sales operations.

**Independent Test**: Can be fully tested by navigating to the Leads list view, verifying the table displays with all columns, testing sorting and filtering functionality, and confirming pagination works correctly. This delivers immediate value by providing users with comprehensive lead management capabilities.

**Acceptance Scenarios**:

1. **Given** an authenticated user navigates to `/#/leads`, **When** the page loads, **Then** they see the Leads List View with module title, filter/insights buttons, pagination controls, and data table
2. **Given** a user is on the Leads List View, **When** the page loads, **Then** they see a table with columns: Name, Status, Account Name, Office Phone, Email, User
3. **Given** a user is on the Leads List View, **When** they view the table, **Then** all column headers are sortable with sort direction indicators
4. **Given** a user is on the Leads List View, **When** they view the table, **Then** they see row action icons (Phone, Calendar, Envelope, Add Task) for each lead
5. **Given** a user is on the Leads List View, **When** they view pagination, **Then** they see current page range and total count (e.g., "1 - 20 of 206")

---

### User Story 2 - User Creates a New Lead (Priority: P1)

As a Sales User, I want to create a new lead record by filling out a form, so that I can capture prospect information from marketing events or other sources.

**Why this priority**: Creating leads is a fundamental operation in CRM. Users need to quickly capture lead information to begin the sales process. This is essential for converting prospects into opportunities.

**Independent Test**: Can be fully tested by navigating to create lead page, filling out required fields, submitting the form, and verifying the lead is created and user is redirected to detail view. This delivers value by enabling users to capture and store prospect information.

**Acceptance Scenarios**:

1. **Given** a user navigates to `/#/leads/create`, **When** the page loads, **Then** they see a form with tabs (Overview, More Info, Other) and header actions (Save, Cancel, Save & Continue)
2. **Given** a user is creating a lead, **When** they fill the form, **Then** Last Name field is marked as required and validated
3. **Given** a user enters an email address, **When** they submit the form, **Then** the email format is validated
4. **Given** a user clicks "Save", **When** validation passes, **Then** the lead is created and user is redirected to Lead Detail View
5. **Given** a user clicks "Save & Continue", **When** validation passes, **Then** the lead is saved and user remains on the edit page

---

### User Story 3 - User Views Lead Details (Priority: P1)

As a Sales User, I want to view detailed information about a lead, so that I can see all captured data and related activities.

**Why this priority**: Viewing lead details is essential for understanding the full context of a prospect. Users need to see all information, relationships, and activity history to make informed decisions about next steps.

**Independent Test**: Can be fully tested by clicking on a lead name from the list view, verifying the detail view displays all fields in read-only mode, and testing inline edit functionality. This delivers value by providing comprehensive lead information.

**Acceptance Scenarios**:

1. **Given** a user clicks on a lead name in the list view, **When** they click, **Then** they are navigated to Lead Detail View at `/#/leads/record/{id}`
2. **Given** a user is on Lead Detail View, **When** the page loads, **Then** they see the same form structure as Create/Edit Lead displayed in read-only mode
3. **Given** a user is on Lead Detail View, **When** they view the page, **Then** they see header with Back button, Actions dropdown, and Favorite Star icon
4. **Given** a user is on Lead Detail View, **When** they click a pencil icon next to a field, **Then** that field switches to edit mode
5. **Given** a user is on Lead Detail View, **When** they view relationships, **Then** they see sub-panels for Activities, History, Documents, and Contacts

---

### User Story 4 - User Filters and Sorts Leads (Priority: P1)

As a Sales User, I want to filter and sort the leads list by various criteria, so that I can quickly find specific leads based on status, assigned user, or other attributes.

**Why this priority**: Filtering and sorting are essential for managing large lead databases. Users need efficient ways to locate specific records without scrolling through hundreds of entries. This significantly improves productivity.

**Independent Test**: Can be fully tested by opening the filter panel, applying various filter criteria, saving a filter, and testing column sorting. This delivers value by enabling users to efficiently locate and organize lead records.

**Acceptance Scenarios**:

1. **Given** a user is on Leads List View, **When** they click "Filter" button, **Then** the filter panel expands below the module title on the same page
2. **Given** a user is in the filter panel, **When** they enter filter criteria, **Then** they can filter by First Name, Last Name, Account Name, Email, Phone, City, State, Status, Lead Source, and Assigned to
3. **Given** a user applies filters, **When** they click "Search", **Then** the table updates to show only matching leads
4. **Given** a user has applied filters, **When** they click "Save", **Then** the filter configuration is saved with a name for future use
5. **Given** a user clicks on a column header, **When** they click, **Then** the table sorts by that column (ascending/descending toggle)

---

### User Story 5 - User Performs Quick Actions on Leads (Priority: P1)

As a Sales User, I want to quickly initiate communication or create activities directly from the leads list, so that I can efficiently follow up with prospects without navigating to multiple pages.

**Why this priority**: Quick actions streamline the sales workflow by allowing users to create calls, meetings, tasks, and emails directly from the list view. This reduces navigation steps and improves efficiency in daily sales activities.

**Independent Test**: Can be fully tested by clicking each row action icon (Phone, Calendar, Envelope, Add Task) and verifying correct navigation to respective create pages or modals with the lead pre-selected. This delivers value by reducing workflow friction.

**Acceptance Scenarios**:

1. **Given** a user is on Leads List View, **When** they click the Phone icon on a lead row, **Then** they are redirected to Create Call form with the lead pre-selected
2. **Given** a user is on Leads List View, **When** they click the Calendar icon, **Then** they are redirected to Create Meeting form with the lead pre-selected
3. **Given** a user is on Leads List View, **When** they click the Envelope icon, **Then** the Email Compose Modal opens with recipient pre-filled
4. **Given** a user is on Leads List View, **When** they click the Add Task icon, **Then** they are redirected to Create Task form with the lead pre-selected
5. **Given** a user clicks on a phone number link in the table, **When** they click, **Then** call options open or call is initiated

---

### User Story 6 - User Performs Bulk Actions on Selected Leads (Priority: P2)

As a Sales Manager, I want to select multiple leads and perform bulk operations (delete, export, mass update), so that I can efficiently manage large numbers of leads at once.

**Why this priority**: Bulk operations are essential for administrative tasks and data management. While not used daily by all users, they significantly improve efficiency when managing large lead databases or performing maintenance tasks.

**Independent Test**: Can be fully tested by selecting multiple leads, opening the bulk action menu, selecting an action, and verifying it applies to all selected leads. This delivers value by enabling efficient bulk data management.

**Acceptance Scenarios**:

1. **Given** a user is on Leads List View, **When** they select one or more leads using checkboxes, **Then** the bulk action bar appears showing selection count
2. **Given** a user has selected leads, **When** they click "Bulk Action" dropdown, **Then** they see options: Add To Target List, Print as PDF, Delete, Export, Merge, Mass Update
3. **Given** a user selects a bulk action, **When** they confirm, **Then** the action is applied to all selected leads
4. **Given** a user selects "Select All" checkbox, **When** they click, **Then** all visible leads are selected
5. **Given** a bulk action fails for some leads, **When** it completes, **Then** the system displays which leads failed and why

---

### User Story 7 - User Customizes Table Columns (Priority: P2)

As a Sales User, I want to customize which columns are visible in the leads table, so that I can focus on the information most relevant to my workflow.

**Why this priority**: Column customization allows users to personalize their view based on their specific needs. While not critical for core functionality, it significantly enhances user experience and productivity by reducing visual clutter.

**Independent Test**: Can be fully tested by opening the column chooser modal, dragging columns between sections, saving changes, and verifying the table updates. This delivers value by allowing users to customize their workspace.

**Acceptance Scenarios**:

1. **Given** a user is on Leads List View, **When** they click "Choose Columns" button, **Then** a modal opens showing "Displayed Columns" and "Available Columns" sections
2. **Given** a user is in the column chooser modal, **When** they drag a column from "Available" to "Displayed", **Then** the column moves between sections
3. **Given** a user has customized columns, **When** they click "Save Changes", **Then** the table immediately updates to show the new column configuration
4. **Given** a user has customized columns, **When** they click "Close" without saving, **Then** the modal closes and no changes are applied

---

### User Story 8 - User Imports Leads from File (Priority: P2)

As a Sales Manager, I want to import multiple leads from a CSV/Excel file, so that I can bulk import lead data from marketing campaigns or external sources.

**Why this priority**: Import functionality is essential for onboarding large numbers of leads from marketing events, trade shows, or external systems. While not used daily, it's critical for initial data setup and periodic bulk imports.

**Independent Test**: Can be fully tested by navigating to Import Leads, uploading a file, mapping columns, configuring duplicate checking, and verifying leads are imported correctly. This delivers value by enabling efficient bulk data entry.

**Acceptance Scenarios**:

1. **Given** a user navigates to Import Leads (via Leads > Import Leads), **When** they reach Step 1, **Then** they can upload a file and select "Create new records only" or "Create new records and update existing records"
2. **Given** a user is importing leads, **When** they reach Step 3, **Then** they can drag and drop CSV headers to map to system fields
3. **Given** a user completes the import wizard, **When** they reach Step 5, **Then** they see import results with success/error counts
4. **Given** an import fails for some rows, **When** errors occur, **Then** the system provides a downloadable error log for specific rows

---

### User Story 9 - User Views Lead Insights and Analytics (Priority: P2)

As a Sales Manager, I want to view analytics and insights about leads, so that I can understand lead distribution by status and track conversion metrics.

**Why this priority**: Insights provide valuable analytics for sales management and reporting. While not critical for daily operations, they help managers understand lead pipeline health and make data-driven decisions.

**Independent Test**: Can be fully tested by clicking the Insights button, verifying the sidebar panel toggles open, and confirming donut charts and statistics display correctly. This delivers value by providing actionable analytics.

**Acceptance Scenarios**:

1. **Given** a user is on Leads List View, **When** they click "Insights" button, **Then** a collapsible sidebar panel toggles open/closed
2. **Given** a user views the Insights panel, **When** it opens, **Then** they see donut charts showing leads by Status
3. **Given** a user views the Insights panel, **When** they see the charts, **Then** they see total counts for each status category and quick stats (New, Converted, Dead counts)
4. **Given** a user clicks "Insights" button again, **When** they click, **Then** the panel collapses

---

### Edge Cases

- What happens when the Leads List View API request fails (network error, 500 error)?
  - System should display an error toast notification in the top right, show a retry button, and allow user to retry the request

- What happens when a user tries to create a lead with a duplicate email address?
  - System should validate for duplicates if duplicate checking is enabled, and display an appropriate error message

- What happens when a user selects 100+ leads for bulk delete and confirms?
  - System should process the deletion in batches, show progress indicator, and display results (success count, failure count with details)

- What happens when a user applies a filter that returns zero results?
  - System should display an empty state message indicating no leads match the filter criteria, with option to clear filters

- What happens when a user navigates to a lead detail view for a lead that was just deleted by another user?
  - System should detect the deleted record, display a "Lead not found" error message, and redirect to list view

- What happens when a user is editing a lead and another user deletes the same lead?
  - System should detect the deletion on save attempt, display an error message, and prevent saving changes to deleted record

- What happens when column chooser modal is opened but user has unsaved column changes from a previous session?
  - System should load the last saved column configuration, not the current unsaved state

- What happens when a saved filter is deleted while another user is using it?
  - System should handle gracefully - if filter is deleted, user should see an error when trying to load it, and system should remove it from saved filters list

- What happens when Insights panel data fails to load?
  - System should display an error state within the Insights panel with retry option, but not block the main list view

- What happens when a user tries to sort by a column that has null values for many records?
  - System should handle null values consistently (either show nulls first or last based on sort direction)

- What happens when pagination state is lost (e.g., browser refresh, navigation away and back)?
  - System should preserve pagination state in URL parameters or session storage, restoring page number and sort order when user returns

- What happens when a user applies a filter that matches thousands of leads?
  - System should handle large result sets efficiently with server-side pagination, showing first page immediately and loading subsequent pages on demand

- What happens when a user clicks on a lead name link but the lead ID in URL is invalid or malformed?
  - System should validate the ID format, display an error message for invalid IDs, and redirect to list view

- What happens when email compose modal is opened but email service is unavailable?
  - System should display an error message in the modal indicating email service is unavailable, with option to retry

- What happens when a user tries to save a filter with a name that already exists?
  - System should either prevent duplicate names, auto-rename with a number suffix, or prompt user to overwrite existing filter

- What happens when Insights panel is toggled while data is still loading?
  - System should cancel the loading request if panel is closed, or continue loading if panel remains open

- What happens when a user performs a bulk action on selected leads but their permissions change during the operation?
  - System should validate permissions before executing action, and skip leads the user no longer has permission to modify

- What happens when a user is viewing Lead Detail View and the lead status is changed by another user?
  - System should either show a notification about the change, refresh the data, or maintain the current view state based on business rules

- What happens when filter panel is expanded but viewport is too small to display it fully?
  - System should make the filter panel scrollable or adapt layout to fit available space

- What happens when a user tries to import a file with unsupported format or corrupted data?
  - System should validate file format on upload, display error message for unsupported formats, and provide guidance on supported formats

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Leads List View at route `/#/leads`
- **FR-002**: System MUST require authentication to access Leads List View
- **FR-003**: System MUST display module title "LEADS" prominently on the list view page
- **FR-004**: System MUST display a data table with columns: Name, Status, Account Name, Office Phone, Email, User
- **FR-005**: System MUST make all table column headers sortable with sort direction indicators
- **FR-006**: System MUST display row action icons (Phone, Calendar, Envelope, Add Task) for each lead row
- **FR-007**: System MUST display hyperlinked lead names (red color) that navigate to Lead Detail View
- **FR-008**: System MUST display hyperlinked phone numbers (red color) that initiate calls or open call options
- **FR-009**: System MUST display hyperlinked email addresses (red color) that open email compose modal
- **FR-010**: System MUST display hyperlinked user names (red color) that navigate to user detail view
- **FR-011**: System MUST provide pagination controls (First, Previous, Next, Last) with page range display
- **FR-012**: System MUST preserve pagination state when navigating away and returning to list view
- **FR-013**: System MUST provide a "Filter" button that expands a filter panel on the same page
- **FR-014**: System MUST provide filter fields: First Name, Last Name, Account Name, Any Email, Any Address, Country, Any Phone, City, State/Region, Status, Lead Source, Assigned to
- **FR-015**: System MUST provide filter checkboxes: My Items, Open Items, My Favorites
- **FR-016**: System MUST allow users to save filter configurations with custom names
- **FR-017**: System MUST allow users to load, rename, and delete saved filters (user-specific)
- **FR-018**: System MUST provide an "Insights" button that toggles a collapsible sidebar panel
- **FR-019**: System MUST display donut charts showing leads by Status in the Insights panel
- **FR-020**: System MUST display total counts and quick stats (New, Converted, Dead) in Insights panel
- **FR-021**: System MUST provide row selection checkboxes for individual and bulk selection
- **FR-022**: System MUST display bulk action bar when one or more leads are selected
- **FR-023**: System MUST provide bulk actions: Add To Target List, Print as PDF, Delete, Export, Merge, Mass Update
- **FR-024**: System MUST provide a "Choose Columns" button that opens column chooser modal
- **FR-025**: System MUST allow drag-and-drop column selection between "Displayed" and "Available" sections
- **FR-026**: System MUST save column configuration and apply it immediately upon "Save Changes"
- **FR-027**: System MUST provide a Create Lead page at route `/#/leads/create`
- **FR-028**: System MUST provide a Lead Detail View at route `/#/leads/record/{id}`
- **FR-029**: System MUST provide a Lead Edit View at route `/#/leads/record/{id}/edit`
- **FR-030**: System MUST display the same form structure in Create, Edit, and Detail views
- **FR-031**: System MUST display Lead Detail View in read-only mode by default
- **FR-032**: System MUST provide inline edit triggers (pencil icons) to switch fields to edit mode
- **FR-033**: System MUST provide form tabs: Overview, More Info, Other
- **FR-034**: System MUST require Last Name field in lead forms
- **FR-035**: System MUST validate email format in lead forms
- **FR-036**: System MUST provide form actions: Save (redirects to Detail), Cancel, Save & Continue (stays on Edit)
- **FR-037**: System MUST display lead status values: New, Assigned, In Process, Converted, Recycled, Dead
- **FR-038**: System MUST allow any status to transition to any other status (no workflow restrictions)
- **FR-039**: System MUST provide Import Leads Wizard at route `/#/import/step1?import_module=Leads`
- **FR-040**: System MUST support 5-step import process: File Upload, File Properties, Field Mapping, Duplicate Checking, Results Summary
- **FR-041**: System MUST allow import type selection: "Create new records only" or "Create new records and update existing records"
- **FR-042**: System MUST provide drag-and-drop field mapping in import wizard
- **FR-043**: System MUST display import results with success/error counts and downloadable error log
- **FR-044**: System MUST provide global search bar that searches across all modules
- **FR-045**: System MUST display global search results in a dropdown with categorized results by module
- **FR-046**: System MUST provide History button that shows recently viewed records on hover
- **FR-047**: System MUST provide module navigation with hover dropdowns showing sub-actions and recently viewed items
- **FR-048**: System MUST display common sub-actions on module hover: Create [Module], View All [Module], Import [Module]
- **FR-049**: System MUST provide user profile dropdown with: User name, Edit Profile, Employees, Community Forum, About, Logout
- **FR-050**: System MUST redirect authenticated users to `/home` after login
- **FR-051**: System MUST display error messages in toast notifications (top right) for API errors
- **FR-052**: System MUST display validation errors inline for form fields
- **FR-053**: System MUST highlight required fields in red when validation fails
- **FR-054**: System MUST disable Save button when required fields are missing
- **FR-055**: System MUST provide loading indicators during API requests
- **FR-056**: System MUST handle API failures gracefully with retry options
- **FR-057**: System MUST support keyboard navigation for all interactive elements
- **FR-058**: System MUST be responsive across mobile, tablet, and desktop viewports
- **FR-059**: System MUST support deep linking to lead records via unique URLs
- **FR-060**: System MUST display URL preview when hovering over lead name links

### Key Entities *(include if feature involves data)*

- **Lead Record**: Represents a single lead/prospect
  - Attributes: ID, First Name, Last Name, Salutation, Account Name, Title, Department, Phone (Office/Mobile/Fax), Email (multi-entry), Address (Primary/Alt), Status, Status Description, Opportunity Amount, Campaign, Source, Referred By, Do Not Call flag, Assigned User, Created Date, Modified Date
  - Relationships: Linked to Account, Contact, Opportunities, Activities (Calls, Meetings, Tasks), Documents, History
  - Purpose: Stores unqualified contact information for sales pipeline management

- **Lead List State**: Represents the state of the Leads List View
  - Attributes: leads array, pagination state (current page, page size, total count), sort configuration (column, direction), filter state, selected leads, column configuration
  - Relationships: Manages lead data display, controls table interactions
  - Purpose: Maintains list view state for filtering, sorting, pagination, and selection

- **Filter Configuration**: Represents a saved filter setup
  - Attributes: filter name, filter criteria (field values, dropdown selections, checkboxes), created date, user ID
  - Relationships: User-specific, applied to lead queries
  - Purpose: Allows users to save and reuse filter configurations

- **Column Configuration**: Represents visible columns in the list view
  - Attributes: displayed columns array, available columns array, user preferences
  - Relationships: User-specific, applied to table display
  - Purpose: Customizes table view based on user preferences

- **Insights Data**: Represents analytics data for leads
  - Attributes: leads by status (counts, percentages), total counts, quick stats
  - Relationships: Aggregated from lead records
  - Purpose: Provides visual analytics for lead pipeline management

- **Import Job**: Represents a lead import operation
  - Attributes: file data, field mappings, duplicate checking rules, import type, results (success count, error count, error log)
  - Relationships: Processes lead data from external files
  - Purpose: Manages bulk lead import operations

- **Navigation State**: Represents application navigation state
  - Attributes: active module, recently viewed items, hover state, dropdown visibility
  - Relationships: Controls module navigation and sub-action access
  - Purpose: Manages navigation interactions and recently viewed records

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Leads List View loads and displays data within 2 seconds on standard broadband connection (95th percentile)
- **SC-002**: All table columns display correctly with sortable headers 100% of the time
- **SC-003**: Row action icons (Phone, Calendar, Envelope, Add Task) correctly redirect to respective pages or modals 100% of the time
- **SC-004**: Clicking on lead name navigates to Detail View within 500ms
- **SC-005**: Filter panel expands and displays all filter fields within 300ms of button click
- **SC-006**: Filtering and sorting operations complete within 1 second
- **SC-007**: Pagination controls respond to clicks within 300ms
- **SC-008**: Module navigation hover dropdowns display within 200ms
- **SC-009**: All hyperlinked fields (Name, Phone, Email, User) are clearly identifiable as clickable (red color) 100% of the time
- **SC-010**: Bulk actions can be performed on up to 100 selected leads without performance degradation
- **SC-011**: Column chooser modal opens within 500ms and drag-and-drop operations are responsive
- **SC-012**: Saved filters can be loaded and applied within 500ms
- **SC-013**: Insights panel toggles open/closed within 300ms and charts render within 1 second
- **SC-014**: Email Compose modal opens within 500ms of icon click
- **SC-015**: Lead creation form validates required fields and displays errors within 200ms of submit attempt
- **SC-016**: Lead Detail View loads and displays all fields within 1 second
- **SC-017**: Inline edit mode switches field to editable state within 200ms of pencil icon click
- **SC-018**: Import wizard processes file upload and displays mapping interface within 3 seconds for files up to 5MB
- **SC-019**: Users can import a CSV of 100 leads in under 2 minutes (UI interaction time)
- **SC-020**: All functional requirements are implemented and tested - 100% requirement coverage in test suite
- **SC-021**: Leads module is responsive and usable on mobile devices (screen width 320px and above)
- **SC-022**: Leads module is accessible via keyboard navigation - all interactive elements reachable via Tab key
- **SC-023**: Leads module meets WCAG AA contrast requirements - all text has minimum 4.5:1 contrast ratio
- **SC-024**: Role-based access control works correctly - Sales Users see assigned/personal leads, Sales Managers see all leads 100% of the time
- **SC-025**: Error messages are displayed in user-friendly format (no technical jargon) within 1 second of error occurrence
- **SC-026**: Global search displays results in dropdown within 500ms of typing
- **SC-027**: History button hover displays recently viewed records within 200ms
- **SC-028**: Pagination state persists across page refreshes and navigation - state maintained 100% of the time
- **SC-029**: Status transitions work correctly - any status can change to any other status 100% of the time
- **SC-030**: Form validation prevents submission of invalid data - 100% of invalid submissions are blocked

---

## Technical Implementation Notes

This specification is derived from the detailed frontend requirements document (`requirements/Leads/frontend-requirements.md`). The implementation should:

- Follow the component structure defined in the requirements (LeadsListPage, LeadDetailPage, LeadForm, FilterPanel, ColumnChooserModal, InsightsPanel, etc.)
- Use the specified API endpoints for lead operations (`/api/v8/module/Leads`)
- Implement proper error handling for all error scenarios (API failures, network errors, validation errors)
- Ensure accessibility compliance (WCAG AA) with proper ARIA labels and keyboard navigation
- Maintain responsive design across all device sizes (mobile, tablet, desktop)
- Implement role-based access control to ensure users only see/modify leads they have permission to access
- Use appropriate charting libraries for Insights donut charts
- Implement proper state management for lead data, list view state, filters, and user preferences
- Optimize API calls through server-side pagination, filtering, and caching where appropriate
- Handle loading states, error states, and empty states for all views
- Ensure smooth animations and transitions for panel expansions, modal openings, and page navigation
- Support deep linking and preserve navigation state (pagination, filters, sort order)
- Implement drag-and-drop functionality for column chooser and import field mapping
- Use Shadcn UI components from `src/components/ui` when possible
- Follow frontend structure guidelines in `.cursor/rules/frontend-structure.mdc`

For detailed technical requirements, refer to `requirements/Leads/frontend-requirements.md`.

