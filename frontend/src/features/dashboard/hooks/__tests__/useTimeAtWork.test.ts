import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTimeAtWork } from '../useTimeAtWork';
import { dashboardService } from '../../services/dashboardService';
import { useDashboardStore } from '@/store/dashboardStore';
import type { TimeAtWorkData } from '../../types/dashboard.types';

vi.mock('../../services/dashboardService');
vi.mock('@/store/dashboardStore');

describe('useTimeAtWork', () => {
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

  it('should fetch time at work data successfully', async () => {
    const mockData: TimeAtWorkData = {
      punchedIn: true,
      punchInTime: '2025-01-12T11:50:00Z',
      timezone: 'GMT+1',
      todayHours: {
        hours: 0,
        minutes: 27,
        totalMinutes: 27,
      },
      weekData: [],
      weekRange: {
        start: '2025-01-08',
        end: '2025-01-14',
      },
    };

    vi.mocked(dashboardService.getTimeAtWork).mockResolvedValue(mockData);

    const { result } = renderHook(() => useTimeAtWork());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(dashboardService.getTimeAtWork).toHaveBeenCalledTimes(1);
  });

  it('should handle error when fetching fails', async () => {
    const errorMessage = 'Failed to fetch time at work data';
    vi.mocked(dashboardService.getTimeAtWork).mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useTimeAtWork());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.data).toBeNull();
  });

  it('should update store state when data is fetched', async () => {
    const mockData: TimeAtWorkData = {
      punchedIn: false,
      punchInTime: '',
      timezone: 'GMT+1',
      todayHours: {
        hours: 0,
        minutes: 0,
        totalMinutes: 0,
      },
      weekData: [],
      weekRange: {
        start: '2025-01-08',
        end: '2025-01-14',
      },
    };

    vi.mocked(dashboardService.getTimeAtWork).mockResolvedValue(mockData);

    renderHook(() => useTimeAtWork());

    await waitFor(() => {
      const state = useDashboardStore.getState();
      expect(state.widgetStates.timeAtWork.data).toEqual(mockData);
      expect(state.widgetStates.timeAtWork.loading).toBe(false);
      expect(state.widgetStates.timeAtWork.error).toBeNull();
    });
  });

  it('should update store state when error occurs', async () => {
    const errorMessage = 'Network error';
    vi.mocked(dashboardService.getTimeAtWork).mockRejectedValue(
      new Error(errorMessage)
    );

    renderHook(() => useTimeAtWork());

    await waitFor(() => {
      const state = useDashboardStore.getState();
      expect(state.widgetStates.timeAtWork.error).toBe(errorMessage);
      expect(state.widgetStates.timeAtWork.loading).toBe(false);
      expect(state.widgetStates.timeAtWork.data).toBeNull();
    });
  });
});

