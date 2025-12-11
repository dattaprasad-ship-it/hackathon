"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesOnLeaveService = void 0;
const user_role_enum_1 = require("../../../constants/enums/user-role.enum");
class EmployeesOnLeaveService {
    constructor(leaveRepository) {
        this.leaveRepository = leaveRepository;
    }
    async getEmployeesOnLeave(user, date) {
        const targetDate = date ? new Date(date) : new Date();
        targetDate.setHours(0, 0, 0, 0);
        let employees;
        if (user.role === user_role_enum_1.UserRole.ADMIN) {
            employees = await this.leaveRepository.findEmployeesOnLeave(targetDate);
        }
        else {
            employees = await this.leaveRepository.findEmployeesOnLeave(targetDate, user.id, user.role);
        }
        const employeeDtos = employees.map((emp) => ({
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
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }
}
exports.EmployeesOnLeaveService = EmployeesOnLeaveService;
//# sourceMappingURL=employees-on-leave.service.js.map