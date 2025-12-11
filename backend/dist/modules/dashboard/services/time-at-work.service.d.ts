import { TimeAtWorkResponseDto } from '../dto/dashboard.dto';
import { MinimalUser } from '../types/user.types';
interface TimeRepository {
    findPunchInRecord: (userId: string) => Promise<any>;
    findWeeklyHours: (userId: string, startDate: Date, endDate: Date) => Promise<any[]>;
}
export declare class TimeAtWorkService {
    private readonly timeRepository;
    constructor(timeRepository: TimeRepository);
    getTimeAtWorkData(user: MinimalUser, timezone?: string): Promise<TimeAtWorkResponseDto>;
    private getWeekStart;
    private getWeekEnd;
    private calculateTodayHours;
    private formatWeekData;
    private formatDate;
}
export {};
//# sourceMappingURL=time-at-work.service.d.ts.map