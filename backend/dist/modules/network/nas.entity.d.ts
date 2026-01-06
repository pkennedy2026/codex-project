import { Tenant } from '../tenants/tenant.entity';
export declare class NasDevice {
    id: string;
    tenant: Tenant;
    name: string;
    ipAddress: string;
    secret?: string;
    type: string;
    isActive: boolean;
    vpnIp?: string;
    tunnelPort?: number;
    createdAt: Date;
    updatedAt: Date;
}
