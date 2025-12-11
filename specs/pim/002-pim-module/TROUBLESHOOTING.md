# Troubleshooting Guide - PIM Module

## White Screen Issue

If you're seeing a white screen when accessing `http://localhost:5173/`, try the following:

### 1. Check Browser Console

Open the browser's Developer Tools (F12) and check the Console tab for any JavaScript errors.

Common errors:
- **Module not found**: Missing dependencies - run `npm install` in the frontend directory
- **MSW errors**: Mock Service Worker issues - see MSW section below
- **Import errors**: Check that all imports are correct

### 2. MSW (Mock Service Worker) Issues

If MSW is causing issues, you can temporarily disable it:

**Option A: Disable MSW in main.tsx**
```typescript
// In frontend/src/main.tsx, comment out or modify enableMocking:
async function enableMocking() {
  // Temporarily disabled
  return;
  // ... rest of code
}
```

**Option B: Set environment variable**
```bash
# In frontend/.env
VITE_DISABLE_MSW=true
```

Then update `main.tsx`:
```typescript
async function enableMocking() {
  if (import.meta.env.MODE !== 'development' || import.meta.env.VITE_DISABLE_MSW === 'true') {
    return;
  }
  // ... rest of code
}
```

### 3. Verify Dependencies

Make sure all dependencies are installed:

```bash
cd frontend
npm install
```

### 4. Clear Browser Cache

1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### 5. Check Vite Dev Server

Ensure the Vite dev server is running without errors:

```bash
cd frontend
npm run dev
```

Look for any error messages in the terminal.

### 6. Verify Root Element

Check that `index.html` has the root element:

```html
<div id="root"></div>
```

### 7. Check React Router

If you're seeing a white screen on specific routes, check:
- Route paths are correct in `src/routes/index.tsx`
- Components are properly exported
- Protected routes are working correctly

### 8. Network Tab

Check the Network tab in Developer Tools:
- Are API requests failing?
- Are there 404 errors for assets?
- Are CORS errors present?

## Common Solutions

### Solution 1: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
# Then restart
cd frontend
npm run dev
```

### Solution 2: Reinstall Dependencies

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Solution 3: Check Port Conflicts

If port 5173 is already in use:

```bash
# Kill the process using the port (Windows PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process

# Or use a different port
cd frontend
npm run dev -- --port 3000
```

### Solution 4: Verify Environment Variables

Check that `.env` file exists and has correct values:

```bash
# frontend/.env
VITE_API_BASE_URL=http://localhost:3001/api
```

## Still Having Issues?

1. **Check the browser console** for specific error messages
2. **Check the terminal** where `npm run dev` is running
3. **Verify backend is running** on the correct port
4. **Check network requests** in the Network tab

If the issue persists, share:
- Browser console errors
- Terminal output from `npm run dev`
- Any error messages you see

