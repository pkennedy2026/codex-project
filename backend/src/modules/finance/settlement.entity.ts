import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';

@Entity({ name: 'settlements' })
export class Settlement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Tenant, { eager: true })
  tenant!: Tenant;

  @Column()
  reportNumber!: string;

  @Column({ type: 'date' })
  periodStart!: string;

  @Column({ type: 'date' })
  periodEnd!: string;

  @Column('decimal', { precision: 14, scale: 2 })
  grossRevenue!: number;

  @Column('decimal', { precision: 14, scale: 2 })
  commissionAmount!: number;

  @Column('decimal', { precision: 14, scale: 2 })
  taxAmount!: number;

  @Column('decimal', { precision: 14, scale: 2 })
  netRevenue!: number;

  @Column({ default: 'pending' })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
