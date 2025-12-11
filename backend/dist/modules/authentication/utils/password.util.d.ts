export declare const passwordUtil: {
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, hash: string): Promise<boolean>;
    generateSalt(): Promise<string>;
};
//# sourceMappingURL=password.util.d.ts.map