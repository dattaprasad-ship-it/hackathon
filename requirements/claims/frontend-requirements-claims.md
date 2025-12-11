# Frontend Requirements - Claims Module

**Module**: Employee Claims Management  
**Created**: 2025-12-11  
**Status**: Draft  
**Derived From**: OrangeHRM Legacy System Analysis

## Overview

The Claims Module enables employees and managers to manage expense claims within the organization. It provides functionality to search, view, create, assign, and submit expense claims with supporting documentation. The module handles various types of expenses (travel, accommodation, meals, etc.) across multiple currencies and tracks claim status from initiation through approval and payment.

**System Roles Used:**
- **Admin/Manager**: Full access to view all employee claims, assign claims to employees, search and filter claims
- **Employee**: Can view own claims, submit claims (via "My Claims" tab)
- **HR Staff**: Can view and manage employee claims, process submissions

**Common Functionalities Used:**
- **Authentication**: User login and session management
- **Authorization**: Role-based access control for claim operations
- **File Upload**: Attachment management for claim supporting documents (max 1MB)
- **Data Export**: Generate claim reports
- **Notifications**: Success/error feedback messages

**Dependencies:**
- Authentication Module (Login/Session Management)
- Employee Module (Employee data for autocomplete)
- Configuration Module (Event types, currencies, expense types)

**Integration Points:**
- Backend Claims API (`/api/claim/*`)
- Employee API for autocomplete suggestions
- File Upload API for attachments
- Currency/Configuration API for dropdown options

---

## Functional Requirements

### User Interface

- **FR-FE-001**: System MUST display an orange-themed navigation bar with OrangeHRM branding, module name ("Claim"), Upgrade button, user profile avatar, and username dropdown
- **FR-FE-002**: System MUST provide a left sidebar with navigation links to all main modules (Search, Admin, PIM, Leave, Time, Recruitment, My Info, Performance, Dashboard, Directory, Maintenance, Claim, Buzz)
- **FR-FE-003**: System MUST highlight the active module ("Claim") in the sidebar with orange background color
- **FR-FE-004**: System MUST display a horizontal tab navigation with: Configuration, Submit Claim, My Claims, Employee Claims, Assign Claim
- **FR-FE-005**: System MUST highlight the active tab with orange underline/background
- **FR-FE-006**: System MUST display a help icon (?) in the top-right corner of the content area

### Pages/Routes

- **FR-FE-010**: System MUST provide Employee Claims page
  - **Route**: `/claim/viewAssignClaim`
  - **Access**: Protected (Admin/Manager roles)
  - **Roles**: Admin, Manager, HR Staff
  - **Components**: Search filters, data table, action buttons
  - **Features**: Search/filter claims, view claim list, assign new claims, view claim details

- **FR-FE-011**: System MUST provide Assign Claim (Create) page
  - **Route**: `/claim/assignClaim`
  - **Access**: Protected (Admin/Manager roles)
  - **Roles**: Admin, Manager, HR Staff
  - **Components**: Create claim form, cancel/create buttons
  - **Features**: Create new claim request with employee, event, currency selection

- **FR-FE-012**: System MUST provide Assign Claim (View/Edit) page
  - **Route**: `/claim/assignClaim/id/{claimId}`
  - **Access**: Protected (Admin/Manager roles)
  - **Roles**: Admin, Manager, HR Staff
  - **Components**: Claim details (read-only), Expenses section, Attachments section, action buttons
  - **Features**: View claim details, add/view expenses, add/view attachments, submit claim

- **FR-FE-013**: System MUST provide Submit Claim page (referenced in tabs)
  - **Route**: `/claim/submitClaim` [NEEDS CLARIFICATION: Not shown in screenshots]
  - **Access**: Protected (Employee role)
  - **Roles**: Employee, Admin
  - **Features**: Submit personal expense claims

- **FR-FE-014**: System MUST provide My Claims page (referenced in tabs)
  - **Route**: `/claim/myClaims` [NEEDS CLARIFICATION: Not shown in screenshots]
  - **Access**: Protected (Employee role)
  - **Roles**: Employee, Admin
  - **Features**: View and manage personal claims

### User Interactions

- **FR-FE-020**: Users MUST be able to search and filter claims
  - **Trigger**: Enter filter criteria and click "Search" button
  - **Feedback**: Table updates with filtered results, displays count "(X) Records Found"
  - **Result**: Data table shows matching claims with all columns populated

- **FR-FE-021**: Users MUST be able to reset search filters
  - **Trigger**: Click "Reset" button
  - **Feedback**: All filter fields clear to default/empty state
  - **Result**: Search form resets, table shows unfiltered results

- **FR-FE-022**: Users MUST be able to view claim details
  - **Trigger**: Click "View Details" link in Actions column
  - **Feedback**: Navigate to claim detail page
  - **Result**: Display full claim information in read-only format

- **FR-FE-023**: Users MUST be able to create new claim assignment
  - **Trigger**: Click "+ Assign Claim" button
  - **Feedback**: Navigate to create claim form
  - **Result**: Empty form displayed for data entry

- **FR-FE-024**: Users MUST be able to add expenses to a claim
  - **Trigger**: Click "+ Add" button in Expenses section
  - **Feedback**: Modal dialog opens with expense form
  - **Result**: Expense form ready for input

- **FR-FE-025**: Users MUST be able to add attachments to a claim
  - **Trigger**: Click "+ Add" button in Attachments section
  - **Feedback**: Modal dialog opens with file upload form
  - **Result**: File upload interface ready

- **FR-FE-026**: Users MUST be able to submit a claim
  - **Trigger**: Click "Submit" button on claim detail page
  - **Feedback**: Success popup message displays temporarily (3-5 seconds)
  - **Result**: Page reloads, Submit button disappears, claim locked in read-only mode

- **FR-FE-027**: Users MUST be able to navigate back to claim list
  - **Trigger**: Click "Back" button
  - **Feedback**: Page navigation
  - **Result**: Return to Employee Claims list page

- **FR-FE-028**: Users MUST be able to cancel form operations
  - **Trigger**: Click "Cancel" button on create form or modal dialogs
  - **Feedback**: Form/modal closes without saving
  - **Result**: Return to previous state, no data persisted

### Forms & Input

- **FR-FE-030**: System MUST provide Employee Claims search form
  - **Fields**: 
    - Employee Name (text input with autocomplete)
    - Reference Id (text input)
    - Event Name (dropdown)
    - Status (dropdown)
    - From Date (date picker, format: yyyy-dd-mm)
    - To Date (date picker, format: yyyy-dd-mm)
    - Include (dropdown: "Current Employees Only" default)
  - **Validation**: Date range validation (From Date ≤ To Date)
  - **Submission**: Triggers table refresh with filtered results

- **FR-FE-031**: System MUST provide Create Claim Request form
  - **Fields**:
    - Employee Name* (required, autocomplete text input with "Type for hints..." placeholder)
    - Event* (required, dropdown with "-- Select --" default)
    - Currency* (required, dropdown with "-- Select --" default)
    - Remarks (optional, textarea, multi-line)
  - **Validation**: 
    - Employee Name: Required, must match existing employee
    - Event: Required, must select from dropdown
    - Currency: Required, must select from dropdown
    - Show red border/text on validation failure
  - **Submission**: POST to API, on success show popup and redirect to claim detail page

- **FR-FE-032**: System MUST provide Add Expense form (modal)
  - **Fields**:
    - Expense Type* (required, dropdown with "-- Select --" default)
    - Date* (required, date picker, format: yyyy-dd-mm)
    - Amount* (required, numeric input)
    - Note (optional, textarea)
  - **Validation**:
    - Expense Type: Required
    - Date: Required, valid date format
    - Amount: Required, numeric, positive value
    - Show red border/text on validation failure
  - **Submission**: Add expense to table, close modal, update total amount

- **FR-FE-033**: System MUST provide Add Attachment form (modal)
  - **Fields**:
    - Select File* (required, file upload with "Browse" button)
    - Comment (optional, textarea with "Type comment here" placeholder)
  - **Validation**:
    - File: Required, must be selected
    - File size: Maximum 1MB
    - Show "Accepts up to 1MB" constraint message
    - Show red border/text on validation failure
  - **Submission**: Upload file to server, add attachment record to table, close modal

- **FR-FE-034**: System MUST validate all required fields with asterisk (*) indicator
- **FR-FE-035**: System MUST display "* Required" note at bottom of forms
- **FR-FE-036**: System MUST provide autocomplete suggestions for Employee Name field based on user input

### Data Display

- **FR-FE-040**: System MUST display Employee Claims data table with columns:
  - Checkbox (for bulk selection)
  - Reference Id (sortable, with sort icon)
  - Employee Name (sortable, with sort icon)
  - Event Name (sortable, with sort icon)
  - Description
  - Currency
  - Submitted Date (sortable, with sort icon, format: YYYY-MM-DD)
  - Status (sortable, with sort icon)
  - Amount (numeric, currency-specific)
  - Actions ("View Details" link)

- **FR-FE-041**: System MUST display record count as "(X) Records Found" above the table

- **FR-FE-042**: System MUST display "No Records Found" message when table is empty

- **FR-FE-043**: System MUST display Expenses data table with columns:
  - Checkbox (for bulk selection)
  - Expense Type
  - Date (format: YYYY-MM-DD)
  - Note
  - Amount (with currency label matching claim currency, e.g., "Amount (Algerian Dinar)")
  - Actions (edit/delete icons) [NEEDS CLARIFICATION: specific actions]

- **FR-FE-044**: System MUST display "Total Amount (Currency) : X.XX" below Expenses table, dynamically calculating sum of all expense amounts in claim currency

- **FR-FE-045**: System MUST display Attachments data table with columns:
  - Checkbox (for bulk selection)
  - File Name
  - Description (from Comment field)
  - Size (file size in KB/MB)
  - Type (file extension/MIME type)
  - Date Added (format: YYYY-MM-DD)
  - Added By (username)
  - Actions (download/delete icons) [NEEDS CLARIFICATION: specific actions]

- **FR-FE-046**: System MUST display claim details in read-only format with light purple/gray background:
  - Employee (full name)
  - Reference Id (auto-generated, format: YYYYMMDDXXXXXXX)
  - Event (event name)
  - Status (current status)
  - Currency (selected currency)
  - Remarks (multi-line text)

- **FR-FE-047**: System MUST display sortable column headers with sort icons (↕) in data tables

- **FR-FE-048**: System MUST support table column sorting (ascending/descending) on click

### State Management

- **FR-FE-050**: System MUST maintain user session state across page navigation
- **FR-FE-051**: System MUST preserve search filter values when navigating back to Employee Claims page
- **FR-FE-052**: System MUST track claim submission state to hide/show Submit button appropriately
- **FR-FE-053**: System MUST maintain form state during validation errors (preserve user input)
- **FR-FE-054**: System MUST clear form state after successful submission
- **FR-FE-055**: System MUST manage modal dialog state (open/closed) for Add Expense and Add Attachment

### API Integration

- **FR-FE-060**: System MUST consume GET /api/claim/viewAssignClaim endpoint
  - **Method**: GET
  - **Query Params**: employeeName, referenceId, eventName, status, fromDate, toDate, include
  - **Response**: Array of claim objects with all table fields
  - **Error Handling**: Display error message if API fails

- **FR-FE-061**: System MUST consume POST /api/claim/assignClaim endpoint
  - **Method**: POST
  - **Request**: { employeeName, event, currency, remarks }
  - **Response**: { claimId, referenceId, status: "Initiated" }
  - **Error Handling**: Display validation errors inline on form fields

- **FR-FE-062**: System MUST consume GET /api/claim/assignClaim/{id} endpoint
  - **Method**: GET
  - **Response**: { claim details, expenses: [], attachments: [] }
  - **Error Handling**: Display error page if claim not found

- **FR-FE-063**: System MUST consume POST /api/claim/expense endpoint
  - **Method**: POST
  - **Request**: { claimId, expenseType, date, amount, note }
  - **Response**: { expenseId, success: true }
  - **Error Handling**: Display validation errors in modal

- **FR-FE-064**: System MUST consume POST /api/claim/attachment endpoint
  - **Method**: POST (multipart/form-data)
  - **Request**: { claimId, file, comment }
  - **Response**: { attachmentId, fileName, fileSize, fileType, success: true }
  - **Error Handling**: Display file size error if > 1MB

- **FR-FE-065**: System MUST consume PUT /api/claim/submit/{id} endpoint
  - **Method**: PUT
  - **Response**: { success: true, status: "Submitted" }
  - **Error Handling**: Display error message if submission fails

- **FR-FE-066**: System MUST consume GET /api/employee/autocomplete endpoint
  - **Method**: GET
  - **Query Params**: query (search term)
  - **Response**: Array of employee names matching search
  - **Error Handling**: Show empty autocomplete list if API fails

- **FR-FE-067**: System MUST consume GET /api/configuration/events endpoint
  - **Method**: GET
  - **Response**: Array of event types for dropdown
  - **Error Handling**: Display error if configuration cannot be loaded

- **FR-FE-068**: System MUST consume GET /api/configuration/currencies endpoint
  - **Method**: GET
  - **Response**: Array of currencies for dropdown
  - **Error Handling**: Display error if configuration cannot be loaded

- **FR-FE-069**: System MUST consume GET /api/configuration/expenseTypes endpoint
  - **Method**: GET
  - **Response**: Array of expense types for dropdown
  - **Error Handling**: Display error if configuration cannot be loaded

### Navigation & Routing

- **FR-FE-070**: System MUST provide tab-based navigation between claim sections (Configuration, Submit Claim, My Claims, Employee Claims, Assign Claim)
- **FR-FE-071**: System MUST protect all claim routes requiring authentication
- **FR-FE-072**: System MUST redirect unauthorized users to login page
- **FR-FE-073**: System MUST restrict Employee Claims and Assign Claim pages to Admin/Manager roles only
- **FR-FE-074**: System MUST highlight active tab with orange styling
- **FR-FE-075**: System MUST provide breadcrumb or back navigation to return to claim list from detail pages

---

## Non-Functional Requirements

### User Experience

- **NFR-FE-001**: System MUST provide loading indicators during API calls (search, create, submit operations)
- **NFR-FE-002**: System MUST display success messages as temporary popups (3-5 seconds duration) with auto-dismiss
- **NFR-FE-003**: System MUST display error messages inline for form validation errors with red text and borders
- **NFR-FE-004**: System MUST provide visual feedback for button hover states (color change)
- **NFR-FE-005**: System MUST disable Submit button after successful submission to prevent duplicate submissions
- **NFR-FE-006**: System MUST provide clear visual distinction between editable and read-only fields (light purple/gray background for read-only)
- **NFR-FE-007**: System MUST use modal overlays with dimmed background to focus user attention on modal content
- **NFR-FE-008**: System MUST provide close (X) button on modal dialogs for easy dismissal
- **NFR-FE-009**: System MUST show "Type for hints..." placeholder in autocomplete fields to guide users
- **NFR-FE-010**: System MUST display file size constraints ("Accepts up to 1MB") clearly near file upload fields
- **NFR-FE-011**: System MUST show "No file selected" text in file upload field when no file is chosen

### Performance

- **NFR-FE-012**: System MUST load Employee Claims page within 2 seconds
- **NFR-FE-013**: System MUST return search results within 1 second for typical query size (<1000 records)
- **NFR-FE-014**: System MUST lazy load autocomplete suggestions (debounce 300ms on user input)
- **NFR-FE-015**: System MUST optimize table rendering for up to 100 records per page
- **NFR-FE-016**: System MUST implement pagination for result sets exceeding 100 records [NEEDS CLARIFICATION: Pagination not visible in screenshots]
- **NFR-FE-017**: System MUST compress file uploads before sending to server if possible

### Accessibility

- **NFR-FE-020**: System MUST support keyboard navigation (Tab, Enter, Escape keys)
- **NFR-FE-021**: System MUST provide ARIA labels for all interactive elements
- **NFR-FE-022**: System MUST ensure color contrast meets WCAG AA standards (4.5:1 for text)
- **NFR-FE-023**: System MUST provide focus indicators for all focusable elements
- **NFR-FE-024**: System MUST allow form submission via Enter key
- **NFR-FE-025**: System MUST allow modal dismissal via Escape key
- **NFR-FE-026**: System MUST provide descriptive alt text for icons and images
- **NFR-FE-027**: System MUST ensure form labels are properly associated with input fields

### Browser Support

- **NFR-FE-030**: System MUST support Chrome (latest 2 versions)
- **NFR-FE-031**: System MUST support Firefox (latest 2 versions)
- **NFR-FE-032**: System MUST support Safari (latest 2 versions)
- **NFR-FE-033**: System MUST support Edge (latest 2 versions)
- **NFR-FE-034**: System MUST be responsive for desktop (1024px+), tablet (768px-1023px), and mobile (320px-767px)

---

## UI Components

### SearchFilterBar

**Description**: Collapsible search and filter form for Employee Claims

**Props**:
- `onSearch` (function): Callback when Search button clicked
- `onReset` (function): Callback when Reset button clicked
- `initialFilters` (object): Pre-populated filter values

**Usage**:
- Employee Claims page (top section)
- Displays by default, can be collapsed [NEEDS CLARIFICATION: collapse behavior not shown]

**Styling**:
- White background card
- Two-row layout: filters on top, date range + include dropdown below
- Reset button: outlined, gray border
- Search button: filled green (#6BC24A or similar)

### ClaimsDataTable

**Description**: Sortable data table displaying claim records

**Props**:
- `data` (array): Array of claim objects
- `onSort` (function): Callback for column sort
- `onViewDetails` (function): Callback when View Details clicked
- `selectable` (boolean): Enable checkbox column

**Usage**:
- Employee Claims page (main content)
- Expenses section (simplified version)
- Attachments section (simplified version)

**Styling**:
- Light gray header row
- White data rows with subtle hover effect
- Alternating row colors for readability
- Sortable columns show sort icon (↕)
- Clickable "View Details" link in blue/orange

### CreateClaimForm

**Description**: Form for creating new claim assignments

**Props**:
- `onSubmit` (function): Callback when Create button clicked
- `onCancel` (function): Callback when Cancel button clicked
- `employees` (array): Employee list for autocomplete
- `events` (array): Event types for dropdown
- `currencies` (array): Currencies for dropdown

**Usage**:
- Assign Claim page (create mode)

**Styling**:
- White background
- Vertical form layout
- Two-column layout for Event and Currency
- Required fields marked with red asterisk (*)
- Cancel button: outlined
- Create button: filled green

### ClaimDetailView

**Description**: Read-only display of claim information

**Props**:
- `claim` (object): Claim data to display
- `editable` (boolean): Whether to show Submit button

**Usage**:
- Assign Claim page (view mode after creation)
- View Details page

**Styling**:
- Light purple/gray background for read-only fields
- Two-column layout for fields
- Remarks field spans full width

### ExpensesSection

**Description**: Section displaying expenses table with add functionality

**Props**:
- `claimId` (string): Associated claim ID
- `expenses` (array): List of expenses
- `currency` (string): Claim currency for amount display
- `totalAmount` (number): Calculated total
- `onAdd` (function): Callback when + Add clicked
- `readonly` (boolean): Whether add button is shown

**Usage**:
- Assign Claim page (below claim details)

**Styling**:
- Section header with "+ Add" button
- Data table below
- Total amount displayed at bottom right
- Currency label in column header adapts to claim currency

### AttachmentsSection

**Description**: Section displaying attachments table with add functionality

**Props**:
- `claimId` (string): Associated claim ID
- `attachments` (array): List of attachments
- `onAdd` (function): Callback when + Add clicked
- `readonly` (boolean): Whether add button is shown

**Usage**:
- Assign Claim page (below expenses section)

**Styling**:
- Section header with "+ Add" button
- Data table below with file metadata columns

### AddExpenseModal

**Description**: Modal dialog for adding expense to claim

**Props**:
- `isOpen` (boolean): Modal visibility state
- `onClose` (function): Callback when modal closed
- `onSave` (function): Callback when Save clicked with expense data
- `expenseTypes` (array): Expense types for dropdown

**Usage**:
- Triggered by "+ Add" button in Expenses section

**Styling**:
- Centered modal with white background
- Dimmed overlay background
- Close (X) button in top-right
- Cancel and Save buttons at bottom
- Form fields arranged vertically
- Date and Amount fields side-by-side

### AddAttachmentModal

**Description**: Modal dialog for adding attachment to claim

**Props**:
- `isOpen` (boolean): Modal visibility state
- `onClose` (function): Callback when modal closed
- `onSave` (function): Callback when Save clicked with file data

**Usage**:
- Triggered by "+ Add" button in Attachments section

**Styling**:
- Centered modal with white background
- Dimmed overlay background
- Close (X) button in top-right
- Browse button for file selection
- Upload icon on right side of file field
- File size constraint displayed below file field
- Cancel and Save buttons at bottom

### Button

**Description**: Reusable button component with variants

**Props**:
- `variant` (string): "primary" (green filled), "secondary" (outlined), "link"
- `size` (string): "sm", "md", "lg"
- `disabled` (boolean): Disabled state
- `onClick` (function): Click handler

**Usage**:
- Search, Reset, Create, Cancel, Save, Submit, Back buttons throughout module

**Styling**:
- Primary: Green background (#6BC24A), white text, rounded corners
- Secondary: Gray border, transparent background, gray text
- Hover: Slight color darkening/opacity change
- Disabled: Reduced opacity, no hover effect

### Dropdown

**Description**: Select dropdown component

**Props**:
- `options` (array): Array of {label, value} objects
- `value` (string): Selected value
- `onChange` (function): Change handler
- `placeholder` (string): Default text (e.g., "-- Select --")
- `required` (boolean): Required field indicator

**Usage**:
- Event Name, Status, Include, Currency, Expense Type fields

**Styling**:
- Border: gray, rounded corners
- Dropdown arrow icon on right
- Required fields show red border on validation error
- Options list: white background, hover highlight

### DatePicker

**Description**: Date input with calendar picker

**Props**:
- `value` (string): Date value (yyyy-dd-mm format)
- `onChange` (function): Change handler
- `placeholder` (string): Format hint (e.g., "yyyy-dd-mm")
- `required` (boolean): Required field indicator

**Usage**:
- From Date, To Date, Date fields in forms

**Styling**:
- Text input with calendar icon on right
- Calendar popup on icon click
- Required fields show red border on validation error

### AutocompleteInput

**Description**: Text input with dropdown suggestions

**Props**:
- `value` (string): Input value
- `onChange` (function): Change handler
- `onSearch` (function): Search API call
- `suggestions` (array): Suggestion list
- `placeholder` (string): Placeholder text (e.g., "Type for hints...")
- `required` (boolean): Required field indicator

**Usage**:
- Employee Name field

**Styling**:
- Text input with dropdown suggestions on focus
- Debounced search (300ms)
- Highlight matching text in suggestions
- Required fields show red border on validation error

### SuccessPopup

**Description**: Temporary success notification

**Props**:
- `message` (string): Success message text
- `duration` (number): Display duration in milliseconds (default: 3000-5000)
- `onClose` (function): Callback when popup auto-dismisses

**Usage**:
- After successful claim creation
- After successful claim submission
- After successful expense/attachment addition

**Styling**:
- Green background or border
- Checkmark icon
- Centered or top-right position
- Fade in/out animation
- Auto-dismiss after duration

---

## User Flows

### Flow 1: Search and View Claims

**Description**: User searches for claims using filters and views claim details

**Steps**:
1. User navigates to Employee Claims page (default tab)
2. System displays search form and claims table with all claims
3. User enters filter criteria (e.g., Employee Name, Date range, Status)
4. User clicks "Search" button
5. System validates filters and calls search API
6. System displays filtered results with record count "(X) Records Found"
7. User clicks "View Details" on a claim row
8. System navigates to claim detail page showing read-only claim info, expenses, and attachments
9. User reviews claim details
10. User clicks "Back" button
11. System returns to Employee Claims page with preserved filters

**Entry Point**: Employee Claims tab
**Exit Point**: Employee Claims page or claim detail page

### Flow 2: Create and Assign New Claim

**Description**: Manager creates a new claim assignment for an employee

**Steps**:
1. User clicks "+ Assign Claim" button on Employee Claims page
2. System navigates to Create Claim Request form
3. User starts typing in Employee Name field
4. System displays autocomplete suggestions
5. User selects employee from suggestions
6. User selects Event from dropdown
7. User selects Currency from dropdown
8. User optionally enters Remarks
9. User clicks "Create" button
10. System validates all required fields
11. If validation fails: System displays red borders/text on invalid fields, user corrects and retries
12. If validation passes: System creates claim via API
13. System displays success popup message (3-5 seconds)
14. System redirects to claim detail page showing:
    - Auto-generated Reference Id
    - Status set to "Initiated"
    - All entered details in read-only format
    - Empty Expenses and Attachments sections
    - Submit button available
15. User can now add expenses/attachments or submit claim

**Entry Point**: Employee Claims page
**Exit Point**: Claim detail page (newly created claim)

### Flow 3: Add Expenses and Submit Claim

**Description**: User adds expense items to a claim and submits it for approval

**Steps**:
1. User is on claim detail page (Status: "Initiated")
2. User clicks "+ Add" button in Expenses section
3. System opens Add Expense modal
4. User selects Expense Type from dropdown
5. User selects Date using date picker
6. User enters Amount (numeric value)
7. User optionally enters Note
8. User clicks "Save" button
9. System validates required fields (Expense Type, Date, Amount)
10. If validation fails: System shows red borders, user corrects and retries
11. If validation passes: System adds expense via API
12. System closes modal
13. System updates Expenses table with new row
14. System recalculates and updates "Total Amount"
15. User repeats steps 2-14 to add more expenses (optional)
16. User clicks "Submit" button at bottom of page
17. System submits claim via API (changes status to "Submitted")
18. System displays success popup (3-5 seconds)
19. System reloads page
20. System hides Submit button (claim now locked)
21. All data becomes read-only

**Entry Point**: Claim detail page with Submit button
**Exit Point**: Claim detail page in submitted/read-only state

### Flow 4: Add Attachments to Claim

**Description**: User uploads supporting documents for a claim

**Steps**:
1. User is on claim detail page
2. User clicks "+ Add" button in Attachments section
3. System opens Add Attachment modal
4. User clicks "Browse" button
5. System opens file picker dialog
6. User selects file from computer
7. System validates file size (≤ 1MB)
8. If file > 1MB: System shows error, user selects different file
9. If file ≤ 1MB: System displays filename in modal
10. User optionally enters Comment in textarea
11. User clicks "Save" button
12. System uploads file via API
13. System closes modal
14. System updates Attachments table with new row showing:
    - File Name
    - Description (from Comment)
    - Size
    - Type
    - Date Added
    - Added By (current user)
15. User repeats steps 2-14 to add more attachments (optional)

**Entry Point**: Claim detail page
**Exit Point**: Claim detail page with updated attachments

### Flow 5: Reset Search Filters

**Description**: User clears all search filters to view all claims

**Steps**:
1. User has entered filter criteria on Employee Claims page
2. User clicks "Reset" button
3. System clears all filter fields to default/empty state:
   - Employee Name: cleared
   - Reference Id: cleared
   - Event Name: "-- Select --"
   - Status: "-- Select --"
   - From Date: cleared
   - To Date: cleared
   - Include: "Current Employees Only" (default)
4. System automatically refreshes table with unfiltered results
5. System displays all available claims

**Entry Point**: Employee Claims page with active filters
**Exit Point**: Employee Claims page with cleared filters

---

## Error Handling

### Error Scenarios

- **ERR-FE-001**: When required form fields are empty on submission, system MUST display red border around invalid fields and red error text below field
- **ERR-FE-002**: When autocomplete API fails, system MUST display empty suggestion list and allow manual text entry
- **ERR-FE-003**: When search API fails, system MUST display error toast notification: "Failed to load claims. Please try again."
- **ERR-FE-004**: When create claim API fails, system MUST display error message: "Failed to create claim. Please check your input and try again."
- **ERR-FE-005**: When file upload exceeds 1MB, system MUST display error message: "File size must be under 1MB. Please select a smaller file."
- **ERR-FE-006**: When add expense API fails, system MUST display error in modal: "Failed to add expense. Please try again."
- **ERR-FE-007**: When add attachment API fails, system MUST display error in modal: "Failed to upload attachment. Please try again."
- **ERR-FE-008**: When submit claim API fails, system MUST display error toast: "Failed to submit claim. Please try again."
- **ERR-FE-009**: When claim detail API fails (404), system MUST display error page: "Claim not found"
- **ERR-FE-010**: When network connection is lost, system MUST display error message: "Network error. Please check your connection."
- **ERR-FE-011**: When date range is invalid (From Date > To Date), system MUST display error: "From Date must be before To Date"
- **ERR-FE-012**: When configuration APIs fail (events, currencies), system MUST display error and disable form submission

### Error Display

- **ERR-FE-020**: System MUST display validation errors inline below/beside the invalid field with red text
- **ERR-FE-021**: System MUST display API errors as toast notifications at top-right of screen
- **ERR-FE-022**: System MUST display file validation errors in the modal dialog near the file input
- **ERR-FE-023**: System MUST provide "Retry" option for failed API calls where appropriate
- **ERR-FE-024**: System MUST display error messages for 5-10 seconds before auto-dismissing (for non-critical errors)
- **ERR-FE-025**: System MUST keep critical validation errors visible until user corrects the issue
- **ERR-FE-026**: System MUST prevent form submission when validation errors exist
- **ERR-FE-027**: System MUST clear previous error messages when user corrects the field

---

## Success Criteria

- **SC-FE-001**: Employee Claims page loads within 2 seconds for typical dataset (≤100 records)
- **SC-FE-002**: Search returns filtered results within 1 second
- **SC-FE-003**: Users can create and submit a claim in under 3 minutes (excluding expense/attachment entry time)
- **SC-FE-004**: All functional requirements (FR-FE-001 through FR-FE-075) are implemented and tested
- **SC-FE-005**: Form validation catches 100% of invalid inputs before API submission
- **SC-FE-006**: 95% of users successfully create claims on first attempt without validation errors
- **SC-FE-007**: Autocomplete suggestions appear within 500ms of user typing
- **SC-FE-008**: File uploads complete within 5 seconds for files ≤1MB
- **SC-FE-009**: All pages meet WCAG AA accessibility standards
- **SC-FE-010**: Module works correctly in Chrome, Firefox, Safari, and Edge (latest versions)
- **SC-FE-011**: Mobile responsive design works on screens 320px+ wide
- **SC-FE-012**: Zero data loss during navigation or form cancellation
- **SC-FE-013**: Success/error feedback is clearly visible and understandable to users
- **SC-FE-014**: Users can complete primary task (search, view, create claim) in ≤5 clicks

---

## Dropdown Options Reference

### Event Name Dropdown
- Travel Allowance
- Medical Reimbursement
- Accommodation
- Meal Allowance
- Transportation
- Training & Development
- Equipment Purchase
- Mobile/Phone Bill
- Internet Reimbursement
- Relocation Expenses
- Uniform Allowance
- Parking Fees
- Client Entertainment
- Office Supplies
- Other Expenses

### Status Dropdown
- All
- Initiated
- Submitted
- Pending Approval
- Approved
- Rejected
- Paid
- Cancelled
- On Hold
- Partially Approved

### Include Dropdown
- Current Employees Only (default)
- Past Employees Only
- All Employees
- Active Claims Only
- Closed Claims Only
- Pending Payment

### Currency Dropdown
- Algerian Dinar (DZD)
- Canadian Dollar (CAD)
- Afghanistan Afghani (AFN)
- US Dollar (USD)
- Euro (EUR)
- British Pound (GBP)
- Indian Rupee (INR)
- Australian Dollar (AUD)
- Japanese Yen (JPY)
- Swiss Franc (CHF)
- Argentina Peso (ARS)
- Angolan New Kwanza (AOA)

### Expense Type Dropdown
- Travel Expenses
- Accommodation
- Meals & Entertainment
- Local Transportation
- Flight/Train Tickets
- Fuel/Mileage
- Parking
- Internet/Phone
- Office Supplies
- Conference/Training
- Medical Expenses
- Equipment Purchase
- Client Gifts
- Miscellaneous

---

## Notes

- Reference `product-info/product-overview.md` for system roles and common functionalities (if available)
- Reference `specs/claims/frontend-specs.md` for technical implementation details
- Use Shadcn UI components from `src/components/ui` when possible for consistent styling
- Follow frontend structure guidelines in `.cursor/rules/frontend-structure.mdc`
- Orange theme color (primary): Approximately #FF7D00 or similar
- Green action button color: Approximately #6BC24A or similar
- Date format: yyyy-dd-mm (may need clarification - typically yyyy-mm-dd)
- Auto-generated Reference Id format: YYYYMMDDXXXXXXX (13+ digits)
- Currency handling: Amount display adapts to claim's selected currency
- File upload limit: 1MB maximum
- Popup duration: 3-5 seconds for success messages
- Debounce delay for autocomplete: 300ms recommended
- Table pagination: Not visible in screenshots but should be implemented for large datasets
- Actions column behavior (edit/delete): Not fully shown in screenshots, needs clarification
- Configuration tab functionality: Not covered in screenshots
- Submit Claim tab (employee view): Not covered in screenshots  
- My Claims tab functionality: Not covered in screenshots
- Bulk operations with checkboxes: Selection behavior needs clarification
- Sorting state persistence: Whether sort order is saved needs clarification
- Print/Export functionality: Not visible but may be required
- Notification preferences: Whether users can customize notification behavior

---

## Technical Notes

**OrangeHRM Version**: OS 5.7 (visible in footer)
**Legacy URL Pattern**: `/claim/viewAssignClaim`, `/claim/assignClaim/id/{id}`
**Session Management**: Maintains user session across navigation
**API Base URL**: Likely `/api/` or similar (to be confirmed)
**Authentication**: Session-based (cookie/token) - user avatar and name displayed in header
**Modernization Target**: React 18+ with Tailwind CSS recommended
**State Management**: Consider Redux/Zustand for complex state (search filters, claim data)
**Form Validation**: Client-side + server-side validation required
**File Upload**: Multipart form-data with size validation
**Date Handling**: Consider date-fns or similar library for formatting/validation
**Autocomplete**: Debounced API calls with minimum character threshold (e.g., 2 chars)
**Modal Management**: Portal-based modals for proper z-index and focus management
**Responsive Breakpoints**: Mobile (<768px), Tablet (768-1023px), Desktop (1024px+)
**Icons**: Consider using Lucide React or similar icon library
**Toast Notifications**: Consider using shadcn/ui toast component or react-hot-toast
**Table Component**: Consider using TanStack Table (react-table) for sorting/filtering
**Accessibility**: Ensure keyboard navigation, focus management, ARIA labels throughout
