"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataImportService = void 0;
const business_exception_1 = require("../../../common/exceptions/business.exception");
const sync_1 = require("csv-parse/sync");
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const MAX_RECORDS = 100;
class DataImportService {
    constructor(employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
    async importFromCSV(file) {
        if (file.size > MAX_FILE_SIZE) {
            throw new business_exception_1.BusinessException('File size exceeds 1MB limit', 400, 'FILE_TOO_LARGE');
        }
        const fileContent = file.buffer.toString('utf-8');
        const records = (0, sync_1.parse)(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });
        if (records.length > MAX_RECORDS) {
            throw new business_exception_1.BusinessException(`File contains ${records.length} records. Maximum ${MAX_RECORDS} records allowed per file.`, 400, 'TOO_MANY_RECORDS');
        }
        const errors = [];
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
            }
            catch (error) {
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
    generateEmployeeId() {
        return `EMP${Date.now()}`;
    }
}
exports.DataImportService = DataImportService;
//# sourceMappingURL=data-import.service.js.map