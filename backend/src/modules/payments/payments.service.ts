import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { PaymentCreateDto } from '../../common/dtos';
import { Tenant } from '../tenants/tenant.entity';
import { Invoice } from '../billing/invoice.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly payments: Repository<Payment>,
    @InjectRepository(Tenant)
    private readonly tenants: Repository<Tenant>,
    @InjectRepository(Invoice)
    private readonly invoices: Repository<Invoice>,
  ) {}

  list(): Promise<Payment[]> {
    return this.payments.find();
  }

  async create(input: PaymentCreateDto): Promise<Payment> {
    const tenant = await this.tenants.findOneByOrFail({ id: input.tenantId });
    const invoice = await this.invoices.findOneByOrFail({ id: input.invoiceId });
    const entity = this.payments.create({
      tenant,
      invoice,
      amount: input.amount,
      paymentMethod: input.paymentMethod,
      reference: input.reference,
      status: input.status || 'completed',
    });
    const saved = await this.payments.save(entity);

    // Update invoice status based on total paid
    const aggregate =
      (await this.payments
        .createQueryBuilder('p')
        .select('SUM(p.amount)', 'totalPaid')
        .where('p.invoiceId = :invoiceId', { invoiceId: invoice.id })
        .getRawOne<{ totalPaid: string | null }>()) || { totalPaid: '0' };

    const paidNumber = Number((aggregate as any).totalPaid || 0);
    const status = paidNumber >= Number(invoice.total) ? 'paid' : 'pending';
    await this.invoices.update({ id: invoice.id }, { status, paidAt: status === 'paid' ? new Date() : undefined });

    return saved;
  }
}
