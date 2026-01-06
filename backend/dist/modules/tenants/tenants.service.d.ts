import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';
import { TenantCreateDto } from '../../common/dtos';
export declare class TenantsService {
    private readonly repo;
    constructor(repo: Repository<Tenant>);
    list(): Promise<Tenant[]>;
    create(input: TenantCreateDto): Promise<Tenant>;
}
