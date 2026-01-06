import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentCreateDto } from '../../common/dtos';
import { Payment } from './payment.entity';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('payments')
@UseGuards(AuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Get('health')
  health() {
    return { service: 'payments', status: 'ok' };
  }

  @Get()
  list(): Promise<Payment[]> {
    return this.payments.list();
  }

  @Post()
  create(@Body() body: PaymentCreateDto): Promise<Payment> {
    return this.payments.create(body);
  }
}
