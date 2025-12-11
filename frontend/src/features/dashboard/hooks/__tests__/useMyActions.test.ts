import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMyActions } from '../useMyActions';
import { dashboardService } from '../../services/dashboardService';
import { useDashboardStore } from '@/store/dashboardStore';
import type { Action } from '../../types/dashboard.types';

vi.mock('../../services/dashboardService');
vi.mock('@/store/dashboardStore');

describe('useMyActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useDashboardStore.setState({
      widgetStates: {
        timeAtWork: { loading: false, error: null, data: null },
        myActions: { loading: false, error: null, data: null },
        employeesOnLeave: { loading: false, error: null, data: null },
        employeeDistribution: { loading: false, error: null, data: null },
        buzzPosts: { loading: false, error: null, data: null },
      },
    });
  });

  it('should fetch my actions data successfully', async () => {
    const mockData: Action[] = [
      {
        type: 'timesheet_approval',
        title: 'Timesheet to Approve',
        count: 1,
        icon: 'calendar',
        url: '/time/timesheets/approve',
      },
    ];

    vi.mocked(dashboardService.getMyActions).mockResolvedValue(mockData);

    const { result } = renderHook(() => useMyActions());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('should handle error when fetching fails', async () => {
    const errorMessage = 'Failed to fetch actions';
    vi.mocked(dashboardService.getMyActions).mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useMyActions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.data).toBeNull();
  });
});

