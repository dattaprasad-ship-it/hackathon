# Frontend Requirements - Opportunity Module

**Module**: Opportunity  
**Created**: 2025-12-13  
**Status**: Draft  
**Derived From**: `product-info/product-overview.md`

## Overview

The Opportunity module provides the frontend interface for managing sales opportunities in the CRM system. This module includes pages for viewing opportunities list, creating/editing opportunities, bulk import functionality, relationship management, and analytics visualization. The frontend provides a user-friendly interface for sales teams to manage their opportunity pipeline.

**System Roles Used:**
- **Admin**: Can access all opportunity features, view all opportunities, perform bulk operations on any opportunities
- **Employee**: Can access opportunity features for opportunities assigned to them, view opportunities within their permission scope, perform operations on accessible opportunities

**Common Functionalities Used:**
- **Authentication & Authorization**: All opportunity pages require authentication (from product-overview.md)
- **Login**: Users must be authenticated before accessing opportunity pages
- **Session Management**: Opportunity pages use user session for data filtering and permissions

**Dependencies:**
- Authentication module (for login and session management)
- Account module (for account lookup and display)
- Contact module (for contact relationships)
- Navigation module (for main navigation bar)
- Common UI components (tables, forms, modals, buttons, etc.)

**Integration Points:**
- Consumes backend APIs for opportunity CRUD operations
- Consumes backend APIs for bulk import/export
- Integrates with Account module for account lookups
- Integrates with Contact module for contact relationships
- Integrates with Activity module for activity tracking
- Uses shared navigation and layout components

---

## Functional Requirements

### User Interface

- **FR-FE-001**: System MUST display Opportunities module in the main navigation bar
  - **Location**: Top navigation bar
  - **Display**: "Opportunities" link with dropdown arrow indicator
  - **Behavior**: Hover/click opens dropdown menu with options

- **FR-FE-002**: System MUST display Opportunities dropdown menu with navigation options
  - **Options**:
    1. Create Opportunity
    2. View Opportunities
    3. Import Opportunities
    4. Recently Viewed (with sub-menu indicator)
  - **Behavior**: Clicking options navigates to respective pages

- **FR-FE-003**: System MUST display "Recently Viewed" sub-menu when clicked
  - **Content**: List of recently viewed opportunity names (truncated if long)
  - **Behavior**: Clicking an opportunity name navigates to its detail page
  - **Limit**: Shows most recent N opportunities (default: 10)

### Pages/Routes

#### Opportunities List Page

- **FR-FE-010**: System MUST provide Opportunities list view page
  - **Route**: `/opportunities` or `/opportunities/index`
  - **Access**: Protected (requires authentication)
  - **Roles**: Admin, Employee
  - **Components**: 
    - OpportunitiesTable
    - QuickChartsPanel
    - FilterPanel
    - BulkActionDropdown
    - ColumnCustomizationModal
  - **Features**: 
    - Display opportunities in sortable, paginated table
    - Filter opportunities by multiple criteria
    - Bulk operations (delete, export, merge, mass update)
    - Column customization
    - Quick charts visualization
    - Insights panel toggle

#### Opportunity Detail/Edit Page

- **FR-FE-011**: System MUST provide Opportunity detail/edit page
  - **Route**: `/opportunities/:id` or `/opportunities/record/:id`
  - **Access**: Protected (requires authentication)
  - **Roles**: Admin, Employee (with permission check)
  - **Components**:
    - OpportunityDetailHeader
    - OpportunityForm (BASIC tab)
    - OpportunityMetadata (OTHER tab)
    - RelationshipsSection
    - RelationshipSubPanels
    - InsightsPanel
    - TimelinePanel
  - **Features**:
    - View opportunity details
    - Edit opportunity fields
    - View/edit relationships (contacts, activities, documents, quotes, etc.)
    - View insights and timeline
    - Navigate between opportunities

#### Create Opportunity Page

- **FR-FE-012**: System MUST provide Create Opportunity page
  - **Route**: `/opportunities/create` or `/opportunities/edit`
  - **Access**: Protected (requires authentication)
  - **Roles**: Admin, Employee
  - **Components**:
    - OpportunityCreateForm
    - FieldValidationDisplay
  - **Features**:
    - Create new opportunity with all fields
    - Field validation
    - Save and cancel actions

#### Import Opportunities Pages

- **FR-FE-013**: System MUST provide multi-step import process pages
  - **Routes**: 
    - Step 1: `/opportunities/import/step1` or `/import/step1?import_module=Opportunities`
    - Step 2: `/opportunities/import/step2`
    - Step 3: `/opportunities/import/step3`
    - Step 4: `/opportunities/import/step4`
    - Step 5: `/opportunities/import/results` or `/import/Last`
  - **Access**: Protected (requires authentication)
  - **Roles**: Admin, Employee
  - **Features**:
    - Step 1: Upload import file, select import behavior
    - Step 2: Confirm file properties, select data source
    - Step 3: Map file columns to opportunity fields
    - Step 4: Configure duplicate check, save settings
    - Step 5: View import results, handle duplicates/errors

### User Interactions

#### Navigation Interactions

- **FR-FE-020**: Users MUST be able to navigate to Opportunities list from navigation menu
  - **Trigger**: Clicking "Opportunities" tab or "View Opportunities" from dropdown
  - **Feedback**: Page loads with opportunities list
  - **Result**: User sees opportunities list page

- **FR-FE-021**: Users MUST be able to navigate to Create Opportunity page
  - **Trigger**: Clicking "Create Opportunity" from dropdown menu
  - **Feedback**: Page loads with create form
  - **Result**: User can create new opportunity

- **FR-FE-022**: Users MUST be able to navigate to Import Opportunities page
  - **Trigger**: Clicking "Import Opportunities" from dropdown menu
  - **Feedback**: Step 1 of import process loads
  - **Result**: User can start import process

- **FR-FE-023**: Users MUST be able to navigate to opportunity detail page
  - **Trigger**: Clicking opportunity name or chevron icon (→) in list view
  - **Feedback**: Detail page loads with opportunity information
  - **Result**: User sees opportunity details

#### List View Interactions

- **FR-FE-024**: Users MUST be able to sort opportunities table columns
  - **Trigger**: Clicking column header
  - **Behavior**: Three-state cycle - Descending → Ascending → Normal
  - **Feedback**: Sort icon highlighted to show active sort direction
  - **Result**: Table rows reordered based on selected column and sort direction

- **FR-FE-025**: Users MUST be able to select opportunities using checkboxes
  - **Trigger**: Clicking checkbox in table row or "Select All" checkbox
  - **Feedback**: Checkbox checked, selection count displayed, Bulk Action dropdown enabled
  - **Result**: Selected opportunities can be used for bulk operations

- **FR-FE-026**: Users MUST be able to filter opportunities
  - **Trigger**: Clicking "Filter" button
  - **Feedback**: Basic Filter panel opens
  - **Result**: User can enter filter criteria and apply filters

- **FR-FE-027**: Users MUST be able to toggle Quick Charts panel visibility
  - **Trigger**: Clicking "Insights" button
  - **Feedback**: Quick Charts panel hides, table columns expand
  - **Result**: More horizontal space available for opportunity table

- **FR-FE-028**: Users MUST be able to customize visible columns
  - **Trigger**: Clicking Columns icon (three horizontal lines)
  - **Feedback**: "Choose Columns" modal opens
  - **Result**: User can move columns between DISPLAYED and HIDDEN sections

- **FR-FE-029**: Users MUST be able to navigate between pages of opportunities
  - **Trigger**: Clicking pagination controls (<<, <, >, >>)
  - **Feedback**: Next/previous page of opportunities loads
  - **Result**: User sees different set of opportunities

#### Detail/Edit Page Interactions

- **FR-FE-030**: Users MUST be able to switch between View and Edit modes
  - **Trigger**: Clicking "Edit" button in header
  - **Feedback**: Fields become editable, header buttons change to Save/Save And Continue/Cancel
  - **Result**: User can modify opportunity fields

- **FR-FE-031**: Users MUST be able to save changes
  - **Trigger**: Clicking "Save" or "Save And Continue" button
  - **Feedback**: Changes submitted, success message or redirect to view mode
  - **Result**: Opportunity updated, changes persisted

- **FR-FE-032**: Users MUST be able to cancel edits
  - **Trigger**: Clicking "Cancel" button
  - **Feedback**: Changes discarded, returns to view mode
  - **Result**: No changes saved, original values restored

- **FR-FE-033**: Users MUST be able to navigate between opportunity records
  - **Trigger**: Clicking navigation arrows (<, >) in header
  - **Feedback**: Previous/next opportunity loads
  - **Result**: User can browse opportunities without returning to list

- **FR-FE-034**: Users MUST be able to expand/collapse Relationships section
  - **Trigger**: Clicking chevron icon on Relationships header
  - **Feedback**: Relationships grid expands/collapses
  - **Result**: User can view/hide relationship entities with counts

- **FR-FE-035**: Users MUST be able to open relationship sub-panels
  - **Trigger**: Clicking on a relationship item (e.g., "CONTACTS: 3")
  - **Feedback**: Sub-panel opens below Relationships section
  - **Result**: User can view related records for that relationship type

- **FR-FE-036**: Users MUST be able to create related records from relationship sub-panels
  - **Trigger**: Clicking "Create" option in Actions dropdown of relationship sub-panel
  - **Feedback**: Navigates to create page for that entity type
  - **Result**: New record created and linked to opportunity

#### Lookup Field Interactions

- **FR-FE-037**: Users MUST be able to open lookup modal by clicking dropdown arrow on lookup fields
  - **Trigger**: Clicking dropdown arrow (↓) on lookup fields (Assigned To, Account Name, Campaign)
  - **Feedback**: Lookup modal/popup opens displaying table of available records with search input field and Search button
  - **Result**: User can search, filter, and select a record from the modal

- **FR-FE-038**: Users MUST be able to select a record from lookup modal
  - **Trigger**: Clicking on a row in the lookup modal table
  - **Feedback**: Row is highlighted/selected, selection is visible
  - **Result**: Selected record is populated in the lookup field, modal closes

- **FR-FE-039**: Users MUST be able to close lookup modal
  - **Trigger**: Clicking "X" close button in modal header or clicking outside modal
  - **Feedback**: Modal closes
  - **Result**: Returns to form without changing lookup field value

#### Bulk Operations

- **FR-FE-040**: Users MUST be able to perform bulk delete
  - **Trigger**: Selecting opportunities and clicking "Delete" in Bulk Action dropdown
  - **Feedback**: Confirmation dialog appears
  - **Result**: Selected opportunities deleted after confirmation

- **FR-FE-041**: Users MUST be able to perform bulk export
  - **Trigger**: Selecting opportunities and clicking "Export" in Bulk Action dropdown
  - **Feedback**: Export file downloads
  - **Result**: Selected opportunities data exported in file format

- **FR-FE-042**: Users MUST be able to perform bulk merge
  - **Trigger**: Selecting multiple opportunities and clicking "Merge" in Bulk Action dropdown
  - **Feedback**: Merge dialog/interface appears
  - **Result**: Opportunities merged into one

- **FR-FE-043**: Users MUST be able to perform mass update
  - **Trigger**: Selecting opportunities and clicking "Mass Update" in Bulk Action dropdown
  - **Feedback**: Mass update form appears
  - **Result**: Common fields updated for all selected opportunities

#### Import Process Interactions

- **FR-FE-050**: Users MUST be able to download import template
  - **Trigger**: Clicking "Download Import File Template" link
  - **Feedback**: Template file downloads
  - **Result**: User receives template file with column headers

- **FR-FE-051**: Users MUST be able to upload import file
  - **Trigger**: Clicking "Choose File" and selecting file
  - **Feedback**: File selected, filename displayed
  - **Result**: File ready for import processing

- **FR-FE-052**: Users MUST be able to navigate through import steps
  - **Trigger**: Clicking "Next >" or "< Back" buttons
  - **Feedback**: Next/previous step loads
  - **Result**: User progresses through import workflow

- **FR-FE-053**: Users MUST be able to map import file columns to module fields
  - **Trigger**: Selecting module field from dropdown in mapping table
  - **Feedback**: Mapping updated, preview data shown
  - **Result**: Column mapped to selected module field

- **FR-FE-054**: Users MUST be able to configure duplicate check fields
  - **Trigger**: Dragging fields from "Available Fields" to "Fields to Check"
  - **Feedback**: Field moved to duplicate check list
  - **Result**: Selected fields used for duplicate detection during import

- **FR-FE-055**: Users MUST be able to execute import
  - **Trigger**: Clicking "Import Now" button
  - **Feedback**: Import processing starts, results page loads when complete
  - **Result**: Opportunities imported, results displayed

- **FR-FE-056**: Users MUST be able to view import results
  - **Trigger**: Import completes or clicking on import results link
  - **Feedback**: Results page displays with summary and created records
  - **Result**: User can review import outcomes

- **FR-FE-057**: Users MUST be able to undo import
  - **Trigger**: Clicking "Undo Import" button on results page
  - **Feedback**: Confirmation dialog appears
  - **Result**: All records from import deleted after confirmation

- **FR-FE-058**: Users MUST be able to exit import process
  - **Trigger**: Clicking "Exit" button on results page
  - **Feedback**: Navigates to Opportunities list view
  - **Result**: Import complete, records remain in system

### Forms & Input

#### Create/Edit Opportunity Form

- **FR-FE-060**: System MUST provide Create Opportunity form
  - **Fields**: 
    - Opportunity Name* (text input)
    - Opportunity Amount* (currency selector + number input)
    - Sales Stage* (dropdown with populated values)
    - Probability % (number input)
    - Next Step (text input)
    - Description (multiline text area)
    - Account Name* (lookup dropdown with populated accounts)
    - Expected Close Date* (date picker)
    - Type (dropdown with populated values)
    - Lead Source (dropdown with populated values)
    - Campaign (lookup dropdown with populated campaigns)
    - Assigned To (lookup dropdown with populated users)
  - **Validation**: 
    - Required fields (marked with *) must be filled
    - Amount must be valid number
    - Date must be valid format
    - Dropdown values must be from available options
  - **Submission**: 
    - "Save" button creates opportunity and navigates to detail page
    - "Cancel" button discards changes and navigates back

- **FR-FE-061**: System MUST provide Edit Opportunity form
  - **Fields**: Same as Create form, pre-filled with current values
  - **Validation**: Same validation rules as Create form
  - **Submission**: 
    - "Save" button saves changes and returns to view mode
    - "Save And Continue" button saves changes and remains in edit mode
    - "Cancel" button discards changes and returns to view mode

- **FR-FE-062**: System MUST provide lookup modal for lookup fields (Assigned To, Account Name, Campaign)
  - **Fields**: 
    - **Assigned To Lookup**: Opens modal with user records table
      - Table columns: Name, Username, Job Title, Department, Email, Phone
      - Sortable columns (up/down arrows on headers)
      - Pagination controls (<<, <, page info, >, >>)
      - Row selection: Clicking row highlights and selects user
    - **Account Name Lookup**: Opens modal with account records table
      - Table columns: Account name and other relevant account fields
      - Sortable columns and pagination
      - Row selection behavior
    - **Campaign Lookup**: Opens modal with campaign records table
      - Table columns: Campaign name and other relevant campaign fields
      - Sortable columns and pagination
      - Row selection behavior
  - **Modal Features**:
    - Modal title displays entity type (e.g., "Basic Filter" for users, or entity-specific title)
    - Close button (X) in top right corner
    - Search input field with Search button (user enters query and clicks Search to filter results)
    - Add/Advanced filter button (+ icon) in title area (optional)
    - Table with sortable columns
    - Pagination controls (top and bottom)
    - Row highlighting when hovered
    - Row selection when clicked
    - Selected row visually highlighted (background color change)
  - **Behavior**: 
    - Modal opens when dropdown arrow is clicked
    - Records loaded via API call
    - User can enter search query in search input field and click Search button to filter results
    - User can sort by clicking column headers
    - User can navigate pages using pagination
    - User can select record by clicking table row
    - Selected record value populates lookup field
    - Modal closes after selection or when close button clicked

- **FR-FE-063**: System MUST validate required fields before form submission
  - **Required Fields**: Opportunity Name, Opportunity Amount, Sales Stage, Account Name, Expected Close Date
  - **Validation**: 
    - Display error messages for empty required fields when field loses focus (on blur event)
    - Disable Save button until all required fields are filled AND pass validation rules (both filled status and validation must pass)
    - Inline validation feedback appears on field blur

- **FR-FE-064**: System MUST populate all dropdown fields with available values
  - **Sales Stage**: List of valid sales stage options
  - **Type**: List of valid opportunity type options
  - **Lead Source**: List of valid lead source options
  - **Account Name**: List of available accounts
  - **Campaign**: List of available campaigns
  - **Assigned To**: List of available users

#### Filter Form

- **FR-FE-065**: System MUST provide Basic Filter form
  - **Fields**:
    - Opportunity Name (text input)
    - Account Name (dropdown with accounts)
    - Opportunity Amount (operator dropdown + number input)
    - Assigned to (dropdown with users)
    - Sales Stage (dropdown with sales stages)
    - Lead Source (dropdown with lead sources)
    - Expected Close Date (operator dropdown + date picker)
    - Next Step (text input)
  - **Quick Filters**: Checkboxes for My Items, Open Items, My Favorites
  - **Actions**: 
    - "Clear" button resets all filters
    - "Search" button applies filters
    - "Save" button saves filter configuration

- **FR-FE-066**: System MUST provide Quick Filter section
  - **Fields**: Name quick filter (text input with checkbox)
  - **Features**: Order by column dropdown, Sort direction radio buttons (Ascending/Descending)

#### Import Forms

- **FR-FE-067**: System MUST provide import file upload form (Step 1)
  - **Fields**: File upload input
  - **Options**: Import behavior radio buttons (Create new records only, Create new records and update existing records)
  - **Actions**: Next > button

- **FR-FE-068**: System MUST provide import file properties form (Step 2)
  - **Content**: Data preview table, View Import File Properties button
  - **Options**: Source selection radio buttons (None, Salesforce.com, Microsoft Outlook)
  - **Actions**: < Back, Next > buttons

- **FR-FE-069**: System MUST provide field mapping form (Step 3)
  - **Fields**: Three-column table (Header Row, Module Field dropdown, Row 1 preview)
  - **Features**: Default Value button, Add Field button
  - **Actions**: < Back, Next > buttons

- **FR-FE-070**: System MUST provide duplicate check configuration form (Step 4)
  - **Fields**: 
    - Fields to Check list box (left)
    - Available Fields list box (right) with draggable fields
    - Save settings input field (optional)
  - **Actions**: < Back, Import Now buttons

### Data Display

- **FR-FE-071**: System MUST display opportunities in a sortable, paginated table
  - **Columns**: Name, Account Name, Sales Stage, Amount, Close (date), User, Date Created
  - **Features**: 
    - All columns sortable (three-state cycle)
    - Pagination controls (20 records per page default)
    - Row selection checkboxes
    - Row action icons (phone, calendar, task, email, view)
    - Context menu (three dots) on each row

- **FR-FE-072**: System MUST display Quick Charts panel by default
  - **Content**: Pipeline By Sales Stage bar chart
  - **Features**: 
    - Chart type selector dropdown
    - Bar chart with Y-axis (monetary amounts)
    - Color-coded legend for sales stages
    - Chart updates based on filtered data

- **FR-FE-073**: System MUST display Insights panel on detail page
  - **Content**: Days at current sales stage metric (large number display)
  - **Location**: Right panel of detail page
  - **Updates**: Automatically updates when sales stage changes

- **FR-FE-074**: System MUST display Timeline panel on detail page
  - **Content**: Chronological list of activities, updates, communications
  - **Location**: Right panel of detail page, below Insights
  - **Empty State**: Shows "No Data" message when empty

- **FR-FE-075**: System MUST display Relationships section with entity counts
  - **Content**: Grid of relationship types with icons and counts
  - **Entities**: Activities, History, Documents, Leads, Projects, Quotes, Contacts, Contracts, Security Groups
  - **Behavior**: Expandable/collapsible section

- **FR-FE-076**: System MUST display relationship sub-panels with related records
  - **Content**: Table of related records for selected relationship type
  - **Features**: Sortable columns, pagination, row actions
  - **Empty State**: Shows "No results found." when no records exist

- **FR-FE-077**: System MUST display import results with summary statistics
  - **Content**: 
    - Summary: Records created count, errors count
    - Action buttons: Undo Import, Import Again, Exit
    - Filter links: Created Records, Duplicates, Errors
    - Opportunities table with imported records

### State Management

- **FR-FE-078**: System MUST maintain opportunity list state (filters, sorting, pagination)
  - **Persistence**: Filter and sort preferences persist during session
  - **Reset**: Clear filters or reset to defaults when needed

- **FR-FE-079**: System MUST maintain column visibility preferences per user
  - **Storage**: User preferences stored and retrieved from backend
  - **Persistence**: Preferences persist across browser sessions

- **FR-FE-080**: System MUST cache recently viewed opportunities for quick access
  - **Storage**: Recently viewed list stored per user
  - **Limit**: Most recent N opportunities (default: 10)

- **FR-FE-081**: System MUST maintain import process state across steps
  - **Storage**: File data, settings, mappings maintained during import workflow
  - **Navigation**: State preserved when navigating between import steps

### API Integration

- **FR-FE-082**: System MUST consume GET `/api/users` or lookup endpoint for user lookup modal
  - **Request**: Query parameters for pagination, sorting, filtering, search
  - **Response**: Paginated list of users with columns (Name, Username, Job Title, Department, Email, Phone)
  - **Error Handling**: Display error message if request fails
  - **Usage**: Used when opening "Assigned To" lookup modal

- **FR-FE-083**: System MUST consume GET `/api/accounts` or lookup endpoint for account lookup modal
  - **Request**: Query parameters for pagination, sorting, filtering, search
  - **Response**: Paginated list of accounts with relevant columns
  - **Error Handling**: Display error message if request fails
  - **Usage**: Used when opening "Account Name" lookup modal

- **FR-FE-084**: System MUST consume GET `/api/campaigns` or lookup endpoint for campaign lookup modal
  - **Request**: Query parameters for pagination, sorting, filtering, search
  - **Response**: Paginated list of campaigns with relevant columns
  - **Error Handling**: Display error message if request fails
  - **Usage**: Used when opening "Campaign" lookup modal

- **FR-FE-090**: System MUST consume GET `/api/opportunities` endpoint for list view
  - **Request**: Query parameters for pagination, sorting, filtering
  - **Response**: Paginated list of opportunities
  - **Error Handling**: Display error message if request fails

- **FR-FE-091**: System MUST consume GET `/api/opportunities/:id` endpoint for detail view
  - **Request**: Opportunity ID
  - **Response**: Complete opportunity object with relationships
  - **Error Handling**: Display 404 error if opportunity not found

- **FR-FE-092**: System MUST consume POST `/api/opportunities` endpoint for create
  - **Request**: Opportunity data object
  - **Response**: Created opportunity object
  - **Error Handling**: Display validation errors for invalid fields

- **FR-FE-093**: System MUST consume PUT/PATCH `/api/opportunities/:id` endpoint for update
  - **Request**: Updated opportunity data
  - **Response**: Updated opportunity object
  - **Error Handling**: Display validation errors for invalid fields

- **FR-FE-094**: System MUST consume DELETE `/api/opportunities/:id` endpoint for delete
  - **Request**: Opportunity ID
  - **Response**: Success confirmation
  - **Error Handling**: Display error if deletion fails

- **FR-FE-095**: System MUST consume bulk operation endpoints (delete, export, merge, mass-update)
  - **Request**: Array of opportunity IDs and operation-specific data
  - **Response**: Operation results
  - **Error Handling**: Display partial success/error details for bulk operations

- **FR-FE-096**: System MUST consume import-related endpoints for multi-step import process
  - **Endpoints**: Upload, analyze, properties, map-fields, duplicate-check, execute, results
  - **Request/Response**: Varies by step
  - **Error Handling**: Display step-specific error messages

- **FR-FE-097**: System MUST consume GET `/api/opportunities/recently-viewed` endpoint
  - **Request**: Limit parameter (optional)
  - **Response**: List of recently viewed opportunities
  - **Error Handling**: Display empty state if no recent views

- **FR-FE-098**: System MUST consume GET `/api/opportunities/:id/relationships/:type` endpoint
  - **Request**: Opportunity ID and relationship type
  - **Response**: Paginated list of related records
  - **Error Handling**: Display error if relationship data cannot be loaded

- **FR-FE-099**: System MUST consume GET `/api/opportunities/analytics/pipeline-by-sales-stage` endpoint

- **FR-FE-100**: System MUST consume generic lookup endpoints for relationship entities
  - **Request**: Entity type, query parameters for pagination, sorting, filtering, search
  - **Response**: Paginated list of records for the entity type
  - **Error Handling**: Display error message if request fails
  - **Usage**: Used for lookup modals across all lookup fields
  - **Request**: Optional filter parameters
  - **Response**: Aggregated pipeline data by sales stage
  - **Error Handling**: Display error message if chart data cannot be loaded

### Navigation & Routing

- **FR-FE-101**: System MUST protect all opportunity routes with authentication
  - **Routes**: All `/opportunities/*` routes
  - **Behavior**: Redirect to login if not authenticated
  - **Authorization**: Check user permissions for protected operations

- **FR-FE-102**: System MUST support browser navigation (back/forward) through import steps
  - **Behavior**: Maintain import state when navigating back
  - **Validation**: Prevent navigation forward if current step invalid

- **FR-FE-103**: System MUST handle route parameters for opportunity detail page
  - **Route**: `/opportunities/:id` or `/opportunities/record/:id`
  - **Behavior**: Load opportunity data based on ID parameter
  - **Error Handling**: Display 404 page if opportunity not found or not accessible

---

## Non-Functional Requirements

### User Experience

- **NFR-FE-001**: System MUST provide loading indicators for async operations
  - **Operations**: API requests, import processing, bulk operations
  - **Display**: Spinner or progress indicator
  - **Feedback**: User informed that operation is in progress

- **NFR-FE-002**: System MUST display error messages in user-friendly format
  - **Format**: Clear, actionable error messages
  - **Location**: Inline for form errors, toast/notification for API errors
  - **Content**: Explain what went wrong and how to fix it

- **NFR-FE-003**: System MUST be responsive across desktop, tablet, and mobile devices
  - **Breakpoints**: Mobile (< 768px), Tablet (768px - 1024px), Desktop (> 1024px)
  - **Layout**: Adapts to screen size based on breakpoints
  - **Tables**: Responsive table design or card view on mobile
  - **Forms**: Stack vertically on smaller screens (mobile/tablet)

- **NFR-FE-004**: System MUST provide visual feedback for user actions
  - **Hover States**: Buttons and links show hover effects
  - **Active States**: Selected items visually highlighted
  - **Transition Animations**: Smooth transitions between states

- **NFR-FE-005**: System MUST display empty states appropriately
  - **No Data**: Show "No Data" or "No results found" messages
  - **Empty Lists**: Provide guidance on how to add data
  - **Empty Filters**: Show all data when filters return no results

### Performance

- **NFR-FE-010**: System MUST load opportunities list page within 2 seconds
  - **Optimization**: Lazy loading, pagination, efficient API calls
  - **Caching**: Cache frequently accessed data where appropriate

- **NFR-FE-011**: System MUST lazy load relationship sub-panels
  - **Behavior**: Load data only when sub-panel is opened
  - **Benefit**: Improve initial page load time

- **NFR-FE-012**: System MUST optimize table rendering for large datasets
  - **Techniques**: Virtual scrolling or pagination
  - **Performance**: Smooth scrolling and interaction with 100+ records

- **NFR-FE-013**: System MUST debounce search/filter inputs
  - **Delay**: 300ms delay - wait for user to stop typing before triggering search
  - **Benefit**: Reduce unnecessary API calls while maintaining responsive feel

### Accessibility

- **NFR-FE-020**: System MUST support keyboard navigation
  - **Tables**: Tab navigation through cells, Enter to activate
  - **Forms**: Tab through fields, Enter to submit
  - **Modals**: Focus trap, Escape to close

- **NFR-FE-021**: System MUST provide ARIA labels for screen readers
  - **Elements**: Buttons, form fields, table headers, icons
  - **Content**: Descriptive labels for all interactive elements

- **NFR-FE-022**: System MUST provide sufficient color contrast
  - **Text**: WCAG AA compliance (4.5:1 contrast ratio)
  - **Interactive Elements**: Clear visual distinction

- **NFR-FE-023**: System MUST support screen reader announcements
  - **Dynamic Content**: Announce changes (filter applied, record saved, etc.)
  - **Errors**: Announce validation errors and success messages

### Browser Support

- **NFR-FE-030**: System MUST support modern browsers
  - **Chrome**: Latest 2 versions
  - **Firefox**: Latest 2 versions
  - **Safari**: Latest 2 versions
  - **Edge**: Latest 2 versions

---

## UI Components

### OpportunitiesTable

**Description**: Displays list of opportunities in a sortable, paginated table format.

**Props**:
- `opportunities` (array): List of opportunity objects to display
- `onSort` (function): Callback when column is sorted
- `onSelect` (function): Callback when row is selected
- `onRowClick` (function): Callback when row is clicked
- `sortBy` (string): Current sort column
- `sortOrder` (string): Current sort direction (asc, desc, none)
- `selectedIds` (array): IDs of selected opportunities
- `visibleColumns` (array): Columns to display
- `pagination` (object): Pagination metadata (currentPage, totalPages, totalCount)

**Usage**:
- Used in Opportunities list page
- Displays opportunities with sortable columns and row actions

**Styling**:
- Uses table component from UI library
- Responsive design for mobile/tablet
- Highlighted sort icons for active sort

### QuickChartsPanel

**Description**: Displays pipeline visualization charts (bar chart by sales stage).

**Props**:
- `data` (object): Pipeline data aggregated by sales stage
- `chartType` (string): Type of chart to display (default: "Pipeline By Sales Stage")
- `onChartTypeChange` (function): Callback when chart type is changed
- `onToggle` (function): Callback when panel is toggled (hide/show)

**Usage**:
- Used in Opportunities list page (right panel)
- Provides visual summary of opportunity pipeline

**Styling**:
- Chart component with legend
- Collapsible panel
- Responsive chart sizing

### FilterPanel

**Description**: Advanced filter panel for filtering opportunities list.

**Props**:
- `filters` (object): Current filter values
- `onFilterChange` (function): Callback when filter values change
- `onApply` (function): Callback when Search button clicked
- `onClear` (function): Callback when Clear button clicked
- `onSave` (function): Callback when Save button clicked
- `isOpen` (boolean): Whether panel is open/visible

**Usage**:
- Used in Opportunities list page
- Provides multiple filter criteria and quick filters

**Styling**:
- Overlay or side panel
- Grid layout for filter fields
- Clear visual hierarchy

### ColumnCustomizationModal

**Description**: Modal for customizing which columns are visible in opportunities table.

**Props**:
- `displayedColumns` (array): Currently visible columns
- `hiddenColumns` (array): Available but hidden columns
- `onSave` (function): Callback when Save Changes clicked
- `onClose` (function): Callback when modal closed
- `isOpen` (boolean): Whether modal is open

**Usage**:
- Opened from Opportunities list page when Columns icon clicked
- Allows users to customize table column visibility

**Styling**:
- Modal overlay
- Two-column layout (DISPLAYED / HIDDEN)
- Column items as tags/badges

### OpportunityForm

**Description**: Form for creating or editing opportunities.

**Props**:
- `opportunity` (object, optional): Existing opportunity data (for edit mode)
- `mode` (string): "create" or "edit"
- `onSubmit` (function): Callback when form is submitted
- `onCancel` (function): Callback when form is cancelled
- `isSubmitting` (boolean): Whether form is being submitted

**Usage**:
- Used in Create Opportunity page and Edit mode of Detail page
- Handles all opportunity field inputs and validation

**Styling**:
- Two-column layout for fields
- Required field indicators (asterisk)
- Validation error display

### RelationshipsSection

**Description**: Section displaying related entities with counts, expandable to show sub-panels.

**Props**:
- `opportunityId` (string): ID of current opportunity
- `relationships` (object): Relationship counts by type
- `isExpanded` (boolean): Whether section is expanded
- `onToggle` (function): Callback when section expanded/collapsed
- `onRelationshipClick` (function): Callback when relationship item clicked

**Usage**:
- Used in Opportunity detail page
- Shows all related entities and allows navigation to relationship sub-panels

**Styling**:
- Grid layout for relationship items
- Icons for each relationship type
- Expandable/collapsible section

### RelationshipSubPanel

**Description**: Sub-panel displaying related records for a specific relationship type.

**Props**:
- `opportunityId` (string): ID of current opportunity
- `relationshipType` (string): Type of relationship (contacts, activities, etc.)
- `records` (array): Related records to display
- `onClose` (function): Callback when panel is closed
- `onCreate` (function): Callback when Create action clicked
- `onLink` (function): Callback when Link/Unlink action clicked

**Usage**:
- Opened when clicking a relationship item in Relationships section
- Displays table of related records with actions

**Styling**:
- Panel overlay or expanded section
- Table with relationship-specific columns
- Action dropdown in header

### ImportWizard

**Description**: Multi-step wizard component for importing opportunities.

**Props**:
- `currentStep` (number): Current step (1-5)
- `importState` (object): Import process state (file, settings, mappings, etc.)
- `onStepChange` (function): Callback when step changes
- `onComplete` (function): Callback when import completes

**Usage**:
- Used for entire import process
- Manages state across all import steps

**Styling**:
- Step indicator showing current step
- Consistent layout across steps
- Progress indication

### LookupModal

**Description**: Modal component for selecting records from lookup fields (Assigned To, Account Name, Campaign, etc.).

**Props**:
- `entityType` (string): Type of entity to display (users, accounts, campaigns, etc.)
- `title` (string): Modal title (e.g., "Basic Filter" or entity-specific title)
- `columns` (array): Table columns to display (varies by entity type)
  - For Users: Name, Username, Job Title, Department, Email, Phone
  - For Accounts: Account name and other account fields
  - For Campaigns: Campaign name and other campaign fields
- `onSelect` (function): Callback when a record is selected
  - Receives selected record object
  - Closes modal and populates lookup field
- `onClose` (function): Callback when modal is closed
- `isOpen` (boolean): Whether modal is open
- `searchQuery` (string, optional): Initial search query
- `filters` (object, optional): Initial filter criteria

**Usage**:
- Opened when clicking dropdown arrow on lookup fields
- Displays table of records with sorting, pagination, and selection
- Used for: Assigned To, Account Name, Campaign lookup fields

**Features**:
- Search input field with Search button (user enters search query and clicks Search button to filter table results)
- Sortable table columns (up/down arrows on headers)
- Pagination controls (<<, <, page info (X - Y of Z), >, >>)
- Row selection (clicking row highlights and selects)
- Close button (X) in header
- Optional Add/Advanced filter button (+ icon) in title

**Styling**:
- Modal overlay
- Table with sortable headers
- Row hover and selection highlighting
- Pagination controls (top and bottom of table)
- Responsive table layout

---

## User Flows

### Flow 1: Create Opportunity

**Description**: User creates a new opportunity from scratch.

**Steps**:
1. User clicks "Opportunities" in navigation, then "Create Opportunity" from dropdown
2. System navigates to Create Opportunity page
3. User fills in required fields (Name, Amount, Sales Stage, Account, Close Date)
4. User optionally fills in additional fields (Description, Type, Lead Source, etc.)
5. User clicks "Save" button
6. System validates required fields
7. System creates opportunity via API
8. System navigates to opportunity detail page
9. User sees newly created opportunity

**Entry Point**: Navigation dropdown menu
**Exit Point**: Opportunity detail page

### Flow 2: View and Edit Opportunity

**Description**: User views an opportunity and makes edits.

**Steps**:
1. User navigates to Opportunities list page
2. User clicks on an opportunity name
3. System navigates to opportunity detail page (view mode)
4. User reviews opportunity information
5. User clicks "Edit" button
6. System switches to edit mode, fields become editable
7. User modifies fields
8. User clicks "Save" button
9. System validates and saves changes
10. System returns to view mode with updated data

**Entry Point**: Opportunities list page
**Exit Point**: Opportunity detail page (view mode)

### Flow 3: Filter and Sort Opportunities

**Description**: User filters and sorts opportunities list.

**Steps**:
1. User navigates to Opportunities list page
2. User clicks "Filter" button
3. System opens Basic Filter panel
4. User enters filter criteria (e.g., Sales Stage = "Closed Won", Assigned To = current user)
5. User clicks "Search" button
6. System applies filters and updates table
7. User clicks on "Amount" column header to sort
8. System sorts table by Amount in descending order
9. User clicks "Amount" column header again
10. System sorts table by Amount in ascending order

**Entry Point**: Opportunities list page
**Exit Point**: Opportunities list page with filters/sorting applied

### Flow 4: Bulk Delete Opportunities

**Description**: User selects and deletes multiple opportunities.

**Steps**:
1. User navigates to Opportunities list page
2. User selects multiple opportunities using checkboxes
3. System enables Bulk Action dropdown and shows selection count
4. User clicks Bulk Action dropdown
5. User selects "Delete" option
6. System displays confirmation dialog
7. User confirms deletion
8. System deletes selected opportunities via API
9. System updates table to remove deleted opportunities
10. System displays success message

**Entry Point**: Opportunities list page
**Exit Point**: Opportunities list page (updated)

### Flow 5: Import Opportunities

**Description**: User imports multiple opportunities from a file.

**Steps**:
1. User clicks "Opportunities" in navigation, then "Import Opportunities" from dropdown
2. System navigates to Step 1: Upload Import File
3. User clicks "Download Import File Template" (optional)
4. User fills template with opportunity data
5. User clicks "Choose File" and selects filled template
6. User selects import behavior (Create new records only)
7. User clicks "Next >"
8. System navigates to Step 2: Confirm Import File Properties
9. System displays data preview table
10. User reviews preview and clicks "Next >"
11. System navigates to Step 3: Confirm Field Mappings
12. User reviews automatic mappings, adjusts if needed
13. User clicks "Next >"
14. System navigates to Step 4: Check For Possible Duplicates
15. User drags "Opportunity Name" field to "Fields to Check"
16. User clicks "Import Now"
17. System processes import and navigates to Step 5: View Import Results
18. System displays summary (e.g., "1 records were created, 5 rows were not imported due to error")
19. User reviews results and clicks "Exit"
20. System navigates to Opportunities list page

**Entry Point**: Navigation dropdown menu
**Exit Point**: Opportunities list page

### Flow 6: View Opportunity Relationships

**Description**: User views contacts related to an opportunity.

**Steps**:
1. User navigates to opportunity detail page
2. User expands Relationships section by clicking chevron
3. System displays relationship grid showing "CONTACTS: 3"
4. User clicks on "CONTACTS" relationship item
5. System opens Contacts sub-panel below Relationships section
6. System displays table with 3 related contacts
7. User reviews contact information (Name, Account, Role, Email, Phone)
8. User clicks "Create" in Actions dropdown to add new contact
9. System navigates to Create Contact page

**Entry Point**: Opportunity detail page
**Exit Point**: Create Contact page (or stays on detail page if viewing only)

### Flow 7: Navigate Using Recently Viewed

**Description**: User quickly accesses a recently viewed opportunity.

**Steps**:
1. User clicks "Opportunities" in navigation
2. User clicks "Recently Viewed" from dropdown
3. System displays sub-menu with list of recently viewed opportunities
4. User clicks on an opportunity name (e.g., "Kaos Trading Ltd...")
5. System navigates to that opportunity's detail page

**Entry Point**: Navigation dropdown menu
**Exit Point**: Opportunity detail page

### Flow 8: Select User from Lookup Modal

**Description**: User selects a user from lookup modal when assigning opportunity.

**Steps**:
1. User is on Create Opportunity or Edit Opportunity page
2. User clicks dropdown arrow (↓) on "ASSIGNED TO" field
3. System opens lookup modal titled "Basic Filter"
4. System displays table with user records (Name, Username, Job Title, Department, Email, Phone)
5. User reviews list of users
6. User can sort by clicking column headers (optional)
7. User can navigate pages using pagination if more than one page (optional)
8. User clicks on a user row (e.g., "Chris Olliver")
9. System highlights selected row
10. System populates "ASSIGNED TO" field with selected user value
11. System closes lookup modal
12. User sees selected user value in the "ASSIGNED TO" field

**Entry Point**: Create/Edit Opportunity form
**Exit Point**: Same form with selected value populated

---

## Error Handling

### Error Scenarios

- **ERR-FE-001**: When API request fails, system MUST display error message to user
  - **Display**: Toast notification or inline error message
  - **Content**: User-friendly error message with actionable guidance
  - **Recovery**: Provide retry option if applicable

- **ERR-FE-002**: When opportunity not found, system MUST display 404 page or error message
  - **Display**: "Opportunity not found" message
  - **Action**: Provide link to return to opportunities list

- **ERR-FE-003**: When form validation fails, system MUST display field-specific error messages
  - **Display**: Inline error messages below or next to invalid fields
  - **Content**: Clear explanation of validation error
  - **Prevention**: Prevent form submission until errors resolved

- **ERR-FE-004**: When import file is invalid, system MUST display error message
  - **Display**: Error message on import page
  - **Content**: Explanation of file validation failure
  - **Recovery**: Allow user to select different file

- **ERR-FE-005**: When import processing fails, system MUST display error details
  - **Display**: Error information in import results
  - **Content**: List of failed rows with error messages
  - **Recovery**: Allow user to review and retry failed rows

- **ERR-FE-006**: When user lacks permission to perform action, system MUST display permission error
  - **Display**: Error message or disabled action
  - **Content**: Clear message about permission restriction
  - **Prevention**: Hide or disable unauthorized actions

### Error Display

- **ERR-FE-010**: System MUST display errors using toast notifications for API errors
  - **Position**: Top-right corner or appropriate location
  - **Duration**: Auto-dismiss after 5 seconds or manual dismiss
  - **Style**: Error styling (red/orange) to indicate error

- **ERR-FE-011**: System MUST display inline validation errors for form fields
  - **Position**: Below or next to invalid field
  - **Style**: Red text, clear error icon
  - **Persistence**: Error remains until field is corrected

- **ERR-FE-012**: System MUST provide error recovery options
  - **Retry**: Retry button for failed API requests
  - **Cancel**: Cancel button to abort operation
  - **Go Back**: Navigation option to return to previous state

---

## Success Criteria

- **SC-FE-001**: All opportunity pages load within 2 seconds
- **SC-FE-002**: Users can create an opportunity in under 3 minutes from navigation
- **SC-FE-003**: All functional requirements are implemented and tested
- **SC-FE-004**: 90% of users successfully complete opportunity creation on first attempt
- **SC-FE-005**: Import process completes successfully for files up to 10MB
- **SC-FE-006**: Table sorting and filtering respond within 200ms
- **SC-FE-007**: All dropdown fields are populated with values from backend
- **SC-FE-008**: Form validation errors are clear and actionable
- **SC-FE-009**: All user interactions provide appropriate visual feedback

---

## Notes

- Reference `product-info/product-overview.md` for system roles and common functionalities
- Reference `specs/opportunity/frontend-specs.md` for technical implementation details
- Use Shadcn UI components from `src/components/ui` when possible
- Follow frontend structure guidelines in `.cursor/rules/frontend-structure.mdc`
- Mark unclear requirements with `[NEEDS CLARIFICATION: description]`
- All dates should be displayed in user's locale format
- Currency amounts should be formatted based on currency code
- All API errors should be handled gracefully with user-friendly messages


