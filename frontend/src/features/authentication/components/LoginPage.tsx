import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from './LoginForm';
import { cn } from '@/utils/utils';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className={cn('flex min-h-screen bg-gray-50')}>
      <div className={cn('flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-white')}>
        <div className={cn('sm:mx-auto sm:w-full sm:max-w-md')}>
          <div className={cn('flex justify-center mb-8')}>
            <img
              src="/logo.svg"
              alt="Company Logo"
              className={cn('h-12 w-auto')}
            />
          </div>

          <h1 className={cn('text-3xl font-bold text-gray-900 text-center mb-8')}>Login</h1>

          <div className={cn('bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6')}>
            <p className={cn('text-sm font-medium text-gray-700 mb-2')}>Example Credentials</p>
            <div className={cn('text-sm text-gray-600 space-y-1')}>
              <p>
                <span className={cn('font-medium')}>Admin:</span> admin / admin123
              </p>
              <p>
                <span className={cn('font-medium')}>Employee:</span> employee / employee123
              </p>
            </div>
          </div>

          <LoginForm />

          <div className={cn('mt-8 text-center text-sm text-gray-600')}>
            <p>© {new Date().getFullYear()} HR Management System. All rights reserved.</p>
          </div>
        </div>
      </div>

      <div className={cn('hidden lg:block lg:w-1/2 bg-orange-500')} />

      <div className={cn('fixed bottom-4 left-4 flex gap-4')}>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className={cn('text-gray-600 hover:text-gray-800')}
          aria-label="Facebook"
        >
          <svg className={cn('w-6 h-6')} fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className={cn('text-gray-600 hover:text-gray-800')}
          aria-label="Twitter"
        >
          <svg className={cn('w-6 h-6')} fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className={cn('text-gray-600 hover:text-gray-800')}
          aria-label="LinkedIn"
        >
          <svg className={cn('w-6 h-6')} fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
      </div>
    </div>
  );
};

