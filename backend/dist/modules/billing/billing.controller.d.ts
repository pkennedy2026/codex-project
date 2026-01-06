import { BillingService } from './billing.service';
import { InvoiceCreateDto } from '../../common/dtos';
import { Invoice } from './invoice.entity';
export declare class BillingController {
    private readonly billing;
    constructor(billing: BillingService);
    health(): {
        service: string;
        status: string;
    };
    listInvoices(): Promise<Invoice[]>;
    getInvoice(id: string): Promise<{
        invoice: Invoice;
        totalPaid: number;
    }>;
    createInvoice(body: InvoiceCreateDto): Promise<Invoice>;
}
