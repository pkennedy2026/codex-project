import { AppRole, BillingStatus, SessionType, TransactionStatus } from './types';
import { IsBoolean, IsDateString, IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class TenantCreateDto {
  @IsString()
  @Length(2, 120)
  name!: string;

  @IsString()
  @Length(2, 120)
  slug!: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}

export class UserCreateDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsEnum(['super_admin', 'admin', 'operator'])
  role!: AppRole;

  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @IsString()
  @Length(6, 120)
  password!: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class SubscriberCreateDto {
  @IsUUID()
  tenantId!: string;

  @IsString()
  @Length(3, 50)
  username!: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUUID()
  planId?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsEnum(['pppoe', 'hotspot'])
  connectionType?: SessionType;
}

export class PlanCreateDto {
  @IsUUID()
  tenantId!: string;

  @IsString()
  @Length(2, 120)
  name!: string;

  @IsNumber()
  price!: number;

  @IsOptional()
  @IsNumber()
  downloadSpeed?: number;

  @IsOptional()
  @IsNumber()
  uploadSpeed?: number;

  @IsOptional()
  @IsNumber()
  dataCap?: number;

  @IsOptional()
  @IsNumber()
  validityDays?: number;

  @IsOptional()
  @IsString()
  billingCycle?: string;

  @IsOptional()
  @IsBoolean()
  isHotspot?: boolean;

  @IsOptional()
  @IsBoolean()
  isPppoe?: boolean;
}

export class InvoiceCreateDto {
  @IsUUID()
  tenantId!: string;

  @IsUUID()
  subscriberId!: string;

  @IsString()
  invoiceNumber!: string;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsNumber()
  tax?: number;

  @IsNumber()
  total!: number;

  @IsEnum(['draft', 'pending', 'paid', 'overdue', 'cancelled'])
  status!: BillingStatus;

  @IsDateString()
  dueDate!: string;

  @IsOptional()
  @IsDateString()
  paidAt?: string;
}

export class PaymentCreateDto {
  @IsUUID()
  tenantId!: string;

  @IsUUID()
  invoiceId!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  paymentMethod!: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsEnum(['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'])
  status!: TransactionStatus;
}
