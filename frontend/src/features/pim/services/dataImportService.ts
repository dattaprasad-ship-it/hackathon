import { apiClient } from '@/utils/api';
import type { DataImportResult } from '../types/data-import.types';

const API_BASE_URL = '/pim/import';

export const dataImportService = {
  upload: async (file: File): Promise<DataImportResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<DataImportResult>(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

