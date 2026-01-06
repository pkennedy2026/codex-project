import { Navigate, Outlet, Route, Routes, useLocation, Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from './auth';
import { api, getApiUrl } from './api';

const PageShell = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', background: '#0f172a', color: '#e2e8f0' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: 'linear-gradient(135deg,#111827,#0b1222)',
          borderBottom: '1px solid #1f2937',
        }}
      >
        <div>
          <div style={{ fontWeight: 700, letterSpacing: '0.03em' }}>KenNet Console</div>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>{getApiUrl()}</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 14 }}>
          <div style={{ color: '#cbd5e1' }}>{user?.email}</div>
          <button
            onClick={logout}
            style={{
              border: '1px solid #334155',
              background: '#1f2937',
              color: '#e2e8f0',
              padding: '6px 12px',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </header>
      <main style={{ padding: 20 }}>{children}</main>
    </div>
  );
};

const demoEmail = import.meta.env.VITE_DEMO_EMAIL || 'prince.kennedy@kennet.net';
const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || 'Liberia@1000';

const AuthPage = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState(demoEmail);
  const [password, setPassword] = useState(demoPassword);
  const [fullName, setFullName] = useState('Prince Kennedy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const redirect = (location.state as any)?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, fullName);
      }
      window.location.href = redirect;
    } catch (err: any) {
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'radial-gradient(circle at 20% 20%, #1d2a44 0, #0b1222 40%)',
        color: '#e2e8f0',
        fontFamily: 'Inter, sans-serif',
        padding: 16,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#0f172a',
          border: '1px solid #1f2937',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>KenNet Login</div>
          <div style={{ fontSize: 13, color: '#94a3b8' }}>
            Sign in to call the Nest API (Bearer token = user id for now).
          </div>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          {mode === 'register' && (
            <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>
              Full name
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={inputStyle}
                placeholder="Jane Admin"
              />
            </label>
          )}
          <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </label>
          <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          </label>
          {error && (
            <div style={{ color: '#fca5a5', fontSize: 13, background: '#1f2937', padding: 8, borderRadius: 6 }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Working...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail(demoEmail);
              setPassword(demoPassword);
            }}
            style={{ ...secondaryButtonStyle, textAlign: 'center' }}
            disabled={loading}
          >
            Use demo admin
          </button>
        </form>
        <div style={{ marginTop: 12, fontSize: 13, color: '#94a3b8' }}>
          {mode === 'login' ? (
            <>
              Need an account?{' '}
              <button onClick={() => setMode('register')} style={linkButtonStyle}>
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => setMode('login')} style={linkButtonStyle}>
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ tenants: number; plans: number; subscribers: number }>({
    tenants: 0,
    plans: 0,
    subscribers: 0,
  });

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tenants, plans, subscribers] = await Promise.all([
          api.tenants(token),
          api.plans(token),
          api.subscribers(token),
        ]);
        setData({ tenants: tenants.length, plans: plans.length, subscribers: subscribers.length });
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const cards = useMemo(
    () => [
      { label: 'Tenants', value: data.tenants },
      { label: 'Plans', value: data.plans },
      { label: 'Subscribers', value: data.subscribers },
    ],
    [data],
  );

  return (
    <PageShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Dashboard</div>
          <div style={{ color: '#94a3b8', fontSize: 13 }}>Welcome {user?.fullName || user?.email}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, fontSize: 13 }}>
          <Link to="/tenants" style={secondaryButtonStyle}>
            Tenants
          </Link>
          <Link to="/plans" style={secondaryButtonStyle}>
            Plans
          </Link>
          <Link to="/subscribers" style={secondaryButtonStyle}>
            Subscribers
          </Link>
        </div>
      </div>
      {loading && <div style={{ color: '#94a3b8' }}>Loading...</div>}
      {error && <div style={{ color: '#fca5a5' }}>{error}</div>}
      {!loading && !error && (
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {cards.map((card) => (
            <div
              key={card.label}
              style={{
                padding: 16,
                background: '#111827',
                borderRadius: 10,
                border: '1px solid #1f2937',
                boxShadow: '0 14px 40px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ color: '#94a3b8', fontSize: 13 }}>{card.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{card.value}</div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
};

const ListPage = ({ title }: { title: string }) => (
  <PageShell>
    <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{title}</div>
    <div style={{ color: '#94a3b8' }}>Hook up table UI here.</div>
  </PageShell>
);

const Protected = () => {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  return <Outlet />;
};

const placeholderRoutes = [
  ['/vouchers', 'Vouchers'],
  ['/network/pppoe', 'PPPoE Sessions'],
  ['/network/hotspot', 'Hotspot Users'],
  ['/network/devices', 'Network Devices'],
  ['/network/troubleshooting', 'Troubleshooting'],
  ['/wifi', 'Wi-Fi Controller'],
  ['/access-points', 'Access Points'],
  ['/radius', 'RADIUS Server'],
  ['/configuration', 'Configuration'],
  ['/billing', 'Billing'],
  ['/payments/mobile-money', 'Mobile Money'],
  ['/payments/links', 'Payment Links'],
  ['/settlements', 'Settlements'],
  ['/payouts', 'Payouts'],
  ['/wallets', 'Wallets'],
  ['/revenue', 'Revenue Dashboard'],
  ['/my-finances', 'My Finances'],
  ['/billing-settings', 'Billing Settings'],
  ['/shop/products', 'Shop Products'],
  ['/shop/categories', 'Shop Categories'],
  ['/shop/orders', 'Shop Orders'],
  ['/shop/inventory', 'Shop Inventory'],
  ['/shop/discounts', 'Shop Discounts'],
  ['/shop/reviews', 'Shop Reviews'],
  ['/security', 'Security'],
  ['/settings', 'Settings'],
  ['/portal-settings', 'Portal Settings'],
  ['/onboarding', 'Onboarding'],
];

const FormRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>
    {label}
    {children}
  </label>
);

const MessageBar = ({ text, tone = 'info' }: { text: string; tone?: 'info' | 'error' }) => (
  <div
    style={{
      padding: 10,
      borderRadius: 8,
      background: tone === 'error' ? '#1f2937' : '#0b1222',
      border: tone === 'error' ? '1px solid #b91c1c' : '1px solid #1f2937',
      color: tone === 'error' ? '#fca5a5' : '#cbd5e1',
      marginBottom: 12,
      fontSize: 13,
    }}
  >
    {text}
  </div>
);

const TenantsPage = () => {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      try {
        const data = await api.tenants(token);
        setItems(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load tenants');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError(null);
    try {
      const created = await api.createTenant(token, { name, slug });
      setItems((prev) => [...prev, created]);
      setName('');
      setSlug('');
    } catch (err: any) {
      setError(err.message || 'Failed to create tenant');
    }
  };

  return (
    <PageShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Tenants</div>
          <div style={{ color: '#94a3b8' }}>Create and list tenants.</div>
        </div>
      </div>
      <form onSubmit={handleCreate} style={{ display: 'grid', gap: 10, maxWidth: 420, marginBottom: 16 }}>
        <FormRow label="Name">
          <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required />
        </FormRow>
        <FormRow label="Slug">
          <input style={inputStyle} value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </FormRow>
        <button type="submit" style={buttonStyle} disabled={loading}>
          Create tenant
        </button>
      </form>
      <FormRow label="Filter">
        <input style={inputStyle} value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search by name/slug" />
      </FormRow>
      {error && <MessageBar text={error} tone="error" />}
      {loading ? (
        <div style={{ color: '#94a3b8' }}>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #1f2937' }}>
                <th style={{ padding: '8px 4px' }}>Name</th>
                <th style={{ padding: '8px 4px' }}>Slug</th>
                <th style={{ padding: '8px 4px' }}>Active</th>
              </tr>
            </thead>
            <tbody>
              {items
                .filter((t) => {
                  const q = filter.toLowerCase();
                  return !q || t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q);
                })
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #0f172a' }}>
                  <td style={{ padding: '6px 4px' }}>{t.name}</td>
                  <td style={{ padding: '6px 4px', color: '#94a3b8' }}>{t.slug}</td>
                  <td style={{ padding: '6px 4px' }}>{String(t.isActive ?? true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
};

const PlansPage = () => {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [form, setForm] = useState({
    tenantId: '',
    name: '',
    price: '0',
    downloadSpeed: '',
    uploadSpeed: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      try {
        const [plansRes, tenantsRes] = await Promise.all([api.plans(token), api.tenants(token)]);
        setItems(plansRes);
        setTenants(tenantsRes);
      } catch (err: any) {
        setError(err.message || 'Failed to load plans');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError(null);
    try {
      const payload = {
        tenantId: form.tenantId,
        name: form.name,
        price: Number(form.price),
        downloadSpeed: form.downloadSpeed ? Number(form.downloadSpeed) : undefined,
        uploadSpeed: form.uploadSpeed ? Number(form.uploadSpeed) : undefined,
      };
      const created = await api.createPlan(token, payload);
      setItems((prev) => [...prev, created]);
      setForm({ tenantId: '', name: '', price: '0', downloadSpeed: '', uploadSpeed: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to create plan');
    }
  };

  return (
    <PageShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Plans</div>
          <div style={{ color: '#94a3b8' }}>Create and list plans.</div>
        </div>
      </div>
      <form onSubmit={handleCreate} style={{ display: 'grid', gap: 10, maxWidth: 520, marginBottom: 16 }}>
        <FormRow label="Tenant">
          <select
            style={inputStyle}
            value={form.tenantId}
            onChange={(e) => setForm((f) => ({ ...f, tenantId: e.target.value }))}
            required
          >
            <option value="">Select tenant</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </FormRow>
        <FormRow label="Name">
          <input style={inputStyle} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
        </FormRow>
        <FormRow label="Price">
          <input
            style={inputStyle}
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            required
          />
        </FormRow>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 8 }}>
          <FormRow label="Download (Mbps)">
            <input
              style={inputStyle}
              value={form.downloadSpeed}
              onChange={(e) => setForm((f) => ({ ...f, downloadSpeed: e.target.value }))}
            />
          </FormRow>
          <FormRow label="Upload (Mbps)">
            <input style={inputStyle} value={form.uploadSpeed} onChange={(e) => setForm((f) => ({ ...f, uploadSpeed: e.target.value }))} />
          </FormRow>
        </div>
        <button type="submit" style={buttonStyle} disabled={loading}>
          Create plan
        </button>
      </form>
      <FormRow label="Filter">
        <input
          style={inputStyle}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search by name/tenant"
        />
      </FormRow>
      {error && <MessageBar text={error} tone="error" />}
      {loading ? (
        <div style={{ color: '#94a3b8' }}>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #1f2937' }}>
                <th style={{ padding: '8px 4px' }}>Name</th>
                <th style={{ padding: '8px 4px' }}>Price</th>
                <th style={{ padding: '8px 4px' }}>Tenant</th>
              </tr>
            </thead>
            <tbody>
              {items
                .filter((p) => {
                  const q = filter.toLowerCase();
                  return (
                    !q ||
                    p.name.toLowerCase().includes(q) ||
                    (p.tenant?.name && p.tenant.name.toLowerCase().includes(q))
                  );
                })
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #0f172a' }}>
                  <td style={{ padding: '6px 4px' }}>{p.name}</td>
                  <td style={{ padding: '6px 4px' }}>${Number(p.price).toFixed(2)}</td>
                  <td style={{ padding: '6px 4px', color: '#94a3b8' }}>{p.tenant?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
};

const SubscribersPage = () => {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [form, setForm] = useState({ tenantId: '', planId: '', username: '', email: '', fullName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      try {
        const [subs, tenantsRes, plansRes] = await Promise.all([api.subscribers(token), api.tenants(token), api.plans(token)]);
        setItems(subs);
        setTenants(tenantsRes);
        setPlans(plansRes);
      } catch (err: any) {
        setError(err.message || 'Failed to load subscribers');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError(null);
    try {
      const payload = {
        tenantId: form.tenantId,
        username: form.username,
        email: form.email || undefined,
        fullName: form.fullName || undefined,
        planId: form.planId || undefined,
      };
      const created = await api.createSubscriber(token, payload);
      setItems((prev) => [...prev, created]);
      setForm({ tenantId: '', planId: '', username: '', email: '', fullName: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to create subscriber');
    }
  };

  return (
    <PageShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Subscribers</div>
          <div style={{ color: '#94a3b8' }}>Create and list subscribers.</div>
        </div>
      </div>
      <form onSubmit={handleCreate} style={{ display: 'grid', gap: 10, maxWidth: 640, marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 8 }}>
          <FormRow label="Tenant">
            <select
              style={inputStyle}
              value={form.tenantId}
              onChange={(e) => setForm((f) => ({ ...f, tenantId: e.target.value }))}
              required
            >
              <option value="">Select tenant</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </FormRow>
          <FormRow label="Plan (optional)">
            <select
              style={inputStyle}
              value={form.planId}
              onChange={(e) => setForm((f) => ({ ...f, planId: e.target.value }))}
            >
              <option value="">No plan</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </FormRow>
        </div>
        <FormRow label="Username">
          <input style={inputStyle} value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} required />
        </FormRow>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 8 }}>
          <FormRow label="Full name">
            <input style={inputStyle} value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
          </FormRow>
          <FormRow label="Email">
            <input style={inputStyle} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </FormRow>
        </div>
        <button type="submit" style={buttonStyle} disabled={loading}>
          Create subscriber
        </button>
      </form>
      <FormRow label="Filter">
        <input
          style={inputStyle}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search by username/name/email"
        />
      </FormRow>
      {error && <MessageBar text={error} tone="error" />}
      {loading ? (
        <div style={{ color: '#94a3b8' }}>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #1f2937' }}>
                <th style={{ padding: '8px 4px' }}>Username</th>
                <th style={{ padding: '8px 4px' }}>Name</th>
                <th style={{ padding: '8px 4px' }}>Email</th>
                <th style={{ padding: '8px 4px' }}>Tenant</th>
                <th style={{ padding: '8px 4px' }}>Plan</th>
              </tr>
            </thead>
            <tbody>
              {items
                .filter((s) => {
                  const q = filter.toLowerCase();
                  return (
                    !q ||
                    s.username.toLowerCase().includes(q) ||
                    (s.fullName && s.fullName.toLowerCase().includes(q)) ||
                    (s.email && s.email.toLowerCase().includes(q))
                  );
                })
                .sort((a, b) => a.username.localeCompare(b.username))
                .map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #0f172a' }}>
                  <td style={{ padding: '6px 4px' }}>{s.username}</td>
                  <td style={{ padding: '6px 4px' }}>{s.fullName}</td>
                  <td style={{ padding: '6px 4px' }}>{s.email}</td>
                  <td style={{ padding: '6px 4px', color: '#94a3b8' }}>{s.tenant?.name}</td>
                  <td style={{ padding: '6px 4px', color: '#94a3b8' }}>{s.plan?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
};

const InvoicesPage = () => {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [form, setForm] = useState({
    tenantId: '',
    subscriberId: '',
    invoiceNumber: '',
    amount: '0',
    tax: '0',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      try {
        const [inv, ten, subs] = await Promise.all([api.invoices(token), api.tenants(token), api.subscribers(token)]);
        setInvoices(inv);
        setTenants(ten);
        setSubscribers(subs);
      } catch (err: any) {
        setError(err.message || 'Failed to load invoices');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError(null);
    try {
      const amountNum = Number(form.amount);
      const taxNum = Number(form.tax || 0);
      const payload = {
        tenantId: form.tenantId,
        subscriberId: form.subscriberId,
        invoiceNumber: form.invoiceNumber,
        amount: amountNum,
        tax: taxNum,
        total: amountNum + taxNum,
        status: 'pending',
        dueDate: form.dueDate || new Date().toISOString().slice(0, 10),
      };
      const created = await api.createInvoice(token, payload);
      setInvoices((prev) => [...prev, created]);
      setForm({ tenantId: '', subscriberId: '', invoiceNumber: '', amount: '0', tax: '0', dueDate: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice');
    }
  };

  return (
    <PageShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Invoices</div>
          <div style={{ color: '#94a3b8' }}>Create and list invoices.</div>
        </div>
      </div>
      <form onSubmit={handleCreate} style={{ display: 'grid', gap: 10, maxWidth: 680, marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 8 }}>
          <FormRow label="Tenant">
            <select
              style={inputStyle}
              value={form.tenantId}
              onChange={(e) => setForm((f) => ({ ...f, tenantId: e.target.value }))}
              required
            >
              <option value="">Select tenant</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </FormRow>
          <FormRow label="Subscriber">
            <select
              style={inputStyle}
              value={form.subscriberId}
              onChange={(e) => setForm((f) => ({ ...f, subscriberId: e.target.value }))}
              required
            >
              <option value="">Select subscriber</option>
              {subscribers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.username} ({s.tenant?.name})
                </option>
              ))}
            </select>
          </FormRow>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 8 }}>
          <FormRow label="Invoice number">
            <input
              style={inputStyle}
              value={form.invoiceNumber}
              onChange={(e) => setForm((f) => ({ ...f, invoiceNumber: e.target.value }))}
              required
            />
          </FormRow>
          <FormRow label="Due date">
            <input
              style={inputStyle}
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
            />
          </FormRow>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 8 }}>
          <FormRow label="Amount">
            <input
              style={inputStyle}
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              required
            />
          </FormRow>
          <FormRow label="Tax">
            <input
              style={inputStyle}
              type="number"
              step="0.01"
              value={form.tax}
              onChange={(e) => setForm((f) => ({ ...f, tax: e.target.value }))}
            />
          </FormRow>
        </div>
        <button type="submit" style={buttonStyle} disabled={loading}>
          Create invoice
        </button>
      </form>
      <FormRow label="Filter">
        <input
          style={inputStyle}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search by invoice/subscriber/status"
        />
      </FormRow>
      {error && <MessageBar text={error} tone="error" />}
      {loading ? (
        <div style={{ color: '#94a3b8' }}>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #1f2937' }}>
                <th style={{ padding: '8px 4px' }}>Invoice #</th>
                <th style={{ padding: '8px 4px' }}>Amount</th>
                <th style={{ padding: '8px 4px' }}>Status</th>
                <th style={{ padding: '8px 4px' }}>Subscriber</th>
                <th style={{ padding: '8px 4px' }}>Tenant</th>
                <th style={{ padding: '8px 4px' }}>Due</th>
              </tr>
            </thead>
            <tbody>
              {invoices
                .filter((inv) => {
                  const q = filter.toLowerCase();
                  return (
                    !q ||
                    inv.invoiceNumber?.toLowerCase().includes(q) ||
                    (inv.subscriber?.username && inv.subscriber.username.toLowerCase().includes(q)) ||
                    (inv.status && inv.status.toLowerCase().includes(q))
                  );
                })
                .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
                .map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid #0f172a' }}>
                  <td style={{ padding: '6px 4px' }}>{inv.invoiceNumber}</td>
                  <td style={{ padding: '6px 4px' }}>${Number(inv.total || inv.amount).toFixed(2)}</td>
                  <td style={{ padding: '6px 4px', color: '#94a3b8' }}>{inv.status}</td>
                  <td style={{ padding: '6px 4px' }}>{inv.subscriber?.username}</td>
                  <td style={{ padding: '6px 4px' }}>{inv.tenant?.name}</td>
                  <td style={{ padding: '6px 4px' }}>{inv.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
};

const PaymentsPage = () => {
  const { token } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [form, setForm] = useState({ tenantId: '', invoiceId: '', amount: '0', paymentMethod: 'card', reference: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      try {
        const [pay, ten, inv] = await Promise.all([api.payments(token), api.tenants(token), api.invoices(token)]);
        setPayments(pay);
        setTenants(ten);
        setInvoices(inv);
      } catch (err: any) {
        setError(err.message || 'Failed to load payments');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError(null);
    try {
      const payload = {
        tenantId: form.tenantId,
        invoiceId: form.invoiceId,
        amount: Number(form.amount),
        paymentMethod: form.paymentMethod,
        reference: form.reference || undefined,
      };
      const created = await api.createPayment(token, payload);
      setPayments((prev) => [...prev, created]);
      setForm({ tenantId: '', invoiceId: '', amount: '0', paymentMethod: 'card', reference: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to create payment');
    }
  };

  return (
    <PageShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Payments</div>
          <div style={{ color: '#94a3b8' }}>Record payments and see status updates.</div>
        </div>
      </div>
      <form onSubmit={handleCreate} style={{ display: 'grid', gap: 10, maxWidth: 640, marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 8 }}>
          <FormRow label="Tenant">
            <select
              style={inputStyle}
              value={form.tenantId}
              onChange={(e) => setForm((f) => ({ ...f, tenantId: e.target.value }))}
              required
            >
              <option value="">Select tenant</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </FormRow>
          <FormRow label="Invoice">
            <select
              style={inputStyle}
              value={form.invoiceId}
              onChange={(e) => setForm((f) => ({ ...f, invoiceId: e.target.value }))}
              required
            >
              <option value="">Select invoice</option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} (${Number(inv.total || inv.amount).toFixed(2)})
                </option>
              ))}
            </select>
          </FormRow>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 8 }}>
          <FormRow label="Amount">
            <input
              style={inputStyle}
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              required
            />
          </FormRow>
          <FormRow label="Method">
            <input
              style={inputStyle}
              value={form.paymentMethod}
              onChange={(e) => setForm((f) => ({ ...f, paymentMethod: e.target.value }))}
              required
            />
          </FormRow>
        </div>
        <FormRow label="Reference (optional)">
          <input
            style={inputStyle}
            value={form.reference}
            onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
          />
        </FormRow>
        <button type="submit" style={buttonStyle} disabled={loading}>
          Record payment
        </button>
      </form>
      <FormRow label="Filter">
        <input
          style={inputStyle}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search by invoice/ref/method"
        />
      </FormRow>
      {error && <MessageBar text={error} tone="error" />}
      {loading ? (
        <div style={{ color: '#94a3b8' }}>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #1f2937' }}>
                <th style={{ padding: '8px 4px' }}>Invoice</th>
                <th style={{ padding: '8px 4px' }}>Amount</th>
                <th style={{ padding: '8px 4px' }}>Method</th>
                <th style={{ padding: '8px 4px' }}>Reference</th>
                <th style={{ padding: '8px 4px' }}>Status</th>
                <th style={{ padding: '8px 4px' }}>Tenant</th>
              </tr>
            </thead>
            <tbody>
              {payments
                .filter((p) => {
                  const q = filter.toLowerCase();
                  return (
                    !q ||
                    (p.invoice?.invoiceNumber && p.invoice.invoiceNumber.toLowerCase().includes(q)) ||
                    (p.reference && p.reference.toLowerCase().includes(q)) ||
                    (p.paymentMethod && p.paymentMethod.toLowerCase().includes(q))
                  );
                })
                .sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''))
                .map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #0f172a' }}>
                  <td style={{ padding: '6px 4px' }}>{p.invoice?.invoiceNumber || p.invoice?.id}</td>
                  <td style={{ padding: '6px 4px' }}>${Number(p.amount).toFixed(2)}</td>
                  <td style={{ padding: '6px 4px' }}>{p.paymentMethod}</td>
                  <td style={{ padding: '6px 4px' }}>{p.reference}</td>
                  <td style={{ padding: '6px 4px', color: '#94a3b8' }}>{p.status}</td>
                  <td style={{ padding: '6px 4px' }}>{p.tenant?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
};

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #1f2937',
  background: '#0b1222',
  color: '#e2e8f0',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #334155',
  background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
  color: '#e2e8f0',
  fontWeight: 600,
  cursor: 'pointer',
};

const secondaryButtonStyle: React.CSSProperties = {
  border: '1px solid #334155',
  background: '#0f172a',
  color: '#e2e8f0',
  padding: '8px 12px',
  borderRadius: 8,
  textDecoration: 'none',
};

const linkButtonStyle: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: '#60a5fa',
  cursor: 'pointer',
  padding: 0,
  textDecoration: 'underline',
};

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/portal/:tenantSlug" element={<div />} />
      <Route path="/portal/:tenantSlug/store" element={<div />} />
      <Route path="/portal/:tenantSlug/terms" element={<div />} />

      <Route element={<Protected />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tenants" element={<TenantsPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/subscribers" element={<SubscribersPage />} />
        <Route path="/billing/invoices" element={<InvoicesPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        {placeholderRoutes.map(([path, name]) => (
          <Route key={path} path={path} element={<ListPage title={name} />} />
        ))}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
