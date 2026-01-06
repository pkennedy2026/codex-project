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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wallet_entity_1 = require("./wallet.entity");
const settlement_entity_1 = require("./settlement.entity");
const payout_entity_1 = require("./payout.entity");
const tenant_entity_1 = require("../tenants/tenant.entity");
let FinanceService = class FinanceService {
    constructor(wallets, settlements, payouts, tenants) {
        this.wallets = wallets;
        this.settlements = settlements;
        this.payouts = payouts;
        this.tenants = tenants;
    }
    listWallets() {
        return this.wallets.find();
    }
    async createWallet(input) {
        const tenant = await this.tenants.findOneByOrFail({ id: input.tenantId });
        const existing = await this.wallets.findOne({ where: { tenant: { id: tenant.id } } });
        if (existing)
            return existing;
        const entity = this.wallets.create({ tenant, balance: 0 });
        return this.wallets.save(entity);
    }
    listSettlements() {
        return this.settlements.find();
    }
    async createSettlement(input) {
        var _a;
        const tenant = await this.tenants.findOneByOrFail({ id: input.tenantId });
        const entity = this.settlements.create({
            tenant,
            reportNumber: input.reportNumber,
            periodStart: input.periodStart,
            periodEnd: input.periodEnd,
            grossRevenue: input.grossRevenue,
            commissionAmount: input.commissionAmount,
            taxAmount: input.taxAmount,
            netRevenue: input.netRevenue,
            status: (_a = input.status) !== null && _a !== void 0 ? _a : 'pending',
        });
        return this.settlements.save(entity);
    }
    listPayouts() {
        return this.payouts.find();
    }
    async createPayout(input) {
        var _a;
        const tenant = await this.tenants.findOneByOrFail({ id: input.tenantId });
        const settlement = await this.settlements.findOneByOrFail({ id: input.settlementId });
        const entity = this.payouts.create({
            tenant,
            settlement,
            payoutNumber: input.payoutNumber,
            amount: input.amount,
            payoutMethod: input.payoutMethod,
            status: (_a = input.status) !== null && _a !== void 0 ? _a : 'pending',
        });
        return this.payouts.save(entity);
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __param(1, (0, typeorm_1.InjectRepository)(settlement_entity_1.Settlement)),
    __param(2, (0, typeorm_1.InjectRepository)(payout_entity_1.Payout)),
    __param(3, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FinanceService);
//# sourceMappingURL=finance.service.js.map