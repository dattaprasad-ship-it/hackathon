export interface LoginDto {
    username: string;
    password: string;
}
export interface LoginResponseDto {
    token: string;
    user: {
        id: string;
        username: string;
        role: string;
        displayName?: string;
    };
}
export interface ErrorResponseDto {
    error: {
        code: string;
        message: string;
        details?: Record<string, string[]>;
    };
}
//# sourceMappingURL=authentication.dto.d.ts.map