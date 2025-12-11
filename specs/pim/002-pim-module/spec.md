# Feature Specification: OrangeHRM Personnel Information Management (PIM) Module

**Feature Branch**: `002-pim-module`  
**Created**: December 09, 2025  
**Status**: Draft  
**Input**: User description: "Personnel Information Management system for OrangeHRM with employee listing, search, creation, and reporting capabilities"

## Clarifications

### Session 2025-12-09

- Q: When two users edit the same employee record simultaneously, how should the system resolve the conflict? → A: Last-write-wins with warning notification - The last save succeeds, but the first user gets a warning that their changes were overwritten
- Q: When a user without proper permissions tries to access restricted pages (Add Employee or Edit Employee), what should the system do? → A: Redirect to employee list with error message - Redirect user to Employee List page and display an error notification explaining insufficient permissions
- Q: When an employee is deleted, should the deletion be permanent or should the record be archived/soft-deleted for potential recovery? → A: Soft delete with archive - Employee record is marked as deleted but retained in the database for audit/compliance purposes
- Q: What are the file size limits and allowed file types for employee attachments? → A: Maximum 5MB per file, allow common document types (PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View and Search Employee List (Priority: P1)

HR administrators and managers need to quickly access and filter through the organization's employee database to find specific employees or groups of employees based on various criteria such as name, employee ID, job title, employment status, supervisor, or sub-unit.

**Why this priority**: This is the foundation of the PIM module. Without the ability to view and search employees, no other employee management tasks can be performed. It delivers immediate value by making employee information accessible and searchable.

**Independent Test**: Can be fully tested by navigating to the Employee List page, entering search criteria (name, ID, job title, etc.), clicking Search, and verifying that the system returns accurate filtered results. Delivers value by allowing users to locate any employee in the system within seconds.

**Acceptance Scenarios**:

1. **Given** I am on the Employee List page, **When** I view the page without applying filters, **Then** I see all employees displayed in a table with columns for ID, First and Middle Name, Last Name, Job Title, Employment Status, Sub Unit, Supervisor, and Actions
2. **Given** I am on the Employee List page, **When** I enter an employee name in the "Employee Name" search field and click Search, **Then** the system filters the list to show only employees matching that name
3. **Given** I am on the Employee List page, **When** I enter an employee ID in the "Employee Id" field and click Search, **Then** the system displays only the employee with that specific ID
4. **Given** I am on the Employee List page, **When** I select a specific Employment Status from the dropdown and click Search, **Then** the system shows only employees with that employment status
5. **Given** I am on the Employee List page, **When** I select a specific Job Title from the dropdown and click Search, **Then** the system displays only employees with that job title
6. **Given** I am on the Employee List page, **When** I select a specific Sub Unit from the dropdown and click Search, **Then** the system filters to show only employees in that sub-unit
7. **Given** I am on the Employee List page, **When** I enter a supervisor name and click Search, **Then** the system shows only employees reporting to that supervisor
8. **Given** I have applied filters to the employee list, **When** I click the Reset button, **Then** all filters are cleared and the full employee list is displayed
9. **Given** I am viewing the employee list, **When** I click on column headers, **Then** the list is sorted by that column (ascending or descending)
10. **Given** the system contains 158 employees, **When** I view the Employee List page, **Then** I see "(158) Records Found" displayed above the table

---

### User Story 2 - Add New Employee (Priority: P1)

HR administrators need to add new employees to the system by entering their basic information including full name (first, middle, last), employee ID, and optionally creating login credentials for the employee to access the system.

**Why this priority**: Creating new employee records is a core function that must work before any other employee data can be managed. This is essential for onboarding and delivers immediate value by allowing the organization to maintain an up-to-date employee roster.

**Independent Test**: Can be fully tested by clicking the "+Add" button, filling in the employee form with required information (first name, last name, employee ID), optionally enabling "Create Login Details" and providing credentials, clicking Save, and verifying the new employee appears in the employee list.

**Acceptance Scenarios**:

1. **Given** I am on the Employee List page, **When** I click the "+Add" button, **Then** I am taken to the "Add Employee" page with an empty form
2. **Given** I am on the Add Employee page, **When** I view the form, **Then** I see fields for First Name, Middle Name, Last Name (marked as required with "Employee Full Name*"), Employee Id (pre-filled with a suggested ID like "0445"), a profile photo upload area, and a "Create Login Details" toggle
3. **Given** I am on the Add Employee page, **When** I enter a valid first name and last name, **Then** the system accepts the input without errors
4. **Given** I am on the Add Employee page, **When** I leave the Employee Id field empty or modify it, **Then** the system allows custom employee IDs
5. **Given** I am on the Add Employee page, **When** I click the profile photo upload button (indicated by "+"), **Then** I can upload an image file (jpg, png, gif up to 1MB, recommended dimensions 200px X 200px)
6. **Given** I am on the Add Employee page with the "Create Login Details" toggle disabled, **When** I fill in required fields and click Save, **Then** the employee is created without login credentials
7. **Given** I am on the Add Employee page, **When** I enable the "Create Login Details" toggle, **Then** additional fields appear for Username (required), Password (required), Confirm Password (required), and Status (Enabled/Disabled radio buttons)
8. **Given** I have enabled "Create Login Details", **When** I enter a username, password, and confirm password (matching), **Then** the system accepts the credentials
9. **Given** I have enabled "Create Login Details", **When** I enter passwords that don't match, **Then** the system displays a validation error
10. **Given** I am on the Add Employee page with valid data entered, **When** I click Save, **Then** the employee is created and I am redirected to the employee's detail page or back to the Employee List
11. **Given** I am on the Add Employee page, **When** I click Cancel, **Then** no employee is created and I am returned to the Employee List page
12. **Given** I am entering a password, **When** I view the password field, **Then** I see a hint: "For a strong password, please use a hard to guess combination of text with upper and lower case characters, symbols and numbers"

---

### User Story 3 - Edit Employee Information (Priority: P2)

HR administrators need to update existing employee information when employees change roles, departments, or personal details, maintaining accurate and current records throughout the employee lifecycle.

**Why this priority**: While creating employees is critical, the ability to maintain and update their information over time is equally important for data accuracy. This supports organizational changes and employee career progression.

**Independent Test**: Can be fully tested by clicking the edit icon (pencil) next to any employee in the list, modifying employee details, clicking Save, and verifying the changes are reflected in the employee list and detail views.

**Acceptance Scenarios**:

1. **Given** I am viewing the Employee List, **When** I click the edit icon (pencil) in the Actions column for any employee, **Then** I am taken to that employee's edit page with their current information pre-filled
2. **Given** I am on an employee's edit page, **When** I modify any field (name, job title, etc.), **Then** the system allows the changes without data loss
3. **Given** I have modified employee information, **When** I click Save, **Then** the changes are persisted and I see a confirmation
4. **Given** I am on an employee's edit page, **When** I click Cancel, **Then** no changes are saved and I am returned to the previous page

---

### User Story 4 - Delete Employee Records (Priority: P2)

HR administrators need to remove employee records from the system when employees leave the organization or when records are created in error, maintaining data accuracy and compliance with retention policies.

**Why this priority**: Data hygiene is important but less critical than viewing and creating employees. This feature ensures the database remains accurate and manageable over time.

**Independent Test**: Can be fully tested by selecting one or more employees using checkboxes, clicking the delete icon (trash can) in the Actions column, confirming the deletion in a confirmation dialog, and verifying the employee(s) no longer appear in the list.

**Acceptance Scenarios**:

1. **Given** I am viewing the Employee List, **When** I click the delete icon (trash can) in the Actions column for any employee, **Then** I see a confirmation dialog asking me to confirm the deletion
2. **Given** I see a deletion confirmation dialog, **When** I confirm the deletion, **Then** the employee record is permanently removed from the system
3. **Given** I see a deletion confirmation dialog, **When** I cancel the deletion, **Then** the employee record is not deleted and remains in the list
4. **Given** I am viewing the Employee List, **When** I select multiple employees using the checkboxes and perform a bulk delete action, **Then** all selected employees are deleted after confirmation

---

### User Story 5 - Generate and Manage Employee Reports (Priority: P3)

HR administrators and managers need to generate various predefined reports about employees (such as Sub Unit Hierarchy, Contact Information, Job Details) to analyze workforce data, support decision-making, and meet compliance requirements.

**Why this priority**: Reporting is valuable but not essential for basic employee management. It enhances the system's utility for analysis and decision-making after core CRUD operations are in place.

**Independent Test**: Can be fully tested by navigating to the Reports tab, viewing the list of available reports (5 records shown: All Employee Sub Unit Hierarchy Report, Employee Contact info report, Employee Job Details, PIM Sample Report, PT), clicking on a report to execute it, and verifying the report displays or downloads with accurate employee data.

**Acceptance Scenarios**:

1. **Given** I am in the PIM module, **When** I click on the "Reports" tab, **Then** I see a list of available employee reports with a search field to filter by report name
2. **Given** I am on the Reports page, **When** I view the page, **Then** I see a list showing 5 predefined reports including "All Employee Sub Unit Hierarchy Report", "Employee Contact info report", "Employee Job Details", "PIM Sample Report", and "PT"
3. **Given** I am on the Reports page, **When** I click the "+Add" button, **Then** I can create a new custom report definition
4. **Given** I am viewing the report list, **When** I enter text in the "Report Name" search field and click Search, **Then** the list filters to show only reports matching the search term
5. **Given** I am viewing a report in the list, **When** I click the view/execute icon (document icon) in the Actions column, **Then** the report is generated and displayed or downloaded
6. **Given** I am viewing a report in the list, **When** I click the edit icon (pencil) in the Actions column, **Then** I can modify the report definition
7. **Given** I am viewing a report in the list, **When** I click the delete icon (trash can) in the Actions column, **Then** I can delete the report definition after confirmation
8. **Given** I am on the Reports page, **When** I click Reset, **Then** any applied search filters are cleared and all reports are displayed

---

### User Story 6 - Include/Exclude Employees in Views (Priority: P3)

Users need to filter the employee list to show only current employees or include all employees (current and past) to focus on active workforce data or include historical records as needed.

**Why this priority**: This filtering capability enhances usability but is not critical for basic operations. It's a nice-to-have feature that improves user experience.

**Independent Test**: Can be fully tested by selecting "Current Employees Only" from the Include dropdown on the Employee List page and verifying only active employees are shown, then selecting to include all employees and verifying both current and past employees appear.

**Acceptance Scenarios**:

1. **Given** I am on the Employee List page, **When** I view the "Include" dropdown, **Then** I see it is set to "Current Employees Only" by default
2. **Given** I am on the Employee List page, **When** I select "Current Employees Only" from the Include dropdown and search, **Then** the system displays only employees with active employment status
3. **Given** I am on the Employee List page, **When** I change the Include filter to show all employees and search, **Then** the system displays both current and past employees

---

### User Story 7 - Create Custom Reports (Priority: P2)

HR administrators need to create custom employee reports by defining report names, selection criteria for filtering employees, and specifying which display fields to include in the report output.

**Why this priority**: Custom reporting capability extends the value of predefined reports by allowing organizations to create reports tailored to their specific needs. This is important for flexibility but not essential for basic operations.

**Independent Test**: Can be fully tested by clicking "+Add" on the Reports page, entering a report name, selecting selection criteria (e.g., "Current Employees Only"), choosing display field groups and specific fields, clicking Save, and verifying the new report appears in the reports list and can be executed.

**Acceptance Scenarios**:

1. **Given** I am on the Reports page, **When** I click the "+Add" button, **Then** I am taken to the "Add Report" page with an empty form
2. **Given** I am on the Add Report page, **When** I view the form, **Then** I see fields for Report Name (required), Selection Criteria section, and Display Fields section
3. **Given** I am on the Add Report page, **When** I enter a report name in the "Report Name" field, **Then** the system accepts the input
4. **Given** I am viewing the Selection Criteria section, **When** I see the available options, **Then** I can select criteria from a dropdown (e.g., "-- Select --") and an "Include" dropdown showing "Current Employees Only"
5. **Given** I am viewing the Selection Criteria section, **When** I click the "+" button next to Selection Criteria, **Then** I can add multiple selection criteria filters
6. **Given** I am viewing the Display Fields section, **When** I see the available options, **Then** I see "Select Display Field Group" and "Select Display Field" dropdowns (both showing "-- Select --")
7. **Given** I am on the Add Report page, **When** I select a Display Field Group from the dropdown, **Then** the Select Display Field dropdown populates with relevant fields from that group
8. **Given** I am viewing the Display Fields section, **When** I click the "+" button, **Then** I can add multiple display fields to the report
9. **Given** I have filled in all required report fields, **When** I click Save, **Then** the custom report is created and appears in the reports list
10. **Given** I am on the Add Report page, **When** I click Cancel, **Then** no report is created and I am returned to the Reports list

---

### User Story 8 - Configure Optional Fields and Country-Specific Information (Priority: P3)

System administrators need to configure which optional employee fields are displayed in the system, including deprecated fields like Nick Name, Smoker, and Military Service, as well as country-specific information fields like SSN, SIN, and US Tax Exemptions.

**Why this priority**: Configuration options allow organizations to customize the system to their specific needs and regional requirements. This is valuable for customization but not critical for core functionality.

**Independent Test**: Can be fully tested by navigating to Configuration from the Configuration dropdown, toggling optional field settings (Show Deprecated Fields, Show SSN, Show SIN, Show US Tax Exemptions), clicking Save, and verifying the changes are reflected in the employee detail pages.

**Acceptance Scenarios**:

1. **Given** I am in the PIM module, **When** I click on the "Configuration" dropdown and select the configuration option, **Then** I am taken to the PIM Configuration page
2. **Given** I am on the PIM Configuration page, **When** I view the page, **Then** I see "Optional Fields" section with "Show Deprecated Fields" option and "Country Specific Information" section
3. **Given** I am viewing the Optional Fields section, **When** I see the "Show Deprecated Fields" toggle, **Then** I see the description "Show Nick Name, Smoker and Military Service in Personal Details"
4. **Given** I am viewing the Country Specific Information section, **When** I view the options, **Then** I see toggles for "Show SSN field in Personal Details", "Show SIN field in Personal Details", and "Show US Tax Exemptions menu"
5. **Given** I have modified any configuration toggles, **When** I click Save, **Then** the configuration changes are persisted and applied system-wide
6. **Given** the "Show Deprecated Fields" is enabled, **When** I view an employee's Personal Details page, **Then** I see fields for Nick Name, Smoker, and Military Service
7. **Given** the "Show SSN field in Personal Details" is enabled, **When** I view an employee's Personal Details page, **Then** I see an SSN field
8. **Given** the "Show SIN field in Personal Details" is enabled, **When** I view an employee's Personal Details page, **Then** I see a SIN field
9. **Given** the "Show US Tax Exemptions menu" is enabled, **When** I navigate employee details, **Then** I see a US Tax Exemptions menu option

---

### User Story 9 - Manage Custom Fields (Priority: P2)

System administrators need to create, edit, and delete custom fields to capture organization-specific employee information beyond the standard fields, including the ability to specify field types (text, number, dropdown) and which screen the field appears on.

**Why this priority**: Custom fields allow organizations to extend the system to capture unique data requirements. This is important for system flexibility and adoption but not essential for basic employee management.

**Independent Test**: Can be fully tested by navigating to Custom Fields from Configuration, clicking "+Add", entering a field name, selecting a type (Drop Down or Text or Number) and screen (e.g., Personal Details), entering dropdown options if applicable, clicking Save, and verifying the custom field appears in the custom fields list and on the specified employee screen.

**Acceptance Scenarios**:

1. **Given** I am in PIM Configuration, **When** I navigate to the Custom Fields page, **Then** I see a list of existing custom fields with columns for Custom Field Name, Screen, Field Type, and Actions
2. **Given** I am on the Custom Fields page, **When** I view the page, **Then** I see "(2) Records Found" and information showing "Remaining number of custom fields: 8" (indicating a limit of 10 total custom fields)
3. **Given** I am viewing the custom fields list, **When** I see existing fields, **Then** I see examples like "Blood Type" (Personal Details, Drop Down) and "Test_Field" (Personal Details, Text or Number)
4. **Given** I am on the Custom Fields page, **When** I click the "+Add" button, **Then** I am taken to the "Add Custom Field" page
5. **Given** I am on the Add Custom Field page, **When** I view the form, **Then** I see fields for Field Name (required), Screen (required dropdown), and Type (required dropdown)
6. **Given** I am on the Add Custom Field page, **When** I enter a field name and select a screen and type, **Then** the system accepts the input
7. **Given** I am adding a custom field, **When** I select "Drop Down" as the Type, **Then** additional fields appear for "Select Options" where I can enter comma-separated dropdown values
8. **Given** I am editing an existing dropdown custom field (e.g., Blood Type), **When** I view the Edit Custom Field page, **Then** I see the Select Options field pre-filled with existing values like "A+,A-,B+,B-,O+,O-,AB+,AB-" and the instruction "Enter allowed options separated by commas"
9. **Given** I have filled in all required custom field information, **When** I click Save, **Then** the custom field is created and appears in the custom fields list
10. **Given** I am on the Add/Edit Custom Field page, **When** I click Cancel, **Then** no changes are saved and I am returned to the Custom Fields list
11. **Given** I am viewing the custom fields list, **When** I click the edit icon for a custom field, **Then** I can modify the field definition
12. **Given** I am viewing the custom fields list, **When** I click the delete icon for a custom field, **Then** I see a confirmation dialog
13. **Given** I see a delete confirmation for a custom field that is in use, **When** the system checks for usage, **Then** I see an error message "Custom field(s) in use" preventing deletion
14. **Given** I have reached the limit of 10 custom fields, **When** I am on the Custom Fields page, **Then** the "+Add" button is disabled or shows that no more fields can be added (Remaining: 0)

---

### User Story 10 - Import Employee Data (Priority: P2)

HR administrators need to bulk import employee data from CSV files to quickly populate the system with multiple employee records, following specific formatting requirements including column order, date formats, and record size limits.

**Why this priority**: Bulk import is essential for initial system setup or migrating from legacy systems, but not required for day-to-day operations. It delivers significant time savings when adding many employees at once.

**Independent Test**: Can be fully tested by downloading the sample CSV template, populating it with employee data following the specified format rules, browsing to select the CSV file (under 1MB), clicking Upload, and verifying the employees are successfully imported and appear in the employee list.

**Acceptance Scenarios**:

1. **Given** I am in PIM Configuration, **When** I navigate to the Data Import page, **Then** I see instructions and requirements for importing employee data
2. **Given** I am on the Data Import page, **When** I view the page, **Then** I see a "Note:" section with important formatting requirements
3. **Given** I am viewing the import requirements, **When** I read the notes, **Then** I see the following requirements listed:
   - Column order should not be changed
   - First Name and Last Name are compulsory
   - All date fields should be in YYYY-MM-DD format
   - If gender is specified, value should be either Male or Female
   - Each import file should be configured for 100 records or less
   - Multiple import files may be required
4. **Given** I am on the Data Import page, **When** I view the sample file option, **Then** I see a "Sample CSV file:" label with a "Download" link
5. **Given** I am on the Data Import page, **When** I click the "Download" link, **Then** I receive a sample CSV file showing the correct format and column structure
6. **Given** I am on the Data Import page, **When** I view the file selection area, **Then** I see "Select File*" (marked as required), a "Browse" button showing "No file selected", and the note "Accepts up to 1MB"
7. **Given** I am on the Data Import page, **When** I click the Browse button, **Then** I can select a CSV file from my computer
8. **Given** I have selected a valid CSV file, **When** the file name appears in the selection area, **Then** the Upload button becomes active
9. **Given** I have selected a CSV file and clicked Upload, **When** the file is valid and under 1MB, **Then** the system processes the import and creates employee records
10. **Given** I have uploaded a CSV file, **When** the import completes successfully, **Then** I see a confirmation message indicating how many records were imported
11. **Given** I have uploaded a CSV file with errors, **When** the import is processed, **Then** I see error messages indicating which rows failed and why
12. **Given** I try to upload a file larger than 1MB, **When** I click Upload, **Then** the system rejects the file with an appropriate error message
13. **Given** I upload a CSV with incorrect column order, **When** the import is processed, **Then** the system displays an error about column structure
14. **Given** I upload a CSV with invalid date formats, **When** the import is processed, **Then** the system displays errors for rows with incorrect date formatting
15. **Given** I upload a CSV with more than 100 records, **When** I click Upload, **Then** the system rejects the file or imports only the first 100 records with a warning

---

### Edge Cases

- What happens when a user tries to create an employee with a duplicate Employee ID that already exists in the system?
- How does the system handle searching with special characters or SQL injection attempts in search fields?
- When an administrator attempts to delete the last employee in the system, the deletion proceeds normally (soft delete with archive), but the system may display a warning that this is the last employee record
- Employee deletions use soft delete with archive: records are marked as deleted but retained in the database for audit and compliance purposes, not permanently removed
- How does the system respond when trying to upload a profile photo that exceeds the 1MB size limit or is not in an accepted format?
- What happens when the "Create Login Details" toggle is enabled but the username already exists in the system?
- How does the system handle very long employee names that might exceed field length limits?
- When a user attempts to access the Add Employee or Edit Employee page without proper permissions, the system redirects them to the Employee List page and displays an error notification explaining insufficient permissions
- How does the system behave when search criteria return zero results?
- What happens when a user tries to generate a report that would contain thousands of records?
- When two administrators try to modify the same employee record simultaneously, the system uses last-write-wins strategy: the last save succeeds and overwrites previous changes, but the first user receives a warning notification that their changes were overwritten
- What occurs when required fields are left empty and the Save button is clicked?
- How does the pagination work when there are more than 158 employees to display?
- What happens when a supervisor is deleted who has employees reporting to them?
- What occurs when an administrator tries to create a custom report with no display fields selected?
- How does the system handle creating a custom field with a name that already exists?
- What happens when the limit of 10 custom fields is reached and a user tries to add another?
- How does the system prevent deletion of custom fields that are currently in use by employee records?
- What occurs when importing a CSV file with duplicate Employee IDs?
- How does the system handle CSV imports with missing required fields (First Name or Last Name)?
- What happens when a CSV file contains invalid gender values (not "Male" or "Female")?
- How does the system respond to CSV files with dates in incorrect formats (not YYYY-MM-DD)?
- What occurs when trying to import more than 100 records in a single CSV file?
- How does the system handle special characters or unicode in custom field names?
- What happens when a custom dropdown field has too many options (hundreds of comma-separated values)?
- How does the system behave when configuration changes are made while users are actively editing employee records?
- What occurs when trying to enable deprecated fields that contain legacy data?
- How does the system handle report generation when selection criteria conflict or are mutually exclusive?
- What happens when a custom field is deleted but the field still appears in saved report definitions?
- When trying to upload an attachment that exceeds 5MB, the system rejects the file with an appropriate error message
- When trying to upload an attachment with a file type not in the allowed list (PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG), the system rejects the file with an error message explaining the restriction
- When trying to upload an attachment with a potentially malicious file type (executables, scripts), the system blocks the upload and displays a security warning

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a searchable and sortable list of all employees showing Employee ID, First & Middle Name, Last Name, Job Title, Employment Status, Sub Unit, Supervisor, and Actions
- **FR-002**: System MUST provide search filters for Employee Name, Employee ID, Employment Status, Job Title, Sub Unit, and Supervisor Name
- **FR-003**: System MUST allow users to reset all search filters to display the complete employee list
- **FR-004**: System MUST display a count of total records found (e.g., "(158) Records Found")
- **FR-005**: System MUST provide a "+Add" button that navigates users to the Add Employee page
- **FR-006**: System MUST allow creation of new employee records with required fields: First Name and Last Name
- **FR-007**: System MUST auto-suggest or allow manual entry of Employee ID during employee creation
- **FR-008**: System MUST allow optional Middle Name entry during employee creation
- **FR-009**: System MUST provide the ability to upload a profile photo for employees with file type validation (jpg, png, gif) and size limit (1MB max, recommended 200px X 200px)
- **FR-010**: System MUST provide a "Create Login Details" toggle on the Add Employee page
- **FR-011**: System MUST display Username, Password, Confirm Password, and Status fields when "Create Login Details" is enabled
- **FR-012**: System MUST validate that Password and Confirm Password fields match before allowing save
- **FR-013**: System MUST provide password strength guidance: "For a strong password, please use a hard to guess combination of text with upper and lower case characters, symbols and numbers"
- **FR-014**: System MUST allow setting login Status as either "Enabled" or "Disabled" via radio buttons
- **FR-015**: System MUST provide Save and Cancel buttons on the Add Employee page
- **FR-016**: System MUST display edit (pencil icon) and delete (trash can icon) actions for each employee in the list
- **FR-017**: System MUST allow modification of existing employee records through the edit functionality
- **FR-018**: System MUST require confirmation before deleting an employee record
- **FR-070**: System MUST use soft delete for employee records, marking them as deleted but retaining the data in the database for audit and compliance purposes
- **FR-071**: System MUST archive deleted employee records rather than permanently removing them from the database
- **FR-072**: System MUST enforce a maximum file size limit of 5MB for employee attachments
- **FR-073**: System MUST allow only specific file types for attachments: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG
- **FR-074**: System MUST reject attachment uploads that exceed the 5MB size limit with an appropriate error message
- **FR-075**: System MUST reject attachment uploads with file types not in the allowed list, displaying an error message explaining the restriction
- **FR-076**: System MUST block uploads of potentially malicious file types (executables, scripts) and display a security warning
- **FR-019**: System MUST provide checkboxes for selecting multiple employees for bulk operations
- **FR-020**: System MUST provide an "Include" filter with at least "Current Employees Only" option to filter by employment status
- **FR-021**: System MUST provide a Reports section accessible via a "Reports" tab
- **FR-022**: System MUST display a list of available reports with search capability
- **FR-023**: System MUST show at least 5 predefined reports: All Employee Sub Unit Hierarchy Report, Employee Contact info report, Employee Job Details, PIM Sample Report, and PT
- **FR-024**: System MUST provide view/execute (document icon), edit (pencil icon), and delete (trash can icon) actions for each report
- **FR-025**: System MUST allow creation of new custom reports via a "+Add" button on the Reports page
- **FR-026**: System MUST display the OrangeHRM version (e.g., "OrangeHRM OS 5.7") in the footer
- **FR-027**: System MUST display the logged-in user's name and avatar in the top-right corner
- **FR-028**: System MUST provide a Configuration menu for system settings (accessible via "Configuration" dropdown)
- **FR-029**: System MUST mark required fields with an asterisk (*) indicator
- **FR-030**: System MUST provide navigation tabs for Employee List, Add Employee, and Reports within the PIM module
- **FR-031**: System MUST persist all employee data including personal information, employment status, job details, and organizational relationships
- **FR-032**: System MUST support sortable columns in the employee list table (indicated by sort icons)
- **FR-033**: System MUST validate Employee ID uniqueness to prevent duplicates
- **FR-034**: System MUST validate username uniqueness when creating login details
- **FR-035**: System MUST maintain referential integrity between employees and their supervisors
- **FR-036**: System MUST provide a custom report creation interface with fields for Report Name (required), Selection Criteria, and Display Fields
- **FR-037**: System MUST allow selection of multiple selection criteria filters in report definitions with the ability to add criteria via "+" button
- **FR-038**: System MUST provide "Include" options for report selection criteria (e.g., "Current Employees Only")
- **FR-039**: System MUST provide Display Field Group and Display Field selection dropdowns for custom reports
- **FR-040**: System MUST allow adding multiple display fields to a report via "+" button
- **FR-041**: System MUST provide a Configuration page for Optional Fields with toggle for "Show Deprecated Fields" (Nick Name, Smoker, Military Service)
- **FR-042**: System MUST provide Country Specific Information configuration with toggles for "Show SSN field in Personal Details", "Show SIN field in Personal Details", and "Show US Tax Exemptions menu"
- **FR-043**: System MUST persist configuration changes when Save button is clicked on Configuration page
- **FR-044**: System MUST dynamically show/hide employee detail fields based on configuration settings
- **FR-045**: System MUST provide a Custom Fields management interface accessible from Configuration
- **FR-046**: System MUST display a list of existing custom fields showing Custom Field Name, Screen, Field Type, and Actions
- **FR-047**: System MUST enforce a limit of 10 custom fields total and display "Remaining number of custom fields: X"
- **FR-048**: System MUST allow creation of custom fields with required inputs: Field Name, Screen (dropdown), and Type (dropdown)
- **FR-049**: System MUST support custom field types: Drop Down, Text or Number
- **FR-050**: System MUST provide a "Select Options" field for Drop Down custom field types where options are entered as comma-separated values
- **FR-051**: System MUST allow editing existing custom fields including modification of dropdown options
- **FR-052**: System MUST prevent deletion of custom fields that are currently in use, displaying error message "Custom field(s) in use"
- **FR-053**: System MUST allow deletion of unused custom fields after confirmation
- **FR-054**: System MUST provide a Data Import page accessible from Configuration
- **FR-055**: System MUST display import requirements in a Note section including: column order preservation, required fields, date format (YYYY-MM-DD), gender values (Male/Female), 100 records per file limit
- **FR-056**: System MUST provide a downloadable sample CSV file demonstrating correct import format
- **FR-057**: System MUST provide a file selection interface with "Browse" button, file name display, and 1MB size limit notice
- **FR-058**: System MUST validate CSV file size and reject files exceeding 1MB
- **FR-059**: System MUST validate CSV structure including column order, required fields (First Name, Last Name), and record count (max 100)
- **FR-060**: System MUST validate date fields in CSV to ensure YYYY-MM-DD format
- **FR-061**: System MUST validate gender values in CSV to ensure "Male" or "Female" only
- **FR-062**: System MUST process valid CSV files and create employee records in bulk
- **FR-063**: System MUST provide detailed error messages for CSV import failures including row numbers and specific validation errors
- **FR-064**: System MUST provide success confirmation with count of records imported
- **FR-065**: System MUST provide an "Upload" button on Data Import page that is only enabled when a file is selected
- **FR-066**: System MUST handle concurrent edits to the same employee record using last-write-wins strategy where the last save succeeds and overwrites previous changes
- **FR-067**: System MUST notify the first user when their changes to an employee record are overwritten by another user's concurrent edit, displaying a warning message
- **FR-068**: System MUST redirect users without proper permissions away from restricted pages (Add Employee, Edit Employee) to the Employee List page
- **FR-069**: System MUST display an error notification explaining insufficient permissions when redirecting unauthorized users from restricted pages

### Key Entities

- **Employee**: Core entity representing a person employed by the organization. Attributes include Employee ID (unique identifier), First Name, Middle Name (optional), Last Name, Job Title, Employment Status, Sub Unit (department/team), Supervisor (reporting relationship), profile photo, associated login credentials if applicable, and any custom field values
- **Employment Status**: Categorization of an employee's current state (e.g., Active, Inactive, Terminated). Used for filtering and determining which employees appear in "Current Employees Only" views
- **Job Title**: The employee's role or position within the organization. Used for organizational structure and reporting
- **Sub Unit**: Organizational division, department, or team to which an employee belongs. Supports hierarchical organizational structure
- **Supervisor**: Another employee who manages or oversees the current employee. Creates reporting relationships and organizational hierarchy
- **Login Credentials**: Optional authentication information (username, password, status) that allows an employee to access the system
- **Employee Report**: Predefined or custom report definition that aggregates and displays employee information for analysis and decision-making. Attributes include Report Name, Selection Criteria (filters), Display Field Groups, and Display Fields (columns to show)
- **Report Selection Criteria**: Filters applied to reports to determine which employees are included in the output (e.g., "Current Employees Only", employment status, job title, sub-unit)
- **Report Display Field**: Individual data fields to be shown as columns in report output, organized by Display Field Groups (e.g., Personal Information, Job Details, Contact Information)
- **Custom Field**: User-defined fields that extend the standard employee data model. Attributes include Field Name, Screen (where it appears, e.g., "Personal Details"), Field Type (Drop Down, Text or Number), and Select Options (for dropdown types, comma-separated values)
- **PIM Configuration**: System-wide settings that control which optional and country-specific fields are displayed throughout the PIM module. Includes toggles for deprecated fields (Nick Name, Smoker, Military Service) and country-specific fields (SSN, SIN, US Tax Exemptions)
- **CSV Import Record**: Represents a bulk data import operation including the CSV file, validation results, error messages, and count of successfully imported employee records. Must follow specific format requirements including column order, date formats (YYYY-MM-DD), gender values (Male/Female), and record limits (100 max per file)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can locate any employee in the database within 10 seconds using search filters
- **SC-002**: New employee records can be created and saved in under 2 minutes with all required information
- **SC-003**: The employee list page loads and displays up to 500 employee records within 3 seconds
- **SC-004**: 95% of users successfully create a new employee record on their first attempt without errors
- **SC-005**: Search filters return accurate results matching 100% of the specified criteria
- **SC-006**: The system displays accurate record counts that match the actual number of employees in the filtered results
- **SC-007**: Profile photo uploads complete successfully for images meeting the specified requirements (under 1MB, correct format) 100% of the time
- **SC-008**: Password validation correctly identifies mismatched passwords and prevents save 100% of the time
- **SC-009**: All CRUD operations (Create, Read, Update, Delete) on employee records complete successfully without data loss or corruption
- **SC-010**: Reports generate and display accurate employee data within 10 seconds for datasets of up to 1000 employees
- **SC-011**: Users can reset search filters and return to the full employee list in a single click
- **SC-012**: The system prevents duplicate Employee IDs 100% of the time with clear error messaging
- **SC-013**: 90% of HR administrators rate the interface as "easy to use" or "very easy to use" for common tasks
- **SC-014**: The system maintains data integrity with zero data loss during concurrent user operations
- **SC-015**: All required fields are clearly marked and validated, reducing form submission errors by at least 60%
- **SC-016**: Custom reports can be created and saved in under 3 minutes with all required criteria and display fields
- **SC-017**: Users can successfully create a custom report on their first attempt without requiring additional help or documentation 90% of the time
- **SC-018**: Configuration changes take effect immediately upon saving and are reflected across all relevant screens
- **SC-019**: Custom fields can be created and made available on employee screens within 1 minute
- **SC-020**: The system enforces the 10 custom field limit and clearly communicates remaining capacity to users
- **SC-021**: Custom field deletion is prevented when fields are in use, with clear error messaging 100% of the time
- **SC-022**: CSV imports of 100 employee records complete within 30 seconds
- **SC-023**: CSV validation catches 100% of formatting errors before attempting to create invalid records
- **SC-024**: Users can successfully complete a bulk import on their first attempt when following the sample CSV format 85% of the time
- **SC-025**: Import error messages provide specific row numbers and error descriptions enabling users to correct issues without additional support
- **SC-026**: The system processes valid CSV files with zero data corruption or loss
- **SC-027**: Sample CSV download and file format documentation reduces import-related support tickets by 70%
- **SC-028**: Configuration changes are applied consistently across all user sessions within 5 seconds
