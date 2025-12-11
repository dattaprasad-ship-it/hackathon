import { apiClient } from '@/utils/api';
import type { PimConfig, UpdatePimConfigRequest } from '../types/pim-config.types';

const API_BASE_URL = '/pim/config';

export const pimConfigService = {
  get: async (): Promise<PimConfig> => {
    const response = await apiClient.get<PimConfig>(API_BASE_URL);
    return response.data;
  },

  update: async (data: UpdatePimConfigRequest): Promise<PimConfig> => {
    const response = await apiClient.put<PimConfig>(API_BASE_URL, data);
    return response.data;
  },
};

