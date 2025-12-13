# Frontend Requirements - Contacts Module

**Module**: Contacts  
**Created**: 2025-12-12  
**Status**: Draft  
**Derived From**: `product-info/product-overview.md`

## Overview

The Contacts module provides a comprehensive interface for managing contact information in the CRM system. Users can view, create, import, and manage contacts through a list view with sorting, filtering, and bulk actions. The module supports quick actions like calling, scheduling, and emailing contacts directly from the list view.

**System Roles Used:**
- **Admin**: Full access to all contacts, can create, edit, delete, and import contacts
- **Employee**: Can view and manage assigned contacts, create new contacts, and access recently viewed contacts
- **All Users**: Must be authenticated to access the Contacts module

**Common Functionalities Used:**
- **Authentication & Authorization**: All Contacts pages require JWT authentication (from product-overview.md)
- **Session Management**: Contacts module uses user session to provide personalized data and recently viewed contacts
- **Navigation**: Contacts module integrates with the main navigation system and supports dynamic module reordering

**Dependencies:**
- Authentication module (for user validation and role information)
- Backend Contacts API endpoints
- Navigation/routing system
- Accounts module (for account name relationships)
- Users module (for assigned user information)

**Integration Points:**
- Consumes backend Contacts API endpoints for CRUD operations
- Integrates with Accounts module for account name display and linking
- Integrates with Users module for assigned user display and linking
- Integrates with communication features (phone, email, calendar) for quick actions

---

## Functional Requirements

### User Interface

- **FR-FE-001**: System MUST display the Contacts module in the main navigation bar
- **FR-FE-002**: System MUST provide a dropdown menu when hovering over the "Contacts" navigation item
- **FR-FE-003**: System MUST highlight the "Contacts" navigation item when the Contacts module is active
- **FR-FE-004**: System MUST display a "CONTACTS" title in the module header
- **FR-FE-005**: System MUST display a "Filter" button in the module header
- **FR-FE-006**: System MUST display contact data in a table format with sortable columns
- **FR-FE-007**: System MUST display action icons for each contact row: call icon (phone), calendar icon, tasks icon (two horizontal rows), and email icon (envelope)
- **FR-FE-008**: System MUST display clickable links (in red text) for contact names, emails, phone numbers, account names, and user names
- **FR-FE-009**: System MUST display a checkbox in front of every contact entry for individual selection
- **FR-FE-010**: System MUST display a header checkbox for selecting all visible entries at once
- **FR-FE-011**: System MUST display a "Bulk Action" button that is disabled by default and enabled when one or more records are selected
- **FR-FE-012**: System MUST display a selection indicator showing "Selected: X" when contacts are selected
  - **Clear Button**: Red 'X' icon in selection indicator clears all selections when clicked (unchecks all checkboxes)
- **FR-FE-013**: System MUST display a "Choose Columns" button (burger icon) that opens a column customization popup
- **FR-FE-014**: System MUST display pagination controls in both header and footer sections

### Pages/Routes

- **FR-FE-010**: System MUST provide a Contacts List View page (View Contacts)
  - **Route**: `/contacts` (base route)
  - **Alternative Route**: `/contacts/index?return_module=Contacts&return_action=DetailView`
  - **Access**: Protected (requires authentication)
  - **Roles**: Admin, Employee
  - **Components**: ContactsTable, FilterButton, BulkActionButton, ChooseColumnsButton, PaginationControls, ViewToggleButtons, SelectionIndicator
  - **Features**: Contact listing, sorting, filtering, pagination (header and footer), bulk actions, quick actions, view toggles, column customization, multi-select

- **FR-FE-011**: System MUST provide a Create Contact page
  - **Route**: `/contacts/create` (inferred from dropdown option)
  - **Access**: Protected (requires authentication)
  - **Roles**: Admin, Employee
  - **Components**: ContactForm, ContactFormTabs, OverviewTab, MoreInformationTab, OtherTab
  - **Features**: Create new contact with validation, tabbed interface (Overview, More Information, Other), Save and Cancel actions

- **FR-FE-012**: System MUST provide a Create Contact From vCard page
  - **Route**: `/contacts/importvcard` (actual route from URL)
  - **Access**: Protected (requires authentication)
  - **Roles**: Admin, Employee
  - **Components**: vCardImportForm
  - **Features**: Import contact from vCard format with file validation
  - **Page Elements**:
    - Title: "Import VCard"
    - Description: "Automatically create a new contact by importing a vCard from your file system."
    - File Input: "Choose file" button with "No file chosen" text
    - Import Button: "Import VCard" button

- **FR-FE-013**: System MUST provide an Import Contacts page
  - **Route**: `/contacts/import` (inferred from dropdown option)
  - **Access**: Protected (requires authentication)
  - **Roles**: Admin only (Employee role does not have access to bulk import)
  - **Components**: ImportContactsForm
  - **Features**: Bulk import contacts from file (CSV, Excel formats)

- **FR-FE-014**: System MUST provide a Contact Detail/Edit page
  - **Route**: `/contacts/:id` (contact detail page)
  - **Access**: Protected (requires authentication)
  - **Roles**: Admin, Employee
  - **Components**: ContactForm, ContactFormTabs, OverviewTab, MoreInformationTab, OtherTab
  - **Features**: View and edit existing contact details, tabbed interface (Overview, More Information, Other), Save and Cancel actions
  - **Triggered by**: Clicking on contact name from list view, clicking on recently viewed contact name, navigating directly via URL, or via `return_module` and `return_action` query parameters (used for navigation/redirect logic)

### User Interactions

- **FR-FE-020**: Users MUST be able to navigate to Contacts module by clicking on "Contacts" in the navigation bar
  - **Trigger**: User clicks on "Contacts" navigation item
  - **Feedback**: Contacts module moves to 1st position in navigation, previously 1st module shifts to the right, Contacts page loads
  - **Result**: User lands on Contacts List View page

- **FR-FE-021**: Users MUST be able to access Contacts dropdown menu by hovering over "Contacts" navigation item
  - **Trigger**: User hovers over "Contacts" navigation item
  - **Feedback**: Dropdown menu appears with 5 options
  - **Result**: User can see and access menu options

- **FR-FE-022**: Users MUST be able to access Recently Viewed sub-menu
  - **Trigger**: User hovers over "Recently Viewed" option in Contacts dropdown (5th option in the dropdown menu)
  - **Feedback**: Sub-menu appears showing list of recently viewed contact names (contacts that the user has previously viewed)
  - **Result**: User can click on a contact name to navigate to that contact's detail page, where they can view and update contact details

- **FR-FE-023**: Users MUST be able to sort contacts by clicking on column headers
  - **Trigger**: User clicks on a sortable column header
  - **Feedback**: Column header shows sort indicator (up arrow for ascending, down arrow for descending), table reorders immediately
  - **Result**: Contacts are displayed in sorted order (ascending on first click, descending on second click, toggle between ascending and descending on subsequent clicks)
  - **Sorting Behavior**: All table headers support sorting with ascending and descending order

- **FR-FE-024**: Users MUST be able to select individual contacts using checkboxes
  - **Trigger**: User clicks on checkbox in a contact row
  - **Feedback**: Checkbox is checked/unchecked, selection indicator updates to show "Selected: X", Bulk Action button becomes enabled if at least one contact is selected
  - **Result**: Contact is selected/deselected for bulk actions

- **FR-FE-025**: Users MUST be able to select all visible contacts using header checkbox
  - **Trigger**: User clicks on checkbox in table header
  - **Feedback**: All visible contact checkboxes are checked/unchecked, selection indicator updates, Bulk Action button state updates
  - **Result**: All visible contacts are selected/deselected for bulk actions

- **FR-FE-026**: System MUST display selection indicator when contacts are selected
  - **Trigger**: One or more contacts are selected via checkboxes
  - **Feedback**: "Selected: X" indicator appears with red 'X' icon, where X is the count of selected contacts
  - **Result**: User can see how many contacts are currently selected

- **FR-FE-027**: System MUST enable Bulk Action button when at least one contact is selected
  - **Trigger**: User selects one or more contacts
  - **Feedback**: Bulk Action button changes from disabled to enabled state
  - **Result**: User can access bulk action options

- **FR-FE-028**: System MUST disable Bulk Action button when no contacts are selected
  - **Trigger**: User deselects all contacts
  - **Feedback**: Bulk Action button changes from enabled to disabled state
  - **Result**: Bulk actions are not accessible until contacts are selected

- **FR-FE-029**: Users MUST be able to navigate to contact detail page by clicking on contact name
  - **Trigger**: User clicks on contact name (displayed in red, clickable link)
  - **Feedback**: Page navigates to contact detail view
  - **Result**: User views contact details

- **FR-FE-030**: Users MUST be able to navigate to account detail page by clicking on account name
  - **Trigger**: User clicks on account name (displayed in red, clickable link)
  - **Feedback**: Page navigates to account detail view
  - **Result**: User views account details

- **FR-FE-031**: Users MUST be able to create a call record by clicking call icon
  - **Trigger**: User clicks on call icon (phone icon) in contact row
  - **Feedback**: System navigates to Calls create page
  - **Result**: User is redirected to Calls module create page with contact information pre-filled

- **FR-FE-032**: Users MUST be able to create a meeting by clicking calendar icon
  - **Trigger**: User clicks on calendar icon in contact row
  - **Feedback**: System navigates to Meetings create page
  - **Result**: User is redirected to Meetings module create page with contact information pre-filled

- **FR-FE-033**: Users MUST be able to create a task by clicking tasks icon
  - **Trigger**: User clicks on tasks icon (two horizontal rows icon) in contact row
  - **Feedback**: System navigates to Tasks create page
  - **Result**: User is redirected to Tasks module create page with contact information pre-filled

- **FR-FE-034**: Users MUST be able to send email by clicking email icon
  - **Trigger**: User clicks on email icon (envelope icon) in contact row
  - **Feedback**: System opens new email popup/modal
  - **Result**: Email composer popup opens with contact's email address pre-filled as recipient

- **FR-FE-035**: Users MUST be able to compose email by clicking on email address
  - **Trigger**: User clicks on email address (displayed in red, clickable link)
  - **Feedback**: System opens new email popup/modal
  - **Result**: Email composer popup opens with contact's email address pre-filled as recipient (same behavior as email icon)

- **FR-FE-036**: Users MUST be able to create a call record by clicking on phone number
  - **Trigger**: User clicks on phone number (displayed in red, clickable link)
  - **Feedback**: System navigates to Calls create page
  - **Result**: User is redirected to Calls module create page with contact information and phone number pre-filled

- **FR-FE-037**: Users MUST be able to navigate to user profile by clicking on user name
  - **Trigger**: User clicks on user name (displayed in red, clickable link)
  - **Feedback**: Page navigates to user profile
  - **Result**: User views user profile details

- **FR-FE-038**: Users MUST be able to navigate through pages using pagination controls in header
  - **Trigger**: User clicks on pagination buttons in header control bar
  - **Pagination Buttons**: First page (<<), Previous page (<), Page entry details display, Next page (>), Last page (>>)
  - **Feedback**: Page number updates, new set of contacts loads
  - **Result**: User views different page of contacts

- **FR-FE-039**: Users MUST be able to navigate through pages using pagination controls in footer
  - **Trigger**: User clicks on pagination buttons in footer control bar
  - **Pagination Buttons**: First page (<<), Previous page (<), Page entry details display, Next page (>), Last page (>>)
  - **Feedback**: Page number updates, new set of contacts loads
  - **Result**: User views different page of contacts (same functionality as header pagination)
  - **Trigger**: User clicks on pagination arrows (<<, <, >, >>)
  - **Feedback**: Page number updates, new set of contacts loads
  - **Result**: User views different page of contacts

- **FR-FE-040**: Users MUST be able to toggle between list and grid view
  - **Trigger**: User clicks on view toggle buttons
  - **Feedback**: View switches between list and grid/card format
  - **Result**: Contacts are displayed in selected view format
  - **Implementation**: Grid/card view MUST be implemented (not planned for future)

- **FR-FE-041**: Users MUST be able to access bulk actions for selected contacts
  - **Trigger**: User selects one or more contacts and clicks on enabled "Bulk Action" dropdown
  - **Feedback**: Dropdown menu appears with available bulk actions
  - **Result**: User can select from the following bulk actions:
    - **Add To Target List**: Prompts user to select which target list to add contacts to (or create new target list)
    - **Print as PDF**: Generates PDF report for selected contacts
    - **Delete**: Soft deletes selected contacts (Admin only - see permissions)
    - **Export**: Exports selected contacts to CSV/Excel file
    - **Merge**: Merges multiple contacts into one - compares contacts by name to identify duplicates, prompts user whether to keep or skip duplicate data, stores all related records (calls, meetings, tasks, etc.) from merged contacts
    - **Mass Update**: Updates multiple contacts with same field values - all fields except username/assignedUserId can be mass updated, shows form/modal to select fields and values

- **FR-FE-042**: Users MUST be able to open Choose Columns popup
  - **Trigger**: User clicks on "Choose Columns" button (burger icon)
  - **Feedback**: Modal popup opens displaying "Choose Columns" interface
  - **Result**: User can customize visible columns

- **FR-FE-043**: Users MUST be able to customize visible columns using Choose Columns popup
  - **Trigger**: User interacts with columns in Choose Columns popup
  - **Feedback**: Columns can be moved between DISPLAYED and HIDDEN sections
  - **Result**: User can add, update (reorder), and delete (hide) columns in the contacts table
  - **Column Management**: Users can add columns by moving from HIDDEN to DISPLAYED, update column order by reordering within DISPLAYED section, and delete columns by moving from DISPLAYED to HIDDEN

- **FR-FE-044**: Users MUST be able to drag and drop columns between DISPLAYED and HIDDEN sections
  - **Trigger**: User drags a column item from one section to another
  - **Feedback**: Column moves to the target section, visual feedback during drag
  - **Result**: Column visibility is updated in the table

- **FR-FE-045**: Users MUST be able to save column customization changes
  - **Trigger**: User clicks on "Save" button in Choose Columns popup
  - **Feedback**: Popup closes, table columns update to reflect changes
  - **Result**: Column preferences are saved and applied (user-specific preferences)

- **FR-FE-046**: Users MUST be able to cancel column customization changes
  - **Trigger**: User clicks on "Cancel" button or close button (X) in Choose Columns popup
  - **Feedback**: Popup closes without saving changes
  - **Result**: Column preferences remain unchanged, table displays previous column configuration

- **FR-FE-047**: Users MUST be able to open Filter panel by clicking Filter button
  - **Trigger**: User clicks on "Filter" button in top right corner of module header
  - **Feedback**: Basic Filter panel opens below the module header
  - **Result**: User can input filter criteria

- **FR-FE-048**: Users MUST be able to apply filters using Search button
  - **Trigger**: User fills filter fields and clicks "Search" button
  - **Feedback**: Filter panel remains open, table updates with filtered results
  - **Result**: Contacts table displays only records matching filter criteria

- **FR-FE-049**: Users MUST be able to clear filters using Clear button
  - **Trigger**: User clicks "Clear" button in Basic Filter panel
  - **Feedback**: All filter fields are cleared, table resets to show all contacts
  - **Result**: All filter criteria are removed, full contact list is displayed

- **FR-FE-050**: Users MUST be able to save filter criteria
  - **Trigger**: User applies filters and clicks "Save" button in Quick Filter section
  - **Feedback**: System prompts user to enter a name for the filter (name is required, filter will not save without a name)
  - **Result**: Saved filter appears as a button in "My Filters" section on UI and can be reused later
  - **Behavior**: Users MUST provide a name for the filter - filters without names cannot be saved

- **FR-FE-051**: Users MUST be able to close Filter panel

- **FR-FE-052**: Users MUST be able to navigate to Create Contact page
  - **Trigger**: User clicks "Create Contact" from Contacts dropdown menu
  - **Feedback**: System navigates to Create Contact page
  - **Result**: User sees Create Contact form with Overview tab active

- **FR-FE-053**: Users MUST be able to switch between tabs in Create Contact form
  - **Trigger**: User clicks on tab (Overview, More Information, Other)
  - **Feedback**: Selected tab becomes active (highlighted in dark grey), tab content displays
  - **Result**: User can access different sections of the contact form

- **FR-FE-054**: Users MUST be able to select title from dropdown
  - **Trigger**: User clicks on Title dropdown
  - **Feedback**: Dropdown opens showing options (Mr., Ms., Mrs., Miss, Dr., Prof.)
  - **Result**: User selects a title option

- **FR-FE-055**: Users MUST be able to add multiple email addresses
  - **Trigger**: User clicks plus icon (+) in Email Address section
  - **Feedback**: New email address field is added
  - **Result**: User can enter multiple email addresses for the contact

- **FR-FE-056**: Users MUST be able to remove email addresses
  - **Trigger**: User clicks minus icon (-) in Email Address section
  - **Feedback**: Email address field is removed
  - **Result**: User can remove unwanted email address fields

- **FR-FE-057**: Users MUST be able to mark email as Primary
  - **Trigger**: User checks "Primary" checkbox for an email address
  - **Feedback**: Checkbox is checked, red X icon appears
  - **Result**: Email address is marked as primary

- **FR-FE-058**: Users MUST be able to save contact
  - **Trigger**: User fills form and clicks "Save" button
  - **Feedback**: System validates form (checks if Last Name is provided, validates email format if email addresses are provided), shows validation errors if any
  - **Result**: If valid, contact is created and user is redirected to contact detail page or list page
  - **Validation Rules**:
    - Last Name is required (cannot be empty)
    - Email addresses must be valid email format (if provided)
    - Other fields are optional

- **FR-FE-059**: Users MUST be able to cancel contact creation
  - **Trigger**: User clicks "Cancel" button
  - **Feedback**: System closes Create Contact form
  - **Result**: User is redirected to Contacts List View page, no contact is created

- **FR-FE-076**: Users MUST be able to edit contact details from contact detail page
  - **Trigger**: User navigates to contact detail page (via contact name click, recently viewed click, or direct URL)
  - **Feedback**: Contact detail page displays contact information in editable form
  - **Result**: User can modify contact details across all tabs (Overview, More Information, Other) and save changes
  - **Behavior**: Form is pre-populated with existing contact data, user can update any field and save updates

- **FR-FE-065**: Users MUST be able to select Lead Source from dropdown
  - **Trigger**: User clicks on Lead Source dropdown
  - **Feedback**: Dropdown opens showing list of available lead source options
  - **Result**: User can select a lead source option (Cold Call, Existing Customer, Self Generated, Employee, Partner, Public Relations, Direct Mail, Conference, Trade Show, Web Site, Word of mouth, Email, Campaign, Other)
  - **Behavior**: When no entries exist, dropdown shows empty/blank; when entries exist, they are displayed

- **FR-FE-066**: Users MUST be able to search and select Reports To contact
  - **Trigger**: User clicks on Reports To field or starts typing
  - **Feedback**: Search input becomes active, dropdown shows search results
  - **Result**: User can search for and select a contact that this contact reports to
  - **Behavior**: 
    - Shows "Select an item" placeholder when empty
    - Supports search with magnifying glass icon
    - Shows "No results matching your search criteria. Try broadening your search." when no matches found
    - When entries exist, they are displayed in dropdown; when no entries exist, field shows as blank/empty
    - X icon allows clearing the selection

- **FR-FE-067**: Users MUST be able to select Campaign from dropdown
  - **Trigger**: User clicks on Campaign dropdown
  - **Feedback**: Dropdown opens showing list of available campaigns
  - **Result**: User can select a campaign option
  - **Behavior**: 
    - Shows "Select an item" placeholder when empty
    - When entries exist, they are displayed in dropdown; when no entries exist, field shows as blank/empty
    - X icon allows clearing the selection

- **FR-FE-068**: Users MUST be able to view Date Created in Other tab
  - **Trigger**: User switches to Other tab or contact is created
  - **Feedback**: Date Created field displays creation date
  - **Result**: User can see when the contact was created
  - **Behavior**: 
    - Field is empty/blank when creating new contact
    - Once contact data is created, shows the creation date entry
    - Date is automatically populated by system on creation

- **FR-FE-069**: Users MUST be able to view Date Modified in Other tab
  - **Trigger**: User switches to Other tab or contact is modified
  - **Feedback**: Date Modified field displays modification date
  - **Result**: User can see when the contact was last modified
  - **Behavior**: 
    - Field is empty/blank when creating new contact
    - Once contact data is created and modified, shows the modification date entry
    - Date is automatically updated by system when contact is modified

- **FR-FE-072**: Users MUST be able to navigate to Import VCard page
  - **Trigger**: User clicks "Create Contact From vC..." from Contacts dropdown menu
  - **Feedback**: System navigates to Import VCard page
  - **Result**: User sees Import VCard form with file input field

- **FR-FE-073**: Users MUST be able to select vCard file
  - **Trigger**: User clicks "Choose file" button
  - **Feedback**: File selection dialog opens
  - **Result**: User can browse and select a file from their file system
  - **File Selection**: File dialog filters to show .vcf and .vcard files (inferred)

- **FR-FE-074**: Users MUST be able to import valid vCard file
  - **Trigger**: User selects a valid .vcf or .vcard file and clicks "Import VCard" button
  - **Feedback**: System validates file format, processes import, shows success message
  - **Result**: Contact is created from vCard data and appears in View Contacts section
  - **Post-Import Behavior**: 
    - Imported contact is displayed in View Contacts list
    - Contact appears in other relevant sections (Recently Viewed, search results, etc.)
    - User can navigate to contact detail page

- **FR-FE-075**: System MUST display error for invalid file formats
  - **Trigger**: User selects a file that is not .vcf or .vcard format and clicks "Import VCard" button
  - **Feedback**: System displays error message indicating invalid file format
  - **Result**: Import is rejected, no contact is created
  - **Error Message**: Must clearly indicate that only .vcf and .vcard files are accepted
  - **Trigger**: User clicks close button (X) in Basic Filter panel header
  - **Feedback**: Filter panel closes
  - **Result**: Filter panel is hidden, but active filters remain applied (inferred)
  - **Trigger**: User clicks on cancel button (inferred) or close button (X) in Choose Columns popup
  - **Feedback**: Popup closes without saving changes
  - **Result**: Column preferences remain unchanged

### Forms & Input

#### Field Type Mappings

- **FR-FE-061A**: System MUST map backend field types to frontend components:
  - `varchar` → Text input component
  - `text` → Textarea component (multi-line)
  - `phone` → Phone input component with formatting
  - `email` → Email input component with validation
  - `date` → Date picker component
  - `datetime` → DateTime picker component
  - `enum` → Dropdown select component
  - `relate` → Related record selector (autocomplete/search) component
  - `bool` → Checkbox component

#### Form Data Transformations

- **FR-FE-061B**: System MUST transform data between API and form formats:
  - Date formatting: ISO 8601 format from API ↔ display format (YYYY-MM-DD) in form
  - DateTime formatting: ISO 8601 format from API ↔ display format (YYYY-MM-DD HH:MM) in form
  - Boolean values: API boolean (true/false) ↔ form checkbox state
  - Phone formatting: Raw phone from API ↔ formatted display in form
  - Relationship data: API relationship object (`{ "data": { "type": "Accounts", "id": "..." } }`) ↔ form field value

- **FR-FE-062**: System MUST provide a Create Contact form with tabbed interface
  - **Tabs**: Overview (default/active), More Information, Other
  - **Page Header**: "Create" title with Save (blue button) and Cancel (grey button) actions
  - **Validation**: Last Name is mandatory (marked with asterisk)
  - **Submission**: On Save button click, form validates and creates contact; on Cancel, form closes without saving

- **FR-FE-063**: System MUST provide Overview tab in Create Contact form
  - **Layout**: Two-column layout (Left Column and Right Column)
  - **Left Column Fields:**
    - **NAME Section:**
      - Title (dropdown): Options include "Mr.", "Ms.", "Mrs.", "Miss", "Dr.", "Prof."
      - First Name (text input)
      - Last Name (text input, required - marked with asterisk *)
    - **Office Phone** (text input)
    - **Job Title** (text input)
    - **Account Name** (text input with dropdown arrow and X icon for searchable/selectable field)
    - **Email Address Section:**
      - Email Address (text input)
      - Checkboxes: Primary (can be checked/unchecked, shows red X when checked), Opt Out (checkbox), Invalid (checkbox)
      - Plus icon (+) and Minus icon (-) for adding/removing email addresses
    - **Primary Address Section:**
      - Primary Address Street (text input, single-line)
  - **Right Column Fields:**
    - **Assigned To** (text input, pre-filled with current user name like "WillWestin", has dropdown arrow and X icon)
    - **Mobile** (text input)
    - **Department** (text input)
    - **Other Address Section:**
      - Alternate Address Street (text input, single-line)
  - **Additional Fields (Below Columns):**
    - **PRIMARY ADDRESS Section (Full Details):**
      - Primary Address Street (multi-line text area with resize handle)
      - Primary Address Postal Code (text input)
      - Primary Address City (text input)
      - Primary Address State (text input)
      - Primary Address Country (text input)
    - **OTHER ADDRESS Section (Full Details):**
      - Alternate Address Street (multi-line text area with resize handle)
      - Alternate Address Postal Code (text input)
      - Alternate Address City (text input)
      - Alternate Address State (text input)
      - Alternate Address Country (text input)
    - **DESCRIPTION Section:**
      - Description (large multi-line text area with resize handle)

- **FR-FE-064**: System MUST provide More Information tab in Create Contact form
  - **Layout**: Two-column layout (Left Column and Right Column)
  - **Fields**: Only three fields in More Information tab - Lead Source, Reports To, and Campaign
  - **Left Column Fields:**
    - **LEAD SOURCE** (dropdown/selectable field):
      - Dropdown with fixed predefined options (enum): "Cold Call", "Existing Customer", "Self Generated", "Employee", "Partner", "Public Relations", "Direct Mail", "Conference", "Trade Show", "Web Site", "Word of mouth", "Email", "Campaign", "Other"
      - Options are fixed and cannot be modified by users (enum values)
      - Shows dropdown arrow icon
      - When no selection is made, field appears empty/blank
      - When entries exist, they are displayed in the dropdown list
    - **REPORTS TO** (searchable dropdown/selectable field):
      - Searchable dropdown field - initially blank, shows all active contacts on search
      - Placeholder text: "Select an item" when empty
      - Has dropdown arrow icon and X icon (for clearing selection)
      - Supports search functionality with magnifying glass icon
      - Shows "No results matching your search criteria. Try broadening your search." when search yields no results
      - When entries exist, they are displayed in the dropdown list
      - When no entries exist, field shows as blank/empty
  - **Right Column Fields:**
    - **CAMPAIGN** (dropdown/selectable field):
      - Searchable dropdown field - initially blank, shows all active campaigns on search
      - Placeholder text: "Select an item" when empty
      - Has dropdown arrow icon and X icon (for clearing selection)
      - When entries exist, they are displayed in the dropdown list
      - When no entries exist, field shows as blank/empty

- **FR-FE-068**: System MUST provide Other tab in Create Contact form
  - **Layout**: Two-column layout (Left Column and Right Column)
  - **Fields**: Only two fields in Other tab - Date Created and Date Modified
  - **Left Column Fields:**
    - **DATE CREATED** (date input field, read-only):
      - Date input field for displaying creation date (read-only, system-managed)
      - When creating new contact, field is empty/blank
      - Once contact data is created, shows the creation date entry
      - Displays date in appropriate format (YYYY-MM-DD HH:MM)
  - **Right Column Fields:**
    - **DATE MODIFIED** (date input field, read-only):
      - Date input field for displaying modification date (read-only, system-managed)
      - When creating new contact, field is empty/blank
      - Once contact data is created and modified, shows the modification date entry
      - Displays date in appropriate format (YYYY-MM-DD HH:MM)
      - Updates automatically when contact is modified

- **FR-FE-060**: System MUST provide a Basic Filter form/interface
  - **Fields**: 
    - **Left Column:**
      - First Name (text input)
      - Last Name (text input)
      - Account Name (searchable dropdown - initially blank, shows all active accounts on search)
      - Assigned to (searchable dropdown - initially blank, shows all active users on search)
    - **Middle Column:**
      - Any Email (text input)
      - Any Address (text input)
      - State/Region (text input)
      - Country (text input)
    - **Right Column:**
      - Any Phone (text input)
      - City (text input)
      - Postal Code (text input)
      - Lead Source (dropdown with fixed enum options: Cold Call, Existing Customer, Self Generated, Employee, Partner, Public Relations, Direct Mail, Conference, Trade Show, Web Site, Word of mouth, Email, Campaign, Other)
    - **Checkboxes:**
      - My Items (checkbox): Filters to show contacts assigned to OR created by current user when checked
      - My Favorites (checkbox): Filters to show contacts marked as favorites by current user when checked (favorites feature must be implemented)
  - **Buttons**: Search (red background, white text), Clear (red text on light red background)
  - **Quick Filter Section** (below Basic Filter):
    - Name (text input)
    - Quick Filter (checkbox): When checked, enables quick filter mode (applies filter logic more aggressively/faster)
    - Order by column (dropdown)
    - Direction (radio buttons: Ascending, Descending)
    - Save button (white text on light red background)
  - **Validation**: No specific validation rules - filters are applied based on textbox values as typed (partial matches allowed)
  - **Submission**: Filters are applied when "Search" button is clicked, table updates with filtered results

- **FR-FE-061**: System MUST provide an Import Contacts form
  - **Fields**: File upload field for contact import file
  - **Validation**: 
    - Supported file formats: CSV, Excel (.xlsx, .xls)
    - Required columns: lastName (minimum required field)
    - File must contain valid data rows
  - **Submission**: 
    - User uploads file and clicks import button
    - System shows preview of import data (preview first workflow)
    - User reviews preview and confirms import
    - System processes import and shows results (success/failure counts)

### Data Display

- **FR-FE-060**: System MUST display contacts in a table with the following default columns:
  - Checkbox (for selection)
  - Name (sortable, clickable link)
  - Job Title (sortable)
  - Account Name (sortable, clickable link)
  - Email (clickable link)
  - Office Phone (sortable, clickable link)
  - User (sortable, clickable link)
  - Date Created (sortable)
  - Action Icons (phone, calendar, tasks, envelope)
  - **Additional available columns** (can be added via column customization): Mobile, Department, Lead Source, and other contact fields

- **FR-FE-062**: System MUST display pagination information showing current range and total count in both header and footer
  - **Format**: "(X - Y of Z)" where X is first visible record, Y is last visible record, Z is total count
  - **Example**: "(1 - 20 of 200)"
  - **Position**: Displayed between Previous and Next page buttons

- **FR-FE-063**: System MUST display sort indicators on all sortable column headers
  - **Default State**: Up/down arrow icon (⇕) indicating column is sortable
  - **Ascending State**: Up arrow (↑) when data is sorted in ascending order
  - **Descending State**: Down arrow (↓) when data is sorted in descending order
  - **All Headers**: All table column headers (Name, Job Title, Account Name, Office Phone, User, Date Created) MUST have sorting capability

- **FR-FE-064**: System MUST display clickable links in red text for: contact names, account names, email addresses, phone numbers, and user names

- **FR-FE-065**: System MUST display action icons for each contact row in the following order:
  - Call icon (phone icon) - redirects to Calls create page
  - Calendar icon - redirects to Meetings create page
  - Tasks icon (two horizontal rows icon) - redirects to Tasks create page
  - Email icon (envelope icon) - opens new email popup

- **FR-FE-066**: System MUST display date and time in "YYYY-MM-DD HH:MM" format for Date Created column

- **FR-FE-067**: System MUST display selection indicator with format "Selected: X" where X is the count of selected contacts, with a red 'X' icon for clearing selection

### State Management

- **FR-FE-070**: System MUST maintain navigation module order state
  - When Contacts module is clicked, it moves to 1st position
  - Previously 1st position module shifts to the right

- **FR-FE-071**: System MUST maintain recently viewed contacts state
  - Track contacts that user has viewed (contacts accessed via list view, detail page, or any other means)
  - Display in "Recently Viewed" sub-menu (5th option in Contacts dropdown menu)
  - Limit to most recent 20 contacts (maximum display limit)
  - Update recently viewed list when user navigates to a contact detail page

- **FR-FE-072**: System MUST maintain filter state
  - Preserve filter selections when navigating between pages
  - Filters MUST persist across browser sessions (stored in user preferences)
  - Saved filters appear as buttons in "My Filters" section on UI

- **FR-FE-073**: System MUST maintain sort state
  - Preserve column sort order and direction
  - Sort state MUST persist across browser sessions (stored in user preferences)

- **FR-FE-074**: System MUST maintain selected contacts state for bulk actions
  - Track which contacts are selected via checkboxes
  - Clear selection when appropriate (e.g., after bulk action completion)
  - Update Bulk Action button state based on selection count

- **FR-FE-075**: System MUST maintain column visibility preferences
  - Store user's column customization preferences (add, update order, delete) per user (user-specific)
  - Apply saved preferences when loading Contacts List View
  - If no saved preferences exist, apply default columns: Name, Job Title, Account Name, Email, Office Phone, User, Date Created
  - Column preferences MUST persist across browser sessions (stored in user preferences)
  - Maximum of 7 columns can be displayed at once
  - Available columns for customization include: Name, Job Title, Account Name, Email, Office Phone, Mobile, Department, Lead Source, User, Date Created, and other contact fields

### API Integration

- **FR-FE-080**: System MUST consume backend API to fetch contacts list
  - **Endpoint**: `/api/contacts`
  - **Method**: GET
  - **Request**: Query parameters for pagination, sorting, filtering
    - `page[offset]` (integer): Pagination offset (default: 0)
    - `page[limit]` (integer): Number of records per page (default: 20, max: 100)
    - `filter` (object): Filter criteria (JSON object)
    - `sort` (string): Sort field and direction (e.g., "name", "-date_created" for descending)
    - `fields[Contacts]` (string, optional): Comma-separated list of fields to include
  - **Response**: JSON-API format with `data` array containing contact objects
    - Response structure:
      ```json
      {
        "data": [
          {
            "type": "Contacts",
            "id": "guid",
            "attributes": {
              "firstName": "John",
              "lastName": "Doe",
              "jobTitle": "Manager",
              ...
            },
            "relationships": {
              "account": {
                "data": { "type": "Accounts", "id": "account-guid" }
              },
              "assigned_user": {
                "data": { "type": "Users", "id": "user-guid" }
              }
            },
            "links": {
              "self": "/api/contacts/guid"
            }
          }
        ],
        "meta": {
          "total": 100,
          "page": {
            "offset": 0,
            "limit": 20
          }
        },
        "links": {
          "self": "/api/contacts?page[offset]=0&page[limit]=20",
          "first": "/api/contacts?page[offset]=0&page[limit]=20",
          "last": "/api/contacts?page[offset]=80&page[limit]=20",
          "prev": null,
          "next": "/api/contacts?page[offset]=20&page[limit]=20"
        }
      }
      ```
  - **Error Handling**: Display error message if API call fails
    - Parse JSON-API error format: `{ "errors": [{ "status", "code", "title", "detail", "source" }] }`
    - Display user-friendly error messages based on error codes

- **FR-FE-081**: System MUST consume backend API to create a new contact
  - **Endpoint**: `/api/contacts`
  - **Method**: POST
  - **Request**: JSON-API format with contact data
    - Request structure:
      ```json
      {
        "data": {
          "type": "Contacts",
          "attributes": {
            "title": "Mr.",
            "firstName": "John",
            "lastName": "Doe",
            "officePhone": "+1234567890",
            ...
          },
          "relationships": {
            "account": {
              "data": { "type": "Accounts", "id": "account-guid" }
            }
          }
        }
      }
      ```
  - **Response**: 201 Created - JSON-API format with created contact object in `data`
  - **Error Handling**: 
    - Parse JSON-API error format for validation errors
    - Display field-specific validation errors using `source.pointer` to map to form fields
    - Display generic error message for other errors

- **FR-FE-082**: System MUST consume backend API to import vCard file
  - **Endpoint**: `/api/contacts/import-vcard`
  - **Method**: POST
  - **Request**: multipart/form-data with file upload
    - Form data field name: `file`
    - Accepted file types: `.vcf`, `.vcard`
    - Max file size: 5MB (configurable)
  - **Response**: 201 Created - JSON-API format with created contact object, or error response
  - **Error Handling**: 
    - Display error message if file format is invalid (not .vcf or .vcard)
      - Parse JSON-API error: `{ "errors": [{ "code": "INVALID_VCARD_FORMAT", "detail": "..." }] }`
    - Display error message if vCard parsing fails
      - Parse JSON-API error: `{ "errors": [{ "code": "VCARD_PARSE_ERROR", "detail": "..." }] }`
    - Display error message if contact creation fails
      - Parse JSON-API error format and display validation errors

- **FR-FE-083**: System MUST consume backend API to import contacts (bulk import)
  - **Endpoint**: `/api/contacts/import` (inferred)
  - **Method**: POST
  - **Request**: File upload with contact data
  - **Response**: Import result with success/failure counts
  - **Error Handling**: Display import errors and validation failures

- **FR-FE-085**: System MUST consume backend API to fetch recently viewed contacts
  - **Endpoint**: `/api/contacts/recently-viewed` (inferred)
  - **Method**: GET
  - **Request**: User session information
  - **Response**: List of recently viewed contact names
  - **Error Handling**: Handle gracefully if API call fails

- **FR-FE-086**: System MUST consume backend API for bulk actions
  - **Endpoint**: `/api/contacts/bulk-action` (inferred)
  - **Method**: POST
  - **Request**: Selected contact IDs and action type (Add To Target List, Print as PDF, Delete, Export, Merge, Mass Update)
  - **Response**: Action result specific to the selected action type
  - **Error Handling**: Display error message if bulk action fails

- **FR-FE-087**: System MUST consume backend API to save column preferences
  - **Endpoint**: `/api/contacts/column-preferences` (inferred)
  - **Method**: POST/PUT
  - **Request**: User ID and column visibility preferences
  - **Response**: Success confirmation
  - **Error Handling**: Display error message if save fails

### Navigation & Routing

- **FR-FE-090**: System MUST provide navigation to Contacts List View via two routes:
  - Base route: `/contacts`
  - Index route: `/contacts/index?return_module=Contacts&return_action=DetailView`
  - Both routes MUST display the same Contacts List View page

- **FR-FE-091**: System MUST support navigation to contact detail page
  - Route: `/contacts/:id` (contact detail/edit page)
  - Access: Protected (requires authentication)
  - Triggered by: Clicking on contact name or recently viewed contact name
  - Functionality: Displays contact information in editable form, allowing users to update contact details

- **FR-FE-092**: System MUST support navigation to account detail page from contact list
  - Route: `/accounts/:id` (inferred, from Accounts module)
  - Triggered by: Clicking on account name in contact row

- **FR-FE-093**: System MUST support navigation to user profile from contact list
  - Route: `/users/:id` (inferred, from Users module)
  - Triggered by: Clicking on user name in contact row

- **FR-FE-094**: System MUST protect all Contacts routes based on user authentication
  - Redirect to login if user is not authenticated
  - Display appropriate error if user lacks required permissions

---

## Non-Functional Requirements

### User Experience

- **NFR-FE-001**: System MUST provide loading indicators when fetching contacts data
- **NFR-FE-002**: System MUST display error messages in user-friendly format when API calls fail
- **NFR-FE-003**: System MUST be responsive across mobile, tablet, and desktop viewports
- **NFR-FE-004**: System MUST provide visual feedback when hovering over clickable elements (links, buttons, icons)
- **NFR-FE-005**: System MUST provide smooth transitions when switching between views (list/grid)
- **NFR-FE-006**: System MUST display empty state message when no contacts are found

### Performance

- **NFR-FE-010**: System MUST load Contacts List View page within 2 seconds on initial load
- **NFR-FE-011**: System MUST implement pagination to handle large datasets (202+ contacts)
- **NFR-FE-012**: System MUST lazy load contact data when navigating through pages
- **NFR-FE-013**: System MUST optimize table rendering for 20+ rows per page
- **NFR-FE-014**: System MUST cache recently viewed contacts to reduce API calls

### Accessibility

- **NFR-FE-020**: System MUST support keyboard navigation for all interactive elements
- **NFR-FE-021**: System MUST provide ARIA labels for action icons (call/phone, calendar, tasks, email/envelope)
- **NFR-FE-022**: System MUST provide ARIA labels for sortable column headers
- **NFR-FE-023**: System MUST ensure sufficient color contrast for red clickable links
- **NFR-FE-024**: System MUST support screen reader announcements for pagination changes

### Browser Support

- **NFR-FE-030**: System MUST support modern browsers (Chrome, Firefox, Safari, Edge) latest 2 versions
- **NFR-FE-031**: System MUST support responsive design for mobile browsers

---

## UI Components

### ContactForm

**Description**: Form for creating a new contact with tabbed interface (Overview, More Information, Other).

**Props**:
- `onSave` (function): Callback when Save button is clicked
- `onCancel` (function): Callback when Cancel button is clicked
- `initialValues` (ContactFormData): Initial form values (optional)
- `isLoading` (boolean): Whether form is in loading state during submission

**Usage**:
- Used in Create Contact page
- Provides tabbed interface for organizing contact information
- Validates required fields (Last Name) before submission

**Styling**:
- Page header with "Create" title
- Save button (blue) and Cancel button (grey) in top right
- Tab navigation (Overview, More Information, Other)
- Two-column layout for form fields
- Active tab highlighted in dark grey

---

### OverviewTab

**Description**: Overview tab in Create Contact form containing primary contact information fields.

**Props**:
- `formData` (ContactFormData): Current form data
- `onFieldChange` (function): Callback when any field value changes
- `onEmailAdd` (function): Callback when plus icon is clicked to add email
- `onEmailRemove` (function): Callback when minus icon is clicked to remove email
- `onEmailPrimaryChange` (function): Callback when Primary checkbox is toggled
- `errors` (ValidationErrors): Validation errors object

**Usage**:
- Used within ContactForm component
- Contains primary contact fields organized in two columns
- Supports multiple email addresses with Primary designation

**Styling**:
- Two-column layout (Left Column and Right Column)
- Section labels in uppercase (NAME, PRIMARY ADDRESS, OTHER ADDRESS, DESCRIPTION)
- Required fields marked with asterisk (*)
- Multi-line text areas with resize handles
- Checkboxes for email options (Primary, Opt Out, Invalid)

---

### MoreInformationTab

**Description**: More Information tab in Create Contact form containing additional contact details like Lead Source, Reports To, and Campaign.

**Props**:
- `formData` (ContactFormData): Current form data
- `onFieldChange` (function): Callback when any field value changes
- `onLeadSourceChange` (function): Callback when Lead Source is selected
- `onReportsToChange` (function): Callback when Reports To contact is selected
- `onReportsToSearch` (function): Callback when user searches in Reports To field
- `onCampaignChange` (function): Callback when Campaign is selected
- `leadSourceOptions` (string[]): Available lead source options
- `reportsToOptions` (Contact[]): Available contacts for Reports To (filtered by search)
- `campaignOptions` (Campaign[]): Available campaigns
- `errors` (ValidationErrors): Validation errors object

**Usage**:
- Used within ContactForm component
- Contains additional contact information fields organized in two columns
- Supports searchable dropdown for Reports To field

**Styling**:
- Two-column layout (Left Column and Right Column)
- Section labels in uppercase (LEAD SOURCE, REPORTS TO, CAMPAIGN)
- Dropdown fields with arrow icons and X icons for clearing
- Search input with magnifying glass icon for Reports To field
- Empty state: Shows "Select an item" placeholder or blank when no entries exist

---

### OtherTab

**Description**: Other tab in Create Contact form containing system-generated date fields like Date Created and Date Modified.

**Props**:
- `formData` (ContactFormData): Current form data
- `dateCreated` (Date | null): Creation date of the contact (null for new contacts)
- `dateModified` (Date | null): Last modification date of the contact (null for new contacts)
- `isNewContact` (boolean): Whether this is a new contact being created

**Usage**:
- Used within ContactForm component
- Contains system-managed date fields organized in two columns
- Fields are automatically populated by system after contact creation/modification

**Styling**:
- Two-column layout (Left Column and Right Column)
- Section labels in uppercase (DATE CREATED, DATE MODIFIED)
- Date input fields
- Empty/blank state when creating new contact
- Shows date entries once contact data is created

---

### vCardImportForm

**Description**: Form for importing a contact from a vCard file (.vcf or .vcard format).

**Props**:
- `onFileSelect` (function): Callback when file is selected
- `onImport` (function): Callback when Import VCard button is clicked
- `selectedFile` (File | null): Currently selected file
- `isImporting` (boolean): Whether import is in progress
- `error` (string | null): Error message if import fails
- `onErrorDismiss` (function): Callback to dismiss error message

**Usage**:
- Used in Import VCard page
- Allows users to select and import vCard files
- Validates file format before import

**Styling**:
- Page title: "Import VCard" in large gray font
- Description text below title
- "Choose file" button (gray) with "No file chosen" text indicator
- "Import VCard" button (gray, larger) below file input
- Error message display area for invalid file formats

---

### ContactsTable

**Description**: Displays contacts in a sortable, paginated table format with action icons and clickable links.

**Props**:
- `contacts` (Contact[]): Array of contact objects to display
- `onSort` (function): Callback when column header is clicked for sorting
- `onSelect` (function): Callback when contact checkbox is toggled
- `onSelectAll` (function): Callback when header checkbox is toggled
- `onContactClick` (function): Callback when contact name is clicked
- `onAccountClick` (function): Callback when account name is clicked
- `onUserClick` (function): Callback when user name is clicked
- `onPhoneClick` (function): Callback when phone icon or phone number is clicked
- `onEmailClick` (function): Callback when envelope icon or email is clicked
- `onCalendarClick` (function): Callback when calendar icon is clicked
- `sortColumn` (string): Currently sorted column name
- `sortDirection` ('asc' | 'desc'): Current sort direction
- `selectedContacts` (string[]): Array of selected contact IDs

**Usage**:
- Used in Contacts List View page
- Displays contact data with interactive elements

**Styling**:
- Uses table layout with sortable headers
- Red text color for clickable links
- Action icons aligned in rightmost column
- Responsive table design

---

### FilterButton

**Description**: Button that opens Basic Filter panel for contacts list. Located in top right corner of module header.

**Props**:
- `onClick` (function): Callback when filter button is clicked
- `isActive` (boolean): Indicates if filters are currently applied

**Usage**:
- Used in Contacts module header (top right corner)
- Opens Basic Filter panel below module header

**Styling**:
- Grey button style with "Filter" label
- Positioned on right side of module header

---

### BulkActionButton

**Description**: Dropdown button for performing actions on multiple selected contacts.

**Props**:
- `selectedCount` (number): Number of currently selected contacts
- `onAction` (function): Callback when bulk action is selected
- `actions` (BulkAction[]): Array of available bulk actions
- `isEnabled` (boolean): Whether the button is enabled (true when at least one contact is selected)
- `isDisabled` (boolean): Whether the button is disabled (true when no contacts are selected)

**Usage**:
- Used in Contacts List View control bar (header)
- Disabled by default, enabled when one or more contacts are selected
- Provides access to bulk actions: Add To Target List, Print as PDF, Delete, Export, Merge, Mass Update

**Styling**:
- Dropdown button with arrow indicator
- Disabled state (greyed out) when no contacts selected
- Enabled state when contacts are selected

---

### PaginationControls

**Description**: Controls for navigating through paginated contact data.

**Props**:
- `currentPage` (number): Current page number
- `pageSize` (number): Number of items per page
- `totalCount` (number): Total number of contacts
- `onPageChange` (function): Callback when page navigation occurs
- `onFirstPage` (function): Callback for first page button (<<)
- `onPreviousPage` (function): Callback for previous page button (<)
- `onNextPage` (function): Callback for next page button (>)
- `onLastPage` (function): Callback for last page button (>>)
- `position` ('header' | 'footer'): Position of pagination controls

**Usage**:
- Used in Contacts List View control bar (both header and footer)
- Displays current range and total count between Previous and Next buttons
- Same functionality in both positions
- **Button Order**: First page (<<), Previous page (<), Page entry details, Next page (>), Last page (>>)

**Styling**:
- Navigation buttons with white outline on dark grey background
- First page button: "<<" (double left arrow)
- Previous page button: "<" (single left arrow)
- Page entry details: "(X - Y of Z)" in bold white font (e.g., "(1 - 20 of 200)")
- Next page button: ">" (single right arrow)
- Last page button: ">>" (double right arrow)
- Disabled state for buttons when at first/last page

---

### ViewToggleButtons

**Description**: Toggle buttons for switching between list and grid/card view.

**Props**:
- `currentView` ('list' | 'grid'): Currently active view
- `onViewChange` (function): Callback when view is toggled

**Usage**:
- Used in Contacts List View control bar
- Allows users to switch between view formats

**Styling**:
- Two icon buttons (list icon, grid icon)
- Active view is highlighted
- Smooth transition between views

---

### ChooseColumnsButton

**Description**: Button (burger icon) that opens a modal popup for customizing visible columns in the contacts table.

**Props**:
- `onClick` (function): Callback when button is clicked
- `currentColumns` (Column[]): Array of currently displayed columns
- `hiddenColumns` (Column[]): Array of currently hidden columns

**Usage**:
- Used in Contacts List View control bar (header)
- Opens Choose Columns modal popup

**Styling**:
- Burger icon (three horizontal lines)
- Positioned next to Bulk Action button

---

### ChooseColumnsModal

**Description**: Modal popup for customizing which columns are displayed in the contacts table. Allows users to add, update (reorder), and delete (hide) columns.

**Props**:
- `isOpen` (boolean): Whether the modal is open
- `onClose` (function): Callback when modal is closed
- `displayedColumns` (Column[]): Array of columns in DISPLAYED section
- `hiddenColumns` (Column[]): Array of columns in HIDDEN section
- `onColumnMove` (function): Callback when column is moved between sections
- `onColumnReorder` (function): Callback when column order is changed within DISPLAYED section
- `onSave` (function): Callback when save button is clicked
- `onCancel` (function): Callback when cancel button is clicked

**Usage**:
- Opened by ChooseColumnsButton
- Allows users to:
  - **Add columns**: Drag columns from HIDDEN to DISPLAYED section
  - **Update columns**: Reorder columns within DISPLAYED section
  - **Delete columns**: Drag columns from DISPLAYED to HIDDEN section
- Saves column preferences when user clicks save button

**Styling**:
- Modal overlay with centered popup
- Title: "Choose Columns" centered at top
- Close button (X) in top right corner
- Two sections: DISPLAYED (left, purple background) and HIDDEN (right, red/salmon background)
- Column items as draggable rectangular buttons
- Two buttons at bottom (Save and Cancel, inferred)

---

### SelectionIndicator

**Description**: Component that displays the count of selected contacts with a clear button.

**Props**:
- `selectedCount` (number): Number of currently selected contacts
- `onClear` (function): Callback when clear button (red X) is clicked

**Usage**:
- Used in Contacts List View control bar (header)
- Displays "Selected: X" with red X icon for clearing selection

**Styling**:
- Text format: "Selected: X" where X is the count
- Red X icon for clearing selection
- Positioned next to header checkbox

---

### BasicFilterPanel

**Description**: Filter panel that opens below module header when Filter button is clicked. Contains Basic Filter form and Quick Filter section.

**Props**:
- `isOpen` (boolean): Whether the filter panel is open
- `onClose` (function): Callback when filter panel is closed
- `onSearch` (function): Callback when Search button is clicked
- `onClear` (function): Callback when Clear button is clicked
- `onSave` (function): Callback when Save button is clicked
- `filterValues` (FilterValues): Current filter values
- `onFilterChange` (function): Callback when filter field values change

**Usage**:
- Opened by FilterButton
- Contains Basic Filter form with three columns of input fields
- Contains Quick Filter section at bottom
- Allows users to filter contacts by various criteria

**Styling**:
- Panel opens below module header
- Grey bar with "Basic Filter" label and close button (X)
- Three-column layout for filter fields
- Quick Filter section with light red/pink background
- Search button (red background, white text)
- Clear button (red text on light red background)
- Save button (white text on light red background)

---

### ContactsDropdownMenu

**Description**: Dropdown menu that appears when hovering over Contacts navigation item.

**Props**:
- `onCreateContact` (function): Callback for "Create Contact" option
- `onCreateFromVCard` (function): Callback for "Create Contact From vC..." option
- `onViewContacts` (function): Callback for "View Contacts" option
- `onImportContacts` (function): Callback for "Import Contacts" option
- `recentlyViewed` (Contact[]): Array of recently viewed contacts
- `onRecentlyViewedClick` (function): Callback when recently viewed contact is clicked

**Usage**:
- Used in main navigation bar
- Provides quick access to Contacts module actions

**Styling**:
- Dropdown menu with icons for each option
- Sub-menu for "Recently Viewed" that appears on hover
- Positioned below Contacts navigation item

---

## User Flows

### Flow 1: View Contacts List

**Description**: User navigates to Contacts module and views the list of contacts with default columns.

**Steps**:
1. User logs in and lands on Home page
2. User clicks on "Contacts" in navigation bar
3. System moves Contacts to 1st position in navigation, shifts previous 1st module to the right
4. System navigates to Contacts List View page (`/contacts`)
5. System displays contacts table with default columns: Name, Job Title, Account Name, Email, Office Phone, User, Date Created
6. All column headers display sort indicators (up/down arrows)
7. System displays pagination controls in header and footer
8. User can interact with contacts (sort, filter, select, view details, perform quick actions)

**Entry Point**: Home page or any page with navigation bar
**Exit Point**: Contacts List View page with default columns displayed

---

### Flow 2: Access Contacts via Dropdown Menu

**Description**: User accesses Contacts module options via dropdown menu.

**Steps**:
1. User hovers over "Contacts" in navigation bar
2. System displays dropdown menu with 5 options
3. User can:
   - Click "Create Contact" to create new contact
   - Click "Create Contact From vC..." to import from vCard
   - Click "View Contacts" to view contacts list
   - Click "Import Contacts" to bulk import contacts
   - Hover over "Recently Viewed" to see sub-menu
4. If user hovers over "Recently Viewed" (5th option), system displays sub-menu with recently viewed contact names
5. User clicks on a recently viewed contact name
6. System navigates to that contact's detail page (`/contacts/:id`)
7. System displays contact information in editable form, allowing user to update contact details
8. User can modify contact information and save changes

**Entry Point**: Navigation bar
**Exit Point**: Various (depends on selected option)

---

### Flow 3: Sort Contacts

**Description**: User sorts contacts by clicking on column headers.

**Steps**:
1. User is on Contacts List View page
2. User clicks on a column header (e.g., "Date Created")
3. System sorts contacts in ascending order and displays up arrow (↑) indicator
4. User clicks on the same column header again
5. System sorts contacts in descending order and displays down arrow (↓) indicator
6. User can toggle between ascending and descending by clicking the column header
7. Table data updates immediately after each sort action

**Entry Point**: Contacts List View page
**Exit Point**: Contacts List View page with sorted results

---

### Flow 3A: Filter Contacts

**Description**: User filters contacts to find specific records.

**Steps**:
1. User is on Contacts List View page
2. User clicks on "Filter" button
3. System displays filter interface
4. User applies filter criteria
5. System filters contacts and updates table display
6. Pagination resets to first page

**Entry Point**: Contacts List View page
**Exit Point**: Contacts List View page with filtered results

---

### Flow 4: Quick Actions from Contact List (Call, Meeting, Task, Email)

**Description**: User performs quick actions on a contact directly from the contacts list using action icons. This is a separate story for action icons functionality.

**Steps**:
1. User is on Contacts List View page
2. User identifies a contact in the table
3. User clicks on one of the four action icons in the contact row:
   
   **Option A: Create Call**
   - User clicks call icon (phone icon)
   - System navigates to Calls module create page
   - Contact information is pre-filled in the call form
   - User completes call details and saves
   
   **Option B: Create Meeting**
   - User clicks calendar icon
   - System navigates to Meetings module create page
   - Contact information is pre-filled in the meeting form
   - User completes meeting details and saves
   
   **Option C: Create Task**
   - User clicks tasks icon (two horizontal rows icon)
   - System navigates to Tasks module create page
   - Contact information is pre-filled in the task form
   - User completes task details and saves
   
   **Option D: Send Email**
   - User clicks email icon (envelope icon)
   - System opens new email popup/modal
   - Contact's email address is pre-filled as recipient
   - User composes and sends email
   - Email popup closes after sending

**Entry Point**: Contacts List View page
**Exit Point**: 
- Calls create page (for call icon)
- Meetings create page (for calendar icon)
- Tasks create page (for tasks icon)
- Email popup (for email icon)

---

### Flow 5: Navigate to Related Records

**Description**: User navigates from contact to related account or user profile.

**Steps**:
1. User is on Contacts List View page
2. User clicks on account name (red, clickable link) in a contact row
3. System navigates to Account detail page
4. OR: User clicks on user name (red, clickable link) in a contact row
5. System navigates to User profile page

**Entry Point**: Contacts List View page
**Exit Point**: Account detail page or User profile page

---

### Flow 6: Bulk Actions on Contacts

**Description**: User selects multiple contacts and performs bulk actions.

**Steps**:
1. User is on Contacts List View page
2. User selects contacts using checkboxes (individual or select all via header checkbox)
3. System displays "Selected: X" indicator with red X icon
4. System enables "Bulk Action" button (changes from disabled to enabled state)
5. User clicks on "Bulk Action" dropdown
6. System displays dropdown menu with options:
   - Add To Target List
   - Print as PDF
   - Delete
   - Export
   - Merge
   - Mass Update
7. User selects a bulk action
8. System performs action on selected contacts
9. System displays success/error message
10. System clears selection and resets Bulk Action button to disabled state

**Entry Point**: Contacts List View page
**Exit Point**: Contacts List View page with updated data

---

### Flow 7: Customize Columns (Add, Update, Delete)

**Description**: User customizes which columns are visible in the contacts table by adding, updating order, or deleting columns.

**Steps**:
1. User is on Contacts List View page
2. User clicks on "Choose Columns" button (burger icon)
3. System opens "Choose Columns" modal popup
4. Modal displays two sections:
   - DISPLAYED section (left, purple background) with currently visible columns
   - HIDDEN section (right, red/salmon background) with hidden columns
5. User performs column management:
   - **Add Column**: Drags a column from HIDDEN to DISPLAYED section
   - **Update Column Order**: Drags columns within DISPLAYED section to reorder
   - **Delete Column**: Drags a column from DISPLAYED to HIDDEN section
6. User clicks "Save" button (inferred)
7. System saves column preferences (additions, order updates, deletions)
8. System closes modal and updates table to reflect new column visibility and order
9. OR: User clicks "Cancel" or close button (X)
10. System closes modal without saving changes, table remains unchanged

**Entry Point**: Contacts List View page
**Exit Point**: Contacts List View page with updated column visibility and order (if saved)

---

### Flow 8: Navigate Using Footer Pagination

**Description**: User navigates through contact pages using footer pagination controls.

**Steps**:
1. User is on Contacts List View page
2. User scrolls to bottom of page
3. User sees footer pagination controls (same as header)
4. User clicks on pagination arrows (<<, <, >, >>)
5. System updates page and loads new set of contacts
6. Pagination information updates: "(X - Y of Z)"
7. User can navigate through all pages using footer controls

**Entry Point**: Contacts List View page (scrolled to bottom)
**Exit Point**: Contacts List View page (different page of contacts)

---

### Flow 10: Create New Contact

**Description**: User creates a new contact using the Create Contact form with Overview tab.

**Steps**:
1. User is on Contacts List View page or any page with navigation
2. User hovers over "Contacts" in navigation bar
3. User clicks "Create Contact" from dropdown menu
4. System navigates to Create Contact page (`/contacts/create`)
5. System displays Create Contact form with Overview tab active (default)
6. User fills in Overview tab fields:
   - **Left Column:**
     - Selects Title from dropdown (Mr., Ms., Mrs., Miss, Dr., Prof.)
     - Enters First Name
     - Enters Last Name (required field, marked with asterisk)
     - Enters Office Phone
     - Enters Job Title
     - Selects/searches Account Name
     - Adds Email Address(es) using plus icon
     - Marks email as Primary (checkbox)
     - Optionally checks Opt Out or Invalid checkboxes
     - Enters Primary Address Street
   - **Right Column:**
     - Assigned To is pre-filled with current user
     - Enters Mobile
     - Enters Department
     - Enters Alternate Address Street
   - **Additional Sections:**
     - Fills Primary Address details (Street, Postal Code, City, State, Country)
     - Fills Other Address details (Alternate Address Street, Postal Code, City, State, Country)
     - Enters Description (optional)
7. User can switch to "More Information" tab to add:
   - Lead Source (select from dropdown: Cold Call, Existing Customer, Self Generated, Employee, Partner, Public Relations, Direct Mail, Conference, Trade Show, Web Site, Word of mouth, Email, Campaign, Other)
   - Reports To (searchable dropdown to select a contact)
   - Campaign (select from dropdown)
8. User can switch to "Other" tab to view:
   - Date Created (shows creation date once contact is created, empty for new contacts)
   - Date Modified (shows modification date once contact is created/modified, empty for new contacts)
9. User clicks "Save" button
10. System validates form (checks if Last Name is provided)
11. If validation passes, system creates contact and redirects to contact detail page or list page
12. If validation fails, system displays error messages
13. OR: User clicks "Cancel" button
14. System closes form and redirects to Contacts List View page without saving

**Entry Point**: Contacts dropdown menu or Contacts List View page
**Exit Point**: Contact detail page (on successful save) or Contacts List View page (on cancel or after save)

---

### Flow 11: Import Contact From vCard

**Description**: User imports a contact from a vCard file (.vcf or .vcard format).

**Steps**:
1. User is on Contacts List View page or any page with navigation
2. User hovers over "Contacts" in navigation bar
3. User clicks "Create Contact From vC..." from dropdown menu
4. System navigates to Import VCard page (`/contacts/importvcard`)
5. System displays Import VCard form with:
   - Title: "Import VCard"
   - Description: "Automatically create a new contact by importing a vCard from your file system."
   - "Choose file" button with "No file chosen" text
   - "Import VCard" button
6. User clicks "Choose file" button
7. System opens file selection dialog
8. User selects a file:
   - **Valid File Path**: User selects a .vcf or .vcard file
   - **Invalid File Path**: User selects a file with different extension
9. File name appears next to "Choose file" button (inferred)
10. User clicks "Import VCard" button
11. System validates file format:
    - **If valid (.vcf or .vcard)**: 
      - System processes vCard file
      - System extracts contact information
      - System creates new contact record
      - System displays success message
      - System redirects to View Contacts page or contact detail page
      - Imported contact appears in View Contacts list
      - Contact appears in other relevant sections (Recently Viewed, search results, etc.)
    - **If invalid (other formats)**:
      - System displays error message
      - Error indicates only .vcf and .vcard files are accepted
      - Import is rejected, no contact is created
      - User can select a different file

**Entry Point**: Contacts dropdown menu
**Exit Point**: View Contacts page with imported contact (on success) or Import VCard page with error message (on failure)

---

## Error Handling

### Error Scenarios

- **ERR-FE-001**: When API call to fetch contacts fails, system MUST display error message and allow user to retry
- **ERR-FE-002**: When no contacts are found (after filtering or search), system MUST display empty state message
- **ERR-FE-003**: When user lacks permission to access Contacts module, system MUST display access denied message
- **ERR-FE-004**: When contact creation fails due to validation errors, system MUST display field-specific error messages
- **ERR-FE-005**: When contact import fails, system MUST display detailed error information including failed records
- **ERR-FE-006**: When bulk action fails, system MUST display error message and maintain selection state for retry
- **ERR-FE-007**: When pagination request fails, system MUST display error message and maintain current page state
- **ERR-FE-008**: When column preferences save fails, system MUST display error message and keep modal open for retry
- **ERR-FE-009**: When drag and drop operation fails in Choose Columns modal, system MUST revert column to original position
- **ERR-FE-010**: When invalid file format is selected for vCard import (not .vcf or .vcard), system MUST display error message and reject the import
- **ERR-FE-011**: When vCard file parsing fails, system MUST display error message indicating the file could not be processed

### Error Display

- **ERR-FE-010**: System MUST display errors in toast notifications or inline error messages
- **ERR-FE-011**: System MUST provide retry button for failed API operations
- **ERR-FE-012**: System MUST display validation errors inline with form fields
  - Parse JSON-API error format: `{ "errors": [{ "source": { "pointer": "/data/attributes/fieldName" }, "detail": "Error message" }] }`
  - Map `source.pointer` to form field names (e.g., "/data/attributes/lastName" → lastName field)
  - Display error message from `detail` field next to corresponding form field
- **ERR-FE-013**: System MUST display user-friendly error messages (avoid technical jargon)
- **ERR-FE-014**: System MUST handle JSON-API error response format
  - Parse `errors` array from response
  - Extract error code, title, and detail from each error object
  - Display appropriate error message based on error code (e.g., "VALIDATION_ERROR", "CONTACT_NOT_FOUND", "ACCESS_DENIED")

---

## Success Criteria

- **SC-FE-001**: Contacts List View page loads within 2 seconds on initial load
- **SC-FE-002**: Users can navigate to Contacts module and view contacts list in under 2 clicks from Home page
- **SC-FE-003**: All functional requirements are implemented and tested
- **SC-FE-004**: 90% of users successfully complete primary task (view contacts) on first attempt
- **SC-FE-005**: Sorting and filtering operations complete within 1 second
- **SC-FE-006**: Pagination navigation is smooth with no visible loading delays
- **SC-FE-007**: All clickable elements provide visual feedback within 100ms
- **SC-FE-008**: Module reordering in navigation works smoothly without page refresh

---

## Notes

- Reference `product-info/product-overview.md` for system roles and common functionalities
- Reference `specs/contacts/frontend-specs.md` for technical implementation details
- Use Shadcn UI components from `src/components/ui` when possible
- Follow frontend structure guidelines in `.cursor/rules/frontend-structure.mdc`
- Mark unclear requirements with `[NEEDS CLARIFICATION: description]`
- **API Conventions**:
  - All API requests and responses use JSON-API format (JSON-API 1.0 specification)
  - Datetime values are in ISO 8601 format (e.g., "2024-01-01T00:00:00Z")
  - Error responses follow JSON-API error format with `errors` array
  - Pagination uses `page[offset]` and `page[limit]` query parameters
  - Field selection uses `fields[Contacts]` query parameter with comma-separated field names
- **Data Mapping**:
  - Transform JSON-API response `data.attributes` to form field values
  - Transform JSON-API response `data.relationships` to related record references
  - Transform form values to JSON-API request `data.attributes` format
  - Handle date/time transformations between ISO 8601 (API) and display formats (UI)
- **Component Patterns**:
  - Use reusable field components based on field type (text, email, phone, date, enum, relate, etc.)
  - Form components should handle validation errors from JSON-API error responses
  - Table components should handle JSON-API pagination metadata from `meta` and `links` objects

### Open Questions

**All open questions have been resolved and incorporated into the requirements above.**

