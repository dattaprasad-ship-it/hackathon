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
exports.EmployeeCustomValue = void 0;
const typeorm_1 = require("typeorm");
const audit_entity_1 = require("../../../common/base/audit.entity");
const employee_entity_1 = require("./employee.entity");
const custom_field_entity_1 = require("./custom-field.entity");
let EmployeeCustomValue = class EmployeeCustomValue extends audit_entity_1.Audit {
};
exports.EmployeeCustomValue = EmployeeCustomValue;
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, (employee) => employee.customValues),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], EmployeeCustomValue.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => custom_field_entity_1.CustomField),
    (0, typeorm_1.JoinColumn)({ name: 'custom_field_id' }),
    __metadata("design:type", custom_field_entity_1.CustomField)
], EmployeeCustomValue.prototype, "customField", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'value', nullable: true }),
    __metadata("design:type", String)
], EmployeeCustomValue.prototype, "value", void 0);
exports.EmployeeCustomValue = EmployeeCustomValue = __decorate([
    (0, typeorm_1.Entity)('employee_custom_values'),
    (0, typeorm_1.Index)('idx_employee_custom_values_employee', ['employee']),
    (0, typeorm_1.Index)('idx_employee_custom_values_field', ['customField']),
    (0, typeorm_1.Unique)(['employee', 'customField'])
], EmployeeCustomValue);
//# sourceMappingURL=employee-custom-value.entity.js.map