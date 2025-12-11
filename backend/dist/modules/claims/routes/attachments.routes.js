"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAttachmentsRoutes = void 0;
const express_1 = require("express");
const jwt_auth_middleware_1 = require("../../authentication/middleware/jwt-auth.middleware");
const attachments_validator_1 = require("../validators/attachments.validator");
const express_validator_1 = require("express-validator");
const business_exception_1 = require("../../../common/exceptions/business.exception");
const multer_1 = __importDefault(require("multer"));
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        throw new business_exception_1.BusinessException(firstError.msg, 400, 'VALIDATION_ERROR');
    }
    next();
};
// Configure multer for file uploads
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024, // 1MB
    },
});
const mapAttachmentToResponse = (attachment) => {
    return {
        id: attachment.id,
        originalFilename: attachment.originalFilename,
        fileSize: attachment.fileSize,
        fileType: attachment.fileType,
        description: attachment.description,
        createdAt: attachment.createdAt.toISOString(),
        createdBy: attachment.createdBy,
    };
};
const createAttachmentsRoutes = (attachmentsService, userRepository) => {
    const router = (0, express_1.Router)();
    // GET /api/claims/:id/attachments - Get all attachments for a claim
    router.get('/:id/attachments', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), attachments_validator_1.validateClaimId, validate, async (req, res, next) => {
        try {
            const attachments = await attachmentsService.findByClaimId(req.params.id);
            res.json(attachments.map(mapAttachmentToResponse));
        }
        catch (error) {
            next(error);
        }
    });
    // POST /api/claims/:id/attachments - Upload attachment
    router.post('/:id/attachments', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), attachments_validator_1.validateClaimId, validate, upload.single('file'), async (req, res, next) => {
        try {
            if (!req.file) {
                throw new business_exception_1.BusinessException('File is required', 400, 'VALIDATION_ERROR');
            }
            const description = req.body.description;
            const attachment = await attachmentsService.upload(req.params.id, req.file, description);
            res.status(201).json(mapAttachmentToResponse(attachment));
        }
        catch (error) {
            next(error);
        }
    });
    // GET /api/claims/:id/attachments/:attachmentId/download - Download attachment
    router.get('/:id/attachments/:attachmentId/download', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), attachments_validator_1.validateClaimId, attachments_validator_1.validateAttachmentId, validate, async (req, res, next) => {
        try {
            const { stream, filename, mimeType } = await attachmentsService.getFileStream(req.params.attachmentId);
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            stream.pipe(res);
        }
        catch (error) {
            next(error);
        }
    });
    // DELETE /api/claims/:id/attachments/:attachmentId - Delete attachment
    router.delete('/:id/attachments/:attachmentId', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), attachments_validator_1.validateClaimId, attachments_validator_1.validateAttachmentId, validate, async (req, res, next) => {
        try {
            await attachmentsService.delete(req.params.attachmentId);
            res.json({ message: 'Attachment deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    });
    return router;
};
exports.createAttachmentsRoutes = createAttachmentsRoutes;
//# sourceMappingURL=attachments.routes.js.map