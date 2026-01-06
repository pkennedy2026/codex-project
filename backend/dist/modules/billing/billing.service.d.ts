import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
import { InvoiceCreateDto } from '../../common/dtos';
import { Tenant } from '../tenants/tenant.entity';
import { Subscriber } from '../subscribers/subscriber.entity';
export declare class BillingService {
    private readonly invoices;
    private readonly tenants;
    private readonly subscribers;
    constructor(invoices: Repository<Invoice>, tenants: Repository<Tenant>, subscribers: Repository<Subscriber>);
    listInvoices(): Promise<Invoice[]>;
    getInvoice(id: string): Promise<{
        invoice: Invoice;
        totalPaid: number;
    }>;
    createInvoice(input: InvoiceCreateDto): Promise<Invoice>;
}
