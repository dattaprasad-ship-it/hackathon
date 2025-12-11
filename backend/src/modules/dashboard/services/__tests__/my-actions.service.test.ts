import { describe, it, expect, vi, beforeEach } from 'vitest';
import { when } from 'jest-when';
import { MyActionsService } from '../my-actions.service';
import { UserRole } from '../../../constants/enums/user-role.enum';

describe('MyActionsService', () => {
  let service: MyActionsService;
  let mockTimeRepository: any;
  let mockPerformanceRepository: any;
  let mockRecruitmentRepository: any;
  let mockAdminUser: any;
  let mockEmployeeUser: any;

  beforeEach(() => {
    mockTimeRepository = {
      countPendingTimesheets: vi.fn(),
    };
    mockPerformanceRepository = {
      countPendingSelfReviews: vi.fn(),
    };
    mockRecruitmentRepository = {
      countScheduledInterviews: vi.fn(),
    };

    service = new MyActionsService(
      mockTimeRepository,
      mockPerformanceRepository,
      mockRecruitmentRepository
    );

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

  describe('getMyActions', () => {
    it('should return actions for Admin user', async () => {
      when(mockTimeRepository.countPendingTimesheets)
        .calledWith('admin-1', UserRole.Admin)
        .mockResolvedValue(2);

      when(mockPerformanceRepository.countPendingSelfReviews)
        .calledWith('admin-1')
        .mockResolvedValue(1);

      when(mockRecruitmentRepository.countScheduledInterviews)
        .calledWith('admin-1', UserRole.Admin)
        .mockResolvedValue(3);

      const result = await service.getMyActions(mockAdminUser);

      expect(result).toHaveLength(3);
      expect(result[0].type).toBe('timesheet_approval');
      expect(result[0].count).toBe(2);
      expect(result[1].type).toBe('self_review');
      expect(result[1].count).toBe(1);
      expect(result[2].type).toBe('candidate_interview');
      expect(result[2].count).toBe(3);
    });

    it('should return actions for Employee user (no timesheet approval)', async () => {
      when(mockPerformanceRepository.countPendingSelfReviews)
        .calledWith('emp-1')
        .mockResolvedValue(1);

      when(mockRecruitmentRepository.countScheduledInterviews)
        .calledWith('emp-1', UserRole.Employee)
        .mockResolvedValue(0);

      const result = await service.getMyActions(mockEmployeeUser);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('self_review');
      expect(mockTimeRepository.countPendingTimesheets).not.toHaveBeenCalled();
    });

    it('should return empty array when no actions', async () => {
      when(mockPerformanceRepository.countPendingSelfReviews)
        .calledWith('emp-1')
        .mockResolvedValue(0);

      when(mockRecruitmentRepository.countScheduledInterviews)
        .calledWith('emp-1', UserRole.Employee)
        .mockResolvedValue(0);

      const result = await service.getMyActions(mockEmployeeUser);

      expect(result).toHaveLength(0);
    });

    it('should filter out actions with zero count', async () => {
      when(mockTimeRepository.countPendingTimesheets)
        .calledWith('admin-1', UserRole.Admin)
        .mockResolvedValue(0);

      when(mockPerformanceRepository.countPendingSelfReviews)
        .calledWith('admin-1')
        .mockResolvedValue(0);

      when(mockRecruitmentRepository.countScheduledInterviews)
        .calledWith('admin-1', UserRole.Admin)
        .mockResolvedValue(0);

      const result = await service.getMyActions(mockAdminUser);

      expect(result).toHaveLength(0);
    });
  });
});

