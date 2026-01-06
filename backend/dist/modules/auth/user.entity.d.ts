import { Tenant } from '../tenants/tenant.entity';
import { AppRole } from '../../common/types';
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    fullName?: string;
    role: AppRole;
    tenant?: Tenant | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
