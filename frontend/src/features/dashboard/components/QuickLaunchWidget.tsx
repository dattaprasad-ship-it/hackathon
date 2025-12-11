import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { WidgetContainer } from './WidgetContainer';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';

interface QuickAction {
  label: string;
  path: string;
  icon: string;
}

const quickActions: QuickAction[] = [
  { label: 'Assign Leave', path: '/leave/assign', icon: '📝' },
  { label: 'Apply Leave', path: '/leave/apply', icon: '📅' },
  { label: 'My Timesheets', path: '/time/timesheets', icon: '⏰' },
  { label: 'My Leave', path: '/leave/my-leave', icon: '🏖️' },
  { label: 'My Info', path: '/my-info', icon: '👤' },
  { label: 'Directory', path: '/directory', icon: '📇' },
];

export const QuickLaunchWidget: React.FC = () => {
  const navigate = useNavigate();

  return (
    <WidgetContainer title="Quick Launch">
      <div className="grid grid-cols-3 gap-3">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className={cn(
              'flex flex-col items-center justify-center h-20 gap-2',
              'hover:bg-blue-50 hover:border-blue-300 transition-colors'
            )}
            onClick={() => navigate(action.path)}
            aria-label={action.label}
          >
            <span className="text-2xl" aria-hidden="true">
              {action.icon}
            </span>
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        ))}
      </div>
    </WidgetContainer>
  );
};

