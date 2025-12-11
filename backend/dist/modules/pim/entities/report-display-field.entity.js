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
exports.ReportDisplayField = void 0;
const typeorm_1 = require("typeorm");
const audit_entity_1 = require("../../../common/base/audit.entity");
const report_entity_1 = require("./report.entity");
let ReportDisplayField = class ReportDisplayField extends audit_entity_1.Audit {
};
exports.ReportDisplayField = ReportDisplayField;
__decorate([
    (0, typeorm_1.ManyToOne)(() => report_entity_1.Report, (report) => report.displayFields, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'report_id' }),
    __metadata("design:type", report_entity_1.Report)
], ReportDisplayField.prototype, "report", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'field_group' }),
    __metadata("design:type", String)
], ReportDisplayField.prototype, "fieldGroup", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'field_name' }),
    __metadata("design:type", String)
], ReportDisplayField.prototype, "fieldName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'include_header', default: false }),
    __metadata("design:type", Boolean)
], ReportDisplayField.prototype, "includeHeader", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_order' }),
    __metadata("design:type", Number)
], ReportDisplayField.prototype, "displayOrder", void 0);
exports.ReportDisplayField = ReportDisplayField = __decorate([
    (0, typeorm_1.Entity)('report_display_fields'),
    (0, typeorm_1.Index)('idx_report_display_fields_report', ['report']),
    (0, typeorm_1.Index)('idx_report_display_fields_order', ['report', 'displayOrder'])
], ReportDisplayField);
//# sourceMappingURL=report-display-field.entity.js.map