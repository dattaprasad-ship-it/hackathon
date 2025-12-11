import * as React from 'react';
import { dashboardService } from '../services/dashboardService';
import { useDashboardStore } from '@/store/dashboardStore';

export const useMyActions = () => {
  const widgetState = useDashboardStore((state) => state.widgetStates.myActions);
  const updateWidgetState = useDashboardStore((state) => state.updateWidgetState);

  const fetchData = React.useCallback(async () => {
    updateWidgetState('myActions', { loading: true, error: null });

    try {
      const data = await dashboardService.getMyActions();
      updateWidgetState('myActions', { loading: false, data, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch my actions';
      updateWidgetState('myActions', { loading: false, error: errorMessage, data: null });
    }
  }, [updateWidgetState]);

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

