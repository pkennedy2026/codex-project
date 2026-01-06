import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestUser } from '../../common/types';
import { User } from './user.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const header = (req.headers.authorization || '') as string;
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
    if (!token) throw new UnauthorizedException('Missing bearer token');

    let payload: RequestUser;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as RequestUser;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.users.findOne({ where: { id: payload.id } });
    if (!user) throw new UnauthorizedException('User not found');
    req.user = payload;
    return true;
  }
}
