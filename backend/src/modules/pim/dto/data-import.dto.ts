export interface DataImportRequestDto {
  file: Express.Multer.File;
}

export interface DataImportResultDto {
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

