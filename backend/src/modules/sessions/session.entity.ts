import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { Subscriber } from '../subscribers/subscriber.entity';

@Entity({ name: 'sessions' })
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Tenant, { eager: true })
  tenant!: Tenant;

  @ManyToOne(() => Subscriber, { eager: true })
  subscriber!: Subscriber;

  @Column({ type: 'varchar' })
  sessionType!: 'pppoe' | 'hotspot';

  @Column({ default: 'active' })
  status!: 'active' | 'ended';

  @Column({ type: 'timestamp' })
  startedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt?: Date;

  @Column({ type: 'bigint', default: 0 })
  bytesIn!: number;

  @Column({ type: 'bigint', default: 0 })
  bytesOut!: number;

  @Column({ nullable: true })
  nasIp?: string;

  @Column({ nullable: true })
  framedIp?: string;

  @Column({ nullable: true })
  macAddress?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
