import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, UserCreateDto } from '../../common/dtos';
import { Request } from 'express';
import { RequestUser } from '../../common/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get('health')
  health() {
    return { service: 'auth', status: 'ok' };
  }

  @Post('register')
  register(@Body() body: UserCreateDto) {
    return this.auth.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.auth.validate(body);
  }

  @Get('me')
  me(@Req() req: Request): RequestUser | null {
    return (req as any).user || null;
  }
}
