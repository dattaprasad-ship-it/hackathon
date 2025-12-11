# Quick Start Guide - HR Management System

## 🚀 Starting the Application

### Option 1: Quick Start (Recommended)

**Backend:**
```powershell
cd backend
npm install
npm run migration:run
npm run dev
```

**Frontend (in a new terminal):**
```powershell
cd frontend
npm install
npm run dev
```

### Option 2: Step-by-Step Setup

#### Step 1: Install Dependencies

**Backend:**
```powershell
cd backend
npm install
```

**Frontend:**
```powershell
cd frontend
npm install
```

#### Step 2: Configure Backend (Optional)

The backend uses SQLite by default. The database file will be created automatically at `backend/database/hr_management.db`.

**Optional:** Create `.env` file in `backend` directory to customize settings:
   ```env
   # Database Configuration (SQLite)
   DB_PATH=database/hr_management.db
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # JWT Configuration
   JWT_SECRET=dev-secret-key
   JWT_EXPIRATION=24h
   ```

#### Step 3: Run Database Migrations

```powershell
cd backend
npm run migration:run
```

This creates the SQLite database file and tables automatically.

#### Step 4: Start Backend

```powershell
cd backend
npm run dev
```

The backend should start on `http://localhost:3000`. The SQLite database will be created automatically in `backend/database/` if it doesn't exist.

#### Step 5: Start Frontend

```powershell
cd frontend
npm run dev
```

The frontend should start on `http://localhost:5173`

## ✅ Verify Everything is Running

1. **Backend Health Check:**
   ```powershell
   curl http://localhost:3000/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Frontend:**
   Open browser to `http://localhost:5173`

## 🔧 Troubleshooting

### "Backend API is not available" Error

This means the backend is not running. Common causes:

1. **Backend not started:**
   - Check if process is running: `Get-Process node`
   - Check backend terminal for error messages
   - Verify port 3000 is not in use: `Get-NetTCPConnection -LocalPort 3000`

2. **Database errors:**
   - Ensure `better-sqlite3` is installed: `npm list better-sqlite3`
   - Check if database directory exists: `Test-Path backend/database`
   - Verify database file permissions

3. **Migration not run:**
   - Run migrations: `cd backend && npm run migration:run`
   - Check migration files exist in `backend/migration/`

### Database Connection Errors

See `backend/SETUP.md` for detailed database setup instructions.

## 📝 Environment Variables

### Backend (.env in backend/ - optional)
- `DB_PATH` - SQLite database file path (default: `database/hr_management.db`)
- `PORT` - Backend server port (default: 3000)
- `NODE_ENV` - Environment mode (default: development)
- `JWT_SECRET` - JWT secret key (required for production)
- `JWT_EXPIRATION` - JWT expiration time (default: 24h)

### Frontend (.env in frontend/ - optional)
- `VITE_API_BASE_URL` - Backend API URL (default: uses proxy to http://localhost:3000/api)

## 💡 SQLite Notes

- The database file is stored locally in `backend/database/hr_management.db`
- No separate database server installation required
- Database file is created automatically on first run
- All database files (`*.db`, `*.db-wal`, `*.db-shm`) are ignored by git

