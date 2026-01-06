import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';
import { Tenant } from '../tenants/tenant.entity';
import { Subscriber } from '../subscribers/subscriber.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessions: Repository<Session>,
    @InjectRepository(Tenant)
    private readonly tenants: Repository<Tenant>,
    @InjectRepository(Subscriber)
    private readonly subscribers: Repository<Subscriber>,
  ) {}

  list() {
    return this.sessions.find();
  }

  async start(input: {
    tenantId: string;
    subscriberId: string;
    sessionType: 'pppoe' | 'hotspot';
    nasIp?: string;
    framedIp?: string;
    macAddress?: string;
  }) {
    const tenant = await this.tenants.findOneByOrFail({ id: input.tenantId });
    const subscriber = await this.subscribers.findOneByOrFail({ id: input.subscriberId });
    const entity = this.sessions.create({
      tenant,
      subscriber,
      sessionType: input.sessionType,
      status: 'active',
      startedAt: new Date(),
      nasIp: input.nasIp,
      framedIp: input.framedIp,
      macAddress: input.macAddress,
    });
    return this.sessions.save(entity);
  }

  async end(id: string, payload?: { bytesIn?: number; bytesOut?: number }) {
    const session = await this.sessions.findOneByOrFail({ id });
    session.status = 'ended';
    session.endedAt = new Date();
    if (payload?.bytesIn !== undefined) session.bytesIn = payload.bytesIn;
    if (payload?.bytesOut !== undefined) session.bytesOut = payload.bytesOut;
    return this.sessions.save(session);
  }
}
