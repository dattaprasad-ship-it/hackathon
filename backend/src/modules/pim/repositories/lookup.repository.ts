import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { JobTitle } from '../entities/job-title.entity';
import { EmploymentStatus } from '../entities/employment-status.entity';
import { SubUnit } from '../entities/sub-unit.entity';
import { ReportingMethod } from '../entities/reporting-method.entity';

export class JobTitleRepository extends IGenericRepository<JobTitle> {
  constructor(repository: Repository<JobTitle>) {
    super(repository);
  }
}

export class EmploymentStatusRepository extends IGenericRepository<EmploymentStatus> {
  constructor(repository: Repository<EmploymentStatus>) {
    super(repository);
  }
}

export class SubUnitRepository extends IGenericRepository<SubUnit> {
  constructor(repository: Repository<SubUnit>) {
    super(repository);
  }
}

export class ReportingMethodRepository extends IGenericRepository<ReportingMethod> {
  constructor(repository: Repository<ReportingMethod>) {
    super(repository);
  }
}

