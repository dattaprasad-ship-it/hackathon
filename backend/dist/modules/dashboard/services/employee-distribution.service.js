"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeDistributionService = void 0;
const user_role_enum_1 = require("../../../constants/enums/user-role.enum");
const COLORS = ['#FF5733', '#FFC300', '#FF8C00', '#33FF57', '#3357FF', '#FF33F5', '#33FFF5'];
class EmployeeDistributionService {
    constructor(pimRepository) {
        this.pimRepository = pimRepository;
    }
    async getEmployeeDistribution(user) {
        let employees;
        if (user.role === user_role_enum_1.UserRole.ADMIN) {
            employees = await this.pimRepository.findEmployeesBySubUnit();
        }
        else {
            employees = await this.pimRepository.findEmployeesBySubUnit(user.id, user.role);
        }
        const distributionMap = new Map();
        employees.forEach((emp) => {
            const subUnit = emp.subUnit || emp.department || 'Unassigned';
            distributionMap.set(subUnit, (distributionMap.get(subUnit) || 0) + 1);
        });
        const totalEmployees = employees.length;
        const distribution = Array.from(distributionMap.entries()).map(([subUnit, count], index) => ({
            subUnit,
            count,
            percentage: totalEmployees > 0 ? (count / totalEmployees) * 100 : 0,
            color: COLORS[index % COLORS.length],
        }));
        distribution.sort((a, b) => b.count - a.count);
        return {
            distribution,
            totalEmployees,
        };
    }
}
exports.EmployeeDistributionService = EmployeeDistributionService;
//# sourceMappingURL=employee-distribution.service.js.map