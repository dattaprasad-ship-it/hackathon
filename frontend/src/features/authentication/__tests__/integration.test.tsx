import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '../components/LoginPage';
import { authService } from '../services/authService';
import { useAuthStore } from '@/store/authStore';

vi.mock('../services/authService');
vi.mock('@/store/authStore');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('Authentication Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('should complete full login flow successfully', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      token: 'jwt-token-123',
      user: {
        id: '1',
        username: 'admin',
        role: 'Admin' as const,
      },
    };

    vi.mocked(authService.login).mockResolvedValue(mockResponse);
    const mockLogin = vi.fn();
    vi.mocked(useAuthStore).mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
    } as any);

    renderWithRouter(<LoginPage />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.type(usernameInput, 'admin');
    await user.type(passwordInput, 'admin123');
    await user.click(loginButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        username: 'admin',
        password: 'admin123',
      });
    });
  });

  it('should handle invalid credentials', async () => {
    const user = userEvent.setup();
    const error = new Error('Invalid credentials');
    vi.mocked(authService.login).mockRejectedValue(error);
    vi.mocked(useAuthStore).mockReturnValue({
      login: vi.fn(),
      isAuthenticated: false,
    } as any);

    renderWithRouter(<LoginPage />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.type(usernameInput, 'admin');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('should validate form before submission', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginPage />);

    const loginButton = screen.getByRole('button', { name: /login/i });
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    expect(authService.login).not.toHaveBeenCalled();
  });
});

