import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/utils';

interface ConfigMenuItem {
  label: string;
  path: string;
}

const configMenuItems: ConfigMenuItem[] = [
  { label: 'Optional Fields', path: '/pim/config' },
  { label: 'Custom Fields', path: '/pim/config/custom-fields' },
  { label: 'Data Import', path: '/pim/config/data-import' },
  { label: 'Reporting Methods', path: '/pim/config/reporting-methods' },
  { label: 'Termination Reasons', path: '/pim/config/termination-reasons' },
];

export const ConfigurationDropdown: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const isConfigActive = location.pathname.startsWith('/pim/config');
  const activeItem = configMenuItems.find((item) => location.pathname === item.path);

  React.useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-1',
          isConfigActive
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        )}
      >
        Configuration
        <svg
          className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              {configMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'block px-4 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

