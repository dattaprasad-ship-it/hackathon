"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
const typeorm_1 = require("typeorm");
const audit_entity_1 = require("../../../common/base/audit.entity");
const job_title_entity_1 = require("./job-title.entity");
const employment_status_entity_1 = require("./employment-status.entity");
const sub_unit_entity_1 = require("./sub-unit.entity");
const reporting_method_entity_1 = require("./reporting-method.entity");
const employee_custom_value_entity_1 = require("./employee-custom-value.entity");
let Employee = class Employee extends audit_entity_1.Audit {
};
exports.Employee = Employee;
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id', unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name' }),
    __metadata("design:type", String)
], Employee.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'middle_name', nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "middleName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_name' }),
    __metadata("design:type", String)
], Employee.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => job_title_entity_1.JobTitle, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'job_title_id' }),
    __metadata("design:type", job_title_entity_1.JobTitle)
], Employee.prototype, "jobTitle", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employment_status_entity_1.EmploymentStatus, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'employment_status_id' }),
    __metadata("design:type", employment_status_entity_1.EmploymentStatus)
], Employee.prototype, "employmentStatus", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sub_unit_entity_1.SubUnit, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'sub_unit_id' }),
    __metadata("design:type", sub_unit_entity_1.SubUnit)
], Employee.prototype, "subUnit", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'supervisor_id' }),
    __metadata("design:type", Employee)
], Employee.prototype, "supervisor", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => reporting_method_entity_1.ReportingMethod, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'reporting_method_id' }),
    __metadata("design:type", reporting_method_entity_1.ReportingMethod)
], Employee.prototype, "reportingMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profile_photo_path', nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "profilePhotoPath", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'username', nullable: true, unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash', nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'login_status', nullable: true, type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Employee.prototype, "loginStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', default: false }),
    __metadata("design:type", Boolean)
], Employee.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employee_custom_value_entity_1.EmployeeCustomValue, (customValue) => customValue.employee),
    __metadata("design:type", Array)
], Employee.prototype, "customValues", void 0);
exports.Employee = Employee = __decorate([
    (0, typeorm_1.Entity)('employees'),
    (0, typeorm_1.Index)('idx_employees_employee_id', ['employeeId']),
    (0, typeorm_1.Index)('idx_employees_employment_status', ['employmentStatus']),
    (0, typeorm_1.Index)('idx_employees_job_title', ['jobTitle']),
    (0, typeorm_1.Index)('idx_employees_sub_unit', ['subUnit']),
    (0, typeorm_1.Index)('idx_employees_supervisor', ['supervisor']),
    (0, typeorm_1.Index)('idx_employees_is_deleted', ['isDeleted']),
    (0, typeorm_1.Index)('idx_employees_name', ['firstName', 'lastName'])
], Employee);
//# sourceMappingURL=employee.entity.js.map