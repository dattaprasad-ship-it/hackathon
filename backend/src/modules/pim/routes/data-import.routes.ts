import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { DataImportService } from '../services/data-import.service';
import { jwtAuthMiddleware, AuthenticatedRequest } from '../../authentication/middleware/jwt-auth.middleware';
import { UserRepository } from '../../authentication/repositories/user.repository';
import { logger } from '../../../utils/logger';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

export const createDataImportRoutes = (
  dataImportService: DataImportService,
  userRepository: UserRepository
): Router => {
  const router = Router();

  router.use(jwtAuthMiddleware(userRepository));

  router.post('/upload', upload.single('file'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const result = await dataImportService.importFromCSV(req.file);
      res.status(200).json(result);
    } catch (error) {
      logger.error(`Error importing data: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      next(error);
    }
  });

  return router;
};

