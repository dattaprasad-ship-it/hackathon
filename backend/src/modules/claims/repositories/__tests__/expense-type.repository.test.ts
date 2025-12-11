import { Repository } from 'typeorm';
import { ExpenseTypeRepository } from '../expense-type.repository';
import { ExpenseType } from '../../entities/expense-type.entity';
import { when } from 'jest-when';

describe('ExpenseTypeRepository', () => {
  let repository: ExpenseTypeRepository;
  let mockRepository: jest.Mocked<Repository<ExpenseType>>;

  beforeEach(() => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
    } as any;

    repository = new ExpenseTypeRepository(mockRepository);
  });

  describe('findActive', () => {
    it('should find all active expense types', async () => {
      const mockExpenseTypes = [
        { id: '1', name: 'Travel Expenses', isActive: true } as ExpenseType,
        { id: '2', name: 'Accommodation', isActive: true } as ExpenseType,
      ];

      when(mockRepository.find).calledWith({
        where: { isActive: true },
        order: { name: 'ASC' },
      }).mockResolvedValue(mockExpenseTypes);

      const result = await repository.findActive();

      expect(result).toEqual(mockExpenseTypes);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        order: { name: 'ASC' },
      });
    });
  });

  describe('findByName', () => {
    it('should find expense type by name', async () => {
      const mockExpenseType = {
        id: '1',
        name: 'Travel Expenses',
        isActive: true,
      } as ExpenseType;

      when(mockRepository.findOne).calledWith({
        where: { name: 'Travel Expenses' },
      }).mockResolvedValue(mockExpenseType);

      const result = await repository.findByName('Travel Expenses');

      expect(result).toEqual(mockExpenseType);
    });
  });
});

