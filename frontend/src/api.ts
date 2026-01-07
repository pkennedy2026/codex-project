const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000/api';

type HttpMethod = 'GET' | 'POST';

async function request<T>(path: string, method: HttpMethod = 'GET', body?: unknown, token?: string): Promise<T> {
  const url = `${API_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = data.message || data.error || JSON.stringify(data);
    } catch {
      const text = await res.text();
      if (text) message = text;
    }
    throw new Error(message || 'Request failed');
  }
  return res.json() as Promise<T>;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    fullName?: string;
    tenant?: { id: string; name: string };
  };
}

export const api = {
  login: (email: string, password: string) => request<AuthResponse>('/auth/login', 'POST', { email, password }),
  register: (payload: { email: string; password: string; fullName?: string; role?: string; tenantId?: string }) =>
    request<AuthResponse>('/auth/register', 'POST', payload),
  tenants: (token: string) => request<any[]>('/tenants', 'GET', undefined, token),
  createTenant: (token: string, payload: { name: string; slug: string; logoUrl?: string }) =>
    request('/tenants', 'POST', payload, token),
  plans: (token: string) => request<any[]>('/plans', 'GET', undefined, token),
  createPlan: (
    token: string,
    payload: {
      tenantId: string;
      name: string;
      price: number;
      downloadSpeed?: number;
      uploadSpeed?: number;
      dataCap?: number;
      validityDays?: number;
    },
  ) => request('/plans', 'POST', payload, token),
  subscribers: (token: string) => request<any[]>('/subscribers', 'GET', undefined, token),
  createSubscriber: (
    token: string,
    payload: { tenantId: string; username: string; email?: string; fullName?: string; phone?: string; planId?: string },
  ) => request('/subscribers', 'POST', payload, token),
  invoices: (token: string) => request<any[]>('/billing/invoices', 'GET', undefined, token),
  invoice: (token: string, id: string) => request<any>(`/billing/invoices/${id}`, 'GET', undefined, token),
  createInvoice: (
    token: string,
    payload: {
      tenantId: string;
      subscriberId: string;
      invoiceNumber: string;
      amount: number;
      tax?: number;
      total: number;
      status: string;
      dueDate: string;
    },
  ) => request('/billing/invoices', 'POST', payload, token),
  payments: (token: string) => request<any[]>('/payments', 'GET', undefined, token),
  createPayment: (
    token: string,
    payload: { tenantId: string; invoiceId: string; amount: number; paymentMethod: string; reference?: string },
  ) => request('/payments', 'POST', payload, token),
  health: () => request<{ service: string; status: string }>('/auth/health'),
};

export function getApiUrl() {
  return API_URL;
}
