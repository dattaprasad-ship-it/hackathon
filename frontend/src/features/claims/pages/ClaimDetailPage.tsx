import * as React from 'react';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { ClaimDetailPage as ClaimDetailPageComponent } from '../components/ClaimDetailPage';

export const ClaimDetailPage: React.FC = () => {
  return (
    <DashboardLayout pageTitle="Claim Details">
      <ClaimDetailPageComponent />
    </DashboardLayout>
  );
};

