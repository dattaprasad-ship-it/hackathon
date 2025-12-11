import { Router, Response, NextFunction } from 'express';
import { AttachmentsService } from '../services/attachments.service';
import { UserRepository } from '../../authentication/repositories/user.repository';
import { jwtAuthMiddleware, AuthenticatedRequest } from '../../authentication/middleware/jwt-auth.middleware';
import { BusinessException } from '../../../common/exceptions/business.exception';
import {
  validateClaimId,
  validateAttachmentId,
} from '../validators/attachments.validator';
import { validationResult } from 'express-validator';
import multer from 'multer';

const validate = (req: any, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    throw new BusinessException(firstError.msg, 400, 'VALIDATION_ERROR');
  }
  next();
};

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024, // 1MB
  },
});

const mapAttachmentToResponse = (attachment: any) => {
  // Handle createdAt - could be Date object or string
  const formatDate = (date: any): string => {
    if (date instanceof Date) {
      return date.toISOString();
    } else if (typeof date === 'string') {
      return date;
    } else {
      return new Date(date).toISOString();
    }
  };

  return {
    id: attachment.id,
    originalFilename: attachment.originalFilename,
    fileSize: attachment.fileSize,
    fileType: attachment.fileType,
    description: attachment.description,
    createdAt: formatDate(attachment.createdAt),
    createdBy: attachment.createdBy,
  };
};

export const createAttachmentsRoutes = (
  attachmentsService: AttachmentsService,
  userRepository: UserRepository
): Router => {
  const router = Router();

  // Helper to get user entity from request
  const getUserEntity = async (req: AuthenticatedRequest) => {
    if (!req.user) {
      throw new BusinessException('User not authenticated', 401, 'UNAUTHORIZED');
    }
    const user = await userRepository.findById(req.user.id);
    if (!user) {
      throw new BusinessException('User not found', 404, 'NOT_FOUND');
    }
    return user;
  };

  // GET /api/claims/:id/attachments - Get all attachments for a claim
  router.get(
    '/:id/attachments',
    jwtAuthMiddleware(userRepository),
    validateClaimId,
    validate,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const attachments = await attachmentsService.findByClaimId(req.params.id);
        res.json(attachments.map(mapAttachmentToResponse));
      } catch (error) {
        next(error);
      }
    }
  );

  // POST /api/claims/:id/attachments - Upload attachment
  router.post(
    '/:id/attachments',
    jwtAuthMiddleware(userRepository),
    validateClaimId,
    validate,
    upload.single('file'),
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        if (!req.file) {
          throw new BusinessException('File is required', 400, 'VALIDATION_ERROR');
        }

        const user = await getUserEntity(req);
        const description = req.body.description;
        const attachment = await attachmentsService.upload(
          req.params.id,
          req.file,
          description,
          user
        );
        res.status(201).json(mapAttachmentToResponse(attachment));
      } catch (error) {
        next(error);
      }
    }
  );

  // GET /api/claims/:id/attachments/:attachmentId/download - Download attachment
  router.get(
    '/:id/attachments/:attachmentId/download',
    jwtAuthMiddleware(userRepository),
    validateClaimId,
    validateAttachmentId,
    validate,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const { stream, filename, mimeType } = await attachmentsService.getFileStream(
          req.params.attachmentId
        );

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        stream.pipe(res);
      } catch (error) {
        next(error);
      }
    }
  );

  // DELETE /api/claims/:id/attachments/:attachmentId - Delete attachment
  router.delete(
    '/:id/attachments/:attachmentId',
    jwtAuthMiddleware(userRepository),
    validateClaimId,
    validateAttachmentId,
    validate,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const user = await getUserEntity(req);
        await attachmentsService.delete(req.params.attachmentId, user);
        res.json({ message: 'Attachment deleted successfully' });
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
};

