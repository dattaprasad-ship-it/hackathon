export interface SelectionCriteriaDto {
    criteriaType?: string;
    criteriaValue?: string;
    includeOption?: string;
}
export interface DisplayFieldDto {
    fieldGroup: string;
    fieldName: string;
    includeHeader?: boolean;
    displayOrder: number;
}
export interface CreateReportDto {
    reportName: string;
    selectionCriteria?: SelectionCriteriaDto[];
    displayFields?: DisplayFieldDto[];
}
export interface UpdateReportDto {
    reportName?: string;
    selectionCriteria?: SelectionCriteriaDto[];
    displayFields?: DisplayFieldDto[];
}
export interface ReportResponseDto {
    id: string;
    reportName: string;
    isPredefined: boolean;
    selectionCriteria?: SelectionCriteriaDto[];
    displayFields?: DisplayFieldDto[];
    createdAt: Date;
    updatedAt: Date;
}
export interface ReportExecutionResultDto {
    headers: string[];
    rows: Record<string, any>[];
    totalRecords: number;
}
//# sourceMappingURL=reports.dto.d.ts.map