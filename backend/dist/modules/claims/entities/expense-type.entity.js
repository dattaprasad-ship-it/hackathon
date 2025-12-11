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
exports.ExpenseType = void 0;
const typeorm_1 = require("typeorm");
const audit_entity_1 = require("../../../common/base/audit.entity");
let ExpenseType = class ExpenseType extends audit_entity_1.Audit {
};
exports.ExpenseType = ExpenseType;
__decorate([
    (0, typeorm_1.Column)({ name: 'name', unique: true }),
    __metadata("design:type", String)
], ExpenseType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ExpenseType.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], ExpenseType.prototype, "isActive", void 0);
exports.ExpenseType = ExpenseType = __decorate([
    (0, typeorm_1.Entity)('expense_types'),
    (0, typeorm_1.Index)('idx_expense_types_name', ['name']),
    (0, typeorm_1.Index)('idx_expense_types_is_active', ['isActive'])
], ExpenseType);
//# sourceMappingURL=expense-type.entity.js.map