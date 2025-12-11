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
exports.CustomField = void 0;
const typeorm_1 = require("typeorm");
const audit_entity_1 = require("../../../common/base/audit.entity");
const employee_custom_value_entity_1 = require("./employee-custom-value.entity");
let CustomField = class CustomField extends audit_entity_1.Audit {
};
exports.CustomField = CustomField;
__decorate([
    (0, typeorm_1.Column)({ name: 'field_name', unique: true }),
    __metadata("design:type", String)
], CustomField.prototype, "fieldName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'screen' }),
    __metadata("design:type", String)
], CustomField.prototype, "screen", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'field_type' }),
    __metadata("design:type", String)
], CustomField.prototype, "fieldType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'select_options', nullable: true, type: 'text' }),
    __metadata("design:type", String)
], CustomField.prototype, "selectOptions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', default: false }),
    __metadata("design:type", Boolean)
], CustomField.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employee_custom_value_entity_1.EmployeeCustomValue, (customValue) => customValue.customField),
    __metadata("design:type", Array)
], CustomField.prototype, "customValues", void 0);
exports.CustomField = CustomField = __decorate([
    (0, typeorm_1.Entity)('custom_fields'),
    (0, typeorm_1.Index)('idx_custom_fields_field_name', ['fieldName'])
], CustomField);
//# sourceMappingURL=custom-field.entity.js.map