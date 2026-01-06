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
exports.Payout = void 0;
const typeorm_1 = require("typeorm");
const settlement_entity_1 = require("./settlement.entity");
const tenant_entity_1 = require("../tenants/tenant.entity");
let Payout = class Payout {
};
exports.Payout = Payout;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Payout.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, { eager: true }),
    __metadata("design:type", tenant_entity_1.Tenant)
], Payout.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settlement_entity_1.Settlement, { eager: true }),
    __metadata("design:type", settlement_entity_1.Settlement)
], Payout.prototype, "settlement", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Payout.prototype, "payoutNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 14, scale: 2 }),
    __metadata("design:type", Number)
], Payout.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], Payout.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Payout.prototype, "payoutMethod", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Payout.prototype, "createdAt", void 0);
exports.Payout = Payout = __decorate([
    (0, typeorm_1.Entity)({ name: 'payouts' })
], Payout);
//# sourceMappingURL=payout.entity.js.map