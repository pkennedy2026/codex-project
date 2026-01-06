import { AppRole, BillingStatus, SessionType, TransactionStatus } from './types';
export declare class TenantCreateDto {
    name: string;
    slug: string;
    logoUrl?: string;
    isActive?: boolean;
}
export declare class UserCreateDto {
    email: string;
    fullName?: string;
    role: AppRole;
    tenantId?: string;
    password: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class SubscriberCreateDto {
    tenantId: string;
    username: string;
    fullName?: string;
    email?: string;
    phone?: string;
    planId?: string;
    status?: string;
    connectionType?: SessionType;
}
export declare class PlanCreateDto {
    tenantId: string;
    name: string;
    price: number;
    downloadSpeed?: number;
    uploadSpeed?: number;
    dataCap?: number;
    validityDays?: number;
    billingCycle?: string;
    isHotspot?: boolean;
    isPppoe?: boolean;
}
export declare class InvoiceCreateDto {
    tenantId: string;
    subscriberId: string;
    invoiceNumber: string;
    amount: number;
    tax?: number;
    total: number;
    status: BillingStatus;
    dueDate: string;
    paidAt?: string;
}
export declare class PaymentCreateDto {
    tenantId: string;
    invoiceId: string;
    amount: number;
    paymentMethod: string;
    reference?: string;
    status: TransactionStatus;
}
