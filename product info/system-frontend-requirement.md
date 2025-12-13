# Frontend Requirements - SuiteCRM 8.9.1

## 1. UI Screens & Routes

### Main Application Routes

#### Authentication Routes
- **Login**: `/Login`
  - Component: `LoginUiComponent`
  - Guard: `LoginAuthGuard`
  - Purpose: User authentication

- **Logout**: `/logged-out`
  - Component: `LogoutComponent`
  - Purpose: Session termination

- **2FA Configuration**: `/users/2fa-config`
  - Component: `TwoFactorComponent`
  - Guard: `TwoFactorAuthGuard`
  - Purpose: Two-factor authentication setup

#### Installation Route
- **Install**: `/install`
  - Component: `InstallViewComponent`
  - Guard: `InstallAuthGuard`
  - Purpose: Application installation wizard

#### Administration Route
- **Administration**: `/administration`
  - Component: `AdminPanelComponent`
  - Guard: `AuthGuard`
  - Children: `/administration/index` (redirects to base)

#### Module Routes (Dynamic)
Routes are dynamically generated based on `module_routing` configuration:

**List Views**:
- `/{module}` - Main list view
- `/{module}/index` - List view (redirect)
- `/{module}/list` - List view

**Record Views**:
- `/{module}/record/:record` - Detail view
- `/{module}/detail/:record` - Detail view (alternative)
- `/{module}/edit/:record` - Edit view

**Create Views**:
- `/{module}/create` - Create new record
- `/{module}/edit` - Edit mode (create component)
- `/{module}/duplicate/:record` - Duplicate existing record
- `/{module}/convert/:record` - Convert record (e.g., Lead to Contact)

#### Legacy Routes (Fallback)
- `/:module` - Classic view
- `/:module/:action` - Classic view with action
- `/:module/:action/:record` - Classic view with action and record

### Module List (100+ Modules)
Based on `module_name_map.php`, key modules include:

**Core CRM Modules**:
- Home, Activities, History, Calendar
- Calls, Calls_Reschedule, Meetings, Tasks, Notes
- Leads, Contacts, Accounts, Opportunities
- Campaigns, Targets, Prospects, ProspectLists
- Emails, EmailTemplates, InboundEmail, MailMerge

**Support Modules**:
- Cases, Documents, DocumentRevisions
- Bugs, Project, ProjectTask

**Administration Modules**:
- Administration, Users, Employees, Roles
- SecurityGroups, ACL, ACLRoles, ACLActions
- UserPreferences, MySettings, Configurator
- Studio, ModuleBuilder, Connectors

**Advanced Modules**:
- AOS_Products, AOS_Quotes, AOS_Invoices, AOS_Contracts
- AOR_Reports, AOR_Scheduled_Reports, AOR_Fields, AOR_Charts, AOR_Conditions
- AOW_WorkFlow, AOW_Actions, AOW_Processed, AOW_Conditions
- Surveys, SurveyResponses, SurveyQuestions, SurveyQuestionOptions
- FP_events, FP_Event_Locations
- AOK_KnowledgeBase, AOK_Knowledge_Base_Categories
- jjwg_Maps, jjwg_Markers, jjwg_Areas, jjwg_Address_Cache

**System Modules**:
- Import, MergeRecords, SavedSearch
- Schedulers, Schedulers_jobs, Trackers
- Currencies, Releases, Versions
- CustomFields, DynamicFields, FieldsMetaData
- LabelEditor, Audit, OptimisticLock

### Navigation Hierarchy

**Top Navigation Bar**:
- Home menu item (always visible)
- Grouped menu paradigm (configurable via `navigation_paradigm` preference)
- Non-grouped menu paradigm (default)
- "More" dropdown for additional modules
- Global action icons (search, notifications, user menu)

**Sidebar Navigation**:
- Mobile-responsive sidebar
- Module filtering/search
- Collapsible menu items
- Recently viewed records

**Breadcrumbs**:
- Module → Record navigation
- Context-aware breadcrumb trail

---

## 2. UI Components

### Tables

**TableComponent** (`scrm-table`)
- **Props**:
  - `showHeader: boolean` - Display table header
  - `showFooter: boolean` - Display table footer
  - `klass: string` - CSS classes
  - `dataSource: DataSource<Record>` - Record data source
  - `columns: Observable<ColumnDefinition[]>` - Column definitions
  - `maxColumns$: Observable<number>` - Maximum visible columns
  - `lineActions?: ActionDataSource` - Row-level actions
  - `maxListHeight?: number` - Maximum table height
  - `selection$?: Observable<RecordSelection>` - Selection state
  - `selectedCount$?: Observable<number>` - Selected count
  - `selectedStatus$?: Observable<SelectionStatus>` - Selection status
  - `sort$?: Observable<SortingSelection>` - Sort configuration
  - `loading$?: Observable<boolean>` - Loading state
  - `selection?: SelectionDataSource` - Selection data source
  - `bulkActions?: BulkActionDataSource` - Bulk action menu
  - `pagination?: PaginationDataSource` - Pagination data
  - `tableActions?: ActionDataSource` - Table-level actions
  - `paginationType?: string` - Pagination type (scroll/button)
  - `module?: string` - Module name
- **Events**:
  - `toggleRecordSelection(id: string)` - Toggle row selection
  - `updateSorting(orderBy: string, sortOrder: SortDirection)` - Update sorting
  - `loadMore()` - Load more records
  - `allLoaded(): boolean` - Check if all records loaded

**Table Features**:
- Column sorting (ascending/descending)
- Row selection (single/multiple)
- Bulk actions menu
- Line actions menu per row
- Pagination (scroll-based or button-based)
- Column chooser
- Responsive column hiding
- Loading states

### Forms

**Field Components** (Dynamic based on field type):
- **Varchar**: Text input
- **Text**: Textarea
- **Int**: Integer input
- **Float**: Decimal input
- **Currency**: Currency input with symbol
- **Date**: Date picker
- **DateTime**: Date and time picker
- **Phone**: Phone number input
- **Email**: Email input with validation
- **URL**: URL input
- **Password**: Password input (masked)
- **Boolean**: Checkbox
- **DropdownEnum**: Dropdown select
- **RadioEnum**: Radio button group
- **MultiEnum**: Multi-select dropdown
- **Relate**: Related record selector (autocomplete/search)
- **MultiRelate**: Multi-select related records
- **MultiFlexRelate**: Flexible multi-relate
- **FullName**: First name, last name, salutation
- **Html**: HTML content display
- **TinyMCE**: Rich text editor
- **Squire**: Rich text editor (alternative)
- **File**: File upload/download
- **Attachment**: File attachments with preview
- **Icon**: Icon selector

**Field Component Props**:
- `mode: string` - View mode (detail/edit/filter/list)
- `type: string` - Field type
- `field: Field` - Field definition
- `record: Record` - Record data
- `klass: object` - CSS classes

**Form Features**:
- Required field validation
- Field-level validation
- Conditional field display
- Field dependencies
- Read-only mode
- Default values
- Dynamic labels
- Async validation

### Modals

**ModalComponent** (`scrm-modal`)
- **Props**:
  - `klass: string` - CSS classes
  - `headerKlass: string` - Header CSS classes
  - `bodyKlass: string` - Body CSS classes
  - `footerKlass: string` - Footer CSS classes
  - `titleKey: string` - Title label key
  - `dynamicTitleKey: string` - Dynamic title key
  - `dynamicTitleContext: WritableSignal<StringMap>` - Title context
  - `dynamicTitleFields: WritableSignal<FieldMap>` - Title fields
  - `descriptionKey: string` - Description label key
  - `dynamicDescriptionKey: string` - Dynamic description key
  - `limit: string` - Record limit display
  - `limitLabel: string` - Limit label key
  - `closable: boolean` - Show close button
  - `minimizable: boolean` - Allow minimize
  - `isMinimized$: Observable<boolean>` - Minimize state
  - `close: ButtonInterface` - Close button config
- **Events**:
  - `onMinimizeToggle: EventEmitter<boolean>` - Minimize toggle event

**RecordModalComponent** (`scrm-record-modal`)
- **Props**:
  - `titleKey: string` - Title label key
  - `module: string` - Module name
  - `metadataView: string` - View metadata name (default: 'recordView')
  - `mode: ViewMode` - View mode
  - `minimizable: boolean` - Allow minimize
  - `recordId: string` - Record ID
  - `parentId: string` - Parent record ID
  - `parentModule: string` - Parent module
  - `mappedFields: ObjectMap` - Field mappings
  - `contentAdapter: any` - Content adapter
  - `actionsAdapter: any` - Actions adapter
  - `closeConfirmationLabel: string` - Close confirmation label
  - `closeConfirmationMessages: string[]` - Close confirmation messages
  - `closeConfirmationModal: boolean` - Require close confirmation

**MessageModalComponent** (`scrm-message-modal`)
- **Props**:
  - `titleKey: string` - Title label key
  - `labelKeys: []` - Label keys array
  - `descriptionKey: string` - Description label key
  - `context: StringMap` - Context data
  - `fields: FieldMap` - Field data
  - `textKey: string` - Text label key
  - `buttons: AnyModalButtonInterface[]` - Action buttons
  - `onClose: Function` - Close callback

**RecordListModalComponent** (`scrm-record-list-modal`)
- Modal for selecting records from a list
- Supports single and multi-select
- Includes search and filtering

### Filters

**ListFilterComponent** (`scrm-list-filter`)
- Quick filters
- Advanced filters
- Saved filters
- Filter presets

**Filter Field Types**:
- Text filter
- Date filter
- DateTime filter
- Dropdown filter
- Boolean checkbox filter
- Multi-select filter

### Buttons

**ButtonComponent** (`scrm-button`)
- **Props**:
  - `config: ButtonInterface` - Button configuration
  - `disabled: WritableSignal<boolean>` - Disabled state
  - `isRunning: WritableSignal<boolean>` - Loading state
- **ButtonInterface Properties**:
  - `label: string` - Button label
  - `labelKey: string` - Label key for translation
  - `labelModule: string` - Module for label translation
  - `klass: string[]` - CSS classes
  - `icon: string` - Icon name
  - `titleKey: string` - Tooltip label key
  - `onClick: Function` - Click handler
  - `debounceClick: boolean` - Debounce clicks
  - `maxWidth: number` - Maximum width
  - `style: string` - Inline styles

**ActionGroupMenuComponent** (`scrm-action-group-menu`)
- Groups multiple action buttons
- Responsive breakpoint handling
- Dropdown for overflow actions
- Inline confirmation support

**BulkActionMenuComponent** (`scrm-bulk-action-menu`)
- Bulk operations on selected records
- Actions: Delete, Export, Mass Update, etc.

**LineActionMenuComponent** (`scrm-line-action-menu`)
- Row-level action menu
- Context-aware actions
- Icon-based or text-based

### Cards

**AdminCardComponent** (`scrm-admin-card`)
- Administration panel cards
- Card-based layout for admin sections

**RecordPanelComponent** (`scrm-record-panel`)
- Record detail panel
- Sidebar panels
- Collapsible sections

### Other Components

**PaginationComponent** (`scrm-pagination`)
- Page-based pagination
- Scroll-based pagination (load more)
- Record count display
- Page size selector

**SearchBarComponent** (`scrm-search-bar`)
- Global search
- Module-specific search
- Search suggestions
- Recent searches

**LoadingSpinnerComponent** (`scrm-loading-spinner`)
- Full-page spinner
- Inline spinner
- Overlay spinner

**MessageComponent** (`scrm-message-ui`)
- Success messages
- Error messages
- Warning messages
- Info messages
- Toast notifications

**StatusBarComponent** (`scrm-status-bar`)
- Status indicators
- Progress indicators
- Badge displays

---

## 3. Common Reusable Components

### Input Components

**FieldComponent** (`scrm-field`)
- Universal field wrapper
- Dynamically loads field type component
- Handles field modes (detail/edit/filter/list)
- Manages field validation and display logic

**BaseFieldComponent**
- Base implementation for all field types
- Common field functionality
- Value management
- Validation integration

**DynamicFieldComponent** (`scrm-dynamic-field`)
- Dynamic field rendering
- Field logic execution
- Conditional display

### Dropdowns

**DropdownEnumEditFieldComponent**
- Enum dropdown select
- Searchable dropdown
- Multi-select support

**RelateEditFieldComponent**
- Related record selector
- Autocomplete search
- Modal record picker
- Create new related record

### Alert Boxes

**MessageModalComponent** - Modal alerts
**MessageComponent** - Toast/inline messages
**ConfirmationModalService** - Confirmation dialogs

### Badges

Status badges for records
Priority indicators
Custom badge components

### Loaders

**FullPageSpinnerComponent** (`app-full-page-spinner`)
- Full-page loading overlay

**LoadingSpinnerComponent** (`scrm-loading-spinner`)
- Inline loading spinner
- Overlay spinner

**InlineLoadingSpinnerComponent** (`scrm-inline-loading-spinner`)
- Small inline spinner
- Button loading state

**SkeletonLoaders**:
- RecordContentSkeletonComponent
- FileSkeletonComponent
- HistorySidebarSkeletonLoadingComponent

### Pagination

**PaginationComponent** (`scrm-pagination`)
- Page navigation
- Record count
- Page size options
- Load more functionality

**LoadMoreComponent** (`scrm-load-more`)
- Infinite scroll trigger
- Load more button

### Search Bars

**SearchBarComponent** (`scrm-search-bar`)
- Global search
- Module filtering
- Search suggestions
- Recent searches

### Headers

**BaseRecordHeaderComponent** (`scrm-base-record-header`)
- Record detail header
- Action buttons
- Breadcrumbs
- Module title

**ListHeaderComponent** (`scrm-list-header`)
- List view header
- Action menu
- Filter toggle
- Column chooser

### Sidebars

**SidebarComponent** (`scrm-sidebar`)
- Navigation sidebar
- Mobile menu
- Module filtering
- Recently viewed

**SidebarWidgetComponent** (`scrm-sidebar-widget`)
- Widget container
- Collapsible widgets
- Widget types:
  - HistorySidebarWidget
  - ChartSidebarWidget
  - BannerGridSidebarWidget
  - RecordThreadSidebarWidget
  - RecordTableWidget
  - StatisticsSidebarWidget

### Navigation Components

**NavbarComponent** (`scrm-navbar-ui`)
- Top navigation bar
- Module menu
- User menu
- Global actions
- Search integration

**HomeMenuItemComponent** (`scrm-home-menu-item`)
- Home navigation item
- Active state indicator

**MenuItemComponent** (`scrm-menu-item`)
- Navigation menu item
- Dropdown submenu support

**GroupedMenuItemComponent** (`scrm-grouped-menu-item`)
- Grouped menu paradigm
- Nested menu support

**MenuItemsListComponent** (`scrm-menu-items-list`)
- "More" menu dropdown
- Overflow menu items

**MobileMenuComponent** (`scrm-mobile-menu`)
- Mobile navigation menu
- Collapsible menu items

### Footer

**FooterComponent** (`scrm-footer-ui`)
- Application footer
- Copyright information
- Version display

### Other Reusable Components

**LabelComponent** (`scrm-label`)
- Translated labels
- Module-specific labels
- Dynamic labels

**DynamicLabelComponent** (`scrm-dynamic-label`)
- Context-aware labels
- Field-based labels

**ImageComponent** (`scrm-image`)
- Image display
- Icon rendering
- Responsive images

**LogoComponent** (`scrm-logo`)
- Application logo
- Branding display

**ModuleTitleComponent** (`scrm-module-title`)
- Module name display
- Breadcrumb integration

**ColumnChooserComponent** (`scrm-columnchooser`)
- Column visibility toggle
- Column reordering
- Column width adjustment

**SortButtonComponent** (`scrm-sort-button`)
- Column sort toggle
- Sort direction indicator

**CloseButtonComponent** (`scrm-close-button`)
- Modal close button
- Customizable styling

**MinimiseButtonComponent** (`scrm-minimise-button`)
- Modal minimize button
- Minimize state toggle

**PopupButtonComponent** (`scrm-popup-button`)
- Popup trigger button
- Tooltip support

**RecordDetailsPopupButtonComponent** (`scrm-record-details-popup-button`)
- Record preview popup
- Quick view

**FavoriteToggleComponent** (`scrm-favorite-toggle`)
- Favorite/unfavorite toggle
- Star icon indicator

**RecordPaginationComponent** (`scrm-record-pagination`)
- Previous/Next record navigation
- Record list navigation

**RecordContentComponent** (`scrm-record-content`)
- Record form display
- Field layout rendering

**RecordFlexboxComponent** (`scrm-record-flexbox`)
- Flexible record layout
- Responsive field grid

**RecordGridComponent** (`scrm-record-grid`)
- Grid-based record layout
- Column-based field display

**FieldGridComponent** (`scrm-field-grid`)
- Field grid layout
- Responsive columns

**FieldLayoutComponent** (`scrm-field-layout`)
- Dynamic field layout
- Panel-based organization
- Tab-based organization

**PanelComponent** (`scrm-panel`)
- Collapsible panels
- Section grouping

**SubpanelComponent** (`scrm-subpanel`)
- Related records subpanel
- Embedded list view
- Relationship management

**SubpanelContainerComponent** (`scrm-subpanel-container`)
- Subpanel wrapper
- Multiple subpanels

**RecordThreadComponent** (`scrm-record-thread`)
- Activity thread
- Timeline view
- Comment thread

**RecordThreadItemComponent** (`scrm-record-thread-item`)
- Thread item display
- Activity item

**TopWidgetComponent** (`scrm-top-widget`)
- Top section widgets
- Statistics widgets
- Grid widgets

**GridTopWidgetComponent** (`scrm-grid-top-widget`)
- Grid-based top widget
- Dashboard widgets

**StatisticsTopWidgetComponent** (`scrm-statistics-top-widget`)
- Statistics display
- Metrics widgets

**ChartSidebarWidgetComponent** (`scrm-chart-sidebar-widget`)
- Chart widgets
- Data visualization

**BannerGridSidebarWidgetComponent** (`scrm-banner-grid-sidebar-widget`)
- Banner display
- Grid layout

**RecordTableWidgetComponent** (`scrm-record-table-widget`)
- Embedded table widget
- Related records table

**StatisticsSidebarWidgetComponent** (`scrm-statistics-sidebar-widget`)
- Statistics sidebar widget
- Metrics display

**HistorySidebarWidgetComponent** (`scrm-history-sidebar-widget`)
- Activity history
- Timeline view

**RecordPanelComponent** (`scrm-record-panel`)
- Record detail panel
- Sidebar panel

**WidgetPanelComponent** (`scrm-widget-panel`)
- Widget container
- Panel wrapper

**GridWidgetComponent** (`scrm-grid-widget`)
- Grid layout widget
- Dashboard grid

**MonacoEditorComponent** (`scrm-monaco-editor`)
- Code editor
- Syntax highlighting

**FileUploadAreaComponent** (`scrm-file-upload-area`)
- File upload zone
- Drag and drop

**UploadedFileComponent** (`scrm-uploaded-file`)
- File display
- Download link
- File preview

**MultipleUploadedFileComponent** (`scrm-multiple-uploaded-file`)
- Multiple file display
- File list

**ColorSelectorComponent** (`scrm-color-selector`)
- Color picker
- Color selection

**RecordContentSkeletonComponent** (`scrm-record-content-skeleton`)
- Loading skeleton for record content
- Placeholder display

**FileSkeletonComponent** (`scrm-file-skeleton`)
- Loading skeleton for files
- Placeholder display

---

## 4. Data Requirements

### API Endpoints

#### Base Configuration
- **Base URL**: `/Api/V8/`
- **Authentication**: OAuth 2.0
- **Format**: JSON-API

#### Module Endpoints

**List Records**:
- `GET /V8/module/{moduleName}`
- **Query Parameters**:
  - `page[offset]` - Pagination offset
  - `page[limit]` - Pagination limit
  - `filter` - Filter criteria (JSON)
  - `sort` - Sort field and direction
  - `fields[{moduleName}]` - Field selection
- **Response**: JSON-API format with `data` array, `meta`, `links`

**Get Single Record**:
- `GET /V8/module/{moduleName}/{id}`
- **Response**: JSON-API format with single record in `data`

**Create Record**:
- `POST /V8/module`
- **Request Body**: JSON-API format
  ```json
  {
    "data": {
      "type": "Accounts",
      "attributes": {
        "name": "Account Name",
        ...
      }
    }
  }
  ```
- **Response**: 201 Created with created record

**Update Record**:
- `PATCH /V8/module`
- **Request Body**: JSON-API format with `id` and attributes
- **Response**: 201 Created (legacy behavior)

**Delete Record**:
- `DELETE /V8/module/{moduleName}/{id}`
- **Response**: 200 OK (soft delete)

#### Relationship Endpoints

**Get Relationships**:
- `GET /V8/module/{moduleName}/{id}/relationships/{linkFieldName}`
- **Query Parameters**: `page[offset]`, `page[limit]`, `filter`, `sort`
- **Response**: JSON-API format with related records

**Create Relationship**:
- `POST /V8/module/{moduleName}/{id}/relationships`
- **Request Body**: JSON-API format with related record data
- **Response**: 201 Created

**Link Existing Record**:
- `POST /V8/module/{moduleName}/{id}/relationships/{linkFieldName}`
- **Request Body**: JSON-API format with existing record ID
- **Response**: 201 Created

**Delete Relationship**:
- `DELETE /V8/module/{moduleName}/{id}/relationships/{linkFieldName}/{relatedBeanId}`
- **Response**: 200 OK

#### Metadata Endpoints

**Get Module List**:
- `GET /V8/meta/modules`
- **Response**: Available modules with metadata

**Get Field Definitions**:
- `GET /V8/meta/fields/{moduleName}`
- **Response**: Field definitions including types, labels, relationships

**Get Search Definitions**:
- `GET /V8/search-defs/module/{moduleName}`
- **Response**: Search field definitions

**Get ListView Columns**:
- `GET /V8/listview/columns/{moduleName}`
- **Response**: Column definitions for list view

**Get View Definitions**:
- `GET /V8/meta/view/{moduleName}/{viewName}`
- **Response**: View metadata (recordView, editView, listView, etc.)

**Get Swagger Schema**:
- `GET /V8/meta/swagger.json`
- **Response**: OpenAPI/Swagger schema

#### User Endpoints

**Get Current User**:
- `GET /V8/current-user`
- **Response**: Current authenticated user data

**Get User Preferences**:
- `GET /V8/user-preferences/{id}`
- **Response**: User preferences

**Update User Preferences**:
- `PATCH /V8/user-preferences/{id}`
- **Request Body**: JSON-API format with preference updates
- **Response**: Updated preferences

**Logout**:
- `POST /V8/logout`
- **Response**: 200 OK

#### Authentication Endpoints

**OAuth Token**:
- `POST /access_token`
- **Request**: OAuth 2.0 token request
- **Response**: Access token and refresh token

### Request/Response Structure

#### JSON-API Request Format
```json
{
  "data": {
    "type": "Accounts",
    "id": "uuid-here",
    "attributes": {
      "name": "Account Name",
      "account_type": "Customer",
      ...
    },
    "relationships": {
      "assigned_user": {
        "data": {
          "type": "Users",
          "id": "user-uuid"
        }
      }
    }
  }
}
```

#### JSON-API Response Format
```json
{
  "data": {
    "type": "Accounts",
    "id": "uuid-here",
    "attributes": {
      "name": "Account Name",
      "account_type": "Customer",
      "date_entered": "2024-01-01T00:00:00Z",
      ...
    },
    "relationships": {
      "assigned_user": {
        "data": {
          "type": "Users",
          "id": "user-uuid"
        }
      }
    },
    "links": {
      "self": "/Api/V8/module/Accounts/uuid-here"
    }
  },
  "meta": {
    "total": 100,
    "page": {
      "offset": 0,
      "limit": 20
    }
  },
  "links": {
    "self": "/Api/V8/module/Accounts?page[offset]=0&page[limit]=20",
    "first": "/Api/V8/module/Accounts?page[offset]=0&page[limit]=20",
    "last": "/Api/V8/module/Accounts?page[offset]=80&page[limit]=20",
    "next": "/Api/V8/module/Accounts?page[offset]=20&page[limit]=20"
  }
}
```

#### Error Response Format
```json
{
  "errors": [
    {
      "status": "400",
      "code": "VALIDATION_ERROR",
      "title": "Validation Error",
      "detail": "Field 'name' is required",
      "source": {
        "pointer": "/data/attributes/name"
      }
    }
  ]
}
```

### Data Mapping and Transformations

**Field Type Mappings**:
- `varchar` → Text input
- `text` → Textarea
- `int` → Integer input
- `float` → Decimal input
- `currency` → Currency input
- `date` → Date picker
- `datetime` → DateTime picker
- `phone` → Phone input
- `email` → Email input
- `url` → URL input
- `password` → Password input
- `bool` → Checkbox
- `enum` → Dropdown
- `multienum` → Multi-select
- `relate` → Related record selector
- `multirelate` → Multi-relate selector
- `file` → File upload
- `html` → HTML display/editor

**Value Transformations**:
- Date formatting (ISO 8601 ↔ display format)
- Currency formatting (amount ↔ display with symbol)
- Phone formatting (raw ↔ formatted)
- Boolean (0/1 ↔ true/false)
- Enum (value ↔ label)
- Multi-enum (comma-separated ↔ array)

**Relationship Transformations**:
- One-to-many: Foreign key → Related record object
- Many-to-many: Join table → Related records array
- Parent-child: Parent ID → Parent record object

---

## 5. User Actions & Flows

### Button Actions

**Record View Actions**:
- **Save** - Save record changes
- **Cancel** - Discard changes and return
- **Delete** - Delete record (with confirmation)
- **Duplicate** - Create duplicate record
- **Convert** - Convert record (e.g., Lead to Contact/Opportunity)
- **Export** - Export record data
- **Print** - Print record
- **Email** - Send email
- **Create Related** - Create related record
- **View Related** - View related record
- **Edit** - Switch to edit mode
- **View** - Switch to view mode

**List View Actions**:
- **Create** - Create new record
- **Import** - Import records
- **Export** - Export selected records
- **Delete** - Delete selected records
- **Mass Update** - Update multiple records
- **Merge** - Merge selected records
- **Email** - Send email to selected records
- **Print** - Print selected records
- **View** - View selected record
- **Edit** - Edit selected record
- **Duplicate** - Duplicate selected record

**Bulk Actions**:
- Delete multiple records
- Mass update fields
- Export selected records
- Email selected records
- Assign to user
- Change status

**Line Actions** (Per Row):
- View record
- Edit record
- Delete record
- Duplicate record
- Convert record
- Email record
- Print record
- Create related record

### Form Flows

**Create Flow**:
1. User clicks "Create" button
2. Navigate to `/{module}/create`
3. Load create view metadata
4. Initialize form with default values
5. User fills form fields
6. Field validation on change
7. User clicks "Save"
8. Form validation
9. Submit to API (`POST /V8/module`)
10. On success: Navigate to record detail view
11. On error: Display validation errors

**Edit Flow**:
1. User clicks "Edit" button on record
2. Navigate to `/{module}/edit/:record`
3. Load record data
4. Load edit view metadata
5. Populate form with record data
6. User modifies fields
7. Field validation on change
8. User clicks "Save"
9. Form validation
10. Submit to API (`PATCH /V8/module`)
11. On success: Update record, show success message
12. On error: Display validation errors

**Delete Flow**:
1. User clicks "Delete" button
2. Show confirmation modal
3. User confirms deletion
4. Submit to API (`DELETE /V8/module/{moduleName}/{id}`)
5. On success: Navigate to list view, show success message
6. On error: Display error message

**Duplicate Flow**:
1. User clicks "Duplicate" button
2. Navigate to `/{module}/duplicate/:record`
3. Load source record data
4. Load create view metadata
5. Populate form with source data (excluding ID)
6. User modifies fields (optional)
7. User clicks "Save"
8. Submit to API (`POST /V8/module`)
9. On success: Navigate to new record detail view

**Convert Flow** (e.g., Lead to Contact):
1. User clicks "Convert" button on Lead
2. Navigate to `/{module}/convert/:record`
3. Load convert view metadata
4. Show conversion options (Contact, Account, Opportunity)
5. User selects target modules
6. User fills additional fields
7. User clicks "Convert"
8. Submit conversion to API
9. On success: Navigate to converted record(s)

### Navigation/Step-by-Step Workflows

**Login Workflow**:
1. User accesses application
2. Redirected to `/Login` if not authenticated
3. User enters credentials
4. Submit login form
5. Authenticate via API
6. On success: Load user preferences, navigation, redirect to home
7. On 2FA required: Redirect to `/users/2fa-config`
8. On error: Display error message

**List View Workflow**:
1. User navigates to module (e.g., `/accounts`)
2. Load list view metadata
3. Load saved filters/preferences
4. Fetch records from API
5. Display records in table
6. User can:
   - Sort columns
   - Filter records
   - Search records
   - Select records
   - Perform bulk actions
   - Navigate to record detail
   - Create new record
   - Paginate through results

**Record Detail Workflow**:
1. User clicks record from list
2. Navigate to `/{module}/record/:record`
3. Load record data from API
4. Load record view metadata
5. Display record fields
6. Load related records (subpanels)
7. User can:
   - Edit record
   - Delete record
   - Duplicate record
   - Convert record
   - View related records
   - Create related records
   - Navigate to previous/next record

**Search Workflow**:
1. User enters search term in global search
2. Search across modules (configurable)
3. Display search results grouped by module
4. User clicks result
5. Navigate to record detail

**Filter Workflow**:
1. User clicks filter button
2. Show filter panel
3. User selects filter criteria
4. Apply filters
5. Fetch filtered records from API
6. Update table display
7. User can save filter as preset

**Import Workflow**:
1. User navigates to Import module
2. Select module to import into
3. Upload CSV file
4. Map CSV columns to fields
5. Preview import data
6. Configure import settings
7. Execute import
8. Show import results (success/errors)

**Export Workflow**:
1. User selects records (or all)
2. Clicks "Export" button
3. Select export format (CSV, Excel, etc.)
4. Select fields to export
5. Configure export options
6. Generate export file
7. Download file

---

## 6. Validations & Conditional Logic

### Required Fields

**Required Field Validation**:
- Fields marked as `required: true` in field definition
- Validation triggered on form submit
- Real-time validation on field blur
- Required indicator (asterisk) in label
- Error message: "This field is required"

**Conditional Required Fields**:
- Fields can be conditionally required based on other field values
- Logic defined in `field.logic.required` actions
- Evaluated on field value changes
- Dynamic required state updates

### Field Validations

**Type-Specific Validations**:

**Email**:
- Valid email format
- Primary email uniqueness (if applicable)
- Duplicate email check (if applicable)

**Phone**:
- Valid phone format
- Country code validation (if applicable)

**URL**:
- Valid URL format
- Protocol validation (http/https)

**Date**:
- Valid date format
- Date range validation (if applicable)
- Business day validation (if applicable)

**DateTime**:
- Valid date and time format
- Timezone handling

**Currency**:
- Valid numeric format
- Decimal precision validation
- Currency symbol validation

**Integer**:
- Valid integer format
- Range validation (min/max)

**Float**:
- Valid decimal format
- Precision validation
- Range validation (min/max)

**Password**:
- Minimum length
- Complexity requirements (if configured)
- Confirmation match (if applicable)

**Text/Varchar**:
- Maximum length validation
- Pattern validation (regex, if applicable)

**Enum/Dropdown**:
- Valid option selection
- Option existence validation

**MultiEnum**:
- At least one selection (if required)
- Valid option selections

**Relate**:
- Related record exists
- Related record access permission
- Relationship type validation

**MultiRelate**:
- At least one selection (if required)
- Valid related records

**File**:
- File type validation
- File size validation
- File extension validation

### Dynamic UI States

**Field Display Logic**:
- Fields can be shown/hidden based on other field values
- Logic defined in `field.displayLogic` actions
- Evaluated on field value changes
- Smooth show/hide transitions

**Field Read-Only Logic**:
- Fields can be made read-only based on conditions
- Logic defined in field definition or display logic
- Visual indication (disabled styling)

**Field Value Dependencies**:
- Field values can depend on other field values
- Auto-population based on related fields
- Cascading dropdowns
- Calculated fields

**Panel Display Logic**:
- Entire panels can be shown/hidden
- Logic defined in panel metadata
- Based on field values or record state

**Tab Display Logic**:
- Tabs can be shown/hidden
- Logic defined in tab metadata
- Based on module configuration or record state

### Role-Based Visibility Rules

**Field-Level ACL**:
- Fields can be hidden based on user role
- Read-only based on role
- Edit permission based on role
- Logic defined in field metadata `acl` property

**Module-Level ACL**:
- Module access based on role
- List/View/Create/Edit/Delete permissions
- Import/Export permissions

**Record-Level ACL**:
- Record access based on ownership
- Team-based access
- Security group access
- Logic evaluated per record

**Action-Level ACL**:
- Actions can be hidden based on role
- Button visibility based on permissions
- Menu item visibility based on role

**View-Level ACL**:
- Entire views can be restricted
- Alternative views for different roles
- Custom views per role

### Conditional Logic Examples

**Required Field Logic**:
```yaml
logic:
  required:
    - action: required
      params:
        activeOnFields:
          account_type: ["Customer", "Partner"]
```
- Field is required when `account_type` is "Customer" or "Partner"

**Display Logic**:
```yaml
displayLogic:
  display:
    - action: display
      params:
        activeOnFields:
          account_type: ["Customer"]
```
- Field is displayed when `account_type` is "Customer"

**Value Dependency**:
```yaml
fieldDependencies:
  billing_address_street: ["shipping_address_street"]
```
- `billing_address_street` value depends on `shipping_address_street`

**Panel Logic**:
```yaml
panels:
  - name: billing_panel
    displayLogic:
      display:
        - action: display
          params:
            activeOnFields:
              account_type: ["Customer"]
```
- Panel is displayed when `account_type` is "Customer"

---

## 7. Styling & Layout

### CSS Classes

**Bootstrap Integration**:
- Application uses Bootstrap 5
- Bootstrap utility classes throughout
- Custom Bootstrap theme variables

**Component-Specific Classes**:

**Table Classes**:
- `.table` - Base table
- `.light-table` - Light theme table
- `.table-header` - Table header
- `.table-footer` - Table footer
- `.table-row` - Table row
- `.table-cell` - Table cell
- `.selected-row` - Selected row
- `.sortable-column` - Sortable column header

**Form Classes**:
- `.field` - Base field wrapper
- `.field-mode-{mode}` - Field mode (detail/edit/filter/list)
- `.field-type-{type}` - Field type
- `.field-name-{name}` - Field name
- `.form-group` - Form group
- `.form-control` - Form control
- `.form-label` - Form label
- `.required-field` - Required field indicator
- `.readonly-field` - Read-only field
- `.error-field` - Field with error
- `.valid-field` - Valid field

**Modal Classes**:
- `.modal` - Base modal
- `.record-modal` - Record modal
- `.modal-header` - Modal header
- `.modal-body` - Modal body
- `.modal-footer` - Modal footer
- `.minimized` - Minimized modal
- `.minimizable` - Minimizable modal

**Button Classes**:
- `.btn` - Base button
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-outline-light` - Outline light button
- `.btn-sm` - Small button
- `.action-button` - Action button
- `.settings-button` - Settings button
- `.is-running` - Loading button state
- `.disabled` - Disabled button

**Layout Classes**:
- `.app-shell` - Application shell
- `.navbar` - Navigation bar
- `.sidebar` - Sidebar
- `.main-content` - Main content area
- `.record-container` - Record container
- `.list-container` - List container
- `.field-grid` - Field grid layout
- `.field-layout` - Field layout
- `.panel` - Panel container
- `.subpanel` - Subpanel container

**Utility Classes**:
- `.d-flex` - Flexbox display
- `.justify-content-{position}` - Justify content
- `.align-items-{position}` - Align items
- `.flex-grow-1` - Flex grow
- `.flex-shrink-1` - Flex shrink
- `.m-0`, `.m-1`, etc. - Margins
- `.p-0`, `.p-1`, etc. - Padding
- `.border-0` - No border
- `.border-bottom` - Bottom border
- `.rounded` - Rounded corners
- `.small-font` - Small font size
- `.scrollbar-thin` - Thin scrollbar

### Theme Colors

**Primary Colors**:
- Primary brand color (configurable)
- Secondary color
- Accent colors

**Status Colors**:
- Success (green)
- Error (red)
- Warning (yellow/orange)
- Info (blue)

**Text Colors**:
- Primary text
- Secondary text (muted)
- Link color
- Link hover color

**Background Colors**:
- Primary background
- Secondary background
- Card background
- Modal background
- Sidebar background
- Header background

**Border Colors**:
- Primary border
- Secondary border
- Divider color

### Typography

**Font Families**:
- Primary font family (configurable)
- Monospace font for code/technical content

**Font Sizes**:
- Base font size
- Heading sizes (h1-h6)
- Small font (`.small-font`)
- Large font

**Font Weights**:
- Normal (400)
- Medium (500)
- Semibold (600)
- Bold (700)

**Line Heights**:
- Base line height
- Tight line height
- Loose line height

### Spacing Patterns

**Margin Scale**:
- `.m-0` - 0
- `.m-1` - 0.25rem (4px)
- `.m-2` - 0.5rem (8px)
- `.m-3` - 1rem (16px)
- `.m-4` - 1.5rem (24px)
- `.m-5` - 3rem (48px)

**Padding Scale**:
- Same as margin scale (`.p-0` through `.p-5`)

**Gap Scale** (for flexbox/grid):
- `.gap-1` through `.gap-5`
- Similar spacing values

### Layout Templates

**App Shell Layout**:
```
.app-shell
  ├── .navbar (top navigation)
  ├── .sidebar (left sidebar, collapsible)
  ├── .main-content (router outlet)
  └── .footer (bottom footer)
```

**Record View Layout**:
```
.record-container
  ├── .record-header (breadcrumbs, title, actions)
  ├── .record-content (field layout)
  │   ├── .field-layout (panels/tabs)
  │   │   ├── .panel (collapsible sections)
  │   │   │   └── .field-grid (responsive grid)
  │   │   └── .field (individual fields)
  └── .subpanels (related records)
      └── .subpanel (embedded list views)
```

**List View Layout**:
```
.list-container
  ├── .list-header (title, actions, filters)
  ├── .list-content
  │   ├── .table (data table)
  │   │   ├── .table-header (column headers)
  │   │   ├── .table-body (data rows)
  │   │   └── .table-footer (pagination)
  └── .list-sidebar (widgets, filters)
```

**Modal Layout**:
```
.modal
  ├── .modal-header (title, minimize, close)
  ├── .modal-body (content)
  └── .modal-footer (actions)
```

**Field Layout Patterns**:
- **Single Column**: Full width fields
- **Two Column**: 50/50 split
- **Three Column**: 33/33/33 split
- **Four Column**: 25/25/25/25 split
- **Responsive**: Adapts to screen size
- **Full Width**: Fields spanning full width (`.useFullColumn`)

**Panel Layout**:
- Collapsible panels
- Accordion-style panels
- Tabbed panels
- Grid-based panel organization

### Responsive Breakpoints

**Bootstrap Breakpoints**:
- `xs`: < 576px (mobile)
- `sm`: ≥ 576px (tablet portrait)
- `md`: ≥ 768px (tablet landscape)
- `lg`: ≥ 992px (desktop)
- `xl`: ≥ 1200px (large desktop)
- `xxl`: ≥ 1400px (extra large desktop)

**Responsive Behaviors**:
- Sidebar collapses to hamburger menu on mobile
- Table columns hide on smaller screens
- Field layouts stack on mobile
- Modals full-screen on mobile
- Navigation converts to mobile menu

### Animation & Transitions

**Modal Animations**:
- Fade in/out
- Slide animations
- Minimize/maximize transitions

**Loading States**:
- Spinner animations
- Skeleton loading animations
- Progress indicators

**Field Transitions**:
- Show/hide transitions
- Value change animations
- Validation error animations

**Navigation Transitions**:
- Route transitions
- Menu expand/collapse
- Sidebar slide in/out

---

## Summary

This document provides a comprehensive overview of the frontend specifications for SuiteCRM 8.9.1, including:

- **100+ modules** with dynamic routing
- **50+ reusable components** for forms, tables, modals, navigation
- **20+ field types** with validation and display logic
- **RESTful JSON-API** integration
- **Role-based access control** at field, record, and module levels
- **Responsive Bootstrap-based** UI with custom theming
- **Dynamic field logic** for conditional display and validation
- **Comprehensive validation** system with type-specific rules
- **Modern Angular** architecture with component-based design

The frontend is built on Angular with TypeScript, uses Bootstrap for styling, and integrates with a PHP/Symfony backend via JSON-API format. The architecture supports extensibility through modules, fields, and actions, making it highly configurable for different business needs.

