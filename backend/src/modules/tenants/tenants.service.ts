import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';
import { TenantCreateDto } from '../../common/dtos';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly repo: Repository<Tenant>,
  ) {}

  list(): Promise<Tenant[]> {
    return this.repo.find();
  }

  async create(input: TenantCreateDto): Promise<Tenant> {
    const entity = this.repo.create(input);
    return this.repo.save(entity);
  }
}
