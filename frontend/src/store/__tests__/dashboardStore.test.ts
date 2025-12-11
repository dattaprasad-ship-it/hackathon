import { describe, it, expect, beforeEach } from 'vitest';
import { useDashboardStore } from '../dashboardStore';
import type {
  TimeAtWorkData,
  Action,
  EmployeeOnLeave,
  DistributionData,
  BuzzPost,
} from '@/features/dashboard/types/dashboard.types';

const SIDEBAR_STORAGE_KEY = 'dashboard-sidebar-collapsed';

describe('dashboardStore', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    useDashboardStore.setState({
      sidebarCollapsed: false,
      activeRoute: '/dashboard',
      widgetStates: {
        timeAtWork: { loading: false, error: null, data: null },
        myActions: { loading: false, error: null, data: null },
        employeesOnLeave: { loading: false, error: null, data: null },
        employeeDistribution: { loading: false, error: null, data: null },
        buzzPosts: { loading: false, error: null, data: null },
      },
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useDashboardStore.getState();

      expect(state.sidebarCollapsed).toBe(false);
      expect(state.activeRoute).toBe('/dashboard');
      expect(state.widgetStates.timeAtWork).toEqual({
        loading: false,
        error: null,
        data: null,
      });
      expect(state.widgetStates.myActions).toEqual({
        loading: false,
        error: null,
        data: null,
      });
    });

    it('should load sidebar state from localStorage on initialization', () => {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, 'true');
      const state = useDashboardStore.getState();
      expect(state.sidebarCollapsed).toBe(false);
    });
  });

  describe('toggleSidebar', () => {
    it('should toggle sidebar from false to true', () => {
      const { toggleSidebar } = useDashboardStore.getState();
      const initialCollapsed = useDashboardStore.getState().sidebarCollapsed;

      toggleSidebar();

      const newState = useDashboardStore.getState();
      expect(newState.sidebarCollapsed).toBe(!initialCollapsed);
    });

    it('should toggle sidebar from true to false', () => {
      useDashboardStore.setState({ sidebarCollapsed: true });
      const { toggleSidebar } = useDashboardStore.getState();

      toggleSidebar();

      const newState = useDashboardStore.getState();
      expect(newState.sidebarCollapsed).toBe(false);
    });

    it('should persist sidebar state to localStorage', () => {
      const { toggleSidebar } = useDashboardStore.getState();

      toggleSidebar();

      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      expect(stored).toBe('true');
    });
  });

  describe('setActiveRoute', () => {
    it('should update active route', () => {
      const { setActiveRoute } = useDashboardStore.getState();

      setActiveRoute('/time');

      const newState = useDashboardStore.getState();
      expect(newState.activeRoute).toBe('/time');
    });

    it('should update active route multiple times', () => {
      const { setActiveRoute } = useDashboardStore.getState();

      setActiveRoute('/leave');
      setActiveRoute('/pim');
      setActiveRoute('/dashboard');

      const newState = useDashboardStore.getState();
      expect(newState.activeRoute).toBe('/dashboard');
    });
  });

  describe('updateWidgetState', () => {
    it('should update timeAtWork widget loading state', () => {
      const { updateWidgetState } = useDashboardStore.getState();

      updateWidgetState('timeAtWork', { loading: true });

      const newState = useDashboardStore.getState();
      expect(newState.widgetStates.timeAtWork.loading).toBe(true);
      expect(newState.widgetStates.timeAtWork.error).toBeNull();
      expect(newState.widgetStates.timeAtWork.data).toBeNull();
    });

    it('should update timeAtWork widget with data', () => {
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

      const { updateWidgetState } = useDashboardStore.getState();

      updateWidgetState('timeAtWork', { loading: false, data: mockData });

      const newState = useDashboardStore.getState();
      expect(newState.widgetStates.timeAtWork.loading).toBe(false);
      expect(newState.widgetStates.timeAtWork.data).toEqual(mockData);
    });

    it('should update timeAtWork widget with error', () => {
      const { updateWidgetState } = useDashboardStore.getState();

      updateWidgetState('timeAtWork', {
        loading: false,
        error: 'Failed to fetch data',
      });

      const newState = useDashboardStore.getState();
      expect(newState.widgetStates.timeAtWork.loading).toBe(false);
      expect(newState.widgetStates.timeAtWork.error).toBe('Failed to fetch data');
      expect(newState.widgetStates.timeAtWork.data).toBeNull();
    });

    it('should update myActions widget state', () => {
      const mockActions: Action[] = [
        {
          type: 'timesheet_approval',
          title: 'Timesheet to Approve',
          count: 1,
          icon: 'calendar',
          url: '/time/timesheets/approve',
        },
      ];

      const { updateWidgetState } = useDashboardStore.getState();

      updateWidgetState('myActions', { loading: false, data: mockActions });

      const newState = useDashboardStore.getState();
      expect(newState.widgetStates.myActions.data).toEqual(mockActions);
    });

    it('should update employeesOnLeave widget state', () => {
      const mockEmployees: EmployeeOnLeave[] = [
        {
          id: 'uuid-123',
          name: 'John Doe',
          displayName: 'John Doe',
          department: 'Engineering',
          leaveType: 'Annual Leave',
          startDate: '2025-01-12',
          endDate: '2025-01-12',
          profilePicture: null,
        },
      ];

      const { updateWidgetState } = useDashboardStore.getState();

      updateWidgetState('employeesOnLeave', {
        loading: false,
        data: mockEmployees,
      });

      const newState = useDashboardStore.getState();
      expect(newState.widgetStates.employeesOnLeave.data).toEqual(mockEmployees);
    });

    it('should update employeeDistribution widget state', () => {
      const mockDistribution: DistributionData[] = [
        {
          subUnit: 'Engineering',
          count: 45,
          percentage: 75.0,
          color: '#FF5733',
        },
      ];

      const { updateWidgetState } = useDashboardStore.getState();

      updateWidgetState('employeeDistribution', {
        loading: false,
        data: mockDistribution,
      });

      const newState = useDashboardStore.getState();
      expect(newState.widgetStates.employeeDistribution.data).toEqual(mockDistribution);
    });

    it('should update buzzPosts widget state', () => {
      const mockPosts: BuzzPost[] = [
        {
          id: 'post-uuid',
          author: {
            id: 'user-uuid',
            name: 'Test User',
            displayName: 'Test User',
            profilePicture: null,
          },
          content: 'Post content',
          images: [],
          timestamp: '2025-10-12T16:42:00Z',
          likes: 0,
          comments: 0,
        },
      ];

      const { updateWidgetState } = useDashboardStore.getState();

      updateWidgetState('buzzPosts', { loading: false, data: mockPosts });

      const newState = useDashboardStore.getState();
      expect(newState.widgetStates.buzzPosts.data).toEqual(mockPosts);
    });

    it('should preserve existing state when updating partial state', () => {
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

      const { updateWidgetState } = useDashboardStore.getState();

      updateWidgetState('timeAtWork', { loading: false, data: mockData });
      updateWidgetState('timeAtWork', { loading: true });

      const newState = useDashboardStore.getState();
      expect(newState.widgetStates.timeAtWork.loading).toBe(true);
      expect(newState.widgetStates.timeAtWork.data).toEqual(mockData);
    });
  });

  describe('state persistence', () => {
    it('should persist sidebar collapsed state', () => {
      const { toggleSidebar } = useDashboardStore.getState();

      toggleSidebar();

      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      expect(stored).toBe('true');
    });

    it('should load sidebar collapsed state from localStorage', () => {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, 'true');

      const state = useDashboardStore.getState();
      expect(state.sidebarCollapsed).toBe(false);
    });
  });
});

