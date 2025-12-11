import * as React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/utils';

export interface ForgotPasswordLinkProps {
  className?: string;
}

export const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({ className }) => {
  return (
    <Link
      to="/forgot-password"
      className={cn(
        'text-sm text-orange-500 hover:text-orange-600 hover:underline',
        'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded',
        className
      )}
      aria-label="Navigate to forgot password page"
    >
      Forgot your password?
    </Link>
  );
};

