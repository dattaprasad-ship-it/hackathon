import { EmployeeDistributionResponseDto } from '../dto/dashboard.dto';
import { MinimalUser } from '../types/user.types';
interface PIMRepository {
    findEmployeesBySubUnit: (userId?: string, role?: string) => Promise<any[]>;
}
export declare class EmployeeDistributionService {
    private readonly pimRepository;
    constructor(pimRepository: PIMRepository);
    getEmployeeDistribution(user: MinimalUser): Promise<EmployeeDistributionResponseDto>;
}
export {};
//# sourceMappingURL=employee-distribution.service.d.ts.map