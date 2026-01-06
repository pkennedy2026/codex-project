import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { Wallet } from './wallet.entity';
import { Settlement } from './settlement.entity';
import { Payout } from './payout.entity';
import { Tenant } from '../tenants/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Settlement, Payout, Tenant])],
  controllers: [FinanceController],
  providers: [FinanceService],
})
export class FinanceModule {}
