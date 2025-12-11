import { apiClient } from '@/utils/api';
import type {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeListFilters,
  EmployeeListResponse,
} from '../types/employees.types';

const API_BASE_URL = '/employees';

export const employeesService = {
  list: async (filters: EmployeeListFilters = {}): Promise<EmployeeListResponse> => {
    const params = new URLSearchParams();
    
    if (filters.employeeName) params.append('employeeName', filters.employeeName);
    if (filters.employeeId) params.append('employeeId', filters.employeeId);
    if (filters.employmentStatusId) params.append('employmentStatusId', filters.employmentStatusId);
    if (filters.jobTitleId) params.append('jobTitleId', filters.jobTitleId);
    if (filters.subUnitId) params.append('subUnitId', filters.subUnitId);
    if (filters.supervisorId) params.append('supervisorId', filters.supervisorId);
    if (filters.include) params.append('include', filters.include);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await apiClient.get<EmployeeListResponse>(`${API_BASE_URL}?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<Employee> => {
    const response = await apiClient.get<Employee>(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateEmployeeRequest): Promise<Employee> => {
    const response = await apiClient.post<Employee>(API_BASE_URL, data);
    return response.data;
  },

  update: async (id: string, data: UpdateEmployeeRequest): Promise<Employee> => {
    const response = await apiClient.put<Employee>(`${API_BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_BASE_URL}/${id}`);
  },
};

