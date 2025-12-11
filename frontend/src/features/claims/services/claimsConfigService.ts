import { apiClient } from '@/utils/api';
import type { ClaimsConfig } from '../types/claims-config.types';

export const claimsConfigService = {
  getConfig: async (): Promise<ClaimsConfig> => {
    const response = await apiClient.get<ClaimsConfig>('/claims/config');
    return response.data;
  },
};

