import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class AuthGuard implements CanActivate {
    private readonly users;
    constructor(users: Repository<User>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
