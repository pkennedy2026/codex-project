import { Repository } from 'typeorm';
import { Session } from './session.entity';
import { Tenant } from '../tenants/tenant.entity';
import { Subscriber } from '../subscribers/subscriber.entity';
export declare class SessionsService {
    private readonly sessions;
    private readonly tenants;
    private readonly subscribers;
    constructor(sessions: Repository<Session>, tenants: Repository<Tenant>, subscribers: Repository<Subscriber>);
    list(): Promise<Session[]>;
    start(input: {
        tenantId: string;
        subscriberId: string;
        sessionType: 'pppoe' | 'hotspot';
        nasIp?: string;
        framedIp?: string;
        macAddress?: string;
    }): Promise<Session>;
    end(id: string, payload?: {
        bytesIn?: number;
        bytesOut?: number;
    }): Promise<Session>;
}
