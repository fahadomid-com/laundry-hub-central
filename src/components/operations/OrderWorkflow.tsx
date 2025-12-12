import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Package, ArrowRight, CheckCircle, Clock, Truck, Sparkles, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  customer: string;
  items: number;
  service: string;
  stage: string;
  priority: "normal" | "express" | "urgent";
  dueDate: string;
}

const initialOrders: Order[] = [
  { id: "ORD-001", customer: "John Doe", items: 5, service: "Dry Cleaning", stage: "received", priority: "normal", dueDate: "Dec 14" },
  { id: "ORD-002", customer: "Jane Smith", items: 8, service: "Wash & Fold", stage: "processing", priority: "express", dueDate: "Dec 13" },
  { id: "ORD-003", customer: "Mike Johnson", items: 3, service: "Alterations", stage: "quality-check", priority: "normal", dueDate: "Dec 15" },
  { id: "ORD-004", customer: "Sarah Wilson", items: 12, service: "Express Wash", stage: "ready", priority: "urgent", dueDate: "Dec 12" },
  { id: "ORD-005", customer: "Emily Davis", items: 6, service: "Dry Cleaning", stage: "received", priority: "express", dueDate: "Dec 13" },
  { id: "ORD-006", customer: "Michael Brown", items: 4, service: "Ironing", stage: "processing", priority: "normal", dueDate: "Dec 14" },
];

const stages = [
  { id: "received", label: "Received", icon: FolderOpen, color: "bg-muted" },
  { id: "processing", label: "Processing", icon: Sparkles, color: "bg-primary/10" },
  { id: "quality-check", label: "Quality Check", icon: CheckCircle, color: "bg-warning/10" },
  { id: "ready", label: "Ready", icon: Package, color: "bg-success/10" },
  { id: "delivered", label: "Delivered", icon: Truck, color: "bg-info/10" },
];

const priorityConfig = {
  normal: { variant: "secondary" as const, label: "Normal" },
  express: { variant: "info" as const, label: "Express" },
  urgent: { variant: "destructive" as const, label: "Urgent" },
};

export function OrderWorkflow() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [targetStage, setTargetStage] = useState("");
  const { toast } = useToast();

  const getOrdersByStage = (stageId: string) => orders.filter((o) => o.stage === stageId);

  const handleMoveOrder = () => {
    if (!selectedOrder || !targetStage) return;

    setOrders((prev) =>
      prev.map((o) => (o.id === selectedOrder.id ? { ...o, stage: targetStage } : o))
    );

    toast({
      title: "Order moved",
      description: `${selectedOrder.id} moved to ${stages.find((s) => s.id === targetStage)?.label}`,
    });

    setMoveDialogOpen(false);
    setSelectedOrder(null);
    setTargetStage("");
  };

  const handleQuickMove = (order: Order, nextStage: string) => {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, stage: nextStage } : o)));
    toast({
      title: "Order updated",
      description: `${order.id} moved to ${stages.find((s) => s.id === nextStage)?.label}`,
    });
  };

  const openMoveDialog = (order: Order) => {
    setSelectedOrder(order);
    setMoveDialogOpen(true);
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stages.map((stage, index) => {
          const StageIcon = stage.icon;
          const stageOrders = getOrdersByStage(stage.id);
          const nextStage = stages[index + 1];

          return (
            <Card key={stage.id} className={`p-4 ${stage.color}`}>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StageIcon className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">{stage.label}</h3>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {stageOrders.length}
                </Badge>
              </div>

              <div className="space-y-2">
                {stageOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-lg border border-border bg-card p-3 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-sm">{order.id}</span>
                      <Badge variant={priorityConfig[order.priority].variant} className="text-xs">
                        {priorityConfig[order.priority].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.items} items • {order.service}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Due: {order.dueDate}
                    </div>
                    <div className="mt-3 flex gap-1">
                      {nextStage && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs flex-1"
                          onClick={() => handleQuickMove(order, nextStage.id)}
                        >
                          <ArrowRight className="mr-1 h-3 w-3" />
                          {nextStage.label}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => openMoveDialog(order)}
                      >
                        Move
                      </Button>
                    </div>
                  </div>
                ))}

                {stageOrders.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border p-4 text-center">
                    <p className="text-xs text-muted-foreground">No orders</p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Move Order</DialogTitle>
            <DialogDescription>
              Move {selectedOrder?.id} to a different stage
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Stage</p>
              <Badge variant="secondary">
                {stages.find((s) => s.id === selectedOrder?.stage)?.label}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Move To</p>
              <Select value={targetStage} onValueChange={setTargetStage}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {stages
                    .filter((s) => s.id !== selectedOrder?.stage)
                    .map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMoveOrder} disabled={!targetStage}>
              Move Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
