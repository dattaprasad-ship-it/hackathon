import { ClaimRepository } from '../repositories/claim.repository';
import { EmployeeRepository } from '../../pim/repositories/employee.repository';
import { EventTypeRepository } from '../repositories/event-type.repository';
import { CurrencyRepository } from '../repositories/currency.repository';
import { ExpenseRepository } from '../repositories/expense.repository';
import { AuditLogService } from './audit-log.service';
import { Claim } from '../entities/claim.entity';
import { User } from '../../authentication/entities/user.entity';
import { UserRole } from '../../../constants/enums/user-role.enum';
import { BusinessException } from '../../../common/exceptions/business.exception';
import { logger } from '../../../utils/logger';
import {
  CreateClaimDto,
  UpdateClaimDto,
  ClaimSearchFiltersDto,
  SubmitClaimDto,
  ApproveClaimDto,
  RejectClaimDto,
  ClaimListResponseDto,
} from '../dto/claims.dto';
import { ReferenceIdUtil } from '../utils/reference-id.util';

export class ClaimsService {
  constructor(
    private readonly claimRepository: ClaimRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly eventTypeRepository: EventTypeRepository,
    private readonly currencyRepository: CurrencyRepository,
    private readonly expenseRepository: ExpenseRepository,
    private readonly auditLogService?: AuditLogService
  ) {}

  async create(dto: CreateClaimDto, user: User): Promise<Claim> {
    // Validate employee
    const employee = await this.employeeRepository.findById(dto.employeeId);
    if (!employee) {
      throw new BusinessException('Employee not found', 404, 'NOT_FOUND');
    }

    // Validate event type
    const eventType = await this.eventTypeRepository.findById(dto.eventTypeId);
    if (!eventType) {
      throw new BusinessException('Event type not found', 404, 'NOT_FOUND');
    }

    // Validate currency
    const currency = await this.currencyRepository.findById(dto.currencyId);
    if (!currency) {
      throw new BusinessException('Currency not found', 404, 'NOT_FOUND');
    }

    // Generate reference ID
    const referenceId = await ReferenceIdUtil.generateReferenceId(this.claimRepository);

    // Create claim
    const claim = await this.claimRepository.create({
      referenceId,
      employee,
      eventType,
      currency,
      status: 'Initiated',
      totalAmount: 0,
      remarks: dto.remarks,
      createdBy: user.username,
      updatedBy: user.username,
    } as Partial<Claim>);

    logger.info(`Claim created: ${claim.id} with reference ID: ${referenceId}`, {
      claimId: claim.id,
      referenceId,
      employeeId: dto.employeeId,
      userId: user.id,
    });

    // Create audit log
    if (this.auditLogService) {
      try {
        await this.auditLogService.log({
          entityType: 'Claim',
          entityId: claim.id,
          action: 'CREATE',
          user,
          newValues: {
            referenceId: claim.referenceId,
            employeeId: dto.employeeId,
            eventTypeId: dto.eventTypeId,
            currencyId: dto.currencyId,
            status: 'Initiated',
          },
        });
      } catch (error) {
        // Audit logging failure should not break the main flow
        logger.error('Failed to create audit log for claim creation', { error, claimId: claim.id });
      }
    }

    return claim;
  }

  async search(filters: ClaimSearchFiltersDto): Promise<{ claims: Claim[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;

    // Convert date strings to Date objects if provided
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : undefined;
    const toDate = filters.toDate ? new Date(filters.toDate) : undefined;

    const result = await this.claimRepository.findWithFilters({
      employeeName: filters.employeeName,
      include: filters.include,
      referenceId: filters.referenceId,
      eventTypeId: filters.eventTypeId,
      status: filters.status,
      fromDate,
      toDate,
      page,
      limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });

    const totalPages = Math.ceil(result.total / limit);

    return {
      claims: result.claims,
      total: result.total,
      page,
      limit,
      totalPages,
    };
  }

  async findById(id: string): Promise<Claim> {
    const claim = await this.claimRepository.findByIdWithRelations(id);
    if (!claim) {
      throw new BusinessException('Claim not found', 404, 'NOT_FOUND');
    }
    return claim;
  }

  async findByEmployeeId(employeeId: string): Promise<Claim[]> {
    const result = await this.claimRepository.findByEmployeeId(employeeId);
    return result;
  }

  async update(id: string, dto: UpdateClaimDto, user: User): Promise<Claim> {
    const claim = await this.claimRepository.findByIdWithRelations(id);
    if (!claim) {
      throw new BusinessException('Claim not found', 404, 'NOT_FOUND');
    }

    // Validate status - can only update if in Initiated status
    if (claim.status !== 'Initiated') {
      throw new BusinessException('Claim cannot be updated. Only claims in Initiated status can be modified.', 400, 'INVALID_STATUS');
    }

    // Validate event type if provided
    if (dto.eventTypeId) {
      const eventType = await this.eventTypeRepository.findById(dto.eventTypeId);
      if (!eventType) {
        throw new BusinessException('Event type not found', 404, 'NOT_FOUND');
      }
      claim.eventType = eventType;
    }

    // Validate currency if provided
    if (dto.currencyId) {
      const currency = await this.currencyRepository.findById(dto.currencyId);
      if (!currency) {
        throw new BusinessException('Currency not found', 404, 'NOT_FOUND');
      }
      claim.currency = currency;
    }

    if (dto.remarks !== undefined) {
      claim.remarks = dto.remarks;
    }

    const oldValues = {
      eventTypeId: claim.eventType.id,
      currencyId: claim.currency.id,
      remarks: claim.remarks,
    };

    claim.updatedBy = user.username;

    await this.claimRepository.update(id, claim);
    const updatedClaim = await this.findById(id);

    logger.info(`Claim updated: ${id}`, { claimId: id, userId: user.id });

    // Create audit log
    if (this.auditLogService) {
      try {
        await this.auditLogService.log({
          entityType: 'Claim',
          entityId: id,
          action: 'UPDATE',
          user,
          oldValues,
          newValues: {
            eventTypeId: updatedClaim.eventType.id,
            currencyId: updatedClaim.currency.id,
            remarks: updatedClaim.remarks,
          },
        });
      } catch (error) {
        logger.error('Failed to create audit log for claim update', { error, claimId: id });
      }
    }

    return updatedClaim;
  }

  async submit(id: string, user: User): Promise<void> {
    const claim = await this.claimRepository.findByIdWithRelations(id);
    if (!claim) {
      throw new BusinessException('Claim not found', 404, 'NOT_FOUND');
    }

    // Validate status
    if (claim.status !== 'Initiated') {
      throw new BusinessException('Claim cannot be submitted. Only claims in Initiated status can be submitted.', 400, 'INVALID_STATUS');
    }

    // Validate expenses
    const expenses = await this.expenseRepository.findByClaimId(id);
    if (!expenses || expenses.length === 0) {
      throw new BusinessException('Claim must have at least one expense before submission', 400, 'VALIDATION_ERROR');
    }

    // Recalculate total amount
    const totalAmount = await this.expenseRepository.calculateTotalAmount(id);
    if (totalAmount <= 0) {
      throw new BusinessException('Claim total amount must be greater than zero', 400, 'VALIDATION_ERROR');
    }

    // Update claim status
    await this.claimRepository.update(id, {
      status: 'Submitted',
      submittedDate: new Date(),
      totalAmount,
      updatedBy: user.username,
    } as Partial<Claim>);

    logger.info(`Claim submitted: ${id}`, { claimId: id, userId: user.id, totalAmount });

    // Create audit log
    if (this.auditLogService) {
      try {
        await this.auditLogService.log({
          entityType: 'Claim',
          entityId: id,
          action: 'SUBMIT',
          user,
          newValues: {
            status: 'Submitted',
            submittedDate: new Date().toISOString(),
            totalAmount,
          },
        });
      } catch (error) {
        logger.error('Failed to create audit log for claim submission', { error, claimId: id });
      }
    }
  }

  async approve(id: string, user: User): Promise<void> {
    const claim = await this.claimRepository.findByIdWithRelations(id);
    if (!claim) {
      throw new BusinessException('Claim not found', 404, 'NOT_FOUND');
    }

    // Validate status - only Submitted claims can be approved
    if (claim.status !== 'Submitted') {
      throw new BusinessException('Only submitted claims can be approved', 400, 'INVALID_STATUS');
    }

    // Update claim status
    await this.claimRepository.update(id, {
      status: 'Approved',
      approvedDate: new Date(),
      approver: user,
      updatedBy: user.username,
    } as Partial<Claim>);

    logger.info(`Claim approved: ${id}`, { claimId: id, approverId: user.id });

    // Create audit log
    if (this.auditLogService) {
      try {
        await this.auditLogService.log({
          entityType: 'Claim',
          entityId: id,
          action: 'APPROVE',
          user,
          newValues: {
            status: 'Approved',
            approvedDate: new Date().toISOString(),
            approverId: user.id,
          },
        });
      } catch (error) {
        logger.error('Failed to create audit log for claim approval', { error, claimId: id });
      }
    }
  }

  async reject(id: string, dto: RejectClaimDto, user: User): Promise<void> {
    if (!dto.rejectionReason || dto.rejectionReason.trim().length === 0) {
      throw new BusinessException('Rejection reason is required', 400, 'VALIDATION_ERROR');
    }

    const claim = await this.claimRepository.findByIdWithRelations(id);
    if (!claim) {
      throw new BusinessException('Claim not found', 404, 'NOT_FOUND');
    }

    // Validate status - only Submitted claims can be rejected
    if (claim.status !== 'Submitted') {
      throw new BusinessException('Only submitted claims can be rejected', 400, 'INVALID_STATUS');
    }

    // Update claim status
    await this.claimRepository.update(id, {
      status: 'Rejected',
      rejectedDate: new Date(),
      rejectionReason: dto.rejectionReason.trim(),
      approver: user,
      updatedBy: user.username,
    } as Partial<Claim>);

    logger.info(`Claim rejected: ${id}`, { claimId: id, approverId: user.id, reason: dto.rejectionReason });

    // Create audit log
    if (this.auditLogService) {
      try {
        await this.auditLogService.log({
          entityType: 'Claim',
          entityId: id,
          action: 'REJECT',
          user,
          newValues: {
            status: 'Rejected',
            rejectedDate: new Date().toISOString(),
            rejectionReason: dto.rejectionReason.trim(),
            approverId: user.id,
          },
        });
      } catch (error) {
        logger.error('Failed to create audit log for claim rejection', { error, claimId: id });
      }
    }
  }

  /**
   * Check if user has access to view/modify a claim
   * Employees can only access their own claims
   * Admin can access all claims
   */
  canAccessClaim(claim: Claim, user: User, employeeId?: string): boolean {
    // Admin has full access
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Employees can only access their own claims
    if (user.role === UserRole.EMPLOYEE) {
      // If employeeId is provided, check against it
      if (employeeId) {
        return claim.employee.id === employeeId;
      }
      // Otherwise, check if claim belongs to user's employee record
      // This would require a relationship between User and Employee
      // For now, we'll assume employeeId is passed separately
      return false;
    }

    return false;
  }
}

