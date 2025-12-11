import * as React from 'react';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClaimsSearchForm } from '../components/ClaimsSearchForm';
import { ClaimsTable } from '../components/ClaimsTable';
import { ClaimsTabs } from '../components/ClaimsTabs';
import { useClaims } from '../hooks/useClaims';
import { useAuthStore } from '@/store/authStore';

export const MyClaimsPage: React.FC = () => {
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

  // Filter to show only current user's claims
  React.useEffect(() => {
    // Note: In a real implementation, this would filter by employeeId from user
    // For now, we'll rely on backend filtering if implemented
  }, []);

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

  return (
    <DashboardLayout pageTitle="My Claims">
      <div className="space-y-6">
        <ClaimsTabs />
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Claims</h1>
            <Button onClick={() => navigate('/claims/submit')} aria-label="Submit new claim">
              + Submit Claim
            </Button>
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
      </div>
    </DashboardLayout>
  );
};

