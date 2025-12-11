import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { Button } from '@/components/ui/button';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="text-gray-600 mb-4">
            Welcome, <span className="font-semibold">{user?.displayName || user?.username}</span>!
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Role: <span className="font-medium">{user?.role}</span>
          </p>
          <p className="text-gray-600 mb-6">
            You have successfully logged in. This is a protected route that requires authentication.
          </p>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full sm:w-auto"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

