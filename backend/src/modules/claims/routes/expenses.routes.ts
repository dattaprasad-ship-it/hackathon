import { Router, Response, NextFunction } from 'express';
import { ExpensesService } from '../services/expenses.service';
import { UserRepository } from '../../authentication/repositories/user.repository';
import { jwtAuthMiddleware, AuthenticatedRequest } from '../../authentication/middleware/jwt-auth.middleware';
import { BusinessException } from '../../../common/exceptions/business.exception';
import {
  validateClaimId,
  validateExpenseId,
  validateCreateExpense,
  validateUpdateExpense,
} from '../validators/expenses.validator';
import { validationResult } from 'express-validator';

const validate = (req: any, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    throw new BusinessException(firstError.msg, 400, 'VALIDATION_ERROR');
  }
  next();
};

const mapExpenseToResponse = (expense: any) => {
  // Handle expenseDate - could be Date object or string
  let expenseDateStr: string;
  if (expense.expenseDate instanceof Date) {
    expenseDateStr = expense.expenseDate.toISOString().split('T')[0];
  } else if (typeof expense.expenseDate === 'string') {
    // If it's already a string, use it directly or parse it
    expenseDateStr = expense.expenseDate.split('T')[0];
  } else {
    // Fallback: try to create a Date and format it
    expenseDateStr = new Date(expense.expenseDate).toISOString().split('T')[0];
  }

  // Handle createdAt and updatedAt - could be Date object or string
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
    id: expense.id,
    expenseType: expense.expenseType
      ? {
          id: expense.expenseType.id,
          name: expense.expenseType.name,
        }
      : null,
    expenseDate: expenseDateStr,
    amount: parseFloat(expense.amount),
    note: expense.note,
    createdAt: formatDate(expense.createdAt),
    updatedAt: formatDate(expense.updatedAt),
  };
};

export const createExpensesRoutes = (
  expensesService: ExpensesService,
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

  // GET /api/claims/:id/expenses - Get all expenses for a claim
  router.get(
    '/:id/expenses',
    jwtAuthMiddleware(userRepository),
    validateClaimId,
    validate,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const expenses = await expensesService.findByClaimId(req.params.id);
        res.json(expenses.map(mapExpenseToResponse));
      } catch (error) {
        next(error);
      }
    }
  );

  // POST /api/claims/:id/expenses - Add expense to claim
  router.post(
    '/:id/expenses',
    jwtAuthMiddleware(userRepository),
    validateClaimId,
    validateCreateExpense,
    validate,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const user = await getUserEntity(req);
        const expense = await expensesService.create(req.params.id, req.body, user);
        res.status(201).json(mapExpenseToResponse(expense));
      } catch (error) {
        next(error);
      }
    }
  );

  // PUT /api/claims/:id/expenses/:expenseId - Update expense
  router.put(
    '/:id/expenses/:expenseId',
    jwtAuthMiddleware(userRepository),
    validateClaimId,
    validateExpenseId,
    validateUpdateExpense,
    validate,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const user = await getUserEntity(req);
        await expensesService.update(req.params.expenseId, req.body, user);
        res.json({ message: 'Expense updated successfully' });
      } catch (error) {
        next(error);
      }
    }
  );

  // DELETE /api/claims/:id/expenses/:expenseId - Delete expense
  router.delete(
    '/:id/expenses/:expenseId',
    jwtAuthMiddleware(userRepository),
    validateClaimId,
    validateExpenseId,
    validate,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const user = await getUserEntity(req);
        await expensesService.delete(req.params.expenseId, user);
        res.json({ message: 'Expense deleted successfully' });
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
};

