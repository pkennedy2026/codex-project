import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';

@Entity({ name: 'access_points' })
export class AccessPoint {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Tenant, { eager: true })
  tenant!: Tenant;

  @Column()
  name!: string;

  @Column()
  macAddress!: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ default: 'unknown' })
  status!: string;

  @Column({ nullable: true })
  firmwareVersion?: string;

  @Column({ nullable: true })
  ssidConfig?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
