import * as React from 'react';
import { useEmployeesOnLeave } from '../hooks/useEmployeesOnLeave';
import { WidgetContainer } from './WidgetContainer';

export const EmployeesOnLeaveWidget: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const { data, loading, error, refetch } = useEmployeesOnLeave(today);

  return (
    <WidgetContainer
      title="Employees on Leave Today"
      loading={loading}
      error={error}
      onRetry={refetch}
      emptyState={
        <div className="text-center py-8">
          <p className="text-gray-500">No employees on leave today</p>
        </div>
      }
    >
      {data && data.length > 0 && (
        <ul className="space-y-3" role="list">
          {data.map((employee) => (
            <li
              key={employee.id}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              {employee.profilePicture ? (
                <img
                  src={employee.profilePicture}
                  alt={employee.displayName || employee.name}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                  {(employee.displayName || employee.name || 'E').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {employee.displayName || employee.name}
                </p>
                <p className="text-xs text-gray-500">
                  {employee.department} • {employee.leaveType}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </WidgetContainer>
  );
};

