import { ReportRepository } from '../repositories/report.repository';
import { EmployeeRepository } from '../repositories/employee.repository';
import { CreateReportDto, UpdateReportDto, ReportResponseDto, ReportExecutionResultDto } from '../dto/reports.dto';
export declare class ReportsService {
    private reportRepository;
    private employeeRepository;
    constructor(reportRepository: ReportRepository, employeeRepository: EmployeeRepository);
    findAll(reportName?: string): Promise<ReportResponseDto[]>;
    findOne(id: string): Promise<ReportResponseDto>;
    create(data: CreateReportDto, createdBy?: string): Promise<ReportResponseDto>;
    update(id: string, data: UpdateReportDto, updatedBy?: string): Promise<ReportResponseDto>;
    delete(id: string): Promise<void>;
    executeReport(id: string): Promise<ReportExecutionResultDto>;
    private applySelectionCriteria;
    private getFieldValue;
    private mapToResponseDto;
}
//# sourceMappingURL=reports.service.d.ts.map