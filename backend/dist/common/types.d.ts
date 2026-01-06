export type AppRole = 'super_admin' | 'admin' | 'operator';
export type BillingStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
export type SessionType = 'pppoe' | 'hotspot';
export type SessionStatus = 'active' | 'ended';
export interface RequestUser {
    id: string;
    email: string;
    role: AppRole;
    tenantId?: string | null;
}
