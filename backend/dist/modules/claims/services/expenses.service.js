"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesService = void 0;
const business_exception_1 = require("../../../common/exceptions/business.exception");
const logger_1 = require("../../../utils/logger");
class ExpensesService {
    constructor(expenseRepository, claimRepository, expenseTypeRepository) {
        this.expenseRepository = expenseRepository;
        this.claimRepository = claimRepository;
        this.expenseTypeRepository = expenseTypeRepository;
    }
    async create(claimId, dto) {
        // Validate claim exists and is in correct status
        const claim = await this.claimRepository.findByIdWithRelations(claimId);
        if (!claim) {
            throw new business_exception_1.BusinessException('Claim not found', 404, 'NOT_FOUND');
        }
        if (claim.status !== 'Initiated') {
            throw new business_exception_1.BusinessException('Expenses can only be added to claims in Initiated status', 400, 'INVALID_STATUS');
        }
        // Validate expense type
        const expenseType = await this.expenseTypeRepository.findById(dto.expenseTypeId);
        if (!expenseType) {
            throw new business_exception_1.BusinessException('Expense type not found', 404, 'NOT_FOUND');
        }
        // Validate expense date (not in future)
        const expenseDate = new Date(dto.expenseDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        expenseDate.setHours(0, 0, 0, 0);
        if (expenseDate > today) {
            throw new business_exception_1.BusinessException('Expense date cannot be in the future', 400, 'VALIDATION_ERROR');
        }
        // Validate amount (positive, max 2 decimals)
        if (dto.amount <= 0) {
            throw new business_exception_1.BusinessException('Amount must be greater than zero', 400, 'VALIDATION_ERROR');
        }
        const decimalPlaces = (dto.amount.toString().split('.')[1] || '').length;
        if (decimalPlaces > 2) {
            throw new business_exception_1.BusinessException('Amount cannot have more than 2 decimal places', 400, 'VALIDATION_ERROR');
        }
        // Create expense
        const expense = await this.expenseRepository.create({
            claim,
            expenseType,
            expenseDate,
            amount: dto.amount,
            note: dto.note,
        });
        // Recalculate total amount
        await this.recalculateTotalAmount(claimId);
        logger_1.logger.info(`Expense created: ${expense.id} for claim: ${claimId}`, {
            expenseId: expense.id,
            claimId,
            amount: dto.amount,
        });
        return expense;
    }
    async update(expenseId, dto) {
        // Validate expense exists
        const expense = await this.expenseRepository.findById(expenseId);
        if (!expense) {
            throw new business_exception_1.BusinessException('Expense not found', 404, 'NOT_FOUND');
        }
        const claimId = expense.claim.id;
        // Validate claim status
        const claim = await this.claimRepository.findByIdWithRelations(claimId);
        if (!claim) {
            throw new business_exception_1.BusinessException('Claim not found', 404, 'NOT_FOUND');
        }
        if (claim.status !== 'Initiated') {
            throw new business_exception_1.BusinessException('Expenses can only be updated for claims in Initiated status', 400, 'INVALID_STATUS');
        }
        // Validate expense type if provided
        if (dto.expenseTypeId) {
            const expenseType = await this.expenseTypeRepository.findById(dto.expenseTypeId);
            if (!expenseType) {
                throw new business_exception_1.BusinessException('Expense type not found', 404, 'NOT_FOUND');
            }
            expense.expenseType = expenseType;
        }
        // Validate expense date if provided
        if (dto.expenseDate) {
            const expenseDate = new Date(dto.expenseDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            expenseDate.setHours(0, 0, 0, 0);
            if (expenseDate > today) {
                throw new business_exception_1.BusinessException('Expense date cannot be in the future', 400, 'VALIDATION_ERROR');
            }
            expense.expenseDate = expenseDate;
        }
        // Validate amount if provided
        if (dto.amount !== undefined) {
            if (dto.amount <= 0) {
                throw new business_exception_1.BusinessException('Amount must be greater than zero', 400, 'VALIDATION_ERROR');
            }
            const decimalPlaces = (dto.amount.toString().split('.')[1] || '').length;
            if (decimalPlaces > 2) {
                throw new business_exception_1.BusinessException('Amount cannot have more than 2 decimal places', 400, 'VALIDATION_ERROR');
            }
            expense.amount = dto.amount;
        }
        if (dto.note !== undefined) {
            expense.note = dto.note;
        }
        // Update expense
        await this.expenseRepository.update(expenseId, expense);
        // Recalculate total amount
        await this.recalculateTotalAmount(claimId);
        logger_1.logger.info(`Expense updated: ${expenseId}`, { expenseId, claimId });
    }
    async delete(expenseId) {
        // Validate expense exists
        const expense = await this.expenseRepository.findById(expenseId);
        if (!expense) {
            throw new business_exception_1.BusinessException('Expense not found', 404, 'NOT_FOUND');
        }
        const claimId = expense.claim.id;
        // Validate claim status
        const claim = await this.claimRepository.findByIdWithRelations(claimId);
        if (!claim) {
            throw new business_exception_1.BusinessException('Claim not found', 404, 'NOT_FOUND');
        }
        if (claim.status !== 'Initiated') {
            throw new business_exception_1.BusinessException('Expenses can only be deleted from claims in Initiated status', 400, 'INVALID_STATUS');
        }
        // Delete expense
        await this.expenseRepository.delete(expenseId);
        // Recalculate total amount
        await this.recalculateTotalAmount(claimId);
        logger_1.logger.info(`Expense deleted: ${expenseId}`, { expenseId, claimId });
    }
    async findByClaimId(claimId) {
        return this.expenseRepository.findByClaimId(claimId);
    }
    async recalculateTotalAmount(claimId) {
        const totalAmount = await this.expenseRepository.calculateTotalAmount(claimId);
        await this.claimRepository.update(claimId, {
            totalAmount,
        });
    }
}
exports.ExpensesService = ExpensesService;
//# sourceMappingURL=expenses.service.js.map