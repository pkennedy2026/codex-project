import { Repository } from 'typeorm';
import { Plan } from './plan.entity';
import { PlanCreateDto } from '../../common/dtos';
import { Tenant } from '../tenants/tenant.entity';
export declare class PlansService {
    private readonly repo;
    private readonly tenants;
    constructor(repo: Repository<Plan>, tenants: Repository<Tenant>);
    list(): Promise<Plan[]>;
    create(input: PlanCreateDto): Promise<Plan>;
}
