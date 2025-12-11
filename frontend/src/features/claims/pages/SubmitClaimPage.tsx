import * as React from 'react';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { CreateClaimForm } from '../components/CreateClaimForm';
import { ClaimsTabs } from '../components/ClaimsTabs';

export const SubmitClaimPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Navigation is handled by useCreateClaim hook
  };

  const handleCancel = () => {
    navigate('/claims/my-claims');
  };

  return (
    <DashboardLayout pageTitle="Submit Claim">
      <div className="space-y-6">
        <ClaimsTabs />
        <CreateClaimForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </DashboardLayout>
  );
};

