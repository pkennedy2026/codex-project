import { Module } from '@nestjs/common';
import { PortalController } from './portal.controller';
import { VouchersModule } from '../vouchers/vouchers.module';
import { SubscribersModule } from '../subscribers/subscribers.module';

@Module({
  imports: [VouchersModule, SubscribersModule],
  controllers: [PortalController],
})
export class PortalModule {}
