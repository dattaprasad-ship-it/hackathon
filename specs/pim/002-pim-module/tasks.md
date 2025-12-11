# Tasks: OrangeHRM Personnel Information Management (PIM) Module

**Input**: Design documents from `/specs/002-pim-module/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL per specification. This task list focuses on implementation tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Paths shown below follow the structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend directory structure (backend/src/app/api, backend/src/lib, backend/tests)
- [X] T002 Create frontend directory structure (frontend/src/app, frontend/src/components, frontend/src/lib, frontend/tests)
- [X] T003 [P] Initialize Next.js backend project with TypeScript in backend/
- [X] T004 [P] Initialize Next.js frontend project with TypeScript in frontend/
- [X] T005 [P] Install backend dependencies (next, react, sqlite3, zod, bcryptjs, multer)
- [X] T006 [P] Install frontend dependencies (next, react, react-dom, react-hook-form, zod, @hookform/resolvers)
- [X] T007 [P] Configure TypeScript configs for backend and frontend
- [X] T008 [P] Setup ESLint and Prettier configuration files
- [X] T009 [P] Create .env.local template files for backend and frontend
- [X] T010 [P] Setup Jest and React Testing Library for testing
- [X] T011 [P] Setup Playwright for E2E testing
- [X] T012 Create package.json scripts for development, build, test, and database operations

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T013 Create SQLite3 database connection module in backend/src/lib/db/index.ts
- [X] T014 Create database migration system in backend/src/lib/db/migrations/
- [X] T015 Create initial database schema migration (001_initial_schema.sql) with all core tables
- [X] T016 Create seed data migration (002_seed_data.sql) for lookup tables and predefined reports
- [X] T017 [P] Create error handling utilities in backend/src/lib/utils/errors.ts
- [X] T018 [P] Create validation utilities with Zod schemas in backend/src/lib/utils/validation.ts
- [X] T019 [P] Create API response helpers in backend/src/lib/utils/response.ts
- [X] T020 [P] Setup Next.js API route middleware structure in backend/src/app/api/
- [X] T021 [P] Create dummy authentication middleware in backend/src/lib/middleware/auth.ts
- [X] T022 [P] Create permission check utilities in backend/src/lib/utils/permissions.ts
- [X] T023 [P] Create file upload utilities in backend/src/lib/utils/file-upload.ts
- [X] T024 [P] Create frontend API client base utilities in frontend/src/lib/api/client.ts
- [X] T025 [P] Create frontend shared component library structure (Button, Input, Select, Modal, Table)
- [X] T026 [P] Create frontend layout components (Header, Footer, Navigation) in frontend/src/components/layout/
- [X] T027 [P] Create TypeScript type definitions in frontend/src/types/ (employee.ts, report.ts, api.ts)
- [X] T028 Create database initialization script (npm run db:init) in backend/package.json
- [ ] T029 Verify database schema is created and seed data is loaded

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View and Search Employee List (Priority: P1) 🎯 MVP

**Goal**: HR administrators can view and search through the organization's employee database with filtering by name, ID, job title, employment status, sub-unit, and supervisor.

**Independent Test**: Navigate to Employee List page, enter search criteria (name, ID, job title, etc.), click Search, and verify that the system returns accurate filtered results. Can locate any employee within 10 seconds.

### Implementation for User Story 1

- [X] T030 [P] [US1] Create Employee model with Zod schema in backend/src/lib/models/employee.ts
- [X] T031 [P] [US1] Create lookup table models (job_titles, employment_statuses, sub_units) in backend/src/lib/models/lookup.ts
- [X] T032 [US1] Create EmployeeService with list and search methods in backend/src/lib/services/employee-service.ts
- [X] T033 [US1] Implement GET /api/employees endpoint with filtering and pagination in backend/src/app/api/employees/route.ts
- [X] T034 [US1] Implement POST /api/employees/search endpoint for advanced search in backend/src/app/api/employees/search/route.ts
- [X] T035 [US1] Create employee API client functions in frontend/src/lib/api/employees.ts
- [X] T036 [US1] Create useEmployees hook in frontend/src/lib/hooks/useEmployees.ts
- [X] T037 [US1] Create EmployeeSearch component with filters in frontend/src/components/employees/EmployeeSearch.tsx
- [X] T038 [US1] Create EmployeeTable component with sortable columns in frontend/src/components/employees/EmployeeTable.tsx
- [X] T039 [US1] Create EmployeeList component combining search and table in frontend/src/components/employees/EmployeeList.tsx
- [X] T040 [US1] Create Employee List page (frontend/src/app/page.tsx) using EmployeeList component
- [X] T041 [US1] Add record count display "(X) Records Found" to EmployeeList component
- [X] T042 [US1] Implement Reset button functionality to clear all filters
- [X] T043 [US1] Add pagination controls to EmployeeTable component
- [X] T044 [US1] Implement column sorting functionality in EmployeeTable

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can view and search employees.

---

## Phase 4: User Story 2 - Add New Employee (Priority: P1) 🎯 MVP

**Goal**: HR administrators can add new employees to the system with basic information and optionally create login credentials.

**Independent Test**: Click "+Add" button, fill in employee form with required information (first name, last name, employee ID), optionally enable "Create Login Details" and provide credentials, click Save, and verify the new employee appears in the employee list.

### Implementation for User Story 2

- [X] T045 [US2] Extend EmployeeService with create method including validation in backend/src/lib/services/employee-service.ts
- [X] T046 [US2] Add employee ID uniqueness validation to EmployeeService
- [X] T047 [US2] Add password hashing utility using bcryptjs in backend/src/lib/utils/password.ts
- [X] T048 [US2] Add username uniqueness validation to EmployeeService
- [X] T049 [US2] Implement POST /api/employees endpoint for creating employees in backend/src/app/api/employees/route.ts
- [ ] T050 [US2] Add profile photo upload handling to POST /api/employees endpoint
- [X] T051 [US2] Create EmployeeForm component with all required fields in frontend/src/components/employees/EmployeeForm.tsx
- [X] T052 [US2] Add "Create Login Details" toggle to EmployeeForm component
- [X] T053 [US2] Add conditional login fields (username, password, confirm password, status) to EmployeeForm
- [X] T054 [US2] Add password validation and matching check to EmployeeForm
- [X] T055 [US2] Add password strength hint text to EmployeeForm
- [ ] T056 [US2] Add profile photo upload UI to EmployeeForm component
- [X] T057 [US2] Create Add Employee page (frontend/src/app/employees/new/page.tsx) using EmployeeForm
- [X] T058 [US2] Add "+Add" button to Employee List page that navigates to Add Employee page
- [X] T059 [US2] Implement form validation using React Hook Form and Zod in EmployeeForm
- [X] T060 [US2] Add Save and Cancel buttons to EmployeeForm with proper navigation
- [X] T061 [US2] Add employee ID auto-suggestion logic (e.g., "0445") in EmployeeForm
- [X] T062 [US2] Implement redirect to employee detail or list after successful creation

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users can view, search, and create employees.

---

## Phase 5: User Story 3 - Edit Employee Information (Priority: P2)

**Goal**: HR administrators can update existing employee information when employees change roles, departments, or personal details.

**Independent Test**: Click the edit icon (pencil) next to any employee in the list, modify employee details, click Save, and verify the changes are reflected in the employee list and detail views.

### Implementation for User Story 3

- [ ] T063 [US3] Extend EmployeeService with update method in backend/src/lib/services/employee-service.ts
- [ ] T064 [US3] Add concurrent edit detection using updated_at timestamp in EmployeeService
- [ ] T065 [US3] Implement GET /api/employees/[id] endpoint in backend/src/app/api/employees/[id]/route.ts
- [ ] T066 [US3] Implement PUT /api/employees/[id] endpoint with conflict detection in backend/src/app/api/employees/[id]/route.ts
- [ ] T067 [US3] Add conflict warning response to PUT endpoint when concurrent edit detected
- [ ] T068 [US3] Create Employee Detail page (frontend/src/app/employees/[id]/page.tsx)
- [ ] T069 [US3] Create Edit Employee page (frontend/src/app/employees/[id]/edit/page.tsx) using EmployeeForm
- [ ] T070 [US3] Pre-populate EmployeeForm with existing employee data in edit mode
- [ ] T071 [US3] Add edit icon (pencil) to Actions column in EmployeeTable component
- [ ] T072 [US3] Implement navigation from edit icon to Edit Employee page
- [ ] T073 [US3] Add concurrent edit warning notification to Edit Employee page
- [ ] T074 [US3] Update useEmployees hook with updateEmployee function
- [ ] T075 [US3] Handle conflict warnings in frontend when saving edits

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently. Users can view, search, create, and edit employees.

---

## Phase 6: User Story 4 - Delete Employee Records (Priority: P2)

**Goal**: HR administrators can remove employee records from the system using soft delete, maintaining data accuracy and compliance.

**Independent Test**: Click the delete icon (trash can) in the Actions column, confirm the deletion in a confirmation dialog, and verify the employee no longer appears in the list (but is retained in database).

### Implementation for User Story 4

- [ ] T076 [US4] Extend EmployeeService with soft delete method (sets is_deleted=1) in backend/src/lib/services/employee-service.ts
- [ ] T077 [US4] Add check to prevent deletion of employees who have subordinates in EmployeeService
- [ ] T078 [US4] Update EmployeeService list/search methods to filter out deleted employees by default
- [ ] T079 [US4] Implement DELETE /api/employees/[id] endpoint with soft delete in backend/src/app/api/employees/[id]/route.ts
- [ ] T080 [US4] Add delete icon (trash can) to Actions column in EmployeeTable component
- [ ] T081 [US4] Create confirmation modal component for delete operations in frontend/src/components/shared/DeleteConfirmModal.tsx
- [ ] T082 [US4] Implement delete confirmation dialog when delete icon is clicked
- [ ] T083 [US4] Add bulk delete functionality for multiple selected employees
- [ ] T084 [US4] Add checkboxes for employee selection in EmployeeTable component
- [ ] T085 [US4] Update useEmployees hook with deleteEmployee function
- [ ] T086 [US4] Refresh employee list after successful deletion

**Checkpoint**: At this point, User Stories 1-4 should all work independently. Full CRUD operations are available.

---

## Phase 7: User Story 6 - Include/Exclude Employees in Views (Priority: P3)

**Goal**: Users can filter the employee list to show only current employees or include all employees (current and past).

**Independent Test**: Select "Current Employees Only" from the Include dropdown and verify only active employees are shown, then select to include all employees and verify both current and past employees appear.

### Implementation for User Story 6

- [X] T087 [US6] Extend EmployeeService list method to support include filter (current/all) in backend/src/lib/services/employee-service.ts
- [X] T088 [US6] Add "Include" dropdown to EmployeeSearch component with "Current Employees Only" (default) and "All" options
- [X] T089 [US6] Update GET /api/employees endpoint to handle include query parameter
- [X] T090 [US6] Update useEmployees hook to pass include filter to API
- [X] T091 [US6] Ensure deleted employees are excluded from "Current Employees Only" view

**Checkpoint**: User Story 6 enhances User Story 1 with additional filtering capability.

---

## Phase 8: User Story 5 - Generate and Manage Employee Reports (Priority: P3)

**Goal**: HR administrators can generate various predefined reports about employees to analyze workforce data.

**Independent Test**: Navigate to Reports tab, view list of available reports, click on a report to execute it, and verify the report displays or downloads with accurate employee data.

### Implementation for User Story 5

- [ ] T092 [P] [US5] Create Report model with Zod schema in backend/src/lib/models/report.ts
- [ ] T093 [P] [US5] Create ReportSelectionCriteria model in backend/src/lib/models/report.ts
- [ ] T094 [P] [US5] Create ReportDisplayField model in backend/src/lib/models/report.ts
- [ ] T095 [US5] Create ReportService with list, get, and execute methods in backend/src/lib/services/report-service.ts
- [ ] T096 [US5] Implement report execution logic that applies selection criteria and generates output in ReportService
- [ ] T097 [US5] Implement GET /api/reports endpoint to list all reports in backend/src/app/api/reports/route.ts
- [ ] T098 [US5] Implement GET /api/reports/[id] endpoint to get report definition in backend/src/app/api/reports/[id]/route.ts
- [ ] T099 [US5] Implement POST /api/reports/[id]/execute endpoint to generate report output in backend/src/app/api/reports/[id]/execute/route.ts
- [ ] T100 [US5] Create report API client functions in frontend/src/lib/api/reports.ts
- [ ] T101 [US5] Create useReports hook in frontend/src/lib/hooks/useReports.ts
- [ ] T102 [US5] Create ReportList component with search capability in frontend/src/components/reports/ReportList.tsx
- [ ] T103 [US5] Create ReportViewer component to display report results in frontend/src/components/reports/ReportViewer.tsx
- [ ] T104 [US5] Create Reports page (frontend/src/app/reports/page.tsx) using ReportList component
- [ ] T105 [US5] Add Reports tab to navigation in frontend/src/components/layout/Navigation.tsx
- [ ] T106 [US5] Add view/execute (document icon), edit (pencil icon), and delete (trash icon) actions to ReportList
- [ ] T107 [US5] Implement report execution and display in ReportViewer component
- [ ] T108 [US5] Add Reset button to Reports page to clear search filters

**Checkpoint**: User Story 5 should work independently. Users can view and execute predefined reports.

---

## Phase 9: User Story 7 - Create Custom Reports (Priority: P2)

**Goal**: HR administrators can create custom employee reports by defining report names, selection criteria, and display fields.

**Independent Test**: Click "+Add" on Reports page, enter report name, select selection criteria, choose display fields, click Save, and verify the new report appears in the reports list and can be executed.

### Implementation for User Story 7

- [ ] T109 [US7] Extend ReportService with create and update methods in backend/src/lib/services/report-service.ts
- [ ] T110 [US7] Add report name uniqueness validation to ReportService
- [ ] T111 [US7] Implement POST /api/reports endpoint for creating custom reports in backend/src/app/api/reports/route.ts
- [ ] T112 [US7] Implement PUT /api/reports/[id] endpoint for updating reports in backend/src/app/api/reports/[id]/route.ts
- [ ] T113 [US7] Implement DELETE /api/reports/[id] endpoint in backend/src/app/api/reports/[id]/route.ts
- [ ] T114 [US7] Create ReportForm component with Report Name, Selection Criteria, and Display Fields sections in frontend/src/components/reports/ReportForm.tsx
- [ ] T115 [US7] Add Selection Criteria section with dropdown and "+" button to add multiple criteria in ReportForm
- [ ] T116 [US7] Add "Include" dropdown with "Current Employees Only" option to Selection Criteria in ReportForm
- [ ] T117 [US7] Add Display Fields section with Field Group and Field dropdowns in ReportForm
- [ ] T118 [US7] Implement dynamic field population based on selected Field Group in ReportForm
- [ ] T119 [US7] Add "+" button to add multiple display fields in ReportForm
- [ ] T120 [US7] Add "Include Header" option for display field groups in ReportForm
- [ ] T121 [US7] Create Add Report page (frontend/src/app/reports/new/page.tsx) using ReportForm
- [ ] T122 [US7] Create Edit Report page (frontend/src/app/reports/[id]/page.tsx) using ReportForm
- [ ] T123 [US7] Add "+Add" button to Reports page that navigates to Add Report page
- [ ] T124 [US7] Pre-populate ReportForm with existing report data in edit mode
- [ ] T125 [US7] Add form validation to ensure at least one display field is selected
- [ ] T126 [US7] Update useReports hook with createReport, updateReport, and deleteReport functions

**Checkpoint**: User Story 7 should work independently. Users can create and manage custom reports.

---

## Phase 10: User Story 8 - Configure Optional Fields and Country-Specific Information (Priority: P3)

**Goal**: System administrators can configure which optional employee fields are displayed, including deprecated fields and country-specific information.

**Independent Test**: Navigate to Configuration, toggle optional field settings, click Save, and verify the changes are reflected in employee detail pages.

### Implementation for User Story 8

- [ ] T127 [P] [US8] Create PIMConfig model with Zod schema in backend/src/lib/models/config.ts
- [ ] T128 [US8] Create ConfigService with get and update methods in backend/src/lib/services/config-service.ts
- [ ] T129 [US8] Implement GET /api/config endpoint in backend/src/app/api/config/route.ts
- [ ] T130 [US8] Implement PUT /api/config endpoint in backend/src/app/api/config/route.ts
- [ ] T131 [US8] Create Configuration page (frontend/src/app/config/page.tsx) with Optional Fields and Country Specific Information sections
- [ ] T132 [US8] Add "Show Deprecated Fields" toggle with description to Configuration page
- [ ] T133 [US8] Add "Show SSN field in Personal Details" toggle to Configuration page
- [ ] T134 [US8] Add "Show SIN field in Personal Details" toggle to Configuration page
- [ ] T135 [US8] Add "Show US Tax Exemptions menu" toggle to Configuration page
- [ ] T136 [US8] Add Configuration dropdown to navigation menu in frontend/src/components/layout/Navigation.tsx
- [ ] T137 [US8] Create config API client functions in frontend/src/lib/api/config.ts
- [ ] T138 [US8] Create useConfig hook in frontend/src/lib/hooks/useConfig.ts
- [ ] T139 [US8] Implement Save button to persist configuration changes
- [ ] T140 [US8] Update EmployeeForm and Employee Detail pages to conditionally show/hide fields based on config
- [ ] T141 [US8] Add deprecated fields (Nick Name, Smoker, Military Service) to EmployeeForm when enabled
- [ ] T142 [US8] Add SSN field to EmployeeForm when enabled in config
- [ ] T143 [US8] Add SIN field to EmployeeForm when enabled in config
- [ ] T144 [US8] Add US Tax Exemptions menu option when enabled in config

**Checkpoint**: User Story 8 should work independently. Configuration changes affect employee forms dynamically.

---

## Phase 11: User Story 9 - Manage Custom Fields (Priority: P2)

**Goal**: System administrators can create, edit, and delete custom fields to capture organization-specific employee information.

**Independent Test**: Navigate to Custom Fields, click "+Add", enter field name, select type and screen, enter dropdown options if applicable, click Save, and verify the custom field appears in the list and on the specified employee screen.

### Implementation for User Story 9

- [ ] T145 [P] [US9] Create CustomField model with Zod schema in backend/src/lib/models/custom-field.ts
- [ ] T146 [P] [US9] Create EmployeeCustomValue model in backend/src/lib/models/custom-field.ts
- [ ] T147 [US9] Create CustomFieldService with CRUD methods in backend/src/lib/services/custom-field-service.ts
- [ ] T148 [US9] Add validation for 10 custom field limit in CustomFieldService
- [ ] T149 [US9] Add check to prevent deletion of custom fields in use in CustomFieldService
- [ ] T150 [US9] Implement GET /api/custom-fields endpoint in backend/src/app/api/custom-fields/route.ts
- [ ] T151 [US9] Implement POST /api/custom-fields endpoint in backend/src/app/api/custom-fields/route.ts
- [ ] T152 [US9] Implement GET /api/custom-fields/[id] endpoint in backend/src/app/api/custom-fields/[id]/route.ts
- [ ] T153 [US9] Implement PUT /api/custom-fields/[id] endpoint in backend/src/app/api/custom-fields/[id]/route.ts
- [ ] T154 [US9] Implement DELETE /api/custom-fields/[id] endpoint with usage check in backend/src/app/api/custom-fields/[id]/route.ts
- [ ] T155 [US9] Create CustomFieldsList component showing field name, screen, type, and actions in frontend/src/components/config/CustomFieldsList.tsx
- [ ] T156 [US9] Add "Remaining number of custom fields: X" display to CustomFieldsList
- [ ] T157 [US9] Create CustomFieldForm component with Field Name, Screen, Type fields in frontend/src/components/config/CustomFieldForm.tsx
- [ ] T158 [US9] Add conditional "Select Options" field for Drop Down type in CustomFieldForm
- [ ] T159 [US9] Create Custom Fields page (frontend/src/app/config/custom-fields/page.tsx) using CustomFieldsList
- [ ] T160 [US9] Add "+Add" button to Custom Fields page
- [ ] T161 [US9] Create Add Custom Field page (frontend/src/app/config/custom-fields/new/page.tsx) using CustomFieldForm
- [ ] T162 [US9] Create Edit Custom Field page (frontend/src/app/config/custom-fields/[id]/edit/page.tsx) using CustomFieldForm
- [ ] T163 [US9] Add edit and delete icons to CustomFieldsList actions
- [ ] T164 [US9] Implement delete confirmation with usage check error message
- [ ] T165 [US9] Disable "+Add" button when 10 custom field limit is reached
- [ ] T166 [US9] Update EmployeeForm to dynamically include custom fields based on screen
- [ ] T167 [US9] Create EmployeeCustomValueService to save custom field values in backend/src/lib/services/employee-custom-value-service.ts
- [ ] T168 [US9] Update EmployeeService to include custom field values when fetching employee details

**Checkpoint**: User Story 9 should work independently. Users can manage custom fields and they appear on employee forms.

---

## Phase 12: User Story 10 - Import Employee Data (Priority: P2)

**Goal**: HR administrators can bulk import employee data from CSV files following specific formatting requirements.

**Independent Test**: Download sample CSV template, populate it with employee data, browse to select CSV file, click Upload, and verify employees are successfully imported and appear in the employee list.

### Implementation for User Story 10

- [X] T169 [US10] Create ImportService with CSV parsing and validation in backend/src/lib/services/import-service.ts
- [X] T170 [US10] Add CSV file size validation (max 1MB) to ImportService
- [X] T171 [US10] Add CSV record count validation (max 100) to ImportService
- [ ] T172 [US10] Add CSV column order validation to ImportService - Enhancement
- [ ] T173 [US10] Add date format validation (YYYY-MM-DD) to ImportService - Enhancement
- [ ] T174 [US10] Add gender value validation (Male/Female only) to ImportService - Enhancement
- [X] T175 [US10] Add required field validation (First Name, Last Name) to ImportService
- [X] T176 [US10] Implement employee record creation from CSV rows in ImportService
- [X] T177 [US10] Generate detailed error messages with row numbers in ImportService
- [X] T178 [US10] Implement GET /api/import/sample endpoint to download sample CSV in backend/src/app/api/import/sample/route.ts
- [X] T179 [US10] Implement POST /api/import endpoint with file upload handling in backend/src/app/api/import/route.ts
- [X] T180 [US10] Create Data Import page (frontend/src/app/config/import/page.tsx) with instructions and requirements
- [X] T181 [US10] Add "Note:" section with formatting requirements to Data Import page
- [X] T182 [US10] Add "Sample CSV file:" label with Download link to Data Import page
- [X] T183 [US10] Add file selection area with Browse button to Data Import page
- [X] T184 [US10] Add "Accepts up to 1MB" note to file selection area
- [X] T185 [US10] Add Upload button that is only enabled when file is selected
- [X] T186 [US10] Implement file selection and upload functionality
- [X] T187 [US10] Display success message with count of imported records
- [X] T188 [US10] Display error messages with row numbers and specific validation errors
- [X] T189 [US10] Add Data Import link to Configuration menu in Navigation

**Checkpoint**: User Story 10 should work independently. Users can bulk import employee data from CSV files.

---

## Phase 13: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T190 [P] Add loading states and error handling to all API calls in frontend - Partial (basic implementation)
- [X] T191 [P] Add toast notifications for success/error messages across all pages - Component ready
- [X] T192 [P] Implement proper error boundaries in frontend React components
- [X] T193 [P] Add loading spinners to all data-fetching components - Component ready
- [ ] T194 [P] Optimize database queries with proper indexing (verify all indexes from data-model.md are created)
- [ ] T195 [P] Add input sanitization to prevent XSS attacks in all forms
- [ ] T196 [P] Add SQL injection prevention (verify all queries use parameterized statements)
- [ ] T197 [P] Implement proper file upload security (file type validation, size limits, storage outside web root)
- [ ] T198 [P] Add comprehensive logging for all API operations in backend
- [ ] T199 [P] Add request validation middleware for all API endpoints
- [ ] T200 [P] Update Header component to display logged-in user name and avatar (FR-027)
- [ ] T201 [P] Update Footer component to display OrangeHRM version (FR-026)
- [ ] T202 [P] Add proper TypeScript types throughout codebase
- [ ] T203 [P] Add JSDoc comments to all public functions and components
- [ ] T204 [P] Run quickstart.md validation to ensure all setup steps work
- [ ] T205 [P] Performance testing: Verify employee list loads 500 records within 3 seconds (SC-003)
- [ ] T206 [P] Performance testing: Verify search returns results within 10 seconds (SC-001)
- [ ] T207 [P] Code cleanup and refactoring for consistency
- [ ] T208 [P] Update documentation with any deviations from original plan

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Depends on US1 for navigation
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 for employee list, US2 for employee creation
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 for employee list
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Independent, but benefits from US1 employee data
- **User Story 6 (P3)**: Can start after Foundational (Phase 2) - Enhances US1, should be implemented with or after US1
- **User Story 7 (P2)**: Can start after Foundational (Phase 2) - Depends on US5 for report infrastructure
- **User Story 8 (P3)**: Can start after Foundational (Phase 2) - Independent, affects US2/US3 employee forms
- **User Story 9 (P2)**: Can start after Foundational (Phase 2) - Independent, affects US2/US3 employee forms
- **User Story 10 (P2)**: Can start after Foundational (Phase 2) - Depends on US2 for employee creation logic

### Within Each User Story

- Models before services
- Services before endpoints
- Endpoints before frontend components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, user stories can start in parallel (if team capacity allows)
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members
- Polish tasks marked [P] can all run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all models for User Story 1 together:
Task: "Create Employee model with Zod schema in backend/src/lib/models/employee.ts"
Task: "Create lookup table models (job_titles, employment_statuses, sub_units) in backend/src/lib/models/lookup.ts"

# Launch all frontend components for User Story 1 together (after backend is done):
Task: "Create EmployeeSearch component with filters in frontend/src/components/employees/EmployeeSearch.tsx"
Task: "Create EmployeeTable component with sortable columns in frontend/src/components/employees/EmployeeTable.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (View and Search Employee List)
4. Complete Phase 4: User Story 2 (Add New Employee)
5. **STOP and VALIDATE**: Test User Stories 1 & 2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Basic MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (Full MVP!)
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 6 → Test independently → Deploy/Demo (Enhances US1)
7. Add User Story 5 → Test independently → Deploy/Demo
8. Add User Story 7 → Test independently → Deploy/Demo
9. Add User Story 8 → Test independently → Deploy/Demo
10. Add User Story 9 → Test independently → Deploy/Demo
11. Add User Story 10 → Test independently → Deploy/Demo
12. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (View/Search)
   - Developer B: User Story 2 (Add Employee) - can start in parallel after US1 navigation is ready
   - Developer C: User Story 5 (Reports) - fully independent
3. Next wave:
   - Developer A: User Story 3 (Edit)
   - Developer B: User Story 4 (Delete)
   - Developer C: User Story 6 (Include/Exclude filter)
4. Continue with remaining stories in priority order

---

## Task Summary

- **Total Tasks**: 208
- **Setup Tasks**: 12 (Phase 1)
- **Foundational Tasks**: 17 (Phase 2)
- **User Story 1 Tasks**: 15 (Phase 3)
- **User Story 2 Tasks**: 18 (Phase 4)
- **User Story 3 Tasks**: 13 (Phase 5)
- **User Story 4 Tasks**: 11 (Phase 6)
- **User Story 6 Tasks**: 5 (Phase 7)
- **User Story 5 Tasks**: 17 (Phase 8)
- **User Story 7 Tasks**: 18 (Phase 9)
- **User Story 8 Tasks**: 18 (Phase 10)
- **User Story 9 Tasks**: 24 (Phase 11)
- **User Story 10 Tasks**: 21 (Phase 12)
- **Polish Tasks**: 19 (Phase 13)

### Parallel Opportunities Identified

- **Phase 1**: 9 parallel tasks
- **Phase 2**: 12 parallel tasks
- **Phase 3**: 2 parallel tasks (models)
- **Phase 8**: 3 parallel tasks (models)
- **Phase 9**: 1 parallel task (models)
- **Phase 11**: 2 parallel tasks (models)
- **Phase 13**: All 19 tasks can run in parallel

### Independent Test Criteria

- **US1**: Navigate to Employee List, search by various criteria, verify results
- **US2**: Click "+Add", fill form, optionally add login details, save, verify employee appears
- **US3**: Click edit icon, modify details, save, verify changes reflected
- **US4**: Click delete icon, confirm, verify employee removed from list
- **US5**: Navigate to Reports, view list, execute report, verify output
- **US6**: Change Include filter, verify employee list updates
- **US7**: Click "+Add" on Reports, create custom report, save, execute
- **US8**: Navigate to Configuration, toggle settings, save, verify fields appear/hide
- **US9**: Navigate to Custom Fields, create field, verify appears on employee form
- **US10**: Download sample CSV, populate, upload, verify employees imported

### Suggested MVP Scope

**Minimum Viable Product**: User Stories 1 & 2
- View and search employees (US1)
- Add new employees (US2)

This provides core functionality for employee management. Additional stories can be added incrementally.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All file paths follow the structure defined in plan.md
- Backend uses Next.js API routes in `backend/src/app/api/`
- Frontend uses Next.js App Router in `frontend/src/app/`
- Database is SQLite3 managed in `backend/src/lib/db/`

