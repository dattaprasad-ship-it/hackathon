import { Router, Request, Response, NextFunction } from 'express';
import { EmployeesService } from '../services/employees.service';
import {
  validateCreateEmployee,
  validateUpdateEmployee,
  validateEmployeeListQuery,
  validate,
} from '../validators/employees.validator';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeListQueryDto,
  EmployeeResponseDto,
  EmployeeListResponseDto,
} from '../dto/employees.dto';
import { jwtAuthMiddleware, AuthenticatedRequest } from '../../authentication/middleware/jwt-auth.middleware';
import { UserRepository } from '../../authentication/repositories/user.repository';

const mapEmployeeToResponse = (employee: any): EmployeeResponseDto => {
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

export const createEmployeesRoutes = (
  employeesService: EmployeesService,
  userRepository: UserRepository
): Router => {
  const router = Router();

  router.get(
    '/',
    jwtAuthMiddleware(userRepository),
    validateEmployeeListQuery,
    validate,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const filters: EmployeeListQueryDto = {
          employeeName: query.employeeName && typeof query.employeeName === 'string' ? query.employeeName.trim() : undefined,
          employeeId: query.employeeId && typeof query.employeeId === 'string' ? query.employeeId.trim() : undefined,
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

        const totalPages = Math.ceil(total / filters.limit!);
        const response: EmployeeListResponseDto = {
          data: employees.map(mapEmployeeToResponse),
          pagination: {
            page: filters.page!,
            limit: filters.limit!,
            total,
            totalPages,
          },
          recordCount: `(${total}) Records Found`,
        };

        res.status(200).json(response);
      } catch (error) {
        next(error);
      }
    }
  );

  router.get(
    '/:id',
    jwtAuthMiddleware(userRepository),
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    '/',
    jwtAuthMiddleware(userRepository),
    validateCreateEmployee,
    validate,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const dto: CreateEmployeeDto = req.body;
        const employee = await employeesService.create(dto);

        res.status(201).json(mapEmployeeToResponse(employee));
      } catch (error) {
        next(error);
      }
    }
  );

  router.put(
    '/:id',
    jwtAuthMiddleware(userRepository),
    validateUpdateEmployee,
    validate,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const dto: UpdateEmployeeDto = req.body;
        const employee = await employeesService.update(req.params.id, dto);

        res.status(200).json(mapEmployeeToResponse(employee));
      } catch (error) {
        next(error);
      }
    }
  );

  router.delete(
    '/:id',
    jwtAuthMiddleware(userRepository),
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        await employeesService.delete(req.params.id);

        res.status(200).json({
          message: 'Employee deleted successfully',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
};

