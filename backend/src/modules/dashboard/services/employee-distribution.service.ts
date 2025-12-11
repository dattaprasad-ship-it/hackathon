import { DistributionDataDto, EmployeeDistributionResponseDto } from '../dto/dashboard.dto';
import { MinimalUser } from '../types/user.types';
import { UserRole } from '../../../constants/enums/user-role.enum';

interface PIMRepository {
  findEmployeesBySubUnit: (userId?: string, role?: string) => Promise<any[]>;
}

const COLORS = ['#FF5733', '#FFC300', '#FF8C00', '#33FF57', '#3357FF', '#FF33F5', '#33FFF5'];

export class EmployeeDistributionService {
  constructor(private readonly pimRepository: PIMRepository) {}

  async getEmployeeDistribution(
    user: MinimalUser
  ): Promise<EmployeeDistributionResponseDto> {
    let employees: any[];

    if (user.role === UserRole.ADMIN) {
      employees = await this.pimRepository.findEmployeesBySubUnit();
    } else {
      employees = await this.pimRepository.findEmployeesBySubUnit(user.id, user.role);
    }

    const distributionMap = new Map<string, number>();

    employees.forEach((emp) => {
      const subUnit = emp.subUnit || emp.department || 'Unassigned';
      distributionMap.set(subUnit, (distributionMap.get(subUnit) || 0) + 1);
    });

    const totalEmployees = employees.length;
    const distribution: DistributionDataDto[] = Array.from(distributionMap.entries()).map(
      ([subUnit, count], index) => ({
        subUnit,
        count,
        percentage: totalEmployees > 0 ? (count / totalEmployees) * 100 : 0,
        color: COLORS[index % COLORS.length],
      })
    );

    distribution.sort((a, b) => b.count - a.count);

    return {
      distribution,
      totalEmployees,
    };
  }
}

