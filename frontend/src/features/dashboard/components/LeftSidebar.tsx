import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDashboardStore } from '@/store/dashboardStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';

interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Admin', path: '/admin' },
  { label: 'Leave', path: '/leave' },
  { label: 'Time', path: '/time' },
  { label: 'Recruitment', path: '/recruitment' },
  { label: 'My Info', path: '/my-info' },
  { label: 'Performance', path: '/performance' },
  { label: 'Directory', path: '/directory' },
  { label: 'Maintenance', path: '/maintenance' },
  { label: 'Claim', path: '/claim' },
  { label: 'Buzz', path: '/buzz' },
];

export const LeftSidebar: React.FC = () => {
  const location = useLocation();
  const sidebarCollapsed = useDashboardStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useDashboardStore((state) => state.toggleSidebar);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
      aria-label="Main navigation"
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <img
                src="/logo.svg"
                alt="Company Logo"
                className="h-8 w-auto"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="ml-auto"
            >
              {sidebarCollapsed ? '→' : '←'}
            </Button>
          </div>
        </div>

        {!sidebarCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <Input
              type="search"
              placeholder="Search..."
              className="w-full"
              aria-label="Search"
            />
          </div>
        )}

        <nav className="flex-1 overflow-y-auto p-2" aria-label="Navigation menu">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:text-gray-900'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

