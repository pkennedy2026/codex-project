import { Repository } from 'typeorm';
import { User } from './user.entity';
import { LoginDto, UserCreateDto } from '../../common/dtos';
export declare class AuthService {
    private readonly users;
    constructor(users: Repository<User>);
    register(input: UserCreateDto): Promise<{
        token: string;
        user: User;
    }>;
    validate(login: LoginDto): Promise<{
        token: string;
        user: User;
    }>;
    issueToken(user: User): string;
}
