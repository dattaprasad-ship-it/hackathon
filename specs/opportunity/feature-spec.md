# Opportunity Module Specification

**Feature Branch**: `opportunity-module`  
**Created**: 2025-12-13  
**Status**: Draft  
**Input**: Complete opportunity module feature for CRM system - Manage sales opportunities with CRUD operations, bulk import/export, relationship management, and analytics

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Creates New Opportunity (Priority: P1)

As a sales representative, I want to create a new opportunity record with all required and optional details, so that I can track potential sales deals through the sales pipeline.

**Why this priority**: Creating opportunities is the foundation of the CRM opportunity management system. This is the primary way new sales deals enter the system and enables the entire opportunity workflow. Without this capability, the CRM cannot fulfill its core purpose.

**Independent Test**: Can be fully tested by navigating to Create Opportunity page, filling in required fields (Name, Amount, Sales Stage, Account, Close Date), and successfully creating the opportunity. This delivers immediate value by allowing users to capture new sales opportunities.

**Acceptance Scenarios**:

1. **Given** a user navigates to Create Opportunity page, **When** they fill in all required fields (Opportunity Name, Opportunity Amount, Sales Stage, Account Name, Expected Close Date), **Then** they can successfully save and create the opportunity
2. **Given** a user creates an opportunity, **When** the opportunity is saved, **Then** the system automatically generates an ID, sets creation timestamp, and associates it with the current user
3. **Given** a user provides optional fields (Probability, Next Step, Description, Type, Lead Source, Campaign, Assigned To), **When** they create the opportunity, **Then** all optional fields are stored correctly
4. **Given** a user attempts to create an opportunity without required fields, **When** they try to save, **Then** the system displays validation errors for missing required fields and prevents saving
5. **Given** a user selects a user from "Assigned To" lookup field, **When** they click the dropdown arrow, **Then** a lookup modal opens showing a sortable, paginated table of users to select from

---

### User Story 2 - User Views and Manages Opportunities List (Priority: P1)

As a sales manager, I want to view a list of opportunities with filtering, sorting, and pagination capabilities, so that I can efficiently browse and manage my sales pipeline.

**Why this priority**: The opportunities list is the primary entry point for managing opportunities. It provides the foundation for all opportunity management activities including viewing, filtering, searching, and performing bulk operations. Without this, users cannot effectively manage their sales pipeline.

**Independent Test**: Can be fully tested by navigating to the opportunities list page, verifying the table displays with sortable columns, filters, pagination, and quick charts panel. This delivers immediate value by providing users with a comprehensive view of all opportunities they can access.

**Acceptance Scenarios**:

1. **Given** a user navigates to Opportunities list page, **When** the page loads, **Then** they see a table displaying opportunities with columns: Checkbox, Context Menu (three dots), Name, Account Name, Sales Stage, Amount, Close Date, User, Date Created, and Row Actions (Phone, Calendar, Task, Email, View icons)
2. **Given** a user is on the opportunities list page, **When** they click a column header, **Then** the table sorts by that column (descending → ascending → normal cycle) with visual indicator showing sort direction (highlighted sort icon when active)
3. **Given** a user clicks the Filter button, **When** the filter panel opens, **Then** they can filter by Opportunity Name, Account Name, Amount (with operators: Equals, Greater Than, Less Than, Between), Sales Stage, Assigned To, Lead Source, Expected Close Date (with operators: Equals, Greater Than, Less Than, Between), and Next Step
4. **Given** a user applies multiple filters, **When** filters are applied, **Then** the system combines filters with AND logic and displays matching opportunities
5. **Given** a user is on the opportunities list page, **When** the page loads, **Then** the Quick Charts panel displays by default showing Pipeline By Sales Stage bar chart on the right side with colored bars representing different sales stages and a legend mapping colors to stages
6. **Given** a user clicks the Insights button, **When** clicked, **Then** the Quick Charts panel hides and the table columns expand to use the additional space
7. **Given** a user is viewing the opportunities table, **When** they hover over a row, **Then** they see row action icons (Phone, Calendar, Task/Note, Email, View) that allow quick actions on that opportunity
8. **Given** a user clicks the context menu (three dots) on an opportunity row, **When** they click, **Then** a row-specific actions menu opens with additional options for that opportunity

---

### User Story 3 - User Views and Edits Opportunity Details (Priority: P1)

As a sales representative, I want to view and edit opportunity details, so that I can update information as deals progress through the sales pipeline.

**Why this priority**: Viewing and editing opportunities is essential for maintaining accurate and current sales data. Deals evolve over time, and users must be able to update information such as sales stage, amount, close date, and other details. This is critical for accurate pipeline management.

**Independent Test**: Can be fully tested by navigating to an opportunity detail page, clicking Edit, modifying fields, and successfully saving changes. This delivers immediate value by allowing users to keep opportunity data current.

**Acceptance Scenarios**:

1. **Given** a user clicks on an opportunity name in the list, **When** they click, **Then** they navigate to the opportunity detail page displaying all opportunity information
2. **Given** a user is viewing an opportunity detail page, **When** they view the page header, **Then** they see the opportunity name, star icon (favorite/unfavorite), navigation arrows (< >) with record position indicator (e.g., "1 of 118"), and action buttons (Edit, Insights, Actions)
3. **Given** a user is viewing an opportunity detail page, **When** they click the Edit button, **Then** fields become editable and header buttons change to Save/Save And Continue/Cancel/Insights/Actions
4. **Given** a user edits opportunity fields, **When** they click Save, **Then** changes are validated, saved, and the page returns to view mode with updated data
5. **Given** a user edits opportunity fields, **When** they click Save And Continue, **Then** changes are saved and the page remains in edit mode for making additional edits
6. **Given** a user edits opportunity fields, **When** they click Cancel, **Then** changes are discarded and the page returns to view mode with original values
7. **Given** a user updates the sales stage, **When** the change is saved, **Then** the system recalculates days at current sales stage for insights display
8. **Given** a user is viewing an opportunity detail page, **When** they click the navigation arrows (< >), **Then** they navigate to the previous/next opportunity record without returning to the list view
9. **Given** a user is viewing an opportunity detail page, **When** they click the star icon, **Then** the opportunity is favorited/unfavorited and the star icon state toggles

---

### User Story 4 - User Imports Multiple Opportunities from File (Priority: P2)

As a sales administrator, I want to import multiple opportunities from a file through a multi-step process with duplicate detection and error handling, so that I can bulk load opportunity data from external sources efficiently.

**Why this priority**: Import functionality is essential for data migration, bulk data entry, and integrating with external systems. While not used daily by all users, it's critical for administrators who need to load large volumes of opportunity data. This significantly improves data entry efficiency.

**Independent Test**: Can be fully tested by downloading the import template, filling it with data, uploading the file, completing all import steps (file analysis, field mapping, duplicate check configuration), executing import, and verifying opportunities are created correctly with proper error reporting. This delivers value by enabling efficient bulk data entry.

**Acceptance Scenarios**:

1. **Given** a user navigates to Import Opportunities page, **When** they click "Download Import File Template", **Then** a template file downloads with column headers for all opportunity fields
2. **Given** a user uploads an import file, **When** they click Next, **Then** the system displays Step 2 with file properties and data preview
3. **Given** a user is on Step 3 (Field Mapping), **When** they review mappings, **Then** they can adjust column-to-field mappings using dropdowns
4. **Given** a user is on Step 4 (Duplicate Check), **When** they configure duplicate check fields, **Then** they can drag fields from "Available Fields" to "Fields to Check" to specify which fields to use for duplicate detection
5. **Given** a user completes all import steps and clicks "Import Now", **When** import executes, **Then** the system processes all rows, performs duplicate checks, creates/updates records, and displays results with counts (created, updated, errors, duplicates)
6. **Given** import completes with results, **When** user clicks "Undo Import", **Then** all records created during that import are deleted after confirmation

---

### User Story 5 - User Performs Bulk Operations on Opportunities (Priority: P2)

As a sales manager, I want to perform bulk operations (delete, export, merge, mass update) on multiple selected opportunities, so that I can efficiently manage multiple records at once.

**Why this priority**: Bulk operations significantly improve efficiency when managing many opportunities. While not critical for core functionality, this feature enables managers to perform administrative tasks efficiently, such as updating sales stages for multiple opportunities or exporting data for reporting.

**Independent Test**: Can be fully tested by selecting multiple opportunity checkboxes, clicking Bulk Action dropdown, selecting an operation (delete, export, merge, mass update), and verifying the operation completes successfully. This delivers value by enabling efficient multi-record management.

**Acceptance Scenarios**:

1. **Given** a user selects multiple opportunities using checkboxes, **When** they select opportunities, **Then** the Bulk Action dropdown becomes enabled showing options: Delete, Export, Merge, Mass Update
2. **Given** a user selects Delete from Bulk Action dropdown, **When** they confirm deletion, **Then** selected opportunities are deleted and removed from the list
3. **Given** a user selects Export from Bulk Action dropdown, **When** they click Export, **Then** a CSV file downloads containing selected opportunities data
4. **Given** a user selects Merge from Bulk Action dropdown, **When** they specify source and target opportunities, **Then** source opportunities are merged into target, relationships transferred, and sources deleted
5. **Given** a user selects Mass Update from Bulk Action dropdown, **When** they specify update fields and values, **Then** all selected opportunities are updated with the specified changes

---

### User Story 6 - User Views Opportunity Relationships (Priority: P2)

As a sales representative, I want to view related records (contacts, activities, documents, quotes) for an opportunity, so that I can see all associated information and understand the full context of each deal.

**Why this priority**: Opportunities don't exist in isolation - they're connected to contacts, activities, documents, and other entities. Viewing these relationships provides context and helps users understand the full picture of each opportunity. This is important for effective opportunity management.

**Independent Test**: Can be fully tested by navigating to an opportunity detail page, expanding the Relationships section, clicking on a relationship type (e.g., Contacts), and verifying navigation to a full-page list view displaying related records. This delivers value by providing comprehensive opportunity context.

**Acceptance Scenarios**:

1. **Given** a user is viewing an opportunity detail page, **When** they expand the Relationships section (collapsed by default), **Then** they see a grid showing relationship types with icons and counts (e.g., "ACTIVITIES: 1", "CONTACTS: 3", "DOCUMENTS: 0")
2. **Given** a user clicks on a relationship item (e.g., "CONTACTS: 3"), **When** they click, **Then** they are navigated to a full-page list view (e.g., `/opportunities/:id/contacts`) displaying a table of related records with header containing title and Actions dropdown
3. **Given** a user is on a related records list page for Contacts, **When** user views the table, **Then** they see columns: Name, Account Name, Role (e.g., "Technical Decision Maker", "Business Evaluator", "Primary Decision Maker"), Email, Office Phone, and Row Actions (Edit, Unlink icons)
4. **Given** a user is on a related records list page for Activities, **When** user views the table, **Then** they see columns: Subject, Status, Contact, Due Date, Assigned User, and Row Actions
5. **Given** a user is on a related records list page, **When** user clicks "Create" in Actions dropdown, **Then** they navigate to create page for that entity type, and new record is automatically linked to the opportunity
6. **Given** a related records list page displays related records, **When** records exist, **Then** the table shows paginated, sortable records with all columns sortable; when no records exist, it shows "No results found." with disabled pagination (0-0 of 0)
7. **Given** a user is viewing the Contacts related records list page, **When** they view contact roles, **Then** they see roles such as Technical Decision Maker, Business Evaluator, Primary Decision Maker, etc.

---

### User Story 7 - User Views Pipeline Analytics and Insights (Priority: P2)

As a sales manager, I want to view pipeline analytics and opportunity insights, so that I can visualize the sales pipeline and make data-driven decisions.

**Why this priority**: Pipeline analytics provide valuable insights for sales management. While not critical for individual opportunity management, it helps managers understand pipeline composition, identify bottlenecks, and make data-driven decisions. This is important for strategic sales management.

**Independent Test**: Can be fully tested by viewing the Quick Charts panel on the opportunities list page and verifying it displays Pipeline By Sales Stage chart with accurate aggregated data. This delivers value by providing pipeline insights.

**Acceptance Scenarios**:

1. **Given** a user is on the opportunities list page, **When** they view the Quick Charts panel, **Then** they see a vertical bar chart titled "Pipeline By Sales Stage" with monetary amounts on Y-axis (scaled from $0.00 to maximum value) and colored bars representing different sales stages with a legend mapping colors to stage names
2. **Given** a user views the Pipeline By Sales Stage chart legend, **When** they view the legend, **Then** they see color mappings for sales stages (e.g., Value Proposition: yellow, Qualification: green, Prospecting: orange, Proposal/Price Quote: brown/reddish, Perception Analysis: red, Negotiation/Review: light blue, Needs Analysis: dark blue, Identifying Decision Makers: dark red/maroon)
3. **Given** a user is on the opportunities list page, **When** they view the chart selector dropdown, **Then** it shows "Pipeline By Sales Stage" as the current selection, indicating multiple chart types are available
4. **Given** a user applies filters to the opportunities list, **When** filters are applied, **Then** the pipeline chart updates to reflect only filtered opportunities
5. **Given** a user views an opportunity detail page, **When** they view the Insights panel, **Then** they see "Days at current sales stage" displayed as a large number metric (e.g., "3") with label "DAY(S) THIS OPPORTUNITY HAS BEEN AT THIS SALES STAGE"
6. **Given** a user views an opportunity detail page, **When** they view the Timeline section, **Then** it displays chronological list of events, activities, updates, and communications, or "No Data" message if no timeline data exists
7. **Given** an Admin user views pipeline analytics, **When** they view the chart, **Then** it includes all opportunities across the organization
8. **Given** an Employee user views pipeline analytics, **When** they view the chart, **Then** it includes only opportunities assigned to them or within their permission scope

---

### User Story 8 - User Customizes Table Columns and Views (Priority: P3)

As a user, I want to customize which columns are visible in the opportunities table and save my preferences, so that I can focus on the information most relevant to my workflow.

**Why this priority**: Column customization is a quality-of-life feature that improves user experience by allowing users to personalize their view. While not critical for core functionality, it enhances usability and helps users focus on relevant information.

**Independent Test**: Can be fully tested by clicking the Columns icon, moving columns between DISPLAYED and HIDDEN sections, saving preferences, and verifying columns remain customized on next visit. This delivers value by allowing users to personalize their workspace.

**Acceptance Scenarios**:

1. **Given** a user is on the opportunities list page, **When** they click the Columns icon (located to the right of Bulk Action dropdown), **Then** a "Choose Columns" modal opens showing DISPLAYED section (left, with purple badges) and HIDDEN section (right, with red badges)
2. **Given** a user views the Choose Columns modal, **When** they view the DISPLAYED section, **Then** they see default visible columns: Name, Account Name, Sales Stage, Amount, Close, User, Date Created
3. **Given** a user views the Choose Columns modal, **When** they view the HIDDEN section, **Then** they see available hidden columns: Type, Lead Source, Next Step, Probability (%), Created By, Modified By
4. **Given** a user drags a column tag/badge from DISPLAYED to HIDDEN section, **When** they click Save Changes, **Then** that column is hidden in the table
5. **Given** a user drags a column tag/badge from HIDDEN to DISPLAYED section, **When** they click Save Changes, **Then** that column appears in the table
6. **Given** a user customizes columns, **When** they click Save Changes, **Then** their column preferences are stored and persist across browser sessions, and the modal closes
7. **Given** a user customizes columns, **When** they click Close without saving, **Then** changes are discarded and the modal closes without updating column preferences

---

### User Story 9 - User Accesses Recently Viewed Opportunities (Priority: P3)

As a user, I want to quickly access recently viewed opportunities, so that I can return to recently worked-on records without navigating through the list.

**Why this priority**: Recently viewed tracking is a convenience feature that improves user experience. While not critical for core functionality, it helps users quickly return to recently accessed records, reducing navigation time and improving productivity.

**Independent Test**: Can be fully tested by viewing an opportunity detail page, then navigating to Opportunities menu, clicking Recently Viewed, and verifying the opportunity appears in the list. This delivers value by enabling quick access to recently worked-on records.

**Acceptance Scenarios**:

1. **Given** a user views an opportunity detail page, **When** they view the page, **Then** the system records this view in recently viewed list
2. **Given** a user hovers over "Opportunities" in navigation, **When** they hover, **Then** a dropdown menu appears with options: Create Opportunity, View Opportunities, Import Opportunities, and Recently Viewed (with right arrow indicator →)
3. **Given** a user hovers over "Opportunities" and clicks "Recently Viewed", **When** they click, **Then** a sub-menu displays showing recently viewed opportunity names (most recent first, up to 10) with truncated names indicated by "..." for long names
4. **Given** a user clicks on a recently viewed opportunity name in the sub-menu, **When** they click, **Then** they navigate directly to that opportunity's detail page
5. **Given** a user has viewed more than 10 opportunities, **When** they access Recently Viewed, **Then** only the most recent 10 opportunities are shown, with oldest entries removed to maintain the limit
6. **Given** a user has viewed multiple opportunities, **When** they access Recently Viewed, **Then** opportunities are listed in order of most recently viewed first

---

### User Story 10 - User Searches and Filters Opportunities Efficiently (Priority: P1)

As a sales representative, I want to search and filter opportunities quickly, so that I can find specific deals or groups of deals based on various criteria.

**Why this priority**: Efficient searching and filtering is essential for managing large numbers of opportunities. Users need to quickly locate specific opportunities or filter by criteria such as sales stage, assigned user, or close date. This is critical for daily operations.

**Independent Test**: Can be fully tested by entering search criteria in the filter panel, applying filters, and verifying the table displays only matching opportunities. This delivers immediate value by enabling efficient opportunity discovery.

**Acceptance Scenarios**:

1. **Given** a user opens the filter panel, **When** they enter Opportunity Name in the quick filter, **Then** the system filters opportunities by name matching the search term
2. **Given** a user applies multiple filter criteria, **When** they click Search, **Then** the system displays only opportunities matching ALL criteria (AND logic)
3. **Given** a user selects "My Items" quick filter, **When** applied, **Then** the system displays only opportunities assigned to the current user
4. **Given** a user selects "Open Items" quick filter, **When** applied, **Then** the system displays only opportunities not in closed stages (Closed Won, Closed Lost)
5. **Given** a user applies filters, **When** they click Clear, **Then** all filters are reset and the table displays all accessible opportunities

---

### Edge Cases

- What happens when a user attempts to create an opportunity with an invalid sales stage value?
  - System should display validation error indicating sales stage must be from predefined list, and prevent saving until valid value is selected

- What happens when a user tries to edit an opportunity they don't have permission to modify?
  - System should display permission error or disable edit functionality, preventing unauthorized access

- What happens when import file contains rows with missing required fields?
  - System should flag those rows as errors in import results, continue processing other rows, and provide detailed error information for failed rows

- What happens when bulk delete operation fails on some records due to permission issues?
  - System should delete accessible records, return partial success response with details of which records were deleted and which failed

- What happens when a user selects an account from lookup modal that is later deleted?
  - System should handle gracefully - either prevent account deletion if opportunities reference it, or show "deleted" indicator in opportunity display

- What happens when pipeline analytics calculation encounters opportunities with null or invalid amounts?
  - System should exclude null/invalid amounts from aggregation, log data quality issues, and return accurate aggregation for valid records

- What happens when a user's role changes while they're viewing an opportunity list?
  - System should refresh data based on current role at request time, potentially showing different opportunities if role changed

- What happens when import duplicate check finds matches but user wants to proceed?
  - System should continue with import, flag duplicates in results, and allow user to review duplicates separately without preventing successful imports

- What happens when related records list page fails to load?
  - System should display error message on the list page, allow retry, and provide navigation back to opportunity detail page

- What happens when a user tries to save an opportunity with a close date in the past?
  - System should validate date format and allow past dates (business rule dependent), or show validation error if only future dates are allowed

- What happens when column preferences fail to save?
  - System should show error message but allow user to continue using current column configuration, attempting to save preferences on next interaction

- What happens when recently viewed list exceeds maximum limit (10)?
  - System should remove oldest entries and add newest entry, maintaining most recent 10 opportunities

- What happens when lookup modal API request fails or times out?
  - System should display error message in modal, provide retry button, and allow user to close modal without selecting a record

- What happens when multiple users simultaneously update the same opportunity?
  - System uses optimistic locking with conflict detection: allows concurrent edits, detects conflicts on save operation, shows conflict resolution dialog if conflicts are detected, allowing user to choose which version to keep or merge changes

- What happens when filter criteria result in zero matching opportunities?
  - System should display empty state message "No results found" and allow user to clear filters or adjust criteria

- What happens when import file has encoding issues that prevent proper parsing?
  - System should detect encoding issues during file analysis, attempt encoding conversion, or return error with guidance on file format requirements

- What happens when sales stage update triggers recalculation of days at current stage but calculation fails?
  - System should handle calculation errors gracefully, log the error, use cached value or default to 0, ensuring opportunity update still succeeds

---

## Requirements *(mandatory)*

### Functional Requirements

#### Opportunity Management

- **FR-001**: System MUST allow authenticated users to create new opportunity records with required fields (Name, Amount, Sales Stage, Account, Expected Close Date)
- **FR-002**: System MUST allow authenticated users to view a list of opportunities with pagination, sorting, and filtering
- **FR-003**: System MUST allow authenticated users to view individual opportunity details
- **FR-004**: System MUST allow authenticated users to edit opportunity records (with permission check)
- **FR-005**: System MUST allow authenticated users to delete opportunity records (with permission check)
- **FR-006**: System MUST validate all required fields before saving opportunities
- **FR-007**: System MUST validate field values against predefined lists (sales stage, type, lead source)
  - **Sales Stage values**: Prospecting, Qualification, Needs Analysis, Value Proposition, Identifying Decision Makers, Perception Analysis, Proposal/Price Quote, Negotiation/Review, Closed Won, Closed Lost
- **FR-008**: System MUST validate lookup field references (account, assigned user, campaign must exist)
- **FR-009**: System MUST auto-generate system fields (ID, dateCreated, dateModified, createdBy, modifiedBy) on creation
- **FR-010**: System MUST update dateModified and modifiedBy fields automatically on every update

#### List View and Filtering

- **FR-020**: System MUST display opportunities in a sortable table with columns: Checkbox (for selection), Context Menu (three dots icon), Name (hyperlink), Account Name, Sales Stage, Amount (currency format), Close Date, User, Date Created, and Row Actions (Phone, Calendar, Task/Note, Email, View icons)
- **FR-021**: System MUST support three-state column sorting (descending → ascending → normal) with visual indicators (highlighted sort icon when active, not highlighted in normal state)
- **FR-022.1**: System MUST display row action icons (Phone, Calendar, Task/Note equals icon, Email, View chevron) on each table row for quick actions
- **FR-022.2**: System MUST provide context menu (three vertical dots) on each table row with row-specific actions
- **FR-022**: System MUST support filtering by: Opportunity Name, Account Name, Amount, Sales Stage, Assigned To, Lead Source, Expected Close Date, Next Step
- **FR-023**: System MUST support quick filters: My Items (assigned to current user), Open Items (exclude closed stages), My Favorites
- **FR-024**: System MUST combine multiple filters with AND logic
- **FR-025**: System MUST support pagination with default page size of 20 records and maximum of 100 records
- **FR-026**: System MUST display Quick Charts panel by default showing Pipeline By Sales Stage chart
- **FR-027**: System MUST allow users to toggle Quick Charts panel visibility (hide/show)
- **FR-028**: System MUST allow users to customize visible table columns via "Choose Columns" modal with DISPLAYED section (purple badges) and HIDDEN section (red badges), using drag-and-drop to move column tags/badges between sections
- **FR-028.1**: System MUST display default visible columns: Name, Account Name, Sales Stage, Amount, Close, User, Date Created
- **FR-028.2**: System MUST display available hidden columns: Type, Lead Source, Next Step, Probability (%), Created By, Modified By
- **FR-029**: System MUST save column preferences per user and persist across sessions when user clicks "Save Changes" button in Choose Columns modal

#### Import/Export

- **FR-040**: System MUST provide import template file download with all opportunity field column headers
- **FR-041**: System MUST support multi-step import process: Upload → Properties → Field Mapping → Duplicate Check → Execute
- **FR-042**: System MUST validate import file format, filename, and size
- **FR-043**: System MUST analyze import file and detect properties (delimiter, encoding, header row)
- **FR-044**: System MUST allow users to map import file columns to opportunity module fields
- **FR-045**: System MUST require all required fields to be mapped before allowing import execution
- **FR-046**: System MUST allow users to configure fields for duplicate checking
- **FR-047**: System MUST support import behaviors: Create Only and Create and Update
- **FR-048**: System MUST perform duplicate checking using configured fields during import
- **FR-049**: System MUST return detailed import results with counts (created, updated, errors, duplicates)
- **FR-050**: System MUST allow users to undo import operation (delete all records created during import)
- **FR-051**: System MUST support bulk export of selected opportunities in CSV format

#### Bulk Operations

- **FR-060**: System MUST allow users to select multiple opportunities using checkboxes
- **FR-061**: System MUST enable Bulk Action dropdown when opportunities are selected
- **FR-062**: System MUST support bulk delete operation with confirmation
- **FR-063**: System MUST support bulk export operation
- **FR-064**: System MUST support bulk merge operation (combine multiple opportunities into one)
- **FR-065**: System MUST support mass update operation (update common fields for multiple opportunities)
- **FR-066**: System MUST validate permissions for each record in bulk operations and return partial success if some records cannot be processed

#### Relationships

- **FR-080**: System MUST display Relationships section on opportunity detail page showing relationship types with counts
- **FR-081**: System MUST support relationship types: Activities, Contacts, Documents, Quotes, Projects, Contracts, Leads, History, Security Groups
- **FR-082**: System MUST allow users to expand/collapse Relationships section
- **FR-083**: System MUST allow users to navigate to full-page list views for related records when clicking relationship items
- **FR-084**: System MUST display related records in sortable, paginated tables on full-page list views
- **FR-085**: System MUST allow users to create related records from related records list pages
- **FR-086**: System MUST allow users to link/unlink related records
- **FR-087**: System MUST store relationship metadata (e.g., contact role in opportunity-contact relationship)
  - **Contact Role values**: Technical Decision Maker, Business Evaluator, Primary Decision Maker, and other role classifications

#### Analytics and Insights

- **FR-100**: System MUST aggregate pipeline data by sales stage for chart visualization
- **FR-101**: System MUST display Pipeline By Sales Stage vertical bar chart in Quick Charts panel with colored bars representing stages, monetary amounts on Y-axis, and a legend mapping colors to stage names
- **FR-101.1**: System MUST provide chart selector dropdown in Quick Charts panel allowing selection of different chart types (default: Pipeline By Sales Stage)
- **FR-102**: System MUST update chart data when filters are applied
- **FR-103**: System MUST calculate days at current sales stage for each opportunity
- **FR-104**: System MUST display days at current sales stage metric in Insights panel on detail page as a large number with label "DAY(S) THIS OPPORTUNITY HAS BEEN AT THIS SALES STAGE"
- **FR-104.1**: System MUST display Timeline section on opportunity detail page showing chronological events, activities, and communications, or "No Data" message when no timeline data exists
- **FR-105**: System MUST recalculate days at current sales stage when sales stage changes
- **FR-106**: System MUST apply role-based filtering to analytics (Admin sees all, Employee sees filtered)

#### Lookup Fields

- **FR-120**: System MUST provide lookup fields for: Assigned To (users), Account Name (accounts), Campaign (campaigns)
- **FR-121**: System MUST open lookup modal when user clicks dropdown arrow on lookup fields
- **FR-122**: System MUST display lookup modal with sortable, paginated table of records
- **FR-123**: System MUST allow users to search/filter records within lookup modal using search input field with Search button (user enters query and clicks Search button to filter results)
- **FR-124**: System MUST allow users to select a record from lookup modal by clicking table row
- **FR-125**: System MUST populate lookup field with selected record value and close modal
- **FR-126**: System MUST allow users to close lookup modal without selecting a record

#### Recently Viewed

- **FR-140**: System MUST track when users view opportunity detail pages
- **FR-141**: System MUST store recently viewed opportunities per user (most recent N, default: 10), removing oldest entries when limit is exceeded
- **FR-142**: System MUST display recently viewed opportunities in navigation sub-menu (accessed via "Recently Viewed" option with right arrow indicator in Opportunities dropdown)
- **FR-143**: System MUST order recently viewed list by most recently viewed first
- **FR-144**: System MUST allow users to navigate directly to recently viewed opportunities from sub-menu
- **FR-144.1**: System MUST truncate long opportunity names in recently viewed sub-menu with "..." indicator

#### Authentication and Authorization

- **FR-160**: System MUST require authentication for all opportunity pages and API endpoints
- **FR-161**: System MUST authorize operations based on user role (Admin, Employee)
- **FR-162**: System MUST allow Admin users to access all opportunities and perform all operations
- **FR-163**: System MUST allow Employee users to access only opportunities assigned to them or within their permission scope
- **FR-164**: System MUST filter data based on user role and permissions
- **FR-165**: System MUST prevent unauthorized access to opportunities (return 403 Forbidden)

#### Data Validation

- **FR-180**: System MUST validate required fields before allowing save operations
- **FR-181**: System MUST validate sales stage against predefined list of valid values
- **FR-182**: System MUST validate type and lead source against predefined lists if provided
- **FR-183**: System MUST validate opportunity amount is numeric and >= 0
- **FR-184**: System MUST validate probability is between 0 and 100 if provided
- **FR-185**: System MUST validate expected close date is in valid date format
- **FR-186**: System MUST validate account ID references an existing account
- **FR-187**: System MUST validate assigned user ID references an existing user if provided
- **FR-188**: System MUST validate campaign ID references an existing campaign if provided
- **FR-189**: System MUST return field-specific validation error messages

---

## Key Entities *(include if feature involves data)*

### Opportunity

**Description**: Represents a sales opportunity in the CRM system, tracking potential deals through the sales pipeline.

**Attributes**:
- `id` (string/UUID): Unique identifier, auto-generated
- `name` (string): Opportunity name/identifier, required
- `amount` (decimal): Monetary value, required, >= 0
- `currency` (string): Currency code, optional
- `salesStage` (enum): Current stage in sales pipeline, required, from predefined list
- `probability` (integer): Win probability percentage, optional, 0-100
- `nextStep` (string): Next action in sales process, optional
- `description` (text): Detailed description, optional
- `accountId` (string/UUID): Reference to associated account, required
- `expectedCloseDate` (date): Projected close date, required
- `type` (string): Opportunity type classification, optional
- `leadSource` (string): Source of the lead, optional
- `campaignId` (string/UUID): Reference to associated campaign, optional
- `assignedToId` (string/UUID): Reference to assigned user, optional
- `dateCreated` (datetime): Creation timestamp, auto-generated
- `dateModified` (datetime): Last modification timestamp, auto-updated
- `createdBy` (string/UUID): ID of creating user, auto-populated
- `modifiedBy` (string/UUID): ID of last modifying user, auto-updated

**Relationships**:
- Belongs to one Account (via accountId)
- Assigned to one User (via assignedToId, optional)
- Associated with one Campaign (via campaignId, optional)
- Has many Contacts (many-to-many with role) - Contact roles include: Technical Decision Maker, Business Evaluator, Primary Decision Maker
- Has many Activities (calls, meetings, tasks, emails)
- Has many Documents
- Has many Quotes
- Has many Projects
- Has many Contracts
- Has many Leads
- Has History records
- Associated with Security Groups

**Additional Attributes**:
- Favorite flag (for favoriting/unfavoriting opportunities)
- Record position in list (for navigation between records)

**Business Rules**:
- Name must be unique per account (or globally, business rule dependent)
- Amount must be positive number
- Sales Stage must be valid enum value
- Expected Close Date must be valid date
- Account must exist before opportunity can be created
- Days at current sales stage calculated automatically on sales stage change

### OpportunityContact

**Description**: Represents the relationship between opportunities and contacts with role information.

**Attributes**:
- `id` (string/UUID): Unique identifier
- `opportunityId` (string/UUID): Reference to opportunity
- `contactId` (string/UUID): Reference to contact
- `role` (string): Contact's role (e.g., "Technical Decision Maker", "Business Evaluator")
- `dateCreated` (datetime): Relationship creation timestamp

**Relationships**:
- Many-to-many relationship between Opportunity and Contact

### RecentlyViewedOpportunity

**Description**: Tracks which opportunities a user has recently viewed for quick access.

**Attributes**:
- `id` (string/UUID): Unique identifier
- `userId` (string/UUID): Reference to user
- `opportunityId` (string/UUID): Reference to opportunity
- `viewedAt` (datetime): Timestamp when viewed
- `viewCount` (integer): Number of times viewed (optional)

**Relationships**:
- Many-to-one with User
- Many-to-one with Opportunity

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a new opportunity in under 2 minutes from navigation to successful save
- **SC-002**: Opportunities list page loads and displays data within 2 seconds on standard broadband (95th percentile)
- **SC-003**: Table sorting and filtering respond within 200ms to user interactions
- **SC-004**: All functional requirements are implemented and tested - 100% requirement coverage in test suite
- **SC-005**: 90% of users successfully complete opportunity creation on first attempt without validation errors
- **SC-006**: Import process completes successfully for files up to 10MB with processing time under 30 seconds
- **SC-007**: Bulk operations (delete, update, export) complete successfully for all selected records (no hard limit on selection count, system processes in batches with progress indicators for large selections)
- **SC-008**: All validation rules are enforced and return clear, actionable error messages
- **SC-009**: Data integrity is maintained across all operations (no orphaned records, referential integrity preserved)
- **SC-010**: Authentication and authorization checks prevent unauthorized access 100% of the time
- **SC-011**: Role-based data filtering works correctly - Admin sees all data, Employee sees filtered data 100% of the time
- **SC-012**: Column preferences persist across browser sessions - preferences saved and restored 100% of the time
- **SC-013**: Recently viewed list accurately reflects last 10 viewed opportunities - tracking works correctly 100% of the time
- **SC-014**: Lookup modals load and display data within 500ms for typical queries
- **SC-015**: Pipeline analytics aggregation completes within 1 second for typical datasets
- **SC-016**: Related records list pages load and display related records within 500ms
- **SC-017**: All error responses follow consistent format with appropriate HTTP status codes and user-friendly messages
- **SC-018**: System handles import files with up to 10,000 rows without performance degradation
- **SC-019**: Duplicate checking during import completes within 2 seconds for imports with 1000 rows
- **SC-020**: System provides responsive UI that works on desktop, tablet, and mobile devices (320px and above) with breakpoints: Mobile (< 768px), Tablet (768px-1024px), Desktop (> 1024px)

---

## Technical Implementation Notes

This specification describes the complete Opportunity module feature from a user/product perspective. The implementation should:

- Provide a unified opportunity management experience across list, detail, create, and import workflows
- Ensure role-based access control is consistently applied across all features
- Handle errors gracefully and provide clear feedback to users
- Optimize performance through efficient data loading, pagination, and caching strategies
- Maintain data integrity through validation and referential integrity checks
- Support bulk operations efficiently for managing multiple records
- Provide intuitive UI/UX for all user interactions including filtering, sorting, and relationship management

For detailed technical requirements split by frontend and backend, refer to:
- `specs/opportunity/frontend-specs.md` - Frontend technical specification
- `specs/opportunity/backend-specs.md` - Backend technical specification

For detailed requirements documents, refer to:
- `requirements/opportunity/frontend-requirements.md` - Frontend requirements
- `requirements/opportunity/backend-requirements.md` - Backend requirements

---

## Clarifications

### Session 2025-12-13

- Q: When multiple users edit the same opportunity simultaneously, which strategy should the system use? → A: Optimistic locking with conflict detection - Allow edits, detect conflicts on save, show resolution dialog if conflicts exist

- Q: What are the specific responsive breakpoints (screen widths) for mobile, tablet, and desktop layouts? → A: Mobile: < 768px, Tablet: 768px-1024px, Desktop: > 1024px - Standard breakpoints

- Q: How should users move columns between DISPLAYED and HIDDEN sections in the Choose Columns modal? → A: Drag-and-drop - Users drag column tags/badges between sections

- Q: What filter operators should be available for the Opportunity Amount and Expected Close Date filter fields? → A: Standard operators: Equals, Greater Than, Less Than, Between (for both amount and date)

- Q: What file format(s) should the bulk Export operation support? → A: CSV only - Simple, universal format

- Q: What should happen when a user clicks a relationship item (e.g., "CONTACTS: 3") in the Relationships section? → A: Navigate to related records list - Navigate to a full-page list view showing all related records (e.g., `/opportunities/:id/contacts`)

- Q: What should be the maximum number of opportunities that can be selected for bulk operations (Delete, Export, Merge, Mass Update)? → A: No limit - All opportunities matching current filter can be selected (system processes in batches with progress indicators for large selections)

---

