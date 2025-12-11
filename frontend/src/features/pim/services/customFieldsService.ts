import { apiClient } from '@/utils/api';
import type {
  CustomField,
  CreateCustomFieldRequest,
  UpdateCustomFieldRequest,
  CustomFieldsListResponse,
} from '../types/custom-fields.types';

const API_BASE_URL = '/custom-fields';

export const customFieldsService = {
  list: async (): Promise<{ fields: CustomField[]; remaining: number }> => {
    const response = await apiClient.get<CustomFieldsListResponse>(API_BASE_URL);
    return {
      fields: response.data.data,
      remaining: response.data.remaining,
    };
  },

  getById: async (id: string): Promise<CustomField> => {
    const response = await apiClient.get<CustomField>(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateCustomFieldRequest): Promise<CustomField> => {
    const response = await apiClient.post<CustomField>(API_BASE_URL, data);
    return response.data;
  },

  update: async (id: string, data: UpdateCustomFieldRequest): Promise<CustomField> => {
    const response = await apiClient.put<CustomField>(`${API_BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_BASE_URL}/${id}`);
  },
};

