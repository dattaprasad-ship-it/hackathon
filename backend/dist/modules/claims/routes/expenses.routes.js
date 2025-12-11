"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpensesRoutes = void 0;
const express_1 = require("express");
const jwt_auth_middleware_1 = require("../../authentication/middleware/jwt-auth.middleware");
const expenses_validator_1 = require("../validators/expenses.validator");
const express_validator_1 = require("express-validator");
const business_exception_1 = require("../../../common/exceptions/business.exception");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        throw new business_exception_1.BusinessException(firstError.msg, 400, 'VALIDATION_ERROR');
    }
    next();
};
const mapExpenseToResponse = (expense) => {
    return {
        id: expense.id,
        expenseType: {
            id: expense.expenseType.id,
            name: expense.expenseType.name,
        },
        expenseDate: expense.expenseDate.toISOString().split('T')[0],
        amount: parseFloat(expense.amount),
        note: expense.note,
        createdAt: expense.createdAt.toISOString(),
        updatedAt: expense.updatedAt.toISOString(),
    };
};
const createExpensesRoutes = (expensesService, userRepository) => {
    const router = (0, express_1.Router)();
    // GET /api/claims/:id/expenses - Get all expenses for a claim
    router.get('/:id/expenses', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), expenses_validator_1.validateClaimId, validate, async (req, res, next) => {
        try {
            const expenses = await expensesService.findByClaimId(req.params.id);
            res.json(expenses.map(mapExpenseToResponse));
        }
        catch (error) {
            next(error);
        }
    });
    // POST /api/claims/:id/expenses - Add expense to claim
    router.post('/:id/expenses', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), expenses_validator_1.validateClaimId, expenses_validator_1.validateCreateExpense, validate, async (req, res, next) => {
        try {
            const expense = await expensesService.create(req.params.id, req.body);
            res.status(201).json(mapExpenseToResponse(expense));
        }
        catch (error) {
            next(error);
        }
    });
    // PUT /api/claims/:id/expenses/:expenseId - Update expense
    router.put('/:id/expenses/:expenseId', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), expenses_validator_1.validateClaimId, expenses_validator_1.validateExpenseId, expenses_validator_1.validateUpdateExpense, validate, async (req, res, next) => {
        try {
            await expensesService.update(req.params.expenseId, req.body);
            res.json({ message: 'Expense updated successfully' });
        }
        catch (error) {
            next(error);
        }
    });
    // DELETE /api/claims/:id/expenses/:expenseId - Delete expense
    router.delete('/:id/expenses/:expenseId', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), expenses_validator_1.validateClaimId, expenses_validator_1.validateExpenseId, validate, async (req, res, next) => {
        try {
            await expensesService.delete(req.params.expenseId);
            res.json({ message: 'Expense deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    });
    return router;
};
exports.createExpensesRoutes = createExpensesRoutes;
//# sourceMappingURL=expenses.routes.js.map