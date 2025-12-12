import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Order } from "@/pages/Orders";

interface EditOrderDialogProps {
  order: Order | null;
  onClose: () => void;
  onSubmit: (order: Order) => void;
}

export function EditOrderDialog({ order, onClose, onSubmit }: EditOrderDialogProps) {
  const [formData, setFormData] = useState<Order | null>(null);

  useEffect(() => {
    setFormData(order);
  }, [order]);

  if (!formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer || !formData.phone || !formData.service) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Order {formData.id}</DialogTitle>
          <DialogDescription>Update order information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Customer Name *</Label>
              <Input
                value={formData.customer}
                onChange={(e) => setFormData((p) => p && { ...p, customer: e.target.value })}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData((p) => p && { ...p, phone: e.target.value })}
                maxLength={20}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((p) => p && { ...p, email: e.target.value })}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label>Service *</Label>
              <Select
                value={formData.service}
                onValueChange={(v) => setFormData((p) => p && { ...p, service: v })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="Dry Cleaning">Dry Cleaning</SelectItem>
                  <SelectItem value="Wash & Fold">Wash & Fold</SelectItem>
                  <SelectItem value="Alterations">Alterations</SelectItem>
                  <SelectItem value="Express Wash">Express Wash</SelectItem>
                  <SelectItem value="Ironing">Ironing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Items</Label>
              <Input
                type="number"
                min={1}
                value={formData.items}
                onChange={(e) => setFormData((p) => p && { ...p, items: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Amount (KD)</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                value={formData.amount}
                onChange={(e) => setFormData((p) => p && { ...p, amount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Paid (KD)</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                value={formData.paidAmount}
                onChange={(e) => setFormData((p) => p && { ...p, paidAmount: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                value={formData.dueDate}
                onChange={(e) => setFormData((p) => p && { ...p, dueDate: e.target.value })}
                maxLength={20}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData((p) => p && { ...p, status: v as Order["status"] })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData((p) => p && { ...p, address: e.target.value })}
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData((p) => p && { ...p, notes: e.target.value })}
              maxLength={500}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
