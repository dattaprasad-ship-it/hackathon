import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LoginForm } from '../LoginForm';
import { useLogin } from '../../hooks/useLogin';

vi.mock('../../hooks/useLogin');
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

describe('LoginForm', () => {
  const mockHandleLogin = vi.fn();
  const mockUseLogin = {
    handleLogin: mockHandleLogin,
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLogin).mockReturnValue(mockUseLogin);
  });

  it('should render form with username and password fields', () => {
    renderWithRouter(<LoginForm />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should show validation error when username is empty', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginForm />);

    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    });
  });

  it('should show validation error when password is empty', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginForm />);

    const usernameInput = screen.getByLabelText(/username/i);
    await user.type(usernameInput, 'admin');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('should call handleLogin with credentials when form is valid', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginForm />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(usernameInput, 'admin');
    await user.type(passwordInput, 'admin123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith('admin', 'admin123');
    });
  });

  it('should submit form when Enter key is pressed in password field', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginForm />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(usernameInput, 'admin');
    await user.type(passwordInput, 'admin123{Enter}');

    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith('admin', 'admin123');
    });
  });

  it('should display error message from useLogin hook', () => {
    vi.mocked(useLogin).mockReturnValue({
      ...mockUseLogin,
      error: 'Invalid credentials',
    });

    renderWithRouter(<LoginForm />);

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('should disable form inputs and button when loading', () => {
    vi.mocked(useLogin).mockReturnValue({
      ...mockUseLogin,
      isLoading: true,
    });

    renderWithRouter(<LoginForm />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const button = screen.getByRole('button');

    expect(usernameInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('should clear error when user starts typing', async () => {
    const user = userEvent.setup();
    vi.mocked(useLogin).mockReturnValue({
      ...mockUseLogin,
      error: 'Invalid credentials',
    });

    renderWithRouter(<LoginForm />);

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();

    const usernameInput = screen.getByLabelText(/username/i);
    await user.type(usernameInput, 'a');

    await waitFor(() => {
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });
  });

  it('should render forgot password link', () => {
    renderWithRouter(<LoginForm />);

    expect(screen.getByRole('link', { name: /forgot your password/i })).toBeInTheDocument();
  });
});

