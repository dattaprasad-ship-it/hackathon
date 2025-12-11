import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { JobTitle } from '../entities/job-title.entity';
import { EmploymentStatus } from '../entities/employment-status.entity';
import { SubUnit } from '../entities/sub-unit.entity';
import { ReportingMethod } from '../entities/reporting-method.entity';
export declare class JobTitleRepository extends IGenericRepository<JobTitle> {
    constructor(repository: Repository<JobTitle>);
}
export declare class EmploymentStatusRepository extends IGenericRepository<EmploymentStatus> {
    constructor(repository: Repository<EmploymentStatus>);
}
export declare class SubUnitRepository extends IGenericRepository<SubUnit> {
    constructor(repository: Repository<SubUnit>);
}
export declare class ReportingMethodRepository extends IGenericRepository<ReportingMethod> {
    constructor(repository: Repository<ReportingMethod>);
}
//# sourceMappingURL=lookup.repository.d.ts.map