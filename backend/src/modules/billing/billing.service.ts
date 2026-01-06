import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
import { InvoiceCreateDto } from '../../common/dtos';
import { Tenant } from '../tenants/tenant.entity';
import { Subscriber } from '../subscribers/subscriber.entity';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoices: Repository<Invoice>,
    @InjectRepository(Tenant)
    private readonly tenants: Repository<Tenant>,
    @InjectRepository(Subscriber)
    private readonly subscribers: Repository<Subscriber>,
  ) {}

  listInvoices(): Promise<Invoice[]> {
    return this.invoices.find();
  }

  async getInvoice(id: string): Promise<{ invoice: Invoice; totalPaid: number }> {
    const invoice = await this.invoices.findOneOrFail({
      where: { id },
    });
    const aggregate =
      (await this.invoices.manager
        .createQueryBuilder()
        .select('SUM(p.amount)', 'totalPaid')
        .from('payments', 'p')
        .where('p.invoiceId = :id', { id })
        .getRawOne<{ totalPaid: string | null }>()) || { totalPaid: '0' };
    return { invoice, totalPaid: Number((aggregate as any).totalPaid || 0) };
  }

  async createInvoice(input: InvoiceCreateDto): Promise<Invoice> {
    const tenant = await this.tenants.findOneByOrFail({ id: input.tenantId });
    const subscriber = await this.subscribers.findOneByOrFail({ id: input.subscriberId });
    const entity = this.invoices.create({
      tenant,
      subscriber,
      invoiceNumber: input.invoiceNumber,
      amount: input.amount,
      tax: input.tax ?? 0,
      total: input.total,
      status: input.status,
      dueDate: input.dueDate,
      paidAt: input.paidAt ? new Date(input.paidAt) : undefined,
    });
    return this.invoices.save(entity);
  }
}
