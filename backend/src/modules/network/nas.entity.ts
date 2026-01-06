import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';

@Entity({ name: 'nas_devices' })
export class NasDevice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Tenant, { eager: true })
  tenant!: Tenant;

  @Column()
  name!: string;

  @Column()
  ipAddress!: string;

  @Column({ nullable: true })
  secret?: string;

  @Column({ default: 'mikrotik' })
  type!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  vpnIp?: string;

  @Column({ type: 'int', nullable: true })
  tunnelPort?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
