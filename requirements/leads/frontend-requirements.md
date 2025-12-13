# Frontend Requirements - Leads Module

**Module**: Leads  
**Created**: 2025-12-12  
**Status**: Draft  
**Last Updated**: 2025-01-XX  
**Derived From**: User Requirements Gathering Session and UI Screenshots

## Overview

The Leads module manages unqualified contacts, typically generated from marketing events (e.g., website forms, trade shows). A Lead represents a person whose buying authority is not yet established. The module provides functionality to create, view, import, and convert leads.

**System Roles Used:**
- **Sales User**: Full access to Create, Edit, View, and Import Leads. Access to personal and assigned leads.
- **Sales Manager/Admin**: Full access including bulk operations (Delete, Export) and column configuration.

**Common Functionalities Used:**
- **List View**: Sortable columns, Pagination, Bulk Actions, Quick Filters.
- **Import Wizard**: 5-step process for bulk data entry.
- **Activity Stream**: History and Activities sub-panels.
- **Quick Actions**: Click-to-call, Email composition, add tasks, Schedule meeting

**Integration Points:**
- **Backend API**: REST endpoints for Leads CRUD operations (`/api/v8/module/Leads`).
- **Email Service**: For sending emails via the Compose Modal.
- **VCard Service**: For vCard generation and import.

---

## Clarifications

### Session 2025-01-XX

- **Q: What is the exact functionality and UI of the "Insights" feature? What analytics are displayed?** → **A: Toggles a collapsible sidebar panel showing donut charts by Status, total counts, and quick stats (New, Converted, Dead counts)**
- **Q: What are the different lead statuses and their workflow transitions?** → **A: Statuses: New, Assigned, In Process, Converted, Recycled, Dead. All statuses are independent - any can transition to any other based on user action**
- **Q: What is the exact route for the home page after login?** → **A: `/home`**
- **Q: What is the behavior of the global search bar? Does it search across all modules or just Leads?** → **A: Searches across all modules (Leads, Accounts, Contacts, Opportunities, etc.) and displays results in a dropdown with categorized results**
- **Q: How are saved filters managed? Can users rename, delete, or share saved filters?** → **A: Users can save, load, rename, and delete their own saved filters. Filters are user-specific (not shared)**
- **Q: What are the dropdown options for each module in the main navigation bar (Leads, Accounts, Contacts, etc.)?** → **A: Common options for each module: "Create [Module]", "View All [Module]", "Import [Module]". Additional module-specific options can be added per module**
- **Q: What sub-actions are available for each module when hovering over the navigation tabs?** → **A: Hover shows both common actions (Create, View All, Import) and Recently Viewed items for that module**
- **Q: What options are available in the user profile dropdown menu?** → **A: User name (displayed prominently), Edit Profile, Employees, Community Forum, About, Logout**

---

## Functional Requirements

### User Interface

- **FR-FE-001**: System MUST display the Application Header with SuiteCRM branding
  - **Branding**: "SuiteCRM" logo and text displayed on the top left
  - **Position**: Top-left corner of the application header
  - **Style**: Prominently visible branding element

- **FR-FE-002**: System MUST display the Main Navigation Menu Bar
  - **Modules**: Leads, Accounts, Contacts, Opportunities, Quotes, Calendar, Documents, and "More"
  - **Active State**: Currently selected module (Leads) MUST be highlighted
  - **Dropdown Indicators**: Each module MUST display a dropdown arrow indicating sub-menus
  - **Hover Behavior**: On hover, system MUST display sub-actions dropdown for that module
  - **Position**: Horizontal menu bar below the application branding

- **FR-FE-003**: System MUST provide Global Actions/Utilities in the header
  - **Create Button**: `+` icon button for creating new records (e.g., "Create Lead")
  - **History Button**: Clock icon button that shows recently viewed records on hover
  - **Global Search**: Search bar with placeholder "Search..." and magnifying glass icon
    - **Search Scope**: Searches across all modules (Leads, Accounts, Contacts, Opportunities, etc.)
    - **Results Display**: Displays results in a dropdown with categorized results by module
    - **Behavior**: As user types, dropdown shows matching results grouped by module type
  - **Notifications**: Bell icon for notifications
  - **User Profile**: User profile icon for accessing user menu
    - **Dropdown Menu Options**:
      - User name (displayed prominently in bold, purple font)
      - Edit Profile
      - Employees
      - Community Forum
      - About
      - Logout
    - **Menu Structure**: Options are separated by horizontal divider lines into sections (User Info, Navigation Links, Session Management)
  - **Position**: Right side of the application header
  - **History Hover**: On hovering over History button, system MUST display dropdown list of recently viewed records

- **FR-FE-004**: System MUST provide "Recently Viewed" dropdown when hovering on Leads tab
  - **Trigger**: Hover over "Leads" module tab in navigation bar
  - **Content**: Dropdown list showing:
    - Common sub-actions (Create Lead, View All Leads, Import Leads)
    - Recently viewed lead records with icons
    - May include sections for LEADS, CONTACTS, ACCOUNTS, CALLS with respective icons
  - **Behavior**: Clicking a record navigates to its Detail View. Clicking a sub-action performs that action

- **FR-FE-005**: System MUST provide a responsive layout adapting to tablet and desktop viewports
  - **Desktop**: Full layout with all navigation and features visible
  - **Tablet**: Adapted layout maintaining core functionality
  - **Mobile**: Responsive design considerations

### Pages/Routes

- **FR-FE-010**: System MUST provide **Leads List View**
  - **Route**: `/#/leads`
  - **Access**: Private (Authenticated Users)
  - **Components**: 
    - Module Title ("LEADS" heading)
    - List View Controls (Filter, Insights buttons)
    - Filter Panel (Expandable section on same page)
    - Pagination Controls
    - Bulk Action Bar (Checkbox, Bulk Action dropdown, Choose Columns button)
    - Data Table (Sortable headers, Row actions, Scrollable content)
    - Sidebar (Quick Charts) - Optional
  - **Features**: 
    - Server-side Pagination
    - Column Chooser (Drag-and-drop column selection modal)
    - Quick Row Actions (Call, Email, Calendar/Meeting, Add Task)
    - Sortable columns
    - Row selection (individual and bulk)
    - Clickable links for Name, Phone, Email, User fields
    - Filter functionality with save capability

- **FR-FE-011**: System MUST provide **Create/Edit Lead View**
  - **Route**: `/#/leads/create` (Create) | `/#/leads/record/[id]/edit` (Edit)
  - **Access**: Private
  - **Components**: 
    - Header Actions (Save, Cancel, Save & Continue).
    - Tabbed Form (Overview, More Info, Other).
  - **Features**: 
    - Field validation (Required fields).
    - Dynamic dropdowns (Dependent fields).

- **FR-FE-012**: System MUST provide **Lead Detail View**
  - **Route**: `/#/leads/record/[id]`
  - **Access**: Private
  - **Components**: 
    - Header (Back button, Actions, Favorite Star).
    - Lead Form (Same form as Create/Edit Lead, displayed in read-only mode by default).
    - Relationships Panel (Activities, History, Documents, Contacts).
    - Insights Sidebar.
  - **Features**: 
    - Form opens in read-only mode by default
    - Inline Edit triggers (pencil icons) to switch to edit mode
    - Edit mode uses same form structure as Create Lead
    - Sub-panel expansion/collapse

- **FR-FE-013**: System MUST provide **Import Leads Wizard**
  - **Route**: `/#/import/step1?import_module=Leads`
  - **Components**: Stepper (5 Steps), File Uploader, Mapping Grid, Result Summary.

### User Interactions

- **FR-FE-020**: Users MUST be able to **Navigate to Lead Detail View**
  - **Trigger**: Click on lead name (hyperlinked text) in the table
  - **Feedback**: Name appears as clickable link (red text color)
  - **Result**: Navigates to Lead Detail View at route `/#/leads/record/{id}`
  - **Hover Behavior**: Hovering over name shows URL preview
  - **Detail View**: Displays the same form structure as Create/Edit Lead, opened in read-only mode by default
  - **Edit Mode**: User can switch to edit mode using inline edit triggers (pencil icons) to modify fields

- **FR-FE-021**: Users MUST be able to **Initiate Phone Call**
  - **Trigger**: Click on phone number link or Phone icon in row actions
  - **Feedback**: Phone number appears as clickable link (red text color)
  - **Result**: 
    - Phone number link: Opens call options or initiates call
    - Phone icon: Redirects to Create Call form with lead pre-selected

- **FR-FE-022**: Users MUST be able to **Compose Email**
  - **Trigger**: Click on email address link or Envelope icon in row actions
  - **Feedback**: Email address appears as clickable link (red text color)
  - **Result**: 
    - Email link: Opens email client or Email Compose Modal
    - Envelope icon: Opens "New Email" modal overlay with recipient pre-filled

- **FR-FE-023**: Users MUST be able to **Schedule Activity**
  - **Trigger**: Click Calendar icon in row actions
  - **Feedback**: Calendar icon is visible in row actions column
  - **Result**: Redirects to Create Meeting form with lead pre-selected

- **FR-FE-024**: Users MUST be able to **Add Task**
  - **Trigger**: Click Add Task icon (two small horizontal lines icon) in row actions
  - **Feedback**: Add Task icon is visible in row actions column
  - **Result**: Redirects to Create Task form with lead pre-selected

- **FR-FE-025**: Users MUST be able to **Select Individual Leads**
  - **Trigger**: Click checkbox on the left side of a lead row
  - **Feedback**: Checkbox becomes checked, row may be highlighted
  - **Result**: Lead is selected for bulk operations

- **FR-FE-026**: Users MUST be able to **Select All Visible Leads**
  - **Trigger**: Click checkbox in table header
  - **Feedback**: All visible lead checkboxes become checked
  - **Result**: All visible leads are selected for bulk operations

- **FR-FE-027**: Users MUST be able to **Perform Bulk Actions**
  - **Trigger**: Click "Bulk Action" dropdown button after selecting one or more leads
  - **Feedback**: Dropdown menu opens with available bulk actions
  - **Result**: Selected action is applied to all selected leads
  - **Actions**: 
    - Add To Target List
    - Print as PDF
    - Delete
    - Export
    - Merge
    - Mass Update

- **FR-FE-028**: Users MUST be able to **Choose Columns**
  - **Trigger**: Click "Choose Columns" button (icon button) in bulk action bar
  - **Feedback**: Modal/popup opens with column chooser interface
  - **Result**: 
    - Modal displays two sections: "Displayed Columns" and "Available Columns"
    - Users can drag and drop column names between sections
    - Columns dragged to "Displayed" section become visible in the table
    - "Save Changes" button applies column configuration
    - "Close" button dismisses modal without saving

- **FR-FE-029**: Users MUST be able to **Filter Leads**
  - **Trigger**: Click "Filter" button in list view controls
  - **Feedback**: Filter panel expands on the same page (below module title)
  - **Result**: 
    - Filter panel displays input fields and dropdowns for filtering criteria
    - Available filter fields include: First Name, Last Name, Account Name, Any Email, Any Address, Country, Any Phone, City, State/Region, Status, Lead Source, Assigned to
    - Checkboxes available: My Items, Open Items, My Favorites
    - Users can apply filters using "Search" button
    - Users can clear filters using "Clear" button
    - Users can save specific filter configurations using "Save" button for future use
    - **Saved Filter Management**: 
      - Users can save, load, rename, and delete their own saved filters
      - Filters are user-specific (not shared with other users)
      - Users can select a saved filter from a dropdown to load and apply it

- **FR-FE-030**: Users MUST be able to **View Insights**
  - **Trigger**: Click "Insights" button in list view controls
  - **Feedback**: Collapsible sidebar panel toggles open/closed
  - **Result**: 
    - Displays donut charts showing leads by Status
    - Shows total counts for each status category
    - Displays quick stats (New, Converted, Dead counts)
    - Panel can be collapsed/expanded

- **FR-FE-031**: Users MUST be able to **Sort by Column**
  - **Trigger**: Click on sortable column header (indicated by up/down arrows)
  - **Feedback**: Column header shows sort direction indicator
  - **Result**: Table rows are sorted by selected column (ascending/descending)

- **FR-FE-032**: Users MUST be able to **Navigate Pages**
  - **Trigger**: Click pagination buttons (`<<`, `<`, `>`, `>>`)
  - **Feedback**: Current page range is displayed (e.g., "1 - 20 of 206")
  - **Result**: Table displays different page of leads

- **FR-FE-033**: Users MUST be able to **View User Details**
  - **Trigger**: Click on user name link in "User" column
  - **Feedback**: User name appears as clickable link (red text color)
  - **Result**: Navigates to user detail view or profile

- **FR-FE-034**: Users MUST be able to **Customize Columns** (See FR-FE-028 for detailed specification)
  - **Trigger**: Click "Choose Columns" button in bulk action bar
  - **Feedback**: Column chooser modal opens with drag-and-drop interface
  - **Result**: Data table updates columns immediately upon Save Changes

- **FR-FE-035**: Users MUST be able to **Access Module Sub-Actions**
  - **Trigger**: Hover over navigation menu item (e.g., "Leads", "Accounts")
  - **Feedback**: Dropdown menu appears showing sub-actions and recently viewed items for that module
  - **Result**: User can click sub-action to navigate or perform action
  - **Dropdown Content** (shown on hover):
    - **Common Sub-Actions** (available for all modules):
      - Create [Module] (e.g., "Create Lead", "Create Account")
      - View All [Module] (e.g., "View All Leads", "View All Accounts")
      - Import [Module] (e.g., "Import Leads", "Import Accounts")
    - **Recently Viewed Items**: List of recently viewed records for that module (with icons)
    - **Module-Specific Sub-Actions**: Additional options may be added per module based on module requirements

### Forms & Input

- **FR-FE-036**: System MUST provide **Lead Form Configuration**
  - **Fields**:
    - **Overview**: First Name (Salutation), Last Name (Req), Account Name, Title, Dept, Phone (Office/Mobile/Fax), Email (Multi-entry), Address (Primary/Alt).
    - **More Info**: Status (Dropdown), Status Desc, Opportunity Amount, Campaign, Source, Referred By, Do Not Call.
    - **Other**: System Timestamps (Created/Modified).
  - **Validation**: 
    - Last Name is mandatory.
    - Email format validation.
  - **Submission**: 
    - Save: Persist and redirect to Detail.
    - Save & Continue: Persist and stay on Edit.

### Data Display

- **FR-FE-040**: System MUST display **Leads List Table**
  - **Table Structure**: 
    - Header row with sortable column headers
    - Checkbox column for selection
    - Data columns: Name, Status, Account Name, Office Phone, Email, User
    - Row actions column (Phone, Calendar, Envelope, Add Task icons)
  - **Row Actions Icons**: 
    - Phone icon: Initiates call or opens call form
    - Calendar icon: Schedules meeting or activity
    - Envelope icon: Opens email compose modal
    - Add Task icon: Two small horizontal lines icon for adding tasks
  - **Scrollable**: Vertical scrollbar when content exceeds viewport
  - **Row Count**: Displays multiple lead records (e.g., 15-20 visible rows per page)

- **FR-FE-041**: System MUST display **Lead Name Column**
  - **Format**: Hyperlinked text (red color) showing lead name
  - **Content**: Full name with salutation (e.g., "Ms. Sk efjwe", "Mr. Venkat Sai", "Alexis Marcial")
  - **Behavior**: Clickable, navigates to Lead Detail View
  - **Hover**: Shows URL preview (e.g., `https://suite8demo.suiteondemand.com/#/leads/record/{id}`)

- **FR-FE-042**: System MUST display **Lead Status Column**
  - **Format**: Text badges/labels
  - **Values**: New, Assigned, In Process, Converted, Recycled, Dead
  - **Color Coding**: Optional (based on theme)
  - **Sortable**: Column header supports sorting
  - **Status Transitions**: All statuses are independent - any status can transition to any other status based on user action (no workflow restrictions)

- **FR-FE-043**: System MUST display **Account Name Column**
  - **Format**: Text field, may be blank
  - **Content**: Account name (e.g., "Venkat sai", "Spend Thrift Inc", "Sunyvale Reporting Ltd")
  - **Sortable**: Column header supports sorting

- **FR-FE-044**: System MUST display **Office Phone Column**
  - **Format**: Hyperlinked text (red color) showing phone number
  - **Content**: Formatted phone number (e.g., "(267) 605-2128")
  - **Behavior**: Clickable, initiates call or opens call options
  - **Sortable**: Column header supports sorting

- **FR-FE-045**: System MUST display **Email Column**
  - **Format**: Hyperlinked text (red color) showing email address
  - **Content**: Email address (e.g., "qa.vegan@example.cn")
  - **Behavior**: Clickable, opens email client or Email Compose Modal
  - **Sortable**: Column header supports sorting

- **FR-FE-046**: System MUST display **User Column**
  - **Format**: Hyperlinked text (red color) showing user name
  - **Content**: User name (e.g., "Will Westin", "Sally Bronsen")
  - **Behavior**: Clickable, navigates to user detail view
  - **Sortable**: Column header supports sorting

- **FR-FE-047**: System MUST display **Pagination Information**
  - **Format**: Text display showing current range and total (e.g., "1 - 20 of 206")
  - **Position**: Above or below the table
  - **Controls**: First (`<<`), Previous (`<`), Next (`>`), Last (`>>`) buttons
  - **Behavior**: Clicking buttons navigates to respective page

- **FR-FE-048**: System MUST display **Row Action Icons**
  - **Phone Icon**: Initiates call or opens call form
  - **Calendar Icon**: Schedules meeting or activity
  - **Envelope Icon**: Opens email compose modal
  - **Add Task Icon**: Two small horizontal lines icon for adding tasks
  - **Position**: Rightmost column in each row
  - **Visibility**: Always visible or on row hover

- **FR-FE-049**: System MUST display **Insights & Charts**
  - **Components**: 
    - Donut Charts showing leads by Status
    - Total counts for each status category
    - Quick stats (New, Converted, Dead counts)
  - **Location**: Collapsible Sidebar in List and Detail views
  - **Visibility**: Toggleable via "Insights" button - panel expands/collapses
  - **Behavior**: Clicking "Insights" button toggles the sidebar panel visibility

### Navigation & Routing

- **FR-FE-070**: System MUST provide **Deep Linking**
  - All Lead records MUST be accessible via unique URLs with ID (e.g., `/#/leads/record/{id}`)
  - Lead names in list view MUST show URL preview on hover

- **FR-FE-071**: System MUST preserve **Pagination State**
  - Returning to List View from Detail View should retain page number and sort order
  - Pagination controls MUST reflect current page state

- **FR-FE-072**: System MUST redirect authenticated users to home page after login
  - **Route**: `/home`
  - **Behavior**: After successful login, user is redirected to `/home`
  - **Home Page**: Contains navigation task bar at the top

- **FR-FE-073**: System MUST provide **Module Navigation with Sub-Actions**
  - **Navigation Bar**: Top navigation task bar with module tabs
  - **Hover Behavior**: On hovering over a module tab, system MUST display sub-actions dropdown
  - **Modules**: Leads, Accounts, Contacts, Opportunities, Quotes, Calendar, Documents, More
  - **Sub-Actions**: Each module tab shows relevant sub-actions on hover

---

## UI Components

### Application Header

**Description**: Global application header containing branding, navigation, and utility actions.

**Components**:
- SuiteCRM branding (logo and text)
- Main navigation menu bar
- Global action buttons (Create, History, Search, Notifications, User Profile)

**Styling**:
- Fixed position at top of application
- Horizontal layout with branding on left, actions on right
- Uses consistent header styling across all modules

### Main Navigation Menu

**Description**: Horizontal navigation bar with module tabs and sub-action dropdowns.

**Props**:
- `activeModule` (string): Currently selected module name
- `modules` (array): Array of module objects with name and sub-actions

**Usage**:
- Displayed in application header
- Each module tab shows dropdown arrow indicating sub-menus
- Active module is highlighted

**Behavior**:
- Hover over module tab displays sub-actions dropdown
- Click on module tab navigates to module list view
- Click on sub-action performs specific action or navigation

**Styling**:
- Horizontal menu bar
- Active module highlighted
- Dropdown arrows visible on each tab

### Leads List View Table

**Description**: Data table displaying lead records with sortable columns and row actions.

**Props**:
- `leads` (array): Array of lead record objects
- `columns` (array): Array of column configuration objects
- `pagination` (object): Pagination state and controls
- `onRowClick` (function): Handler for row click events
- `onSort` (function): Handler for column sort events

**Usage**:
- Primary component in Leads List View page
- Displays lead data in tabular format

**Features**:
- Sortable column headers
- Row selection checkboxes
- Row action icons (Phone, Calendar, Envelope, Add Task)
- Clickable links for Name, Phone, Email, User fields
- Scrollable content area

**Styling**:
- Table with alternating row colors (optional)
- Hyperlinked text in red color
- Icons aligned in action column
- Responsive column widths

### Pagination Controls

**Description**: Controls for navigating through paginated lead records.

**Props**:
- `currentPage` (number): Current page number
- `pageSize` (number): Number of records per page
- `totalRecords` (number): Total number of records
- `onPageChange` (function): Handler for page navigation

**Usage**:
- Displayed above or below the leads table
- Shows current range and total (e.g., "1 - 20 of 206")

**Components**:
- First page button (`<<`)
- Previous page button (`<`)
- Page range display
- Next page button (`>`)
- Last page button (`>>`)

**Styling**:
- Button group layout
- Disabled state for first/last page when applicable

### Bulk Action Bar

**Description**: Toolbar for performing actions on multiple selected leads.

**Props**:
- `selectedCount` (number): Number of selected leads
- `actions` (array): Array of available bulk actions
- `onAction` (function): Handler for bulk action execution

**Usage**:
- Displayed when one or more leads are selected
- Contains bulk action dropdown button

**Components**:
- Select all checkbox
- Bulk action dropdown button
- Choose Columns button (opens column chooser modal)

**Styling**:
- Horizontal toolbar layout
- Visible when selections are made

### Row Action Icons

**Description**: Icon buttons for quick actions on individual lead rows.

**Props**:
- `leadId` (string): ID of the lead record
- `onCall` (function): Handler for phone call action
- `onCalendar` (function): Handler for calendar/meeting action
- `onEmail` (function): Handler for email action

**Usage**:
- Displayed in rightmost column of each table row
- Provides quick access to common actions

**Icons**:
- Phone icon: Initiates call
- Calendar icon: Schedules meeting
- Envelope icon: Composes email
- Add Task icon: Two small horizontal lines icon for adding tasks

**Styling**:
- Icon buttons aligned horizontally
- Hover state for interactivity
- Consistent icon sizing

### Column Chooser Modal

**Description**: Modal/popup for customizing visible columns in the Leads list view table.

**Props**:
- `displayedColumns` (array): Array of currently displayed column names
- `availableColumns` (array): Array of available but hidden column names
- `onSave` (function): Handler for saving column configuration
- `onClose` (function): Handler for closing modal without saving

**Usage**:
- Triggered from Leads List View by clicking "Choose Columns" button in bulk action bar
- Allows drag-and-drop functionality to move columns between sections

**Features**:
- Two sections: "Displayed Columns" (left) and "Available Columns" (right)
- Drag-and-drop interface for moving columns
- "Save Changes" button to apply configuration
- "Close" button to dismiss without saving

**Styling**:
- Modal overlay with white background
- Columns displayed as colored buttons/tags (purple for displayed, red for available)
- Clear visual distinction between sections

### Filter Panel

**Description**: Expandable panel for filtering lead records in the list view.

**Props**:
- `filters` (object): Current filter values
- `savedFilters` (array): Array of saved filter configurations
- `onFilter` (function): Handler for applying filters
- `onClear` (function): Handler for clearing all filters
- `onSave` (function): Handler for saving current filter configuration

**Usage**:
- Displayed on Leads List View page when "Filter" button is clicked
- Expands below module title on the same page

**Features**:
- Text input fields: First Name, Last Name, Account Name, Any Email, Any Address, Country, Any Phone, City, State/Region
- Dropdown selectors: Status, Lead Source, Assigned to
- Checkboxes: My Items, Open Items, My Favorites
- Action buttons: Clear, Search, Save
- Save functionality for reusing filter configurations

**Styling**:
- White panel with clear labels
- Grid-like layout for input fields
- Action buttons aligned at bottom right

### Email Compose Modal

**Description**: A global overlay for composing emails without leaving the current context.

**Props**:
- `toAddress` (string): Pre-filled recipient.
- `relatedModel` (string): 'Leads'.
- `relatedId` (string): UUID of the lead.

**Usage**:
- Triggered from List View (Email Action Icon) and Detail View (Email Field click).

**Validation**:
- **Discard Dialog**: If closed with dirty state, display "Are you sure you wish to discard this Email?" confirmation.

---

## User Flows

### Flow 1: Import Leads Process

**Description**: Bulk ingestion of lead data from CSV/Excel.

**Steps**:
1. User navigates to **Import Leads**.
2. **Step 1**: User uploads file, selects "Create new records only" or "Create new records and update existing records".
3. **Step 2**: User confirms file properties (Delimiter, Header row).
4. **Step 3**: User maps CSV headers to System Fields (Drag & Drop).
5. **Step 4**: User configures Duplicate Checking criteria.
6. **Step 5**: User reviews Import Results (Success/Error counts).
7. **Exit**: User returns to List View to see new data.

**Entry Point**: Top Menu > Leads> Import Leads.
**Exit Point**: Leads List View.

### Flow 2: Quick Row Actions (List View)

**Description**: Initiating communication or tasks directly from the grid.

**Steps**:
1. User identifies target Lead in List View.
2. User hovers over row (or views Action column).
3. User clicks **Phone Icon** -> Redirects to `Create Call` form with lead pre-selected.
4. OR User clicks **Calendar Icon** -> Redirects to `Create Meeting` form with lead pre-selected.
5. OR User clicks **Envelope Icon** -> Opens `Email Compose Modal` with recipient pre-filled.
6. OR User clicks **Add Task Icon** (two horizontal lines) -> Redirects to `Create Task` form with lead pre-selected.

**Entry Point**: Leads List View.
**Exit Point**: Respective Create Activity Pages or Modal.

### Flow 3: Navigate to Lead Detail from List

**Description**: User clicks on lead name to view detailed information.

**Steps**:
1. User is on Leads List View.
2. User identifies target lead by name.
3. User clicks on lead name (hyperlinked text).
4. System navigates to Lead Detail View at `/#/leads/record/{id}`.
5. System displays Lead Detail View with the same form structure as Create/Edit Lead.
6. Form opens in read-only mode by default, showing all lead fields and relationships.
7. User can click pencil icons (inline edit triggers) to switch to edit mode.
8. In edit mode, user can modify fields using the same form structure as Create Lead.

**Entry Point**: Leads List View.
**Exit Point**: Lead Detail View (read-only or edit mode).

### Flow 4: Filter and Sort Leads

**Description**: User filters and sorts the leads list to find specific records.

**Steps**:
1. User is on Leads List View.
2. User clicks "Filter" button.
3. System expands filter panel on the same page (below module title).
4. User enters filter criteria in input fields (First Name, Last Name, Account Name, etc.).
5. User selects dropdown values (Status, Lead Source, Assigned to).
6. User checks optional checkboxes (My Items, Open Items, My Favorites).
7. User clicks "Search" button to apply filters.
8. System applies filters and updates table with filtered results.
9. User can click "Save" button to save current filter configuration for future use.
10. User can click "Clear" button to remove all filter criteria.
11. User clicks on column header to sort (e.g., Name, Status).
12. System sorts table by selected column.
13. User views filtered and sorted results.

**Entry Point**: Leads List View.
**Exit Point**: Leads List View (filtered/sorted).

### Flow 5: Bulk Actions on Selected Leads

**Description**: User selects multiple leads and performs bulk operations.

**Steps**:
1. User is on Leads List View.
2. User clicks checkbox on one or more lead rows (or selects all).
3. System highlights selected rows and shows selection count (e.g., "Selected: 2").
4. User clicks "Bulk Action" dropdown button.
5. System displays dropdown menu with available bulk actions:
   - Add To Target List
   - Print as PDF
   - Delete
   - Export
   - Merge
   - Mass Update
6. User selects a bulk action from the dropdown.
7. System applies action to all selected leads.
8. System displays success/error feedback.
9. Table refreshes to show updated data.

**Entry Point**: Leads List View.
**Exit Point**: Leads List View (with updated data).

### Flow 7: Customize Columns

**Description**: User customizes which columns are displayed in the Leads list view.

**Steps**:
1. User is on Leads List View.
2. User clicks "Choose Columns" button in the bulk action bar.
3. System opens column chooser modal/popup.
4. Modal displays two sections: "Displayed Columns" (left) and "Available Columns" (right).
5. User drags column names from "Available Columns" to "Displayed Columns" section.
6. User drags column names from "Displayed Columns" to "Available Columns" to hide them.
7. Columns in "Displayed Columns" section will be visible in the table.
8. User clicks "Save Changes" button.
9. System updates table columns immediately.
10. User clicks "Close" button to dismiss modal without saving (if changes not saved).

**Entry Point**: Leads List View.
**Exit Point**: Leads List View (with updated columns).

### Flow 6: Navigate via Module Menu

**Description**: User navigates to Leads module from home page navigation and accesses recently viewed items.

**Steps**:
1. User is on home page after login.
2. User sees navigation task bar at the top with module tabs.
3. User hovers over "Leads" module tab.
4. System displays dropdown menu with "Recently Viewed" section showing recent lead records.
5. Dropdown may also show other categories (LEADS, CONTACTS, ACCOUNTS, CALLS) with icons.
6. User clicks on "Leads" tab to navigate to Leads List View.
7. OR User clicks on a recently viewed lead record to navigate directly to its Detail View.

**Entry Point**: Home page.
**Exit Point**: Leads List View or Lead Detail View.

---

### Error Scenarios

- **ERR-FE-001**: When **Import Fails**, system MUST display a downloadable error log for specific rows.
- **ERR-FE-002**: When **Mandatory Field Missing**, system MUST highlight the field in red and disable Save.
- **ERR-FE-003**: When **API Request Fails** in List View, system MUST display error message and allow retry.
- **ERR-FE-004**: When **Pagination Fails** (invalid page number), system MUST redirect to first page or display error.
- **ERR-FE-005**: When **Bulk Action Fails** on selected leads, system MUST display which leads failed and why.
- **ERR-FE-006**: When **Sort Fails** on a column, system MUST revert to previous sort state and display error.

### Error Display

- **ERR-FE-010**: System MUST display API errors in **Toast Notifications** (Top Right).
- **ERR-FE-011**: System MUST display validation errors inline for form fields.
- **ERR-FE-012**: System MUST display error messages in user-friendly format (avoid technical jargon).

---

## Success Criteria

- **SC-FE-001**: Users can import a CSV of 100 leads in under 2 minutes (UI interaction time).
- **SC-FE-002**: Email Compose modal opens within 500ms of click.
- **SC-FE-003**: All Quick Action icons (Phone, Calendar, Envelope, Add Task) correctly redirect to their respective Create pages or modals with the Lead pre-selected.
- **SC-FE-004**: Leads List View loads within 2 seconds on standard broadband connection.
- **SC-FE-005**: Clicking on lead name navigates to Detail View within 500ms.
- **SC-FE-006**: Sorting and filtering operations complete within 1 second.
- **SC-FE-007**: Pagination controls respond to clicks within 300ms.
- **SC-FE-008**: Module navigation with hover sub-actions displays dropdown within 200ms.
- **SC-FE-009**: All hyperlinked fields (Name, Phone, Email, User) are clearly identifiable as clickable.
- **SC-FE-010**: Bulk actions can be performed on up to 100 selected leads without performance degradation.

---

## Notes

- Reference `product-info/product-overview.md` for system roles and common functionalities
- Reference `specs/[module-name]/frontend-specs.md` for technical implementation details
- Use Shadcn UI components from `src/components/ui` when possible
- Follow frontend structure guidelines in `.cursor/rules/frontend-structure.mdc`
- Mark unclear requirements with `[NEEDS CLARIFICATION: description]`
- All hyperlinked text in the table should use red color for consistency
- Row action icons should be visible on row hover or always visible based on design requirements
- Navigation menu sub-actions should appear on hover with smooth transitions
