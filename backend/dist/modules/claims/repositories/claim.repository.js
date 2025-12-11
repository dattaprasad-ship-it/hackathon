"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimRepository = void 0;
const IGenericRepository_1 = require("../../../common/base/IGenericRepository");
class ClaimRepository extends IGenericRepository_1.IGenericRepository {
    constructor(repository) {
        super(repository);
    }
    async findByReferenceId(referenceId) {
        return this.repository.findOne({
            where: { referenceId },
            relations: ['employee', 'eventType', 'currency', 'expenses', 'attachments', 'approver'],
        });
    }
    async findByEmployeeId(employeeId) {
        return this.repository.find({
            where: { employee: { id: employeeId } },
            relations: ['eventType', 'currency'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByIdWithRelations(id) {
        return this.repository.findOne({
            where: { id },
            relations: [
                'employee',
                'eventType',
                'currency',
                'expenses',
                'expenses.expenseType',
                'attachments',
                'approver',
            ],
        });
    }
    async findWithFilters(filters) {
        const { employeeName, referenceId, eventTypeId, status, fromDate, toDate, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC', } = filters;
        const queryBuilder = this.repository
            .createQueryBuilder('claim')
            .leftJoinAndSelect('claim.employee', 'employee')
            .leftJoinAndSelect('claim.eventType', 'eventType')
            .leftJoinAndSelect('claim.currency', 'currency')
            .leftJoinAndSelect('claim.approver', 'approver');
        if (employeeName) {
            queryBuilder.andWhere('(employee.firstName LIKE :employeeName OR employee.lastName LIKE :employeeName OR CONCAT(employee.firstName, " ", employee.lastName) LIKE :employeeName)', { employeeName: `%${employeeName}%` });
        }
        if (referenceId) {
            queryBuilder.andWhere('claim.referenceId LIKE :referenceId', { referenceId: `%${referenceId}%` });
        }
        if (eventTypeId) {
            queryBuilder.andWhere('claim.eventType.id = :eventTypeId', { eventTypeId });
        }
        if (status) {
            queryBuilder.andWhere('claim.status = :status', { status });
        }
        if (fromDate && toDate) {
            queryBuilder.andWhere('claim.submittedDate BETWEEN :fromDate AND :toDate', {
                fromDate: fromDate.toISOString().split('T')[0],
                toDate: toDate.toISOString().split('T')[0],
            });
        }
        else if (fromDate) {
            queryBuilder.andWhere('claim.submittedDate >= :fromDate', {
                fromDate: fromDate.toISOString().split('T')[0],
            });
        }
        else if (toDate) {
            queryBuilder.andWhere('claim.submittedDate <= :toDate', {
                toDate: toDate.toISOString().split('T')[0],
            });
        }
        const validSortFields = [
            'referenceId',
            'status',
            'submittedDate',
            'totalAmount',
            'createdAt',
            'updatedAt',
        ];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const orderBy = `claim.${sortField}`;
        queryBuilder.orderBy(orderBy, sortOrder);
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        const [claims, total] = await queryBuilder.getManyAndCount();
        return { claims, total };
    }
}
exports.ClaimRepository = ClaimRepository;
//# sourceMappingURL=claim.repository.js.map