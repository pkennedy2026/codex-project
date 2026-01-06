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
exports.Settlement = void 0;
const typeorm_1 = require("typeorm");
const tenant_entity_1 = require("../tenants/tenant.entity");
let Settlement = class Settlement {
};
exports.Settlement = Settlement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Settlement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, { eager: true }),
    __metadata("design:type", tenant_entity_1.Tenant)
], Settlement.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Settlement.prototype, "reportNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Settlement.prototype, "periodStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Settlement.prototype, "periodEnd", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 14, scale: 2 }),
    __metadata("design:type", Number)
], Settlement.prototype, "grossRevenue", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 14, scale: 2 }),
    __metadata("design:type", Number)
], Settlement.prototype, "commissionAmount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 14, scale: 2 }),
    __metadata("design:type", Number)
], Settlement.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 14, scale: 2 }),
    __metadata("design:type", Number)
], Settlement.prototype, "netRevenue", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], Settlement.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Settlement.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Settlement.prototype, "updatedAt", void 0);
exports.Settlement = Settlement = __decorate([
    (0, typeorm_1.Entity)({ name: 'settlements' })
], Settlement);
//# sourceMappingURL=settlement.entity.js.map