import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { NetworkService } from './network.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('network')
@UseGuards(AuthGuard, RolesGuard)
export class NetworkController {
  constructor(private readonly network: NetworkService) {}

  @Get('health')
  health() {
    return { service: 'network', status: 'ok' };
  }

  @Get('nas')
  listNas() {
    return this.network.listNas();
  }

  @Post('nas')
  createNas(@Body() body: { tenantId: string; name: string; ipAddress: string; secret?: string; type?: string; vpnIp?: string; tunnelPort?: number }) {
    return this.network.createNas(body);
  }

  @Get('access-points')
  listAps() {
    return this.network.listAps();
  }

  @Post('access-points')
  createAp(@Body() body: { tenantId: string; name: string; macAddress: string; ipAddress?: string; status?: string; firmwareVersion?: string; ssidConfig?: string }) {
    return this.network.createAp(body);
  }

  @Post('diagnostics')
  diagnostics(@Body() body: { target: string; type: 'ping' | 'traceroute' | 'port' }) {
    return this.network.diagnostics(body);
  }
}
