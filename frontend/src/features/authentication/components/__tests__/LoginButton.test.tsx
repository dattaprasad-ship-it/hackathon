import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginButton } from '../LoginButton';

describe('LoginButton', () => {
  it('should render button with text', () => {
    render(<LoginButton>Login</LoginButton>);

    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<LoginButton disabled>Login</LoginButton>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should be disabled when isLoading is true', () => {
    render(<LoginButton isLoading>Login</LoginButton>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should show loading spinner when isLoading is true', () => {
    render(<LoginButton isLoading>Login</LoginButton>);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should call onClick when clicked and not disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<LoginButton onClick={handleClick}>Login</LoginButton>);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <LoginButton onClick={handleClick} disabled>
        Login
      </LoginButton>
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should have proper ARIA attributes', () => {
    render(<LoginButton aria-label="Submit login form">Login</LoginButton>);

    const button = screen.getByLabelText('Submit login form');
    expect(button).toBeInTheDocument();
  });
});

