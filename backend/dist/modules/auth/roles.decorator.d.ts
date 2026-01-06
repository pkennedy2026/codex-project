import { AppRole } from '../../common/types';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: AppRole[]) => import("@nestjs/common").CustomDecorator<string>;
