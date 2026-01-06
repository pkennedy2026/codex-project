import { Repository } from 'typeorm';
import { Voucher } from './voucher.entity';
import { Tenant } from '../tenants/tenant.entity';
import { Plan } from '../plans/plan.entity';
import { Subscriber } from '../subscribers/subscriber.entity';
export declare class VouchersService {
    private readonly vouchers;
    private readonly tenants;
    private readonly plans;
    private readonly subscribers;
    constructor(vouchers: Repository<Voucher>, tenants: Repository<Tenant>, plans: Repository<Plan>, subscribers: Repository<Subscriber>);
    list(): Promise<Voucher[]>;
    issue(params: {
        tenantId: string;
        planId: string;
        validityMinutes?: number;
        expiresAt?: string;
    }): Promise<Voucher>;
    redeem(params: {
        code: string;
        subscriberId: string;
    }): Promise<Voucher>;
}
