import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('sessions')
@UseGuards(AuthGuard, RolesGuard)
export class SessionsController {
  constructor(private readonly sessions: SessionsService) {}

  @Get()
  list() {
    return this.sessions.list();
  }

  @Post('start')
  start(
    @Body()
    body: {
      tenantId: string;
      subscriberId: string;
      sessionType: 'pppoe' | 'hotspot';
      nasIp?: string;
      framedIp?: string;
      macAddress?: string;
    },
  ) {
    return this.sessions.start(body);
  }

  @Post(':id/end')
  end(@Param('id') id: string, @Body() body: { bytesIn?: number; bytesOut?: number }) {
    return this.sessions.end(id, body);
  }
}
