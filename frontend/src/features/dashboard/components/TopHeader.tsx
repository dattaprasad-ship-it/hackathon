import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

interface TopHeaderProps {
  pageTitle: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ pageTitle }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6"
      role="banner"
    >
      <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex"
          aria-label="Upgrade to premium"
        >
          Upgrade
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Help"
          className="hidden sm:flex"
        >
          ?
        </Button>

        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2"
            aria-label="User profile menu"
            aria-expanded={profileMenuOpen}
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.displayName || user.username}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                {(user?.displayName || user?.username || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <span className="hidden sm:inline text-sm font-medium text-gray-700">
              {user?.displayName || user?.username || 'User'}
            </span>
          </Button>

          {profileMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50"
              role="menu"
            >
              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  navigate('/profile');
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                role="menuitem"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                role="menuitem"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                role="menuitem"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

