import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { Session } from './session.entity';
import { Tenant } from '../tenants/tenant.entity';
import { Subscriber } from '../subscribers/subscriber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Tenant, Subscriber])],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
