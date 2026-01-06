import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from './subscriber.entity';
import { SubscriberCreateDto } from '../../common/dtos';
import { Tenant } from '../tenants/tenant.entity';
import { Plan } from '../plans/plan.entity';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly repo: Repository<Subscriber>,
    @InjectRepository(Tenant)
    private readonly tenants: Repository<Tenant>,
    @InjectRepository(Plan)
    private readonly plans: Repository<Plan>,
  ) {}

  list(): Promise<Subscriber[]> {
    return this.repo.find();
  }

  async create(input: SubscriberCreateDto): Promise<Subscriber> {
    const tenant = await this.tenants.findOneByOrFail({ id: input.tenantId });
    const plan = input.planId ? await this.plans.findOneBy({ id: input.planId }) : null;
    const entity = this.repo.create({
      tenant,
      plan: plan ?? undefined,
      username: input.username,
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      status: input.status ?? 'active',
      connectionType: input.connectionType,
    });
    return this.repo.save(entity);
  }
}
