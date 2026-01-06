import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { Invoice } from './invoice.entity';
import { Tenant } from '../tenants/tenant.entity';
import { Subscriber } from '../subscribers/subscriber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Tenant, Subscriber])],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
