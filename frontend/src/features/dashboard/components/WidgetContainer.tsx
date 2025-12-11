import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';

interface WidgetContainerProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyState?: React.ReactNode;
  className?: string;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  title,
  children,
  loading = false,
  error = null,
  onRetry,
  emptyState,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
        className
      )}
      role="region"
      aria-label={title}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>

      {loading && (
        <div className="flex items-center justify-center py-8" role="status" aria-label="Loading">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && !loading && (
        <div className="py-8 text-center" role="alert">
          <p className="text-sm text-red-600 mb-4">{error}</p>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              Retry
            </Button>
          )}
        </div>
      )}

      {!loading && !error && React.Children.count(children) === 0 && emptyState && (
        <div className="py-8 text-center text-gray-500" role="status" aria-live="polite">
          {emptyState}
        </div>
      )}

      {!loading && !error && React.Children.count(children) > 0 && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
};

