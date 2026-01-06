import { VouchersService } from './vouchers.service';
import { Voucher } from './voucher.entity';
export declare class VouchersController {
    private readonly vouchers;
    constructor(vouchers: VouchersService);
    list(): Promise<Voucher[]>;
    issue(body: {
        tenantId: string;
        planId: string;
        validityMinutes?: number;
        expiresAt?: string;
    }): Promise<Voucher>;
    redeem(body: {
        code: string;
        subscriberId: string;
    }): Promise<Voucher>;
}
