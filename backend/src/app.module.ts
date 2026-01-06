import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { SubscribersModule } from './modules/subscribers/subscribers.module';
import { PlansModule } from './modules/plans/plans.module';
import { BillingModule } from './modules/billing/billing.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NetworkModule } from './modules/network/network.module';
import { ShopModule } from './modules/shop/shop.module';
import { PortalModule } from './modules/portal/portal.module';
import { Tenant } from './modules/tenants/tenant.entity';
import { Subscriber } from './modules/subscribers/subscriber.entity';
import { Plan } from './modules/plans/plan.entity';
import { Invoice } from './modules/billing/invoice.entity';
import { Payment } from './modules/payments/payment.entity';
import { Voucher } from './modules/vouchers/voucher.entity';
import { VouchersModule } from './modules/vouchers/vouchers.module';
import { NasDevice } from './modules/network/nas.entity';
import { AccessPoint } from './modules/network/ap.entity';
import { User } from './modules/auth/user.entity';
import { FinanceModule } from './modules/finance/finance.module';
import { Wallet } from './modules/finance/wallet.entity';
import { Settlement } from './modules/finance/settlement.entity';
import { Payout } from './modules/finance/payout.entity';
import { SessionsModule } from './modules/sessions/sessions.module';
import { Session } from './modules/sessions/session.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgres://kennet:kennet@localhost:5432/kennet',
      entities: [
        Tenant,
        Subscriber,
        Plan,
        Invoice,
        Payment,
        Voucher,
        NasDevice,
        AccessPoint,
        User,
        Wallet,
        Settlement,
        Payout,
        Session,
      ],
      synchronize: process.env.TYPEORM_SYNC === 'true',
      logging: false,
    }),
    AuthModule,
    TenantsModule,
    SubscribersModule,
    PlansModule,
    BillingModule,
    PaymentsModule,
    NetworkModule,
    ShopModule,
    PortalModule,
    VouchersModule,
    FinanceModule,
    SessionsModule,
  ],
})
export class AppModule {}
