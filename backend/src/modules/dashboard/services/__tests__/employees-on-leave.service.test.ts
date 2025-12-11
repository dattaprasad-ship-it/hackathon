import { describe, it, expect, vi, beforeEach } from 'vitest';
import { when } from 'jest-when';
import { EmployeesOnLeaveService } from '../employees-on-leave.service';
import { UserRole } from '../../../constants/enums/user-role.enum';

describe('EmployeesOnLeaveService', () => {
  let service: EmployeesOnLeaveService;
  let mockLeaveRepository: any;
  let mockAdminUser: any;
  let mockEmployeeUser: any;

  beforeEach(() => {
    mockLeaveRepository = {
      findEmployeesOnLeave: vi.fn(),
    };
    service = new EmployeesOnLeaveService(mockLeaveRepository);

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

  describe('getEmployeesOnLeave', () => {
    it('should return all employees on leave for Admin', async () => {
      const targetDate = new Date('2025-01-12');
      const mockEmployees = [
        {
          id: 'emp-1',
          name: 'John Doe',
          displayName: 'John Doe',
          department: 'Engineering',
          leaveType: 'Annual Leave',
          startDate: targetDate,
          endDate: targetDate,
        },
      ];

      when(mockLeaveRepository.findEmployeesOnLeave)
        .calledWith(targetDate)
        .mockResolvedValue(mockEmployees);

      const result = await service.getEmployeesOnLeave(mockAdminUser, '2025-01-12');

      expect(result.date).toBe('2025-01-12');
      expect(result.employees).toHaveLength(1);
      expect(result.employees[0].name).toBe('John Doe');
      expect(result.totalCount).toBe(1);
    });

    it('should return filtered employees for Employee role', async () => {
      const targetDate = new Date();
      targetDate.setHours(0, 0, 0, 0);

      when(mockLeaveRepository.findEmployeesOnLeave)
        .calledWith(targetDate, 'emp-1', UserRole.Employee)
        .mockResolvedValue([]);

      const result = await service.getEmployeesOnLeave(mockEmployeeUser);

      expect(result.employees).toHaveLength(0);
      expect(result.totalCount).toBe(0);
    });

    it('should use today date when date not provided', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      when(mockLeaveRepository.findEmployeesOnLeave)
        .calledWith(today)
        .mockResolvedValue([]);

      await service.getEmployeesOnLeave(mockAdminUser);

      expect(mockLeaveRepository.findEmployeesOnLeave).toHaveBeenCalledWith(
        expect.any(Date)
      );
    });
  });
});

