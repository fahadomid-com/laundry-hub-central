import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ManageOrdersSheet } from "./ManageOrdersSheet";
import { AddCustomerDialog } from "./AddCustomerDialog";
import { InvoicingSheet } from "./InvoicingSheet";
import { ExpenseSheet } from "./ExpenseSheet";

export function QuickActions() {
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [invoicingOpen, setInvoicingOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);

  return (
    <>
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setOrdersOpen(true)}
          >
            Manage Orders
          </Button>
          <Button
            className="bg-info text-info-foreground hover:bg-info/90"
            onClick={() => setCustomerOpen(true)}
          >
            Add Customer
          </Button>
          <Button
            className="bg-success text-success-foreground hover:bg-success/90"
            onClick={() => setInvoicingOpen(true)}
          >
            Invoicing & Collection
          </Button>
          <Button
            className="bg-warning text-warning-foreground hover:bg-warning/90"
            onClick={() => setExpenseOpen(true)}
          >
            Expense Management
          </Button>
        </div>
      </div>

      <ManageOrdersSheet open={ordersOpen} onOpenChange={setOrdersOpen} />
      <AddCustomerDialog open={customerOpen} onOpenChange={setCustomerOpen} />
      <InvoicingSheet open={invoicingOpen} onOpenChange={setInvoicingOpen} />
      <ExpenseSheet open={expenseOpen} onOpenChange={setExpenseOpen} />
    </>
  );
}
