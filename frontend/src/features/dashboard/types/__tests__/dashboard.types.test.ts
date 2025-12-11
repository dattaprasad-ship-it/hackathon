import { describe, it, expect } from 'vitest';
import type {
  TimeAtWorkData,
  WeekDayData,
  Action,
  EmployeeOnLeave,
  DistributionData,
  BuzzPost,
  Image,
  DashboardState,
  TimeAtWorkResponse,
  MyActionsResponse,
  EmployeesOnLeaveResponse,
  EmployeeDistributionResponse,
  BuzzPostsResponse,
} from '../dashboard.types';

describe('Dashboard Types', () => {
  describe('TimeAtWorkData', () => {
    it('should have all required properties', () => {
      const data: TimeAtWorkData = {
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

      expect(data.punchedIn).toBe(true);
      expect(data.punchInTime).toBe('2025-01-12T11:50:00Z');
      expect(data.timezone).toBe('GMT+1');
      expect(data.todayHours.hours).toBe(0);
      expect(data.todayHours.minutes).toBe(27);
      expect(data.todayHours.totalMinutes).toBe(27);
      expect(data.weekData).toEqual([]);
      expect(data.weekRange.start).toBe('2025-01-08');
      expect(data.weekRange.end).toBe('2025-01-14');
    });

    it('should accept valid week data', () => {
      const weekData: WeekDayData[] = [
        {
          date: '2025-01-08',
          day: 'Mon',
          hours: 8,
          minutes: 0,
        },
        {
          date: '2025-01-09',
          day: 'Tue',
          hours: 8,
          minutes: 30,
        },
      ];

      const data: TimeAtWorkData = {
        punchedIn: false,
        punchInTime: '',
        timezone: 'GMT+1',
        todayHours: {
          hours: 0,
          minutes: 0,
          totalMinutes: 0,
        },
        weekData,
        weekRange: {
          start: '2025-01-08',
          end: '2025-01-14',
        },
      };

      expect(data.weekData).toHaveLength(2);
      expect(data.weekData[0].day).toBe('Mon');
      expect(data.weekData[1].hours).toBe(8);
    });
  });

  describe('Action', () => {
    it('should have all required properties', () => {
      const action: Action = {
        type: 'timesheet_approval',
        title: 'Timesheet to Approve',
        count: 1,
        icon: 'calendar',
        url: '/time/timesheets/approve',
      };

      expect(action.type).toBe('timesheet_approval');
      expect(action.title).toBe('Timesheet to Approve');
      expect(action.count).toBe(1);
      expect(action.icon).toBe('calendar');
      expect(action.url).toBe('/time/timesheets/approve');
    });

    it('should accept zero count', () => {
      const action: Action = {
        type: 'self_review',
        title: 'Pending Self Review',
        count: 0,
        icon: 'person-heart',
        url: '/performance/reviews/self',
      };

      expect(action.count).toBe(0);
    });
  });

  describe('EmployeeOnLeave', () => {
    it('should have all required properties', () => {
      const employee: EmployeeOnLeave = {
        id: 'uuid-123',
        name: 'John Doe',
        displayName: 'John Doe',
        department: 'Engineering',
        leaveType: 'Annual Leave',
        startDate: '2025-01-12',
        endDate: '2025-01-12',
        profilePicture: 'https://example.com/profile.jpg',
      };

      expect(employee.id).toBe('uuid-123');
      expect(employee.name).toBe('John Doe');
      expect(employee.displayName).toBe('John Doe');
      expect(employee.department).toBe('Engineering');
      expect(employee.leaveType).toBe('Annual Leave');
      expect(employee.startDate).toBe('2025-01-12');
      expect(employee.endDate).toBe('2025-01-12');
      expect(employee.profilePicture).toBe('https://example.com/profile.jpg');
    });

    it('should accept null profile picture', () => {
      const employee: EmployeeOnLeave = {
        id: 'uuid-123',
        name: 'John Doe',
        displayName: 'John Doe',
        department: 'Engineering',
        leaveType: 'Annual Leave',
        startDate: '2025-01-12',
        endDate: '2025-01-12',
        profilePicture: null,
      };

      expect(employee.profilePicture).toBeNull();
    });
  });

  describe('DistributionData', () => {
    it('should have all required properties', () => {
      const distribution: DistributionData = {
        subUnit: 'Engineering',
        count: 45,
        percentage: 75.0,
        color: '#FF5733',
      };

      expect(distribution.subUnit).toBe('Engineering');
      expect(distribution.count).toBe(45);
      expect(distribution.percentage).toBe(75.0);
      expect(distribution.color).toBe('#FF5733');
    });

    it('should accept zero count and percentage', () => {
      const distribution: DistributionData = {
        subUnit: 'Sales',
        count: 0,
        percentage: 0.0,
        color: '#FFC300',
      };

      expect(distribution.count).toBe(0);
      expect(distribution.percentage).toBe(0.0);
    });
  });

  describe('BuzzPost', () => {
    it('should have all required properties', () => {
      const post: BuzzPost = {
        id: 'post-uuid',
        author: {
          id: 'user-uuid',
          name: 'Test Automation User',
          displayName: 'Test Automation User',
          profilePicture: 'https://example.com/avatar.jpg',
        },
        content: 'Post text content',
        images: [],
        timestamp: '2025-10-12T16:42:00Z',
        likes: 5,
        comments: 2,
      };

      expect(post.id).toBe('post-uuid');
      expect(post.author.id).toBe('user-uuid');
      expect(post.author.name).toBe('Test Automation User');
      expect(post.content).toBe('Post text content');
      expect(post.images).toEqual([]);
      expect(post.timestamp).toBe('2025-10-12T16:42:00Z');
      expect(post.likes).toBe(5);
      expect(post.comments).toBe(2);
    });

    it('should accept images array', () => {
      const images: Image[] = [
        {
          url: 'https://example.com/image.jpg',
          thumbnail: 'https://example.com/thumb.jpg',
        },
      ];

      const post: BuzzPost = {
        id: 'post-uuid',
        author: {
          id: 'user-uuid',
          name: 'Test User',
          displayName: 'Test User',
          profilePicture: null,
        },
        content: 'Post with image',
        images,
        timestamp: '2025-10-12T16:42:00Z',
        likes: 0,
        comments: 0,
      };

      expect(post.images).toHaveLength(1);
      expect(post.images[0].url).toBe('https://example.com/image.jpg');
      expect(post.images[0].thumbnail).toBe('https://example.com/thumb.jpg');
    });

    it('should accept null profile picture for author', () => {
      const post: BuzzPost = {
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
      };

      expect(post.author.profilePicture).toBeNull();
    });
  });

  describe('DashboardState', () => {
    it('should have all required properties', () => {
      const state: DashboardState = {
        sidebarCollapsed: false,
        activeRoute: '/dashboard',
        widgetStates: {
          timeAtWork: { loading: false, error: null, data: null },
          myActions: { loading: false, error: null, data: null },
          employeesOnLeave: { loading: false, error: null, data: null },
          employeeDistribution: { loading: false, error: null, data: null },
          buzzPosts: { loading: false, error: null, data: null },
        },
        toggleSidebar: () => {},
        setActiveRoute: () => {},
        updateWidgetState: () => {},
      };

      expect(state.sidebarCollapsed).toBe(false);
      expect(state.activeRoute).toBe('/dashboard');
      expect(state.widgetStates).toBeDefined();
      expect(state.toggleSidebar).toBeDefined();
      expect(state.setActiveRoute).toBeDefined();
      expect(state.updateWidgetState).toBeDefined();
    });

    it('should accept widget data', () => {
      const timeAtWorkData: TimeAtWorkData = {
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

      const state: DashboardState = {
        sidebarCollapsed: false,
        activeRoute: '/dashboard',
        widgetStates: {
          timeAtWork: { loading: false, error: null, data: timeAtWorkData },
          myActions: { loading: false, error: null, data: null },
          employeesOnLeave: { loading: false, error: null, data: null },
          employeeDistribution: { loading: false, error: null, data: null },
          buzzPosts: { loading: false, error: null, data: null },
        },
        toggleSidebar: () => {},
        setActiveRoute: () => {},
        updateWidgetState: () => {},
      };

      expect(state.widgetStates.timeAtWork.data).toEqual(timeAtWorkData);
    });
  });

  describe('Response Types', () => {
    it('should validate TimeAtWorkResponse structure', () => {
      const response: TimeAtWorkResponse = {
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

      expect(response).toHaveProperty('punchedIn');
      expect(response).toHaveProperty('punchInTime');
      expect(response).toHaveProperty('timezone');
      expect(response).toHaveProperty('todayHours');
      expect(response).toHaveProperty('weekData');
      expect(response).toHaveProperty('weekRange');
    });

    it('should validate MyActionsResponse structure', () => {
      const response: MyActionsResponse = {
        actions: [
          {
            type: 'timesheet_approval',
            title: 'Timesheet to Approve',
            count: 1,
            icon: 'calendar',
            url: '/time/timesheets/approve',
          },
        ],
      };

      expect(response).toHaveProperty('actions');
      expect(Array.isArray(response.actions)).toBe(true);
      expect(response.actions).toHaveLength(1);
    });

    it('should validate EmployeesOnLeaveResponse structure', () => {
      const response: EmployeesOnLeaveResponse = {
        date: '2025-01-12',
        employees: [],
        totalCount: 0,
      };

      expect(response).toHaveProperty('date');
      expect(response).toHaveProperty('employees');
      expect(response).toHaveProperty('totalCount');
      expect(Array.isArray(response.employees)).toBe(true);
    });

    it('should validate EmployeeDistributionResponse structure', () => {
      const response: EmployeeDistributionResponse = {
        distribution: [],
        totalEmployees: 0,
      };

      expect(response).toHaveProperty('distribution');
      expect(response).toHaveProperty('totalEmployees');
      expect(Array.isArray(response.distribution)).toBe(true);
    });

    it('should validate BuzzPostsResponse structure', () => {
      const response: BuzzPostsResponse = {
        posts: [],
        totalCount: 0,
      };

      expect(response).toHaveProperty('posts');
      expect(response).toHaveProperty('totalCount');
      expect(Array.isArray(response.posts)).toBe(true);
    });
  });
});

