import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { Report } from '../entities/report.entity';

export class ReportRepository extends IGenericRepository<Report> {
  constructor(repository: Repository<Report>) {
    super(repository);
  }

  async findByReportName(reportName: string, excludePredefined: boolean = false): Promise<Report | null> {
    const where: FindOptionsWhere<Report> = {
      reportName: ILike(reportName),
    } as FindOptionsWhere<Report>;

    if (excludePredefined) {
      where.isPredefined = false;
    }

    return this.repository.findOne({
      where,
      relations: ['selectionCriteria', 'displayFields'],
    });
  }

  async findAllWithRelations(): Promise<Report[]> {
    return this.repository.find({
      relations: ['selectionCriteria', 'displayFields'],
      order: { reportName: 'ASC' },
    });
  }

  async findPredefinedReports(): Promise<Report[]> {
    return this.repository.find({
      where: { isPredefined: true } as FindOptionsWhere<Report>,
      relations: ['selectionCriteria', 'displayFields'],
      order: { reportName: 'ASC' },
    });
  }

  async findCustomReports(): Promise<Report[]> {
    return this.repository.find({
      where: { isPredefined: false } as FindOptionsWhere<Report>,
      relations: ['selectionCriteria', 'displayFields'],
      order: { reportName: 'ASC' },
    });
  }

  async searchReports(reportName?: string): Promise<Report[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.selectionCriteria', 'criteria')
      .leftJoinAndSelect('report.displayFields', 'displayFields')
      .orderBy('report.reportName', 'ASC');

    if (reportName) {
      queryBuilder.where('LOWER(report.reportName) LIKE LOWER(:reportName)', {
        reportName: `%${reportName}%`,
      });
    }

    return queryBuilder.getMany();
  }
}

