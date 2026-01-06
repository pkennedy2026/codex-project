import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';

@Entity({ name: 'plans' })
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Tenant, { eager: true })
  tenant!: Tenant;

  @Column()
  name!: string;

  @Column('decimal', { precision: 12, scale: 2 })
  price!: number;

  @Column({ type: 'int', nullable: true })
  downloadSpeed?: number;

  @Column({ type: 'int', nullable: true })
  uploadSpeed?: number;

  @Column({ type: 'int', nullable: true })
  dataCap?: number;

  @Column({ type: 'int', nullable: true })
  validityDays?: number;

  @Column({ nullable: true })
  billingCycle?: string;

  @Column({ default: false })
  isHotspot!: boolean;

  @Column({ default: false })
  isPppoe!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
