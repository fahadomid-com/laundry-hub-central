import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Car } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  location: string;
  status: "In Progress" | "Completed" | "Pending";
  amount: string;
  assignedDriver?: string;
}

const orders: Order[] = [
  { id: "ORD-001", customer: "John Doe", location: "Salmiya", status: "In Progress", amount: "KD45.50", assignedDriver: "Ahmed Hassan" },
  { id: "ORD-002", customer: "Jane Smith", location: "Hawally", status: "Completed", amount: "KD28.75", assignedDriver: "Mohammed Ali" },
  { id: "ORD-003", customer: "Mike Johnson", location: "Kuwait City", status: "Pending", amount: "KD65.00" },
  { id: "ORD-004", customer: "Sarah Wilson", location: "Farwaniya", status: "In Progress", amount: "KD35.25", assignedDriver: "Khalid Omar" },
];

const statusVariantMap = {
  "In Progress": "info",
  "Completed": "success",
  "Pending": "warning",
} as const;

export function RecentOrdersTable() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between p-6 pb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
        <Link to="/orders" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View All
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-border">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Driver Assigned
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                  {order.id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                  {order.customer}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                  {order.location}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <Badge variant={statusVariantMap[order.status]}>
                    {order.status}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                  {order.assignedDriver ? (
                    <span className="flex items-center gap-1.5">
                      <Car className="h-3.5 w-3.5" />
                      {order.assignedDriver}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/60">Not assigned</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                  {order.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
