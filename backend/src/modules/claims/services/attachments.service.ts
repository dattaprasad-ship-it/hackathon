import { AttachmentRepository } from '../repositories/attachment.repository';
import { ClaimRepository } from '../repositories/claim.repository';
import { AuditLogService } from './audit-log.service';
import { Attachment } from '../entities/attachment.entity';
import { User } from '../../authentication/entities/user.entity';
import { BusinessException } from '../../../common/exceptions/business.exception';
import { logger } from '../../../utils/logger';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export class AttachmentsService {
  private readonly uploadsDir: string;

  constructor(
    private readonly attachmentRepository: AttachmentRepository,
    private readonly claimRepository: ClaimRepository,
    private readonly auditLogService?: AuditLogService
  ) {
    // Set uploads directory
    this.uploadsDir = path.join(process.cwd(), 'uploads', 'claims');
    this.ensureUploadsDirectory();
  }

  private ensureUploadsDirectory(): void {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async upload(
    claimId: string,
    file: Express.Multer.File,
    description?: string,
    user?: User
  ): Promise<Attachment> {
    // Validate claim exists and is in correct status
    const claim = await this.claimRepository.findByIdWithRelations(claimId);
    if (!claim) {
      throw new BusinessException('Claim not found', 404, 'NOT_FOUND');
    }

    if (claim.status !== 'Initiated') {
      throw new BusinessException('Attachments can only be added to claims in Initiated status', 400, 'INVALID_STATUS');
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new BusinessException('File size cannot exceed 1MB', 400, 'VALIDATION_ERROR');
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BusinessException('File type not allowed', 400, 'VALIDATION_ERROR');
    }

    // Sanitize filename
    const sanitizedFilename = this.sanitizeFilename(file.originalname);

    // Generate unique stored filename using timestamp + random bytes
    const fileExtension = path.extname(sanitizedFilename);
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(8).toString('hex');
    const storedFilename = `${timestamp}-${randomBytes}${fileExtension}`;
    const filePath = path.join(this.uploadsDir, storedFilename);

    // Save file to disk
    try {
      fs.writeFileSync(filePath, file.buffer);
    } catch (error) {
      logger.error('Failed to save file', { error, filePath });
      throw new BusinessException('Failed to save file', 500, 'FILE_SAVE_ERROR');
    }

    // Create attachment record
    const attachment = await this.attachmentRepository.create({
      claim,
      originalFilename: sanitizedFilename,
      storedFilename,
      fileSize: file.size,
      fileType: file.mimetype,
      description,
      filePath: path.relative(process.cwd(), filePath),
    } as Partial<Attachment>);

    logger.info(`Attachment uploaded: ${attachment.id} for claim: ${claimId}`, {
      attachmentId: attachment.id,
      claimId,
      filename: sanitizedFilename,
      fileSize: file.size,
    });

    // Create audit log
    if (this.auditLogService && user) {
      try {
        await this.auditLogService.log({
          entityType: 'Attachment',
          entityId: attachment.id,
          action: 'ADD_ATTACHMENT',
          user,
          newValues: {
            claimId,
            filename: sanitizedFilename,
            fileSize: file.size,
            fileType: file.mimetype,
          },
        });
      } catch (error) {
        logger.error('Failed to create audit log for attachment upload', { error, attachmentId: attachment.id });
      }
    }

    return attachment;
  }

  async delete(attachmentId: string, user?: User): Promise<void> {
    // Validate attachment exists
    const attachment = await this.attachmentRepository.findById(attachmentId);
    if (!attachment) {
      throw new BusinessException('Attachment not found', 404, 'NOT_FOUND');
    }

    const claimId = (attachment.claim as any).id;

    // Validate claim status
    const claim = await this.claimRepository.findByIdWithRelations(claimId);
    if (!claim) {
      throw new BusinessException('Claim not found', 404, 'NOT_FOUND');
    }

    if (claim.status !== 'Initiated') {
      throw new BusinessException('Attachments can only be deleted from claims in Initiated status', 400, 'INVALID_STATUS');
    }

    // Delete file from disk
    const filePath = path.join(process.cwd(), attachment.filePath);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        logger.error('Failed to delete file', { error, filePath });
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete attachment record
    await this.attachmentRepository.delete(attachmentId);

    logger.info(`Attachment deleted: ${attachmentId}`, { attachmentId, claimId });

    // Create audit log
    if (this.auditLogService && user) {
      try {
        await this.auditLogService.log({
          entityType: 'Attachment',
          entityId: attachmentId,
          action: 'DELETE_ATTACHMENT',
          user,
        });
      } catch (error) {
        logger.error('Failed to create audit log for attachment deletion', { error, attachmentId });
      }
    }
  }

  async findByClaimId(claimId: string): Promise<Attachment[]> {
    return this.attachmentRepository.findByClaimId(claimId);
  }

  async getFileStream(attachmentId: string): Promise<{ stream: fs.ReadStream; filename: string; mimeType: string }> {
    const attachment = await this.attachmentRepository.findById(attachmentId);
    if (!attachment) {
      throw new BusinessException('Attachment not found', 404, 'NOT_FOUND');
    }

    const filePath = path.join(process.cwd(), attachment.filePath);
    if (!fs.existsSync(filePath)) {
      throw new BusinessException('File not found on disk', 404, 'FILE_NOT_FOUND');
    }

    const stream = fs.createReadStream(filePath);

    return {
      stream,
      filename: attachment.originalFilename,
      mimeType: attachment.fileType,
    };
  }

  private sanitizeFilename(filename: string): string {
    // Remove path traversal attempts and special characters
    const sanitized = filename
      .replace(/\.\./g, '') // Remove ..
      .replace(/[\/\\]/g, '_') // Replace slashes with underscores
      .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars with underscores
      .substring(0, 255); // Limit length

    return sanitized || 'file';
  }
}

