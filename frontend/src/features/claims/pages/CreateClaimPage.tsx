import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { CreateClaimForm } from '../components/CreateClaimForm';
import { ClaimsTabs } from '../components/ClaimsTabs';

export const CreateClaimPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Navigation is handled by useCreateClaim hook
  };

  const handleCancel = () => {
    navigate('/claims');
  };

  return (
    <DashboardLayout pageTitle="Assign Claim">
      <div className="space-y-6">
        <ClaimsTabs />
        <CreateClaimForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </DashboardLayout>
  );
};

