"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmployeesRoutes = void 0;
const express_1 = require("express");
const employees_validator_1 = require("../validators/employees.validator");
const jwt_auth_middleware_1 = require("../../authentication/middleware/jwt-auth.middleware");
const mapEmployeeToResponse = (employee) => {
    return {
        id: employee.id,
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        middleName: employee.middleName,
        lastName: employee.lastName,
        jobTitle: employee.jobTitle
            ? {
                id: employee.jobTitle.id,
                title: employee.jobTitle.title,
            }
            : undefined,
        employmentStatus: employee.employmentStatus
            ? {
                id: employee.employmentStatus.id,
                status: employee.employmentStatus.status,
            }
            : undefined,
        subUnit: employee.subUnit
            ? {
                id: employee.subUnit.id,
                name: employee.subUnit.name,
            }
            : undefined,
        supervisor: employee.supervisor
            ? {
                id: employee.supervisor.id,
                employeeId: employee.supervisor.employeeId,
                firstName: employee.supervisor.firstName,
                lastName: employee.supervisor.lastName,
            }
            : undefined,
        reportingMethod: employee.reportingMethod
            ? {
                id: employee.reportingMethod.id,
                name: employee.reportingMethod.name,
            }
            : undefined,
        profilePhotoPath: employee.profilePhotoPath,
        username: employee.username,
        loginStatus: employee.loginStatus,
        isDeleted: employee.isDeleted,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
    };
};
const createEmployeesRoutes = (employeesService, userRepository) => {
    const router = (0, express_1.Router)();
    router.get('/', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), employees_validator_1.validateEmployeeListQuery, employees_validator_1.validate, async (req, res, next) => {
        try {
            const query = req.query;
            const filters = {
                employeeName: query.employeeName,
                employeeId: query.employeeId,
                employmentStatusId: query.employmentStatusId,
                jobTitleId: query.jobTitleId,
                subUnitId: query.subUnitId,
                supervisorId: query.supervisorId,
                include: query.include || 'current',
                page: query.page ? parseInt(query.page, 10) : 1,
                limit: query.limit ? parseInt(query.limit, 10) : 50,
                sortBy: query.sortBy || 'createdAt',
                sortOrder: query.sortOrder || 'DESC',
            };
            const { employees, total } = await employeesService.list(filters);
            const totalPages = Math.ceil(total / filters.limit);
            const response = {
                data: employees.map(mapEmployeeToResponse),
                pagination: {
                    page: filters.page,
                    limit: filters.limit,
                    total,
                    totalPages,
                },
                recordCount: `(${total}) Records Found`,
            };
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    });
    router.get('/:id', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), async (req, res, next) => {
        try {
            const employee = await employeesService.findById(req.params.id);
            if (!employee) {
                res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Employee not found',
                    },
                });
                return;
            }
            res.status(200).json(mapEmployeeToResponse(employee));
        }
        catch (error) {
            next(error);
        }
    });
    router.post('/', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), employees_validator_1.validateCreateEmployee, employees_validator_1.validate, async (req, res, next) => {
        try {
            const dto = req.body;
            const employee = await employeesService.create(dto);
            res.status(201).json(mapEmployeeToResponse(employee));
        }
        catch (error) {
            next(error);
        }
    });
    router.put('/:id', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), employees_validator_1.validateUpdateEmployee, employees_validator_1.validate, async (req, res, next) => {
        try {
            const dto = req.body;
            const employee = await employeesService.update(req.params.id, dto);
            res.status(200).json(mapEmployeeToResponse(employee));
        }
        catch (error) {
            next(error);
        }
    });
    router.delete('/:id', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), async (req, res, next) => {
        try {
            await employeesService.delete(req.params.id);
            res.status(200).json({
                message: 'Employee deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    });
    return router;
};
exports.createEmployeesRoutes = createEmployeesRoutes;
//# sourceMappingURL=employees.routes.js.map