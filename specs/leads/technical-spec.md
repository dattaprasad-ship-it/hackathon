# Technical Specification - Leads Module

**Feature Branch**: `003-leads-technical`  
**Created**: 2025-01-XX  
**Status**: Draft  
**Input**: Technical implementation details for Leads module

---

## Architecture Overview

### System Architecture

The Leads module follows a **RESTful API architecture** with:
- **Frontend**: React-based SPA with component-based architecture
- **Backend**: REST API following JSON-API specification
- **Database**: Relational database with soft-delete pattern
- **Authentication**: OAuth 2.0 Bearer token authentication
- **Authorization**: Role-based access control (RBAC) with ACL

### Component Structure

#### Frontend Components
```
src/
├── modules/
│   └── leads/
│       ├── components/
│       │   ├── LeadsListPage.tsx
│       │   ├── LeadDetailPage.tsx
│       │   ├── LeadForm.tsx
│       │   ├── FilterPanel.tsx
│       │   ├── ColumnChooserModal.tsx
│       │   ├── InsightsPanel.tsx
│       │   └── ImportWizard/
│       ├── services/
│       │   ├── leadsService.ts
│       │   └── importService.ts
│       ├── hooks/
│       │   ├── useLeads.ts
│       │   └── useLeadFilters.ts
│       └── types/
│           └── lead.types.ts
```

#### Backend Structure
```
backend/
├── src/
│   ├── Modules/
│   │   └── Leads/
│   │       ├── Controller/
│   │       │   └── LeadsController.php
│   │       ├── Service/
│   │       │   ├── LeadsService.php
│   │       │   └── ImportService.php
│   │       ├── Repository/
│   │       │   └── LeadsRepository.php
│   │       ├── Entity/
│   │       │   └── Lead.php
│   │       └── DTO/
│   │           ├── CreateLeadDto.php
│   │           └── UpdateLeadDto.php
```

---

## API Contracts

### Base URL
- **API Root**: `/api/v8/`
- **Module Endpoint**: `/api/v8/module/Leads`

### Authentication
- **Method**: OAuth 2.0 Bearer Token
- **Header**: `Authorization: Bearer {access_token}`
- **Token Endpoint**: `/access_token` (POST)

### Request/Response Format
- **Format**: JSON-API 1.0 specification
- **Content-Type**: `application/vnd.api+json`
- **Character Encoding**: UTF-8

### Endpoints

#### List Leads
```
GET /api/v8/module/Leads
Query Parameters:
  - page[offset] (integer, default: 0)
  - page[limit] (integer, default: 20, max: 100)
  - filter (object, optional)
  - sort (string, optional, format: "field" or "-field")
  - fields (string, optional, comma-separated)

Response: 200 OK
{
  "data": [
    {
      "type": "Leads",
      "id": "uuid",
      "attributes": { ... },
      "relationships": { ... }
    }
  ],
  "meta": {
    "total": 206,
    "offset": 0,
    "limit": 20
  },
  "links": { ... }
}
```

#### Get Single Lead
```
GET /api/v8/module/Leads/{id}

Response: 200 OK
{
  "data": {
    "type": "Leads",
    "id": "uuid",
    "attributes": { ... },
    "relationships": { ... }
  }
}
```

#### Create Lead
```
POST /api/v8/module/Leads
Request Body:
{
  "data": {
    "type": "Leads",
    "attributes": {
      "firstName": "John",
      "lastName": "Doe",
      "status": "New",
      ...
    }
  }
}

Response: 201 Created
{
  "data": {
    "type": "Leads",
    "id": "uuid",
    "attributes": { ... }
  }
}
```

#### Update Lead
```
PATCH /api/v8/module/Leads
Request Body:
{
  "data": {
    "type": "Leads",
    "id": "uuid",
    "attributes": {
      "status": "In Process",
      ...
    }
  }
}

Response: 200 OK
{
  "data": {
    "type": "Leads",
    "id": "uuid",
    "attributes": { ... }
  }
}
```

#### Delete Lead
```
DELETE /api/v8/module/Leads/{id}

Response: 200 OK
{
  "meta": {
    "message": "Lead deleted successfully"
  }
}
```

#### Bulk Actions
```
POST /api/v8/module/Leads/bulk
Request Body:
{
  "action": "delete|export|merge|massUpdate|addToTargetList",
  "ids": ["uuid1", "uuid2", ...],
  "params": { ... }
}

Response: 200 OK
{
  "meta": {
    "successCount": 10,
    "failureCount": 2,
    "errors": [ ... ]
  }
}
```

#### Get Insights
```
GET /api/v8/module/Leads/insights
Query Parameters:
  - filter (object, optional)

Response: 200 OK
{
  "data": {
    "statusDistribution": [
      { "status": "New", "count": 50, "percentage": 24.3 },
      ...
    ],
    "quickStats": {
      "new": 50,
      "converted": 20,
      "dead": 10
    }
  }
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "errors": [
    {
      "status": "400",
      "code": "VALIDATION_ERROR",
      "title": "Validation Error",
      "detail": "Field 'lastName' is required",
      "source": {
        "pointer": "/data/attributes/lastName"
      }
    }
  ]
}
```

#### 401 Unauthorized
```json
{
  "errors": [
    {
      "status": "401",
      "code": "UNAUTHORIZED",
      "title": "Unauthorized",
      "detail": "Authentication token is missing or invalid"
    }
  ]
}
```

#### 403 Forbidden
```json
{
  "errors": [
    {
      "status": "403",
      "code": "FORBIDDEN",
      "title": "Forbidden",
      "detail": "You do not have permission to perform this action"
    }
  ]
}
```

#### 404 Not Found
```json
{
  "errors": [
    {
      "status": "404",
      "code": "NOT_FOUND",
      "title": "Not Found",
      "detail": "Lead with ID 'uuid' not found"
    }
  ]
}
```

#### 500 Internal Server Error
```json
{
  "errors": [
    {
      "status": "500",
      "code": "INTERNAL_ERROR",
      "title": "Internal Server Error",
      "detail": "An unexpected error occurred"
    }
  ]
}
```

---

## Data Models

### Lead Entity

```typescript
interface Lead {
  id: string; // GUID, char(36)
  salutation?: string; // Mr., Mrs., Ms., Dr., etc.
  firstName?: string;
  lastName: string; // REQUIRED
  accountName?: string;
  title?: string;
  department?: string;
  officePhone?: string;
  mobilePhone?: string;
  fax?: string;
  status: LeadStatus; // REQUIRED
  statusDescription?: string;
  opportunityAmount?: number;
  currencyId?: string; // FK to currencies
  campaignId?: string; // FK to campaigns
  leadSource?: string; // ENUM
  referredBy?: string;
  doNotCall: boolean; // Default: false
  assignedUserId?: string; // FK to users
  createdBy?: string; // FK to users
  modifiedUserId?: string; // FK to users
  dateEntered: Date;
  dateModified: Date;
  deleted: boolean; // Default: false
  description?: string;
  
  // Relationships
  emails: EmailAddress[];
  primaryAddress?: Address;
  altAddress?: Address;
  activities?: Activity[];
  documents?: Document[];
  contacts?: Contact[];
}

enum LeadStatus {
  NEW = "New",
  ASSIGNED = "Assigned",
  IN_PROCESS = "In Process",
  CONVERTED = "Converted",
  RECYCLED = "Recycled",
  DEAD = "Dead"
}
```

### Database Schema

#### `leads` Table
```sql
CREATE TABLE leads (
  id CHAR(36) PRIMARY KEY,
  salutation VARCHAR(10),
  first_name VARCHAR(255),
  last_name VARCHAR(255) NOT NULL,
  account_name VARCHAR(255),
  title VARCHAR(100),
  department VARCHAR(100),
  phone_work VARCHAR(50),
  phone_mobile VARCHAR(50),
  phone_fax VARCHAR(50),
  status VARCHAR(50) NOT NULL,
  status_description TEXT,
  opportunity_amount DECIMAL(18,2),
  currency_id CHAR(36),
  campaign_id CHAR(36),
  lead_source VARCHAR(50),
  referred_by VARCHAR(100),
  do_not_call TINYINT(1) DEFAULT 0,
  assigned_user_id CHAR(36),
  created_by CHAR(36),
  modified_user_id CHAR(36),
  date_entered DATETIME,
  date_modified DATETIME,
  deleted TINYINT(1) DEFAULT 0,
  description TEXT,
  
  INDEX idx_leads_status (status, deleted),
  INDEX idx_leads_assigned (assigned_user_id, deleted),
  INDEX idx_leads_name (last_name, first_name, deleted),
  FOREIGN KEY (assigned_user_id) REFERENCES users(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (modified_user_id) REFERENCES users(id),
  FOREIGN KEY (currency_id) REFERENCES currencies(id),
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);
```

### Relationships

#### Email Addresses (Many-to-Many)
- **Join Table**: `email_addr_bean_rel`
- **Fields**: `email_address_id`, `bean_id`, `bean_module`, `primary_address`
- **Relationship**: One lead can have multiple email addresses

#### Activities (One-to-Many)
- **Parent Field**: `parent_id`, `parent_type = 'Leads'`
- **Related Tables**: `calls`, `meetings`, `tasks`, `emails`, `notes`
- **Relationship**: One lead can have multiple activities

#### Documents (One-to-Many)
- **Parent Field**: `parent_id`, `parent_type = 'Leads'`
- **Related Table**: `documents`
- **Relationship**: One lead can have multiple documents

---

## Integration Points

### Frontend-Backend Integration

#### API Client Configuration
```typescript
// api/client.ts
const apiClient = axios.create({
  baseURL: '/api/v8',
  headers: {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
  }
});

// Add auth interceptor
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### Service Layer
```typescript
// services/leadsService.ts
export const leadsService = {
  getList: async (params: ListParams): Promise<LeadsResponse> => {
    const response = await apiClient.get('/module/Leads', { params });
    return response.data;
  },
  
  getById: async (id: string): Promise<Lead> => {
    const response = await apiClient.get(`/module/Leads/${id}`);
    return response.data.data;
  },
  
  create: async (lead: CreateLeadDto): Promise<Lead> => {
    const response = await apiClient.post('/module/Leads', {
      data: {
        type: 'Leads',
        attributes: lead
      }
    });
    return response.data.data;
  },
  
  update: async (id: string, updates: UpdateLeadDto): Promise<Lead> => {
    const response = await apiClient.patch('/module/Leads', {
      data: {
        type: 'Leads',
        id,
        attributes: updates
      }
    });
    return response.data.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/module/Leads/${id}`);
  },
  
  bulkAction: async (action: BulkAction, ids: string[], params?: any): Promise<BulkActionResult> => {
    const response = await apiClient.post('/module/Leads/bulk', {
      action,
      ids,
      params
    });
    return response.data;
  },
  
  getInsights: async (filters?: FilterCriteria): Promise<InsightsData> => {
    const response = await apiClient.get('/module/Leads/insights', {
      params: { filter: filters }
    });
    return response.data.data;
  }
};
```

### External Service Integrations

#### Email Service
- **Endpoint**: `/api/v8/module/Emails`
- **Purpose**: Send emails via Compose Modal
- **Integration**: Pre-fills recipient from lead email address

#### Activity Modules
- **Calls**: `/api/v8/module/Calls` - Create call with lead pre-selected
- **Meetings**: `/api/v8/module/Meetings` - Create meeting with lead pre-selected
- **Tasks**: `/api/v8/module/Tasks` - Create task with lead pre-selected
- **Emails**: `/api/v8/module/Emails` - Create email with lead pre-selected

#### Import Service
- **Endpoint**: `/api/v8/module/Import`
- **Purpose**: Handle file upload, mapping, and import processing
- **Integration**: 5-step wizard with duplicate checking

#### Global Search
- **Endpoint**: `/api/v8/search`
- **Purpose**: Unified search across all modules
- **Integration**: Includes Leads in search results

---

## Performance Requirements

### Response Time Targets
- **List View**: < 2 seconds (95th percentile)
- **Detail View**: < 1 second (95th percentile)
- **Create/Update**: < 500ms (95th percentile)
- **Delete**: < 300ms (95th percentile)
- **Bulk Actions**: < 5 seconds for 100 records (95th percentile)
- **Insights**: < 1 second (95th percentile)

### Scalability Targets
- **Concurrent Users**: Support 100+ concurrent users
- **Data Volume**: Handle 100,000+ lead records efficiently
- **Pagination**: Server-side pagination with max 100 records per page
- **Filtering**: Indexed fields for fast filter queries

### Optimization Strategies
- **Database Indexing**: Index on `status`, `assigned_user_id`, `last_name`, `deleted`
- **Query Optimization**: Use prepared statements, avoid N+1 queries
- **Caching**: Cache frequently accessed data (user preferences, filter configurations)
- **Lazy Loading**: Load relationships on-demand
- **Batch Operations**: Process bulk actions in batches

---

## Security Considerations

### Authentication
- **OAuth 2.0**: All endpoints require valid Bearer token
- **Token Validation**: Validate token on every request
- **Token Expiration**: Handle token expiration gracefully
- **Refresh Tokens**: Support token refresh mechanism

### Authorization
- **Role-Based Access Control**: Enforce role permissions (Sales User vs Sales Manager)
- **Record-Level Access**: Check ownership for edit/delete operations
- **Admin Override**: Admins bypass ownership checks
- **ACL Actions**: Validate `list`, `detail`, `edit`, `delete`, `export`, `import` permissions

### Data Protection
- **Input Validation**: Validate all input data
- **SQL Injection Prevention**: Use parameterized queries
- **XSS Prevention**: Sanitize user input
- **CSRF Protection**: Implement CSRF tokens for state-changing operations
- **Soft Delete**: Use soft delete pattern (don't physically delete records)

### Audit Trail
- **Change Tracking**: Track all field changes for audited fields
- **User Tracking**: Record `created_by` and `modified_user_id`
- **Timestamp Tracking**: Record `date_entered` and `date_modified`
- **Audit Table**: Store audit entries in `leads_audit` table

---

## Error Handling

### Error Categories

#### Client Errors (4xx)
- **400 Bad Request**: Validation errors, malformed requests
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Optimistic locking conflicts

#### Server Errors (5xx)
- **500 Internal Server Error**: Unexpected server errors
- **503 Service Unavailable**: Service temporarily unavailable

### Error Handling Strategy

#### Frontend
```typescript
// Error handling in service
try {
  const lead = await leadsService.getById(id);
  return lead;
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) {
      throw new NotFoundError('Lead not found');
    }
    if (error.response?.status === 403) {
      throw new ForbiddenError('Access denied');
    }
    throw new ApiError(error.response?.data?.message || 'Failed to fetch lead');
  }
  throw error;
}
```

#### Backend
```php
// Error handling in controller
try {
    $lead = $this->leadsService->getById($id);
    return $this->jsonResponse($lead);
} catch (NotFoundException $e) {
    return $this->errorResponse(404, 'NOT_FOUND', $e->getMessage());
} catch (ForbiddenException $e) {
    return $this->errorResponse(403, 'FORBIDDEN', $e->getMessage());
} catch (\Exception $e) {
    return $this->errorResponse(500, 'INTERNAL_ERROR', 'An unexpected error occurred');
}
```

### Error Logging
- **Log Level**: Log all errors with appropriate severity
- **Error Context**: Include request ID, user ID, timestamp, stack trace
- **Sensitive Data**: Do not log sensitive information (passwords, tokens)
- **Monitoring**: Integrate with error monitoring service (e.g., Sentry)

---

## Testing Strategy

### Unit Tests
- **Coverage Target**: 80%+ code coverage
- **Test Framework**: Jest (frontend), PHPUnit (backend)
- **Test Scope**: Services, repositories, utilities, validators

### Integration Tests
- **API Tests**: Test all endpoints with various scenarios
- **Database Tests**: Test database operations with test database
- **Authentication Tests**: Test OAuth token validation
- **Authorization Tests**: Test role-based access control

### End-to-End Tests
- **User Flows**: Test complete user workflows (create, edit, delete, import)
- **Browser Tests**: Test in multiple browsers (Chrome, Firefox, Safari)
- **Test Framework**: Cypress or Playwright

### Performance Tests
- **Load Testing**: Test with 100+ concurrent users
- **Stress Testing**: Test system limits
- **Response Time**: Verify response time targets

### Test Data
- **Fixtures**: Use test fixtures for consistent test data
- **Factories**: Use factories to generate test data
- **Cleanup**: Clean up test data after tests

---

## Deployment Considerations

### Environment Configuration
- **Development**: Local development environment
- **Staging**: Pre-production environment for testing
- **Production**: Live production environment

### Database Migrations
- **Migration Strategy**: Use database migrations for schema changes
- **Rollback Plan**: Support rollback for failed migrations
- **Data Migration**: Handle data migration for schema changes

### Deployment Process
1. **Code Review**: All changes require code review
2. **Automated Tests**: Run all tests before deployment
3. **Database Migration**: Run database migrations
4. **Deployment**: Deploy to staging first, then production
5. **Verification**: Verify deployment success
6. **Rollback**: Have rollback plan ready

### Monitoring
- **Application Monitoring**: Monitor application health and performance
- **Error Monitoring**: Monitor errors and exceptions
- **Performance Monitoring**: Monitor response times and throughput
- **Database Monitoring**: Monitor database performance

---

## Technical Dependencies

### Frontend Dependencies
- **React**: ^18.0.0
- **TypeScript**: ^5.0.0
- **Axios**: ^1.6.0
- **React Router**: ^6.0.0
- **Shadcn UI**: Latest
- **Tailwind CSS**: ^3.0.0

### Backend Dependencies
- **PHP**: ^8.1
- **Symfony**: ^6.0
- **Doctrine ORM**: ^2.0
- **OAuth2 Server**: League OAuth2 Server
- **JSON-API**: JSON-API serializer

### Database
- **MySQL**: ^8.0 or **PostgreSQL**: ^14.0
- **Connection Pooling**: Configured for optimal performance

---

## Future Enhancements

### Planned Features
- **Advanced Analytics**: More detailed insights and reporting
- **Lead Scoring**: Automated lead scoring based on criteria
- **Workflow Automation**: Automated workflows for lead management
- **Integration APIs**: Third-party integrations (Salesforce, HubSpot)
- **Mobile App**: Native mobile app for lead management

### Technical Improvements
- **GraphQL API**: Consider GraphQL for flexible data fetching
- **Real-time Updates**: WebSocket support for real-time updates
- **Advanced Search**: Full-text search with Elasticsearch
- **Caching Layer**: Redis caching for improved performance
- **Microservices**: Consider microservices architecture for scalability

---

*This technical specification provides implementation details for the Leads module. For user-facing requirements, refer to `specs/leads/feature-spec.md`. For detailed frontend and backend specifications, refer to `specs/leads/frontend-specs.md` and `specs/leads/backend-specs.md`.*

