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
exports.Report = void 0;
const typeorm_1 = require("typeorm");
const audit_entity_1 = require("../../../common/base/audit.entity");
const report_selection_criteria_entity_1 = require("./report-selection-criteria.entity");
const report_display_field_entity_1 = require("./report-display-field.entity");
let Report = class Report extends audit_entity_1.Audit {
};
exports.Report = Report;
__decorate([
    (0, typeorm_1.Column)({ name: 'report_name', unique: true }),
    __metadata("design:type", String)
], Report.prototype, "reportName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_predefined', default: false }),
    __metadata("design:type", Boolean)
], Report.prototype, "isPredefined", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => report_selection_criteria_entity_1.ReportSelectionCriteria, (criteria) => criteria.report, { cascade: true }),
    __metadata("design:type", Array)
], Report.prototype, "selectionCriteria", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => report_display_field_entity_1.ReportDisplayField, (field) => field.report, { cascade: true }),
    __metadata("design:type", Array)
], Report.prototype, "displayFields", void 0);
exports.Report = Report = __decorate([
    (0, typeorm_1.Entity)('reports'),
    (0, typeorm_1.Index)('idx_reports_report_name', ['reportName'])
], Report);
//# sourceMappingURL=report.entity.js.map