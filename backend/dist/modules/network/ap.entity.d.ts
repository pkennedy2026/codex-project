import { Tenant } from '../tenants/tenant.entity';
export declare class AccessPoint {
    id: string;
    tenant: Tenant;
    name: string;
    macAddress: string;
    ipAddress?: string;
    status: string;
    firmwareVersion?: string;
    ssidConfig?: string;
    createdAt: Date;
    updatedAt: Date;
}
