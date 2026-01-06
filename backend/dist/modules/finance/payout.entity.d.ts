import { Settlement } from './settlement.entity';
import { Tenant } from '../tenants/tenant.entity';
export declare class Payout {
    id: string;
    tenant: Tenant;
    settlement: Settlement;
    payoutNumber: string;
    amount: number;
    status: string;
    payoutMethod?: string;
    createdAt: Date;
}
