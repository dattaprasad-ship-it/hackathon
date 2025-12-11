"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheUtil = void 0;
class CacheUtil {
    static get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return null;
        }
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }
    static set(key, data, ttlSeconds) {
        const expiresAt = Date.now() + ttlSeconds * 1000;
        this.cache.set(key, { data, expiresAt });
    }
    static delete(key) {
        this.cache.delete(key);
    }
    static clear() {
        this.cache.clear();
    }
    static generateKey(prefix, ...parts) {
        return `${prefix}:${parts.join(':')}`;
    }
}
exports.CacheUtil = CacheUtil;
CacheUtil.cache = new Map();
//# sourceMappingURL=cache.util.js.map