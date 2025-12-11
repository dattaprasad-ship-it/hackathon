import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { Report } from '../entities/report.entity';
export declare class ReportRepository extends IGenericRepository<Report> {
    constructor(repository: Repository<Report>);
    findByReportName(reportName: string, excludePredefined?: boolean): Promise<Report | null>;
    findAllWithRelations(): Promise<Report[]>;
    findPredefinedReports(): Promise<Report[]>;
    findCustomReports(): Promise<Report[]>;
    searchReports(reportName?: string): Promise<Report[]>;
}
//# sourceMappingURL=report.repository.d.ts.map