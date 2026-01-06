import { Tenant } from '../tenants/tenant.entity';
import { Plan } from '../plans/plan.entity';
import { Subscriber } from '../subscribers/subscriber.entity';
export declare class Voucher {
    id: string;
    tenant: Tenant;
    plan: Plan;
    code: string;
    isUsed: boolean;
    validityMinutes: number;
    expiresAt?: Date;
    usedAt?: Date;
    usedBy?: Subscriber | null;
    createdAt: Date;
    updatedAt: Date;
}
