import { ExpenseRepository } from '../repositories/expense.repository';
import { ClaimRepository } from '../repositories/claim.repository';
import { ExpenseTypeRepository } from '../repositories/expense-type.repository';
import { AuditLogService } from './audit-log.service';
import { Expense } from '../entities/expense.entity';
import { User } from '../../authentication/entities/user.entity';
import { BusinessException } from '../../../common/exceptions/business.exception';
import { logger } from '../../../utils/logger';
import { CreateExpenseDto, UpdateExpenseDto } from '../dto/expenses.dto';

export class ExpensesService {
  constructor(
    private readonly expenseRepository: ExpenseRepository,
    private readonly claimRepository: ClaimRepository,
    private readonly expenseTypeRepository: ExpenseTypeRepository,
    private readonly auditLogService?: AuditLogService
  ) {}

  async create(claimId: string, dto: CreateExpenseDto, user?: User): Promise<Expense> {
    // Validate claim exists and is in correct status
    const claim = await this.claimRepository.findByIdWithRelations(claimId);
    if (!claim) {
      throw new BusinessException('Claim not found', 404, 'NOT_FOUND');
    }

    if (claim.status !== 'Initiated') {
      throw new BusinessException('Expenses can only be added to claims in Initiated status', 400, 'INVALID_STATUS');
    }

    // Validate expense type
    const expenseType = await this.expenseTypeRepository.findById(dto.expenseTypeId);
    if (!expenseType) {
      throw new BusinessException('Expense type not found', 404, 'NOT_FOUND');
    }

    // Validate expense date (not in future)
    const expenseDate = new Date(dto.expenseDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expenseDate.setHours(0, 0, 0, 0);

    if (expenseDate > today) {
      throw new BusinessException('Expense date cannot be in the future', 400, 'VALIDATION_ERROR');
    }

    // Validate amount (positive, max 2 decimals)
    if (dto.amount <= 0) {
      throw new BusinessException('Amount must be greater than zero', 400, 'VALIDATION_ERROR');
    }

    const decimalPlaces = (dto.amount.toString().split('.')[1] || '').length;
    if (decimalPlaces > 2) {
      throw new BusinessException('Amount cannot have more than 2 decimal places', 400, 'VALIDATION_ERROR');
    }

    // Create expense
    const expense = await this.expenseRepository.create({
      claim,
      expenseType,
      expenseDate,
      amount: dto.amount,
      note: dto.note,
    } as Partial<Expense>);

    // Recalculate total amount
    await this.recalculateTotalAmount(claimId);

    logger.info(`Expense created: ${expense.id} for claim: ${claimId}`, {
      expenseId: expense.id,
      claimId,
      amount: dto.amount,
    });

    // Create audit log
    if (this.auditLogService && user) {
      try {
        await this.auditLogService.log({
          entityType: 'Expense',
          entityId: expense.id,
          action: 'ADD_EXPENSE',
          user,
          newValues: {
            claimId,
            expenseTypeId: dto.expenseTypeId,
            expenseDate: dto.expenseDate,
            amount: dto.amount,
          },
        });
      } catch (error) {
        logger.error('Failed to create audit log for expense creation', { error, expenseId: expense.id });
      }
    }

    return expense;
  }

  async update(expenseId: string, dto: UpdateExpenseDto, user?: User): Promise<void> {
    // Validate expense exists
    const expense = await this.expenseRepository.findById(expenseId);
    if (!expense) {
      throw new BusinessException('Expense not found', 404, 'NOT_FOUND');
    }

    if (!expense.claim || !expense.claim.id) {
      throw new BusinessException('Expense claim not found', 404, 'NOT_FOUND');
    }

    const claimId = expense.claim.id;

    // Validate claim status
    const claim = await this.claimRepository.findByIdWithRelations(claimId);
    if (!claim) {
      throw new BusinessException('Claim not found', 404, 'NOT_FOUND');
    }

    if (claim.status !== 'Initiated') {
      throw new BusinessException('Expenses can only be updated for claims in Initiated status', 400, 'INVALID_STATUS');
    }

    // Validate expense type if provided
    if (dto.expenseTypeId) {
      const expenseType = await this.expenseTypeRepository.findById(dto.expenseTypeId);
      if (!expenseType) {
        throw new BusinessException('Expense type not found', 404, 'NOT_FOUND');
      }
      (expense as any).expenseType = expenseType;
    }

    // Validate expense date if provided
    if (dto.expenseDate) {
      const expenseDate = new Date(dto.expenseDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expenseDate.setHours(0, 0, 0, 0);

      if (expenseDate > today) {
        throw new BusinessException('Expense date cannot be in the future', 400, 'VALIDATION_ERROR');
      }
      (expense as any).expenseDate = expenseDate;
    }

    // Validate amount if provided
    if (dto.amount !== undefined) {
      if (dto.amount <= 0) {
        throw new BusinessException('Amount must be greater than zero', 400, 'VALIDATION_ERROR');
      }

      const decimalPlaces = (dto.amount.toString().split('.')[1] || '').length;
      if (decimalPlaces > 2) {
        throw new BusinessException('Amount cannot have more than 2 decimal places', 400, 'VALIDATION_ERROR');
      }
      (expense as any).amount = dto.amount;
    }

    if (dto.note !== undefined) {
      (expense as any).note = dto.note;
    }

    // Update expense
    await this.expenseRepository.update(expenseId, expense);

    // Recalculate total amount
    await this.recalculateTotalAmount(claimId);

    logger.info(`Expense updated: ${expenseId}`, { expenseId, claimId });

    // Create audit log
    if (this.auditLogService && user) {
      try {
        await this.auditLogService.log({
          entityType: 'Expense',
          entityId: expenseId,
          action: 'UPDATE',
          user,
          newValues: dto,
        });
      } catch (error) {
        logger.error('Failed to create audit log for expense update', { error, expenseId });
      }
    }
  }

  async delete(expenseId: string, user?: User): Promise<void> {
    // Validate expense exists
    const expense = await this.expenseRepository.findById(expenseId);
    if (!expense) {
      throw new BusinessException('Expense not found', 404, 'NOT_FOUND');
    }

    if (!expense.claim || !expense.claim.id) {
      throw new BusinessException('Expense claim not found', 404, 'NOT_FOUND');
    }

    const claimId = expense.claim.id;

    // Validate claim status
    const claim = await this.claimRepository.findByIdWithRelations(claimId);
    if (!claim) {
      throw new BusinessException('Claim not found', 404, 'NOT_FOUND');
    }

    if (claim.status !== 'Initiated') {
      throw new BusinessException('Expenses can only be deleted from claims in Initiated status', 400, 'INVALID_STATUS');
    }

    // Delete expense
    await this.expenseRepository.delete(expenseId);

    // Recalculate total amount
    await this.recalculateTotalAmount(claimId);

    logger.info(`Expense deleted: ${expenseId}`, { expenseId, claimId });

    // Create audit log
    if (this.auditLogService && user) {
      try {
        await this.auditLogService.log({
          entityType: 'Expense',
          entityId: expenseId,
          action: 'DELETE_EXPENSE',
          user,
        });
      } catch (error) {
        logger.error('Failed to create audit log for expense deletion', { error, expenseId });
      }
    }
  }

  async findByClaimId(claimId: string): Promise<Expense[]> {
    return this.expenseRepository.findByClaimId(claimId);
  }

  private async recalculateTotalAmount(claimId: string): Promise<void> {
    const totalAmount = await this.expenseRepository.calculateTotalAmount(claimId);
    await this.claimRepository.update(claimId, {
      totalAmount,
    } as Partial<any>);
  }
}

