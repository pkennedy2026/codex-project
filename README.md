ISP Management CLI
==================

Minimal ISP back-office helper built with Python stdlib + SQLite. Tracks clients, plans, subscriptions, invoices/payments, and support tickets.

Requirements
------------
- Python 3.10+ (no external dependencies)
- Optional: set `ISP_DB` to point to a different SQLite path for testing/experiments.

Usage
-----
Run commands from the repo root; the SQLite database is created as `isp_manager.db`.

Examples:

```bash
# Clients and plans
python isp_manager.py add-client --name "Acme Corp" --email ops@acme.test --phone 555-0001
python isp_manager.py add-plan --name "Fiber 200" --speed 200 --price 79.99 --description "FTTH"

# Subscribe a client
python isp_manager.py subscribe --client-id 1 --plan-id 1 --notes "Main office"
python isp_manager.py list-subscriptions

# Invoicing and payments
python isp_manager.py create-invoice --subscription-id 1 --due-date 2026-02-01
python isp_manager.py list-invoices --status open
python isp_manager.py pay-invoice --invoice-id 1 --amount 79.99 --method card --reference AUTH123

# Support tickets
python isp_manager.py open-ticket --client-id 1 --subject "Link flap" --priority high
python isp_manager.py list-tickets --status open
python isp_manager.py close-ticket --ticket-id 1

# Quick health counts
python isp_manager.py dashboard

# Export CSVs
python isp_manager.py export clients --output clients.csv

# Seed demo data (idempotent)
python isp_manager.py demo-seed
```

Commands
--------
- `add-client` / `list-clients`
- `add-plan` / `list-plans`
- `subscribe` / `list-subscriptions`
- `create-invoice` / `list-invoices`
- `pay-invoice` / `list-payments`
- `open-ticket` / `close-ticket` / `list-tickets`
- `dashboard`
- `export <table> [--output file.csv]` (tables: clients, plans, subscriptions, invoices, payments, tickets)
- `demo-seed`

Notes
-----
- Dates use ISO format (`YYYY-MM-DD`). Defaults are applied where possible (e.g., invoices default to today + 14 days; subscriptions default to today).
- Payments move an invoice to `partial` or `paid` based on the total paid amount.
- Foreign key deletes cascade, so removing a client removes their subscriptions, invoices, payments, and tickets.
- Use `ISP_DB=/tmp/test.db python isp_manager.py ...` to point commands at a temporary database for tests.
- Tests: run `ISP_DB=/tmp/test.db python -m unittest` (uses an isolated temp DB per test case).

---

KenNet Rebuild (NestJS + React)
===============================

This repo now also includes scaffolding for a production-ready KenNet ISP platform:

- Backend (`backend/`): NestJS modular skeleton with domains for auth, tenants, subscribers, plans, billing, payments, network, shop, and portal.
- Frontend (`frontend/`): React + Vite + TypeScript with route placeholders matching the documented pages.
- Infra: `docker-compose.yml` with Postgres and backend service placeholder (extend to build/run the Nest app).
- Architecture: see `ARCHITECTURE.md` for planned modules, routes, and next steps.

Quick start (once Node/NPM are available)
-----------------------------------------
- Backend: `cd backend && npm install && npm run start` (or `npm run dev`).
- Frontend: `cd frontend && npm install && npm run dev`.
- Database: `docker-compose up db` (Postgres exposed on 5432 with user/db/password `kennet`).
- First run with Postgres:
  1. Copy `backend/.env.example` to `backend/.env`; set `JWT_SECRET`, and decide on `TYPEORM_SYNC` (`true` only for first boot). For local Docker DB use `DATABASE_URL=postgres://kennet:kennet@localhost:5432/kennet`.
  2. Start the DB: `docker compose up -d db`.
  3. Start backend (sync path): `cd backend && npm run start:dev` with `TYPEORM_SYNC=true` only for the first schema creation. Preferred path afterward: `npm run build && npm run migration:run` with `TYPEORM_SYNC=false`.
  4. Seed an admin after build: `cd backend && node dist/seeds/seed.js` (needs `SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD` in `.env`).
  5. Frontend: `cd frontend && npm run dev -- --host`; set `VITE_API_BASE_URL` in `.env.local` (see `frontend/.env.local.example`).

Frontend env (example)
----------------------
Copy `frontend/.env.local.example` to `frontend/.env.local` and set `VITE_API_BASE_URL` to your backend URL (e.g., `http://localhost:3000` or the compose backend service).

Downloads
---------
The full platform documentation is in `frontend/public/downloads/KenNet-Platform-Documentation.md` and will be available at `/downloads/KenNet-Platform-Documentation.md` after a frontend build/deploy.

Next implementation steps
-------------------------
- Flesh out backend DTOs/entities, connect to Postgres, and add auth/tenant guards.
- Implement billing/payment flows with gateway adapters and webhooks.
- Build frontend layouts/components and hook pages to backend endpoints.

Auth & backend API (early)
--------------------------
- Dev auth is token-per-user: POST `/api/auth/register` then `/api/auth/login` returns `{ token, user }`; send `Authorization: Bearer <token>` to hit protected routes.
- Protected CRUD now backed by Postgres for tenants, subscribers, plans, invoices, and payments (see controllers in `backend/src/modules/*`).
- Dev DB connection uses `DATABASE_URL` (see `backend/.env.example`); TypeORM `synchronize` is on for dev only.

New APIs (dev)
--------------
- Vouchers: `/api/vouchers` (list), `/api/vouchers/issue` (admin/super_admin), `/api/vouchers/redeem`.
- Network: `/api/network/nas` (list/create), `/api/network/access-points` (list/create), `/api/network/diagnostics` (mock ping/traceroute/port).
- Finance: `/api/finance/wallets`, `/api/finance/settlements`, `/api/finance/payouts` (list/create; create is restricted by roles).
- Sessions: `/api/sessions` (list), `/api/sessions/start`, `/api/sessions/:id/end`.
- Portal stubs: `/api/portal/:tenantId/register` (subscriber create), `/api/portal/:tenantId/redeem` (voucher redeem).

Auth and setup updates
----------------------
- Passwords now hashed with bcrypt.
- Config via `.env` supported (DATABASE_URL, SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD for seeding).
- TypeORM `synchronize` disabled; migrations scaffolded (generate/run commands in `backend/package.json`). Use `npm run build` before running migrations.
