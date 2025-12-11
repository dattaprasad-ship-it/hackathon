import { Repository } from 'typeorm';
import { ExpenseRepository } from '../expense.repository';
import { Expense } from '../../entities/expense.entity';
import { Claim } from '../../entities/claim.entity';
import { when } from 'jest-when';

describe('ExpenseRepository', () => {
  let repository: ExpenseRepository;
  let mockRepository: jest.Mocked<Repository<Expense>>;

  beforeEach(() => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
    } as any;

    repository = new ExpenseRepository(mockRepository);
  });

  describe('findByClaimId', () => {
    it('should find all expenses for a claim', async () => {
      const mockExpenses = [
        { id: '1', amount: 100.50, claim: { id: 'claim-1' } } as Expense,
        { id: '2', amount: 50.25, claim: { id: 'claim-1' } } as Expense,
      ];

      when(mockRepository.find).calledWith({
        where: { claim: { id: 'claim-1' } },
        relations: ['expenseType'],
        order: { expenseDate: 'DESC' },
      }).mockResolvedValue(mockExpenses);

      const result = await repository.findByClaimId('claim-1');

      expect(result).toEqual(mockExpenses);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { claim: { id: 'claim-1' } },
        relations: ['expenseType'],
        order: { expenseDate: 'DESC' },
      });
    });
  });

  describe('calculateTotalAmount', () => {
    it('should calculate total amount for a claim', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn(),
      };

      when(mockRepository.createQueryBuilder).calledWith('expense').mockReturnValue(mockQueryBuilder as any);
      when(mockQueryBuilder.getRawOne).calledWith().mockResolvedValue({ total: '150.75' });

      const result = await repository.calculateTotalAmount('claim-1');

      expect(result).toBe(150.75);
      expect(mockQueryBuilder.select).toHaveBeenCalledWith('SUM(expense.amount)', 'total');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('expense.claim.id = :claimId', { claimId: 'claim-1' });
    });

    it('should return 0 when no expenses exist', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn(),
      };

      when(mockRepository.createQueryBuilder).calledWith('expense').mockReturnValue(mockQueryBuilder as any);
      when(mockQueryBuilder.getRawOne).calledWith().mockResolvedValue({ total: null });

      const result = await repository.calculateTotalAmount('claim-1');

      expect(result).toBe(0);
    });
  });
});

