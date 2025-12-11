import { ActionDto } from '../dto/dashboard.dto';
import { MinimalUser } from '../types/user.types';
interface TimeRepository {
    countPendingTimesheets: (userId: string, role: string) => Promise<number>;
}
interface PerformanceRepository {
    countPendingSelfReviews: (userId: string) => Promise<number>;
}
interface RecruitmentRepository {
    countScheduledInterviews: (userId: string, role: string) => Promise<number>;
}
export declare class MyActionsService {
    private readonly timeRepository;
    private readonly performanceRepository;
    private readonly recruitmentRepository;
    constructor(timeRepository: TimeRepository, performanceRepository: PerformanceRepository, recruitmentRepository: RecruitmentRepository);
    getMyActions(user: MinimalUser): Promise<ActionDto[]>;
}
export {};
//# sourceMappingURL=my-actions.service.d.ts.map