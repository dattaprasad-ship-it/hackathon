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
exports.Expense = void 0;
const typeorm_1 = require("typeorm");
const audit_entity_1 = require("../../../common/base/audit.entity");
const claim_entity_1 = require("./claim.entity");
const expense_type_entity_1 = require("./expense-type.entity");
let Expense = class Expense extends audit_entity_1.Audit {
};
exports.Expense = Expense;
__decorate([
    (0, typeorm_1.ManyToOne)(() => claim_entity_1.Claim, (claim) => claim.expenses, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'claim_id' }),
    __metadata("design:type", claim_entity_1.Claim)
], Expense.prototype, "claim", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => expense_type_entity_1.ExpenseType),
    (0, typeorm_1.JoinColumn)({ name: 'expense_type_id' }),
    __metadata("design:type", expense_type_entity_1.ExpenseType)
], Expense.prototype, "expenseType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expense_date', type: 'date' }),
    __metadata("design:type", Date)
], Expense.prototype, "expenseDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Expense.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'note', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Expense.prototype, "note", void 0);
exports.Expense = Expense = __decorate([
    (0, typeorm_1.Entity)('expenses'),
    (0, typeorm_1.Index)('idx_expenses_claim_id', ['claim']),
    (0, typeorm_1.Index)('idx_expenses_expense_type_id', ['expenseType']),
    (0, typeorm_1.Index)('idx_expenses_expense_date', ['expenseDate'])
], Expense);
//# sourceMappingURL=expense.entity.js.map