# Testing Guide: PIM Module Setup

This guide helps you verify that the PIM module setup is correct before proceeding with implementation.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Step 1: Verify Project Structure

### Backend Structure Test

```bash
cd backend
node test-structure.js
```

This will verify:
- Configuration files exist (tsconfig.json, next.config.js, package.json)
- Database modules are in place
- Migration files exist
- Utility files are created
- Middleware files exist

**Expected Output:**
```
✓ All backend structure checks passed!
```

### Frontend Structure Test

```bash
cd frontend
node test-setup.js
```

This will verify:
- TypeScript configuration
- Next.js configuration
- Directory structure
- Component files
- Type definitions
- API client

**Expected Output:**
```
✓ All frontend setup checks passed!
```

## Step 2: Install Dependencies

### Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- Next.js 14+
- React 18+
- SQLite3
- Zod (validation)
- bcryptjs (password hashing)
- Multer (file uploads)
- TypeScript and development tools

**Note:** You may see deprecation warnings. These are safe to ignore for now.

### Frontend Dependencies

```bash
cd frontend
npm install
```

This installs:
- Next.js 14+
- React 18+
- React Hook Form
- Zod
- Testing libraries (Jest, React Testing Library, Playwright)

## Step 3: Test Database Connection

After installing dependencies, test the database setup:

```bash
cd backend
node test-setup.js
```

This will:
1. Create the data directory if it doesn't exist
2. Test database connection
3. Test database queries
4. Verify migration system

**Expected Output:**
```
✓ All setup tests passed!
```

## Step 4: Initialize Database

Initialize the database schema and seed data:

```bash
cd backend
npm run db:init
```

This will:
- Create all database tables
- Insert seed data (job titles, employment statuses, sub-units, etc.)
- Create predefined reports
- Insert sample employees

**Expected Output:**
```
Initializing database...
Running migration: 001_initial_schema.sql
Migration 001_initial_schema.sql completed
Running migration: 002_seed_data.sql
Migration 002_seed_data.sql completed
Database initialization complete
```

## Step 5: Verify Database Schema

You can verify the database was created correctly:

```bash
cd backend
# On Windows PowerShell:
sqlite3 data/pim.db ".tables"

# Or using Node.js:
node -e "const sqlite3 = require('sqlite3'); const db = new sqlite3.Database('data/pim.db'); db.all('SELECT name FROM sqlite_master WHERE type=\"table\"', (err, rows) => { if (err) console.error(err); else console.log(rows); db.close(); });"
```

**Expected Tables:**
- employees
- custom_fields
- employee_custom_values
- reports
- report_selection_criteria
- report_display_fields
- attachments
- job_titles
- employment_statuses
- sub_units
- reporting_methods
- termination_reasons
- pim_config
- schema_migrations

## Step 6: Test Development Servers

### Backend Server

```bash
cd backend
npm run dev
```

The backend should start on `http://localhost:3001`

**Expected Output:**
```
- ready started server on 0.0.0.0:3001, url: http://localhost:3001
- info Loaded env from .env.local
```

Visit `http://localhost:3001` - you should see "PIM Backend API" page.

### Frontend Server

```bash
cd frontend
npm run dev
```

The frontend should start on `http://localhost:3000`

**Expected Output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

Visit `http://localhost:3000` - you should see "PIM Frontend" page.

## Step 7: Run Linting

Verify code quality:

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## Troubleshooting

### Issue: npm install fails with EPERM errors

**Solution:** Close any programs that might be using the node_modules directory (IDEs, file explorers) and try again. On Windows, you may need to run as administrator.

### Issue: Database connection fails

**Solution:** 
1. Ensure the `data/` directory exists in the backend folder
2. Check file permissions
3. Verify SQLite3 is installed: `npm list sqlite3`

### Issue: TypeScript errors

**Solution:**
1. Ensure all dependencies are installed
2. Run `npm install` again
3. Check that tsconfig.json is correct

### Issue: Next.js build fails

**Solution:**
1. Clear `.next` directory: `rm -rf .next` (or `Remove-Item -Recurse -Force .next` on PowerShell)
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Try building again: `npm run build`

## Next Steps

Once all tests pass:

1. ✅ Phase 1: Setup - Complete
2. ✅ Phase 2: Foundational - Complete
3. ➡️ Phase 3: User Story 1 - View and Search Employee List

You're ready to proceed with implementing User Story 1!

## Quick Test Checklist

- [ ] Backend structure test passes
- [ ] Frontend structure test passes
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Database connection test passes
- [ ] Database initialized successfully
- [ ] Backend server starts on port 3001
- [ ] Frontend server starts on port 3000
- [ ] No linting errors

All checks passing? You're ready to continue with implementation! 🎉

