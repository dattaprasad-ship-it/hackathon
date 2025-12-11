import { TimeAtWorkResponseDto, WeekDayDataDto } from '../dto/dashboard.dto';
import { MinimalUser } from '../types/user.types';

interface TimeRepository {
  findPunchInRecord: (userId: string) => Promise<any>;
  findWeeklyHours: (userId: string, startDate: Date, endDate: Date) => Promise<any[]>;
}

export class TimeAtWorkService {
  constructor(private readonly timeRepository: TimeRepository) {}

  async getTimeAtWorkData(user: MinimalUser, timezone: string = 'GMT+1'): Promise<TimeAtWorkResponseDto> {
    const punchInRecord = await this.timeRepository.findPunchInRecord(user.id);
    const punchedIn = !!punchInRecord && !punchInRecord.punchOutTime;

    const now = new Date();
    const weekStart = this.getWeekStart(now);
    const weekEnd = this.getWeekEnd(now);

    const weeklyHours = await this.timeRepository.findWeeklyHours(user.id, weekStart, weekEnd);

    const weekData: WeekDayDataDto[] = this.formatWeekData(weeklyHours, weekStart);

    let todayHours = { hours: 0, minutes: 0, totalMinutes: 0 };
    if (punchedIn && punchInRecord.punchInTime) {
      todayHours = this.calculateTodayHours(punchInRecord.punchInTime, now);
    }

    return {
      punchedIn,
      punchInTime: punchedIn && punchInRecord.punchInTime
        ? punchInRecord.punchInTime.toISOString()
        : '',
      timezone,
      todayHours,
      weekData,
      weekRange: {
        start: this.formatDate(weekStart),
        end: this.formatDate(weekEnd),
      },
    };
  }

  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  private getWeekEnd(date: Date): Date {
    const weekStart = this.getWeekStart(date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return weekEnd;
  }

  private calculateTodayHours(punchInTime: Date, now: Date): {
    hours: number;
    minutes: number;
    totalMinutes: number;
  } {
    const diffMs = now.getTime() - punchInTime.getTime();
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return { hours, minutes, totalMinutes };
  }

  private formatWeekData(weeklyHours: any[], weekStart: Date): WeekDayDataDto[] {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekData: WeekDayDataDto[] = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(currentDate.getDate() + i);
      const dateStr = this.formatDate(currentDate);

      const dayData = weeklyHours.find((h) => this.formatDate(new Date(h.date)) === dateStr);

      weekData.push({
        date: dateStr,
        day: days[i],
        hours: dayData?.hours || 0,
        minutes: dayData?.minutes || 0,
      });
    }

    return weekData;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}

