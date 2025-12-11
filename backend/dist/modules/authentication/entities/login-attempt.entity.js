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
exports.LoginAttempt = void 0;
const typeorm_1 = require("typeorm");
const audit_entity_1 = require("../../../common/base/audit.entity");
let LoginAttempt = class LoginAttempt extends audit_entity_1.Audit {
};
exports.LoginAttempt = LoginAttempt;
__decorate([
    (0, typeorm_1.Column)({ name: 'username' }),
    __metadata("design:type", String)
], LoginAttempt.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address' }),
    __metadata("design:type", String)
], LoginAttempt.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'success' }),
    __metadata("design:type", Boolean)
], LoginAttempt.prototype, "success", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'failure_reason', nullable: true }),
    __metadata("design:type", String)
], LoginAttempt.prototype, "failureReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attempt_timestamp', type: 'datetime' }),
    __metadata("design:type", Date)
], LoginAttempt.prototype, "attemptTimestamp", void 0);
exports.LoginAttempt = LoginAttempt = __decorate([
    (0, typeorm_1.Entity)('login_attempts'),
    (0, typeorm_1.Index)('idx_login_attempts_ip_timestamp', ['ipAddress', 'attemptTimestamp']),
    (0, typeorm_1.Index)('idx_login_attempts_username_timestamp', ['username', 'attemptTimestamp'])
], LoginAttempt);
//# sourceMappingURL=login-attempt.entity.js.map