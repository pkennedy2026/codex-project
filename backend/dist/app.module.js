"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./modules/auth/auth.module");
const tenants_module_1 = require("./modules/tenants/tenants.module");
const subscribers_module_1 = require("./modules/subscribers/subscribers.module");
const plans_module_1 = require("./modules/plans/plans.module");
const billing_module_1 = require("./modules/billing/billing.module");
const payments_module_1 = require("./modules/payments/payments.module");
const network_module_1 = require("./modules/network/network.module");
const shop_module_1 = require("./modules/shop/shop.module");
const portal_module_1 = require("./modules/portal/portal.module");
const tenant_entity_1 = require("./modules/tenants/tenant.entity");
const subscriber_entity_1 = require("./modules/subscribers/subscriber.entity");
const plan_entity_1 = require("./modules/plans/plan.entity");
const invoice_entity_1 = require("./modules/billing/invoice.entity");
const payment_entity_1 = require("./modules/payments/payment.entity");
const voucher_entity_1 = require("./modules/vouchers/voucher.entity");
const vouchers_module_1 = require("./modules/vouchers/vouchers.module");
const nas_entity_1 = require("./modules/network/nas.entity");
const ap_entity_1 = require("./modules/network/ap.entity");
const user_entity_1 = require("./modules/auth/user.entity");
const finance_module_1 = require("./modules/finance/finance.module");
const wallet_entity_1 = require("./modules/finance/wallet.entity");
const settlement_entity_1 = require("./modules/finance/settlement.entity");
const payout_entity_1 = require("./modules/finance/payout.entity");
const sessions_module_1 = require("./modules/sessions/sessions.module");
const session_entity_1 = require("./modules/sessions/session.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.DATABASE_URL || 'postgres://kennet:kennet@localhost:5432/kennet',
                entities: [
                    tenant_entity_1.Tenant,
                    subscriber_entity_1.Subscriber,
                    plan_entity_1.Plan,
                    invoice_entity_1.Invoice,
                    payment_entity_1.Payment,
                    voucher_entity_1.Voucher,
                    nas_entity_1.NasDevice,
                    ap_entity_1.AccessPoint,
                    user_entity_1.User,
                    wallet_entity_1.Wallet,
                    settlement_entity_1.Settlement,
                    payout_entity_1.Payout,
                    session_entity_1.Session,
                ],
                synchronize: process.env.TYPEORM_SYNC === 'true',
                logging: false,
            }),
            auth_module_1.AuthModule,
            tenants_module_1.TenantsModule,
            subscribers_module_1.SubscribersModule,
            plans_module_1.PlansModule,
            billing_module_1.BillingModule,
            payments_module_1.PaymentsModule,
            network_module_1.NetworkModule,
            shop_module_1.ShopModule,
            portal_module_1.PortalModule,
            vouchers_module_1.VouchersModule,
            finance_module_1.FinanceModule,
            sessions_module_1.SessionsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map