import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NasDevice } from './nas.entity';
import { Tenant } from '../tenants/tenant.entity';
import { AccessPoint } from './ap.entity';

@Injectable()
export class NetworkService {
  constructor(
    @InjectRepository(NasDevice)
    private readonly nasRepo: Repository<NasDevice>,
    @InjectRepository(AccessPoint)
    private readonly apRepo: Repository<AccessPoint>,
    @InjectRepository(Tenant)
    private readonly tenants: Repository<Tenant>,
  ) {}

  listNas(): Promise<NasDevice[]> {
    return this.nasRepo.find();
  }

  async createNas(input: { tenantId: string; name: string; ipAddress: string; secret?: string; type?: string; vpnIp?: string; tunnelPort?: number }) {
    const tenant = await this.tenants.findOneByOrFail({ id: input.tenantId });
    const entity = this.nasRepo.create({
      tenant,
      name: input.name,
      ipAddress: input.ipAddress,
      secret: input.secret,
      type: input.type ?? 'mikrotik',
      vpnIp: input.vpnIp,
      tunnelPort: input.tunnelPort,
    });
    return this.nasRepo.save(entity);
  }

  listAps(): Promise<AccessPoint[]> {
    return this.apRepo.find();
  }

  async createAp(input: { tenantId: string; name: string; macAddress: string; ipAddress?: string; status?: string; firmwareVersion?: string; ssidConfig?: string }) {
    const tenant = await this.tenants.findOneByOrFail({ id: input.tenantId });
    const entity = this.apRepo.create({
      tenant,
      name: input.name,
      macAddress: input.macAddress,
      ipAddress: input.ipAddress,
      status: input.status ?? 'unknown',
      firmwareVersion: input.firmwareVersion,
      ssidConfig: input.ssidConfig,
    });
    return this.apRepo.save(entity);
  }

  async diagnostics(input: { target: string; type: 'ping' | 'traceroute' | 'port' }) {
    // Placeholder diagnostics response
    return { target: input.target, type: input.type, result: 'ok (mock)' };
  }
}
