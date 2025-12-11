"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRepository = void 0;
const typeorm_1 = require("typeorm");
const IGenericRepository_1 = require("../../../common/base/IGenericRepository");
class EmployeeRepository extends IGenericRepository_1.IGenericRepository {
    constructor(repository) {
        super(repository);
    }
    async findByEmployeeId(employeeId, excludeDeleted = true) {
        const where = {
            employeeId: (0, typeorm_1.ILike)(employeeId),
        };
        if (excludeDeleted) {
            where.isDeleted = false;
        }
        return this.repository.findOne({
            where,
            relations: ['jobTitle', 'employmentStatus', 'subUnit', 'supervisor', 'reportingMethod'],
        });
    }
    async findByUsername(username) {
        return this.repository.findOne({
            where: {
                username: (0, typeorm_1.ILike)(username),
                isDeleted: false,
            },
        });
    }
    async findWithFilters(filters) {
        const { employeeName, employeeId, employmentStatusId, jobTitleId, subUnitId, supervisorId, include = 'current', page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'DESC', } = filters;
        const queryBuilder = this.repository.createQueryBuilder('employee')
            .leftJoinAndSelect('employee.jobTitle', 'jobTitle')
            .leftJoinAndSelect('employee.employmentStatus', 'employmentStatus')
            .leftJoinAndSelect('employee.subUnit', 'subUnit')
            .leftJoinAndSelect('employee.supervisor', 'supervisor')
            .leftJoinAndSelect('employee.reportingMethod', 'reportingMethod');
        if (include === 'current') {
            queryBuilder.where('employee.isDeleted = :isDeleted', { isDeleted: false });
        }
        if (employeeName) {
            queryBuilder.andWhere('(employee.firstName LIKE :name OR employee.middleName LIKE :name OR employee.lastName LIKE :name OR CONCAT(employee.firstName, " ", COALESCE(employee.middleName, ""), " ", employee.lastName) LIKE :name)', { name: `%${employeeName}%` });
        }
        if (employeeId) {
            queryBuilder.andWhere('employee.employeeId LIKE :employeeId', { employeeId: `%${employeeId}%` });
        }
        if (employmentStatusId) {
            queryBuilder.andWhere('employee.employmentStatus = :employmentStatusId', { employmentStatusId });
        }
        if (jobTitleId) {
            queryBuilder.andWhere('employee.jobTitle = :jobTitleId', { jobTitleId });
        }
        if (subUnitId) {
            queryBuilder.andWhere('employee.subUnit = :subUnitId', { subUnitId });
        }
        if (supervisorId) {
            queryBuilder.andWhere('employee.supervisor = :supervisorId', { supervisorId });
        }
        const validSortFields = ['employeeId', 'firstName', 'lastName', 'createdAt', 'updatedAt'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const orderBy = `employee.${sortField}`;
        queryBuilder.orderBy(orderBy, sortOrder);
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        const [employees, total] = await queryBuilder.getManyAndCount();
        return { employees, total };
    }
    async findSubordinates(supervisorId) {
        return this.repository.find({
            where: {
                supervisor: { id: supervisorId },
                isDeleted: false,
            },
        });
    }
    async softDelete(id) {
        await this.repository.update(id, { isDeleted: true });
    }
}
exports.EmployeeRepository = EmployeeRepository;
//# sourceMappingURL=employee.repository.js.map