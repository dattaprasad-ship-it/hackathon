"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClaimsRoutes = void 0;
const express_1 = require("express");
const jwt_auth_middleware_1 = require("../../authentication/middleware/jwt-auth.middleware");
const claims_validator_1 = require("../validators/claims.validator");
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
const user_role_enum_1 = require("../../../constants/enums/user-role.enum");
const mapClaimToResponse = (claim) => {
    return {
        id: claim.id,
        referenceId: claim.referenceId,
        employee: {
            id: claim.employee.id,
            employeeId: claim.employee.employeeId,
            firstName: claim.employee.firstName,
            lastName: claim.employee.lastName,
        },
        eventType: {
            id: claim.eventType.id,
            name: claim.eventType.name,
        },
        currency: {
            id: claim.currency.id,
            code: claim.currency.code,
            symbol: claim.currency.symbol,
        },
        status: claim.status,
        remarks: claim.remarks,
        totalAmount: parseFloat(claim.totalAmount),
        submittedDate: claim.submittedDate ? claim.submittedDate.toISOString() : undefined,
        approvedDate: claim.approvedDate ? claim.approvedDate.toISOString() : undefined,
        rejectedDate: claim.rejectedDate ? claim.rejectedDate.toISOString() : undefined,
        rejectionReason: claim.rejectionReason,
        approver: claim.approver
            ? {
                id: claim.approver.id,
                username: claim.approver.username,
                displayName: claim.approver.displayName,
            }
            : undefined,
        expenses: claim.expenses
            ? claim.expenses.map((exp) => ({
                id: exp.id,
                expenseType: {
                    id: exp.expenseType.id,
                    name: exp.expenseType.name,
                },
                expenseDate: exp.expenseDate.toISOString().split('T')[0],
                amount: parseFloat(exp.amount),
                note: exp.note,
            }))
            : undefined,
        attachments: claim.attachments
            ? claim.attachments.map((att) => ({
                id: att.id,
                originalFilename: att.originalFilename,
                fileSize: att.fileSize,
                fileType: att.fileType,
                description: att.description,
                createdAt: att.createdAt.toISOString(),
            }))
            : undefined,
        createdAt: claim.createdAt.toISOString(),
        updatedAt: claim.updatedAt.toISOString(),
    };
};
const createClaimsRoutes = (claimsService, userRepository) => {
    const router = (0, express_1.Router)();
    // Helper to get user entity from request
    const getUserEntity = async (req) => {
        if (!req.user) {
            throw new business_exception_1.BusinessException('User not authenticated', 401, 'UNAUTHORIZED');
        }
        const user = await userRepository.findById(req.user.id);
        if (!user) {
            throw new business_exception_1.BusinessException('User not found', 404, 'NOT_FOUND');
        }
        return user;
    };
    // GET /api/claims - Search and list claims
    router.get('/', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), claims_validator_1.validateClaimSearch, validate, async (req, res, next) => {
        try {
            const user = await getUserEntity(req);
            const filters = req.query;
            // Employees can only see their own claims
            if (user.role === user_role_enum_1.UserRole.EMPLOYEE) {
                // This would require employeeId from user - for now, filter by employee name if provided
                // In a real implementation, you'd get employeeId from user.employee relationship
            }
            const result = await claimsService.search(filters);
            const response = {
                ...result,
                claims: result.claims.map(mapClaimToResponse),
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    });
    // POST /api/claims - Create new claim
    router.post('/', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), claims_validator_1.validateCreateClaim, validate, async (req, res, next) => {
        try {
            const user = await getUserEntity(req);
            const claim = await claimsService.create(req.body, user);
            res.status(201).json(mapClaimToResponse(claim));
        }
        catch (error) {
            next(error);
        }
    });
    // GET /api/claims/:id - Get claim details
    router.get('/:id', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), claims_validator_1.validateClaimId, validate, async (req, res, next) => {
        try {
            const user = await getUserEntity(req);
            const claim = await claimsService.findById(req.params.id);
            // Check access control
            if (user.role === user_role_enum_1.UserRole.EMPLOYEE) {
                // Employees can only view their own claims
                // This would require employeeId from user - for now, allow if they created it
                if (claim.createdBy !== user.username) {
                    throw new business_exception_1.BusinessException('Access denied', 403, 'FORBIDDEN');
                }
            }
            res.json(mapClaimToResponse(claim));
        }
        catch (error) {
            next(error);
        }
    });
    // PUT /api/claims/:id - Update claim
    router.put('/:id', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), claims_validator_1.validateClaimId, claims_validator_1.validateUpdateClaim, validate, async (req, res, next) => {
        try {
            const user = await getUserEntity(req);
            const claim = await claimsService.update(req.params.id, req.body, user);
            res.json(mapClaimToResponse(claim));
        }
        catch (error) {
            next(error);
        }
    });
    // POST /api/claims/:id/submit - Submit claim
    router.post('/:id/submit', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), claims_validator_1.validateClaimId, validate, async (req, res, next) => {
        try {
            const user = await getUserEntity(req);
            await claimsService.submit(req.params.id, user);
            res.json({ message: 'Claim submitted successfully' });
        }
        catch (error) {
            next(error);
        }
    });
    // POST /api/claims/:id/approve - Approve claim
    router.post('/:id/approve', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), claims_validator_1.validateClaimId, validate, async (req, res, next) => {
        try {
            const user = await getUserEntity(req);
            // Only Admin can approve
            if (user.role !== user_role_enum_1.UserRole.ADMIN) {
                throw new business_exception_1.BusinessException('Only administrators can approve claims', 403, 'FORBIDDEN');
            }
            await claimsService.approve(req.params.id, user);
            res.json({ message: 'Claim approved successfully' });
        }
        catch (error) {
            next(error);
        }
    });
    // POST /api/claims/:id/reject - Reject claim
    router.post('/:id/reject', (0, jwt_auth_middleware_1.jwtAuthMiddleware)(userRepository), claims_validator_1.validateClaimId, claims_validator_1.validateRejectClaim, validate, async (req, res, next) => {
        try {
            const user = await getUserEntity(req);
            // Only Admin can reject
            if (user.role !== user_role_enum_1.UserRole.ADMIN) {
                throw new business_exception_1.BusinessException('Only administrators can reject claims', 403, 'FORBIDDEN');
            }
            await claimsService.reject(req.params.id, req.body, user);
            res.json({ message: 'Claim rejected successfully' });
        }
        catch (error) {
            next(error);
        }
    });
    return router;
};
exports.createClaimsRoutes = createClaimsRoutes;
//# sourceMappingURL=claims.routes.js.map