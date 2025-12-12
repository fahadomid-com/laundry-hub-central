import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ManageOrdersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const allOrders = [
  { id: "ORD-001", customer: "John Doe", service: "Dry Cleaning", status: "In Progress", amount: "KD45.50", date: "Dec 12, 2025" },
  { id: "ORD-002", customer: "Jane Smith", service: "Wash & Fold", status: "Completed", amount: "KD28.75", date: "Dec 12, 2025" },
  { id: "ORD-003", customer: "Mike Johnson", service: "Alterations", status: "Pending", amount: "KD65.00", date: "Dec 11, 2025" },
  { id: "ORD-004", customer: "Sarah Wilson", service: "Express Wash", status: "In Progress", amount: "KD35.25", date: "Dec 11, 2025" },
  { id: "ORD-005", customer: "Michael Brown", service: "Ironing", status: "Pending", amount: "KD22.00", date: "Dec 10, 2025" },
  { id: "ORD-006", customer: "Emily Davis", service: "Dry Cleaning", status: "Completed", amount: "KD55.50", date: "Dec 10, 2025" },
];

const statusVariantMap = {
  "In Progress": "info",
  "Completed": "success",
  "Pending": "warning",
} as const;

export function ManageOrdersSheet({ open, onOpenChange }: ManageOrdersSheetProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    toast({ title: "Status updated", description: `Order ${orderId} is now ${newStatus}` });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl bg-card overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Manage Orders</SheetTitle>
          <SheetDescription>View and manage all laundry orders</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 bg-background">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{order.id}</span>
                      <Badge variant={statusVariantMap[order.status as keyof typeof statusVariantMap]}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">{order.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{order.amount}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Select onValueChange={(value) => handleStatusChange(order.id, value)}>
                    <SelectTrigger className="h-8 text-xs bg-background">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
