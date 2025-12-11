import * as React from 'react';
import { dashboardService } from '../services/dashboardService';
import { useDashboardStore } from '@/store/dashboardStore';

export const useTimeAtWork = () => {
  const widgetState = useDashboardStore((state) => state.widgetStates.timeAtWork);
  const updateWidgetState = useDashboardStore((state) => state.updateWidgetState);

  const fetchData = React.useCallback(async () => {
    updateWidgetState('timeAtWork', { loading: true, error: null });

    try {
      const data = await dashboardService.getTimeAtWork();
      updateWidgetState('timeAtWork', { loading: false, data, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch time at work data';
      updateWidgetState('timeAtWork', { loading: false, error: errorMessage, data: null });
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

