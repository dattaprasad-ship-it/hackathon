import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CredentialInput } from '../CredentialInput';

describe('CredentialInput', () => {
  it('should render input with label', () => {
    render(
      <CredentialInput
        type="text"
        label="Username"
        placeholder="Enter username"
        value=""
        onChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
  });

  it('should display password input when type is password', () => {
    render(
      <CredentialInput
        type="password"
        label="Password"
        placeholder="Enter password"
        value=""
        onChange={vi.fn()}
      />
    );

    const input = screen.getByLabelText('Password') as HTMLInputElement;
    expect(input.type).toBe('password');
  });

  it('should call onChange when user types', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <CredentialInput
        type="text"
        label="Username"
        placeholder="Enter username"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText('Username');
    await user.type(input, 'admin');

    expect(handleChange).toHaveBeenCalled();
  });

  it('should display error message when error prop is provided', () => {
    render(
      <CredentialInput
        type="text"
        label="Username"
        placeholder="Enter username"
        value=""
        onChange={vi.fn()}
        error="Username is required"
      />
    );

    expect(screen.getByText('Username is required')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <CredentialInput
        type="text"
        label="Username"
        placeholder="Enter username"
        value=""
        onChange={vi.fn()}
        required
      />
    );

    const input = screen.getByLabelText('Username');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('should support autocomplete attribute', () => {
    render(
      <CredentialInput
        type="text"
        label="Username"
        placeholder="Enter username"
        value=""
        onChange={vi.fn()}
        autoComplete="username"
      />
    );

    const input = screen.getByLabelText('Username');
    expect(input).toHaveAttribute('autocomplete', 'username');
  });
});

