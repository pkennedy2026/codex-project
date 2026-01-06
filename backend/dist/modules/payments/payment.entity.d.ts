import { Tenant } from '../tenants/tenant.entity';
import { Invoice } from '../billing/invoice.entity';
export declare class Payment {
    id: string;
    tenant: Tenant;
    invoice: Invoice;
    amount: number;
    paymentMethod: string;
    reference?: string;
    status: string;
    createdAt: Date;
}
