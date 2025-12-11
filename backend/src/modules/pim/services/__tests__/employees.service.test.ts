import { EmployeesService, CreateEmployeeDto } from '../employees.service';
import { EmployeeRepository } from '../../repositories/employee.repository';
import { JobTitleRepository, EmploymentStatusRepository, SubUnitRepository, ReportingMethodRepository } from '../../repositories/lookup.repository';
import { Employee } from '../../entities/employee.entity';
import { BusinessException } from '../../../../common/exceptions/business.exception';
import { passwordUtil } from '../../../authentication/utils/password.util';
import { when } from 'jest-when';

jest.mock('../../../authentication/utils/password.util');
jest.mock('../../../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('EmployeesService', () => {
  let service: EmployeesService;
  let employeeRepository: jest.Mocked<EmployeeRepository>;
  let jobTitleRepository: jest.Mocked<JobTitleRepository>;
  let employmentStatusRepository: jest.Mocked<EmploymentStatusRepository>;
  let subUnitRepository: jest.Mocked<SubUnitRepository>;
  let reportingMethodRepository: jest.Mocked<ReportingMethodRepository>;

  beforeEach(() => {
    employeeRepository = {
      findById: jest.fn(),
      findByEmployeeId: jest.fn(),
      findByUsername: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      findSubordinates: jest.fn(),
      findWithFilters: jest.fn(),
    } as any;

    jobTitleRepository = {
      findById: jest.fn(),
    } as any;

    employmentStatusRepository = {
      findById: jest.fn(),
    } as any;

    subUnitRepository = {
      findById: jest.fn(),
    } as any;

    reportingMethodRepository = {
      findById: jest.fn(),
    } as any;

    service = new EmployeesService(
      employeeRepository,
      jobTitleRepository,
      employmentStatusRepository,
      subUnitRepository,
      reportingMethodRepository
    );
  });

  describe('create', () => {
    const validDto: CreateEmployeeDto = {
      employeeId: '0445',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should create employee with required fields', async () => {
      when(employeeRepository.findByEmployeeId).calledWith('0445', true).mockResolvedValue(null);
      when(employeeRepository.create).calledWith(expect.objectContaining({
        employeeId: '0445',
        firstName: 'John',
        lastName: 'Doe',
        isDeleted: false,
      })).mockResolvedValue({
        id: '1',
        employeeId: '0445',
        firstName: 'John',
        lastName: 'Doe',
      } as Employee);

      const result = await service.create(validDto);

      expect(result.employeeId).toBe('0445');
      expect(result.firstName).toBe('John');
      expect(employeeRepository.create).toHaveBeenCalled();
    });

    it('should throw error if first name is missing', async () => {
      const invalidDto = { ...validDto, firstName: '' };

      await expect(service.create(invalidDto)).rejects.toThrow(BusinessException);
      await expect(service.create(invalidDto)).rejects.toThrow('First name and last name are required');
    });

    it('should throw error if last name is missing', async () => {
      const invalidDto = { ...validDto, lastName: '' };

      await expect(service.create(invalidDto)).rejects.toThrow(BusinessException);
    });

    it('should throw error if employee ID already exists', async () => {
      when(employeeRepository.findByEmployeeId).calledWith('0445', true).mockResolvedValue({
        id: '2',
        employeeId: '0445',
      } as Employee);

      await expect(service.create(validDto)).rejects.toThrow(BusinessException);
      await expect(service.create(validDto)).rejects.toThrow('Employee ID already exists');
    });

    it('should create employee with login details when createLoginDetails is true', async () => {
      const dtoWithLogin: CreateEmployeeDto = {
        ...validDto,
        createLoginDetails: true,
        username: 'jdoe',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        loginStatus: 'Enabled',
      };

      when(employeeRepository.findByEmployeeId).calledWith('0445', true).mockResolvedValue(null);
      when(employeeRepository.findByUsername).calledWith('jdoe').mockResolvedValue(null);
      when(passwordUtil.hashPassword).calledWith('SecurePass123!').mockResolvedValue('hashed_password');
      when(employeeRepository.create).calledWith(expect.objectContaining({
        username: 'jdoe',
        passwordHash: 'hashed_password',
        loginStatus: 'Enabled',
      })).mockResolvedValue({
        id: '1',
        ...dtoWithLogin,
        passwordHash: 'hashed_password',
      } as any);

      const result = await service.create(dtoWithLogin);

      expect(result.username).toBe('jdoe');
      expect(passwordUtil.hashPassword).toHaveBeenCalledWith('SecurePass123!');
    });

    it('should throw error if passwords do not match', async () => {
      const dtoWithMismatchedPasswords: CreateEmployeeDto = {
        ...validDto,
        createLoginDetails: true,
        username: 'jdoe',
        password: 'SecurePass123!',
        confirmPassword: 'DifferentPass456!',
      };

      when(employeeRepository.findByEmployeeId).calledWith('0445', true).mockResolvedValue(null);

      await expect(service.create(dtoWithMismatchedPasswords)).rejects.toThrow(BusinessException);
      await expect(service.create(dtoWithMismatchedPasswords)).rejects.toThrow('Password and confirm password do not match');
    });

    it('should throw error if username already exists', async () => {
      const dtoWithLogin: CreateEmployeeDto = {
        ...validDto,
        createLoginDetails: true,
        username: 'jdoe',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      };

      when(employeeRepository.findByEmployeeId).calledWith('0445', true).mockResolvedValue(null);
      when(employeeRepository.findByUsername).calledWith('jdoe').mockResolvedValue({
        id: '2',
        username: 'jdoe',
      } as Employee);

      await expect(service.create(dtoWithLogin)).rejects.toThrow(BusinessException);
      await expect(service.create(dtoWithLogin)).rejects.toThrow('Username already exists');
    });
  });

  describe('delete', () => {
    it('should soft delete employee if no subordinates', async () => {
      const employee = {
        id: '1',
        employeeId: '0445',
        firstName: 'John',
        lastName: 'Doe',
        isDeleted: false,
      } as Employee;

      when(employeeRepository.findById).calledWith('1').mockResolvedValue(employee);
      when(employeeRepository.findSubordinates).calledWith('1').mockResolvedValue([]);
      when(employeeRepository.softDelete).calledWith('1').mockResolvedValue(undefined);

      await service.delete('1');

      expect(employeeRepository.softDelete).toHaveBeenCalledWith('1');
    });

    it('should throw error if employee has subordinates', async () => {
      const employee = {
        id: '1',
        employeeId: '0445',
        firstName: 'John',
        lastName: 'Doe',
        isDeleted: false,
      } as Employee;

      when(employeeRepository.findById).calledWith('1').mockResolvedValue(employee);
      when(employeeRepository.findSubordinates).calledWith('1').mockResolvedValue([
        { id: '2', employeeId: '0446' } as Employee,
      ]);

      await expect(service.delete('1')).rejects.toThrow(BusinessException);
      await expect(service.delete('1')).rejects.toThrow('Cannot delete employee with subordinates');
    });

    it('should throw error if employee not found', async () => {
      when(employeeRepository.findById).calledWith('1').mockResolvedValue(null);

      await expect(service.delete('1')).rejects.toThrow(BusinessException);
      await expect(service.delete('1')).rejects.toThrow('Employee not found');
    });
  });

  describe('list', () => {
    it('should return employees with filters', async () => {
      const filters = {
        employeeName: 'John',
        page: 1,
        limit: 50,
      };

      const mockEmployees = [
        { id: '1', employeeId: '0445', firstName: 'John', lastName: 'Doe' } as Employee,
      ];

      when(employeeRepository.findWithFilters).calledWith(filters).mockResolvedValue({
        employees: mockEmployees,
        total: 1,
      });

      const result = await service.list(filters);

      expect(result.employees).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(employeeRepository.findWithFilters).toHaveBeenCalledWith(filters);
    });
  });
});

