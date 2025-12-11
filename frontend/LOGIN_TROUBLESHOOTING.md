# Login Troubleshooting Guide

## Issue: "Invalid username or password" with correct credentials

### Quick Fixes

#### Option 1: Check if Backend is Running

If your backend server is running on `http://localhost:3001`, MSW (Mock Service Worker) might be interfering. 

**Solution A: Disable MSW temporarily**

1. Open `frontend/src/main.tsx`
2. Comment out MSW initialization:
```typescript
async function enableMocking() {
  // Temporarily disabled - using real backend
  return;
  // ... rest of code
}
```

3. Refresh the browser

**Solution B: Ensure backend has the user**

If using the real backend, make sure the user exists in the database:

```bash
# Check if user exists (you may need to create it first)
# The backend should have a user with username 'admin' and password 'admin123'
```

#### Option 2: Check Browser Console

1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for:
   - `[MSW]` messages - indicates MSW is intercepting
   - Network errors
   - CORS errors
   - Any red error messages

#### Option 3: Check Network Tab

1. Open Developer Tools (F12)
2. Go to Network tab
3. Try to login
4. Check the `/auth/login` request:
   - **Status**: Should be 200 for success, 401 for invalid credentials
   - **Request Payload**: Should show `{"username":"admin","password":"admin123"}`
   - **Response**: Check what the server returned

### Common Issues

#### Issue 1: MSW is intercepting but URL doesn't match

**Symptoms**: Console shows `[MSW] Unhandled request`

**Solution**: The MSW handler has been updated to handle both `/api/auth/login` and `http://localhost:3001/api/auth/login`. If you see unhandled requests, check the exact URL in the Network tab.

#### Issue 2: Backend is running but MSW is still intercepting

**Symptoms**: Requests go to MSW instead of backend

**Solution**: 
1. Disable MSW (see Option 1 above)
2. Or set `VITE_API_BASE_URL=http://localhost:3001/api` in `.env` file

#### Issue 3: User doesn't exist in backend database

**Symptoms**: Backend returns 401, but credentials are correct

**Solution**: Create the user in the database. You can:
1. Use the authentication module's user creation
2. Or manually insert into the database
3. Or use the seed script if available

#### Issue 4: Password hashing mismatch

**Symptoms**: Backend has user but login fails

**Solution**: The password in the database must be hashed with bcrypt. If you manually created the user, ensure the password is properly hashed.

### Debugging Steps

1. **Check what's being sent**:
   - Open Network tab
   - Find the login request
   - Check Request Payload

2. **Check what's being received**:
   - Check Response tab in Network
   - Look for error messages

3. **Check MSW logs**:
   - Look for `[MSW]` messages in console
   - These show if MSW is intercepting

4. **Check backend logs**:
   - Check the terminal where backend is running
   - Look for login attempt logs

### Testing with MSW (Mock)

If you want to test with MSW (no backend needed):

1. Ensure MSW is enabled in `main.tsx`
2. Use credentials:
   - Username: `admin`
   - Password: `admin123`
   - OR
   - Username: `employee`
   - Password: `employee123`

### Testing with Real Backend

If you want to test with the real backend:

1. Ensure backend is running on `http://localhost:3001`
2. Disable MSW (see Option 1)
3. Ensure user exists in database with correct password hash
4. Use the same credentials as in the database

### Still Not Working?

1. **Clear browser cache**: Ctrl+Shift+Delete
2. **Hard refresh**: Ctrl+Shift+R
3. **Check .env file**: Ensure `VITE_API_BASE_URL` is set correctly
4. **Restart dev server**: Stop and restart `npm run dev`
5. **Check backend health**: Visit `http://localhost:3001/health` in browser

