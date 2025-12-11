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
exports.ReportSelectionCriteria = void 0;
const typeorm_1 = require("typeorm");
const audit_entity_1 = require("../../../common/base/audit.entity");
const report_entity_1 = require("./report.entity");
let ReportSelectionCriteria = class ReportSelectionCriteria extends audit_entity_1.Audit {
};
exports.ReportSelectionCriteria = ReportSelectionCriteria;
__decorate([
    (0, typeorm_1.ManyToOne)(() => report_entity_1.Report, (report) => report.selectionCriteria, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'report_id' }),
    __metadata("design:type", report_entity_1.Report)
], ReportSelectionCriteria.prototype, "report", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'criteria_type' }),
    __metadata("design:type", String)
], ReportSelectionCriteria.prototype, "criteriaType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'criteria_value' }),
    __metadata("design:type", String)
], ReportSelectionCriteria.prototype, "criteriaValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'include_option', nullable: true }),
    __metadata("design:type", String)
], ReportSelectionCriteria.prototype, "includeOption", void 0);
exports.ReportSelectionCriteria = ReportSelectionCriteria = __decorate([
    (0, typeorm_1.Entity)('report_selection_criteria'),
    (0, typeorm_1.Index)('idx_report_criteria_report', ['report'])
], ReportSelectionCriteria);
//# sourceMappingURL=report-selection-criteria.entity.js.map