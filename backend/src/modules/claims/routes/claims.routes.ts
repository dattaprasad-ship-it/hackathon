import { Router, Response, NextFunction, Request } from 'express';
import { ClaimsService } from '../services/claims.service';
import { UserRepository } from '../../authentication/repositories/user.repository';
import { jwtAuthMiddleware, AuthenticatedRequest } from '../../authentication/middleware/jwt-auth.middleware';
import {
  validateCreateClaim,
  validateUpdateClaim,
  validateClaimSearch,
  validateClaimId,
  validateRejectClaim,
} from '../validators/claims.validator';
import { validationResult } from 'express-validator';
import { BusinessException } from '../../../common/exceptions/business.exception';

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    throw new BusinessException(firstError.msg, 400, 'VALIDATION_ERROR');
  }
  next();
};

import { UserRole } from '../../../constants/enums/user-role.enum';

const mapClaimToResponse = (claim: any) => {
  // Helper function to format dates (handles both Date objects and strings)
  const formatDate = (date: any): string | undefined => {
    if (!date) return undefined;
    if (date instanceof Date) {
      return date.toISOString();
    } else if (typeof date === 'string') {
      return date;
    } else {
      return new Date(date).toISOString();
    }
  };

  return {
    id: claim.id,
    referenceId: claim.referenceId,
    employee: {
      id: claim.employee.id,
      employeeId: claim.employee.employeeId,
      firstName: claim.employee.firstName,
      lastName: claim.employee.lastName,
    },
    eventType: {
      id: claim.eventType.id,
      name: claim.eventType.name,
    },
    currency: {
      id: claim.currency.id,
      code: claim.currency.code,
      symbol: claim.currency.symbol,
    },
    status: claim.status,
    remarks: claim.remarks,
    totalAmount: parseFloat(claim.totalAmount),
    submittedDate: formatDate(claim.submittedDate),
    approvedDate: formatDate(claim.approvedDate),
    rejectedDate: formatDate(claim.rejectedDate),
    rejectionReason: claim.rejectionReason,
    approver: claim.approver
      ? {
          id: claim.approver.id,
          username: claim.approver.username,
          displayName: claim.approver.displayName,
        }
      : undefined,
    expenses: claim.expenses
      ? claim.expenses.map((exp: any) => {
          // Handle expenseDate - could be Date object or string
          let expenseDateStr: string;
          if (exp.expenseDate instanceof Date) {
            expenseDateStr = exp.expenseDate.toISOString().split('T')[0];
          } else if (typeof exp.expenseDate === 'string') {
            expenseDateStr = exp.expenseDate.split('T')[0];
          } else {
            expenseDateStr = new Date(exp.expenseDate).toISOString().split('T')[0];
          }

          return {
            id: exp.id,
            expenseType: {
              id: exp.expenseType.id,
              name: exp.expenseType.name,
            },
            expenseDate: expenseDateStr,
            amount: parseFloat(exp.amount),
            note: exp.note,
          };
        })
      : undefined,
    attachments: claim.attachments
      ? claim.attachments.map((att: any) => ({
          id: att.id,
          originalFilename: att.originalFilename,
          fileSize: att.fileSize,
          fileType: att.fileType,
          description: att.description,
          createdAt: att.createdAt.toISOString(),
        }))
      : undefined,
    createdAt: claim.createdAt.toISOString(),
    updatedAt: claim.updatedAt.toISOString(),
  };
};

export const createClaimsRoutes = (
  claimsService: ClaimsService,
  userRepository: UserRepository,
  configService?: any // ClaimsConfigService - optional to avoid circular dependency
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

  // GET /api/claims - Search and list claims
  router.get(
    '/',
    jwtAuthMiddleware(userRepository),
    validateClaimSearch,
    validate,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const user = await getUserEntity(req);
        const filters = req.query as any;

        // Employees can only see their own claims
        if (user.role === UserRole.EMPLOYEE) {
          // This would require employeeId from user - for now, filter by employee name if provided
          // In a real implementation, you'd get employeeId from user.employee relationship
        }

        const result = await claimsService.search(filters);
        const response = {
          ...result,
          claims: result.claims.map(mapClaimToResponse),
        };

        res.json(response);
      } catch (error) {
        next(error);
      }
    }
  );

  // POST /api/claims - Create new claim
  router.post(
    '/',
    jwtAuthMiddleware(userRepository),
    validateCreateClaim,
    validate,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const user = await getUserEntity(req);
        const claim = await claimsService.create(req.body, user);
        res.status(201).json(mapClaimToResponse(claim));
      } catch (error) {
        next(error);
      }
    }
  );

  // GET /api/claims/config - Get configuration data (must be before /:id route)
  if (configService) {
    router.get(
      '/config',
      jwtAuthMiddleware(userRepository),
      async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
          const config = await configService.getConfig();
          res.json(config);
        } catch (error) {
          next(error);
        }
      }
    );
  }

  // GET /api/claims/:id - Get claim details
  router.get(
    '/:id',
    jwtAuthMiddleware(userRepository),
    validateClaimId,
    validate,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const user = await getUserEntity(req);
        const claim = await claimsService.findById(req.params.id);

        // Check access control
        if (user.role === UserRole.EMPLOYEE) {
          // Employees can only view their own claims
          // This would require employeeId from user - for now, allow if they created it
          if (claim.createdBy !== user.username) {
            throw new BusinessException('Access denied', 403, 'FORBIDDEN');
          }
        }

        res.json(mapClaimToResponse(claim));
      } catch (error) {
        next(error);
      }
    }
  );

  // PUT /api/claims/:id - Update claim
  router.put(
    '/:id',
    jwtAuthMiddleware(userRepository),
    validateClaimId,
    validateUpdateClaim,
    validate,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const user = await getUserEntity(req);
        const claim = await claimsService.update(req.params.id, req.body, user);
        res.json(mapClaimToResponse(claim));
      } catch (error) {
        next(error);
      }
    }
  );

  // POST /api/claims/:id/submit - Submit claim
  router.post(
    '/:id/submit',
    jwtAuthMiddleware(userRepository),
    validateClaimId,
    validate,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const user = await getUserEntity(req);
        await claimsService.submit(req.params.id, user);
        res.json({ message: 'Claim submitted successfully' });
      } catch (error) {
        next(error);
      }
    }
  );

  // POST /api/claims/:id/approve - Approve claim
  router.post(
    '/:id/approve',
    jwtAuthMiddleware(userRepository),
    validateClaimId,
    validate,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const user = await getUserEntity(req);
        // Only Admin can approve
        if (user.role !== UserRole.ADMIN) {
          throw new BusinessException('Only administrators can approve claims', 403, 'FORBIDDEN');
        }
        await claimsService.approve(req.params.id, user);
        res.json({ message: 'Claim approved successfully' });
      } catch (error) {
        next(error);
      }
    }
  );

  // POST /api/claims/:id/reject - Reject claim
  router.post(
    '/:id/reject',
    jwtAuthMiddleware(userRepository),
    validateClaimId,
    validateRejectClaim,
    validate,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const user = await getUserEntity(req);
        // Only Admin can reject
        if (user.role !== UserRole.ADMIN) {
          throw new BusinessException('Only administrators can reject claims', 403, 'FORBIDDEN');
        }
        await claimsService.reject(req.params.id, req.body, user);
        res.json({ message: 'Claim rejected successfully' });
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
};

