# How to Start Both Servers

## Quick Start

### Option 1: Manual Start (Recommended)

**Terminal 1 - Backend:**
```powershell
cd backend
$env:PORT=3001
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Option 2: Using PowerShell Script

Run the provided script:
```powershell
cd backend
.\start-servers.ps1
```

## Verify Servers Are Running

### Backend (Port 3001)
- Health check: http://localhost:3001/health
- Should return: `{"status":"ok","timestamp":"..."}`

### Frontend (Port 5173)
- Open browser: http://localhost:5173
- Should show the login page

## Troubleshooting

### Backend Not Starting

1. **Check database exists:**
   ```powershell
   Test-Path backend\database\hr_management.db
   ```

2. **Run migrations:**
   ```powershell
   cd backend
   npm run migration:run
   ```

3. **Check for errors in terminal:**
   - Look for TypeScript compilation errors
   - Check for missing dependencies
   - Verify database connection

### Frontend Not Starting

1. **Check dependencies:**
   ```powershell
   cd frontend
   npm install
   ```

2. **Check for port conflicts:**
   ```powershell
   Get-NetTCPConnection -LocalPort 5173
   ```

3. **Clear cache and restart:**
   ```powershell
   Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
   npm run dev
   ```

## Expected Output

### Backend Terminal:
```
Database connection established
SQLite database: C:\...\database\hr_management.db
Server is running on port 3001
```

### Frontend Terminal:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Port Configuration

- **Backend**: Port 3001 (configured in `backend/src/server.ts`)
- **Frontend**: Port 5173 (configured in `frontend/vite.config.ts`)
- **API Proxy**: Frontend proxies `/api/*` to `http://localhost:3001`

## Next Steps

Once both servers are running:
1. Open http://localhost:5173 in your browser
2. You should see the login page
3. Use credentials to login (check backend database for users)
4. Navigate to `/employees` to see the PIM module

