import { EmployeeRepository } from '../repositories/employee.repository';
import { DataImportResultDto } from '../dto/data-import.dto';
export declare class DataImportService {
    private employeeRepository;
    constructor(employeeRepository: EmployeeRepository);
    importFromCSV(file: Express.Multer.File): Promise<DataImportResultDto>;
    private generateEmployeeId;
}
//# sourceMappingURL=data-import.service.d.ts.map