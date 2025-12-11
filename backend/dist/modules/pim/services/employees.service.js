"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesService = void 0;
const business_exception_1 = require("../../../common/exceptions/business.exception");
const password_util_1 = require("../../authentication/utils/password.util");
const logger_1 = require("../../../utils/logger");
class EmployeesService {
    constructor(employeeRepository, jobTitleRepository, employmentStatusRepository, subUnitRepository, reportingMethodRepository) {
        this.employeeRepository = employeeRepository;
        this.jobTitleRepository = jobTitleRepository;
        this.employmentStatusRepository = employmentStatusRepository;
        this.subUnitRepository = subUnitRepository;
        this.reportingMethodRepository = reportingMethodRepository;
    }
    async list(filters) {
        return this.employeeRepository.findWithFilters(filters);
    }
    async findById(id) {
        return this.employeeRepository.findById(id);
    }
    async create(dto) {
        if (!dto.firstName || !dto.lastName) {
            throw new business_exception_1.BusinessException('First name and last name are required', 400, 'VALIDATION_ERROR');
        }
        if (!dto.employeeId) {
            throw new business_exception_1.BusinessException('Employee ID is required', 400, 'VALIDATION_ERROR');
        }
        const existingEmployee = await this.employeeRepository.findByEmployeeId(dto.employeeId);
        if (existingEmployee) {
            throw new business_exception_1.BusinessException('Employee ID already exists', 409, 'CONFLICT');
        }
        if (dto.createLoginDetails) {
            if (!dto.username || !dto.password || !dto.confirmPassword) {
                throw new business_exception_1.BusinessException('Username, password, and confirm password are required when creating login details', 400, 'VALIDATION_ERROR');
            }
            if (dto.password !== dto.confirmPassword) {
                throw new business_exception_1.BusinessException('Password and confirm password do not match', 400, 'VALIDATION_ERROR');
            }
            const existingUsername = await this.employeeRepository.findByUsername(dto.username);
            if (existingUsername) {
                throw new business_exception_1.BusinessException('Username already exists', 409, 'CONFLICT');
            }
        }
        if (dto.jobTitleId) {
            const jobTitle = await this.jobTitleRepository.findById(dto.jobTitleId);
            if (!jobTitle) {
                throw new business_exception_1.BusinessException('Invalid job title', 400, 'VALIDATION_ERROR');
            }
        }
        if (dto.employmentStatusId) {
            const employmentStatus = await this.employmentStatusRepository.findById(dto.employmentStatusId);
            if (!employmentStatus) {
                throw new business_exception_1.BusinessException('Invalid employment status', 400, 'VALIDATION_ERROR');
            }
        }
        if (dto.subUnitId) {
            const subUnit = await this.subUnitRepository.findById(dto.subUnitId);
            if (!subUnit) {
                throw new business_exception_1.BusinessException('Invalid sub-unit', 400, 'VALIDATION_ERROR');
            }
        }
        if (dto.supervisorId) {
            const supervisor = await this.employeeRepository.findById(dto.supervisorId);
            if (!supervisor || supervisor.isDeleted) {
                throw new business_exception_1.BusinessException('Invalid supervisor', 400, 'VALIDATION_ERROR');
            }
        }
        if (dto.reportingMethodId) {
            const reportingMethod = await this.reportingMethodRepository.findById(dto.reportingMethodId);
            if (!reportingMethod) {
                throw new business_exception_1.BusinessException('Invalid reporting method', 400, 'VALIDATION_ERROR');
            }
        }
        const employeeData = {
            employeeId: dto.employeeId,
            firstName: dto.firstName,
            middleName: dto.middleName,
            lastName: dto.lastName,
            profilePhotoPath: dto.profilePhotoPath,
            isDeleted: false,
        };
        if (dto.jobTitleId) {
            employeeData.jobTitle = { id: dto.jobTitleId };
        }
        if (dto.employmentStatusId) {
            employeeData.employmentStatus = { id: dto.employmentStatusId };
        }
        if (dto.subUnitId) {
            employeeData.subUnit = { id: dto.subUnitId };
        }
        if (dto.supervisorId) {
            employeeData.supervisor = { id: dto.supervisorId };
        }
        if (dto.reportingMethodId) {
            employeeData.reportingMethod = { id: dto.reportingMethodId };
        }
        if (dto.createLoginDetails && dto.username && dto.password) {
            employeeData.username = dto.username;
            employeeData.passwordHash = await password_util_1.passwordUtil.hashPassword(dto.password);
            employeeData.loginStatus = dto.loginStatus || 'Enabled';
        }
        const employee = await this.employeeRepository.create(employeeData);
        logger_1.logger.info('Employee created', {
            employeeId: employee.employeeId,
            id: employee.id,
        });
        return employee;
    }
    async update(id, dto) {
        const employee = await this.employeeRepository.findById(id);
        if (!employee || employee.isDeleted) {
            throw new business_exception_1.BusinessException('Employee not found', 404, 'NOT_FOUND');
        }
        if (dto.employeeId && dto.employeeId !== employee.employeeId) {
            const existingEmployee = await this.employeeRepository.findByEmployeeId(dto.employeeId);
            if (existingEmployee && existingEmployee.id !== id) {
                throw new business_exception_1.BusinessException('Employee ID already exists', 409, 'CONFLICT');
            }
        }
        if (dto.username && dto.username !== employee.username) {
            const existingUsername = await this.employeeRepository.findByUsername(dto.username);
            if (existingUsername) {
                throw new business_exception_1.BusinessException('Username already exists', 409, 'CONFLICT');
            }
        }
        const updateData = {};
        if (dto.firstName !== undefined)
            updateData.firstName = dto.firstName;
        if (dto.middleName !== undefined)
            updateData.middleName = dto.middleName;
        if (dto.lastName !== undefined)
            updateData.lastName = dto.lastName;
        if (dto.employeeId !== undefined)
            updateData.employeeId = dto.employeeId;
        if (dto.profilePhotoPath !== undefined)
            updateData.profilePhotoPath = dto.profilePhotoPath;
        if (dto.jobTitleId) {
            const jobTitle = await this.jobTitleRepository.findById(dto.jobTitleId);
            if (!jobTitle) {
                throw new business_exception_1.BusinessException('Invalid job title', 400, 'VALIDATION_ERROR');
            }
            updateData.jobTitle = { id: dto.jobTitleId };
        }
        if (dto.employmentStatusId) {
            const employmentStatus = await this.employmentStatusRepository.findById(dto.employmentStatusId);
            if (!employmentStatus) {
                throw new business_exception_1.BusinessException('Invalid employment status', 400, 'VALIDATION_ERROR');
            }
            updateData.employmentStatus = { id: dto.employmentStatusId };
        }
        if (dto.subUnitId) {
            const subUnit = await this.subUnitRepository.findById(dto.subUnitId);
            if (!subUnit) {
                throw new business_exception_1.BusinessException('Invalid sub-unit', 400, 'VALIDATION_ERROR');
            }
            updateData.subUnit = { id: dto.subUnitId };
        }
        if (dto.supervisorId) {
            const supervisor = await this.employeeRepository.findById(dto.supervisorId);
            if (!supervisor || supervisor.isDeleted) {
                throw new business_exception_1.BusinessException('Invalid supervisor', 400, 'VALIDATION_ERROR');
            }
            updateData.supervisor = { id: dto.supervisorId };
        }
        if (dto.username)
            updateData.username = dto.username;
        if (dto.loginStatus)
            updateData.loginStatus = dto.loginStatus;
        if (dto.password) {
            updateData.passwordHash = await password_util_1.passwordUtil.hashPassword(dto.password);
        }
        await this.employeeRepository.update(id, updateData);
        logger_1.logger.info('Employee updated', {
            employeeId: employee.employeeId,
            id: employee.id,
        });
        const updatedEmployee = await this.employeeRepository.findById(id);
        return updatedEmployee;
    }
    async delete(id) {
        const employee = await this.employeeRepository.findById(id);
        if (!employee || employee.isDeleted) {
            throw new business_exception_1.BusinessException('Employee not found', 404, 'NOT_FOUND');
        }
        const subordinates = await this.employeeRepository.findSubordinates(id);
        if (subordinates.length > 0) {
            throw new business_exception_1.BusinessException('Cannot delete employee with subordinates', 400, 'VALIDATION_ERROR');
        }
        await this.employeeRepository.softDelete(id);
        logger_1.logger.info('Employee deleted', {
            employeeId: employee.employeeId,
            id: employee.id,
        });
    }
}
exports.EmployeesService = EmployeesService;
//# sourceMappingURL=employees.service.js.map