import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClaimsSearchForm } from './ClaimsSearchForm';
import { ClaimsTable } from './ClaimsTable';
import { useClaims } from '../hooks/useClaims';
import { useAuthStore } from '@/store/authStore';

export const EmployeeClaimsPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const {
    claims,
    loading,
    error,
    pagination,
    recordCount,
    filters,
    updateFilters,
    resetFilters,
    refresh,
    goToPage,
  } = useClaims({ page: 1, limit: 20 });

  const [sortBy, setSortBy] = React.useState<string>('createdAt');
  const [sortOrder, setSortOrder] = React.useState<'ASC' | 'DESC'>('DESC');

  const handleSearch = () => {
    updateFilters({ ...filters, page: 1 });
    refresh();
  };

  const handleReset = () => {
    resetFilters();
    setSortBy('createdAt');
    setSortOrder('DESC');
    refresh();
  };

  const handleSort = (field: string) => {
    const newSortOrder = sortBy === field && sortOrder === 'ASC' ? 'DESC' : 'ASC';
    setSortBy(field);
    setSortOrder(newSortOrder);
    updateFilters({ sortBy: field, sortOrder: newSortOrder });
    refresh();
  };

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  const canAssignClaim = user?.role === 'Admin' || user?.role === 'Manager';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employee Claims</h1>
        {canAssignClaim && (
          <Button onClick={() => navigate('/claims/new')} aria-label="Assign new claim">
            + Assign Claim
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <ClaimsSearchForm
        filters={filters}
        onFiltersChange={updateFilters}
        onReset={handleReset}
        onSearch={handleSearch}
        loading={loading}
      />

      <ClaimsTable
        claims={claims}
        loading={loading}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        pagination={pagination || undefined}
        recordCount={recordCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

