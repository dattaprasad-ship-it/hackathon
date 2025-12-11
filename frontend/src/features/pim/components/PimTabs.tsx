import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/utils';
import { ConfigurationDropdown } from './ConfigurationDropdown';

export const PimTabs: React.FC = () => {
  const location = useLocation();

  const tabs = [
    { label: 'Employee List', path: '/pim', isLink: true },
    { label: 'Reports', path: '/pim/reports', isLink: true },
    { label: 'Configuration', path: '/pim/config', isLink: false },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8">
        {tabs.map((tab) => {
          if (!tab.isLink) {
            return <ConfigurationDropdown key={tab.path} />;
          }

          const isActive =
            location.pathname === tab.path ||
            (tab.path === '/pim' &&
              location.pathname.startsWith('/pim') &&
              !location.pathname.startsWith('/pim/reports') &&
              !location.pathname.startsWith('/pim/config') &&
              !location.pathname.startsWith('/pim/employees')) ||
            (tab.path === '/pim/reports' && location.pathname.startsWith('/pim/reports'));

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                isActive
                  ? 'border-blue-500 text-blue-600'
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

