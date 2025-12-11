"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const business_exception_1 = require("../common/exceptions/business.exception");
const errorHandler = (err, req, res, next) => {
    const statusCode = err instanceof business_exception_1.BusinessException
        ? err.statusCode
        : err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';
    const code = err instanceof business_exception_1.BusinessException
        ? err.code
        : err.code || 'INTERNAL_ERROR';
    const errorResponse = {
        error: {
            code,
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        },
    };
    res.status(statusCode).json(errorResponse);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.middleware.js.map