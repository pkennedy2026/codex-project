import { Tenant } from '../tenants/tenant.entity';
import { Subscriber } from '../subscribers/subscriber.entity';
export declare class Session {
    id: string;
    tenant: Tenant;
    subscriber: Subscriber;
    sessionType: 'pppoe' | 'hotspot';
    status: 'active' | 'ended';
    startedAt: Date;
    endedAt?: Date;
    bytesIn: number;
    bytesOut: number;
    nasIp?: string;
    framedIp?: string;
    macAddress?: string;
    createdAt: Date;
    updatedAt: Date;
}
