KenNet Rebuild – Stack & Scaffold
=================================

Stack
-----
- Backend: NestJS (TypeScript), PostgreSQL (dev via Docker), JWT auth, modular domains (auth, tenants, subscribers, plans, billing/payments/settlements, network devices/APs, vouchers, shop, portal).
- Frontend: React + Vite + TypeScript, React Router, TanStack Query for data fetching, Tailwind + Radix-based components.
- Infra (Ubuntu-friendly): Docker Compose for Postgres + app containers; Nginx or Caddy as reverse proxy; systemd units optional for bare-metal.

Backend modules (planned)
-------------------------
- `auth`: login/refresh, roles (super_admin, admin, operator), guard for tenant scoping.
- `tenants`: tenant CRUD, settings, portal branding, onboarding wizard state.
- `subscribers`: subscriber CRUD, sessions, credentials, connection type, usage.
- `plans`: plans, vouchers (issue/redeem), linkage to subscribers.
- `billing`: invoices, payments, mobile-money transactions, payment links, wallets, settlements, payouts, revenue reports.
- `network`: NAS devices (MikroTik), access points/Wi-Fi controller placeholder, diagnostics (ping/traceroute/port check), RADIUS/captive portal integration points.
- `shop`: products, categories, orders, discounts, inventory.
- `portal`: public flows for login/register/redeem voucher and store.
- `security/audit`: audit logs and per-tenant enforcement hooks.

Frontend routes (planned)
-------------------------
- Public: `/auth`, `/portal/:tenantSlug`, `/portal/:tenantSlug/store`, `/portal/:tenantSlug/terms`.
- Protected shell: `/` (dashboard), `/monitoring`, `/subscribers`, `/plans`, `/vouchers`, `/network/pppoe`, `/network/hotspot`, `/network/devices`, `/network/troubleshooting`, `/wifi`, `/access-points`, `/radius`, `/configuration`, `/billing`, `/payments/mobile-money`, `/payments/links`, `/settlements`, `/payouts`, `/wallets`, `/revenue`, `/my-finances`, `/billing-settings`, `/shop/*`, `/tenants`, `/security`, `/settings`, `/portal-settings`, `/onboarding`.

Next
----
- Fill backend DTOs/services and connect Postgres.
- Flesh out frontend views and API client to hit backend.
- Add payment and diagnostics adapters, webhook endpoints, and RADIUS integration points.
