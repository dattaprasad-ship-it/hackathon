import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '../LoginPage';
import { useAuth } from '../../hooks/useAuth';

vi.mock('../../hooks/useAuth');
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

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login page with form', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    renderWithRouter(<LoginPage />);

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should redirect authenticated users to dashboard', () => {
    const mockNavigate = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: '1',
        username: 'admin',
        role: 'Admin',
      },
      isAuthenticated: true,
      logout: vi.fn(),
    });

    vi.mock('react-router-dom', () => ({
      ...vi.importActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    renderWithRouter(<LoginPage />);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should display logo', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    renderWithRouter(<LoginPage />);

    const logo = screen.getByAltText(/logo/i);
    expect(logo).toBeInTheDocument();
  });

  it('should display example credentials box', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    renderWithRouter(<LoginPage />);

    expect(screen.getByText(/example credentials/i)).toBeInTheDocument();
  });

  it('should display copyright information', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    renderWithRouter(<LoginPage />);

    expect(screen.getByText(/copyright/i)).toBeInTheDocument();
  });

  it('should be responsive', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    const { container } = renderWithRouter(<LoginPage />);

    const page = container.firstChild;
    expect(page).toHaveClass('flex');
  });
});

