import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VouchersController } from './vouchers.controller';
import { VouchersService } from './vouchers.service';
import { Voucher } from './voucher.entity';
import { Tenant } from '../tenants/tenant.entity';
import { Plan } from '../plans/plan.entity';
import { Subscriber } from '../subscribers/subscriber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher, Tenant, Plan, Subscriber])],
  controllers: [VouchersController],
  providers: [VouchersService],
  exports: [VouchersService],
})
export class VouchersModule {}
