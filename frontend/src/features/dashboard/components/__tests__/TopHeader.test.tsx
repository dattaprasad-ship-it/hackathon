import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TopHeader } from '../TopHeader';
import { useAuthStore } from '@/store/authStore';

vi.mock('@/store/authStore');

describe('TopHeader', () => {
  it('should render page title', () => {
    render(<TopHeader pageTitle="Dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render upgrade button', () => {
    render(<TopHeader pageTitle="Dashboard" />);
    const upgradeButton = screen.getByRole('button', { name: /upgrade/i });
    expect(upgradeButton).toBeInTheDocument();
  });

  it('should render user profile section', () => {
    useAuthStore.setState({
      user: {
        id: '1',
        username: 'admin',
        role: 'Admin',
        displayName: 'Admin User',
      },
    });

    render(<TopHeader pageTitle="Dashboard" />);
    expect(screen.getByText(/admin user/i)).toBeInTheDocument();
  });

  it('should open user profile menu when clicked', async () => {
    const user = userEvent.setup();
    useAuthStore.setState({
      user: {
        id: '1',
        username: 'admin',
        role: 'Admin',
        displayName: 'Admin User',
      },
    });

    render(<TopHeader pageTitle="Dashboard" />);
    const profileButton = screen.getByRole('button', { name: /admin user/i });

    await user.click(profileButton);

    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  it('should render help icon', () => {
    render(<TopHeader pageTitle="Dashboard" />);
    const helpButton = screen.getByRole('button', { name: /help/i });
    expect(helpButton).toBeInTheDocument();
  });
});

