import * as React from 'react';
import { LeftSidebar } from './LeftSidebar';
import { TopHeader } from './TopHeader';
import { useDashboardStore } from '@/store/dashboardStore';
import { cn } from '@/utils/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  pageTitle = 'Dashboard',
}) => {
  const sidebarCollapsed = useDashboardStore((state) => state.sidebarCollapsed);

  React.useEffect(() => {
    useDashboardStore.getState().initialize();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <LeftSidebar />
      <div
        className={cn(
          'transition-all duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <TopHeader pageTitle={pageTitle} />
        <main className="p-6" role="main">
          {children}
        </main>
      </div>
    </div>
  );
};

