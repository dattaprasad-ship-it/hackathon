import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';

export interface LoginButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  isLoading = false,
  disabled = false,
  onClick,
  children,
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <Button
      type="submit"
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        'w-full bg-orange-500 hover:bg-orange-600 text-white font-medium',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      )}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Logging in...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

