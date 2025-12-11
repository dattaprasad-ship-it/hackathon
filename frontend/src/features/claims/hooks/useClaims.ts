import { useState, useEffect, useCallback } from 'react';
import { claimsService } from '../services/claimsService';
import type { Claim, ClaimSearchFilters, ClaimListResponse } from '../types/claims.types';

export const useClaims = (initialFilters?: ClaimSearchFilters) => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);
  const [recordCount, setRecordCount] = useState<string>('(0) Records Found');
  const [filters, setFilters] = useState<ClaimSearchFilters>(initialFilters || { page: 1, limit: 20 });

  const fetchClaims = useCallback(async (currentFilters?: ClaimSearchFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await claimsService.search(currentFilters || filters);
      setClaims(response.claims);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
      setRecordCount(`(${response.total}) Records Found`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to fetch claims';
      setError(errorMessage);
      setClaims([]);
      setPagination(null);
      setRecordCount('(0) Records Found');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const updateFilters = useCallback((newFilters: Partial<ClaimSearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ page: 1, limit: 20 });
  }, []);

  const refresh = useCallback(() => {
    fetchClaims(filters);
  }, [fetchClaims, filters]);

  const goToPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return {
    claims,
    loading,
    error,
    pagination,
    recordCount,
    filters,
    updateFilters,
    resetFilters,
    refresh,
    fetchClaims,
    goToPage,
  };
};

