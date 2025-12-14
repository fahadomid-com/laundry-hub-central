import { useState } from "react";
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

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (order: Omit<Order, "id" | "createdAt">) => void;
}

export function CreateOrderDialog({ open, onOpenChange, onSubmit }: CreateOrderDialogProps) {
  const [formData, setFormData] = useState({
    customer: "",
    phone: "",
    email: "",
    location: "",
    items: 1,
    status: "Pending" as Order["status"],
    amount: 0,
    paidAmount: 0,
    dueDate: "",
    notes: "",
    address: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer || !formData.phone || !formData.location) return;

    onSubmit(formData);
    setFormData({
      customer: "",
      phone: "",
      email: "",
      location: "",
      items: 1,
      status: "Pending",
      amount: 0,
      paidAmount: 0,
      dueDate: "",
      notes: "",
      address: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>Add a new laundry order to the system.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Customer Name *</Label>
              <Input
                value={formData.customer}
                onChange={(e) => setFormData((p) => ({ ...p, customer: e.target.value }))}
                placeholder="John Doe"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+965 XXXX XXXX"
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
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                placeholder="john@email.com"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label>Location *</Label>
              <Select
                value={formData.location}
                onValueChange={(v) => setFormData((p) => ({ ...p, location: v }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="Salmiya">Salmiya</SelectItem>
                  <SelectItem value="Hawally">Hawally</SelectItem>
                  <SelectItem value="Kuwait City">Kuwait City</SelectItem>
                  <SelectItem value="Farwaniya">Farwaniya</SelectItem>
                  <SelectItem value="Jabriya">Jabriya</SelectItem>
                  <SelectItem value="Mishref">Mishref</SelectItem>
                  <SelectItem value="Bayan">Bayan</SelectItem>
                  <SelectItem value="Fintas">Fintas</SelectItem>
                  <SelectItem value="Mangaf">Mangaf</SelectItem>
                  <SelectItem value="Mahboula">Mahboula</SelectItem>
                  <SelectItem value="Sabah Al Salem">Sabah Al Salem</SelectItem>
                  <SelectItem value="Rumaithiya">Rumaithiya</SelectItem>
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
                onChange={(e) => setFormData((p) => ({ ...p, items: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Amount (KD)</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                value={formData.amount}
                onChange={(e) => setFormData((p) => ({ ...p, amount: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Paid (KD)</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                value={formData.paidAmount}
                onChange={(e) => setFormData((p) => ({ ...p, paidAmount: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                value={formData.dueDate}
                onChange={(e) => setFormData((p) => ({ ...p, dueDate: e.target.value }))}
                placeholder="Dec 15, 2025"
                maxLength={20}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData((p) => ({ ...p, status: v as Order["status"] }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
              placeholder="Block, Street, Area"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Special instructions..."
              maxLength={500}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
