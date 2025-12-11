export interface TimeAtWorkData {
  punchedIn: boolean;
  punchInTime: string;
  timezone: string;
  todayHours: {
    hours: number;
    minutes: number;
    totalMinutes: number;
  };
  weekData: WeekDayData[];
  weekRange: {
    start: string;
    end: string;
  };
}

export interface WeekDayData {
  date: string;
  day: string;
  hours: number;
  minutes: number;
}

export interface Action {
  type: string;
  title: string;
  count: number;
  icon: string;
  url: string;
}

export interface EmployeeOnLeave {
  id: string;
  name: string;
  displayName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  profilePicture: string | null;
}

export interface DistributionData {
  subUnit: string;
  count: number;
  percentage: number;
  color: string;
}

export interface Image {
  url: string;
  thumbnail: string;
}

export interface BuzzPost {
  id: string;
  author: {
    id: string;
    name: string;
    displayName: string;
    profilePicture: string | null;
  };
  content: string;
  images: Image[];
  timestamp: string;
  likes: number;
  comments: number;
}

export interface WidgetState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}

export interface DashboardState {
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
  updateWidgetState: <T>(widgetType: keyof DashboardState['widgetStates'], state: Partial<WidgetState<T>>) => void;
}

export type TimeAtWorkResponse = TimeAtWorkData;

export interface MyActionsResponse {
  actions: Action[];
}

export interface EmployeesOnLeaveResponse {
  date: string;
  employees: EmployeeOnLeave[];
  totalCount: number;
}

export interface EmployeeDistributionResponse {
  distribution: DistributionData[];
  totalEmployees: number;
}

export interface BuzzPostsResponse {
  posts: BuzzPost[];
  totalCount: number;
}

export interface DashboardSummaryResponse {
  timeAtWork: TimeAtWorkData;
  myActions: Action[];
  employeesOnLeave: EmployeeOnLeave[];
  employeeDistribution: DistributionData[];
  buzzPosts: BuzzPost[];
}

