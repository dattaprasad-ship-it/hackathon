import * as React from 'react';
import { dashboardService } from '../services/dashboardService';
import { useDashboardStore } from '@/store/dashboardStore';

export const useEmployeesOnLeave = (date?: string) => {
  const widgetState = useDashboardStore((state) => state.widgetStates.employeesOnLeave);
  const updateWidgetState = useDashboardStore((state) => state.updateWidgetState);

  const fetchData = React.useCallback(async () => {
    updateWidgetState('employeesOnLeave', { loading: true, error: null });

    try {
      const data = await dashboardService.getEmployeesOnLeave(date);
      updateWidgetState('employeesOnLeave', { loading: false, data, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch employees on leave';
      updateWidgetState('employeesOnLeave', { loading: false, error: errorMessage, data: null });
    }
  }, [date, updateWidgetState]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data: widgetState.data,
    loading: widgetState.loading,
    error: widgetState.error,
    refetch: fetchData,
  };
};

