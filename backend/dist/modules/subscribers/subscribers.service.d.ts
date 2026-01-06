import { Repository } from 'typeorm';
import { Subscriber } from './subscriber.entity';
import { SubscriberCreateDto } from '../../common/dtos';
import { Tenant } from '../tenants/tenant.entity';
import { Plan } from '../plans/plan.entity';
export declare class SubscribersService {
    private readonly repo;
    private readonly tenants;
    private readonly plans;
    constructor(repo: Repository<Subscriber>, tenants: Repository<Tenant>, plans: Repository<Plan>);
    list(): Promise<Subscriber[]>;
    create(input: SubscriberCreateDto): Promise<Subscriber>;
}
