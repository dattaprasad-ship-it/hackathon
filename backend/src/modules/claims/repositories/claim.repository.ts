import { Repository, Between } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { Claim } from '../entities/claim.entity';

export class ClaimRepository extends IGenericRepository<Claim> {
  constructor(repository: Repository<Claim>) {
    super(repository);
  }

  async findByReferenceId(referenceId: string): Promise<Claim | null> {
    return this.repository.findOne({
      where: { referenceId },
      relations: ['employee', 'eventType', 'currency', 'expenses', 'attachments', 'approver'],
    });
  }

  async findByEmployeeId(employeeId: string): Promise<Claim[]> {
    return this.repository.find({
      where: { employee: { id: employeeId } },
      relations: ['eventType', 'currency'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByIdWithRelations(id: string): Promise<Claim | null> {
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

  async findWithFilters(filters: {
    employeeName?: string;
    referenceId?: string;
    eventTypeId?: string;
    status?: Claim['status'];
    include?: 'current_employees_only' | 'past_employees_only' | 'all_employees' | 'active_claims_only' | 'closed_claims_only' | 'pending_payment';
    fromDate?: Date;
    toDate?: Date;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{ claims: Claim[]; total: number }> {
    const {
      employeeName,
      referenceId,
      eventTypeId,
      status,
      include = 'current_employees_only',
      fromDate,
      toDate,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filters;

    const queryBuilder = this.repository
      .createQueryBuilder('claim')
      .leftJoinAndSelect('claim.employee', 'employee')
      .leftJoinAndSelect('employee.employmentStatus', 'employmentStatus')
      .leftJoinAndSelect('claim.eventType', 'eventType')
      .leftJoinAndSelect('claim.currency', 'currency')
      .leftJoinAndSelect('claim.approver', 'approver');

    if (employeeName) {
      queryBuilder.andWhere(
        '(employee.firstName LIKE :employeeName OR employee.lastName LIKE :employeeName OR (COALESCE(employee.firstName, \'\') || \' \' || COALESCE(employee.lastName, \'\')) LIKE :employeeName)',
        { employeeName: `%${employeeName}%` }
      );
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

    // Handle include filter for employee status
    if (include === 'past_employees_only') {
      // Filter for past employees (deleted employees)
      // Note: For terminated employees, we check isDeleted flag
      queryBuilder.andWhere('employee.isDeleted = :trueValue', {
        trueValue: true,
      });
    } else if (include === 'current_employees_only') {
      // Filter for current employees only (default) - not deleted
      queryBuilder.andWhere('employee.isDeleted = :falseValue', {
        falseValue: false,
      });
    }
    // 'all_employees' doesn't need additional filtering

    // Handle claim status filters
    if (include === 'active_claims_only') {
      // Active claims: not in final states (Paid, Cancelled)
      queryBuilder.andWhere('claim.status NOT IN (:...closedStatuses)', {
        closedStatuses: ['Paid', 'Cancelled'],
      });
    } else if (include === 'closed_claims_only') {
      // Closed claims: Paid or Cancelled
      queryBuilder.andWhere('claim.status IN (:...closedStatuses)', {
        closedStatuses: ['Paid', 'Cancelled'],
      });
    } else if (include === 'pending_payment') {
      // Pending payment: Approved but not Paid
      queryBuilder.andWhere('claim.status = :approvedStatus', {
        approvedStatus: 'Approved',
      });
    }

    if (fromDate && toDate) {
      queryBuilder.andWhere('claim.submittedDate BETWEEN :fromDate AND :toDate', {
        fromDate: fromDate.toISOString().split('T')[0],
        toDate: toDate.toISOString().split('T')[0],
      });
    } else if (fromDate) {
      queryBuilder.andWhere('claim.submittedDate >= :fromDate', {
        fromDate: fromDate.toISOString().split('T')[0],
      });
    } else if (toDate) {
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

