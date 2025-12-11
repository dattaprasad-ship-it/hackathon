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
exports.Attachment = void 0;
const typeorm_1 = require("typeorm");
const audit_entity_1 = require("../../../common/base/audit.entity");
const claim_entity_1 = require("./claim.entity");
let Attachment = class Attachment extends audit_entity_1.Audit {
};
exports.Attachment = Attachment;
__decorate([
    (0, typeorm_1.ManyToOne)(() => claim_entity_1.Claim, (claim) => claim.attachments, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'claim_id' }),
    __metadata("design:type", claim_entity_1.Claim)
], Attachment.prototype, "claim", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'original_filename' }),
    __metadata("design:type", String)
], Attachment.prototype, "originalFilename", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stored_filename', unique: true }),
    __metadata("design:type", String)
], Attachment.prototype, "storedFilename", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_size', type: 'integer' }),
    __metadata("design:type", Number)
], Attachment.prototype, "fileSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_type', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Attachment.prototype, "fileType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Attachment.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_path' }),
    __metadata("design:type", String)
], Attachment.prototype, "filePath", void 0);
exports.Attachment = Attachment = __decorate([
    (0, typeorm_1.Entity)('attachments'),
    (0, typeorm_1.Index)('idx_attachments_claim_id', ['claim']),
    (0, typeorm_1.Index)('idx_attachments_stored_filename', ['storedFilename'])
], Attachment);
//# sourceMappingURL=attachment.entity.js.map