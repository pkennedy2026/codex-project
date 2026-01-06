import { Tenant } from '../tenants/tenant.entity';
export declare class Wallet {
    id: string;
    tenant: Tenant;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}
