import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { Settlement } from './settlement.entity';
import { Payout } from './payout.entity';
import { Tenant } from '../tenants/tenant.entity';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Wallet)
    private readonly wallets: Repository<Wallet>,
    @InjectRepository(Settlement)
    private readonly settlements: Repository<Settlement>,
    @InjectRepository(Payout)
    private readonly payouts: Repository<Payout>,
    @InjectRepository(Tenant)
    private readonly tenants: Repository<Tenant>,
  ) {}

  listWallets() {
    return this.wallets.find();
  }

  async createWallet(input: { tenantId: string }) {
    const tenant = await this.tenants.findOneByOrFail({ id: input.tenantId });
    const existing = await this.wallets.findOne({ where: { tenant: { id: tenant.id } } });
    if (existing) return existing;
    const entity = this.wallets.create({ tenant, balance: 0 });
    return this.wallets.save(entity);
  }

  listSettlements() {
    return this.settlements.find();
  }

  async createSettlement(input: {
    tenantId: string;
    reportNumber: string;
    periodStart: string;
    periodEnd: string;
    grossRevenue: number;
    commissionAmount: number;
    taxAmount: number;
    netRevenue: number;
    status?: string;
  }) {
    const tenant = await this.tenants.findOneByOrFail({ id: input.tenantId });
    const entity = this.settlements.create({
      tenant,
      reportNumber: input.reportNumber,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      grossRevenue: input.grossRevenue,
      commissionAmount: input.commissionAmount,
      taxAmount: input.taxAmount,
      netRevenue: input.netRevenue,
      status: input.status ?? 'pending',
    });
    return this.settlements.save(entity);
  }

  listPayouts() {
    return this.payouts.find();
  }

  async createPayout(input: { tenantId: string; settlementId: string; payoutNumber: string; amount: number; payoutMethod?: string; status?: string }) {
    const tenant = await this.tenants.findOneByOrFail({ id: input.tenantId });
    const settlement = await this.settlements.findOneByOrFail({ id: input.settlementId });
    const entity = this.payouts.create({
      tenant,
      settlement,
      payoutNumber: input.payoutNumber,
      amount: input.amount,
      payoutMethod: input.payoutMethod,
      status: input.status ?? 'pending',
    });
    return this.payouts.save(entity);
  }
}
