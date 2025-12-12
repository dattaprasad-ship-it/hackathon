import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/features/authentication/components/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { useAuth } from '@/features/authentication/hooks/useAuth';

const RootRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={<RootRedirect />}
      />
    </Routes>
  );
};

