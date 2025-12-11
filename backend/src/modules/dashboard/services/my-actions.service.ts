import { ActionDto } from '../dto/dashboard.dto';
import { MinimalUser } from '../types/user.types';
import { UserRole } from '../../../constants/enums/user-role.enum';

interface TimeRepository {
  countPendingTimesheets: (userId: string, role: string) => Promise<number>;
}

interface PerformanceRepository {
  countPendingSelfReviews: (userId: string) => Promise<number>;
}

interface RecruitmentRepository {
  countScheduledInterviews: (userId: string, role: string) => Promise<number>;
}

export class MyActionsService {
  constructor(
    private readonly timeRepository: TimeRepository,
    private readonly performanceRepository: PerformanceRepository,
    private readonly recruitmentRepository: RecruitmentRepository
  ) {}

  async getMyActions(user: MinimalUser): Promise<ActionDto[]> {
    const actions: ActionDto[] = [];

    if (user.role === UserRole.ADMIN) {
      const timesheetCount = await this.timeRepository.countPendingTimesheets(user.id, user.role);
      if (timesheetCount > 0) {
        actions.push({
          type: 'timesheet_approval',
          title: 'Timesheets to Approve',
          count: timesheetCount,
          icon: 'calendar',
          url: '/time/timesheets/approve',
        });
      }
    }

    const selfReviewCount = await this.performanceRepository.countPendingSelfReviews(user.id);
    if (selfReviewCount > 0) {
      actions.push({
        type: 'self_review',
        title: 'Pending Self Review',
        count: selfReviewCount,
        icon: 'person-heart',
        url: '/performance/reviews/self',
      });
    }

    const interviewCount = await this.recruitmentRepository.countScheduledInterviews(
      user.id,
      user.role
    );
    if (interviewCount > 0) {
      actions.push({
        type: 'candidate_interview',
        title: 'Candidate to Interview',
        count: interviewCount,
        icon: 'person-chat',
        url: '/recruitment/candidates/interview',
      });
    }

    return actions;
  }
}

