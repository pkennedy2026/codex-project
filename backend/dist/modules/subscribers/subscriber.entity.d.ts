import { Tenant } from '../tenants/tenant.entity';
import { Plan } from '../plans/plan.entity';
export declare class Subscriber {
    id: string;
    tenant: Tenant;
    username: string;
    fullName?: string;
    email?: string;
    phone?: string;
    plan?: Plan | null;
    status: string;
    connectionType?: string;
    createdAt: Date;
    updatedAt: Date;
}
