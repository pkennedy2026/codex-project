import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { Settlement } from './settlement.entity';
import { Payout } from './payout.entity';
import { Tenant } from '../tenants/tenant.entity';
export declare class FinanceService {
    private readonly wallets;
    private readonly settlements;
    private readonly payouts;
    private readonly tenants;
    constructor(wallets: Repository<Wallet>, settlements: Repository<Settlement>, payouts: Repository<Payout>, tenants: Repository<Tenant>);
    listWallets(): Promise<Wallet[]>;
    createWallet(input: {
        tenantId: string;
    }): Promise<Wallet>;
    listSettlements(): Promise<Settlement[]>;
    createSettlement(input: {
        tenantId: string;
        reportNumber: string;
        periodStart: string;
        periodEnd: string;
        grossRevenue: number;
        commissionAmount: number;
        taxAmount: number;
        netRevenue: number;
        status?: string;
    }): Promise<Settlement>;
    listPayouts(): Promise<Payout[]>;
    createPayout(input: {
        tenantId: string;
        settlementId: string;
        payoutNumber: string;
        amount: number;
        payoutMethod?: string;
        status?: string;
    }): Promise<Payout>;
}
