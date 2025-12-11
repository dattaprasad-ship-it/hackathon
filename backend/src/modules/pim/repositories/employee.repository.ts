import { Repository, FindOptionsWhere, ILike, Not } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { Employee } from '../entities/employee.entity';

export class EmployeeRepository extends IGenericRepository<Employee> {
  constructor(repository: Repository<Employee>) {
    super(repository);
  }

  async findByEmployeeId(employeeId: string, excludeDeleted: boolean = true): Promise<Employee | null> {
    const where: FindOptionsWhere<Employee> = {
      employeeId: ILike(employeeId),
    } as FindOptionsWhere<Employee>;

    if (excludeDeleted) {
      where.isDeleted = false;
    }

    return this.repository.findOne({
      where,
      relations: ['jobTitle', 'employmentStatus', 'subUnit', 'supervisor', 'reportingMethod'],
    });
  }

  async findByUsername(username: string): Promise<Employee | null> {
    return this.repository.findOne({
      where: {
        username: ILike(username),
        isDeleted: false,
      } as FindOptionsWhere<Employee>,
    });
  }

  async findWithFilters(filters: {
    employeeName?: string;
    employeeId?: string;
    employmentStatusId?: string;
    jobTitleId?: string;
    subUnitId?: string;
    supervisorId?: string;
    include?: 'current' | 'all';
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{ employees: Employee[]; total: number }> {
    const {
      employeeName,
      employeeId,
      employmentStatusId,
      jobTitleId,
      subUnitId,
      supervisorId,
      include = 'current',
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filters;

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
      queryBuilder.andWhere(
        '(employee.firstName LIKE :name OR employee.middleName LIKE :name OR employee.lastName LIKE :name OR CONCAT(employee.firstName, " ", COALESCE(employee.middleName, ""), " ", employee.lastName) LIKE :name)',
        { name: `%${employeeName}%` }
      );
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

  async findSubordinates(supervisorId: string): Promise<Employee[]> {
    return this.repository.find({
      where: {
        supervisor: { id: supervisorId } as any,
        isDeleted: false,
      } as FindOptionsWhere<Employee>,
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.update(id, { isDeleted: true } as Partial<Employee>);
  }
}

