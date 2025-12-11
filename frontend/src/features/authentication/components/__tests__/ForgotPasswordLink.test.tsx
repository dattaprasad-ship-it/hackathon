import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { ForgotPasswordLink } from '../ForgotPasswordLink';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('ForgotPasswordLink', () => {
  it('should render link with text', () => {
    renderWithRouter(<ForgotPasswordLink />);

    expect(screen.getByRole('link', { name: /forgot your password/i })).toBeInTheDocument();
  });

  it('should navigate to forgot password page when clicked', async () => {
    userEvent.setup();
    renderWithRouter(<ForgotPasswordLink />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/forgot-password');
  });

  it('should have orange text color', () => {
    renderWithRouter(<ForgotPasswordLink />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('text-orange-500');
  });

  it('should have hover state', () => {
    renderWithRouter(<ForgotPasswordLink />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('hover:text-orange-600');
  });

  it('should be accessible with proper ARIA attributes', () => {
    renderWithRouter(<ForgotPasswordLink />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });
});

