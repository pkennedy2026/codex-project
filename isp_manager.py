import argparse
import csv
import os
import sqlite3
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Iterable, List, Sequence

DEFAULT_DB_PATH = Path(__file__).with_name("isp_manager.db")


def get_db_path() -> Path:
    env_path = os.environ.get("ISP_DB")
    return Path(env_path) if env_path else DEFAULT_DB_PATH


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with connect() as conn:
        conn.executescript(
            """
            PRAGMA foreign_keys = ON;
            CREATE TABLE IF NOT EXISTS clients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT,
                phone TEXT,
                address TEXT,
                notes TEXT,
                created_at TEXT DEFAULT (datetime('now'))
            );
            CREATE TABLE IF NOT EXISTS plans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                speed_mbps INTEGER,
                price_monthly REAL NOT NULL,
                description TEXT
            );
            CREATE TABLE IF NOT EXISTS subscriptions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
                plan_id INTEGER NOT NULL REFERENCES plans(id),
                status TEXT NOT NULL DEFAULT 'active',
                start_date TEXT NOT NULL,
                end_date TEXT,
                next_invoice_date TEXT,
                notes TEXT
            );
            CREATE TABLE IF NOT EXISTS invoices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                subscription_id INTEGER NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
                amount REAL NOT NULL,
                due_date TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'open',
                issued_at TEXT NOT NULL DEFAULT (datetime('now')),
                description TEXT
            );
            CREATE TABLE IF NOT EXISTS payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
                amount REAL NOT NULL,
                paid_at TEXT NOT NULL DEFAULT (datetime('now')),
                method TEXT,
                reference TEXT
            );
            CREATE TABLE IF NOT EXISTS tickets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
                subject TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'open',
                priority TEXT NOT NULL DEFAULT 'normal',
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT,
                notes TEXT
            );
            """
        )


def print_rows(rows: Sequence[sqlite3.Row], columns: List[str]) -> None:
    if not rows:
        print("No records.")
        return
    widths = [len(col) for col in columns]
    for row in rows:
        for i, col in enumerate(columns):
            widths[i] = max(widths[i], len(str(row[col]) if row[col] is not None else ""))
    header = " | ".join(col.ljust(widths[i]) for i, col in enumerate(columns))
    print(header)
    print("-+-".join("-" * w for w in widths))
    for row in rows:
        line = " | ".join(
            str(row[col] if row[col] is not None else "").ljust(widths[i])
            for i, col in enumerate(columns)
        )
        print(line)


def add_client(args: argparse.Namespace) -> None:
    with connect() as conn:
        cur = conn.execute(
            """
            INSERT INTO clients (name, email, phone, address, notes)
            VALUES (?, ?, ?, ?, ?)
            """,
            (args.name, args.email, args.phone, args.address, args.notes),
        )
        conn.commit()
        print(f"Client created with id={cur.lastrowid}")


def list_clients(_: argparse.Namespace) -> None:
    with connect() as conn:
        rows = conn.execute(
            "SELECT id, name, email, phone, address, created_at FROM clients ORDER BY id"
        ).fetchall()
        print_rows(rows, ["id", "name", "email", "phone", "address", "created_at"])


def add_plan(args: argparse.Namespace) -> None:
    with connect() as conn:
        cur = conn.execute(
            """
            INSERT INTO plans (name, speed_mbps, price_monthly, description)
            VALUES (?, ?, ?, ?)
            """,
            (args.name, args.speed, args.price, args.description),
        )
        conn.commit()
        print(f"Plan created with id={cur.lastrowid}")


def list_plans(_: argparse.Namespace) -> None:
    with connect() as conn:
        rows = conn.execute(
            "SELECT id, name, speed_mbps, price_monthly, description FROM plans ORDER BY id"
        ).fetchall()
        print_rows(rows, ["id", "name", "speed_mbps", "price_monthly", "description"])


def subscribe(args: argparse.Namespace) -> None:
    start_date = args.start_date or date.today().isoformat()
    with connect() as conn:
        client = conn.execute("SELECT id FROM clients WHERE id = ?", (args.client_id,)).fetchone()
        if not client:
            raise SystemExit(f"Client {args.client_id} not found")
        plan = conn.execute("SELECT id FROM plans WHERE id = ?", (args.plan_id,)).fetchone()
        if not plan:
            raise SystemExit(f"Plan {args.plan_id} not found")
        cur = conn.execute(
            """
            INSERT INTO subscriptions (client_id, plan_id, status, start_date, end_date, notes)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (args.client_id, args.plan_id, args.status, start_date, args.end_date, args.notes),
        )
        conn.commit()
        print(f"Subscription created with id={cur.lastrowid}")


def list_subscriptions(_: argparse.Namespace) -> None:
    with connect() as conn:
        rows = conn.execute(
            """
            SELECT s.id, s.status, s.start_date, s.end_date, c.name AS client, p.name AS plan
            FROM subscriptions s
            JOIN clients c ON c.id = s.client_id
            JOIN plans p ON p.id = s.plan_id
            ORDER BY s.id
            """
        ).fetchall()
        print_rows(rows, ["id", "status", "start_date", "end_date", "client", "plan"])


def create_invoice(args: argparse.Namespace) -> None:
    with connect() as conn:
        sub = conn.execute(
            """
            SELECT s.id, p.price_monthly
            FROM subscriptions s
            JOIN plans p ON p.id = s.plan_id
            WHERE s.id = ?
            """,
            (args.subscription_id,),
        ).fetchone()
        if not sub:
            raise SystemExit(f"Subscription {args.subscription_id} not found")
        amount = args.amount if args.amount is not None else sub["price_monthly"]
        due_date = args.due_date or (date.today() + timedelta(days=14)).isoformat()
        cur = conn.execute(
            """
            INSERT INTO invoices (subscription_id, amount, due_date, status, description)
            VALUES (?, ?, ?, 'open', ?)
            """,
            (args.subscription_id, amount, due_date, args.description),
        )
        conn.commit()
        print(f"Invoice created with id={cur.lastrowid}, amount={amount}, due={due_date}")


def list_invoices(args: argparse.Namespace) -> None:
    filters: List[str] = []
    params: List[object] = []
    if args.status:
        filters.append("i.status = ?")
        params.append(args.status)
    if args.client_id:
        filters.append("c.id = ?")
        params.append(args.client_id)
    where = f"WHERE {' AND '.join(filters)}" if filters else ""
    query = f"""
        SELECT i.id,
               i.amount,
               i.due_date,
               i.status,
               i.issued_at,
               c.name AS client,
               p.name AS plan
        FROM invoices i
        JOIN subscriptions s ON s.id = i.subscription_id
        JOIN clients c ON c.id = s.client_id
        JOIN plans p ON p.id = s.plan_id
        {where}
        ORDER BY i.id
    """
    with connect() as conn:
        rows = conn.execute(query, params).fetchall()
        print_rows(rows, ["id", "amount", "due_date", "status", "issued_at", "client", "plan"])


def record_payment(args: argparse.Namespace) -> None:
    with connect() as conn:
        invoice = conn.execute("SELECT id, amount, status FROM invoices WHERE id = ?", (args.invoice_id,)).fetchone()
        if not invoice:
            raise SystemExit(f"Invoice {args.invoice_id} not found")
        conn.execute(
            """
            INSERT INTO payments (invoice_id, amount, method, reference)
            VALUES (?, ?, ?, ?)
            """,
            (args.invoice_id, args.amount, args.method, args.reference),
        )
        total_paid = conn.execute(
            "SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE invoice_id = ?",
            (args.invoice_id,),
        ).fetchone()["total"]
        new_status = "paid" if total_paid >= invoice["amount"] else "partial"
        conn.execute("UPDATE invoices SET status = ? WHERE id = ?", (new_status, args.invoice_id))
        conn.commit()
        print(f"Payment recorded. Invoice {args.invoice_id} status -> {new_status}")


def list_payments(args: argparse.Namespace) -> None:
    with connect() as conn:
        rows = conn.execute(
            """
            SELECT pay.id,
                   pay.amount,
                   pay.paid_at,
                   pay.method,
                   pay.reference,
                   inv.id AS invoice_id
            FROM payments pay
            JOIN invoices inv ON inv.id = pay.invoice_id
            ORDER BY pay.id
            """
        ).fetchall()
        print_rows(rows, ["id", "invoice_id", "amount", "paid_at", "method", "reference"])


def open_ticket(args: argparse.Namespace) -> None:
    with connect() as conn:
        client = conn.execute("SELECT id FROM clients WHERE id = ?", (args.client_id,)).fetchone()
        if not client:
            raise SystemExit(f"Client {args.client_id} not found")
        cur = conn.execute(
            """
            INSERT INTO tickets (client_id, subject, status, priority, notes)
            VALUES (?, ?, 'open', ?, ?)
            """,
            (args.client_id, args.subject, args.priority, args.notes),
        )
        conn.commit()
        print(f"Ticket created with id={cur.lastrowid}")


def close_ticket(args: argparse.Namespace) -> None:
    now = datetime.utcnow().isoformat(timespec="seconds")
    with connect() as conn:
        res = conn.execute(
            "UPDATE tickets SET status = 'closed', updated_at = ? WHERE id = ? AND status != 'closed'",
            (now, args.ticket_id),
        )
        conn.commit()
        if res.rowcount == 0:
            raise SystemExit(f"Ticket {args.ticket_id} not found or already closed")
        print(f"Ticket {args.ticket_id} closed")


def list_tickets(args: argparse.Namespace) -> None:
    filters: List[str] = []
    params: List[object] = []
    if args.status:
        filters.append("t.status = ?")
        params.append(args.status)
    where = f"WHERE {' AND '.join(filters)}" if filters else ""
    query = f"""
        SELECT t.id,
               t.subject,
               t.status,
               t.priority,
               t.created_at,
               t.updated_at,
               c.name AS client
        FROM tickets t
        JOIN clients c ON c.id = t.client_id
        {where}
        ORDER BY t.id
    """
    with connect() as conn:
        rows = conn.execute(query, params).fetchall()
        print_rows(rows, ["id", "subject", "status", "priority", "created_at", "updated_at", "client"])


def dashboard(_: argparse.Namespace) -> None:
    with connect() as conn:
        counts = {
            "clients": conn.execute("SELECT COUNT(*) AS c FROM clients").fetchone()["c"],
            "subscriptions": conn.execute("SELECT COUNT(*) AS c FROM subscriptions WHERE status = 'active'").fetchone()["c"],
            "invoices_open": conn.execute("SELECT COUNT(*) AS c FROM invoices WHERE status = 'open'").fetchone()["c"],
            "invoices_paid": conn.execute("SELECT COUNT(*) AS c FROM invoices WHERE status = 'paid'").fetchone()["c"],
            "tickets_open": conn.execute("SELECT COUNT(*) AS c FROM tickets WHERE status = 'open'").fetchone()["c"],
        }
    print(
        "Clients: {clients}\nActive subscriptions: {subscriptions}\nOpen invoices: {invoices_open}\nPaid invoices: {invoices_paid}\nOpen tickets: {tickets_open}".format(
            **counts
        )
    )


def add_common_arguments(parser: argparse.ArgumentParser, required: Iterable[str]) -> None:
    for field in required:
        parser.add_argument(field, type=int if "id" in field else str)


def export_table(args: argparse.Namespace) -> None:
    table = args.table
    output = Path(args.output) if args.output else None
    columns_by_table = {
        "clients": ["id", "name", "email", "phone", "address", "notes", "created_at"],
        "plans": ["id", "name", "speed_mbps", "price_monthly", "description"],
        "subscriptions": ["id", "client_id", "plan_id", "status", "start_date", "end_date", "notes"],
        "invoices": ["id", "subscription_id", "amount", "due_date", "status", "issued_at", "description"],
        "payments": ["id", "invoice_id", "amount", "paid_at", "method", "reference"],
        "tickets": ["id", "client_id", "subject", "status", "priority", "created_at", "updated_at", "notes"],
    }
    columns = columns_by_table[table]
    query = f"SELECT {', '.join(columns)} FROM {table} ORDER BY id"
    with connect() as conn:
        rows = conn.execute(query).fetchall()
    out_file = output.open("w", newline="", encoding="utf-8") if output else None
    writer = csv.writer(out_file or os.sys.stdout)
    writer.writerow(columns)
    for row in rows:
        writer.writerow([row[c] for c in columns])
    if out_file:
        out_file.close()
        print(f"Exported {len(rows)} rows to {output}")


def demo_seed(_: argparse.Namespace) -> None:
    """Seed the database with a small set of demo data."""
    init_db()
    with connect() as conn:
        # Avoid duplicate inserts if run multiple times
        existing = conn.execute("SELECT COUNT(*) AS c FROM clients").fetchone()["c"]
        if existing:
            print("Demo data already present; skipping.")
            return
        conn.execute(
            "INSERT INTO clients (name, email, phone, address, notes) VALUES (?, ?, ?, ?, ?)",
            ("Acme Corp", "ops@acme.test", "555-0100", "123 Fiber Lane", "Priority client"),
        )
        conn.execute(
            "INSERT INTO clients (name, email, phone, address, notes) VALUES (?, ?, ?, ?, ?)",
            ("Smith Residence", "smith@example.com", "555-0200", "456 Wireless Way", None),
        )
        conn.execute(
            "INSERT INTO plans (name, speed_mbps, price_monthly, description) VALUES (?, ?, ?, ?)",
            ("Fiber 200", 200, 79.99, "FTTH 200/200"),
        )
        conn.execute(
            "INSERT INTO plans (name, speed_mbps, price_monthly, description) VALUES (?, ?, ?, ?)",
            ("Fixed Wireless 50", 50, 49.99, "Rural fixed wireless"),
        )
        conn.execute(
            """
            INSERT INTO subscriptions (client_id, plan_id, status, start_date, notes)
            VALUES (1, 1, 'active', ?, 'HQ circuit')
            """,
            (date.today().isoformat(),),
        )
        conn.execute(
            """
            INSERT INTO subscriptions (client_id, plan_id, status, start_date, notes)
            VALUES (2, 2, 'active', ?, 'Home service')
            """,
            (date.today().isoformat(),),
        )
        conn.execute(
            """
            INSERT INTO invoices (subscription_id, amount, due_date, status, description)
            VALUES (1, 79.99, ?, 'open', 'Monthly service')
            """,
            ((date.today() + timedelta(days=14)).isoformat(),),
        )
        conn.execute(
            """
            INSERT INTO tickets (client_id, subject, status, priority, notes)
            VALUES (1, 'Packet loss on uplink', 'open', 'high', 'Investigating tower sector')
            """
        )
        conn.commit()
    print("Demo data seeded.")


def main() -> None:
    init_db()
    parser = argparse.ArgumentParser(description="ISP management CLI (clients, plans, billing, tickets).")
    subparsers = parser.add_subparsers(dest="command", required=True)

    p = subparsers.add_parser("add-client", help="Add a client")
    p.add_argument("--name", required=True)
    p.add_argument("--email")
    p.add_argument("--phone")
    p.add_argument("--address")
    p.add_argument("--notes")
    p.set_defaults(func=add_client)

    p = subparsers.add_parser("list-clients", help="List clients")
    p.set_defaults(func=list_clients)

    p = subparsers.add_parser("add-plan", help="Add a service plan")
    p.add_argument("--name", required=True)
    p.add_argument("--speed", type=int, help="Speed in Mbps")
    p.add_argument("--price", type=float, required=True, dest="price")
    p.add_argument("--description")
    p.set_defaults(func=add_plan)

    p = subparsers.add_parser("list-plans", help="List plans")
    p.set_defaults(func=list_plans)

    p = subparsers.add_parser("subscribe", help="Subscribe a client to a plan")
    p.add_argument("--client-id", type=int, required=True)
    p.add_argument("--plan-id", type=int, required=True)
    p.add_argument("--status", default="active")
    p.add_argument("--start-date", help="ISO date, defaults to today")
    p.add_argument("--end-date")
    p.add_argument("--notes")
    p.set_defaults(func=subscribe)

    p = subparsers.add_parser("list-subscriptions", help="List subscriptions")
    p.set_defaults(func=list_subscriptions)

    p = subparsers.add_parser("create-invoice", help="Create an invoice")
    p.add_argument("--subscription-id", type=int, required=True)
    p.add_argument("--amount", type=float, help="Defaults to plan price")
    p.add_argument("--due-date", help="ISO date, defaults to today+14")
    p.add_argument("--description")
    p.set_defaults(func=create_invoice)

    p = subparsers.add_parser("list-invoices", help="List invoices")
    p.add_argument("--status", choices=["open", "partial", "paid"])
    p.add_argument("--client-id", type=int)
    p.set_defaults(func=list_invoices)

    p = subparsers.add_parser("pay-invoice", help="Record a payment")
    p.add_argument("--invoice-id", type=int, required=True)
    p.add_argument("--amount", type=float, required=True)
    p.add_argument("--method", help="cash/card/bank/etc")
    p.add_argument("--reference", help="transaction reference")
    p.set_defaults(func=record_payment)

    p = subparsers.add_parser("list-payments", help="List payments")
    p.set_defaults(func=list_payments)

    p = subparsers.add_parser("open-ticket", help="Open a support ticket")
    p.add_argument("--client-id", type=int, required=True)
    p.add_argument("--subject", required=True)
    p.add_argument("--priority", choices=["low", "normal", "high"], default="normal")
    p.add_argument("--notes")
    p.set_defaults(func=open_ticket)

    p = subparsers.add_parser("close-ticket", help="Close a support ticket")
    p.add_argument("--ticket-id", type=int, required=True)
    p.set_defaults(func=close_ticket)

    p = subparsers.add_parser("list-tickets", help="List tickets")
    p.add_argument("--status", choices=["open", "closed"])
    p.set_defaults(func=list_tickets)

    p = subparsers.add_parser("dashboard", help="Show key counts")
    p.set_defaults(func=dashboard)

    p = subparsers.add_parser("export", help="Export a table to CSV")
    p.add_argument("table", choices=["clients", "plans", "subscriptions", "invoices", "payments", "tickets"])
    p.add_argument("--output", help="Path to write CSV; defaults to stdout")
    p.set_defaults(func=export_table)

    p = subparsers.add_parser("demo-seed", help="Seed demo data (idempotent)")
    p.set_defaults(func=demo_seed)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
