import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { LoginDto, UserCreateDto } from '../../common/dtos';
import * as bcrypt from 'bcryptjs';
import { RequestUser } from '../../common/types';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async register(input: UserCreateDto): Promise<{ token: string; user: User }> {
    const existing = await this.users.findOne({ where: { email: input.email } });
    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }
    const entity = this.users.create({
      email: input.email,
      fullName: input.fullName,
      role: input.role,
      passwordHash: await bcrypt.hash(input.password, 10),
      tenant: input.tenantId ? ({ id: input.tenantId } as any) : null,
    });
    const user = await this.users.save(entity);
    return { token: this.issueToken(user), user };
  }

  async validate(login: LoginDto): Promise<{ token: string; user: User }> {
    const user = await this.users.findOne({ where: { email: login.email } });
    if (!user || !(await bcrypt.compare(login.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { token: this.issueToken(user), user };
  }

  issueToken(user: User): string {
    const payload: RequestUser & { exp: number } = {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant?.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8, // 8 hours
    };
    const secret = process.env.JWT_SECRET || 'dev-secret';
    return jwt.sign(payload, secret);
  }
}
