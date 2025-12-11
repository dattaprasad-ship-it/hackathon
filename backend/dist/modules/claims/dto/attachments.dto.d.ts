export interface CreateAttachmentDto {
    description?: string;
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
//# sourceMappingURL=attachments.dto.d.ts.map