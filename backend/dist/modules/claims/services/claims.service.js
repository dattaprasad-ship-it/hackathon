"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimsService = void 0;
const user_role_enum_1 = require("../../../constants/enums/user-role.enum");
const business_exception_1 = require("../../../common/exceptions/business.exception");
const logger_1 = require("../../../utils/logger");
const reference_id_util_1 = require("../utils/reference-id.util");
class ClaimsService {
    constructor(claimRepository, employeeRepository, eventTypeRepository, currencyRepository, expenseRepository) {
        this.claimRepository = claimRepository;
        this.employeeRepository = employeeRepository;
        this.eventTypeRepository = eventTypeRepository;
        this.currencyRepository = currencyRepository;
        this.expenseRepository = expenseRepository;
    }
    async create(dto, user) {
        // Validate employee
        const employee = await this.employeeRepository.findById(dto.employeeId);
        if (!employee) {
            throw new business_exception_1.BusinessException('Employee not found', 404, 'NOT_FOUND');
        }
        // Validate event type
        const eventType = await this.eventTypeRepository.findById(dto.eventTypeId);
        if (!eventType) {
            throw new business_exception_1.BusinessException('Event type not found', 404, 'NOT_FOUND');
        }
        // Validate currency
        const currency = await this.currencyRepository.findById(dto.currencyId);
        if (!currency) {
            throw new business_exception_1.BusinessException('Currency not found', 404, 'NOT_FOUND');
        }
        // Generate reference ID
        const referenceId = await reference_id_util_1.ReferenceIdUtil.generateReferenceId(this.claimRepository);
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
        });
        logger_1.logger.info(`Claim created: ${claim.id} with reference ID: ${referenceId}`, {
            claimId: claim.id,
            referenceId,
            employeeId: dto.employeeId,
            userId: user.id,
        });
        return claim;
    }
    async search(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        // Convert date strings to Date objects if provided
        const fromDate = filters.fromDate ? new Date(filters.fromDate) : undefined;
        const toDate = filters.toDate ? new Date(filters.toDate) : undefined;
        const result = await this.claimRepository.findWithFilters({
            employeeName: filters.employeeName,
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
    async findById(id) {
        const claim = await this.claimRepository.findByIdWithRelations(id);
        if (!claim) {
            throw new business_exception_1.BusinessException('Claim not found', 404, 'NOT_FOUND');
        }
        return claim;
    }
    async findByEmployeeId(employeeId) {
        const result = await this.claimRepository.findByEmployeeId(employeeId);
        return result;
    }
    async update(id, dto, user) {
        const claim = await this.claimRepository.findByIdWithRelations(id);
        if (!claim) {
            throw new business_exception_1.BusinessException('Claim not found', 404, 'NOT_FOUND');
        }
        // Validate status - can only update if in Initiated status
        if (claim.status !== 'Initiated') {
            throw new business_exception_1.BusinessException('Claim cannot be updated. Only claims in Initiated status can be modified.', 400, 'INVALID_STATUS');
        }
        // Validate event type if provided
        if (dto.eventTypeId) {
            const eventType = await this.eventTypeRepository.findById(dto.eventTypeId);
            if (!eventType) {
                throw new business_exception_1.BusinessException('Event type not found', 404, 'NOT_FOUND');
            }
            claim.eventType = eventType;
        }
        // Validate currency if provided
        if (dto.currencyId) {
            const currency = await this.currencyRepository.findById(dto.currencyId);
            if (!currency) {
                throw new business_exception_1.BusinessException('Currency not found', 404, 'NOT_FOUND');
            }
            claim.currency = currency;
        }
        if (dto.remarks !== undefined) {
            claim.remarks = dto.remarks;
        }
        claim.updatedBy = user.username;
        await this.claimRepository.update(id, claim);
        logger_1.logger.info(`Claim updated: ${id}`, { claimId: id, userId: user.id });
        return this.findById(id);
    }
    async submit(id, user) {
        const claim = await this.claimRepository.findByIdWithRelations(id);
        if (!claim) {
            throw new business_exception_1.BusinessException('Claim not found', 404, 'NOT_FOUND');
        }
        // Validate status
        if (claim.status !== 'Initiated') {
            throw new business_exception_1.BusinessException('Claim cannot be submitted. Only claims in Initiated status can be submitted.', 400, 'INVALID_STATUS');
        }
        // Validate expenses
        const expenses = await this.expenseRepository.findByClaimId(id);
        if (!expenses || expenses.length === 0) {
            throw new business_exception_1.BusinessException('Claim must have at least one expense before submission', 400, 'VALIDATION_ERROR');
        }
        // Recalculate total amount
        const totalAmount = await this.expenseRepository.calculateTotalAmount(id);
        if (totalAmount <= 0) {
            throw new business_exception_1.BusinessException('Claim total amount must be greater than zero', 400, 'VALIDATION_ERROR');
        }
        // Update claim status
        await this.claimRepository.update(id, {
            status: 'Submitted',
            submittedDate: new Date(),
            totalAmount,
            updatedBy: user.username,
        });
        logger_1.logger.info(`Claim submitted: ${id}`, { claimId: id, userId: user.id, totalAmount });
    }
    async approve(id, user) {
        const claim = await this.claimRepository.findByIdWithRelations(id);
        if (!claim) {
            throw new business_exception_1.BusinessException('Claim not found', 404, 'NOT_FOUND');
        }
        // Validate status - only Submitted claims can be approved
        if (claim.status !== 'Submitted') {
            throw new business_exception_1.BusinessException('Only submitted claims can be approved', 400, 'INVALID_STATUS');
        }
        // Update claim status
        await this.claimRepository.update(id, {
            status: 'Approved',
            approvedDate: new Date(),
            approver: user,
            updatedBy: user.username,
        });
        logger_1.logger.info(`Claim approved: ${id}`, { claimId: id, approverId: user.id });
    }
    async reject(id, dto, user) {
        if (!dto.rejectionReason || dto.rejectionReason.trim().length === 0) {
            throw new business_exception_1.BusinessException('Rejection reason is required', 400, 'VALIDATION_ERROR');
        }
        const claim = await this.claimRepository.findByIdWithRelations(id);
        if (!claim) {
            throw new business_exception_1.BusinessException('Claim not found', 404, 'NOT_FOUND');
        }
        // Validate status - only Submitted claims can be rejected
        if (claim.status !== 'Submitted') {
            throw new business_exception_1.BusinessException('Only submitted claims can be rejected', 400, 'INVALID_STATUS');
        }
        // Update claim status
        await this.claimRepository.update(id, {
            status: 'Rejected',
            rejectedDate: new Date(),
            rejectionReason: dto.rejectionReason.trim(),
            approver: user,
            updatedBy: user.username,
        });
        logger_1.logger.info(`Claim rejected: ${id}`, { claimId: id, approverId: user.id, reason: dto.rejectionReason });
    }
    /**
     * Check if user has access to view/modify a claim
     * Employees can only access their own claims
     * Admin can access all claims
     */
    canAccessClaim(claim, user, employeeId) {
        // Admin has full access
        if (user.role === user_role_enum_1.UserRole.ADMIN) {
            return true;
        }
        // Employees can only access their own claims
        if (user.role === user_role_enum_1.UserRole.EMPLOYEE) {
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
exports.ClaimsService = ClaimsService;
//# sourceMappingURL=claims.service.js.map