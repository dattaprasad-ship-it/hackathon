import * as React from 'react';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { EmployeeClaimsPage } from '../components/EmployeeClaimsPage';
import { ClaimsTabs } from '../components/ClaimsTabs';

export const ClaimsPage: React.FC = () => {
  return (
    <DashboardLayout pageTitle="Claims">
      <div className="space-y-6">
        <ClaimsTabs />
        <EmployeeClaimsPage />
      </div>
    </DashboardLayout>
  );
};

