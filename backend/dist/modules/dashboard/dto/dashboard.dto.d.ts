export interface TimeAtWorkResponseDto {
    punchedIn: boolean;
    punchInTime: string;
    timezone: string;
    todayHours: {
        hours: number;
        minutes: number;
        totalMinutes: number;
    };
    weekData: WeekDayDataDto[];
    weekRange: {
        start: string;
        end: string;
    };
}
export interface WeekDayDataDto {
    date: string;
    day: string;
    hours: number;
    minutes: number;
}
export interface ActionDto {
    type: string;
    title: string;
    count: number;
    icon: string;
    url: string;
}
export interface MyActionsResponseDto {
    actions: ActionDto[];
}
export interface EmployeeOnLeaveDto {
    id: string;
    name: string;
    displayName: string;
    department: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    profilePicture: string | null;
}
export interface EmployeesOnLeaveResponseDto {
    date: string;
    employees: EmployeeOnLeaveDto[];
    totalCount: number;
}
export interface DistributionDataDto {
    subUnit: string;
    count: number;
    percentage: number;
    color: string;
}
export interface EmployeeDistributionResponseDto {
    distribution: DistributionDataDto[];
    totalEmployees: number;
}
export interface ImageDto {
    url: string;
    thumbnail: string;
}
export interface BuzzPostDto {
    id: string;
    author: {
        id: string;
        name: string;
        displayName: string;
        profilePicture: string | null;
    };
    content: string;
    images: ImageDto[];
    timestamp: string;
    likes: number;
    comments: number;
}
export interface BuzzPostsResponseDto {
    posts: BuzzPostDto[];
    totalCount: number;
}
export interface DashboardSummaryResponseDto {
    timeAtWork: TimeAtWorkResponseDto;
    myActions: ActionDto[];
    employeesOnLeave: EmployeeOnLeaveDto[];
    employeeDistribution: DistributionDataDto[];
    buzzPosts: BuzzPostDto[];
}
export interface EmployeesOnLeaveQueryDto {
    date?: string;
}
export interface BuzzPostsQueryDto {
    limit?: number;
}
//# sourceMappingURL=dashboard.dto.d.ts.map