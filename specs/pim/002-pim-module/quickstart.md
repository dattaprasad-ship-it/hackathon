# Quick Start Guide: OrangeHRM PIM Module

**Date**: December 09, 2025  
**Feature**: OrangeHRM Personnel Information Management (PIM) Module

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (for version control)

## Initial Setup

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Initialize Database

```bash
# From backend directory
npm run db:init

# This will:
# - Create SQLite database file at backend/database.db
# - Run all migrations
# - Seed initial data (lookup tables, predefined reports)
```

### 3. Start Development Servers

**Terminal 1 - Backend (Next.js API)**:
```bash
cd backend
npm run dev
# Server runs on http://localhost:3000
```

**Terminal 2 - Frontend (React)**:
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3001
```

### 4. Access Application

Open browser to: `http://localhost:3001`

## Database Setup

### Initial Schema

The database is automatically initialized with:

1. **Core Tables**:
   - `employees`
   - `custom_fields`
   - `employee_custom_values`
   - `reports`
   - `report_selection_criteria`
   - `report_display_fields`
   - `attachments`
   - `termination_reasons`
   - `reporting_methods`
   - `pim_config`

2. **Lookup Tables**:
   - `job_titles`
   - `employment_statuses`
   - `sub_units`

3. **Seed Data**:
   - Predefined employment statuses: Active, Inactive, Terminated
   - Predefined reports: 5 reports (Sub Unit Hierarchy, Contact Info, Job Details, etc.)
   - Predefined termination reasons: 8 reasons
   - Predefined reporting methods: Direct, Indirect

### Database Location

- **File**: `backend/database.db`
- **Backup**: Simply copy this file
- **Reset**: Delete file and run `npm run db:init` again

## Sample Data

### Create Test Employee

Use the API or UI to create a test employee:

```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "0001",
    "first_name": "John",
    "last_name": "Doe",
    "job_title_id": 1,
    "employment_status_id": 1,
    "sub_unit_id": 1
  }'
```

### Import Sample Data

1. Navigate to Configuration → Data Import
2. Download sample CSV template
3. Fill in employee data (max 100 records)
4. Upload CSV file

## Development Workflow

### Running Tests

```bash
# Backend unit tests
cd backend
npm test

# Frontend component tests
cd frontend
npm test

# E2E tests (Playwright)
npm run test:e2e
```

### Database Migrations

```bash
# Create new migration
npm run db:migrate:create <migration-name>

# Run pending migrations
npm run db:migrate

# Check migration status
npm run db:migrate:status
```

### Code Quality

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Format code
npm run format
```

## Project Structure Overview

```
backend/
├── src/app/api/          # Next.js API routes
├── src/lib/
│   ├── db/              # Database connection & migrations
│   ├── models/          # Data models & validation
│   ├── services/        # Business logic
│   └── utils/           # Utilities
└── tests/               # Backend tests

frontend/
├── src/app/             # Next.js pages (App Router)
├── src/components/      # React components
├── src/lib/
│   ├── api/            # API client functions
│   ├── hooks/          # Custom React hooks
│   └── utils/          # Utilities
└── tests/              # Frontend tests
```

## Key Features to Test

### 1. Employee Management

- **Create Employee**: Navigate to Employee List → Click "+Add"
- **Search Employees**: Use search filters on Employee List page
- **Edit Employee**: Click edit icon (pencil) in Actions column
- **Delete Employee**: Click delete icon (trash) → Confirm deletion

### 2. Custom Reports

- **Create Report**: Navigate to Reports → Click "+Add"
- **Execute Report**: Click view/execute icon (document) on a report
- **Edit Report**: Click edit icon (pencil) to modify report definition

### 3. Configuration

- **Custom Fields**: Configuration → Custom Fields → "+Add"
- **Optional Fields**: Configuration → Toggle deprecated/country-specific fields
- **Data Import**: Configuration → Data Import → Upload CSV

## API Testing

### Using curl

```bash
# List employees
curl http://localhost:3000/api/employees

# Get single employee
curl http://localhost:3000/api/employees/1

# Search employees
curl -X POST http://localhost:3000/api/employees/search \
  -H "Content-Type: application/json" \
  -d '{"employee_name": "John"}'
```

### Using Postman

Import the API contracts from `contracts/api-contracts.md` to create a Postman collection.

## Troubleshooting

### Database Issues

**Problem**: Database file not found
**Solution**: Run `npm run db:init` from backend directory

**Problem**: Migration errors
**Solution**: Delete `database.db` and re-run migrations

### Port Conflicts

**Problem**: Port 3000 or 3001 already in use
**Solution**: 
- Change port in `package.json` scripts
- Or kill process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <pid> /F
  ```

### Import Errors

**Problem**: CSV import fails
**Solution**: 
- Check file size (max 1MB)
- Verify column order matches sample CSV
- Ensure dates are in YYYY-MM-DD format
- Check record count (max 100 per file)

## Next Steps

1. **Review API Contracts**: See `contracts/api-contracts.md` for all available endpoints
2. **Review Data Model**: See `data-model.md` for database schema details
3. **Review Research**: See `research.md` for technical decisions
4. **Create Tasks**: Run `/speckit.tasks` to break down implementation tasks

## Environment Variables

Create `.env.local` files for environment-specific configuration:

**backend/.env.local**:
```env
DATABASE_PATH=./database.db
UPLOAD_DIR=./uploads
NODE_ENV=development
PORT=3000
```

**frontend/.env.local**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
PORT=3001
```

## Dummy APIs

The following dummy API endpoints are available for development:

- `POST /api/dummy/auth/login` - Mock authentication
- `POST /api/dummy/notifications` - Mock notification service
- `GET /api/dummy/user-permissions` - Mock permission check

These can be replaced with real implementations later.

