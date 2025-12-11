import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeftSidebar } from '../LeftSidebar';
import { useDashboardStore } from '@/store/dashboardStore';
import { BrowserRouter } from 'react-router-dom';

vi.mock('@/store/dashboardStore');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/dashboard' }),
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LeftSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useDashboardStore.setState({
      sidebarCollapsed: false,
    });
  });

  it('should render logo', () => {
    renderWithRouter(<LeftSidebar />);
    const logo = screen.getByAltText(/logo/i);
    expect(logo).toBeInTheDocument();
  });

  it('should render search bar', () => {
    renderWithRouter(<LeftSidebar />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('should render navigation menu items', () => {
    renderWithRouter(<LeftSidebar />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
    expect(screen.getByText(/pim/i)).toBeInTheDocument();
    expect(screen.getByText(/leave/i)).toBeInTheDocument();
  });

  it('should toggle sidebar when collapse button is clicked', async () => {
    const user = userEvent.setup();
    const toggleSidebar = vi.fn();
    useDashboardStore.setState({ toggleSidebar });

    renderWithRouter(<LeftSidebar />);
    const collapseButton = screen.getByRole('button', { name: /collapse|expand/i });

    await user.click(collapseButton);
    expect(toggleSidebar).toHaveBeenCalledTimes(1);
  });

  it('should highlight active route', () => {
    renderWithRouter(<LeftSidebar />);
    const dashboardLink = screen.getByText(/dashboard/i).closest('a');
    expect(dashboardLink).toHaveClass(/active|bg-|text-/);
  });
});

