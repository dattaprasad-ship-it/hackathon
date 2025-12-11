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
exports.Claim = void 0;
const typeorm_1 = require("typeorm");
const audit_entity_1 = require("../../../common/base/audit.entity");
const employee_entity_1 = require("../../pim/entities/employee.entity");
const event_type_entity_1 = require("./event-type.entity");
const currency_entity_1 = require("./currency.entity");
const user_entity_1 = require("../../authentication/entities/user.entity");
const expense_entity_1 = require("./expense.entity");
const attachment_entity_1 = require("./attachment.entity");
let Claim = class Claim extends audit_entity_1.Audit {
};
exports.Claim = Claim;
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_id', unique: true, length: 20 }),
    __metadata("design:type", String)
], Claim.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], Claim.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => event_type_entity_1.EventType),
    (0, typeorm_1.JoinColumn)({ name: 'event_type_id' }),
    __metadata("design:type", event_type_entity_1.EventType)
], Claim.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => currency_entity_1.Currency),
    (0, typeorm_1.JoinColumn)({ name: 'currency_id' }),
    __metadata("design:type", currency_entity_1.Currency)
], Claim.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Claim.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remarks', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Claim.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Claim.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'submitted_date', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Claim.prototype, "submittedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_date', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Claim.prototype, "approvedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rejected_date', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Claim.prototype, "rejectedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rejection_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Claim.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'approver_id' }),
    __metadata("design:type", user_entity_1.User)
], Claim.prototype, "approver", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => expense_entity_1.Expense, (expense) => expense.claim),
    __metadata("design:type", Array)
], Claim.prototype, "expenses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => attachment_entity_1.Attachment, (attachment) => attachment.claim),
    __metadata("design:type", Array)
], Claim.prototype, "attachments", void 0);
exports.Claim = Claim = __decorate([
    (0, typeorm_1.Entity)('claims'),
    (0, typeorm_1.Index)('idx_claims_reference_id', ['referenceId']),
    (0, typeorm_1.Index)('idx_claims_employee_id', ['employee']),
    (0, typeorm_1.Index)('idx_claims_status', ['status']),
    (0, typeorm_1.Index)('idx_claims_event_type_id', ['eventType']),
    (0, typeorm_1.Index)('idx_claims_currency_id', ['currency']),
    (0, typeorm_1.Index)('idx_claims_submitted_date', ['submittedDate']),
    (0, typeorm_1.Index)('idx_claims_created_at', ['createdAt'])
], Claim);
//# sourceMappingURL=claim.entity.js.map