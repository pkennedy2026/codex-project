import { Tenant } from '../tenants/tenant.entity';
export declare class Plan {
    id: string;
    tenant: Tenant;
    name: string;
    price: number;
    downloadSpeed?: number;
    uploadSpeed?: number;
    dataCap?: number;
    validityDays?: number;
    billingCycle?: string;
    isHotspot: boolean;
    isPppoe: boolean;
    createdAt: Date;
    updatedAt: Date;
}
