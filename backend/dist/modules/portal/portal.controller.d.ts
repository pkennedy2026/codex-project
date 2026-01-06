import { VouchersService } from '../vouchers/vouchers.service';
import { SubscribersService } from '../subscribers/subscribers.service';
export declare class PortalController {
    private readonly vouchers;
    private readonly subscribers;
    constructor(vouchers: VouchersService, subscribers: SubscribersService);
    health(): {
        service: string;
        status: string;
    };
    tenantPortal(tenantSlug: string): {
        portal: string;
        status: string;
    };
    redeem(tenantId: string, body: {
        code: string;
        subscriberId: string;
    }): Promise<{
        status: string;
        code: string;
    }>;
    register(tenantId: string, body: {
        username: string;
        email?: string;
        fullName?: string;
        phone?: string;
        connectionType?: 'pppoe' | 'hotspot';
    }): Promise<{
        subscriberId: string;
    }>;
}
