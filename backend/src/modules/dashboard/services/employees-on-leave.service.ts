import { EmployeeOnLeaveDto, EmployeesOnLeaveResponseDto } from '../dto/dashboard.dto';
import { MinimalUser } from '../types/user.types';
import { UserRole } from '../../../constants/enums/user-role.enum';

interface LeaveRepository {
  findEmployeesOnLeave: (date: Date, userId?: string, role?: string) => Promise<any[]>;
}

export class EmployeesOnLeaveService {
  constructor(private readonly leaveRepository: LeaveRepository) {}

  async getEmployeesOnLeave(
    user: MinimalUser,
    date?: string
  ): Promise<EmployeesOnLeaveResponseDto> {
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    let employees: any[];

    if (user.role === UserRole.ADMIN) {
      employees = await this.leaveRepository.findEmployeesOnLeave(targetDate);
    } else {
      employees = await this.leaveRepository.findEmployeesOnLeave(targetDate, user.id, user.role);
    }

    const employeeDtos: EmployeeOnLeaveDto[] = employees.map((emp) => ({
      id: emp.id,
      name: emp.name || emp.displayName,
      displayName: emp.displayName || emp.name,
      department: emp.department || 'N/A',
      leaveType: emp.leaveType || 'Leave',
      startDate: emp.startDate ? this.formatDate(new Date(emp.startDate)) : this.formatDate(targetDate),
      endDate: emp.endDate ? this.formatDate(new Date(emp.endDate)) : this.formatDate(targetDate),
      profilePicture: emp.profilePicture || null,
    }));

    return {
      date: this.formatDate(targetDate),
      employees: employeeDtos,
      totalCount: employeeDtos.length,
    };
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}

