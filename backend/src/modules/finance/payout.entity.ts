import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Settlement } from './settlement.entity';
import { Tenant } from '../tenants/tenant.entity';

@Entity({ name: 'payouts' })
export class Payout {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Tenant, { eager: true })
  tenant!: Tenant;

  @ManyToOne(() => Settlement, { eager: true })
  settlement!: Settlement;

  @Column()
  payoutNumber!: string;

  @Column('decimal', { precision: 14, scale: 2 })
  amount!: number;

  @Column({ default: 'pending' })
  status!: string;

  @Column({ nullable: true })
  payoutMethod?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
