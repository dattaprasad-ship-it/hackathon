"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logMessage = {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip || req.socket.remoteAddress,
        };
        if (res.statusCode >= 400) {
            console.error('Request failed:', logMessage);
        }
        else {
            console.log('Request:', logMessage);
        }
    });
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=request-logger.middleware.js.map