import { useState, useEffect, useCallback } from 'react';
import { claimsConfigService } from '../services/claimsConfigService';
import type { ClaimsConfig } from '../types/claims-config.types';

export const useClaimsConfig = () => {
  const [config, setConfig] = useState<ClaimsConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await claimsConfigService.getConfig();
      setConfig(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to fetch configuration';
      setError(errorMessage);
      setConfig(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const refresh = useCallback(() => {
    fetchConfig();
  }, [fetchConfig]);

  return {
    config,
    loading,
    error,
    refresh,
  };
};

