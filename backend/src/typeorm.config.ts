import { DataSource } from 'typeorm';
import { Tenant } from './modules/tenants/tenant.entity';
import { Subscriber } from './modules/subscribers/subscriber.entity';
import { Plan } from './modules/plans/plan.entity';
import { Invoice } from './modules/billing/invoice.entity';
import { Payment } from './modules/payments/payment.entity';
import { Voucher } from './modules/vouchers/voucher.entity';
import { NasDevice } from './modules/network/nas.entity';
import { AccessPoint } from './modules/network/ap.entity';
import { User } from './modules/auth/user.entity';
import { Wallet } from './modules/finance/wallet.entity';
import { Settlement } from './modules/finance/settlement.entity';
import { Payout } from './modules/finance/payout.entity';
import { Session } from './modules/sessions/session.entity';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgres://kennet:kennet@localhost:5432/kennet',
  entities: [Tenant, Subscriber, Plan, Invoice, Payment, Voucher, NasDevice, AccessPoint, User, Wallet, Settlement, Payout, Session],
  synchronize: process.env.TYPEORM_SYNC === 'true',
  migrations: ['dist/migrations/*.js'],
});

export default dataSource;
