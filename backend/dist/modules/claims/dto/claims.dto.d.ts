import { Claim } from '../entities/claim.entity';
export interface CreateClaimDto {
    employeeId: string;
    eventTypeId: string;
    currencyId: string;
    remarks?: string;
}
export interface UpdateClaimDto {
    eventTypeId?: string;
    currencyId?: string;
    remarks?: string;
}
export interface ClaimSearchFiltersDto {
    employeeName?: string;
    referenceId?: string;
    eventTypeId?: string;
    status?: Claim['status'];
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
export interface SubmitClaimDto {
}
export interface ApproveClaimDto {
}
export interface RejectClaimDto {
    rejectionReason: string;
}
export interface ClaimResponseDto {
    id: string;
    referenceId: string;
    employee: {
        id: string;
        employeeId: string;
        firstName: string;
        lastName: string;
    };
    eventType: {
        id: string;
        name: string;
    };
    currency: {
        id: string;
        code: string;
        symbol: string;
    };
    status: Claim['status'];
    remarks?: string;
    totalAmount: number;
    submittedDate?: string;
    approvedDate?: string;
    rejectedDate?: string;
    rejectionReason?: string;
    approver?: {
        id: string;
        username: string;
        displayName?: string;
    };
    expenses?: Array<{
        id: string;
        expenseType: {
            id: string;
            name: string;
        };
        expenseDate: string;
        amount: number;
        note?: string;
    }>;
    attachments?: Array<{
        id: string;
        originalFilename: string;
        fileSize: number;
        fileType: string;
        description?: string;
        createdAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
}
export interface ClaimListResponseDto {
    claims: ClaimResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
//# sourceMappingURL=claims.dto.d.ts.map