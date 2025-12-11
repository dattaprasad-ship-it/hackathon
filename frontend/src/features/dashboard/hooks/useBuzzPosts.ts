import * as React from 'react';
import { dashboardService } from '../services/dashboardService';
import { useDashboardStore } from '@/store/dashboardStore';

export const useBuzzPosts = (limit?: number) => {
  const widgetState = useDashboardStore((state) => state.widgetStates.buzzPosts);
  const updateWidgetState = useDashboardStore((state) => state.updateWidgetState);

  const fetchData = React.useCallback(async () => {
    updateWidgetState('buzzPosts', { loading: true, error: null });

    try {
      const data = await dashboardService.getBuzzPosts(limit);
      updateWidgetState('buzzPosts', { loading: false, data, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch buzz posts';
      updateWidgetState('buzzPosts', { loading: false, error: errorMessage, data: null });
    }
  }, [limit, updateWidgetState]);

  React.useEffect(() => {
    if (!widgetState.data && !widgetState.loading) {
      fetchData();
    }
  }, [fetchData, widgetState.data, widgetState.loading]);

  return {
    data: widgetState.data,
    loading: widgetState.loading,
    error: widgetState.error,
    refetch: fetchData,
  };
};

