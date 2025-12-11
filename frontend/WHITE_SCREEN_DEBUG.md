# White Screen Debugging Guide

## Quick Checks

### 1. Open Browser Console (F12)
Look for:
- **Red error messages** - These indicate what's breaking
- **"Starting app render..."** - Confirms main.tsx is executing
- **"App rendered successfully"** - Confirms React rendered
- **Any import errors** - Missing modules or path issues

### 2. Check Network Tab
- Are all files loading? (main.tsx, App.tsx, etc.)
- Any 404 errors?
- Check if `mockServiceWorker.js` is trying to load (should be bypassed now)

### 3. Verify Files Exist
Check that these files exist:
- `frontend/src/main.tsx`
- `frontend/src/App.tsx`
- `frontend/src/routes/index.tsx`
- `frontend/src/components/ErrorBoundary.tsx`

## Common Issues & Fixes

### Issue 1: Import Path Errors
**Symptom**: Console shows "Cannot find module" or path errors

**Fix**: Verify path aliases are working:
```bash
# Check tsconfig.json has:
"paths": {
  "@/*": ["./src/*"]
}

# Check vite.config.ts has:
alias: {
  '@': path.resolve(__dirname, './src'),
}
```

### Issue 2: Missing Dependencies
**Symptom**: Console shows module not found errors

**Fix**: Reinstall dependencies:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue 3: Component Import Errors
**Symptom**: Console shows errors about specific components

**Fix**: Check if all imported components exist:
- `LoginPage` - `frontend/src/features/authentication/components/LoginPage.tsx`
- `DashboardPage` - `frontend/src/features/dashboard/components/DashboardPage.tsx`
- `EmployeeListPage` - `frontend/src/features/pim/pages/EmployeeListPage.tsx`
- `AddEmployeePage` - `frontend/src/features/pim/pages/AddEmployeePage.tsx`

### Issue 4: React Router Issues
**Symptom**: No errors but white screen

**Fix**: Try accessing `/login` directly:
```
http://localhost:5173/login
```

### Issue 5: Zustand Store Issues
**Symptom**: Errors related to `useAuthStore`

**Fix**: Verify store file exists:
- `frontend/src/store/authStore.ts`

## Step-by-Step Debugging

### Step 1: Check Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for the first red error
4. Note the error message and stack trace

### Step 2: Check if Basic HTML Renders
1. Right-click on the page
2. Select "View Page Source"
3. Check if `<div id="root"></div>` exists

### Step 3: Check Network Requests
1. Go to Network tab
2. Refresh the page
3. Check if `main.tsx` or other JS files are loading
4. Look for failed requests (red status codes)

### Step 4: Try Minimal App
If still not working, temporarily replace `App.tsx` content:

```typescript
export const App: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test App</h1>
      <p>If you see this, React is working!</p>
    </div>
  );
};
```

If this works, the issue is in one of the imported components.

## Still Not Working?

1. **Clear browser cache**: Ctrl+Shift+Delete
2. **Hard refresh**: Ctrl+Shift+R
3. **Try different browser**: Chrome, Firefox, Edge
4. **Check terminal**: Look for errors in the `npm run dev` output
5. **Restart dev server**: Stop (Ctrl+C) and restart `npm run dev`

## Share Debug Info

If still having issues, share:
1. **Console errors** (screenshot or copy text)
2. **Network tab** (screenshot of failed requests)
3. **Terminal output** from `npm run dev`
4. **Browser version** and OS

