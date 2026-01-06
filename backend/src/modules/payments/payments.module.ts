import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment } from './payment.entity';
import { Tenant } from '../tenants/tenant.entity';
import { Invoice } from '../billing/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Tenant, Invoice])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
