import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlanCreateDto } from '../../common/dtos';
import { Plan } from './plan.entity';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('plans')
@UseGuards(AuthGuard, RolesGuard)
export class PlansController {
  constructor(private readonly plans: PlansService) {}

  @Get('health')
  health() {
    return { service: 'plans', status: 'ok' };
  }

  @Get()
  list(): Promise<Plan[]> {
    return this.plans.list();
  }

  @Post()
  create(@Body() body: PlanCreateDto): Promise<Plan> {
    return this.plans.create(body);
  }
}
