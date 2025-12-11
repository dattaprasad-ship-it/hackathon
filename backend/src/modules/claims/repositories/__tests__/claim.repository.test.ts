import { Repository } from 'typeorm';
import { ClaimRepository } from '../claim.repository';
import { Claim } from '../../entities/claim.entity';
import { when } from 'jest-when';

describe('ClaimRepository', () => {
  let repository: ClaimRepository;
  let mockRepository: jest.Mocked<Repository<Claim>>;

  beforeEach(() => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
    } as any;

    repository = new ClaimRepository(mockRepository);
  });

  describe('findByReferenceId', () => {
    it('should find claim by reference ID', async () => {
      const mockClaim = {
        id: '1',
        referenceId: '202501150000001',
        status: 'Initiated',
      } as Claim;

      when(mockRepository.findOne).calledWith({
        where: { referenceId: '202501150000001' },
        relations: ['employee', 'eventType', 'currency', 'expenses', 'attachments', 'approver'],
      }).mockResolvedValue(mockClaim);

      const result = await repository.findByReferenceId('202501150000001');

      expect(result).toEqual(mockClaim);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { referenceId: '202501150000001' },
        relations: ['employee', 'eventType', 'currency', 'expenses', 'attachments', 'approver'],
      });
    });
  });

  describe('findByEmployeeId', () => {
    it('should find all claims for an employee', async () => {
      const mockClaims = [
        { id: '1', referenceId: '202501150000001', employee: { id: 'emp-1' } } as Claim,
        { id: '2', referenceId: '202501150000002', employee: { id: 'emp-1' } } as Claim,
      ];

      when(mockRepository.find).calledWith({
        where: { employee: { id: 'emp-1' } },
        relations: ['eventType', 'currency'],
        order: { createdAt: 'DESC' },
      }).mockResolvedValue(mockClaims);

      const result = await repository.findByEmployeeId('emp-1');

      expect(result).toEqual(mockClaims);
    });
  });

  describe('findWithFilters', () => {
    it('should find claims with all filters applied', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn(),
      };

      const mockClaims = [
        { id: '1', referenceId: '202501150000001' } as Claim,
        { id: '2', referenceId: '202501150000002' } as Claim,
      ];

      when(mockRepository.createQueryBuilder).calledWith('claim').mockReturnValue(mockQueryBuilder as any);
      when(mockQueryBuilder.getManyAndCount).calledWith().mockResolvedValue([mockClaims, 2]);

      const filters = {
        employeeName: 'John Doe',
        referenceId: '20250115',
        eventTypeId: 'event-1',
        status: 'Submitted' as Claim['status'],
        fromDate: new Date('2025-01-01'),
        toDate: new Date('2025-01-31'),
        page: 1,
        limit: 10,
        sortBy: 'submittedDate',
        sortOrder: 'DESC' as const,
      };

      const result = await repository.findWithFilters(filters);

      expect(result.claims).toEqual(mockClaims);
      expect(result.total).toBe(2);
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalled();
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should handle filters with no results', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn(),
      };

      when(mockRepository.createQueryBuilder).calledWith('claim').mockReturnValue(mockQueryBuilder as any);
      when(mockQueryBuilder.getManyAndCount).calledWith().mockResolvedValue([[], 0]);

      const filters = {
        employeeName: 'Non Existent',
        page: 1,
        limit: 10,
      };

      const result = await repository.findWithFilters(filters);

      expect(result.claims).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('findByIdWithRelations', () => {
    it('should find claim by ID with all relations', async () => {
      const mockClaim = {
        id: 'claim-1',
        referenceId: '202501150000001',
        expenses: [],
        attachments: [],
      } as Claim;

      when(mockRepository.findOne).calledWith({
        where: { id: 'claim-1' },
        relations: ['employee', 'eventType', 'currency', 'expenses', 'expenses.expenseType', 'attachments', 'approver'],
      }).mockResolvedValue(mockClaim);

      const result = await repository.findByIdWithRelations('claim-1');

      expect(result).toEqual(mockClaim);
    });
  });
});

