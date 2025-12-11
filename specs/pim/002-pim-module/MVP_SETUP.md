# PIM Module MVP - Setup and Testing Guide

## ✅ Completed Implementation

The MVP implementation for the PIM module is complete with the following features:

### Backend (Node.js + Express)
- ✅ Employee entities and relationships
- ✅ Employee repository with CRUD operations
- ✅ Employee service with business logic
- ✅ RESTful API endpoints (`/api/employees`)
- ✅ Database migration for PIM tables
- ✅ Seed data for lookup tables

### Frontend (React + Tailwind)
- ✅ Employee list page with search and filters
- ✅ Add employee page with form validation
- ✅ Employee service and hooks
- ✅ React Router integration

## 🚀 Setup Steps

### 1. Database Migration

The migration has already been run. If you need to run it again:

```bash
cd backend
npm run migration:run
```

### 2. Seed Initial Data

Seed data for job titles and sub units has been created. To re-seed:

```bash
cd backend
npm run seed:pim
```

This will create:
- 10 job titles (Software Engineer, HR Manager, etc.)
- 7 sub units (Engineering, HR, Finance, etc.)
- 3 employment statuses (Active, Inactive, Terminated) - already in migration
- 2 reporting methods (Direct, Indirect) - already in migration

### 3. Start Backend Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:3001` (or port specified in `.env`).

### 4. Start Frontend Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (or the port Vite assigns).

## 🧪 Testing the MVP

### Manual Testing via Frontend

1. **Login**: Use existing credentials (e.g., `admin` / `admin123`)
2. **Navigate to Employees**: Go to `/employees` route
3. **View Employee List**: You should see an empty list initially
4. **Add Employee**:
   - Click the "+ Add" button
   - Fill in the form:
     - Employee ID: `0445`
     - First Name: `John`
     - Last Name: `Doe`
     - (Optional) Create login details
   - Click "Save"
5. **Search Employees**: Use the search form to filter by name or ID
6. **View Employee Details**: Click on an employee row (edit functionality pending)

### API Testing with cURL or Postman

#### 1. Login to get authentication token

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Save the `token` from the response.

#### 2. List Employees

```bash
curl -X GET "http://localhost:3001/api/employees?page=1&limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 3. Search Employees

```bash
curl -X GET "http://localhost:3001/api/employees?employeeName=John&page=1&limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4. Create Employee

```bash
curl -X POST http://localhost:3001/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "0445",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### 5. Create Employee with Login Details

```bash
curl -X POST http://localhost:3001/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "0446",
    "firstName": "Jane",
    "lastName": "Smith",
    "createLoginDetails": true,
    "username": "jsmith",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "loginStatus": "Enabled"
  }'
```

#### 6. Get Employee by ID

```bash
curl -X GET "http://localhost:3001/api/employees/EMPLOYEE_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 7. Update Employee

```bash
curl -X PUT "http://localhost:3001/api/employees/EMPLOYEE_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name"
  }'
```

#### 8. Delete Employee

```bash
curl -X DELETE "http://localhost:3001/api/employees/EMPLOYEE_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📋 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/employees` | List employees with filters | Yes |
| GET | `/api/employees/:id` | Get employee by ID | Yes |
| POST | `/api/employees` | Create new employee | Yes |
| PUT | `/api/employees/:id` | Update employee | Yes |
| DELETE | `/api/employees/:id` | Delete employee (soft delete) | Yes |

### Query Parameters for GET /api/employees

- `employeeName` - Search by name
- `employeeId` - Search by employee ID
- `employmentStatusId` - Filter by employment status
- `jobTitleId` - Filter by job title
- `subUnitId` - Filter by sub unit
- `supervisorId` - Filter by supervisor
- `include` - `current` (default) or `all`
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50, max: 500)
- `sortBy` - Field to sort by (default: `createdAt`)
- `sortOrder` - `ASC` or `DESC` (default: `DESC`)

## 🐛 Troubleshooting

### Database Connection Issues

- Ensure the database file exists: `backend/database/hr_management.db`
- Check file permissions on the database directory
- Verify `better-sqlite3` is installed: `npm list better-sqlite3`

### Migration Issues

- If migration fails, check the migration file syntax
- Ensure all entities are properly imported in `database.ts`
- Check that the database file is not locked by another process

### API Authentication Issues

- Verify JWT token is included in Authorization header
- Check token expiration (default: 24 hours)
- Ensure user exists in the database

### Frontend Issues

- Check browser console for errors
- Verify API base URL in `.env` or `vite.config.ts`
- Ensure backend server is running on the expected port

## 📝 Next Steps

1. **Edit Employee Feature**: Implement edit employee page and functionality
2. **Delete Employee Feature**: Add delete confirmation modal
3. **Employee Detail Page**: Create detailed view for employee information
4. **Lookup Data Endpoints**: Create API endpoints to fetch job titles, sub units, etc. for dropdowns
5. **Profile Photo Upload**: Implement file upload functionality
6. **Additional User Stories**: Reports, Custom Fields, Data Import, etc.

## 📚 Related Documentation

- [Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Data Model](./data-model.md)
- [API Contracts](./contracts/api-contracts.md)

