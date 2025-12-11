import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { claimsService } from '../services/claimsService';
import type { CreateClaimRequest, Claim } from '../types/claims.types';

export const useCreateClaim = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClaim = useCallback(
    async (data: CreateClaimRequest) => {
      setLoading(true);
      setError(null);

      try {
        const claim = await claimsService.create(data);
        navigate(`/claims/${claim.id}`);
        return claim;
      } catch (err: any) {
        const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to create claim';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  return {
    createClaim,
    loading,
    error,
  };
};

