"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
class Logger {
    formatMessage(level, message, metadata) {
        const entry = {
            level,
            message,
            metadata,
            timestamp: new Date().toISOString(),
        };
        return JSON.stringify(entry);
    }
    info(message, metadata) {
        console.log(this.formatMessage('info', message, metadata));
    }
    warn(message, metadata) {
        console.warn(this.formatMessage('warn', message, metadata));
    }
    error(message, metadata) {
        console.error(this.formatMessage('error', message, metadata));
    }
    debug(message, metadata) {
        if (process.env.NODE_ENV === 'development') {
            console.debug(this.formatMessage('debug', message, metadata));
        }
    }
}
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map