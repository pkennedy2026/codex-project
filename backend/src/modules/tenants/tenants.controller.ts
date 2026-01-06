import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantCreateDto } from '../../common/dtos';
import { Tenant } from './tenant.entity';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('tenants')
@UseGuards(AuthGuard, RolesGuard)
export class TenantsController {
  constructor(private readonly tenants: TenantsService) {}

  @Get('health')
  health() {
    return { service: 'tenants', status: 'ok' };
  }

  @Get()
  list(): Promise<Tenant[]> {
    return this.tenants.list();
  }

  @Post()
  @Roles('super_admin')
  create(@Body() body: TenantCreateDto): Promise<Tenant> {
    return this.tenants.create(body);
  }
}
