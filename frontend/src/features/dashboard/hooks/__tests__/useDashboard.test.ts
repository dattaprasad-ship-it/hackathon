import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDashboard } from '../useDashboard';

vi.mock('../../services/dashboardService');
vi.mock('../useTimeAtWork', () => ({
  useTimeAtWork: () => ({
    data: { punchedIn: true },
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));
vi.mock('../useMyActions', () => ({
  useMyActions: () => ({
    data: [],
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));
vi.mock('../useEmployeesOnLeave', () => ({
  useEmployeesOnLeave: () => ({
    data: [],
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));
vi.mock('../useEmployeeDistribution', () => ({
  useEmployeeDistribution: () => ({
    data: [],
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));
vi.mock('../useBuzzPosts', () => ({
  useBuzzPosts: () => ({
    data: [],
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

describe('useDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return aggregated widget states', () => {
    const { result } = renderHook(() => useDashboard());

    expect(result.current).toHaveProperty('timeAtWork');
    expect(result.current).toHaveProperty('myActions');
    expect(result.current).toHaveProperty('employeesOnLeave');
    expect(result.current).toHaveProperty('employeeDistribution');
    expect(result.current).toHaveProperty('buzzPosts');
    expect(result.current).toHaveProperty('refetchAll');
  });

  it('should provide refetchAll function', () => {
    const { result } = renderHook(() => useDashboard());

    expect(typeof result.current.refetchAll).toBe('function');
  });
});

