import { http, HttpResponse } from 'msw';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Mock users database
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'Admin' as const,
    displayName: 'Administrator',
  },
  {
    id: '2',
    username: 'employee',
    password: 'employee123',
    role: 'Employee' as const,
    displayName: 'Employee User',
  },
];

export const handlers = [
  // Login endpoint - match both /api/auth/login and http://localhost:3001/api/auth/login
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    try {
      const body = await request.json() as { username: string; password: string };

      console.log('[MSW] Login request received:', { username: body.username, hasPassword: !!body.password });

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Trim whitespace from username and password
      const trimmedUsername = body.username?.trim();
      const trimmedPassword = body.password?.trim();

      // Find user by username (case-insensitive)
      const user = mockUsers.find((u) => u.username.toLowerCase() === trimmedUsername?.toLowerCase());

      console.log('[MSW] User lookup:', { 
        requestedUsername: trimmedUsername, 
        foundUser: !!user,
        userUsername: user?.username 
      });

      // Validate credentials
      if (!user || user.password !== trimmedPassword) {
        console.log('[MSW] Authentication failed:', { 
          userExists: !!user, 
          passwordMatch: user ? user.password === trimmedPassword : false 
        });
        return HttpResponse.json(
          {
            error: {
              code: 'INVALID_CREDENTIALS',
              message: 'Invalid username or password. Please check your credentials and try again.',
            },
          },
          { status: 401 }
        );
      }

      // Generate mock JWT token
      const token = `mock-jwt-token-${user.id}-${Date.now()}`;

      console.log('[MSW] Login successful:', { username: user.username, role: user.role });

      // Return success response
      return HttpResponse.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          displayName: user.displayName,
        },
      });
    } catch (error) {
      console.error('[MSW] Error processing login request:', error);
      return HttpResponse.json(
        {
          error: {
            code: 'SERVER_ERROR',
            message: 'An error occurred while processing your request.',
          },
        },
        { status: 500 }
      );
    }
  }),

  // Also handle requests to localhost backend (in case MSW is enabled but backend is running)
  http.post('http://localhost:3001/api/auth/login', async ({ request }) => {
    try {
      const body = await request.json() as { username: string; password: string };
      console.log('[MSW] Login request to localhost:3001 received:', { username: body.username });

      await new Promise((resolve) => setTimeout(resolve, 500));

      const trimmedUsername = body.username?.trim();
      const trimmedPassword = body.password?.trim();

      const user = mockUsers.find((u) => u.username.toLowerCase() === trimmedUsername?.toLowerCase());

      if (!user || user.password !== trimmedPassword) {
        return HttpResponse.json(
          {
            error: {
              code: 'INVALID_CREDENTIALS',
              message: 'Invalid username or password. Please check your credentials and try again.',
            },
          },
          { status: 401 }
        );
      }

      const token = `mock-jwt-token-${user.id}-${Date.now()}`;

      return HttpResponse.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          displayName: user.displayName,
        },
      });
    } catch (error) {
      console.error('[MSW] Error processing login request:', error);
      return HttpResponse.json(
        {
          error: {
            code: 'SERVER_ERROR',
            message: 'An error occurred while processing your request.',
          },
        },
        { status: 500 }
      );
    }
  }),

  // Catch-all for unhandled requests
  http.all('*', ({ request }) => {
    console.warn(`[MSW] Unhandled request: ${request.method} ${request.url}`);
    return HttpResponse.json(
      { error: { message: 'Not found' } },
      { status: 404 }
    );
  }),
];

