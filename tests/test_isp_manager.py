import argparse
import os
import tempfile
import unittest

import isp_manager as app


class ISPManagerTests(unittest.TestCase):
    def setUp(self) -> None:
        tmp = tempfile.NamedTemporaryFile(delete=False)
        self.addCleanup(lambda: os.path.exists(tmp.name) and os.remove(tmp.name))
        os.environ["ISP_DB"] = tmp.name
        app.init_db()

    def test_invoice_status_updates_with_payments(self) -> None:
        app.add_client(argparse.Namespace(name="Test Co", email=None, phone=None, address=None, notes=None))
        app.add_plan(argparse.Namespace(name="Plan", speed=100, price=50.0, description=None))
        app.subscribe(
            argparse.Namespace(
                client_id=1, plan_id=1, status="active", start_date="2026-01-01", end_date=None, notes=None
            )
        )
        app.create_invoice(argparse.Namespace(subscription_id=1, amount=50.0, due_date="2026-02-01", description=None))

        # Partial payment
        app.record_payment(argparse.Namespace(invoice_id=1, amount=25.0, method="card", reference="part1"))
        with app.connect() as conn:
            status = conn.execute("SELECT status FROM invoices WHERE id = 1").fetchone()["status"]
        self.assertEqual(status, "partial")

        # Full payment
        app.record_payment(argparse.Namespace(invoice_id=1, amount=25.0, method="card", reference="part2"))
        with app.connect() as conn:
            status = conn.execute("SELECT status FROM invoices WHERE id = 1").fetchone()["status"]
        self.assertEqual(status, "paid")

    def test_ticket_lifecycle(self) -> None:
        app.add_client(argparse.Namespace(name="Alice", email=None, phone=None, address=None, notes=None))
        app.open_ticket(
            argparse.Namespace(client_id=1, subject="Outage", priority="high", notes="Router down")
        )
        with app.connect() as conn:
            status = conn.execute("SELECT status FROM tickets WHERE id = 1").fetchone()["status"]
        self.assertEqual(status, "open")

        app.close_ticket(argparse.Namespace(ticket_id=1))
        with app.connect() as conn:
            status = conn.execute("SELECT status FROM tickets WHERE id = 1").fetchone()["status"]
        self.assertEqual(status, "closed")


if __name__ == "__main__":
    unittest.main()
