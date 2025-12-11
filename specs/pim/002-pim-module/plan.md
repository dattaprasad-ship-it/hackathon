# Implementation Plan: OrangeHRM Personnel Information Management (PIM) Module

**Branch**: `002-pim-module` | **Date**: December 09, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-pim-module/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a comprehensive Personnel Information Management (PIM) module for OrangeHRM that enables HR administrators to manage employee records, including CRUD operations, search and filtering, custom reporting, configuration management, and bulk data import. The system will use Node.js + Express for backend services, React + Tailwind CSS for the frontend interface, and SQLite3 for local database storage. The database will be created locally in the backend directory. The implementation will prioritize lightweight dependencies and use dummy APIs where external integrations are needed.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 18+  
**Backend Dependencies**: Express 4.x, TypeORM, SQLite3, bcrypt, jsonwebtoken, express-validator, cors, helmet, dotenv  
**Frontend Dependencies**: React 18+, React Router, Tailwind CSS, React Hook Form, Zod (validation), Axios  
**Storage**: SQLite3 (local database file created in `backend/data/pim.db`)  
**Testing**: Jest, React Testing Library, Supertest (for API tests), Playwright (for E2E tests)  
**Target Platform**: Web browser (Chrome, Firefox, Safari, Edge - latest 2 versions)  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: 
- Employee list page loads up to 500 records within 3 seconds (SC-003)
- Search results returned within 10 seconds (SC-001)
- Report generation within 10 seconds for up to 1000 employees (SC-010)
- CSV import of 100 records completes within 30 seconds (SC-022)
**Constraints**: 
- Avoid unnecessary heavy imports (minimize bundle size)
- Local SQLite3 database created automatically in backend directory (no external database server required)
- Use dummy APIs for external integrations
- Support concurrent user operations with data integrity (SC-014)
**Scale/Scope**: 
- Support up to 1000 employees in system
- Up to 10 custom fields per organization
- Maximum 5MB per attachment file
- 100 records per CSV import file
- 10 user stories across 3 priority levels (P1, P2, P3)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Note**: Constitution file (`.specify/memory/constitution.md`) is a template and does not contain specific project principles. Proceeding with standard best practices:

- ✅ **Test-First Development**: All features will have tests written before implementation
- ✅ **Modular Architecture**: Clear separation between frontend (React + Tailwind) and backend (Node.js + Express)
- ✅ **Data Integrity**: Soft delete implementation ensures audit trail and compliance
- ✅ **Security**: File type validation, permission checks, input sanitization
- ✅ **Performance**: Optimized queries, pagination, efficient data loading

## Project Structure

### Documentation (this feature)

```text
specs/002-pim-module/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── config/
│   │   └── database.ts               # SQLite3 connection and initialization
│   ├── modules/
│   │   ├── employees/
│   │   │   ├── routes/
│   │   │   │   └── employees.routes.ts    # Express routes for employees
│   │   │   ├── controllers/
│   │   │   │   └── employees.controller.ts
│   │   │   ├── services/
│   │   │   │   └── employees.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── employees.repository.ts
│   │   │   ├── entities/
│   │   │   │   └── employee.entity.ts
│   │   │   ├── dto/
│   │   │   │   └── employees.dto.ts
│   │   │   └── validators/
│   │   │       └── employees.validator.ts
│   │   ├── reports/
│   │   │   ├── routes/
│   │   │   │   └── reports.routes.ts
│   │   │   ├── controllers/
│   │   │   │   └── reports.controller.ts
│   │   │   ├── services/
│   │   │   │   └── reports.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── reports.repository.ts
│   │   │   ├── entities/
│   │   │   │   └── report.entity.ts
│   │   │   └── dto/
│   │   │       └── reports.dto.ts
│   │   ├── config/
│   │   │   ├── routes/
│   │   │   │   └── config.routes.ts
│   │   │   ├── controllers/
│   │   │   │   └── config.controller.ts
│   │   │   └── services/
│   │   │       └── config.service.ts
│   │   ├── custom-fields/
│   │   │   ├── routes/
│   │   │   │   └── custom-fields.routes.ts
│   │   │   ├── controllers/
│   │   │   │   └── custom-fields.controller.ts
│   │   │   ├── services/
│   │   │   │   └── custom-fields.service.ts
│   │   │   └── entities/
│   │   │       └── custom-field.entity.ts
│   │   └── import/
│   │       ├── routes/
│   │       │   └── import.routes.ts
│   │       ├── controllers/
│   │       │   └── import.controller.ts
│   │       └── services/
│   │           └── import.service.ts
│   ├── common/
│   │   ├── middleware/
│   │   │   ├── error-handler.middleware.ts
│   │   │   ├── auth.middleware.ts
│   │   │   └── request-logger.middleware.ts
│   │   ├── exceptions/
│   │   │   └── business.exception.ts
│   │   └── base/
│   │       └── audit.entity.ts
│   ├── migrations/
│   │   ├── 001_initial_schema.ts     # TypeORM migration
│   │   └── 002_seed_data.ts
│   ├── app.ts                        # Express app setup
│   └── server.ts                      # Server entry point
├── data/
│   └── pim.db                         # SQLite database file (created locally)
└── tests/
    ├── api/
    │   └── employees.test.ts
    ├── services/
    │   └── employees.service.test.ts
    └── integration/
        └── employee-crud.test.ts

frontend/
├── src/
│   ├── features/
│   │   ├── employees/
│   │   │   ├── components/
│   │   │   │   ├── EmployeeList.tsx
│   │   │   │   ├── EmployeeForm.tsx
│   │   │   │   ├── EmployeeSearch.tsx
│   │   │   │   └── EmployeeTable.tsx
│   │   │   ├── pages/
│   │   │   │   ├── EmployeeListPage.tsx
│   │   │   │   ├── AddEmployeePage.tsx
│   │   │   │   ├── EditEmployeePage.tsx
│   │   │   │   └── EmployeeDetailPage.tsx
│   │   │   ├── services/
│   │   │   │   └── employees.service.ts
│   │   │   ├── hooks/
│   │   │   │   └── useEmployees.ts
│   │   │   └── types/
│   │   │       └── employees.types.ts
│   │   ├── reports/
│   │   │   ├── components/
│   │   │   │   ├── ReportList.tsx
│   │   │   │   ├── ReportForm.tsx
│   │   │   │   └── ReportViewer.tsx
│   │   │   ├── pages/
│   │   │   │   ├── ReportsListPage.tsx
│   │   │   │   ├── CreateReportPage.tsx
│   │   │   │   └── EditReportPage.tsx
│   │   │   └── services/
│   │   │       └── reports.service.ts
│   │   └── config/
│   │       ├── components/
│   │       │   ├── ConfigurationForm.tsx
│   │       │   └── CustomFieldsList.tsx
│   │       ├── pages/
│   │       │   ├── ConfigurationPage.tsx
│   │       │   ├── CustomFieldsPage.tsx
│   │       │   └── DataImportPage.tsx
│   │       └── services/
│   │           └── config.service.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Table.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Navigation.tsx
│   ├── routes/
│   │   └── index.tsx                  # React Router configuration
│   ├── utils/
│   │   ├── api.ts                     # Axios instance and interceptors
│   │   ├── validation.ts
│   │   └── formatting.ts
│   └── App.tsx                        # Root React component
├── public/
├── tailwind.config.js
├── postcss.config.js
└── tests/
    ├── components/
    │   └── EmployeeList.test.tsx
    ├── pages/
    │   └── EmployeeListPage.test.tsx
    └── e2e/
        └── employee-crud.spec.ts
```

**Structure Decision**: Web application structure with separate frontend and backend directories. Backend uses Node.js + Express with TypeORM for database operations and RESTful API endpoints. Frontend uses React with React Router for client-side routing and Tailwind CSS for styling. SQLite3 database is created locally in `backend/data/pim.db` directory and initialized automatically on first run. This structure supports the requirement for local database storage and allows for clear separation of concerns while maintaining a single repository.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations identified. The structure follows standard web application patterns with clear separation between frontend and backend, which is appropriate for the feature scope.
