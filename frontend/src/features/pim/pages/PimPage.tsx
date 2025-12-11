import * as React from 'react';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { EmployeeList } from '../components/EmployeeList';
import { PimTabs } from '../components/PimTabs';

export const PimPage: React.FC = () => {
  return (
    <DashboardLayout pageTitle="PIM">
      <div className="space-y-6">
        <PimTabs />
        <EmployeeList />
      </div>
    </DashboardLayout>
  );
};

