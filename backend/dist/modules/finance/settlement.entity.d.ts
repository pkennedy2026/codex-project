import { Tenant } from '../tenants/tenant.entity';
export declare class Settlement {
    id: string;
    tenant: Tenant;
    reportNumber: string;
    periodStart: string;
    periodEnd: string;
    grossRevenue: number;
    commissionAmount: number;
    taxAmount: number;
    netRevenue: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
