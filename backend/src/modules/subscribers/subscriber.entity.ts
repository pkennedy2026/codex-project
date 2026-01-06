import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { Plan } from '../plans/plan.entity';

@Entity({ name: 'subscribers' })
export class Subscriber {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Tenant, { eager: true })
  tenant!: Tenant;

  @Column()
  username!: string;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @ManyToOne(() => Plan, { eager: true, nullable: true })
  plan?: Plan | null;

  @Column({ default: 'active' })
  status!: string;

  @Column({ nullable: true })
  connectionType?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
