# KenNet ISP Management Platform Documentation

State as of Jan 6, 2026. This file lives in `frontend/public/downloads/` so it can be downloaded directly once the frontend is built/served.

## 1) Purpose and Scope
- Back-office platform for an ISP: subscribers, plans, billing, payments, tickets, network assets, and portal flows.
- Current repo includes two tracks:
  - Python CLI (`isp_manager.py`): SQLite-based, standalone tool for quick CRUD/exports.
  - KenNet web stack: NestJS backend + React/Vite frontend + Postgres via docker-compose (scaffold/partials).

## 2) Architecture Overview
- Backend: NestJS, TypeScript, TypeORM, Postgres. Modular domains (auth/tenants/subscribers/plans/billing/payments/network/shop/portal).
- Frontend: React + Vite + TypeScript. Pages mapped to backend domains; UI/auth wiring still stubbed.
- Infra: `docker-compose.yml` with services `db` (Postgres 16), `backend`, `frontend`. Secrets currently in env; harden for prod.

## 3) Authentication & Authorization (planned)
- Token-based auth; passwords hashed with bcrypt.
- Roles: admin, super_admin, tenant-scoped roles (planned).
- Tenant guards: to enforce per-tenant data isolation (not fully implemented).
- Frontend auth flow is stubbed; needs real login against backend `/api/auth/login`.

## 4) Data Model (planned high level)
- Tenants, Users, Subscribers, Plans, Subscriptions, Invoices, Payments, Vouchers, Wallets/Settlements/Payouts, Network assets (NAS, Access Points), Sessions, Portal registrations/redeems.
- Migrations not generated; TypeORM sync is off in compose. Schema creation requires either sync for first run or migrations.

## 5) Backend APIs (early stubs)
- Auth: `/api/auth/register`, `/api/auth/login` (returns `{ token, user }`).
- Tenants/Subscribers/Plans/Invoices/Payments: CRUD controllers scaffolded under `src/modules/*` (need DTOs/validation/guards/real services).
- Vouchers: `/api/vouchers` (list), `/api/vouchers/issue`, `/api/vouchers/redeem`.
- Network: `/api/network/nas`, `/api/network/access-points`, `/api/network/diagnostics` (mock).
- Finance: `/api/finance/wallets`, `/api/finance/settlements`, `/api/finance/payouts`.
- Sessions: `/api/sessions`, `/api/sessions/start`, `/api/sessions/:id/end`.
- Portal: `/api/portal/:tenantId/register`, `/api/portal/:tenantId/redeem`.
- **Note:** These endpoints are scaffolds; persistence/services/guards need completion.

## 6) Backend Setup (local dev)
1. Copy `backend/.env.example` to `backend/.env`; set:
   - `DATABASE_URL=postgres://kennet:kennet@localhost:5432/kennet` (or the compose `db` host)
   - `JWT_SECRET=<change-me>`
   - `TYPEORM_SYNC=true` only for first schema creation; then set `false` and use migrations.
   - `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` for seeding.
2. Start Postgres: `docker compose up -d db`.
3. Install deps: `cd backend && npm install`.
4. Build: `npm run build`.
5. Run (sync path): `TYPEORM_SYNC=true npm run start:dev` for first boot, then switch to migrations.
6. Migrations (preferred after first build): generate -> run, with `TYPEORM_SYNC=false`.
7. Seed admin: `node dist/seeds/seed.js` after build (requires SEED_* envs).

## 7) Frontend Setup (local dev)
1. `cd frontend && npm install`.
2. Create `.env.local` with `VITE_API_BASE_URL=http://localhost:3000` (or your backend URL).
3. Run dev server: `npm run dev -- --host` (defaults to port 5173; compose maps 4173 in the sample).
4. Pages/components are placeholders; wire to backend endpoints and auth token handling.

## 8) Docker Compose
- Services:
  - `db`: Postgres 16, user/db/password `kennet`.
  - `backend`: builds from `./backend`, runs `node dist/main.js`, expects `DATABASE_URL`, `JWT_SECRET`, `TYPEORM_SYNC` (defaults to false).
  - `frontend`: builds from `./frontend`, exposes 4173 (currently dev-style; add a production build/serve step).
- Gaps:
  - No production static serve for frontend dist.
  - Backend assumes `dist/` exists (build must run in CI/image).
  - Secrets are defaults; move to env/secret management for any real deployment.

## 9) Payments & Integrations (planned)
- Gateway adapters not implemented; webhook handling not implemented.
- Finance flows (wallets/settlements/payouts) are stubs; need business rules and persistence.

## 10) Design System / UX
- React scaffolding only; no finalized design system.
- Auth UI is stubbed; needs forms, validation, token storage, role-aware routing.

## 11) Deployment Considerations
- Build backend and run migrations in CI/CD before `node dist/main.js`.
- Build frontend (`npm run build`) and serve the `dist` output (e.g., nginx or Vite preview for staging).
- Configure environment per environment (DATABASE_URL, JWT_SECRET, CORS, API base URL).
- Add health checks for backend and DB in compose/k8s.

## 12) Security Notes
- Do not use `JWT_SECRET=change-me-in-prod` in production.
- Disable `TYPEORM_SYNC` outside dev; use migrations.
- Enforce auth/role/tenant guards on all controllers.
- Add rate limiting, input validation (DTOs/pipes), and CORS configuration.

## 13) Known Gaps (must-do)
- No backend `.env` committed; no migrations; dist build not automated in compose; guards/DTOs/services incomplete.
- Frontend not wired to backend; no production build/serve path in compose.
- Documentation download: ensure this file ships in the built frontend (now present in `frontend/public/downloads`).
- CI/CD pipeline missing (lint/test/build/migrate/publish).
- `LAB-TESTING-ME/` and `.tools/` are undocumented; clarify or remove.
- Python CLI is standalone (SQLite) and not integrated with Nest/Postgres.

## 14) Quick Commands (reference)
- Backend dev: `cd backend && npm install && npm run build && npm run start:dev`
- Frontend dev: `cd frontend && npm install && npm run dev -- --host`
- Compose DB only: `docker compose up -d db`
- Compose full (after builds wired): `docker compose up --build`

## 15) Python CLI (independent utility)
- Script: `isp_manager.py` (clients, plans, subscriptions, invoices, payments, tickets).
- DB: SQLite file `isp_manager.db` (override with `ISP_DB` env).
- Demo data: `python isp_manager.py demo-seed`.
- Not integrated with Nest/Postgres; no auth/UI.

## 16) How to make the download work in the app
- Ensure frontend build includes `frontend/public/downloads/KenNet-Platform-Documentation.md`.
- Deploy/publish the frontend so the static asset is served (e.g., `/downloads/KenNet-Platform-Documentation.md`).
- Optionally add a UI button/link pointing to `/downloads/KenNet-Platform-Documentation.md`.

---
Maintainer note: update this file when APIs/entities/auth or deployment steps change.
