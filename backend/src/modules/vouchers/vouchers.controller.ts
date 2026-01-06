import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Voucher } from './voucher.entity';

@Controller('vouchers')
@UseGuards(AuthGuard, RolesGuard)
export class VouchersController {
  constructor(private readonly vouchers: VouchersService) {}

  @Get()
  list(): Promise<Voucher[]> {
    return this.vouchers.list();
  }

  @Post('issue')
  @Roles('admin', 'super_admin')
  issue(@Body() body: { tenantId: string; planId: string; validityMinutes?: number; expiresAt?: string }): Promise<Voucher> {
    return this.vouchers.issue(body);
  }

  @Post('redeem')
  redeem(@Body() body: { code: string; subscriberId: string }): Promise<Voucher> {
    return this.vouchers.redeem(body);
  }
}
