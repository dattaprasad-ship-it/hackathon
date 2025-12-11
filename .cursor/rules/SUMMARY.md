# .cursor Rules Summary

## Overview
This document summarizes all rules and conventions defined in the `.cursor/rules/` directory.

## Backend Rules (Node.js/NestJS/TypeScript) ✅

### Available Rules:

1. **auth-security.mdc** - Security rules for Lentra backend
   - JWT authentication with `JwtAuthGuard`
   - Authorization with `PermissionGuard`
   - Rate limiting with `ThrottlerGuard`
   - DTO validation requirements
   - Global exception filter usage

2. **controller.mdc** - REST API naming conventions
   - RESTful endpoint patterns
   - NestJS controller conventions
   - Query parameter handling with DTOs
   - Custom actions naming
   - Swagger documentation guidelines

3. **core-naming.mdc** - Core naming conventions (always applied)
   - English language only
   - camelCase for variables/functions
   - PascalCase for classes
   - Boolean naming (is/has/should/can)
   - Function naming patterns (A/HC/LC)
   - NestJS component naming

4. **entity.mdc** - Database entity conventions
   - Column naming (camelCase properties, snake_case DB columns)
   - TypeORM relationship naming
   - Index and constraint naming

5. **exception-handling.mdc** - Exception handling rules (always applied)
   - No try-catch in service files
   - Use `BusinessException` class
   - Let exceptions bubble to global filter

6. **gloabal.mdc** - Global coding guidelines (always applied)
   - Prefer Lodash utilities
   - Avoid N+1 queries
   - Avoid network calls in loops
   - Code comments guidelines
   - JSDoc requirements

7. **project-structure.mdc** - Project structure guide
   - Feature-based module structure
   - All code in `src/modules/`
   - Component structure (controller, service, repository, entity, DTO)
   - CQRS commands/queries structure

8. **repository.mdc** - TypeORM repository practices
   - Repository naming conventions
   - Avoid `save()` method (use `insert()`/`update()`)
   - Prefer built-in methods over queryBuilder

9. **snap-framework.mdc** - Snap framework utilities guide
   - Winston logging
   - Request context with ClsService
   - Custom validators (@IsPassword, @IsMobileNumber, @IsUsername)
   - Custom exceptions (SeedException/BusinessException)

10. **unit-testing.mdc** - Unit testing conventions
    - Use `jest-when` for mocking
    - What NOT to test (pass-through functions)
    - Focus on business logic testing

11. **specify-rules.mdc** - Development guidelines
    - Project structure (backend/, frontend/, tests/)
    - Technology stack references

## Frontend Rules (React.js/TypeScript) ✅

### Available Rules:

1. **frontend-structure.mdc** - Frontend project structure guide
   - Feature-based module structure in `src/features/`
   - Component organization (components, hooks, services, types, utils, pages)
   - Shared components and utilities location
   - New feature checklist

2. **react-components.mdc** - React component conventions
   - Component naming (PascalCase)
   - Component structure and organization
   - Props typing with TypeScript
   - Event handler naming
   - Conditional rendering patterns
   - Memoization guidelines

3. **react-hooks.mdc** - React hooks conventions
   - Custom hook naming (use prefix)
   - Standard hooks usage (useState, useEffect, useCallback, useMemo)
   - Custom hook patterns (data fetching, forms)
   - Rules of hooks compliance

4. **api-integration.mdc** - API integration and service layer
   - Service file naming conventions
   - API client setup and configuration
   - Service function naming (RESTful patterns)
   - Error handling in services
   - TypeScript types for requests/responses
   - Query parameter handling

5. **state-management.mdc** - State management patterns
   - When to use global vs local state
   - Redux Toolkit patterns (slices, async thunks)
   - Zustand patterns (alternative)
   - Custom hooks for state access
   - State organization rules

6. **frontend-testing.mdc** - Frontend testing conventions
   - React Testing Library usage
   - Component testing patterns
   - Hook testing patterns
   - Service testing patterns
   - Test organization (AAA pattern)
   - What NOT to test

7. **frontend-error-handling.mdc** - Error handling patterns (always applied)
   - Error Boundaries
   - API error handling
   - Custom error classes
   - Error display in components
   - Form error handling
   - Error handling in hooks

8. **frontend-styling.mdc** - Styling conventions
   - CSS Modules (preferred)
   - Class naming conventions (BEM-like)
   - Tailwind CSS patterns (if used)
   - Responsive design (mobile-first)
   - CSS variables for theming
   - Styled Components patterns (if used)

## Technology Stack Identified

### Backend:
- **Framework**: NestJS
- **Language**: TypeScript
- **ORM**: TypeORM
- **Testing**: Jest with jest-when
- **Validation**: class-validator
- **Logging**: Winston
- **Security**: JWT, Guards, Rate Limiting

### Frontend:
- **Framework**: React.js
- **Language**: TypeScript
- **Testing**: React Testing Library with Vitest/Jest
- **State Management**: Redux Toolkit or Zustand
- **Styling**: CSS Modules (preferred), Tailwind CSS, or Styled Components
- **API Client**: Axios (or similar)

