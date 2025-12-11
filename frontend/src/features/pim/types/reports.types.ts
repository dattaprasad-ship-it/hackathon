export interface SelectionCriteria {
  criteriaType?: string;
  criteriaValue?: string;
  includeOption?: string;
}

export interface DisplayField {
  fieldGroup: string;
  fieldName: string;
  includeHeader?: boolean;
  displayOrder: number;
}

export interface Report {
  id: string;
  reportName: string;
  isPredefined: boolean;
  selectionCriteria?: SelectionCriteria[];
  displayFields?: DisplayField[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReportRequest {
  reportName: string;
  selectionCriteria?: SelectionCriteria[];
  displayFields?: DisplayField[];
}

export interface UpdateReportRequest {
  reportName?: string;
  selectionCriteria?: SelectionCriteria[];
  displayFields?: DisplayField[];
}

export interface ReportExecutionResult {
  headers: string[];
  rows: Record<string, any>[];
  totalRecords: number;
}

export interface ReportsListResponse {
  data: Report[];
}

