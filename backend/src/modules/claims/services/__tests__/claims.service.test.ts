import { ClaimsService } from '../claims.service';
import { ClaimRepository } from '../../repositories/claim.repository';
import { EmployeeRepository } from '../../../pim/repositories/employee.repository';
import { EventTypeRepository } from '../../repositories/event-type.repository';
import { CurrencyRepository } from '../../repositories/currency.repository';
import { ExpenseRepository } from '../../repositories/expense.repository';
import { Claim } from '../../entities/claim.entity';
import { Employee } from '../../../pim/entities/employee.entity';
import { EventType } from '../../entities/event-type.entity';
import { Currency } from '../../entities/currency.entity';
import { User } from '../../../authentication/entities/user.entity';
import { BusinessException } from '../../../../common/exceptions/business.exception';
import { when } from 'jest-when';
import { ReferenceIdUtil } from '../../utils/reference-id.util';

jest.mock('../../utils/reference-id.util');

describe('ClaimsService', () => {
  let service: ClaimsService;
  let mockClaimRepository: jest.Mocked<ClaimRepository>;
  let mockEmployeeRepository: jest.Mocked<EmployeeRepository>;
  let mockEventTypeRepository: jest.Mocked<EventTypeRepository>;
  let mockCurrencyRepository: jest.Mocked<CurrencyRepository>;
  let mockExpenseRepository: jest.Mocked<ExpenseRepository>;

  const mockUser: User = {
    id: 'user-1',
    username: 'admin',
    role: 'Admin',
    accountStatus: 'Active',
  } as User;

  beforeEach(() => {
    mockClaimRepository = {
      findById: jest.fn(),
      findByIdWithRelations: jest.fn(),
      findByReferenceId: jest.fn(),
      findByEmployeeId: jest.fn(),
      findWithFilters: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    } as any;

    mockEmployeeRepository = {
      findById: jest.fn(),
    } as any;

    mockEventTypeRepository = {
      findById: jest.fn(),
    } as any;

    mockCurrencyRepository = {
      findById: jest.fn(),
    } as any;

    mockExpenseRepository = {
      findByClaimId: jest.fn(),
      calculateTotalAmount: jest.fn(),
    } as any;

    service = new ClaimsService(
      mockClaimRepository,
      mockEmployeeRepository,
      mockEventTypeRepository,
      mockCurrencyRepository,
      mockExpenseRepository
    );
  });

  describe('create', () => {
    it('should create a new claim with generated reference ID', async () => {
      const dto = {
        employeeId: 'emp-1',
        eventTypeId: 'event-1',
        currencyId: 'curr-1',
        remarks: 'Test claim',
      };

      const mockEmployee = { id: 'emp-1', firstName: 'John', lastName: 'Doe' } as Employee;
      const mockEventType = { id: 'event-1', name: 'Travel Allowance' } as EventType;
      const mockCurrency = { id: 'curr-1', code: 'USD', symbol: '$' } as Currency;
      const mockClaim = {
        id: 'claim-1',
        referenceId: '202501150000001',
        employee: mockEmployee,
        eventType: mockEventType,
        currency: mockCurrency,
        status: 'Initiated',
        totalAmount: 0,
      } as Claim;

      when(mockEmployeeRepository.findById).calledWith('emp-1').mockResolvedValue(mockEmployee);
      when(mockEventTypeRepository.findById).calledWith('event-1').mockResolvedValue(mockEventType);
      when(mockCurrencyRepository.findById).calledWith('curr-1').mockResolvedValue(mockCurrency);
      (ReferenceIdUtil.generateReferenceId as jest.Mock).mockResolvedValue('202501150000001');
      when(mockClaimRepository.create).calledWith(expect.objectContaining({
        employee: mockEmployee,
        eventType: mockEventType,
        currency: mockCurrency,
        status: 'Initiated',
        totalAmount: 0,
        remarks: 'Test claim',
      })).mockResolvedValue(mockClaim);

      const result = await service.create(dto, mockUser);

      expect(result).toEqual(mockClaim);
      expect(ReferenceIdUtil.generateReferenceId).toHaveBeenCalledWith(mockClaimRepository);
    });

    it('should throw error if employee not found', async () => {
      const dto = {
        employeeId: 'invalid-emp',
        eventTypeId: 'event-1',
        currencyId: 'curr-1',
      };

      when(mockEmployeeRepository.findById).calledWith('invalid-emp').mockResolvedValue(null);

      await expect(service.create(dto, mockUser)).rejects.toThrow(BusinessException);
      await expect(service.create(dto, mockUser)).rejects.toThrow('Employee not found');
    });

    it('should throw error if event type not found', async () => {
      const dto = {
        employeeId: 'emp-1',
        eventTypeId: 'invalid-event',
        currencyId: 'curr-1',
      };

      const mockEmployee = { id: 'emp-1' } as Employee;

      when(mockEmployeeRepository.findById).calledWith('emp-1').mockResolvedValue(mockEmployee);
      when(mockEventTypeRepository.findById).calledWith('invalid-event').mockResolvedValue(null);

      await expect(service.create(dto, mockUser)).rejects.toThrow(BusinessException);
      await expect(service.create(dto, mockUser)).rejects.toThrow('Event type not found');
    });

    it('should throw error if currency not found', async () => {
      const dto = {
        employeeId: 'emp-1',
        eventTypeId: 'event-1',
        currencyId: 'invalid-curr',
      };

      const mockEmployee = { id: 'emp-1' } as Employee;
      const mockEventType = { id: 'event-1' } as EventType;

      when(mockEmployeeRepository.findById).calledWith('emp-1').mockResolvedValue(mockEmployee);
      when(mockEventTypeRepository.findById).calledWith('event-1').mockResolvedValue(mockEventType);
      when(mockCurrencyRepository.findById).calledWith('invalid-curr').mockResolvedValue(null);

      await expect(service.create(dto, mockUser)).rejects.toThrow(BusinessException);
      await expect(service.create(dto, mockUser)).rejects.toThrow('Currency not found');
    });
  });

  describe('search', () => {
    it('should search claims with filters', async () => {
      const filters = {
        employeeName: 'John',
        status: 'Submitted' as Claim['status'],
        page: 1,
        limit: 10,
      };

      const mockClaims = [
        { id: 'claim-1', referenceId: '202501150000001' } as Claim,
        { id: 'claim-2', referenceId: '202501150000002' } as Claim,
      ];

      when(mockClaimRepository.findWithFilters).calledWith(expect.objectContaining(filters)).mockResolvedValue({
        claims: mockClaims,
        total: 2,
      });

      const result = await service.search(filters);

      expect(result.claims).toEqual(mockClaims);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });
  });

  describe('findById', () => {
    it('should find claim by ID with relations', async () => {
      const mockClaim = {
        id: 'claim-1',
        referenceId: '202501150000001',
        employee: { id: 'emp-1' } as Employee,
      } as Claim;

      when(mockClaimRepository.findByIdWithRelations).calledWith('claim-1').mockResolvedValue(mockClaim);

      const result = await service.findById('claim-1');

      expect(result).toEqual(mockClaim);
    });

    it('should throw error if claim not found', async () => {
      when(mockClaimRepository.findByIdWithRelations).calledWith('invalid-id').mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(BusinessException);
      await expect(service.findById('invalid-id')).rejects.toThrow('Claim not found');
    });
  });

  describe('submit', () => {
    it('should submit a claim successfully', async () => {
      const mockClaim = {
        id: 'claim-1',
        status: 'Initiated',
        totalAmount: 150.75,
        expenses: [{ id: 'exp-1' }],
      } as Claim;

      when(mockClaimRepository.findByIdWithRelations).calledWith('claim-1').mockResolvedValue(mockClaim);
      when(mockExpenseRepository.findByClaimId).calledWith('claim-1').mockResolvedValue([{ id: 'exp-1' }] as any);
      when(mockClaimRepository.update).calledWith('claim-1', expect.objectContaining({
        status: 'Submitted',
        submittedDate: expect.any(Date),
      })).mockResolvedValue(undefined);

      await service.submit('claim-1', mockUser);

      expect(mockClaimRepository.update).toHaveBeenCalled();
    });

    it('should throw error if claim not found', async () => {
      when(mockClaimRepository.findByIdWithRelations).calledWith('invalid-id').mockResolvedValue(null);

      await expect(service.submit('invalid-id', mockUser)).rejects.toThrow(BusinessException);
    });

    it('should throw error if claim already submitted', async () => {
      const mockClaim = {
        id: 'claim-1',
        status: 'Submitted',
      } as Claim;

      when(mockClaimRepository.findByIdWithRelations).calledWith('claim-1').mockResolvedValue(mockClaim);

      await expect(service.submit('claim-1', mockUser)).rejects.toThrow(BusinessException);
      await expect(service.submit('claim-1', mockUser)).rejects.toThrow('Claim cannot be submitted');
    });

    it('should throw error if claim has no expenses', async () => {
      const mockClaim = {
        id: 'claim-1',
        status: 'Initiated',
        totalAmount: 0,
      } as Claim;

      when(mockClaimRepository.findByIdWithRelations).calledWith('claim-1').mockResolvedValue(mockClaim);
      when(mockExpenseRepository.findByClaimId).calledWith('claim-1').mockResolvedValue([]);

      await expect(service.submit('claim-1', mockUser)).rejects.toThrow(BusinessException);
      await expect(service.submit('claim-1', mockUser)).rejects.toThrow('Claim must have at least one expense');
    });
  });

  describe('approve', () => {
    it('should approve a submitted claim', async () => {
      const mockClaim = {
        id: 'claim-1',
        status: 'Submitted',
      } as Claim;

      when(mockClaimRepository.findByIdWithRelations).calledWith('claim-1').mockResolvedValue(mockClaim);
      when(mockClaimRepository.update).calledWith('claim-1', expect.objectContaining({
        status: 'Approved',
        approvedDate: expect.any(Date),
        approver: mockUser,
      })).mockResolvedValue(undefined);

      await service.approve('claim-1', mockUser);

      expect(mockClaimRepository.update).toHaveBeenCalled();
    });

    it('should throw error if claim not in Submitted status', async () => {
      const mockClaim = {
        id: 'claim-1',
        status: 'Initiated',
      } as Claim;

      when(mockClaimRepository.findByIdWithRelations).calledWith('claim-1').mockResolvedValue(mockClaim);

      await expect(service.approve('claim-1', mockUser)).rejects.toThrow(BusinessException);
      await expect(service.approve('claim-1', mockUser)).rejects.toThrow('Only submitted claims can be approved');
    });
  });

  describe('reject', () => {
    it('should reject a submitted claim with reason', async () => {
      const mockClaim = {
        id: 'claim-1',
        status: 'Submitted',
      } as Claim;

      const rejectDto = {
        rejectionReason: 'Missing receipts',
      };

      when(mockClaimRepository.findByIdWithRelations).calledWith('claim-1').mockResolvedValue(mockClaim);
      when(mockClaimRepository.update).calledWith('claim-1', expect.objectContaining({
        status: 'Rejected',
        rejectedDate: expect.any(Date),
        rejectionReason: 'Missing receipts',
        approver: mockUser,
      })).mockResolvedValue(undefined);

      await service.reject('claim-1', rejectDto, mockUser);

      expect(mockClaimRepository.update).toHaveBeenCalled();
    });

    it('should throw error if rejection reason is missing', async () => {
      const rejectDto = {
        rejectionReason: '',
      };

      await expect(service.reject('claim-1', rejectDto, mockUser)).rejects.toThrow(BusinessException);
      await expect(service.reject('claim-1', rejectDto, mockUser)).rejects.toThrow('Rejection reason is required');
    });
  });
});

