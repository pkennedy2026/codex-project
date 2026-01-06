import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { Invoice } from '../billing/invoice.entity';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Tenant, { eager: true })
  tenant!: Tenant;

  @ManyToOne(() => Invoice, { eager: true })
  invoice!: Invoice;

  @Column('decimal', { precision: 12, scale: 2 })
  amount!: number;

  @Column()
  paymentMethod!: string;

  @Column({ nullable: true })
  reference?: string;

  @Column({ default: 'pending' })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
