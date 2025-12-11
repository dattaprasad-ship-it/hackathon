import { Attachment } from './claims.types';

export interface CreateAttachmentRequest {
  description?: string;
  // File is handled via FormData, not in request body
}

export interface AttachmentResponse extends Attachment {}

export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

