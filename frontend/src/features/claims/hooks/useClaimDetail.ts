import { useState, useEffect, useCallback } from 'react';
import { claimsService } from '../services/claimsService';
import type { Claim } from '../types/claims.types';

export const useClaimDetail = (claimId: string | null) => {
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClaim = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await claimsService.getById(id);
      setClaim(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to fetch claim';
      setError(errorMessage);
      setClaim(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (claimId) {
      fetchClaim(claimId);
    } else {
      setClaim(null);
      setError(null);
      setLoading(false);
    }
  }, [claimId, fetchClaim]);

  const refresh = useCallback(() => {
    if (claimId) {
      fetchClaim(claimId);
    }
  }, [claimId, fetchClaim]);

  return {
    claim,
    loading,
    error,
    refresh,
  };
};

