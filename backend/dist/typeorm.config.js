"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const tenant_entity_1 = require("./modules/tenants/tenant.entity");
const subscriber_entity_1 = require("./modules/subscribers/subscriber.entity");
const plan_entity_1 = require("./modules/plans/plan.entity");
const invoice_entity_1 = require("./modules/billing/invoice.entity");
const payment_entity_1 = require("./modules/payments/payment.entity");
const voucher_entity_1 = require("./modules/vouchers/voucher.entity");
const nas_entity_1 = require("./modules/network/nas.entity");
const ap_entity_1 = require("./modules/network/ap.entity");
const user_entity_1 = require("./modules/auth/user.entity");
const wallet_entity_1 = require("./modules/finance/wallet.entity");
const settlement_entity_1 = require("./modules/finance/settlement.entity");
const payout_entity_1 = require("./modules/finance/payout.entity");
const session_entity_1 = require("./modules/sessions/session.entity");
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgres://kennet:kennet@localhost:5432/kennet',
    entities: [tenant_entity_1.Tenant, subscriber_entity_1.Subscriber, plan_entity_1.Plan, invoice_entity_1.Invoice, payment_entity_1.Payment, voucher_entity_1.Voucher, nas_entity_1.NasDevice, ap_entity_1.AccessPoint, user_entity_1.User, wallet_entity_1.Wallet, settlement_entity_1.Settlement, payout_entity_1.Payout, session_entity_1.Session],
    synchronize: process.env.TYPEORM_SYNC === 'true',
    migrations: ['dist/migrations/*.js'],
});
exports.default = dataSource;
//# sourceMappingURL=typeorm.config.js.map