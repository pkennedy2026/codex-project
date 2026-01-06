import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voucher } from './voucher.entity';
import { Tenant } from '../tenants/tenant.entity';
import { Plan } from '../plans/plan.entity';
import { Subscriber } from '../subscribers/subscriber.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class VouchersService {
  constructor(
    @InjectRepository(Voucher)
    private readonly vouchers: Repository<Voucher>,
    @InjectRepository(Tenant)
    private readonly tenants: Repository<Tenant>,
    @InjectRepository(Plan)
    private readonly plans: Repository<Plan>,
    @InjectRepository(Subscriber)
    private readonly subscribers: Repository<Subscriber>,
  ) {}

  list(): Promise<Voucher[]> {
    return this.vouchers.find();
  }

  async issue(params: { tenantId: string; planId: string; validityMinutes?: number; expiresAt?: string }) {
    const tenant = await this.tenants.findOneByOrFail({ id: params.tenantId });
    const plan = await this.plans.findOneByOrFail({ id: params.planId });
    const code = randomBytes(4).toString('hex').toUpperCase();
    const voucher = this.vouchers.create({
      tenant,
      plan,
      code,
      validityMinutes: params.validityMinutes ?? 60,
      expiresAt: params.expiresAt ? new Date(params.expiresAt) : undefined,
    });
    return this.vouchers.save(voucher);
  }

  async redeem(params: { code: string; subscriberId: string }) {
    const voucher = await this.vouchers.findOne({ where: { code: params.code } });
    if (!voucher || voucher.isUsed) {
      throw new Error('Voucher not available');
    }
    const subscriber = await this.subscribers.findOneByOrFail({ id: params.subscriberId });
    voucher.isUsed = true;
    voucher.usedAt = new Date();
    voucher.usedBy = subscriber;
    return this.vouchers.save(voucher);
  }
}
