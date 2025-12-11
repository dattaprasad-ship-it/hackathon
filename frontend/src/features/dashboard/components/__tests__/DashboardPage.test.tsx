import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DashboardPage } from '../DashboardPage';
import { useAuthStore } from '@/store/authStore';
import { useDashboard } from '../../hooks/useDashboard';

vi.mock('@/store/authStore');
vi.mock('../../hooks/useDashboard');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: '1',
        username: 'admin',
        role: 'Admin',
        displayName: 'Admin User',
      },
    });
  });

  it('should render dashboard layout', () => {
    vi.mocked(useDashboard).mockReturnValue({
      timeAtWork: { data: null, loading: false, error: null, refetch: vi.fn() },
      myActions: { data: null, loading: false, error: null, refetch: vi.fn() },
      employeesOnLeave: { data: null, loading: false, error: null, refetch: vi.fn() },
      employeeDistribution: { data: null, loading: false, error: null, refetch: vi.fn() },
      buzzPosts: { data: null, loading: false, error: null, refetch: vi.fn() },
      refetchAll: vi.fn(),
    });

    renderWithRouter(<DashboardPage />);
    expect(screen.getByLabelText(/main navigation/i)).toBeInTheDocument();
  });

  it('should render all widgets', () => {
    vi.mocked(useDashboard).mockReturnValue({
      timeAtWork: { data: null, loading: false, error: null, refetch: vi.fn() },
      myActions: { data: null, loading: false, error: null, refetch: vi.fn() },
      employeesOnLeave: { data: null, loading: false, error: null, refetch: vi.fn() },
      employeeDistribution: { data: null, loading: false, error: null, refetch: vi.fn() },
      buzzPosts: { data: null, loading: false, error: null, refetch: vi.fn() },
      refetchAll: vi.fn(),
    });

    renderWithRouter(<DashboardPage />);
    expect(screen.getByText(/time at work/i)).toBeInTheDocument();
    expect(screen.getByText(/my actions/i)).toBeInTheDocument();
    expect(screen.getByText(/quick launch/i)).toBeInTheDocument();
    expect(screen.getByText(/buzz latest posts/i)).toBeInTheDocument();
    expect(screen.getByText(/employees on leave today/i)).toBeInTheDocument();
    expect(screen.getByText(/employee distribution/i)).toBeInTheDocument();
  });

  it('should fetch widget data on mount', () => {
    const refetchAll = vi.fn();
    vi.mocked(useDashboard).mockReturnValue({
      timeAtWork: { data: null, loading: true, error: null, refetch: vi.fn() },
      myActions: { data: null, loading: true, error: null, refetch: vi.fn() },
      employeesOnLeave: { data: null, loading: true, error: null, refetch: vi.fn() },
      employeeDistribution: { data: null, loading: true, error: null, refetch: vi.fn() },
      buzzPosts: { data: null, loading: true, error: null, refetch: vi.fn() },
      refetchAll,
    });

    renderWithRouter(<DashboardPage />);
    expect(useDashboard).toHaveBeenCalled();
  });
});

