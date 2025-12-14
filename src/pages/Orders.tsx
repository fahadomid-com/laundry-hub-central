import { useState } from "react"; // Orders page
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Car,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { OrderDetailsSheet } from "@/components/orders/OrderDetailsSheet";
import { EditOrderDialog } from "@/components/orders/EditOrderDialog";
import { DeleteOrderDialog } from "@/components/orders/DeleteOrderDialog";

export interface Order {
  id: string;
  customer: string;
  phone: string;
  email: string;
  location: string;
  items: number;
  status: "Pending" | "In Progress" | "Ready" | "Completed" | "Cancelled";
  amount: number;
  paidAmount: number;
  createdAt: string;
  dueDate: string;
  notes: string;
  address: string;
  assignedDriver?: string;
}

const initialOrders: Order[] = [
  { id: "ORD-001", customer: "John Doe", phone: "+965 1234 5678", email: "john@email.com", location: "Salmiya", items: 5, status: "In Progress", amount: 45.50, paidAmount: 45.50, createdAt: "Dec 12, 2025", dueDate: "Dec 14, 2025", notes: "Handle with care", address: "Block 5, Salmiya", assignedDriver: "Ahmed Hassan" },
  { id: "ORD-002", customer: "Jane Smith", phone: "+965 2345 6789", email: "jane@email.com", location: "Hawally", items: 8, status: "Completed", amount: 28.75, paidAmount: 28.75, createdAt: "Dec 12, 2025", dueDate: "Dec 13, 2025", notes: "", address: "Block 3, Hawally", assignedDriver: "Mohammed Ali" },
  { id: "ORD-003", customer: "Mike Johnson", phone: "+965 3456 7890", email: "mike@email.com", location: "Kuwait City", items: 3, status: "Pending", amount: 65.00, paidAmount: 0, createdAt: "Dec 11, 2025", dueDate: "Dec 15, 2025", notes: "Shorten pants by 2 inches", address: "Block 1, Kuwait City" },
  { id: "ORD-004", customer: "Sarah Wilson", phone: "+965 4567 8901", email: "sarah@email.com", location: "Farwaniya", items: 12, status: "Ready", amount: 35.25, paidAmount: 35.25, createdAt: "Dec 11, 2025", dueDate: "Dec 12, 2025", notes: "", address: "Block 7, Farwaniya", assignedDriver: "Yusuf Ibrahim" },
  { id: "ORD-005", customer: "Emily Davis", phone: "+965 5678 9012", email: "emily@email.com", location: "Bayan", items: 6, status: "In Progress", amount: 55.50, paidAmount: 30.00, createdAt: "Dec 10, 2025", dueDate: "Dec 13, 2025", notes: "VIP customer", address: "Block 2, Bayan", assignedDriver: "Hassan Nasser" },
  { id: "ORD-006", customer: "Michael Brown", phone: "+965 6789 0123", email: "michael@email.com", location: "Jabriya", items: 10, status: "Pending", amount: 22.00, paidAmount: 0, createdAt: "Dec 10, 2025", dueDate: "Dec 12, 2025", notes: "", address: "Block 4, Jabriya" },
  { id: "ORD-007", customer: "Lisa Anderson", phone: "+965 7890 1234", email: "lisa@email.com", location: "Mishref", items: 15, status: "Completed", amount: 42.00, paidAmount: 42.00, createdAt: "Dec 09, 2025", dueDate: "Dec 11, 2025", notes: "", address: "Block 6, Mishref", assignedDriver: "Khalid Omar" },
  { id: "ORD-008", customer: "David Lee", phone: "+965 8901 2345", email: "david@email.com", location: "Fintas", items: 4, status: "Cancelled", amount: 38.00, paidAmount: 0, createdAt: "Dec 09, 2025", dueDate: "Dec 12, 2025", notes: "Customer cancelled", address: "Block 8, Fintas" },
];

const statusConfig = {
  Pending: { variant: "warning" as const, icon: Clock },
  "In Progress": { variant: "info" as const, icon: Package },
  Ready: { variant: "success" as const, icon: CheckCircle },
  Completed: { variant: "success" as const, icon: CheckCircle },
  Cancelled: { variant: "destructive" as const, icon: XCircle },
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [deleteOrder, setDeleteOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const itemsPerPage = 5;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.phone.includes(search);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(paginatedOrders.map((o) => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const handleBulkStatusChange = (newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (selectedOrders.includes(o.id) ? { ...o, status: newStatus } : o))
    );
    toast({
      title: "Status updated",
      description: `${selectedOrders.length} orders updated to ${newStatus}`,
    });
    setSelectedOrders([]);
  };

  const handleBulkDelete = () => {
    setOrders((prev) => prev.filter((o) => !selectedOrders.includes(o.id)));
    toast({
      title: "Orders deleted",
      description: `${selectedOrders.length} orders have been deleted`,
    });
    setSelectedOrders([]);
  };

  const handleExport = () => {
    toast({ title: "Exporting", description: "Orders data is being exported to CSV" });
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    toast({ title: "Order updated", description: `${updatedOrder.id} has been updated` });
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    toast({ title: "Order deleted", description: `${orderId} has been deleted` });
  };

  const handleStatusChange = (order: Order, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
    );
    toast({ title: "Status updated", description: `${order.id} is now ${newStatus}` });
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    inProgress: orders.filter((o) => o.status === "In Progress").length,
    ready: orders.filter((o) => o.status === "Ready").length,
    completed: orders.filter((o) => o.status === "Completed").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Orders</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and track all laundry orders.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </Card>
          <Card className="p-4 bg-warning/10 border-warning/20">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-warning">{stats.pending}</p>
          </Card>
          <Card className="p-4 bg-info/10 border-info/20">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold text-info">{stats.inProgress}</p>
          </Card>
          <Card className="p-4 bg-success/10 border-success/20">
            <p className="text-sm text-muted-foreground">Ready</p>
            <p className="text-2xl font-bold text-success">{stats.ready}</p>
          </Card>
          <Card className="p-4 bg-primary/10 border-primary/20">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-primary">{stats.completed}</p>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search orders, customers, phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-background">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              {selectedOrders.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Bulk Actions ({selectedOrders.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover">
                    <DropdownMenuItem onClick={() => handleBulkStatusChange("In Progress")}>
                      Mark In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkStatusChange("Ready")}>
                      Mark Ready
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkStatusChange("Completed")}>
                      Mark Completed
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleBulkDelete} className="text-destructive">
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left">
                    <Checkbox
                      checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Items
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Driver Assigned
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedOrders.map((order) => {
                  const statusInfo = statusConfig[order.status];
                  return (
                    <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={(checked) => handleSelectOrder(order.id, !!checked)}
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                        {order.id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">{order.phone}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                        {order.location}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">{order.items}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order, value as Order["status"])}
                        >
                          <SelectTrigger className="h-8 w-32 bg-transparent border-none p-0">
                            <Badge variant={statusInfo.variant}>{order.status}</Badge>
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Ready">Ready</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">KD{order.amount.toFixed(2)}</p>
                          {order.paidAmount < order.amount && (
                            <p className="text-xs text-warning">
                              Paid: KD{order.paidAmount.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                        {order.dueDate}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {order.assignedDriver ? (
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">{order.assignedDriver}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not assigned</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuItem onClick={() => setDetailsOrder(order)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditOrder(order)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Order
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteOrder(order)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      
      <OrderDetailsSheet order={detailsOrder} onClose={() => setDetailsOrder(null)} />
      <EditOrderDialog order={editOrder} onClose={() => setEditOrder(null)} onSubmit={handleUpdateOrder} />
      <DeleteOrderDialog order={deleteOrder} onClose={() => setDeleteOrder(null)} onConfirm={handleDeleteOrder} />
    </DashboardLayout>
  );
}
