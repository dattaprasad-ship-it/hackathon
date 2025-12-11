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
exports.PimConfig = void 0;
const typeorm_1 = require("typeorm");
const audit_entity_1 = require("../../../common/base/audit.entity");
let PimConfig = class PimConfig extends audit_entity_1.Audit {
};
exports.PimConfig = PimConfig;
__decorate([
    (0, typeorm_1.Column)({ name: 'show_deprecated_fields', type: 'integer', default: 0 }),
    __metadata("design:type", Boolean)
], PimConfig.prototype, "showDeprecatedFields", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'show_ssn_field', type: 'integer', default: 0 }),
    __metadata("design:type", Boolean)
], PimConfig.prototype, "showSsnField", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'show_sin_field', type: 'integer', default: 0 }),
    __metadata("design:type", Boolean)
], PimConfig.prototype, "showSinField", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'show_us_tax_exemptions', type: 'integer', default: 0 }),
    __metadata("design:type", Boolean)
], PimConfig.prototype, "showUsTaxExemptions", void 0);
exports.PimConfig = PimConfig = __decorate([
    (0, typeorm_1.Entity)('pim_config')
], PimConfig);
//# sourceMappingURL=pim-config.entity.js.map