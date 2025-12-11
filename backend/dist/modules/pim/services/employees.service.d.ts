import { EmployeeRepository } from '../repositories/employee.repository';
import { JobTitleRepository, EmploymentStatusRepository, SubUnitRepository, ReportingMethodRepository } from '../repositories/lookup.repository';
import { Employee } from '../entities/employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeListQueryDto } from '../dto/employees.dto';
export declare class EmployeesService {
    private readonly employeeRepository;
    private readonly jobTitleRepository;
    private readonly employmentStatusRepository;
    private readonly subUnitRepository;
    private readonly reportingMethodRepository;
    constructor(employeeRepository: EmployeeRepository, jobTitleRepository: JobTitleRepository, employmentStatusRepository: EmploymentStatusRepository, subUnitRepository: SubUnitRepository, reportingMethodRepository: ReportingMethodRepository);
    list(filters: EmployeeListQueryDto): Promise<{
        employees: Employee[];
        total: number;
    }>;
    findById(id: string): Promise<Employee | null>;
    create(dto: CreateEmployeeDto): Promise<Employee>;
    update(id: string, dto: UpdateEmployeeDto): Promise<Employee>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=employees.service.d.ts.map