import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { InvoiceCreateDto } from '../../common/dtos';
import { Invoice } from './invoice.entity';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Param } from '@nestjs/common';

@Controller('billing')
@UseGuards(AuthGuard, RolesGuard)
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Get('health')
  health() {
    return { service: 'billing', status: 'ok' };
  }

  @Get('invoices')
  listInvoices(): Promise<Invoice[]> {
    return this.billing.listInvoices();
  }

  @Get('invoices/:id')
  getInvoice(@Param('id') id: string) {
    return this.billing.getInvoice(id);
  }

  @Post('invoices')
  createInvoice(@Body() body: InvoiceCreateDto): Promise<Invoice> {
    return this.billing.createInvoice(body);
  }
}
