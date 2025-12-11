import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyActions } from '../hooks/useMyActions';
import { WidgetContainer } from './WidgetContainer';
import { cn } from '@/utils/utils';

export const MyActionsWidget: React.FC = () => {
  const { data, loading, error, refetch } = useMyActions();
  const navigate = useNavigate();

  return (
    <WidgetContainer
      title="My Actions"
      loading={loading}
      error={error}
      onRetry={refetch}
      emptyState={<p>No pending actions</p>}
    >
      {data && data.length > 0 && (
        <ul className="space-y-2" role="list">
          {data.map((action, index) => (
            <li key={index}>
              <button
                onClick={() => navigate(action.url)}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-md border border-gray-200',
                  'hover:bg-gray-50 hover:border-blue-300 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                )}
                aria-label={`${action.title}: ${action.count} items`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden="true">
                      {action.icon === 'calendar' && '📅'}
                      {action.icon === 'person-heart' && '❤️'}
                      {action.icon === 'person-chat' && '💬'}
                      {!['calendar', 'person-heart', 'person-chat'].includes(action.icon) && '📋'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {action.title}
                    </span>
                  </div>
                  {action.count > 0 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {action.count}
                    </span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </WidgetContainer>
  );
};

