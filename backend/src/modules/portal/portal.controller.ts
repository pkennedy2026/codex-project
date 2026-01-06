import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VouchersService } from '../vouchers/vouchers.service';
import { SubscribersService } from '../subscribers/subscribers.service';

@Controller('portal')
export class PortalController {
  constructor(
    private readonly vouchers: VouchersService,
    private readonly subscribers: SubscribersService,
  ) {}

  @Get('health')
  health() {
    return { service: 'portal', status: 'ok' };
  }

  @Get(':tenantSlug')
  tenantPortal(@Param('tenantSlug') tenantSlug: string) {
    return { portal: tenantSlug, status: 'placeholder' };
  }

  @Post(':tenantId/redeem')
  async redeem(@Param('tenantId') tenantId: string, @Body() body: { code: string; subscriberId: string }) {
    await this.vouchers.redeem({ code: body.code, subscriberId: body.subscriberId });
    return { status: 'redeemed', code: body.code };
  }

  @Post(':tenantId/register')
  async register(
    @Param('tenantId') tenantId: string,
    @Body() body: { username: string; email?: string; fullName?: string; phone?: string; connectionType?: 'pppoe' | 'hotspot' },
  ) {
    const sub = await this.subscribers.create({
      tenantId,
      username: body.username,
      email: body.email,
      fullName: body.fullName,
      phone: body.phone,
      connectionType: body.connectionType,
      status: 'active',
    });
    return { subscriberId: sub.id };
  }
}
