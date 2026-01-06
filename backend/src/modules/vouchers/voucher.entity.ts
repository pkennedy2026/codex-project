import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { Plan } from '../plans/plan.entity';
import { Subscriber } from '../subscribers/subscriber.entity';

@Entity({ name: 'vouchers' })
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Tenant, { eager: true })
  tenant!: Tenant;

  @ManyToOne(() => Plan, { eager: true })
  plan!: Plan;

  @Column({ unique: true })
  code!: string;

  @Column({ default: false })
  isUsed!: boolean;

  @Column({ type: 'int', default: 60 })
  validityMinutes!: number;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  usedAt?: Date;

  @ManyToOne(() => Subscriber, { eager: true, nullable: true })
  usedBy?: Subscriber | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
