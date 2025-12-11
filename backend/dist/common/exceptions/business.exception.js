"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessException = void 0;
class BusinessException extends Error {
    constructor(message, statusCode = 500, code = 'BUSINESS_ERROR') {
        super(message);
        this.name = 'BusinessException';
        this.statusCode = statusCode;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.BusinessException = BusinessException;
//# sourceMappingURL=business.exception.js.map