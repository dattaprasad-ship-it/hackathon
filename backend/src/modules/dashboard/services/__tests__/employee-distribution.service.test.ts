import { describe, it, expect, vi, beforeEach } from 'vitest';
import { when } from 'jest-when';
import { EmployeeDistributionService } from '../employee-distribution.service';
import { UserRole } from '../../../constants/enums/user-role.enum';

describe('EmployeeDistributionService', () => {
  let service: EmployeeDistributionService;
  let mockPIMRepository: any;
  let mockAdminUser: any;
  let mockEmployeeUser: any;

  beforeEach(() => {
    mockPIMRepository = {
      findEmployeesBySubUnit: vi.fn(),
    };
    service = new EmployeeDistributionService(mockPIMRepository);

    mockAdminUser = {
      id: 'admin-1',
      username: 'admin',
      role: UserRole.Admin,
    };

    mockEmployeeUser = {
      id: 'emp-1',
      username: 'employee',
      role: UserRole.Employee,
    };
  });

  describe('getEmployeeDistribution', () => {
    it('should return distribution for Admin (all employees)', async () => {
      const mockEmployees = [
        { id: '1', subUnit: 'Engineering' },
        { id: '2', subUnit: 'Engineering' },
        { id: '3', subUnit: 'Sales' },
        { id: '4', subUnit: 'HR' },
      ];

      when(mockPIMRepository.findEmployeesBySubUnit)
        .calledWith()
        .mockResolvedValue(mockEmployees);

      const result = await service.getEmployeeDistribution(mockAdminUser);

      expect(result.totalEmployees).toBe(4);
      expect(result.distribution).toHaveLength(3);
      expect(result.distribution[0].subUnit).toBe('Engineering');
      expect(result.distribution[0].count).toBe(2);
      expect(result.distribution[0].percentage).toBe(50);
    });

    it('should return filtered distribution for Employee', async () => {
      const mockEmployees = [
        { id: '1', subUnit: 'Engineering' },
        { id: '2', subUnit: 'Engineering' },
      ];

      when(mockPIMRepository.findEmployeesBySubUnit)
        .calledWith('emp-1', UserRole.Employee)
        .mockResolvedValue(mockEmployees);

      const result = await service.getEmployeeDistribution(mockEmployeeUser);

      expect(result.totalEmployees).toBe(2);
      expect(result.distribution).toHaveLength(1);
    });

    it('should calculate percentages correctly', async () => {
      const mockEmployees = [
        { id: '1', subUnit: 'Engineering' },
        { id: '2', subUnit: 'Engineering' },
        { id: '3', subUnit: 'Sales' },
      ];

      when(mockPIMRepository.findEmployeesBySubUnit)
        .calledWith()
        .mockResolvedValue(mockEmployees);

      const result = await service.getEmployeeDistribution(mockAdminUser);

      expect(result.distribution[0].percentage).toBeCloseTo(66.67, 1);
      expect(result.distribution[1].percentage).toBeCloseTo(33.33, 1);
    });

    it('should handle employees without sub-unit', async () => {
      const mockEmployees = [
        { id: '1', subUnit: 'Engineering' },
        { id: '2', department: 'Sales' },
        { id: '3' },
      ];

      when(mockPIMRepository.findEmployeesBySubUnit)
        .calledWith()
        .mockResolvedValue(mockEmployees);

      const result = await service.getEmployeeDistribution(mockAdminUser);

      expect(result.distribution.some((d) => d.subUnit === 'Unassigned')).toBe(true);
    });
  });
});

