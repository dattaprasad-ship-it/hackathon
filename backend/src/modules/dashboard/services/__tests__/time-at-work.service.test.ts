import { describe, it, expect, vi, beforeEach } from 'vitest';
import { when } from 'jest-when';
import { TimeAtWorkService } from '../time-at-work.service';
import { UserRole } from '../../../constants/enums/user-role.enum';
import type { TimeAtWorkResponseDto } from '../../dto/dashboard.dto';

describe('TimeAtWorkService', () => {
  let service: TimeAtWorkService;
  let mockTimeRepository: any;
  let mockUser: any;

  beforeEach(() => {
    mockTimeRepository = {
      findPunchInRecord: vi.fn(),
      findWeeklyHours: vi.fn(),
    };
    service = new TimeAtWorkService(mockTimeRepository);
    mockUser = {
      id: 'user-1',
      username: 'testuser',
      role: UserRole.Employee,
    };
  });

  describe('getTimeAtWorkData', () => {
    it('should return time at work data for punched in user', async () => {
      const mockPunchIn = {
        id: 'punch-1',
        userId: 'user-1',
        punchInTime: new Date('2025-01-12T11:50:00Z'),
        punchOutTime: null,
      };

      const mockWeekData = [
        { date: '2025-01-08', hours: 8, minutes: 0 },
        { date: '2025-01-09', hours: 8, minutes: 30 },
      ];

      when(mockTimeRepository.findPunchInRecord)
        .calledWith('user-1')
        .mockResolvedValue(mockPunchIn);

      when(mockTimeRepository.findWeeklyHours)
        .calledWith('user-1', expect.any(Date), expect.any(Date))
        .mockResolvedValue(mockWeekData);

      const result = await service.getTimeAtWorkData(mockUser);

      expect(result.punchedIn).toBe(true);
      expect(result.punchInTime).toBe(mockPunchIn.punchInTime.toISOString());
      expect(result.weekData).toHaveLength(2);
    });

    it('should return time at work data for not punched in user', async () => {
      when(mockTimeRepository.findPunchInRecord)
        .calledWith('user-1')
        .mockResolvedValue(null);

      when(mockTimeRepository.findWeeklyHours)
        .calledWith('user-1', expect.any(Date), expect.any(Date))
        .mockResolvedValue([]);

      const result = await service.getTimeAtWorkData(mockUser);

      expect(result.punchedIn).toBe(false);
      expect(result.punchInTime).toBe('');
      expect(result.todayHours.hours).toBe(0);
      expect(result.todayHours.minutes).toBe(0);
    });

    it('should calculate today hours correctly', async () => {
      const punchInTime = new Date();
      punchInTime.setHours(9, 0, 0, 0);
      const now = new Date();
      now.setHours(17, 30, 0, 0);

      vi.useFakeTimers();
      vi.setSystemTime(now);

      const mockPunchIn = {
        id: 'punch-1',
        userId: 'user-1',
        punchInTime,
        punchOutTime: null,
      };

      when(mockTimeRepository.findPunchInRecord)
        .calledWith('user-1')
        .mockResolvedValue(mockPunchIn);

      when(mockTimeRepository.findWeeklyHours)
        .calledWith('user-1', expect.any(Date), expect.any(Date))
        .mockResolvedValue([]);

      const result = await service.getTimeAtWorkData(mockUser);

      expect(result.todayHours.hours).toBe(8);
      expect(result.todayHours.minutes).toBe(30);

      vi.useRealTimers();
    });

    it('should handle timezone correctly', async () => {
      when(mockTimeRepository.findPunchInRecord)
        .calledWith('user-1')
        .mockResolvedValue(null);

      when(mockTimeRepository.findWeeklyHours)
        .calledWith('user-1', expect.any(Date), expect.any(Date))
        .mockResolvedValue([]);

      const result = await service.getTimeAtWorkData(mockUser, 'GMT+5');

      expect(result.timezone).toBe('GMT+5');
    });
  });
});

