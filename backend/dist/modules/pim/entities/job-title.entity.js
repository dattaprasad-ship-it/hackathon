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
exports.JobTitle = void 0;
const typeorm_1 = require("typeorm");
const audit_entity_1 = require("../../../common/base/audit.entity");
const employee_entity_1 = require("./employee.entity");
let JobTitle = class JobTitle extends audit_entity_1.Audit {
};
exports.JobTitle = JobTitle;
__decorate([
    (0, typeorm_1.Column)({ name: 'title', unique: true }),
    __metadata("design:type", String)
], JobTitle.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employee_entity_1.Employee, (employee) => employee.jobTitle),
    __metadata("design:type", Array)
], JobTitle.prototype, "employees", void 0);
exports.JobTitle = JobTitle = __decorate([
    (0, typeorm_1.Entity)('job_titles')
], JobTitle);
//# sourceMappingURL=job-title.entity.js.map