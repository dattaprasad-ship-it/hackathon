# Research & Technical Decisions: OrangeHRM PIM Module

**Date**: December 09, 2025  
**Feature**: OrangeHRM Personnel Information Management (PIM) Module

## Technology Stack Decisions

### Backend Framework: Next.js API Routes

**Decision**: Use Next.js 14+ with App Router API routes for backend services

**Rationale**:
- Next.js provides built-in API route handlers that eliminate need for separate Express server
- App Router offers better performance and developer experience
- TypeScript support is first-class
- File-based routing simplifies endpoint organization
- Server-side rendering capabilities available if needed
- Minimal dependencies required (Next.js handles routing, middleware, etc.)

**Alternatives Considered**:
- Express.js: Would require separate server setup and additional configuration
- FastAPI (Python): User specified Next.js/React stack
- NestJS: More complex than needed for this feature scope

### Frontend Framework: React with Next.js App Router

**Decision**: Use React 18+ with Next.js App Router for frontend

**Rationale**:
- React is the industry standard for modern web UIs
- Next.js App Router provides excellent developer experience with file-based routing
- Server Components reduce client-side JavaScript bundle size
- Built-in optimization (code splitting, image optimization)
- Seamless integration with API routes
- Strong TypeScript support

**Alternatives Considered**:
- Vue.js: Less ecosystem support for Next.js integration
- Angular: Heavier framework, not aligned with lightweight requirement
- Svelte: Smaller ecosystem, less Next.js integration

### Database: SQLite3

**Decision**: Use SQLite3 for local database storage

**Rationale**:
- User requirement: local database, no external server needed
- Zero configuration - database is a single file
- ACID compliant for data integrity
- Sufficient for expected scale (up to 1000 employees)
- No separate database server process required
- Easy backup (copy database file)
- Good performance for read-heavy workloads

**Alternatives Considered**:
- PostgreSQL: Requires separate server, overkill for local development
- MySQL: Requires separate server setup
- JSON files: No ACID guarantees, poor query performance

### Validation Library: Zod

**Decision**: Use Zod for runtime type validation

**Rationale**:
- TypeScript-first validation library
- Lightweight dependency (aligns with "avoid heavy imports")
- Excellent type inference
- Can generate TypeScript types from schemas
- Works well with React Hook Form
- Good error messages

**Alternatives Considered**:
- Yup: Heavier, less TypeScript-friendly
- Joi: Node.js focused, less React integration
- Manual validation: Too error-prone

### Form Management: React Hook Form

**Decision**: Use React Hook Form for form state management

**Rationale**:
- Minimal re-renders (performance)
- Lightweight library
- Excellent TypeScript support
- Easy integration with Zod for validation
- Good developer experience
- Small bundle size

**Alternatives Considered**:
- Formik: Heavier, more re-renders
- Redux Form: Overkill, adds Redux dependency
- Native React state: More boilerplate, error-prone

## Architecture Decisions

### API Design: RESTful with Next.js API Routes

**Decision**: Use RESTful API design with Next.js API route handlers

**Rationale**:
- Standard HTTP methods (GET, POST, PUT, DELETE) map naturally to CRUD operations
- Easy to understand and maintain
- Good tooling support (Postman, curl, etc.)
- Stateless design supports scalability
- Clear separation between frontend and backend

**Pattern**:
- `/api/employees` - GET (list), POST (create)
- `/api/employees/[id]` - GET (read), PUT (update), DELETE (soft delete)
- `/api/employees/search` - POST (complex search with filters)

### Database Schema: Normalized with Soft Delete

**Decision**: Use normalized database schema with soft delete pattern

**Rationale**:
- Normalization reduces data duplication
- Soft delete (is_deleted flag) supports audit trail and compliance (FR-070, FR-071)
- Allows data recovery if needed
- Maintains referential integrity

**Key Tables**:
- `employees` - Main employee records with `is_deleted` boolean flag
- `custom_fields` - Custom field definitions
- `employee_custom_values` - Custom field values for employees
- `reports` - Report definitions
- `report_criteria` - Report selection criteria
- `report_display_fields` - Report display field configurations
- `attachments` - Employee attachment metadata
- `termination_reasons` - Termination reason lookup
- `reporting_methods` - Reporting method lookup
- `pim_config` - System configuration settings

### File Storage: Local Filesystem

**Decision**: Store uploaded files (profile photos, attachments) in local filesystem

**Rationale**:
- User requirement: local database implies local storage preference
- Simple implementation - no external storage service needed
- SQLite3 database stores file paths/metadata
- Files stored in `backend/uploads/` directory
- Easy to backup (include uploads directory)

**Alternatives Considered**:
- Cloud storage (S3, Azure Blob): Requires external service, adds complexity
- Database BLOB storage: Would bloat SQLite database file
- Separate file server: Unnecessary for local development

### Concurrent Edit Handling: Last-Write-Wins with Warning

**Decision**: Implement last-write-wins strategy with warning notification (from clarifications)

**Rationale**:
- Simpler than optimistic locking or merge conflict resolution
- Common pattern in HR systems
- Warning notification provides user awareness (FR-067)
- Timestamp-based conflict detection

**Implementation**:
- Store `updated_at` timestamp on employee records
- On update, check if `updated_at` changed since page load
- If changed, show warning but allow save (last write wins)
- Display warning message to first user

### Permission Model: Role-Based (Simplified)

**Decision**: Implement simplified role-based access control

**Rationale**:
- Edge cases mention permission checks (FR-068, FR-069)
- For MVP: HR Admin (full access) vs Manager (read-only)
- Can be extended later with more granular permissions
- Dummy API can simulate permission checks

**Implementation**:
- User session stores role information
- API routes check permissions before operations
- Frontend hides/shows actions based on role
- Unauthorized access redirects with error (FR-068, FR-069)

## Performance Optimizations

### Pagination Strategy

**Decision**: Implement server-side pagination for employee list

**Rationale**:
- SC-003 requires loading 500 records in 3 seconds
- Pagination reduces initial load time
- Better user experience for large datasets
- Reduces memory usage

**Implementation**:
- Default page size: 50 records
- Load more / infinite scroll option
- Total count returned with paginated results

### Search Optimization

**Decision**: Use SQLite FTS (Full-Text Search) for name searches, indexed columns for filters

**Rationale**:
- SC-001 requires search results in 10 seconds
- SQLite FTS provides fast text search
- Indexes on frequently filtered columns (employment_status, job_title, sub_unit)
- Composite indexes for common filter combinations

### Caching Strategy

**Decision**: Cache configuration and lookup data (job titles, sub-units, etc.)

**Rationale**:
- Configuration data changes infrequently
- Reduces database queries
- Improves page load performance
- In-memory cache with TTL (5 minutes)

## Security Decisions

### Input Validation: Zod Schemas

**Decision**: Validate all inputs using Zod schemas on both client and server

**Rationale**:
- Prevents SQL injection (parameterized queries)
- Prevents XSS (sanitized inputs)
- Type safety with TypeScript
- Consistent validation across frontend and backend

### File Upload Security

**Decision**: Validate file types and sizes, store files outside web root

**Rationale**:
- FR-072, FR-073, FR-074, FR-075, FR-076 specify file validation requirements
- Whitelist approach (only allow specific types)
- Size limits prevent DoS attacks
- Files stored in `backend/uploads/` (not directly accessible via URL)
- Serve files through API endpoint with authentication

### SQL Injection Prevention

**Decision**: Use parameterized queries exclusively, never string concatenation

**Rationale**:
- SQLite3 supports parameterized queries
- Prevents SQL injection attacks
- Better performance (query plan caching)

## Testing Strategy

### Unit Tests: Jest + React Testing Library

**Decision**: Use Jest for unit tests, React Testing Library for component tests

**Rationale**:
- Jest is standard for React/Next.js projects
- React Testing Library encourages testing user behavior
- Good TypeScript support
- Fast execution

### E2E Tests: Playwright

**Decision**: Use Playwright for end-to-end testing

**Rationale**:
- User requirement: Playwright + Python + Pytest mentioned in user rules
- However, for Next.js/React stack, Playwright with TypeScript/JavaScript is more appropriate
- Excellent browser automation
- Supports multiple browsers
- Good debugging tools

**Note**: User rules mention Playwright + Python, but for Next.js/React stack, Playwright with TypeScript aligns better with the tech stack.

## Dummy API Integration

**Decision**: Create mock API endpoints for external integrations

**Rationale**:
- User requirement: "Call dummy api's wherever necessary"
- Allows development without external dependencies
- Can be replaced with real APIs later
- Examples: Authentication service, notification service, email service

**Implementation**:
- Create `/api/dummy/*` endpoints that return mock data
- Use setTimeout to simulate network latency
- Return realistic response structures
- Document which endpoints are dummy vs real

## Bundle Size Optimization

**Decision**: Code splitting, tree shaking, and selective imports

**Rationale**:
- User requirement: "Avoid unnecessary heavy imports"
- Next.js automatically code-splits by route
- Use dynamic imports for heavy components (report viewer, file upload)
- Import only needed functions from libraries
- Monitor bundle size with Next.js analyzer

## Database Migration Strategy

**Decision**: Use simple migration scripts with version tracking

**Rationale**:
- SQLite3 doesn't have built-in migrations
- Create `migrations/` directory with numbered SQL files
- Track applied migrations in `schema_migrations` table
- Run migrations on application startup

**Implementation**:
- `migrations/001_initial_schema.sql`
- `migrations/002_add_custom_fields.sql`
- Migration runner checks and applies pending migrations

