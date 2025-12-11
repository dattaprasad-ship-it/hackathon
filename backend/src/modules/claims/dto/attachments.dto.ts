export interface CreateAttachmentDto {
  description?: string;
  // File is handled via multipart/form-data, not in DTO
}

export interface AttachmentResponseDto {
  id: string;
  originalFilename: string;
  fileSize: number;
  fileType: string;
  description?: string;
  filePath: string;
  createdAt: string;
  createdBy?: string;
}

