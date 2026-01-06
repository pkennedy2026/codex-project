import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { SubscriberCreateDto } from '../../common/dtos';
import { Subscriber } from './subscriber.entity';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('subscribers')
@UseGuards(AuthGuard, RolesGuard)
export class SubscribersController {
  constructor(private readonly subscribers: SubscribersService) {}

  @Get('health')
  health() {
    return { service: 'subscribers', status: 'ok' };
  }

  @Get()
  list(): Promise<Subscriber[]> {
    return this.subscribers.list();
  }

  @Post()
  create(@Body() body: SubscriberCreateDto): Promise<Subscriber> {
    return this.subscribers.create(body);
  }
}
