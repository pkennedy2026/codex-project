import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscribersController } from './subscribers.controller';
import { SubscribersService } from './subscribers.service';
import { Subscriber } from './subscriber.entity';
import { Tenant } from '../tenants/tenant.entity';
import { Plan } from '../plans/plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber, Tenant, Plan])],
  controllers: [SubscribersController],
  providers: [SubscribersService],
  exports: [SubscribersService],
})
export class SubscribersModule {}
