import { ExpensesService } from '../expenses.service';
import { ExpenseRepository } from '../../repositories/expense.repository';
import { ClaimRepository } from '../../repositories/claim.repository';
import { ExpenseTypeRepository } from '../../repositories/expense-type.repository';
import { Expense } from '../../entities/expense.entity';
import { Claim } from '../../entities/claim.entity';
import { ExpenseType } from '../../entities/expense-type.entity';
import { BusinessException } from '../../../../common/exceptions/business.exception';
import { when } from 'jest-when';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let mockExpenseRepository: jest.Mocked<ExpenseRepository>;
  let mockClaimRepository: jest.Mocked<ClaimRepository>;
  let mockExpenseTypeRepository: jest.Mocked<ExpenseTypeRepository>;

  beforeEach(() => {
    mockExpenseRepository = {
      findById: jest.fn(),
      findByClaimId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      calculateTotalAmount: jest.fn(),
    } as any;

    mockClaimRepository = {
      findByIdWithRelations: jest.fn(),
      update: jest.fn(),
    } as any;

    mockExpenseTypeRepository = {
      findById: jest.fn(),
    } as any;

    service = new ExpensesService(
      mockExpenseRepository,
      mockClaimRepository,
      mockExpenseTypeRepository
    );
  });

  describe('create', () => {
    it('should create an expense for a claim', async () => {
      const claimId = 'claim-1';
      const dto = {
        expenseTypeId: 'exp-type-1',
        expenseDate: '2025-01-15',
        amount: 100.50,
        note: 'Taxi fare',
      };

      const mockClaim = {
        id: claimId,
        status: 'Initiated',
      } as Claim;

      const mockExpenseType = {
        id: 'exp-type-1',
        name: 'Travel Expenses',
      } as ExpenseType;

      const mockExpense = {
        id: 'exp-1',
        expenseDate: new Date('2025-01-15'),
        amount: 100.50,
        note: 'Taxi fare',
        expenseType: mockExpenseType,
      } as Expense;

      when(mockClaimRepository.findByIdWithRelations).calledWith(claimId).mockResolvedValue(mockClaim);
      when(mockExpenseTypeRepository.findById).calledWith('exp-type-1').mockResolvedValue(mockExpenseType);
      when(mockExpenseRepository.create).calledWith(expect.objectContaining({
        claim: mockClaim,
        expenseType: mockExpenseType,
        expenseDate: expect.any(Date),
        amount: 100.50,
        note: 'Taxi fare',
      })).mockResolvedValue(mockExpense);
      when(mockExpenseRepository.calculateTotalAmount).calledWith(claimId).mockResolvedValue(100.50);
      when(mockClaimRepository.update).calledWith(claimId, expect.objectContaining({
        totalAmount: 100.50,
      })).mockResolvedValue(undefined);

      const result = await service.create(claimId, dto);

      expect(result).toEqual(mockExpense);
      expect(mockExpenseRepository.calculateTotalAmount).toHaveBeenCalledWith(claimId);
      expect(mockClaimRepository.update).toHaveBeenCalled();
    });

    it('should throw error if claim not found', async () => {
      when(mockClaimRepository.findByIdWithRelations).calledWith('invalid-id').mockResolvedValue(null);

      await expect(service.create('invalid-id', {
        expenseTypeId: 'exp-type-1',
        expenseDate: '2025-01-15',
        amount: 100,
      })).rejects.toThrow(BusinessException);
    });

    it('should throw error if claim is not in Initiated status', async () => {
      const mockClaim = {
        id: 'claim-1',
        status: 'Submitted',
      } as Claim;

      when(mockClaimRepository.findByIdWithRelations).calledWith('claim-1').mockResolvedValue(mockClaim);

      await expect(service.create('claim-1', {
        expenseTypeId: 'exp-type-1',
        expenseDate: '2025-01-15',
        amount: 100,
      })).rejects.toThrow(BusinessException);
      await expect(service.create('claim-1', {
        expenseTypeId: 'exp-type-1',
        expenseDate: '2025-01-15',
        amount: 100,
      })).rejects.toThrow('Expenses can only be added to claims in Initiated status');
    });

    it('should throw error if expense date is in the future', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const mockClaim = {
        id: 'claim-1',
        status: 'Initiated',
      } as Claim;

      when(mockClaimRepository.findByIdWithRelations).calledWith('claim-1').mockResolvedValue(mockClaim);

      await expect(service.create('claim-1', {
        expenseTypeId: 'exp-type-1',
        expenseDate: tomorrowStr,
        amount: 100,
      })).rejects.toThrow(BusinessException);
      await expect(service.create('claim-1', {
        expenseTypeId: 'exp-type-1',
        expenseDate: tomorrowStr,
        amount: 100,
      })).rejects.toThrow('Expense date cannot be in the future');
    });

    it('should throw error if amount is not positive', async () => {
      const mockClaim = {
        id: 'claim-1',
        status: 'Initiated',
      } as Claim;

      when(mockClaimRepository.findByIdWithRelations).calledWith('claim-1').mockResolvedValue(mockClaim);

      await expect(service.create('claim-1', {
        expenseTypeId: 'exp-type-1',
        expenseDate: '2025-01-15',
        amount: -10,
      })).rejects.toThrow(BusinessException);
      await expect(service.create('claim-1', {
        expenseTypeId: 'exp-type-1',
        expenseDate: '2025-01-15',
        amount: 0,
      })).rejects.toThrow('Amount must be greater than zero');
    });

    it('should throw error if amount has more than 2 decimal places', async () => {
      const mockClaim = {
        id: 'claim-1',
        status: 'Initiated',
      } as Claim;

      when(mockClaimRepository.findByIdWithRelations).calledWith('claim-1').mockResolvedValue(mockClaim);

      await expect(service.create('claim-1', {
        expenseTypeId: 'exp-type-1',
        expenseDate: '2025-01-15',
        amount: 100.123,
      })).rejects.toThrow(BusinessException);
      await expect(service.create('claim-1', {
        expenseTypeId: 'exp-type-1',
        expenseDate: '2025-01-15',
        amount: 100.123,
      })).rejects.toThrow('Amount cannot have more than 2 decimal places');
    });
  });

  describe('update', () => {
    it('should update an expense', async () => {
      const expenseId = 'exp-1';
      const claimId = 'claim-1';
      const dto = {
        amount: 150.75,
      };

      const mockExpense = {
        id: expenseId,
        claim: { id: claimId, status: 'Initiated' } as Claim,
        amount: 100.50,
      } as Expense;

      const mockClaim = {
        id: claimId,
        status: 'Initiated',
      } as Claim;

      when(mockExpenseRepository.findById).calledWith(expenseId).mockResolvedValue(mockExpense);
      when(mockClaimRepository.findByIdWithRelations).calledWith(claimId).mockResolvedValue(mockClaim);
      when(mockExpenseRepository.update).calledWith(expenseId, expect.objectContaining({
        amount: 150.75,
      })).mockResolvedValue(undefined);
      when(mockExpenseRepository.calculateTotalAmount).calledWith(claimId).mockResolvedValue(150.75);
      when(mockClaimRepository.update).calledWith(claimId, expect.objectContaining({
        totalAmount: 150.75,
      })).mockResolvedValue(undefined);

      await service.update(expenseId, dto);

      expect(mockExpenseRepository.update).toHaveBeenCalled();
      expect(mockExpenseRepository.calculateTotalAmount).toHaveBeenCalledWith(claimId);
    });
  });

  describe('delete', () => {
    it('should delete an expense and recalculate total', async () => {
      const expenseId = 'exp-1';
      const claimId = 'claim-1';

      const mockExpense = {
        id: expenseId,
        claim: { id: claimId, status: 'Initiated' } as Claim,
      } as Expense;

      when(mockExpenseRepository.findById).calledWith(expenseId).mockResolvedValue(mockExpense);
      when(mockExpenseRepository.delete).calledWith(expenseId).mockResolvedValue(undefined);
      when(mockExpenseRepository.calculateTotalAmount).calledWith(claimId).mockResolvedValue(0);
      when(mockClaimRepository.update).calledWith(claimId, expect.objectContaining({
        totalAmount: 0,
      })).mockResolvedValue(undefined);

      await service.delete(expenseId);

      expect(mockExpenseRepository.delete).toHaveBeenCalledWith(expenseId);
      expect(mockExpenseRepository.calculateTotalAmount).toHaveBeenCalledWith(claimId);
    });
  });
});

