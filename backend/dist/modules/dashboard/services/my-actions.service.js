"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyActionsService = void 0;
const user_role_enum_1 = require("../../../constants/enums/user-role.enum");
class MyActionsService {
    constructor(timeRepository, performanceRepository, recruitmentRepository) {
        this.timeRepository = timeRepository;
        this.performanceRepository = performanceRepository;
        this.recruitmentRepository = recruitmentRepository;
    }
    async getMyActions(user) {
        const actions = [];
        if (user.role === user_role_enum_1.UserRole.ADMIN) {
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
        const interviewCount = await this.recruitmentRepository.countScheduledInterviews(user.id, user.role);
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
exports.MyActionsService = MyActionsService;
//# sourceMappingURL=my-actions.service.js.map