export interface JwtPayload {
    id: string;
    username: string;
    role: string;
    iat?: number;
    exp?: number;
}
export declare const jwtUtil: {
    generateToken(payload: {
        id: string;
        username: string;
        role: string;
    }): string;
    verifyToken(token: string): JwtPayload;
    decodeToken(token: string): JwtPayload | null;
};
//# sourceMappingURL=jwt.util.d.ts.map