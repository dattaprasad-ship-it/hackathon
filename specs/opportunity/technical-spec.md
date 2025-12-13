# Technical Specification - Opportunity Module

**Feature Branch**: `opportunity-module`  
**Created**: 2025-12-13  
**Status**: Draft  
**Input**: Technical specification for Opportunity module implementation - Unified technical spec covering frontend and backend architecture, APIs, data models, components, and implementation details

---

## Overview

This technical specification provides implementation-level details for the Opportunity module, covering both frontend and backend architecture, API contracts, data models, component structure, database schema, integration points, and technical requirements.

**Module Purpose**: Manage sales opportunities through CRUD operations, bulk import/export, relationship management, and analytics visualization.

**Technology Stack**:
- **Frontend**: React 18.x, TypeScript 5.x, Tailwind CSS, Shadcn UI, React Hook Form, Zod, Axios, Zustand
- **Backend**: Node.js 18+, TypeScript 5.x, Express 4.x, TypeORM, PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **API Format**: JSON-API / RESTful

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  Components  │  │    Hooks     │     │
│  │              │  │              │  │              │     │
│  │ • ListView   │  │ • Table      │  │ • useOpps    │     │
│  │ • DetailView │  │ • Form       │  │ • useFilter  │     │
│  │ • CreateView │  │ • Modal      │  │ • useImport  │     │
│  │ • ImportWiz  │  │ • Chart      │  │              │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                │
│                   ┌────────▼────────┐                       │
│                   │  Service Layer  │                       │
│                   │  • opportunity  │                       │
│                   │  • lookup       │                       │
│                   │  • import       │                       │
│                   └────────┬────────┘                       │
└────────────────────────────┼────────────────────────────────┘
                             │ HTTP/REST
                             │
┌────────────────────────────▼────────────────────────────────┐
│                        Backend Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Controllers  │  │   Services   │  │ Repositories │     │
│  │              │  │              │  │              │     │
│  │ • OppCtrl    │  │ • OppService │  │ • OppRepo    │     │
│  │ • ImportCtrl │  │ • ImportSvc  │  │ • RelRepo    │     │
│  │ • LookupCtrl │  │ • Analytics  │  │              │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                │
│                   ┌────────▼────────┐                       │
│                   │   Database      │                       │
│                   │  PostgreSQL     │                       │
│                   │  • opportunities│                       │
│                   │  • relationships│                       │
│                   └─────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture

**Component Hierarchy**:
```
OpportunitiesModule
├── OpportunitiesListPage
│   ├── OpportunitiesTable
│   ├── QuickChartsPanel
│   ├── FilterPanel
│   ├── BulkActionDropdown
│   └── ColumnCustomizationModal
├── OpportunityDetailPage
│   ├── OpportunityDetailHeader
│   ├── OpportunityForm (view/edit)
│   ├── RelationshipsSection
│   └── InsightsPanel
├── CreateOpportunityPage
│   └── OpportunityForm (create)
├── ImportWizard
│   ├── ImportStep1 (Upload)
│   ├── ImportStep2 (Properties)
│   ├── ImportStep3 (Mapping)
│   ├── ImportStep4 (Duplicate Check)
│   └── ImportStep5 (Results)
└── LookupModal (reusable)
```

**State Management**:
- **Global State**: Zustand store for opportunities list state, filters, sorting, pagination
- **Local State**: React useState for form data, modal visibility, component-specific state
- **Server State**: React Query (optional) or custom hooks for API data caching and synchronization

### Backend Architecture

**Layered Architecture**:
```
Routes Layer
  ├── Authentication Middleware (JWT)
  ├── Authorization Middleware (Role-based)
  ├── Validation Middleware (Request validation)
  └── Controller Layer
        └── Service Layer
              ├── Business Logic
              ├── Data Transformation
              └── Repository Layer
                    └── Database (TypeORM)
```

---

## API Specifications

### Base Configuration

- **Base URL**: `/api/opportunities`
- **Authentication**: JWT Bearer Token in `Authorization` header
- **Content-Type**: `application/json`
- **Response Format**: JSON-API compatible (or custom JSON format)

### Endpoints

#### Opportunity CRUD

**GET /api/opportunities**
- **Description**: Retrieve paginated list of opportunities with filtering and sorting
- **Query Parameters**:
  - `page` (number, default: 1): Page number
  - `limit` (number, default: 20, max: 100): Records per page
  - `sortBy` (string): Column to sort by (name, amount, salesStage, etc.)
  - `sortOrder` (string): Sort direction ("asc", "desc", "none")
  - `filters` (object): Filter criteria (JSON stringified or object)
    - `name` (string): Opportunity name filter
    - `accountName` (string): Account name filter
    - `salesStage` (string[]): Sales stage filter (array of values)
    - `assignedTo` (string): Assigned user ID
    - `amount` (object): Amount filter with operators
      - `operator` ("eq", "gt", "lt", "between"): Equals, Greater Than, Less Than, Between
      - `value` (number | number[]): Single value for eq/gt/lt, array of [min, max] for between
    - `expectedCloseDate` (object): Date filter
      - `operator` ("eq", "gt", "lt", "between"): Equals, Greater Than, Less Than, Between
      - `value` (string | string[]): Single date (ISO format) for eq/gt/lt, array of [start, end] dates for between
    - `quickFilters` (object):
      - `myItems` (boolean): Show only assigned to current user
      - `openItems` (boolean): Exclude closed stages
      - `myFavorites` (boolean): Show only favorited
  - `search` (string): Quick search term (searches name field)
- **Response**: 
  ```typescript
  {
    data: Opportunity[],
    meta: {
      total: number,
      page: number,
      limit: number,
      totalPages: number
    },
    links?: {
      first: string,
      last: string,
      next?: string,
      prev?: string
    }
  }
  ```
- **Status Codes**: 200 OK, 401 Unauthorized, 403 Forbidden

**GET /api/opportunities/:id**
- **Description**: Retrieve single opportunity by ID with relationships
- **Response**: 
  ```typescript
  {
    data: Opportunity & {
      relationships?: {
        contacts?: Contact[],
        activities?: Activity[],
        documents?: Document[],
        // ... other relationships
      }
    }
  }
  ```
- **Status Codes**: 200 OK, 404 Not Found, 401 Unauthorized, 403 Forbidden

**POST /api/opportunities**
- **Description**: Create new opportunity
- **Request Body**:
  ```typescript
  {
    name: string,              // Required
    amount: number,            // Required, >= 0
    currency?: string,
    salesStage: string,        // Required, enum
    probability?: number,      // 0-100
    nextStep?: string,
    description?: string,
    accountId: string,         // Required, UUID
    expectedCloseDate: string, // Required, ISO date
    type?: string,
    leadSource?: string,
    campaignId?: string,       // UUID
    assignedToId?: string      // UUID
  }
  ```
- **Response**: Created opportunity object (201 Created)
- **Status Codes**: 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden

**PATCH /api/opportunities/:id**
- **Description**: Update existing opportunity
- **Request Body**: Partial opportunity object (all fields optional)
- **Response**: Updated opportunity object (200 OK)
- **Status Codes**: 200 OK, 400 Bad Request, 404 Not Found, 401 Unauthorized, 403 Forbidden

**DELETE /api/opportunities/:id**
- **Description**: Delete opportunity (soft delete)
- **Response**: Success confirmation (200 OK)
- **Status Codes**: 200 OK, 404 Not Found, 401 Unauthorized, 403 Forbidden

#### Bulk Operations

**DELETE /api/opportunities/bulk**
- **Description**: Bulk delete multiple opportunities
- **Request Body**:
  ```typescript
  {
    opportunityIds: string[]  // Array of UUIDs
  }
  ```
- **Response**: 
  ```typescript
  {
    deletedCount: number,
    failed: Array<{ id: string, error: string }>
  }
  ```
- **Status Codes**: 200 OK, 207 Multi-Status (partial success)

**POST /api/opportunities/export**
- **Description**: Export opportunities to CSV file
- **Request Body**:
  ```typescript
  {
    opportunityIds?: string[],  // Optional, if empty exports all accessible
    columns?: string[]          // Optional, specifies which columns
  }
  ```
- **Response**: CSV file download
- **Response**: File download (binary)
- **Status Codes**: 200 OK, 401 Unauthorized

**POST /api/opportunities/merge**
- **Description**: Merge multiple opportunities into one
- **Request Body**:
  ```typescript
  {
    sourceOpportunityIds: string[],
    targetOpportunityId: string,
    mergeStrategy: {
      // Field mappings specifying which fields to keep from which source
      [fieldName: string]: "target" | "source1" | "source2" | ...
    }
  }
  ```
- **Response**: Merged opportunity object (200 OK)
- **Status Codes**: 200 OK, 400 Bad Request, 404 Not Found

**PATCH /api/opportunities/mass-update**
- **Description**: Mass update multiple opportunities
- **Request Body**:
  ```typescript
  {
    opportunityIds: string[],
    updates: {
      // Fields to update with new values
      salesStage?: string,
      assignedToId?: string,
      // ... other fields
    }
  }
  ```
- **Response**: 
  ```typescript
  {
    updatedCount: number,
    failed: Array<{ id: string, error: string }>
  }
  ```
- **Status Codes**: 200 OK, 207 Multi-Status

#### Import Operations

**GET /api/opportunities/import/template**
- **Description**: Download import template file (CSV format)
- **Response**: CSV template file download
- **Status Codes**: 200 OK

**POST /api/opportunities/import/upload**
- **Description**: Upload import file
- **Request**: Multipart form data with file
- **Response**:
  ```typescript
  {
    fileId: string,
    fileName: string,
    fileSize: number,
    rowCount: number
  }
  ```
- **Status Codes**: 200 OK, 400 Bad Request (invalid file)

**POST /api/opportunities/import/analyze**
- **Description**: Analyze uploaded file properties
- **Request Body**:
  ```typescript
  {
    fileId: string
  }
  ```
- **Response**:
  ```typescript
  {
    delimiter: string,
    encoding: string,
    hasHeaderRow: boolean,
    columns: string[],
    preview: Array<Record<string, any>>,  // First 5 rows
    rowCount: number
  }
  ```
- **Status Codes**: 200 OK

**POST /api/opportunities/import/properties**
- **Description**: Confirm/modify import file properties
- **Request Body**:
  ```typescript
  {
    fileId: string,
    properties: {
      delimiter: string,
      encoding: string,
      hasHeaderRow: boolean,
      textQualifier?: string,
      dateFormat?: string,
      source?: "none" | "salesforce" | "outlook"
    }
  }
  ```
- **Response**: Updated properties and refreshed preview
- **Status Codes**: 200 OK

**POST /api/opportunities/import/map-fields**
- **Description**: Map import file columns to opportunity fields
- **Request Body**:
  ```typescript
  {
    fileId: string,
    mappings: Array<{
      fileColumn: string,
      moduleField: string,
      defaultValue?: any
    }>
  }
  ```
- **Response**: Mapping confirmation
- **Status Codes**: 200 OK, 400 Bad Request (missing required field mappings)

**POST /api/opportunities/import/duplicate-check**
- **Description**: Configure duplicate check fields
- **Request Body**:
  ```typescript
  {
    fileId: string,
    fieldsToCheck: string[]  // Array of field names
  }
  ```
- **Response**: Configuration confirmation
- **Status Codes**: 200 OK

**POST /api/opportunities/import/execute**
- **Description**: Execute import operation
- **Request Body**:
  ```typescript
  {
    fileId: string,
    importBehavior: "create-only" | "create-and-update",
    saveSettings?: boolean,
    settingsName?: string
  }
  ```
- **Response**:
  ```typescript
  {
    importId: string,
    totalRows: number,
    createdCount: number,
    updatedCount: number,
    errorCount: number,
    duplicateCount: number,
    status: "completed" | "failed" | "processing"
  }
  ```
- **Status Codes**: 200 OK, 400 Bad Request

**GET /api/opportunities/import/results/:importId**
- **Description**: Get import results with details
- **Response**:
  ```typescript
  {
    summary: {
      totalRows: number,
      createdCount: number,
      updatedCount: number,
      errorCount: number,
      duplicateCount: number
    },
    created: Opportunity[],
    errors: Array<{
      rowNumber: number,
      data: Record<string, any>,
      errors: string[]
    }>,
    duplicates: Array<{
      rowNumber: number,
      data: Record<string, any>,
      matchingOpportunityId: string
    }>
  }
  ```
- **Status Codes**: 200 OK

**POST /api/opportunities/import/undo/:importId**
- **Description**: Undo import operation (delete all created records)
- **Response**: Success confirmation
- **Status Codes**: 200 OK, 404 Not Found

#### Lookup Endpoints

**GET /api/users/lookup**
- **Description**: User lookup for "Assigned To" field
- **Query Parameters**: `page`, `limit`, `sortBy`, `sortOrder`, `search`
- **Response**: Paginated list of users with fields: id, name, username, jobTitle, department, email, phone

**GET /api/accounts/lookup**
- **Description**: Account lookup for "Account Name" field
- **Query Parameters**: Same as above
- **Response**: Paginated list of accounts

**GET /api/campaigns/lookup**
- **Description**: Campaign lookup for "Campaign" field
- **Query Parameters**: Same as above
- **Response**: Paginated list of campaigns

#### Relationship Endpoints

**GET /api/opportunities/:id/relationships/:relationshipType**
- **Description**: Get related records for an opportunity
- **Path Parameters**: 
  - `id`: Opportunity ID
  - `relationshipType`: "contacts" | "activities" | "documents" | "quotes" | etc.
- **Query Parameters**: `page`, `limit`, `sortBy`, `sortOrder`
- **Response**: Paginated list of related records

**POST /api/opportunities/:id/relationships/:relationshipType**
- **Description**: Link a related record to opportunity
- **Request Body**: Related record ID and metadata

**DELETE /api/opportunities/:id/relationships/:relationshipType/:relatedRecordId**
- **Description**: Unlink related record from opportunity

#### Analytics Endpoints

**GET /api/opportunities/analytics/pipeline-by-sales-stage**
- **Description**: Get pipeline data aggregated by sales stage
- **Query Parameters**: Filter parameters (same as list endpoint)
- **Response**:
  ```typescript
  {
    stages: Array<{
      stage: string,
      count: number,
      totalAmount: number,
      averageAmount: number
    }>,
    totalAmount: number,
    totalCount: number
  }
  ```

**GET /api/opportunities/:id/insights**
- **Description**: Get opportunity insights
- **Response**:
  ```typescript
  {
    daysAtCurrentStage: number,
    stageHistory: Array<{
      stage: string,
      enteredAt: string,
      exitedAt?: string
    }>
  }
  ```

**GET /api/opportunities/recently-viewed**
- **Description**: Get recently viewed opportunities for current user
- **Query Parameters**: `limit` (default: 10)
- **Response**: Array of recently viewed opportunities with view timestamps

---

## Data Models

### Database Schema

#### Opportunities Table

```sql
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount >= 0),
  currency VARCHAR(10),
  sales_stage VARCHAR(255) NOT NULL,
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  next_step VARCHAR(500),
  description TEXT,
  account_id UUID NOT NULL REFERENCES accounts(id),
  expected_close_date DATE NOT NULL,
  type VARCHAR(255),
  lead_source VARCHAR(255),
  campaign_id UUID REFERENCES campaigns(id),
  assigned_to_id UUID REFERENCES users(id),
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES users(id),
  modified_by UUID NOT NULL REFERENCES users(id),
  is_deleted BOOLEAN DEFAULT FALSE,
  
  CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES accounts(id),
  CONSTRAINT fk_assigned_user FOREIGN KEY (assigned_to_id) REFERENCES users(id),
  CONSTRAINT fk_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
  CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users(id),
  CONSTRAINT fk_modified_by FOREIGN KEY (modified_by) REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_opportunities_account_id ON opportunities(account_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_opportunities_assigned_to ON opportunities(assigned_to_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_opportunities_sales_stage ON opportunities(sales_stage) WHERE is_deleted = FALSE;
CREATE INDEX idx_opportunities_close_date ON opportunities(expected_close_date) WHERE is_deleted = FALSE;
CREATE INDEX idx_opportunities_date_created ON opportunities(date_created) WHERE is_deleted = FALSE;
CREATE INDEX idx_opportunities_name ON opportunities(name) WHERE is_deleted = FALSE;
CREATE INDEX idx_opportunities_composite_assigned_stage ON opportunities(assigned_to_id, sales_stage) WHERE is_deleted = FALSE;
```

#### OpportunityContact Table (Many-to-Many)

```sql
CREATE TABLE opportunity_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  role VARCHAR(100),
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(opportunity_id, contact_id),
  CONSTRAINT fk_opportunity FOREIGN KEY (opportunity_id) REFERENCES opportunities(id),
  CONSTRAINT fk_contact FOREIGN KEY (contact_id) REFERENCES contacts(id)
);

CREATE INDEX idx_opp_contact_opportunity ON opportunity_contacts(opportunity_id);
CREATE INDEX idx_opp_contact_contact ON opportunity_contacts(contact_id);
```

#### RecentlyViewedOpportunity Table

```sql
CREATE TABLE recently_viewed_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  view_count INTEGER DEFAULT 1,
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_opportunity FOREIGN KEY (opportunity_id) REFERENCES opportunities(id)
);

CREATE INDEX idx_recently_viewed_user_date ON recently_viewed_opportunities(user_id, viewed_at DESC);
CREATE INDEX idx_recently_viewed_opportunity ON recently_viewed_opportunities(opportunity_id);
```

#### ImportJob Table

```sql
CREATE TABLE import_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  file_format VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  import_behavior VARCHAR(50) NOT NULL,
  total_rows INTEGER NOT NULL,
  processed_rows INTEGER DEFAULT 0,
  created_count INTEGER DEFAULT 0,
  updated_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  duplicate_count INTEGER DEFAULT 0,
  settings JSONB,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  error_message TEXT,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_import_jobs_user ON import_jobs(user_id);
CREATE INDEX idx_import_jobs_status ON import_jobs(status);
```

### TypeScript Data Models

#### Opportunity Entity

```typescript
interface Opportunity {
  id: string;
  name: string;
  amount: number;
  currency?: string;
  salesStage: SalesStage;
  probability?: number; // 0-100
  nextStep?: string;
  description?: string;
  accountId: string;
  accountName?: string; // Populated via join
  expectedCloseDate: string; // ISO date
  type?: string;
  leadSource?: string;
  campaignId?: string;
  campaignName?: string; // Populated via join
  assignedToId?: string;
  assignedToName?: string; // Populated via join
  dateCreated: string; // ISO datetime
  dateModified: string; // ISO datetime
  createdBy: string;
  modifiedBy: string;
  daysAtCurrentStage?: number; // Calculated field
}

enum SalesStage {
  PROSPECTING = 'Prospecting',
  QUALIFICATION = 'Qualification',
  NEEDS_ANALYSIS = 'Needs Analysis',
  VALUE_PROPOSITION = 'Value Proposition',
  IDENTIFYING_DECISION_MAKERS = 'Identifying Decision Makers',
  PERCEPTION_ANALYSIS = 'Perception Analysis',
  PROPOSAL_PRICE_QUOTE = 'Proposal/Price Quote',
  NEGOTIATION_REVIEW = 'Negotiation/Review',
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost'
}
```

#### API Response Types

```typescript
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  links?: {
    first: string;
    last: string;
    next?: string;
    prev?: string;
  };
}

interface ImportResult {
  importId: string;
  totalRows: number;
  createdCount: number;
  updatedCount: number;
  errorCount: number;
  duplicateCount: number;
  status: 'completed' | 'failed' | 'processing';
}

interface PipelineAnalytics {
  stages: Array<{
    stage: string;
    count: number;
    totalAmount: number;
    averageAmount: number;
  }>;
  totalAmount: number;
  totalCount: number;
}
```

---

## Frontend Implementation Details

### Component Structure

#### OpportunitiesListPage

```typescript
// src/features/opportunities/pages/OpportunitiesListPage.tsx
interface OpportunitiesListPageProps {
  // Props if needed
}

const OpportunitiesListPage: React.FC<OpportunitiesListPageProps> = () => {
  // State management
  // Data fetching
  // Event handlers
  // Render
};
```

**Key Responsibilities**:
- Fetch opportunities list on mount
- Manage filter/sort/pagination state
- Handle bulk actions
- Coordinate table and chart display

**Dependencies**:
- `useOpportunities` hook
- `useOpportunityFilters` hook
- `OpportunitiesTable` component
- `QuickChartsPanel` component
- `FilterPanel` component

#### OpportunitiesTable Component

```typescript
interface OpportunitiesTableProps {
  opportunities: Opportunity[];
  loading: boolean;
  sortBy?: string;
  sortOrder: 'asc' | 'desc' | 'none';
  onSort: (column: string) => void;
  selectedIds: string[];
  onSelect: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onRowClick: (id: string) => void;
  visibleColumns: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}
```

**Features**:
- Sortable columns with visual indicators
- Row selection with checkboxes
- Pagination controls
- Responsive design (horizontal scroll on mobile, breakpoints: Mobile < 768px, Tablet 768px-1024px, Desktop > 1024px)
- Loading states
- Empty states

#### LookupModal Component

```typescript
interface LookupModalProps {
  entityType: 'users' | 'accounts' | 'campaigns';
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (record: any) => void;
  initialSearch?: string;
  columns: string[];
}
```

**Features**:
- Sortable table
- Pagination
- Search input field with Search button (user enters query and clicks Search to filter results)
- Row selection
- Responsive modal overlay (breakpoints: Mobile < 768px, Tablet 768px-1024px, Desktop > 1024px)

### State Management

#### Zustand Store

```typescript
// src/features/opportunities/store/opportunitiesStore.ts
interface OpportunitiesState {
  // List state
  opportunities: Opportunity[];
  loading: boolean;
  error: string | null;
  
  // Filter/Sort/Pagination
  filters: FilterCriteria;
  sortBy?: string;
  sortOrder: 'asc' | 'desc' | 'none';
  page: number;
  limit: number;
  total: number;
  
  // Selection
  selectedIds: string[];
  
  // Column preferences
  visibleColumns: string[];
  
  // Actions
  setOpportunities: (opportunities: Opportunity[]) => void;
  setFilters: (filters: FilterCriteria) => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc' | 'none') => void;
  setPage: (page: number) => void;
  toggleSelection: (id: string) => void;
  selectAll: (selected: boolean) => void;
  setVisibleColumns: (columns: string[]) => void;
  fetchOpportunities: () => Promise<void>;
  clearFilters: () => void;
}
```

### Custom Hooks

#### useOpportunities Hook

```typescript
const useOpportunities = () => {
  const store = useOpportunitiesStore();
  
  useEffect(() => {
    store.fetchOpportunities();
  }, [store.filters, store.sortBy, store.sortOrder, store.page]);
  
  return {
    opportunities: store.opportunities,
    loading: store.loading,
    error: store.error,
    // ... other state and actions
  };
};
```

#### useOpportunityFilters Hook

```typescript
const useOpportunityFilters = () => {
  const store = useOpportunitiesStore();
  
  const applyFilters = (filters: FilterCriteria) => {
    store.setFilters(filters);
    store.setPage(1); // Reset to first page
  };
  
  const clearFilters = () => {
    store.clearFilters();
  };
  
  return {
    filters: store.filters,
    applyFilters,
    clearFilters,
  };
};
```

### Service Layer

#### Opportunity Service

```typescript
// src/features/opportunities/services/opportunityService.ts
class OpportunityService {
  private apiClient: AxiosInstance;
  
  async getOpportunities(params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    filters?: FilterCriteria;
  }): Promise<PaginatedResponse<Opportunity>> {
    // API call implementation
  }
  
  async getOpportunity(id: string): Promise<Opportunity> {
    // API call implementation
  }
  
  async createOpportunity(data: CreateOpportunityDto): Promise<Opportunity> {
    // API call implementation
  }
  
  async updateOpportunity(id: string, data: UpdateOpportunityDto): Promise<Opportunity> {
    // API call implementation
  }
  
  async deleteOpportunity(id: string): Promise<void> {
    // API call implementation
  }
  
  // Bulk operations, import, etc.
}
```

---

## Backend Implementation Details

### Controller Layer

#### Opportunity Controller

```typescript
// src/opportunities/opportunities.controller.ts
@Controller('opportunities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}
  
  @Get()
  @Roles('admin', 'employee')
  async findAll(
    @Query() query: ListOpportunitiesQueryDto,
    @CurrentUser() user: User,
  ): Promise<PaginatedResponse<Opportunity>> {
    return this.opportunitiesService.findAll(query, user);
  }
  
  @Get(':id')
  @Roles('admin', 'employee')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Opportunity> {
    return this.opportunitiesService.findOne(id, user);
  }
  
  @Post()
  @Roles('admin', 'employee')
  async create(
    @Body() createDto: CreateOpportunityDto,
    @CurrentUser() user: User,
  ): Promise<Opportunity> {
    return this.opportunitiesService.create(createDto, user);
  }
  
  @Patch(':id')
  @Roles('admin', 'employee')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateOpportunityDto,
    @CurrentUser() user: User,
  ): Promise<Opportunity> {
    return this.opportunitiesService.update(id, updateDto, user);
  }
  
  @Delete(':id')
  @Roles('admin', 'employee')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.opportunitiesService.remove(id, user);
  }
}
```

### Service Layer

#### Opportunity Service

```typescript
// src/opportunities/opportunities.service.ts
@Injectable()
export class OpportunitiesService {
  constructor(
    @InjectRepository(Opportunity)
    private opportunityRepository: OpportunityRepository,
    private accountService: AccountService,
    private userService: UserService,
  ) {}
  
  async findAll(
    query: ListOpportunitiesQueryDto,
    user: User,
  ): Promise<PaginatedResponse<Opportunity>> {
    // Apply role-based filtering
    const filterBuilder = this.buildFilter(query.filters, user);
    
    // Apply sorting
    const orderBy = this.buildOrderBy(query.sortBy, query.sortOrder);
    
    // Execute paginated query
    const [opportunities, total] = await this.opportunityRepository
      .findAndCount({
        where: filterBuilder,
        order: orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        relations: ['account', 'assignedTo', 'campaign'],
      });
    
    return {
      data: opportunities,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }
  
  async create(dto: CreateOpportunityDto, user: User): Promise<Opportunity> {
    // Validate required fields
    this.validateCreateDto(dto);
    
    // Validate references
    await this.validateReferences(dto);
    
    // Create opportunity
    const opportunity = this.opportunityRepository.create({
      ...dto,
      createdBy: user.id,
      modifiedBy: user.id,
    });
    
    return this.opportunityRepository.save(opportunity);
  }
  
  private buildFilter(
    filters: FilterCriteria,
    user: User,
  ): FindOptionsWhere<Opportunity> {
    const where: FindOptionsWhere<Opportunity> = {
      isDeleted: false,
    };
    
    // Apply role-based filtering
    if (user.role === 'employee') {
      where.assignedToId = user.id;
    }
    
    // Apply user-specified filters
    if (filters.name) {
      where.name = Like(`%${filters.name}%`);
    }
    
    if (filters.salesStage) {
      where.salesStage = In(filters.salesStage);
    }
    
    // ... other filters
    
    return where;
  }
}
```

### Repository Layer

#### Opportunity Repository

```typescript
// src/opportunities/opportunities.repository.ts
@EntityRepository(Opportunity)
export class OpportunityRepository extends Repository<Opportunity> {
  async findWithRelations(
    id: string,
    relations: string[] = [],
  ): Promise<Opportunity | null> {
    return this.findOne({
      where: { id, isDeleted: false },
      relations,
    });
  }
  
  async findByAccount(accountId: string): Promise<Opportunity[]> {
    return this.find({
      where: { accountId, isDeleted: false },
    });
  }
  
  async calculateDaysAtCurrentStage(opportunityId: string): Promise<number> {
    // Query sales stage history and calculate days
    // Implementation depends on audit trail or stage history table
  }
}
```

---

## Integration Points

### External Module Dependencies

#### Account Module
- Validate account existence on opportunity create/update
- Fetch account details for display

#### User/Employee Module
- Validate assigned user existence
- Fetch user details for display
- Role-based access control

#### Contact Module
- Manage opportunity-contact relationships
- Fetch related contacts

#### Activity Module
- Link activities to opportunities
- Fetch activity timeline

#### Campaign Module
- Validate campaign existence
- Fetch campaign details

### API Integration Patterns

**Error Handling**:
```typescript
try {
  const response = await apiClient.get('/api/opportunities');
  return response.data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
    } else if (error.response?.status === 403) {
      // Handle forbidden - show permission error
    } else if (error.response?.status === 404) {
      // Handle not found
    } else {
      // Handle other errors
    }
  }
  throw error;
}
```

**Request Interceptors** (Axios):
```typescript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Security Considerations

### Authentication
- All endpoints require JWT authentication
- Token validated on every request
- Token expiration handled gracefully

### Authorization
- Role-based access control (Admin, Employee)
- Data filtering based on user role and permissions
- Permission checks on create, update, delete operations

### Input Validation
- Validate all input data on backend
- Sanitize user inputs to prevent injection attacks
- Use parameterized queries (TypeORM handles this)
- Validate file uploads (type, size, content)

### Data Protection
- Soft delete pattern (is_deleted flag)
- Audit trail for all changes
- Prevent unauthorized data access
- Encrypt sensitive data at rest (if applicable)

---

## Performance Considerations

### Frontend Optimization
- Lazy load components and routes
- Implement virtual scrolling for large tables
- Debounce search/filter inputs with 300ms delay
- Cache API responses (React Query or custom caching)
- Optimize re-renders with React.memo, useMemo, useCallback

### Backend Optimization
- Database indexes on frequently queried columns
- Pagination to limit result sets
- Query optimization (avoid N+1 queries, use joins efficiently)
- Caching for frequently accessed data (Redis)
- Batch operations for bulk actions

### Database Optimization
- Indexes on foreign keys and frequently filtered columns
- Composite indexes for common query patterns
- Query analysis and optimization
- Connection pooling

---

## Error Handling

### Frontend Error Handling
- Global error boundary for React components
- API error handling with user-friendly messages
- Form validation errors displayed inline when field loses focus (on blur event)
- Save button enabled only when all required fields are filled AND pass validation rules
- Network error detection and retry logic

### Backend Error Handling
- Global exception filter
- Standardized error response format
- Logging for debugging and monitoring
- Graceful degradation for partial failures

### Error Response Format
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}
```

---

## Testing Strategy

### Frontend Testing
- Unit tests for components, hooks, services
- Integration tests for user flows
- E2E tests for critical paths
- Snapshot tests for UI components

### Backend Testing
- Unit tests for services, repositories
- Integration tests for API endpoints
- Database transaction tests
- Load/performance tests

### Test Coverage Goals
- Minimum 80% code coverage
- 100% coverage for critical business logic
- All user stories covered by acceptance tests

---

## Deployment Considerations

### Environment Configuration
- Development, staging, production environments
- Environment-specific API endpoints
- Feature flags for gradual rollouts

### Database Migrations
- TypeORM migrations for schema changes
- Migration scripts for data transformations
- Rollback procedures

### Monitoring and Logging
- Application performance monitoring (APM)
- Error tracking and alerting
- Usage analytics
- Database query performance monitoring

---

## Success Criteria

### Performance Metrics
- Opportunities list page loads within 2 seconds
- API endpoints respond within 500ms (95th percentile)
- Import processes files up to 10MB in under 30 seconds
- Supports 1000+ concurrent users

### Quality Metrics
- 80%+ test coverage
- Zero critical security vulnerabilities
- WCAG AA accessibility compliance
- 99.9% uptime

---

## Clarifications

### Session 2025-12-13

- Q: When should inline form validation error messages appear for opportunity form fields? → A: On field blur (when user leaves field) - Validate when field loses focus

- Q: What should be the debounce delay (in milliseconds) for search/filter input fields in the opportunities list? → A: 300ms - Standard debounce delay, balances responsiveness and API efficiency

- Q: What are the specific responsive breakpoints (screen widths) for mobile, tablet, and desktop layouts? → A: Mobile: < 768px, Tablet: 768px-1024px, Desktop: > 1024px - Standard breakpoints

- Q: How should search functionality work in lookup modals (Assigned To, Account Name, Campaign)? → A: Search input field with Search button - Display search box, user clicks Search button to filter results

- Q: When should form validation check if a field is "filled" versus "valid" for enabling the Save button? → A: Check if filled AND valid - Save button enables only when all required fields are filled AND pass validation rules

- Q: How should users move columns between DISPLAYED and HIDDEN sections in the Choose Columns modal? → A: Drag-and-drop - Users drag column tags/badges between sections

- Q: What filter operators should be available for the Opportunity Amount and Expected Close Date filter fields? → A: Standard operators: Equals, Greater Than, Less Than, Between (for both amount and date)

- Q: What file format(s) should the bulk Export operation support? → A: CSV only - Simple, universal format

- Q: What should happen when a user clicks a relationship item (e.g., "CONTACTS: 3") in the Relationships section? → A: Navigate to related records list - Navigate to a full-page list view showing all related records (e.g., `/opportunities/:id/contacts`)

- Q: What should be the maximum number of opportunities that can be selected for bulk operations (Delete, Export, Merge, Mass Update)? → A: No limit - All opportunities matching current filter can be selected (system processes in batches with progress indicators for large selections)

---

## References

- Feature Specification: `specs/opportunity/feature-spec.md`
- Frontend Specification: `specs/opportunity/frontend-specs.md`
- Backend Specification: `specs/opportunity/backend-specs.md`
- Frontend Requirements: `requirements/opportunity/frontend-requirements.md`
- Backend Requirements: `requirements/opportunity/backend-requirements.md`

