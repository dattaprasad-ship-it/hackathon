import { create } from 'zustand';
import type {
  TimeAtWorkData,
  Action,
  EmployeeOnLeave,
  DistributionData,
  BuzzPost,
  WidgetState,
} from '@/features/dashboard/types/dashboard.types';

const SIDEBAR_STORAGE_KEY = 'dashboard-sidebar-collapsed';

interface DashboardStore {
  sidebarCollapsed: boolean;
  activeRoute: string;
  widgetStates: {
    timeAtWork: WidgetState<TimeAtWorkData>;
    myActions: WidgetState<Action[]>;
    employeesOnLeave: WidgetState<EmployeeOnLeave[]>;
    employeeDistribution: WidgetState<DistributionData[]>;
    buzzPosts: WidgetState<BuzzPost[]>;
  };
  toggleSidebar: () => void;
  setActiveRoute: (route: string) => void;
  updateWidgetState: <T>(
    widgetType: keyof DashboardStore['widgetStates'],
    state: Partial<WidgetState<T>>
  ) => void;
  initialize: () => void;
}

const getInitialSidebarState = (): boolean => {
  try {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return stored === 'true';
  } catch {
    return false;
  }
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  sidebarCollapsed: getInitialSidebarState(),
  activeRoute: '/dashboard',
  widgetStates: {
    timeAtWork: { loading: false, error: null, data: null },
    myActions: { loading: false, error: null, data: null },
    employeesOnLeave: { loading: false, error: null, data: null },
    employeeDistribution: { loading: false, error: null, data: null },
    buzzPosts: { loading: false, error: null, data: null },
  },

  toggleSidebar: () => {
    set((state) => {
      const newCollapsed = !state.sidebarCollapsed;
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(newCollapsed));
      } catch (error) {
        console.error('Failed to persist sidebar state:', error);
      }
      return { sidebarCollapsed: newCollapsed };
    });
  },

  setActiveRoute: (route: string) => {
    set({ activeRoute: route });
  },

  updateWidgetState: <T>(
    widgetType: keyof DashboardStore['widgetStates'],
    partialState: Partial<WidgetState<T>>
  ) => {
    set((state) => ({
      widgetStates: {
        ...state.widgetStates,
        [widgetType]: {
          ...state.widgetStates[widgetType],
          ...partialState,
        },
      },
    }));
  },

  initialize: () => {
    const sidebarCollapsed = getInitialSidebarState();
    set({ sidebarCollapsed });
  },
}));

