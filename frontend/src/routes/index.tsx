import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/features/authentication/components/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { PimPage } from '@/features/pim/pages/PimPage';
import { EmployeeListPage } from '@/features/pim/pages/EmployeeListPage';
import { AddEmployeePage } from '@/features/pim/pages/AddEmployeePage';
import { EditEmployeePage } from '@/features/pim/pages/EditEmployeePage';
import { ReportsPage } from '@/features/pim/pages/ReportsPage';
import { AddReportPage } from '@/features/pim/pages/AddReportPage';
import { ConfigurationPage } from '@/features/pim/pages/ConfigurationPage';
import { CustomFieldsPage } from '@/features/pim/pages/CustomFieldsPage';
import { DataImportPage } from '@/features/pim/pages/DataImportPage';
import { ReportingMethodsPage } from '@/features/pim/pages/ReportingMethodsPage';
import { TerminationReasonsPage } from '@/features/pim/pages/TerminationReasonsPage';
import { ClaimsPage } from '@/features/claims/pages/ClaimsPage';
import { CreateClaimPage } from '@/features/claims/pages/CreateClaimPage';
import { ClaimDetailPage } from '@/features/claims/pages/ClaimDetailPage';
import { MyClaimsPage } from '@/features/claims/pages/MyClaimsPage';
import { SubmitClaimPage } from '@/features/claims/pages/SubmitClaimPage';
import { ClaimsConfigPage } from '@/features/claims/pages/ClaimsConfigPage';
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
        path="/pim"
        element={
          <ProtectedRoute>
            <PimPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <Navigate to="/pim" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pim/employees/new"
        element={
          <ProtectedRoute>
            <AddEmployeePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pim/employees/:id/edit"
        element={
          <ProtectedRoute>
            <EditEmployeePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees/new"
        element={
          <ProtectedRoute>
            <Navigate to="/pim/employees/new" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pim/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pim/reports/new"
        element={
          <ProtectedRoute>
            <AddReportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pim/config"
        element={
          <ProtectedRoute>
            <ConfigurationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pim/config/custom-fields"
        element={
          <ProtectedRoute>
            <CustomFieldsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pim/config/data-import"
        element={
          <ProtectedRoute>
            <DataImportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pim/config/reporting-methods"
        element={
          <ProtectedRoute>
            <ReportingMethodsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pim/config/termination-reasons"
        element={
          <ProtectedRoute>
            <TerminationReasonsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/claims"
        element={
          <ProtectedRoute>
            <ClaimsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/claims/new"
        element={
          <ProtectedRoute>
            <CreateClaimPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/claims/:id"
        element={
          <ProtectedRoute>
            <ClaimDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/claims/my-claims"
        element={
          <ProtectedRoute>
            <MyClaimsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/claims/submit"
        element={
          <ProtectedRoute>
            <SubmitClaimPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/claims/config"
        element={
          <ProtectedRoute>
            <ClaimsConfigPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<LoginPage />} />
      <Route path="/" element={<RootRedirect />} />
    </Routes>
  );
};

