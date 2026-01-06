import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NetworkController } from './network.controller';
import { NetworkService } from './network.service';
import { NasDevice } from './nas.entity';
import { AccessPoint } from './ap.entity';
import { Tenant } from '../tenants/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NasDevice, AccessPoint, Tenant])],
  controllers: [NetworkController],
  providers: [NetworkService],
})
export class NetworkModule {}
