import * as React from 'react';
import { cn } from '@/utils/utils';

export interface ErrorMessageProps {
  message: string | null;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  dismissible = false,
  onDismiss,
}) => {
  if (!message) {
    return null;
  }

  const handleDismiss = () => {
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex items-center gap-2 p-3 rounded-md bg-red-50 border border-red-200 text-red-800',
        'text-sm'
      )}
    >
      <svg
        className="w-5 h-5 text-red-600 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span className="flex-1">{message}</span>
      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={handleDismiss}
          className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
          aria-label="Dismiss error"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

