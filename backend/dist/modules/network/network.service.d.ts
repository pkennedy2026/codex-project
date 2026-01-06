import { Repository } from 'typeorm';
import { NasDevice } from './nas.entity';
import { Tenant } from '../tenants/tenant.entity';
import { AccessPoint } from './ap.entity';
export declare class NetworkService {
    private readonly nasRepo;
    private readonly apRepo;
    private readonly tenants;
    constructor(nasRepo: Repository<NasDevice>, apRepo: Repository<AccessPoint>, tenants: Repository<Tenant>);
    listNas(): Promise<NasDevice[]>;
    createNas(input: {
        tenantId: string;
        name: string;
        ipAddress: string;
        secret?: string;
        type?: string;
        vpnIp?: string;
        tunnelPort?: number;
    }): Promise<NasDevice>;
    listAps(): Promise<AccessPoint[]>;
    createAp(input: {
        tenantId: string;
        name: string;
        macAddress: string;
        ipAddress?: string;
        status?: string;
        firmwareVersion?: string;
        ssidConfig?: string;
    }): Promise<AccessPoint>;
    diagnostics(input: {
        target: string;
        type: 'ping' | 'traceroute' | 'port';
    }): Promise<{
        target: string;
        type: "ping" | "traceroute" | "port";
        result: string;
    }>;
}
