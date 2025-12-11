import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/utils';
import { useAuthStore } from '@/store/authStore';

export const ClaimsTabs: React.FC = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const isAdmin = user?.role === 'Admin';
  const isManager = user?.role === 'Manager';
  const isEmployee = user?.role === 'Employee';

  const tabs = [
    {
      label: 'Employee Claims',
      path: '/claims',
      isLink: true,
      roles: ['Admin', 'Manager', 'HR Staff'],
    },
    {
      label: 'Assign Claim',
      path: '/claims/new',
      isLink: true,
      roles: ['Admin', 'Manager'],
    },
    {
      label: 'My Claims',
      path: '/claims/my-claims',
      isLink: true,
      roles: ['Employee', 'Admin', 'Manager'],
    },
    {
      label: 'Submit Claim',
      path: '/claims/submit',
      isLink: true,
      roles: ['Employee'],
    },
    {
      label: 'Configuration',
      path: '/claims/config',
      isLink: true,
      roles: ['Admin'],
    },
  ];

  // Filter tabs based on user role
  const visibleTabs = tabs.filter((tab) => {
    if (isAdmin) return true; // Admin can see all tabs
    if (isManager) return tab.roles.includes('Manager') || tab.roles.includes('Admin');
    if (isEmployee) return tab.roles.includes('Employee');
    return false;
  });

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8">
        {visibleTabs.map((tab) => {
          const isActive =
            location.pathname === tab.path ||
            (tab.path === '/claims' &&
              location.pathname.startsWith('/claims') &&
              !location.pathname.startsWith('/claims/new') &&
              !location.pathname.startsWith('/claims/my-claims') &&
              !location.pathname.startsWith('/claims/submit') &&
              !location.pathname.startsWith('/claims/config') &&
              !location.pathname.match(/^\/claims\/[^/]+$/)) ||
            (tab.path === '/claims/new' && location.pathname === '/claims/new') ||
            (tab.path === '/claims/my-claims' && location.pathname.startsWith('/claims/my-claims')) ||
            (tab.path === '/claims/submit' && location.pathname === '/claims/submit') ||
            (tab.path === '/claims/config' && location.pathname.startsWith('/claims/config'));

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                isActive
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

