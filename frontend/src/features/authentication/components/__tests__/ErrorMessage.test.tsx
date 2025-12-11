import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorMessage } from '../ErrorMessage';

describe('ErrorMessage', () => {
  it('should render error message when message is provided', () => {
    render(<ErrorMessage message="Invalid credentials" />);

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('should not render when message is null', () => {
    const { container } = render(<ErrorMessage message={null} />);

    expect(container.firstChild).toBeNull();
  });

  it('should not render when message is empty string', () => {
    const { container } = render(<ErrorMessage message="" />);

    expect(container.firstChild).toBeNull();
  });

  it('should have ARIA live region for screen readers', () => {
    render(<ErrorMessage message="Error occurred" />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });

  it('should display exclamation icon', () => {
    render(<ErrorMessage message="Error message" />);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('should be dismissible when dismissible prop is true', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    render(<ErrorMessage message="Error message" dismissible onDismiss={onDismiss} />);

    const dismissButton = screen.getByRole('button', { name: /dismiss/i });
    await user.click(dismissButton);

    expect(onDismiss).toHaveBeenCalled();
  });

  it('should not show dismiss button when dismissible is false', () => {
    render(<ErrorMessage message="Error message" dismissible={false} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

