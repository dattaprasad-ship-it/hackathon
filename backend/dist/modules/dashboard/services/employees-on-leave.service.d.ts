import { EmployeesOnLeaveResponseDto } from '../dto/dashboard.dto';
import { MinimalUser } from '../types/user.types';
interface LeaveRepository {
    findEmployeesOnLeave: (date: Date, userId?: string, role?: string) => Promise<any[]>;
}
export declare class EmployeesOnLeaveService {
    private readonly leaveRepository;
    constructor(leaveRepository: LeaveRepository);
    getEmployeesOnLeave(user: MinimalUser, date?: string): Promise<EmployeesOnLeaveResponseDto>;
    private formatDate;
}
export {};
//# sourceMappingURL=employees-on-leave.service.d.ts.map