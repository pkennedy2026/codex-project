import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { Subscriber } from '../subscribers/subscriber.entity';

@Entity({ name: 'invoices' })
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Tenant, { eager: true })
  tenant!: Tenant;

  @ManyToOne(() => Subscriber, { eager: true })
  subscriber!: Subscriber;

  @Column()
  invoiceNumber!: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount!: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  tax!: number;

  @Column('decimal', { precision: 12, scale: 2 })
  total!: number;

  @Column({ default: 'pending' })
  status!: string;

  @Column({ type: 'date' })
  dueDate!: string;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
