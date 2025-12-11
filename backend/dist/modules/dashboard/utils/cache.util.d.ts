export declare class CacheUtil {
    private static cache;
    static get<T>(key: string): T | null;
    static set<T>(key: string, data: T, ttlSeconds: number): void;
    static delete(key: string): void;
    static clear(): void;
    static generateKey(prefix: string, ...parts: (string | number)[]): string;
}
//# sourceMappingURL=cache.util.d.ts.map