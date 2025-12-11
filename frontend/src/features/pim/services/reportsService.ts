import { apiClient } from '@/utils/api';
import type {
  Report,
  CreateReportRequest,
  UpdateReportRequest,
  ReportExecutionResult,
  ReportsListResponse,
} from '../types/reports.types';

const API_BASE_URL = '/reports';

export const reportsService = {
  list: async (reportName?: string): Promise<Report[]> => {
    const params = new URLSearchParams();
    if (reportName) params.append('reportName', reportName);

    const response = await apiClient.get<ReportsListResponse>(
      `${API_BASE_URL}${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data.data;
  },

  getById: async (id: string): Promise<Report> => {
    const response = await apiClient.get<Report>(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateReportRequest): Promise<Report> => {
    const response = await apiClient.post<Report>(API_BASE_URL, data);
    return response.data;
  },

  update: async (id: string, data: UpdateReportRequest): Promise<Report> => {
    const response = await apiClient.put<Report>(`${API_BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_BASE_URL}/${id}`);
  },

  execute: async (id: string): Promise<ReportExecutionResult> => {
    const response = await apiClient.post<ReportExecutionResult>(`${API_BASE_URL}/${id}/execute`);
    return response.data;
  },
};

