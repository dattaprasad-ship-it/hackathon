import { Repository } from 'typeorm';
import { EmployeeRepository } from '../employee.repository';
import { Employee } from '../../entities/employee.entity';
import { when } from 'jest-when';

describe('EmployeeRepository', () => {
  let repository: EmployeeRepository;
  let mockRepository: jest.Mocked<Repository<Employee>>;

  beforeEach(() => {
    mockRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: jest.fn(),
      update: jest.fn(),
    } as any;

    repository = new EmployeeRepository(mockRepository);
  });

  describe('findByEmployeeId', () => {
    it('should find employee by employee ID excluding deleted', async () => {
      const mockEmployee = {
        id: '1',
        employeeId: '0445',
        firstName: 'John',
        lastName: 'Doe',
        isDeleted: false,
      } as Employee;

      when(mockRepository.findOne).calledWith({
        where: expect.objectContaining({
          employeeId: expect.anything(),
          isDeleted: false,
        }),
        relations: expect.arrayContaining(['jobTitle', 'employmentStatus', 'subUnit', 'supervisor', 'reportingMethod']),
      }).mockResolvedValue(mockEmployee);

      const result = await repository.findByEmployeeId('0445');

      expect(result).toEqual(mockEmployee);
      expect(mockRepository.findOne).toHaveBeenCalled();
    });

    it('should find employee including deleted when excludeDeleted is false', async () => {
      const mockEmployee = {
        id: '1',
        employeeId: '0445',
        firstName: 'John',
        lastName: 'Doe',
        isDeleted: true,
      } as Employee;

      when(mockRepository.findOne).calledWith({
        where: expect.objectContaining({
          employeeId: expect.anything(),
        }),
        relations: expect.anything(),
      }).mockResolvedValue(mockEmployee);

      const result = await repository.findByEmployeeId('0445', false);

      expect(result).toEqual(mockEmployee);
    });
  });

  describe('findByUsername', () => {
    it('should find employee by username excluding deleted', async () => {
      const mockEmployee = {
        id: '1',
        employeeId: '0445',
        username: 'jdoe',
        isDeleted: false,
      } as Employee;

      when(mockRepository.findOne).calledWith({
        where: expect.objectContaining({
          username: expect.anything(),
          isDeleted: false,
        }),
      }).mockResolvedValue(mockEmployee);

      const result = await repository.findByUsername('jdoe');

      expect(result).toEqual(mockEmployee);
    });
  });

  describe('softDelete', () => {
    it('should soft delete employee by setting isDeleted to true', async () => {
      when(mockRepository.update).calledWith('1', { isDeleted: true }).mockResolvedValue(undefined as any);

      await repository.softDelete('1');

      expect(mockRepository.update).toHaveBeenCalledWith('1', { isDeleted: true });
    });
  });

  describe('findSubordinates', () => {
    it('should find all subordinates of a supervisor', async () => {
      const mockSubordinates = [
        { id: '2', employeeId: '0446', firstName: 'Jane', lastName: 'Smith' } as Employee,
        { id: '3', employeeId: '0447', firstName: 'Bob', lastName: 'Johnson' } as Employee,
      ];

      when(mockRepository.find).calledWith({
        where: expect.objectContaining({
          supervisor: expect.anything(),
          isDeleted: false,
        }),
      }).mockResolvedValue(mockSubordinates);

      const result = await repository.findSubordinates('1');

      expect(result).toEqual(mockSubordinates);
      expect(result.length).toBe(2);
    });
  });
});

