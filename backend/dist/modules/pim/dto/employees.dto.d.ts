export interface CreateEmployeeDto {
    employeeId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    jobTitleId?: string;
    employmentStatusId?: string;
    subUnitId?: string;
    supervisorId?: string;
    reportingMethodId?: string;
    profilePhotoPath?: string;
    createLoginDetails?: boolean;
    username?: string;
    password?: string;
    confirmPassword?: string;
    loginStatus?: 'Enabled' | 'Disabled';
}
export interface UpdateEmployeeDto {
    employeeId?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    jobTitleId?: string;
    employmentStatusId?: string;
    subUnitId?: string;
    supervisorId?: string;
    reportingMethodId?: string;
    profilePhotoPath?: string;
    username?: string;
    password?: string;
    loginStatus?: 'Enabled' | 'Disabled';
}
export interface EmployeeListQueryDto {
    employeeName?: string;
    employeeId?: string;
    employmentStatusId?: string;
    jobTitleId?: string;
    subUnitId?: string;
    supervisorId?: string;
    include?: 'current' | 'all';
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
export interface EmployeeResponseDto {
    id: string;
    employeeId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    jobTitle?: {
        id: string;
        title: string;
    };
    employmentStatus?: {
        id: string;
        status: string;
    };
    subUnit?: {
        id: string;
        name: string;
    };
    supervisor?: {
        id: string;
        employeeId: string;
        firstName: string;
        lastName: string;
    };
    reportingMethod?: {
        id: string;
        name: string;
    };
    profilePhotoPath?: string;
    username?: string;
    loginStatus?: 'Enabled' | 'Disabled';
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface EmployeeListResponseDto {
    data: EmployeeResponseDto[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    recordCount: string;
}
//# sourceMappingURL=employees.dto.d.ts.map