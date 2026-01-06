import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './plan.entity';
import { PlanCreateDto } from '../../common/dtos';
import { Tenant } from '../tenants/tenant.entity';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private readonly repo: Repository<Plan>,
    @InjectRepository(Tenant)
    private readonly tenants: Repository<Tenant>,
  ) {}

  list(): Promise<Plan[]> {
    return this.repo.find();
  }

  async create(input: PlanCreateDto): Promise<Plan> {
    const tenant = await this.tenants.findOneByOrFail({ id: input.tenantId });
    const entity = this.repo.create({
      tenant,
      name: input.name,
      price: input.price,
      downloadSpeed: input.downloadSpeed,
      uploadSpeed: input.uploadSpeed,
      dataCap: input.dataCap,
      validityDays: input.validityDays,
      billingCycle: input.billingCycle,
      isHotspot: input.isHotspot ?? false,
      isPppoe: input.isPppoe ?? false,
    });
    return this.repo.save(entity);
  }
}
