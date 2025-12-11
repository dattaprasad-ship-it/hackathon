import axios from 'axios';
import { apiClient } from '@/utils/api';
import type {
  TimeAtWorkData,
  Action,
  EmployeeOnLeave,
  DistributionData,
  BuzzPost,
  MyActionsResponse,
  EmployeesOnLeaveResponse,
  EmployeeDistributionResponse,
  BuzzPostsResponse,
} from '../types/dashboard.types';

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    // Handle network errors (ECONNREFUSED, timeout, etc.)
    if (!error.response) {
      const errorCode = (error as any).code;
      if (errorCode === 'ECONNREFUSED' || errorCode === 'ERR_NETWORK') {
        throw new Error(
          'Backend API is not available. Please ensure the backend server is running on port 3000.'
        );
      }
      throw new Error(
        'Network Error: Backend API is not available. Please ensure the backend server is running.'
      );
    }

    const status = error.response.status;
    const errorData = error.response.data?.error;

    if (status === 401) {
      throw new Error(
        errorData?.message || 'Authentication token required or invalid'
      );
    }

    if (status === 403) {
      throw new Error(
        errorData?.message || 'You don\'t have permission to access this resource'
      );
    }

    if (status === 400) {
      const validationErrors = errorData?.details;
      if (validationErrors) {
        const messages = Object.values(validationErrors).join(', ');
        throw new Error(`Validation failed: ${messages}`);
      }
      throw new Error(errorData?.message || 'Bad Request. Please check your input.');
    }

    if (status === 500) {
      throw new Error(
        errorData?.message || 'An error occurred while processing your request'
      );
    }

    throw new Error(
      errorData?.message || `Server Error: ${status} - An unexpected error occurred.`
    );
  }

  throw new Error('An unknown error occurred while fetching dashboard data.');
};

export const dashboardService = {
  getTimeAtWork: async (): Promise<TimeAtWorkData> => {
    try {
      const response = await apiClient.get<TimeAtWorkData>('/dashboard/time-at-work');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getMyActions: async (): Promise<Action[]> => {
    try {
      const response = await apiClient.get<MyActionsResponse>('/dashboard/my-actions');
      return response.data.actions;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getEmployeesOnLeave: async (date?: string): Promise<EmployeeOnLeave[]> => {
    try {
      const params = date ? { date } : undefined;
      const response = await apiClient.get<EmployeesOnLeaveResponse>(
        '/dashboard/employees-on-leave',
        { params }
      );
      return response.data.employees;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getEmployeeDistribution: async (): Promise<DistributionData[]> => {
    try {
      const response = await apiClient.get<EmployeeDistributionResponse>(
        '/dashboard/employee-distribution'
      );
      return response.data.distribution;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getBuzzPosts: async (limit?: number): Promise<BuzzPost[]> => {
    try {
      const params = limit ? { limit } : undefined;
      const response = await apiClient.get<BuzzPostsResponse>(
        '/dashboard/buzz/latest',
        { params }
      );
      return response.data.posts;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

