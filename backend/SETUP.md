# Backend Setup Guide

## Prerequisites

1. **Node.js** - Version 18 or higher
2. **better-sqlite3** - Installed automatically via npm (no separate installation needed)

## Quick Start

### Step 1: Install Dependencies

```powershell
cd backend
npm install
```

The `better-sqlite3` package will be installed automatically, which provides the SQLite database driver.

### Step 2: Create .env File (Optional)

Create a `.env` file in the `backend` directory (optional - defaults will work):

```env
# Database Configuration (SQLite)
# Database file will be created automatically at this path
DB_PATH=database/hr_management.db

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=24h
```

**Note:** The `.env` file is optional. If not provided, the backend will use default values:
- Database: `database/hr_management.db` (created automatically)
- Port: `3000`

### Step 3: Run Database Migrations

```powershell
cd backend
npm run migration:run
```

This will create the database file and tables automatically.

### Step 4: Start Backend Server

```powershell
cd backend
npm run dev
```

The server should start on `http://localhost:3000`. The SQLite database file will be created automatically in the `database/` directory if it doesn't exist.

## Verify Installation

1. Check if backend is running:
   ```powershell
   curl http://localhost:3000/health
   ```

2. Verify database file was created:
   ```powershell
   Test-Path backend/database/hr_management.db
   ```

## Troubleshooting

### Database file creation errors
- Ensure the `backend/database/` directory exists and is writable
- Check file permissions on the database directory
- Verify `better-sqlite3` package is installed: `npm list better-sqlite3`

### Connection errors
- Check if the database file path is correct in `.env` (if set)
- Ensure the database directory exists
- Check console logs for detailed error messages

### Migration errors
- Ensure all dependencies are installed: `npm install`
- Check that the migration files are present in `migration/` directory
- Verify TypeORM configuration in `src/config/database.ts`

