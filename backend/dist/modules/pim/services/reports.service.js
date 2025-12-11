"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const report_entity_1 = require("../entities/report.entity");
const report_selection_criteria_entity_1 = require("../entities/report-selection-criteria.entity");
const report_display_field_entity_1 = require("../entities/report-display-field.entity");
const business_exception_1 = require("../../../common/exceptions/business.exception");
class ReportsService {
    constructor(reportRepository, employeeRepository) {
        this.reportRepository = reportRepository;
        this.employeeRepository = employeeRepository;
    }
    async findAll(reportName) {
        const reports = reportName
            ? await this.reportRepository.searchReports(reportName)
            : await this.reportRepository.findAllWithRelations();
        return reports.map((report) => this.mapToResponseDto(report));
    }
    async findOne(id) {
        const report = await this.reportRepository.findById(id, ['selectionCriteria', 'displayFields']);
        if (!report) {
            throw new business_exception_1.BusinessException('Report not found', 404, 'REPORT_NOT_FOUND');
        }
        return this.mapToResponseDto(report);
    }
    async create(data, createdBy) {
        const existingReport = await this.reportRepository.findByReportName(data.reportName, true);
        if (existingReport) {
            throw new business_exception_1.BusinessException('Report name already exists', 409, 'REPORT_NAME_CONFLICT');
        }
        const report = new report_entity_1.Report();
        report.reportName = data.reportName;
        report.isPredefined = false;
        report.createdBy = createdBy;
        if (data.selectionCriteria && data.selectionCriteria.length > 0) {
            report.selectionCriteria = data.selectionCriteria.map((criteria, index) => {
                const selectionCriteria = new report_selection_criteria_entity_1.ReportSelectionCriteria();
                selectionCriteria.criteriaType = criteria.criteriaType || '';
                selectionCriteria.criteriaValue = criteria.criteriaValue || '';
                selectionCriteria.includeOption = criteria.includeOption;
                selectionCriteria.createdBy = createdBy;
                return selectionCriteria;
            });
        }
        if (data.displayFields && data.displayFields.length > 0) {
            report.displayFields = data.displayFields.map((field, index) => {
                const displayField = new report_display_field_entity_1.ReportDisplayField();
                displayField.fieldGroup = field.fieldGroup;
                displayField.fieldName = field.fieldName;
                displayField.includeHeader = field.includeHeader || false;
                displayField.displayOrder = field.displayOrder || index;
                displayField.createdBy = createdBy;
                return displayField;
            });
        }
        const savedReport = await this.reportRepository.create(report);
        return this.mapToResponseDto(savedReport);
    }
    async update(id, data, updatedBy) {
        const report = await this.reportRepository.findById(id, ['selectionCriteria', 'displayFields']);
        if (!report) {
            throw new business_exception_1.BusinessException('Report not found', 404, 'REPORT_NOT_FOUND');
        }
        if (report.isPredefined) {
            throw new business_exception_1.BusinessException('Cannot modify predefined reports', 403, 'PREDEFINED_REPORT_READONLY');
        }
        if (data.reportName && data.reportName !== report.reportName) {
            const existingReport = await this.reportRepository.findByReportName(data.reportName, true);
            if (existingReport && existingReport.id !== id) {
                throw new business_exception_1.BusinessException('Report name already exists', 409, 'REPORT_NAME_CONFLICT');
            }
            report.reportName = data.reportName;
        }
        report.updatedBy = updatedBy;
        if (data.selectionCriteria) {
            report.selectionCriteria = data.selectionCriteria.map((criteria) => {
                const selectionCriteria = new report_selection_criteria_entity_1.ReportSelectionCriteria();
                selectionCriteria.criteriaType = criteria.criteriaType || '';
                selectionCriteria.criteriaValue = criteria.criteriaValue || '';
                selectionCriteria.includeOption = criteria.includeOption;
                selectionCriteria.createdBy = updatedBy;
                return selectionCriteria;
            });
        }
        if (data.displayFields) {
            report.displayFields = data.displayFields.map((field, index) => {
                const displayField = new report_display_field_entity_1.ReportDisplayField();
                displayField.fieldGroup = field.fieldGroup;
                displayField.fieldName = field.fieldName;
                displayField.includeHeader = field.includeHeader || false;
                displayField.displayOrder = field.displayOrder || index;
                displayField.createdBy = updatedBy;
                return displayField;
            });
        }
        const updatedReport = await this.reportRepository.update(id, report);
        return this.mapToResponseDto(updatedReport);
    }
    async delete(id) {
        const report = await this.reportRepository.findById(id);
        if (!report) {
            throw new business_exception_1.BusinessException('Report not found', 404, 'REPORT_NOT_FOUND');
        }
        if (report.isPredefined) {
            throw new business_exception_1.BusinessException('Cannot delete predefined reports', 403, 'PREDEFINED_REPORT_READONLY');
        }
        await this.reportRepository.delete(id);
    }
    async executeReport(id) {
        const report = await this.reportRepository.findById(id, ['selectionCriteria', 'displayFields']);
        if (!report) {
            throw new business_exception_1.BusinessException('Report not found', 404, 'REPORT_NOT_FOUND');
        }
        const { employees } = await this.employeeRepository.findWithFilters({
            include: 'current',
            page: 1,
            limit: 10000,
            sortBy: 'createdAt',
            sortOrder: 'ASC',
        });
        let filteredEmployees = employees;
        if (report.selectionCriteria && report.selectionCriteria.length > 0) {
            filteredEmployees = this.applySelectionCriteria(employees, report.selectionCriteria);
        }
        const headers = [];
        const rows = [];
        if (report.displayFields && report.displayFields.length > 0) {
            const sortedFields = [...report.displayFields].sort((a, b) => a.displayOrder - b.displayOrder);
            sortedFields.forEach((field) => {
                if (field.includeHeader) {
                    headers.push(field.fieldGroup);
                }
                headers.push(field.fieldName);
            });
            filteredEmployees.forEach((employee) => {
                const row = {};
                sortedFields.forEach((field) => {
                    const value = this.getFieldValue(employee, field.fieldGroup, field.fieldName);
                    if (field.includeHeader) {
                        row[field.fieldGroup] = field.fieldGroup;
                    }
                    row[field.fieldName] = value;
                });
                rows.push(row);
            });
        }
        else {
            headers.push('Employee ID', 'First Name', 'Last Name', 'Job Title', 'Employment Status', 'Sub Unit');
            filteredEmployees.forEach((employee) => {
                rows.push({
                    'Employee ID': employee.employeeId,
                    'First Name': employee.firstName,
                    'Last Name': employee.lastName,
                    'Job Title': employee.jobTitle?.title || '',
                    'Employment Status': employee.employmentStatus?.status || '',
                    'Sub Unit': employee.subUnit?.name || '',
                });
            });
        }
        return {
            headers,
            rows,
            totalRecords: rows.length,
        };
    }
    applySelectionCriteria(employees, criteria) {
        let filtered = employees.filter((emp) => emp && !emp.isDeleted);
        criteria.forEach((criterion) => {
            if (criterion.includeOption === 'Current Employees Only') {
                filtered = filtered.filter((emp) => emp.employmentStatus?.status === 'Active');
            }
            if (criterion.criteriaType && criterion.criteriaValue) {
                switch (criterion.criteriaType) {
                    case 'Employment Status':
                        filtered = filtered.filter((emp) => emp.employmentStatus?.status === criterion.criteriaValue);
                        break;
                    case 'Job Title':
                        filtered = filtered.filter((emp) => emp.jobTitle?.title === criterion.criteriaValue);
                        break;
                    case 'Sub Unit':
                        filtered = filtered.filter((emp) => emp.subUnit?.name === criterion.criteriaValue);
                        break;
                }
            }
        });
        return filtered;
    }
    getFieldValue(employee, fieldGroup, fieldName) {
        switch (fieldGroup) {
            case 'Personal':
                switch (fieldName) {
                    case 'Employee ID':
                        return employee.employeeId;
                    case 'First Name':
                        return employee.firstName;
                    case 'Middle Name':
                        return employee.middleName || '';
                    case 'Last Name':
                        return employee.lastName;
                    default:
                        return '';
                }
            case 'Job':
                switch (fieldName) {
                    case 'Job Title':
                        return employee.jobTitle?.title || '';
                    case 'Employment Status':
                        return employee.employmentStatus?.status || '';
                    case 'Sub Unit':
                        return employee.subUnit?.name || '';
                    case 'Supervisor':
                        return employee.supervisor ? `${employee.supervisor.firstName} ${employee.supervisor.lastName}` : '';
                    default:
                        return '';
                }
            default:
                return '';
        }
    }
    mapToResponseDto(report) {
        return {
            id: report.id,
            reportName: report.reportName,
            isPredefined: report.isPredefined,
            selectionCriteria: report.selectionCriteria?.map((c) => ({
                criteriaType: c.criteriaType,
                criteriaValue: c.criteriaValue,
                includeOption: c.includeOption,
            })),
            displayFields: report.displayFields?.map((f) => ({
                fieldGroup: f.fieldGroup,
                fieldName: f.fieldName,
                includeHeader: f.includeHeader,
                displayOrder: f.displayOrder,
            })),
            createdAt: report.createdAt,
            updatedAt: report.updatedAt,
        };
    }
}
exports.ReportsService = ReportsService;
//# sourceMappingURL=reports.service.js.map