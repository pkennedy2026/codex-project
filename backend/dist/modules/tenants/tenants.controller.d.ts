import { TenantsService } from './tenants.service';
import { TenantCreateDto } from '../../common/dtos';
import { Tenant } from './tenant.entity';
export declare class TenantsController {
    private readonly tenants;
    constructor(tenants: TenantsService);
    health(): {
        service: string;
        status: string;
    };
    list(): Promise<Tenant[]>;
    create(body: TenantCreateDto): Promise<Tenant>;
}
