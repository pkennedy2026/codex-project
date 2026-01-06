"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const finance_controller_1 = require("./finance.controller");
const finance_service_1 = require("./finance.service");
const wallet_entity_1 = require("./wallet.entity");
const settlement_entity_1 = require("./settlement.entity");
const payout_entity_1 = require("./payout.entity");
const tenant_entity_1 = require("../tenants/tenant.entity");
let FinanceModule = class FinanceModule {
};
exports.FinanceModule = FinanceModule;
exports.FinanceModule = FinanceModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([wallet_entity_1.Wallet, settlement_entity_1.Settlement, payout_entity_1.Payout, tenant_entity_1.Tenant])],
        controllers: [finance_controller_1.FinanceController],
        providers: [finance_service_1.FinanceService],
    })
], FinanceModule);
//# sourceMappingURL=finance.module.js.map