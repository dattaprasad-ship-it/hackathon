# Frontend Specifications - Opportunity Module

**Feature Branch**: `opportunity-frontend`  
**Created**: 2025-12-13  
**Status**: Draft  
**Input**: Frontend requirements for Opportunity module - Create frontend spec for opportunity module

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Views Opportunities List (Priority: P1)

As an authenticated user (Admin or Employee), I want to view a list of opportunities with sorting, filtering, and pagination capabilities, so that I can efficiently browse and manage my sales pipeline.

**Why this priority**: The opportunities list is the primary entry point for managing opportunities. It provides the foundation for all opportunity management activities including viewing, filtering, searching, and performing bulk operations. Without this, users cannot effectively manage their sales pipeline.

**Independent Test**: Can be fully tested by navigating to the opportunities list page, verifying the table displays with sortable columns, filters, pagination, and quick charts panel. This delivers immediate value by providing users with a comprehensive view of all opportunities they can access.

**Acceptance Scenarios**:

1. **Given** a user is authenticated, **When** they navigate to the Opportunities list page, **Then** they see a table displaying opportunities with columns: Name, Account Name, Sales Stage, Amount, Close Date, User, Date Created
2. **Given** a user is on the opportunities list page, **When** they click a column header, **Then** the table sorts by that column in descending order, and clicking again sorts in ascending order, and clicking a third time returns to normal unsorted state
3. **Given** a user is on the opportunities list page, **When** they click the Filter button, **Then** the Basic Filter panel opens with filter fields for Opportunity Name, Account Name, Amount, Sales Stage, Assigned To, Lead Source, Expected Close Date, and Next Step
4. **Given** a user is on the opportunities list page, **When** the page loads, **Then** the Quick Charts panel displays by default showing Pipeline By Sales Stage bar chart on the right side

---

### User Story 2 - User Creates New Opportunity (Priority: P1)

As a sales representative, I want to create a new opportunity with all required and optional fields, so that I can track potential sales deals through the sales pipeline.

**Why this priority**: Creating opportunities is fundamental to CRM functionality. This is the primary way new sales deals enter the system and enables the entire opportunity management workflow. Without this capability, the CRM cannot fulfill its core purpose.

**Independent Test**: Can be fully tested by navigating to Create Opportunity page, filling in required fields (Name, Amount, Sales Stage, Account Name, Expected Close Date), and successfully saving to create a new opportunity record. This delivers immediate value by allowing users to capture new sales opportunities.

**Acceptance Scenarios**:

1. **Given** a user is authenticated, **When** they click "Create Opportunity" from the navigation dropdown, **Then** they are navigated to the Create Opportunity page with a form containing BASIC and OTHER tabs
2. **Given** a user is on the Create Opportunity page, **When** they fill in all required fields (Opportunity Name, Opportunity Amount, Sales Stage, Account Name, Expected Close Date), **Then** the Save button is enabled
3. **Given** a user is on the Create Opportunity page, **When** they click the dropdown arrow on "Assigned To" field, **Then** a lookup modal opens displaying a table of users with columns: Name, Username, Job Title, Department, Email, Phone
4. **Given** a user selects a user from the lookup modal, **When** they click on a user row, **Then** the modal closes and the selected user value populates the "Assigned To" field
5. **Given** a user is on the Create Opportunity page, **When** they click Save with all required fields filled, **Then** the opportunity is created and they are redirected to the opportunity detail page

---

### User Story 3 - User Edits Existing Opportunity (Priority: P1)

As a sales representative, I want to edit opportunity details and save changes, so that I can update information as deals progress through the sales pipeline.

**Why this priority**: Editing opportunities is essential for maintaining accurate and up-to-date sales data. Deals evolve over time, and users must be able to update information such as sales stage, amount, close date, and other details to reflect current status.

**Independent Test**: Can be fully tested by navigating to an opportunity detail page, clicking Edit, modifying fields, and successfully saving changes. This delivers immediate value by allowing users to keep opportunity data current and accurate.

**Acceptance Scenarios**:

1. **Given** a user is on an opportunity detail page, **When** they click the Edit button, **Then** all fields become editable and header buttons change to Save, Save And Continue, Cancel, Insights, and Actions
2. **Given** a user is in edit mode, **When** they modify opportunity fields (e.g., change Sales Stage or Amount), **Then** the changes are visible in the form fields
3. **Given** a user is in edit mode, **When** they click Save, **Then** changes are saved and the page returns to view mode with updated data displayed
4. **Given** a user is in edit mode, **When** they click Save And Continue, **Then** changes are saved and the page remains in edit mode allowing further modifications
5. **Given** a user is in edit mode, **When** they click Cancel, **Then** all unsaved changes are discarded and the page returns to view mode with original values restored

---

### User Story 4 - User Filters and Searches Opportunities (Priority: P1)

As a sales manager, I want to filter opportunities by multiple criteria and search by name, so that I can quickly find specific opportunities or analyze subsets of my pipeline.

**Why this priority**: Filtering and searching are critical for managing large numbers of opportunities. Users need to quickly locate specific records, analyze pipeline by criteria (sales stage, assigned user, account), and focus on relevant opportunities. This significantly improves workflow efficiency.

**Independent Test**: Can be fully tested by opening the filter panel, applying filter criteria (e.g., Sales Stage = "Closed Won", Assigned To = current user), clicking Search, and verifying the table displays only matching opportunities. This delivers immediate value by allowing users to focus on relevant opportunities.

**Acceptance Scenarios**:

1. **Given** a user is on the opportunities list page, **When** they click the Filter button, **Then** the Basic Filter panel opens with filter fields and quick filter checkboxes (My Items, Open Items, My Favorites)
2. **Given** a user has the filter panel open, **When** they select "My Items" quick filter checkbox, **Then** the table filters to show only opportunities assigned to the current user
3. **Given** a user has the filter panel open, **When** they enter filter criteria (e.g., Sales Stage = "Negotiation/Review", Amount > 10000) and click Search, **Then** the table updates to display only opportunities matching the criteria
4. **Given** a user has applied filters, **When** they click the Clear button, **Then** all filter criteria are reset and the table displays all opportunities again
5. **Given** a user has applied filters, **When** they click the Save button, **Then** the filter configuration is saved for future use

---

### User Story 5 - User Performs Bulk Operations on Opportunities (Priority: P2)

As a sales manager, I want to select multiple opportunities and perform bulk operations (delete, export, merge, mass update), so that I can efficiently manage multiple records at once.

**Why this priority**: Bulk operations significantly improve efficiency when managing many opportunities. While not critical for core functionality, this feature enables managers to perform administrative tasks efficiently, such as updating sales stages for multiple opportunities or exporting data for reporting.

**Independent Test**: Can be fully tested by selecting multiple opportunities using checkboxes, opening the Bulk Action dropdown, selecting an action (e.g., Export), and verifying the operation completes successfully. This delivers value by enabling efficient multi-record management.

**Acceptance Scenarios**:

1. **Given** a user is on the opportunities list page, **When** they select one or more opportunities using checkboxes, **Then** the Bulk Action dropdown becomes enabled and a selection count is displayed
2. **Given** a user has selected multiple opportunities, **When** they click the Bulk Action dropdown and select Delete, **Then** a confirmation dialog appears
3. **Given** a user confirms bulk deletion, **When** they confirm, **Then** all selected opportunities are deleted and removed from the table
4. **Given** a user has selected multiple opportunities, **When** they click the Bulk Action dropdown and select Export, **Then** an export file is downloaded containing data for selected opportunities
5. **Given** a user has selected multiple opportunities, **When** they click the Bulk Action dropdown and select Mass Update, **Then** a form appears allowing them to update common fields for all selected opportunities

---

### User Story 6 - User Imports Opportunities from File (Priority: P2)

As a sales administrator, I want to import multiple opportunities from a file through a guided multi-step process, so that I can bulk load opportunity data from external sources.

**Why this priority**: Import functionality is essential for data migration, bulk data entry, and integrating with external systems. While not used daily by all users, it's critical for administrators who need to load large volumes of opportunity data efficiently.

**Independent Test**: Can be fully tested by navigating to Import Opportunities, uploading a file, completing all import steps (file properties, field mapping, duplicate check), executing import, and verifying opportunities are created. This delivers value by enabling efficient bulk data entry.

**Acceptance Scenarios**:

1. **Given** a user is authenticated, **When** they click "Import Opportunities" from the navigation dropdown, **Then** they are navigated to Step 1: Upload Import File page
2. **Given** a user is on Step 1, **When** they click "Download Import File Template", **Then** a template file downloads with column headers for opportunity fields
3. **Given** a user has uploaded an import file and clicked Next, **When** Step 2 loads, **Then** they see a data preview table showing imported records and can modify file properties
4. **Given** a user is on Step 3: Confirm Field Mappings, **When** they review the mapping table, **Then** they see three columns: Header Row (file columns), Module Field (dropdown for mapping), and Row 1 (sample data preview)
5. **Given** a user is on Step 4: Check For Possible Duplicates, **When** they drag fields from "Available Fields" to "Fields to Check", **Then** those fields are selected for duplicate checking during import
6. **Given** a user completes all import steps and clicks Import Now, **When** import completes, **Then** they see Step 5: View Import Results with summary statistics (created count, error count) and a table of imported opportunities

---

### User Story 7 - User Views Opportunity Relationships (Priority: P2)

As a sales representative, I want to view and manage relationships (contacts, activities, documents, quotes) related to an opportunity, so that I can see all associated information and interactions in one place.

**Why this priority**: Opportunities don't exist in isolation - they're connected to contacts, activities, documents, and other entities. Viewing these relationships provides context and helps users understand the full picture of each opportunity. This is important for effective opportunity management.

**Independent Test**: Can be fully tested by navigating to an opportunity detail page, expanding the Relationships section, clicking on a relationship item (e.g., "CONTACTS: 3"), and verifying the sub-panel displays related records. This delivers value by providing comprehensive opportunity context.

**Acceptance Scenarios**:

1. **Given** a user is on an opportunity detail page, **When** they expand the Relationships section, **Then** they see a grid showing relationship types (Activities, Contacts, Documents, Quotes, Projects, etc.) with counts
2. **Given** a user expands Relationships section, **When** they click on "CONTACTS: 3", **Then** a Contacts sub-panel opens below displaying a table with 3 related contacts
3. **Given** a Contacts sub-panel is open, **When** they view the table, **Then** they see columns: Name, Account Name, Role, Email, Office Phone with sortable headers
4. **Given** a Contacts sub-panel is open, **When** they click the Actions dropdown and select Create, **Then** they are navigated to the Create Contact page
5. **Given** a user views the Activities sub-panel, **When** the panel displays, **Then** they see a table with columns: Subject, Status, Contact, Due Date, Assigned User

---

### User Story 8 - User Customizes Table Columns (Priority: P3)

As a user, I want to customize which columns are visible in the opportunities table, so that I can focus on the information most relevant to my work.

**Why this priority**: Column customization is a quality-of-life feature that allows users to personalize their view. While not critical for core functionality, it improves user experience by allowing users to tailor the interface to their needs and workflows.

**Independent Test**: Can be fully tested by clicking the Columns icon, moving columns between DISPLAYED and HIDDEN sections, clicking Save Changes, and verifying the table displays only selected columns. This delivers value by allowing personalized views.

**Acceptance Scenarios**:

1. **Given** a user is on the opportunities list page, **When** they click the Columns icon, **Then** the "Choose Columns" modal opens with two sections: DISPLAYED (left) and HIDDEN (right)
2. **Given** the Choose Columns modal is open, **When** they view the DISPLAYED section, **Then** they see currently visible columns as tags/badges (Name, Account Name, Sales Stage, Amount, Close, User, Date Created)
3. **Given** the Choose Columns modal is open, **When** they move a column from DISPLAYED to HIDDEN, **Then** that column is removed from the table after saving
4. **Given** the Choose Columns modal is open, **When** they move a column from HIDDEN to DISPLAYED, **Then** that column appears in the table after saving
5. **Given** a user has customized columns, **When** they return to the opportunities list page later, **Then** their column preferences are maintained and displayed

---

### User Story 9 - User Navigates Using Recently Viewed (Priority: P3)

As a user, I want to quickly access recently viewed opportunities from the navigation menu, so that I can return to opportunities I was working on without searching or browsing the full list.

**Why this priority**: Recently viewed is a convenience feature that improves workflow efficiency. While not critical, it helps users quickly return to recently accessed records, reducing navigation time and improving productivity.

**Independent Test**: Can be fully tested by viewing an opportunity detail page, navigating away, then clicking "Recently Viewed" from the navigation dropdown and selecting the previously viewed opportunity. This delivers value by enabling quick access to recently worked-on records.

**Acceptance Scenarios**:

1. **Given** a user has viewed an opportunity detail page, **When** they navigate away and return to the navigation menu, **Then** the "Recently Viewed" option shows a sub-menu indicator (arrow)
2. **Given** a user clicks "Recently Viewed" from the navigation dropdown, **When** the sub-menu opens, **Then** they see a list of recently viewed opportunity names (truncated if long)
3. **Given** the Recently Viewed sub-menu is open, **When** they click on an opportunity name, **Then** they are navigated to that opportunity's detail page
4. **Given** a user has viewed multiple opportunities, **When** they open Recently Viewed, **Then** opportunities are listed in order of most recently viewed first, up to a limit (default: 10)

---

### Edge Cases

- What happens when an opportunity record is deleted while a user is viewing it?
  - System should detect the deletion (via error response or polling), display an appropriate error message, and redirect to the opportunities list page

- What happens when multiple users edit the same opportunity simultaneously?
  - System uses optimistic locking with conflict detection: allows concurrent edits, detects conflicts on save operation, shows conflict resolution dialog if conflicts are detected, allowing user to choose which version to keep or merge changes

- What happens when filter criteria result in zero opportunities?
  - System should display "No results found" message in the table area and provide options to clear filters or modify criteria

- What happens when a user tries to save an opportunity with invalid data (e.g., past close date, negative amount)?
  - System should display field-specific validation error messages inline, prevent form submission, and highlight invalid fields

- What happens when API requests fail due to network errors?
  - System should display user-friendly error messages, provide retry options, and maintain form state if possible to prevent data loss

- What happens when import file contains invalid data or missing required fields?
  - System should identify and report errors during Step 2 or Step 3, display error details in Step 5 results, and allow user to correct and re-import

- What happens when a user selects a very large number of opportunities for bulk operations (e.g., 1000+ records)?
  - System should either limit selection size, warn the user about performance, or process operations in batches with progress indicators

- What happens when lookup modal fails to load records (e.g., API error)?
  - System should display an error message in the modal, provide a retry button, and allow user to close modal and manually enter value if needed

- What happens when column preferences fail to save?
  - System should display an error message, allow user to retry, and maintain local preferences until successfully saved

- What happens when pagination is at last page and user deletes all visible records?
  - System should automatically navigate to previous page or display empty state if no records remain

- What happens when sales stage dropdown or other lookup fields have no available options?
  - System should display appropriate empty state message and prevent form submission if required field cannot be populated

- What happens when relationship sub-panel contains a very large number of related records?
  - System should implement pagination within the sub-panel to limit displayed records and provide navigation controls

- What happens when user's authentication expires while performing a long operation (e.g., import)?
  - System should detect authentication expiration, save operation state if possible, redirect to login, and restore state after re-authentication

- What happens when browser back button is used during multi-step import process?
  - System should maintain import state, allow navigation between steps, and preserve file data and configurations

- What happens when duplicate check during import identifies matches but user wants to proceed?
  - System should display duplicate records in Step 5 results, allow user to review duplicates, and provide options to skip, import anyway, or merge

---

## Requirements *(mandatory)*

### Functional Requirements

#### Navigation and Routing

- **FR-001**: System MUST display Opportunities module in the main navigation bar with dropdown menu containing: Create Opportunity, View Opportunities, Import Opportunities, Recently Viewed
- **FR-002**: System MUST provide route `/opportunities` or `/opportunities/index` for opportunities list page
- **FR-003**: System MUST provide route `/opportunities/:id` or `/opportunities/record/:id` for opportunity detail page
- **FR-004**: System MUST provide route `/opportunities/create` or `/opportunities/edit` for create opportunity page
- **FR-005**: System MUST provide routes for import process: `/opportunities/import/step1`, `/opportunities/import/step2`, `/opportunities/import/step3`, `/opportunities/import/step4`, `/opportunities/import/results`
- **FR-006**: System MUST protect all opportunity routes with authentication, redirecting unauthenticated users to login page
- **FR-007**: System MUST check user permissions before allowing access to opportunity pages and operations

#### Opportunities List Page

- **FR-010**: System MUST display opportunities in a sortable, paginated table with columns: Checkbox, Context Menu, Name, Account Name, Sales Stage, Amount, Close (date), User, Row Actions
- **FR-011**: System MUST support three-state column sorting: Descending (first click) → Ascending (second click) → Normal/Unsorted (third click)
- **FR-012**: System MUST highlight sort icon to indicate active sort direction (descending or ascending)
- **FR-013**: System MUST display pagination controls (<<, <, page range, >, >>) with default 20 records per page
- **FR-014**: System MUST display Quick Charts panel by default on the right side showing Pipeline By Sales Stage bar chart
- **FR-015**: System MUST allow toggling Quick Charts panel visibility via Insights button, hiding panel and expanding table to full width when hidden
- **FR-016**: System MUST enable Bulk Action dropdown when one or more opportunities are selected via checkboxes
- **FR-017**: System MUST display selection count (e.g., "Selected: 5") when opportunities are selected
- **FR-018**: System MUST provide Bulk Action options: Delete, Export, Merge, Mass Update

#### Filtering and Search

- **FR-020**: System MUST provide Filter button that opens Basic Filter panel
- **FR-021**: System MUST display Basic Filter panel with filter fields: Opportunity Name (text), Account Name (dropdown), Opportunity Amount (operator + number), Assigned To (dropdown), Sales Stage (dropdown), Lead Source (dropdown), Expected Close Date (operator + date), Next Step (text)
- **FR-022**: System MUST provide quick filter checkboxes: My Items, Open Items, My Favorites
- **FR-023**: System MUST apply filters when Search button is clicked and update table to show only matching opportunities
- **FR-024**: System MUST clear all filter criteria when Clear button is clicked
- **FR-025**: System MUST allow saving filter configurations for future use via Save button
- **FR-026**: System MUST provide Quick Filter section with Name quick filter (text input with checkbox) and Order by column dropdown with Sort direction radio buttons

#### Column Customization

- **FR-030**: System MUST provide Columns icon that opens "Choose Columns" modal
- **FR-031**: System MUST display Choose Columns modal with two sections: DISPLAYED (left) and HIDDEN (right)
- **FR-032**: System MUST allow moving columns between DISPLAYED and HIDDEN sections
- **FR-033**: System MUST save column preferences per user when Save Changes is clicked
- **FR-034**: System MUST persist and restore user's column preferences across browser sessions

#### Create/Edit Opportunity Form

- **FR-040**: System MUST display Create Opportunity form with BASIC and OTHER tabs
- **FR-041**: System MUST display required fields with asterisk (*) indicator: Opportunity Name, Opportunity Amount, Sales Stage, Account Name, Expected Close Date
- **FR-042**: System MUST validate required fields before allowing form submission
- **FR-043**: System MUST display inline validation error messages for invalid fields when field loses focus (on blur event)
- **FR-044**: System MUST disable Save button until all required fields are filled AND pass validation rules (both filled status and validation must pass)
- **FR-045**: System MUST populate all dropdown fields with available values: Sales Stage, Type, Lead Source, Account Name, Campaign, Assigned To
- **FR-046**: System MUST provide lookup modals for lookup fields (Assigned To, Account Name, Campaign) when dropdown arrow is clicked
- **FR-047**: System MUST display lookup modal with table showing records, sortable columns, pagination, and row selection
- **FR-048**: System MUST populate lookup field with selected record value when user clicks a row in lookup modal
- **FR-049**: System MUST close lookup modal after selection or when close button is clicked
- **FR-050**: System MUST provide Save button that creates/updates opportunity and navigates to detail page
- **FR-051**: System MUST provide Cancel button that discards changes and navigates back
- **FR-052**: System MUST provide Save And Continue button (edit mode only) that saves changes and remains in edit mode

#### Opportunity Detail/Edit Page

- **FR-060**: System MUST display opportunity detail page with header containing: opportunity name, favorite star icon, navigation arrows (<, >), record position indicator, action buttons (Edit, Insights, Actions)
- **FR-061**: System MUST provide Edit mode that makes all fields editable and changes header buttons to: Save, Save And Continue, Cancel, Insights, Actions
- **FR-062**: System MUST display BASIC tab with all opportunity fields in two-column layout
- **FR-063**: System MUST display OTHER tab with read-only metadata fields: Date Modified, Date Created
- **FR-064**: System MUST display Relationships section with expandable/collapsible grid showing relationship types with counts
- **FR-065**: System MUST open relationship sub-panel when relationship item is clicked (e.g., "CONTACTS: 3")
- **FR-066**: System MUST display relationship sub-panel with table of related records, sortable columns, pagination, and Actions dropdown
- **FR-067**: System MUST display Insights panel on right side showing days at current sales stage metric
- **FR-068**: System MUST display Timeline panel on right side showing chronological list of activities and updates
- **FR-069**: System MUST provide navigation arrows (<, >) to browse between opportunity records without returning to list
- **FR-070**: System MUST display record position indicator (e.g., "1 of 118") in header

#### Lookup Modals

- **FR-080**: System MUST open lookup modal when dropdown arrow is clicked on lookup fields (Assigned To, Account Name, Campaign)
- **FR-081**: System MUST display lookup modal with title, close button (X), search input field with Search button, and table of records
- **FR-082**: System MUST display user lookup modal with columns: Name, Username, Job Title, Department, Email, Phone
- **FR-083**: System MUST display account lookup modal with relevant account fields
- **FR-084**: System MUST display campaign lookup modal with relevant campaign fields
- **FR-085**: System MUST provide search input field with Search button in lookup modal - user enters search query and clicks Search button to filter table results
- **FR-086**: System MUST provide sortable columns in lookup modal table (up/down arrows on headers)
- **FR-087**: System MUST provide pagination controls (<<, <, page info, >, >>) in lookup modal, both top and bottom
- **FR-088**: System MUST highlight selected row when user clicks on a table row in lookup modal
- **FR-089**: System MUST populate lookup field and close modal when user selects a record
- **FR-090**: System MUST allow closing lookup modal via X button or clicking outside modal without changing field value

#### Import Process

- **FR-100**: System MUST provide Step 1: Upload Import File page with file upload input, import behavior radio buttons (Create new records only, Create new records and update existing records), and Download Import File Template link
- **FR-101**: System MUST download import template file when Download Import File Template link is clicked
- **FR-102**: System MUST validate uploaded file format and filename before allowing progression to Step 2
- **FR-103**: System MUST provide Step 2: Confirm Import File Properties page with data preview table, View Import File Properties button, and source selection radio buttons (None, Salesforce.com, Microsoft Outlook)
- **FR-104**: System MUST display data preview table showing first several rows of imported data with detected file properties
- **FR-105**: System MUST provide Step 3: Confirm Field Mappings page with three-column table: Header Row (file columns), Module Field (dropdown selectors), Row 1 (sample data preview)
- **FR-106**: System MUST auto-map file columns to matching module fields when header row is detected
- **FR-107**: System MUST require all required fields to be mapped before allowing progression to Step 4
- **FR-108**: System MUST provide Step 4: Check For Possible Duplicates page with two list boxes: Fields to Check (left) and Available Fields (right) with drag-and-drop functionality
- **FR-109**: System MUST allow dragging fields from Available Fields to Fields to Check for duplicate checking configuration
- **FR-110**: System MUST provide optional saved settings input field for saving import configuration
- **FR-111**: System MUST provide Step 5: View Import Results page with summary statistics (created count, error count), action buttons (Undo Import, Import Again, Exit), filter links (Created Records, Duplicates, Errors), and opportunities table
- **FR-112**: System MUST display imported opportunity records in results table with sortable columns and pagination
- **FR-113**: System MUST execute import when Import Now button is clicked in Step 4, performing duplicate checks and creating/updating records based on import behavior selection

#### Bulk Operations

- **FR-120**: System MUST enable Bulk Action dropdown when one or more opportunities are selected
- **FR-121**: System MUST provide Delete bulk action with confirmation dialog before execution
- **FR-122**: System MUST provide Export bulk action that downloads export file with selected opportunity data
- **FR-123**: System MUST provide Merge bulk action that combines selected opportunities into one
- **FR-124**: System MUST provide Mass Update bulk action that allows updating common fields for all selected opportunities
- **FR-125**: System MUST display confirmation dialogs for destructive bulk operations (Delete, Merge)

#### Recently Viewed

- **FR-130**: System MUST track when user views an opportunity detail page
- **FR-131**: System MUST display Recently Viewed sub-menu when "Recently Viewed" is clicked from navigation dropdown
- **FR-132**: System MUST list recently viewed opportunities in sub-menu, most recent first, up to limit (default: 10)
- **FR-133**: System MUST truncate long opportunity names in Recently Viewed list with ellipsis (...)
- **FR-134**: System MUST navigate to opportunity detail page when opportunity name is clicked in Recently Viewed sub-menu

#### Data Display and Visualization

- **FR-140**: System MUST display Quick Charts panel with Pipeline By Sales Stage bar chart by default
- **FR-141**: System MUST update chart data based on current filter criteria
- **FR-142**: System MUST display chart legend mapping colors to sales stage categories
- **FR-143**: System MUST display Insights panel with "DAYS THIS OPPORTUNITY HAS BEEN AT THIS SALES STAGE" metric
- **FR-144**: System MUST calculate and display days at current sales stage, updating when sales stage changes
- **FR-145**: System MUST display Timeline panel with chronological list of activities, updates, and communications
- **FR-146**: System MUST display "No Data" message in Timeline when no activities exist

#### Error Handling

- **FR-150**: System MUST display user-friendly error messages when API requests fail
- **FR-151**: System MUST display field-specific validation error messages for invalid form inputs
- **FR-152**: System MUST prevent form submission when validation errors exist
- **FR-153**: System MUST provide retry options for failed API requests where applicable
- **FR-154**: System MUST handle network errors gracefully with appropriate error messages and recovery options
- **FR-155**: System MUST display error details in import results when import rows fail
- **FR-156**: System MUST display 404 error page or message when opportunity not found or not accessible

#### State Management

- **FR-160**: System MUST maintain filter and sort preferences during user session
- **FR-161**: System MUST persist column visibility preferences per user across browser sessions
- **FR-162**: System MUST maintain import process state across import steps (file data, settings, mappings)
- **FR-163**: System MUST cache recently viewed opportunities list per user
- **FR-164**: System MUST restore user preferences (columns, filters) when page loads

#### Performance and UX

- **FR-170**: System MUST display loading indicators for async operations (API requests, import processing, bulk operations)
- **FR-171**: System MUST lazy load relationship sub-panels (load data only when sub-panel is opened)
- **FR-172**: System MUST debounce search/filter inputs with 300ms delay to reduce unnecessary API calls
- **FR-173**: System MUST optimize table rendering for large datasets using pagination
- **FR-174**: System MUST provide visual feedback for user actions (hover states, active states, transitions)
- **FR-175**: System MUST display empty states appropriately ("No Data", "No results found", guidance messages)

#### Accessibility

- **FR-180**: System MUST support keyboard navigation (Tab order, Enter to activate, Escape to close modals)
- **FR-181**: System MUST provide ARIA labels for screen readers on buttons, form fields, table headers, icons
- **FR-182**: System MUST provide sufficient color contrast (WCAG AA compliance - 4.5:1 contrast ratio minimum)
- **FR-183**: System MUST support screen reader announcements for dynamic content changes
- **FR-184**: System MUST implement focus management (focus trap in modals, focus restoration after modal close)

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Opportunities list page loads and displays table within 2 seconds on standard broadband connection (95th percentile)
- **SC-002**: All opportunity pages (list, detail, create) load within 2 seconds
- **SC-003**: Table sorting responds and updates display within 200ms of column header click
- **SC-004**: Filter application updates table display within 500ms of Search button click
- **SC-005**: Lookup modal opens and displays records within 1 second of dropdown arrow click
- **SC-006**: Form validation errors display within 100ms of field blur or form submission attempt
- **SC-007**: Opportunity creation completes and navigates to detail page within 3 seconds of Save click
- **SC-008**: Opportunity update saves and returns to view mode within 2 seconds of Save click
- **SC-009**: Bulk operations (delete, export, mass update) complete successfully for up to 1000 selected records
- **SC-010**: Import process handles files up to 10MB and completes within 30 seconds for typical files
- **SC-011**: Column preferences save and persist across browser sessions 100% of the time
- **SC-012**: Filter preferences maintain state during user session 100% of the time
- **SC-013**: All dropdown fields populate with values from backend API 100% of the time
- **SC-014**: Lookup modals display accurate data with pagination functioning correctly 100% of the time
- **SC-015**: Recently Viewed list displays correctly with most recent opportunities first, up to limit
- **SC-016**: Relationship sub-panels load and display related records correctly 100% of the time
- **SC-017**: Quick Charts panel displays accurate pipeline data based on current filters 100% of the time
- **SC-018**: Insights panel calculates and displays days at current sales stage accurately
- **SC-019**: All functional requirements are implemented and tested - 100% requirement coverage in test suite
- **SC-020**: Opportunities module is responsive and usable on mobile devices (screen width 320px and above) with breakpoints: Mobile (< 768px), Tablet (768px - 1024px), Desktop (> 1024px)
- **SC-021**: Opportunities module is accessible via keyboard navigation - all interactive elements reachable via Tab key
- **SC-022**: Opportunities module meets WCAG AA contrast requirements - all text has minimum 4.5:1 contrast ratio
- **SC-023**: Role-based access control works correctly - Admin sees all opportunities, Employee sees filtered opportunities 100% of the time
- **SC-024**: Error handling displays user-friendly messages within 1 second of error occurrence
- **SC-025**: Import results accurately reflect import operation outcomes (created count, error count, duplicate count)

---

## Clarifications

### Session 2025-12-13

- Q: When multiple users edit the same opportunity simultaneously, which strategy should the system use? → A: Optimistic locking with conflict detection - Allow edits, detect conflicts on save, show resolution dialog if conflicts exist

- Q: When should inline form validation error messages appear for opportunity form fields? → A: On field blur (when user leaves field) - Validate when field loses focus

- Q: What should be the debounce delay (in milliseconds) for search/filter input fields in the opportunities list? → A: 300ms - Standard debounce delay, balances responsiveness and API efficiency

- Q: What are the specific responsive breakpoints (screen widths) for mobile, tablet, and desktop layouts? → A: Mobile: < 768px, Tablet: 768px-1024px, Desktop: > 1024px - Standard breakpoints

- Q: How should search functionality work in lookup modals (Assigned To, Account Name, Campaign)? → A: Search input field with Search button - Display search box, user clicks Search button to filter results

- Q: When should form validation check if a field is "filled" versus "valid" for enabling the Save button? → A: Check if filled AND valid - Save button enables only when all required fields are filled AND pass validation rules

---

