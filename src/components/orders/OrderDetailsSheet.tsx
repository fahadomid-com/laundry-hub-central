import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Phone, Mail, MapPin, Calendar, Package, CreditCard, FileText, Car } from "lucide-react";
import type { Order } from "@/pages/Orders";

interface OrderDetailsSheetProps {
  order: Order | null;
  onClose: () => void;
}

const statusConfig = {
  Pending: { variant: "warning" as const },
  "In Progress": { variant: "info" as const },
  Ready: { variant: "success" as const },
  Completed: { variant: "success" as const },
  Cancelled: { variant: "destructive" as const },
};

export function OrderDetailsSheet({ order, onClose }: OrderDetailsSheetProps) {
  if (!order) return null;

  const isPaid = order.paidAmount >= order.amount;
  const balance = order.amount - order.paidAmount;

  return (
    <Sheet open={!!order} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg bg-card overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>{order.id}</SheetTitle>
            <Badge variant={statusConfig[order.status].variant}>{order.status}</Badge>
          </div>
          <SheetDescription>Order details and information</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Customer Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{order.customer}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{order.phone}</span>
              </div>
              {order.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{order.email}</span>
                </div>
              )}
              {order.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{order.address}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Order Details
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>Location: {order.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">Items:</span>
                <span className="font-medium">{order.items}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Created: {order.createdAt}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Due: {order.dueDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span>Driver: {order.assignedDriver || "Not assigned"}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Payment Information
            </h4>
            <div className="rounded-lg border border-border bg-background p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-semibold">KD{order.amount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Paid Amount</span>
                <span className="font-medium text-success">KD{order.paidAmount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-medium">Balance Due</span>
                <span className={`font-bold ${isPaid ? "text-success" : "text-warning"}`}>
                  {isPaid ? "Paid" : `KD${balance.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>

          {order.notes && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Notes
                </h4>
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm">{order.notes}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
