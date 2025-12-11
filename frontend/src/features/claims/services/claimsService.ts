import { apiClient } from '@/utils/api';
import type {
  Claim,
  CreateClaimRequest,
  UpdateClaimRequest,
  ClaimSearchFilters,
  ClaimListResponse,
  RejectClaimRequest,
} from '../types/claims.types';

const API_BASE_URL = '/claims';

export const claimsService = {
  search: async (filters: ClaimSearchFilters = {}): Promise<ClaimListResponse> => {
    const params = new URLSearchParams();

    if (filters.employeeName) params.append('employeeName', filters.employeeName);
    if (filters.referenceId) params.append('referenceId', filters.referenceId);
    if (filters.eventTypeId) params.append('eventTypeId', filters.eventTypeId);
    if (filters.status) params.append('status', filters.status);
    if (filters.fromDate) params.append('fromDate', filters.fromDate);
    if (filters.toDate) params.append('toDate', filters.toDate);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await apiClient.get<ClaimListResponse>(`${API_BASE_URL}?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<Claim> => {
    const response = await apiClient.get<Claim>(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateClaimRequest): Promise<Claim> => {
    const response = await apiClient.post<Claim>(API_BASE_URL, data);
    return response.data;
  },

  update: async (id: string, data: UpdateClaimRequest): Promise<Claim> => {
    const response = await apiClient.put<Claim>(`${API_BASE_URL}/${id}`, data);
    return response.data;
  },

  submit: async (id: string): Promise<void> => {
    await apiClient.post(`${API_BASE_URL}/${id}/submit`);
  },

  approve: async (id: string): Promise<void> => {
    await apiClient.post(`${API_BASE_URL}/${id}/approve`);
  },

  reject: async (id: string, data: RejectClaimRequest): Promise<void> => {
    await apiClient.post(`${API_BASE_URL}/${id}/reject`, data);
  },
};

