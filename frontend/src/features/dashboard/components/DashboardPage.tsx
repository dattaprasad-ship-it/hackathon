import * as React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { TimeAtWorkWidget } from './TimeAtWorkWidget';
import { MyActionsWidget } from './MyActionsWidget';
import { QuickLaunchWidget } from './QuickLaunchWidget';
import { BuzzPostsWidget } from './BuzzPostsWidget';
import { EmployeesOnLeaveWidget } from './EmployeesOnLeaveWidget';
import { EmployeeDistributionWidget } from './EmployeeDistributionWidget';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dashboard = useDashboard();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const hasErrors = [
    dashboard.timeAtWork.error,
    dashboard.myActions.error,
    dashboard.employeesOnLeave.error,
    dashboard.employeeDistribution.error,
    dashboard.buzzPosts.error,
  ].some((error) => error !== null);

  return (
    <DashboardLayout pageTitle="Dashboard">
      {hasErrors && (
        <div
          className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md"
          role="alert"
          aria-live="polite"
        >
          <p className="text-sm text-yellow-800">
            Some widgets failed to load. Please try refreshing the page or contact support if the issue persists.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="main" aria-label="Dashboard widgets">
        <div className="md:col-span-2">
          <TimeAtWorkWidget />
        </div>
        <div>
          <MyActionsWidget />
        </div>
        <div className="md:col-span-3">
          <QuickLaunchWidget />
        </div>
        <div className="md:col-span-2">
          <BuzzPostsWidget />
        </div>
        <div>
          <EmployeesOnLeaveWidget />
        </div>
        <div className="md:col-span-3">
          <EmployeeDistributionWidget />
        </div>
      </div>
    </DashboardLayout>
  );
};
