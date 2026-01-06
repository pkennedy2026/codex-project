import { Tenant } from '../tenants/tenant.entity';
import { Subscriber } from '../subscribers/subscriber.entity';
export declare class Invoice {
    id: string;
    tenant: Tenant;
    subscriber: Subscriber;
    invoiceNumber: string;
    amount: number;
    tax: number;
    total: number;
    status: string;
    dueDate: string;
    paidAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
