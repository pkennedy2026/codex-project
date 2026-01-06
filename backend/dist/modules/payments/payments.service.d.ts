import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { PaymentCreateDto } from '../../common/dtos';
import { Tenant } from '../tenants/tenant.entity';
import { Invoice } from '../billing/invoice.entity';
export declare class PaymentsService {
    private readonly payments;
    private readonly tenants;
    private readonly invoices;
    constructor(payments: Repository<Payment>, tenants: Repository<Tenant>, invoices: Repository<Invoice>);
    list(): Promise<Payment[]>;
    create(input: PaymentCreateDto): Promise<Payment>;
}
