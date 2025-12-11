import { TimeAtWorkService } from './time-at-work.service';
import { MyActionsService } from './my-actions.service';
import { EmployeesOnLeaveService } from './employees-on-leave.service';
import { EmployeeDistributionService } from './employee-distribution.service';
import { BuzzPostsService } from './buzz-posts.service';
import { TimeAtWorkResponseDto, MyActionsResponseDto, EmployeesOnLeaveResponseDto, EmployeeDistributionResponseDto, BuzzPostsResponseDto, DashboardSummaryResponseDto } from '../dto/dashboard.dto';
import { MinimalUser } from '../types/user.types';
export declare class DashboardService {
    private readonly timeAtWorkService;
    private readonly myActionsService;
    private readonly employeesOnLeaveService;
    private readonly employeeDistributionService;
    private readonly buzzPostsService;
    constructor(timeAtWorkService: TimeAtWorkService, myActionsService: MyActionsService, employeesOnLeaveService: EmployeesOnLeaveService, employeeDistributionService: EmployeeDistributionService, buzzPostsService: BuzzPostsService);
    getTimeAtWork(user: MinimalUser): Promise<TimeAtWorkResponseDto>;
    getMyActions(user: MinimalUser): Promise<MyActionsResponseDto>;
    getEmployeesOnLeave(user: MinimalUser, date?: string): Promise<EmployeesOnLeaveResponseDto>;
    getEmployeeDistribution(user: MinimalUser): Promise<EmployeeDistributionResponseDto>;
    getBuzzPosts(user: MinimalUser, limit?: number): Promise<BuzzPostsResponseDto>;
    getDashboardSummary(user: MinimalUser): Promise<DashboardSummaryResponseDto>;
}
//# sourceMappingURL=dashboard.service.d.ts.map