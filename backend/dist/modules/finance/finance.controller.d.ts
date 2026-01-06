import { FinanceService } from './finance.service';
export declare class FinanceController {
    private readonly finance;
    constructor(finance: FinanceService);
    listWallets(): Promise<import("./wallet.entity").Wallet[]>;
    createWallet(body: {
        tenantId: string;
    }): Promise<import("./wallet.entity").Wallet>;
    listSettlements(): Promise<import("./settlement.entity").Settlement[]>;
    createSettlement(body: {
        tenantId: string;
        reportNumber: string;
        periodStart: string;
        periodEnd: string;
        grossRevenue: number;
        commissionAmount: number;
        taxAmount: number;
        netRevenue: number;
        status?: string;
    }): Promise<import("./settlement.entity").Settlement>;
    listPayouts(): Promise<import("./payout.entity").Payout[]>;
    createPayout(body: {
        tenantId: string;
        settlementId: string;
        payoutNumber: string;
        amount: number;
        payoutMethod?: string;
        status?: string;
    }): Promise<import("./payout.entity").Payout>;
}
