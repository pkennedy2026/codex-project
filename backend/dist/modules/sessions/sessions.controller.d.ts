import { SessionsService } from './sessions.service';
export declare class SessionsController {
    private readonly sessions;
    constructor(sessions: SessionsService);
    list(): Promise<import("./session.entity").Session[]>;
    start(body: {
        tenantId: string;
        subscriberId: string;
        sessionType: 'pppoe' | 'hotspot';
        nasIp?: string;
        framedIp?: string;
        macAddress?: string;
    }): Promise<import("./session.entity").Session>;
    end(id: string, body: {
        bytesIn?: number;
        bytesOut?: number;
    }): Promise<import("./session.entity").Session>;
}
