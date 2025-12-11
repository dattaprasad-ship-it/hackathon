"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRepository = void 0;
const typeorm_1 = require("typeorm");
const IGenericRepository_1 = require("../../../common/base/IGenericRepository");
class ReportRepository extends IGenericRepository_1.IGenericRepository {
    constructor(repository) {
        super(repository);
    }
    async findByReportName(reportName, excludePredefined = false) {
        const where = {
            reportName: (0, typeorm_1.ILike)(reportName),
        };
        if (excludePredefined) {
            where.isPredefined = false;
        }
        return this.repository.findOne({
            where,
            relations: ['selectionCriteria', 'displayFields'],
        });
    }
    async findAllWithRelations() {
        return this.repository.find({
            relations: ['selectionCriteria', 'displayFields'],
            order: { reportName: 'ASC' },
        });
    }
    async findPredefinedReports() {
        return this.repository.find({
            where: { isPredefined: true },
            relations: ['selectionCriteria', 'displayFields'],
            order: { reportName: 'ASC' },
        });
    }
    async findCustomReports() {
        return this.repository.find({
            where: { isPredefined: false },
            relations: ['selectionCriteria', 'displayFields'],
            order: { reportName: 'ASC' },
        });
    }
    async searchReports(reportName) {
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
exports.ReportRepository = ReportRepository;
//# sourceMappingURL=report.repository.js.map