"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentsService = void 0;
const business_exception_1 = require("../../../common/exceptions/business.exception");
const logger_1 = require("../../../utils/logger");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
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
class AttachmentsService {
    constructor(attachmentRepository, claimRepository) {
        this.attachmentRepository = attachmentRepository;
        this.claimRepository = claimRepository;
        // Set uploads directory
        this.uploadsDir = path.join(process.cwd(), 'uploads', 'claims');
        this.ensureUploadsDirectory();
    }
    ensureUploadsDirectory() {
        if (!fs.existsSync(this.uploadsDir)) {
            fs.mkdirSync(this.uploadsDir, { recursive: true });
        }
    }
    async upload(claimId, file, description) {
        // Validate claim exists and is in correct status
        const claim = await this.claimRepository.findByIdWithRelations(claimId);
        if (!claim) {
            throw new business_exception_1.BusinessException('Claim not found', 404, 'NOT_FOUND');
        }
        if (claim.status !== 'Initiated') {
            throw new business_exception_1.BusinessException('Attachments can only be added to claims in Initiated status', 400, 'INVALID_STATUS');
        }
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            throw new business_exception_1.BusinessException('File size cannot exceed 1MB', 400, 'VALIDATION_ERROR');
        }
        // Validate file type
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new business_exception_1.BusinessException('File type not allowed', 400, 'VALIDATION_ERROR');
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
        }
        catch (error) {
            logger_1.logger.error('Failed to save file', { error, filePath });
            throw new business_exception_1.BusinessException('Failed to save file', 500, 'FILE_SAVE_ERROR');
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
        });
        logger_1.logger.info(`Attachment uploaded: ${attachment.id} for claim: ${claimId}`, {
            attachmentId: attachment.id,
            claimId,
            filename: sanitizedFilename,
            fileSize: file.size,
        });
        return attachment;
    }
    async delete(attachmentId) {
        // Validate attachment exists
        const attachment = await this.attachmentRepository.findById(attachmentId);
        if (!attachment) {
            throw new business_exception_1.BusinessException('Attachment not found', 404, 'NOT_FOUND');
        }
        const claimId = attachment.claim.id;
        // Validate claim status
        const claim = await this.claimRepository.findByIdWithRelations(claimId);
        if (!claim) {
            throw new business_exception_1.BusinessException('Claim not found', 404, 'NOT_FOUND');
        }
        if (claim.status !== 'Initiated') {
            throw new business_exception_1.BusinessException('Attachments can only be deleted from claims in Initiated status', 400, 'INVALID_STATUS');
        }
        // Delete file from disk
        const filePath = path.join(process.cwd(), attachment.filePath);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            }
            catch (error) {
                logger_1.logger.error('Failed to delete file', { error, filePath });
                // Continue with database deletion even if file deletion fails
            }
        }
        // Delete attachment record
        await this.attachmentRepository.delete(attachmentId);
        logger_1.logger.info(`Attachment deleted: ${attachmentId}`, { attachmentId, claimId });
    }
    async findByClaimId(claimId) {
        return this.attachmentRepository.findByClaimId(claimId);
    }
    async getFileStream(attachmentId) {
        const attachment = await this.attachmentRepository.findById(attachmentId);
        if (!attachment) {
            throw new business_exception_1.BusinessException('Attachment not found', 404, 'NOT_FOUND');
        }
        const filePath = path.join(process.cwd(), attachment.filePath);
        if (!fs.existsSync(filePath)) {
            throw new business_exception_1.BusinessException('File not found on disk', 404, 'FILE_NOT_FOUND');
        }
        const stream = fs.createReadStream(filePath);
        return {
            stream,
            filename: attachment.originalFilename,
            mimeType: attachment.fileType,
        };
    }
    sanitizeFilename(filename) {
        // Remove path traversal attempts and special characters
        const sanitized = filename
            .replace(/\.\./g, '') // Remove ..
            .replace(/[\/\\]/g, '_') // Replace slashes with underscores
            .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars with underscores
            .substring(0, 255); // Limit length
        return sanitized || 'file';
    }
}
exports.AttachmentsService = AttachmentsService;
//# sourceMappingURL=attachments.service.js.map