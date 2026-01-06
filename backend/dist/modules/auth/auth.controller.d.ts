import { AuthService } from './auth.service';
import { LoginDto, UserCreateDto } from '../../common/dtos';
import { Request } from 'express';
import { RequestUser } from '../../common/types';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    health(): {
        service: string;
        status: string;
    };
    register(body: UserCreateDto): Promise<{
        token: string;
        user: import("./user.entity").User;
    }>;
    login(body: LoginDto): Promise<{
        token: string;
        user: import("./user.entity").User;
    }>;
    me(req: Request): RequestUser | null;
}
