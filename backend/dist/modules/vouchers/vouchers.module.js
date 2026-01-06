"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VouchersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const vouchers_controller_1 = require("./vouchers.controller");
const vouchers_service_1 = require("./vouchers.service");
const voucher_entity_1 = require("./voucher.entity");
const tenant_entity_1 = require("../tenants/tenant.entity");
const plan_entity_1 = require("../plans/plan.entity");
const subscriber_entity_1 = require("../subscribers/subscriber.entity");
let VouchersModule = class VouchersModule {
};
exports.VouchersModule = VouchersModule;
exports.VouchersModule = VouchersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([voucher_entity_1.Voucher, tenant_entity_1.Tenant, plan_entity_1.Plan, subscriber_entity_1.Subscriber])],
        controllers: [vouchers_controller_1.VouchersController],
        providers: [vouchers_service_1.VouchersService],
        exports: [vouchers_service_1.VouchersService],
    })
], VouchersModule);
//# sourceMappingURL=vouchers.module.js.map