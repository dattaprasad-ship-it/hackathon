import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import { useAuth } from '@/features/authentication/hooks/useAuth';

vi.mock('@/features/authentication/hooks/useAuth');

describe('ProtectedRoute', () => {
  it('should render children when user is authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: '1',
        username: 'admin',
        role: 'Admin',
      },
      isAuthenticated: true,
      logout: vi.fn(),
    });

    const { getByText } = render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(window.location.pathname).toBe('/login');
  });
});

