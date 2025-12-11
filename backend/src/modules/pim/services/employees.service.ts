import { EmployeeRepository } from '../repositories/employee.repository';
import { JobTitleRepository, EmploymentStatusRepository, SubUnitRepository, ReportingMethodRepository } from '../repositories/lookup.repository';
import { Employee } from '../entities/employee.entity';
import { BusinessException } from '../../../common/exceptions/business.exception';
import { passwordUtil } from '../../authentication/utils/password.util';
import { logger } from '../../../utils/logger';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeListQueryDto,
} from '../dto/employees.dto';

export class EmployeesService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly jobTitleRepository: JobTitleRepository,
    private readonly employmentStatusRepository: EmploymentStatusRepository,
    private readonly subUnitRepository: SubUnitRepository,
    private readonly reportingMethodRepository: ReportingMethodRepository
  ) {}

  async list(filters: EmployeeListQueryDto): Promise<{ employees: Employee[]; total: number }> {
    return this.employeeRepository.findWithFilters(filters);
  }

  async findById(id: string): Promise<Employee | null> {
    return this.employeeRepository.findById(id);
  }

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    if (!dto.firstName || !dto.lastName) {
      throw new BusinessException('First name and last name are required', 400, 'VALIDATION_ERROR');
    }

    if (!dto.employeeId) {
      throw new BusinessException('Employee ID is required', 400, 'VALIDATION_ERROR');
    }

    const existingEmployee = await this.employeeRepository.findByEmployeeId(dto.employeeId);
    if (existingEmployee) {
      throw new BusinessException('Employee ID already exists', 409, 'CONFLICT');
    }

    if (dto.createLoginDetails) {
      if (!dto.username || !dto.password || !dto.confirmPassword) {
        throw new BusinessException('Username, password, and confirm password are required when creating login details', 400, 'VALIDATION_ERROR');
      }

      if (dto.password !== dto.confirmPassword) {
        throw new BusinessException('Password and confirm password do not match', 400, 'VALIDATION_ERROR');
      }

      const existingUsername = await this.employeeRepository.findByUsername(dto.username);
      if (existingUsername) {
        throw new BusinessException('Username already exists', 409, 'CONFLICT');
      }
    }

    if (dto.jobTitleId) {
      const jobTitle = await this.jobTitleRepository.findById(dto.jobTitleId);
      if (!jobTitle) {
        throw new BusinessException('Invalid job title', 400, 'VALIDATION_ERROR');
      }
    }

    if (dto.employmentStatusId) {
      const employmentStatus = await this.employmentStatusRepository.findById(dto.employmentStatusId);
      if (!employmentStatus) {
        throw new BusinessException('Invalid employment status', 400, 'VALIDATION_ERROR');
      }
    }

    if (dto.subUnitId) {
      const subUnit = await this.subUnitRepository.findById(dto.subUnitId);
      if (!subUnit) {
        throw new BusinessException('Invalid sub-unit', 400, 'VALIDATION_ERROR');
      }
    }

    if (dto.supervisorId) {
      const supervisor = await this.employeeRepository.findById(dto.supervisorId);
      if (!supervisor || supervisor.isDeleted) {
        throw new BusinessException('Invalid supervisor', 400, 'VALIDATION_ERROR');
      }
    }

    if (dto.reportingMethodId) {
      const reportingMethod = await this.reportingMethodRepository.findById(dto.reportingMethodId);
      if (!reportingMethod) {
        throw new BusinessException('Invalid reporting method', 400, 'VALIDATION_ERROR');
      }
    }

    const employeeData: Partial<Employee> = {
      employeeId: dto.employeeId,
      firstName: dto.firstName,
      middleName: dto.middleName,
      lastName: dto.lastName,
      profilePhotoPath: dto.profilePhotoPath,
      isDeleted: false,
    };

    if (dto.jobTitleId) {
      employeeData.jobTitle = { id: dto.jobTitleId } as any;
    }

    if (dto.employmentStatusId) {
      employeeData.employmentStatus = { id: dto.employmentStatusId } as any;
    }

    if (dto.subUnitId) {
      employeeData.subUnit = { id: dto.subUnitId } as any;
    }

    if (dto.supervisorId) {
      employeeData.supervisor = { id: dto.supervisorId } as any;
    }

    if (dto.reportingMethodId) {
      employeeData.reportingMethod = { id: dto.reportingMethodId } as any;
    }

    if (dto.createLoginDetails && dto.username && dto.password) {
      employeeData.username = dto.username;
      employeeData.passwordHash = await passwordUtil.hashPassword(dto.password);
      employeeData.loginStatus = dto.loginStatus || 'Enabled';
    }

    const employee = await this.employeeRepository.create(employeeData);

    logger.info('Employee created', {
      employeeId: employee.employeeId,
      id: employee.id,
    });

    return employee;
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.employeeRepository.findById(id);
    if (!employee || employee.isDeleted) {
      throw new BusinessException('Employee not found', 404, 'NOT_FOUND');
    }

    if (dto.employeeId && dto.employeeId !== employee.employeeId) {
      const existingEmployee = await this.employeeRepository.findByEmployeeId(dto.employeeId);
      if (existingEmployee && existingEmployee.id !== id) {
        throw new BusinessException('Employee ID already exists', 409, 'CONFLICT');
      }
    }

    if (dto.username && dto.username !== employee.username) {
      const existingUsername = await this.employeeRepository.findByUsername(dto.username);
      if (existingUsername) {
        throw new BusinessException('Username already exists', 409, 'CONFLICT');
      }
    }

    const updateData: Partial<Employee> = {};

    if (dto.firstName !== undefined) updateData.firstName = dto.firstName;
    if (dto.middleName !== undefined) updateData.middleName = dto.middleName;
    if (dto.lastName !== undefined) updateData.lastName = dto.lastName;
    if (dto.employeeId !== undefined) updateData.employeeId = dto.employeeId;
    if (dto.profilePhotoPath !== undefined) updateData.profilePhotoPath = dto.profilePhotoPath;

    if (dto.jobTitleId) {
      const jobTitle = await this.jobTitleRepository.findById(dto.jobTitleId);
      if (!jobTitle) {
        throw new BusinessException('Invalid job title', 400, 'VALIDATION_ERROR');
      }
      updateData.jobTitle = { id: dto.jobTitleId } as any;
    }

    if (dto.employmentStatusId) {
      const employmentStatus = await this.employmentStatusRepository.findById(dto.employmentStatusId);
      if (!employmentStatus) {
        throw new BusinessException('Invalid employment status', 400, 'VALIDATION_ERROR');
      }
      updateData.employmentStatus = { id: dto.employmentStatusId } as any;
    }

    if (dto.subUnitId) {
      const subUnit = await this.subUnitRepository.findById(dto.subUnitId);
      if (!subUnit) {
        throw new BusinessException('Invalid sub-unit', 400, 'VALIDATION_ERROR');
      }
      updateData.subUnit = { id: dto.subUnitId } as any;
    }

    if (dto.supervisorId) {
      const supervisor = await this.employeeRepository.findById(dto.supervisorId);
      if (!supervisor || supervisor.isDeleted) {
        throw new BusinessException('Invalid supervisor', 400, 'VALIDATION_ERROR');
      }
      updateData.supervisor = { id: dto.supervisorId } as any;
    }

    if (dto.username) updateData.username = dto.username;
    if (dto.loginStatus) updateData.loginStatus = dto.loginStatus;

    if (dto.password) {
      updateData.passwordHash = await passwordUtil.hashPassword(dto.password);
    }

    await this.employeeRepository.update(id, updateData);

    logger.info('Employee updated', {
      employeeId: employee.employeeId,
      id: employee.id,
    });

    const updatedEmployee = await this.employeeRepository.findById(id);
    return updatedEmployee!;
  }

  async delete(id: string): Promise<void> {
    const employee = await this.employeeRepository.findById(id);
    if (!employee || employee.isDeleted) {
      throw new BusinessException('Employee not found', 404, 'NOT_FOUND');
    }

    const subordinates = await this.employeeRepository.findSubordinates(id);
    if (subordinates.length > 0) {
      throw new BusinessException('Cannot delete employee with subordinates', 400, 'VALIDATION_ERROR');
    }

    await this.employeeRepository.softDelete(id);

    logger.info('Employee deleted', {
      employeeId: employee.employeeId,
      id: employee.id,
    });
  }
}

