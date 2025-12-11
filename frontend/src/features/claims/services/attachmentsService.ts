import axios, { AxiosProgressEvent } from 'axios';
import { apiClient } from '@/utils/api';
import { storage } from '@/utils/storage';
import type {
  AttachmentResponse,
  CreateAttachmentRequest,
  FileUploadProgress,
} from '../types/attachments.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const attachmentsService = {
  getByClaimId: async (claimId: string): Promise<AttachmentResponse[]> => {
    const response = await apiClient.get<AttachmentResponse[]>(`/claims/${claimId}/attachments`);
    return response.data;
  },

  upload: async (
    claimId: string,
    file: File,
    description?: string,
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<AttachmentResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }

    const token = storage.getToken();
    const response = await axios.post<AttachmentResponse>(
      `${API_BASE_URL}/claims/${claimId}/attachments`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (onProgress && progressEvent.total) {
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
            });
          }
        },
      }
    );
    return response.data;
  },

  download: async (claimId: string, attachmentId: string): Promise<Blob> => {
    const response = await apiClient.get(
      `/claims/${claimId}/attachments/${attachmentId}/download`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  delete: async (claimId: string, attachmentId: string): Promise<void> => {
    await apiClient.delete(`/claims/${claimId}/attachments/${attachmentId}`);
  },
};

