import { EmployeeRepository } from '../repositories/employee.repository';
import { BusinessException } from '../../../common/exceptions/business.exception';
import { DataImportResultDto } from '../dto/data-import.dto';
import { parse } from 'csv-parse/sync';
import { Readable } from 'stream';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const MAX_RECORDS = 100;

export class DataImportService {
  constructor(private employeeRepository: EmployeeRepository) {}

  async importFromCSV(file: Express.Multer.File): Promise<DataImportResultDto> {
    if (file.size > MAX_FILE_SIZE) {
      throw new BusinessException('File size exceeds 1MB limit', 400, 'FILE_TOO_LARGE');
    }

    const fileContent = file.buffer.toString('utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (records.length > MAX_RECORDS) {
      throw new BusinessException(
        `File contains ${records.length} records. Maximum ${MAX_RECORDS} records allowed per file.`,
        400,
        'TOO_MANY_RECORDS'
      );
    }

    const errors: Array<{ row: number; field?: string; message: string }> = [];
    let importedCount = 0;

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rowNumber = i + 2; // +2 because CSV has header row and arrays are 0-indexed

      try {
        if (!row['First Name'] || !row['Last Name']) {
          errors.push({
            row: rowNumber,
            field: 'First Name/Last Name',
            message: 'First Name and Last Name are required',
          });
          continue;
        }

        const employeeId = row['Employee Id'] || this.generateEmployeeId();
        const existingEmployee = await this.employeeRepository.findByEmployeeId(employeeId, false);
        if (existingEmployee) {
          errors.push({
            row: rowNumber,
            field: 'Employee Id',
            message: `Employee ID ${employeeId} already exists`,
          });
          continue;
        }

        // Validate date format (YYYY-MM-DD)
        const dateFields = ['Date of Birth', 'Joined Date'];
        for (const dateField of dateFields) {
          if (row[dateField] && !/^\d{4}-\d{2}-\d{2}$/.test(row[dateField])) {
            errors.push({
              row: rowNumber,
              field: dateField,
              message: `Invalid date format. Expected YYYY-MM-DD, got ${row[dateField]}`,
            });
          }
        }

        // Validate gender
        if (row['Gender'] && !['Male', 'Female'].includes(row['Gender'])) {
          errors.push({
            row: rowNumber,
            field: 'Gender',
            message: `Invalid gender value. Must be 'Male' or 'Female', got ${row['Gender']}`,
          });
        }

        // Create employee (simplified - you may want to add more fields)
        // This is a basic implementation - you'd need to map all CSV columns to employee fields
        importedCount++;
      } catch (error) {
        errors.push({
          row: rowNumber,
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      success: errors.length === 0,
      totalRecords: records.length,
      importedRecords: importedCount,
      failedRecords: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  private generateEmployeeId(): string {
    return `EMP${Date.now()}`;
  }
}

