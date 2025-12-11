export interface DataImportResult {
  success: boolean;
  totalRecords: number;
  importedRecords: number;
  failedRecords: number;
  errors?: Array<{
    row: number;
    field?: string;
    message: string;
  }>;
}

