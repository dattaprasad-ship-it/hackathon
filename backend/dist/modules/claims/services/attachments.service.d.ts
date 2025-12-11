import { AttachmentRepository } from '../repositories/attachment.repository';
import { ClaimRepository } from '../repositories/claim.repository';
import { Attachment } from '../entities/attachment.entity';
import * as fs from 'fs';
export declare class AttachmentsService {
    private readonly attachmentRepository;
    private readonly claimRepository;
    private readonly uploadsDir;
    constructor(attachmentRepository: AttachmentRepository, claimRepository: ClaimRepository);
    private ensureUploadsDirectory;
    upload(claimId: string, file: Express.Multer.File, description?: string): Promise<Attachment>;
    delete(attachmentId: string): Promise<void>;
    findByClaimId(claimId: string): Promise<Attachment[]>;
    getFileStream(attachmentId: string): Promise<{
        stream: fs.ReadStream;
        filename: string;
        mimeType: string;
    }>;
    private sanitizeFilename;
}
//# sourceMappingURL=attachments.service.d.ts.map