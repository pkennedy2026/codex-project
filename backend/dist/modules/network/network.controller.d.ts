import { NetworkService } from './network.service';
export declare class NetworkController {
    private readonly network;
    constructor(network: NetworkService);
    health(): {
        service: string;
        status: string;
    };
    listNas(): Promise<import("./nas.entity").NasDevice[]>;
    createNas(body: {
        tenantId: string;
        name: string;
        ipAddress: string;
        secret?: string;
        type?: string;
        vpnIp?: string;
        tunnelPort?: number;
    }): Promise<import("./nas.entity").NasDevice>;
    listAps(): Promise<import("./ap.entity").AccessPoint[]>;
    createAp(body: {
        tenantId: string;
        name: string;
        macAddress: string;
        ipAddress?: string;
        status?: string;
        firmwareVersion?: string;
        ssidConfig?: string;
    }): Promise<import("./ap.entity").AccessPoint>;
    diagnostics(body: {
        target: string;
        type: 'ping' | 'traceroute' | 'port';
    }): Promise<{
        target: string;
        type: "ping" | "traceroute" | "port";
        result: string;
    }>;
}
