import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { Employee } from '../entities/employee.entity';
export declare class EmployeeRepository extends IGenericRepository<Employee> {
    constructor(repository: Repository<Employee>);
    findByEmployeeId(employeeId: string, excludeDeleted?: boolean): Promise<Employee | null>;
    findByUsername(username: string): Promise<Employee | null>;
    findWithFilters(filters: {
        employeeName?: string;
        employeeId?: string;
        employmentStatusId?: string;
        jobTitleId?: string;
        subUnitId?: string;
        supervisorId?: string;
        include?: 'current' | 'all';
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'ASC' | 'DESC';
    }): Promise<{
        employees: Employee[];
        total: number;
    }>;
    findSubordinates(supervisorId: string): Promise<Employee[]>;
    softDelete(id: string): Promise<void>;
}
//# sourceMappingURL=employee.repository.d.ts.map