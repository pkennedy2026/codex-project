import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('finance')
@UseGuards(AuthGuard, RolesGuard)
export class FinanceController {
  constructor(private readonly finance: FinanceService) {}

  @Get('wallets')
  listWallets() {
    return this.finance.listWallets();
  }

  @Post('wallets')
  @Roles('super_admin', 'admin')
  createWallet(@Body() body: { tenantId: string }) {
    return this.finance.createWallet(body);
  }

  @Get('settlements')
  listSettlements() {
    return this.finance.listSettlements();
  }

  @Post('settlements')
  @Roles('super_admin')
  createSettlement(
    @Body()
    body: {
      tenantId: string;
      reportNumber: string;
      periodStart: string;
      periodEnd: string;
      grossRevenue: number;
      commissionAmount: number;
      taxAmount: number;
      netRevenue: number;
      status?: string;
    },
  ) {
    return this.finance.createSettlement(body);
  }

  @Get('payouts')
  listPayouts() {
    return this.finance.listPayouts();
  }

  @Post('payouts')
  @Roles('super_admin')
  createPayout(
    @Body()
    body: { tenantId: string; settlementId: string; payoutNumber: string; amount: number; payoutMethod?: string; status?: string },
  ) {
    return this.finance.createPayout(body);
  }
}
